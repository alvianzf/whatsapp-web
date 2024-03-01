const express = require('express');
const router = express.Router();
const { validateRequestBody, handlePostRequest, handleGroupPostRequest } = require('./functions');

// Routes
router.post('/', validateRequestBody, handlePostRequest);

router.post('/groups', validateRequestBody, handleGroupPostRequest);

module.exports = router;
