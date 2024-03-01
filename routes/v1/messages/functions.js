const { client } = require('../../../utilities/whatsapp-config');
let MessageObject = require('./response');
const { redisClient } = require('../../../utilities/redis-config');

const ERROR_MESSAGES = {
  MISSING_FIELDS: 'Missing Fields',
  INVALID_ID: 'Invalid ID'
};

const STATUS_MESSAGES = {
  MESSAGE_SENT: 'Message Sent',
  MESSAGE_POSTING_FAILED: 'Message Posting Failed',
  NAME_NOT_FOUND: 'Name not found'
};

const sendResponse = (res, status, messageObject) => {
  res.status(status).send(messageObject);
};

const handleError = (res, status, errorMessage, error) => {
  const messageObject = { status: errorMessage, error };
  sendResponse(res, status, messageObject);
};

const validateRequestBody = (req, res, next) => {
  const { message, id } = req.body;
  if (!message || !id) {
    handleError(res, 400, ERROR_MESSAGES.MISSING_FIELDS);
    return;
  }

  // The pattern for id should be either number@c.us for individuals, or number@g.us / number-number@g.us for groups
  const patternCus = /^\d+@c\.us$/;
  const patternGus = /^\d+(-\d+)?@g\.us$/;

  if (!patternCus.test(id) && !patternGus.test(id)) {
    handleError(res, 400, ERROR_MESSAGES.INVALID_ID);
    return;
  }

  next();
};

async function getFromRedis(name, res) {
  const exists = await redisClient.exists(name);

  if (exists === 1) {
    return await redisClient.get(name);
  } else {
    handleError(res, 500, STATUS_MESSAGES.NAME_NOT_FOUND, {});
  }
}

const handlePostRequest = (req, res) => {
  const { message, id } = req.body;
  const messageObject = new MessageObject();
  messageObject.setMessage(message);
  messageObject.setId(id);

  try {
    client.sendMessage(id, message);
    messageObject.setSuccess(true);
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_SENT);
    messageObject.setError(null);
    sendResponse(res, 200, messageObject);
  } catch (err) {
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_POSTING_FAILED);
    messageObject.setError(err);
    sendResponse(res, 400, messageObject);
  }
};

const handleGroupPostRequest = async (req, res) => {
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
    sendResponse(res, 200, messageObject);
  } catch (err) {
    messageObject.setStatus(STATUS_MESSAGES.MESSAGE_POSTING_FAILED);
    messageObject.setError(err);
    sendResponse(res, 500, messageObject);
  }
};

module.exports = {
  validateRequestBody,
  handlePostRequest,
  handleGroupPostRequest
};
