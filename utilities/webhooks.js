// webhook.js
const { client } = require('./whatsapp-config');
const dotenv = require('dotenv');
const { handleMedia } = require('./hook-utilities/mediaHandler');
const { sendToHook } = require('./hook-utilities/hookSender');
dotenv.config();

client.on('message_create', handleMessageCreate);

async function handleMessageCreate(msg) {
   const media_url = await handleMedia(msg);
   const body = msg._data.body;
   const category = checkCategory(body);

   try {
       await sendToHook(msg._data, media_url, category);
       console.log("hook sent");
   } catch (err) {
       console.error('Error sending hook:', err);
   }
}

function checkCategory(body) {
   const matches = body && body.match(/\[(.*?)\]/g);
   return matches ? matches.map(match => match.slice(1, -1).toLowerCase()) : null;
}

module.exports = client;
