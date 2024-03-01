const router = require('express').Router();
const { client } = require('../../../utilities/whatsapp-config');
let MessageObject = require('./response');
const { redisClient } = require('../../../utilities/redis-config');

const ERROR_MESSAGES = {
  MISSING_FIELDS: { message: 'Missing Fields' },
  INVALID_ID: { message: 'Invalid ID' },
  NAME_NOT_FOUND: { message: 'Name not found' },
};

const STATUS_MESSAGES = {
  MESSAGE_SENT: 'Message Sent',
  MESSAGE_POSTING_FAILED: 'Message Posting Failed',
};

const sendResponse = (res, messageObject) => {
  if (messageObject.isSuccess()) {
    res.status(200).send(messageObject);
  } else {
    const status = messageObject.error ? 400 : 500;
    res.status(status).send(messageObject);
  }
};

const handleError = (res, error) => {
  const { message } = error;
  const messageObject = new MessageObject();
  messageObject.setStatus(message);
  sendResponse(res, messageObject);
};

const validateRequestBody = (req, res, next) => {
  const { message, id } = req.body;
  if (!message || !id) {
    handleError(res, ERROR_MESSAGES.MISSING_FIELDS);
    return;
  }

  // The pattern for id should be either number@c.us for individuals, or number@g.us / number-number@g.us for groups
  const patternCus = /^\d+@c\.us$/;
  const patternGus = /^\d+(-\d+)?@g\.us$/;

  if (!patternCus.test(id) || !patternGus.test(id)) {
    handleError(res, ERROR_MESSAGES.INVALID_ID);
    return;
  }

  next();
};

async function getFromRedis(name, res) {
  const exists = await redisClient.exists(name);

  if (exists === 1) {
    return await redisClient.get(name);
  } else {
    handleError(res, ERROR_MESSAGES.NAME_NOT_FOUND);
  }
}

// Routes
router.post('/', validateRequestBody, (req, res) => {
  const { message, id } = req.body;
  const messageObject = new MessageObject();
  messageObject.setMessage(message);
  messageObject.setId(id);

  try {
    client.sendMessage(id, message);
    messageObject.setSuccess(true);
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_SENT);
    messageObject.setError(null);
    sendResponse(res, messageObject);
  } catch (err) {
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_POSTING_FAILED);
    messageObject.setError(err);
    sendResponse(res, messageObject);
  }
});

router.post('/groups', validateRequestBody, async (req, res) => {
  const { message, id, name } = req.body;
  const from = name ? await getFromRedis(name, res) : id;
  const messageObject = new MessageObject();
  messageObject.setMessage(message);
  messageObject.setGroupId(from);

  try {
    client.sendMessage(from, message);
    messageObject.setSuccess(true);
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_SENT);
    messageObject.setError(null);
    sendResponse(res, messageObject);
  } catch (err) {
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_POSTING_FAILED);
    messageObject.setError(err);
    sendResponse(res, messageObject);
  }
});

module.exports = router;
