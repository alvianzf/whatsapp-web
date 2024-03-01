// hookSender.js
const axios = require('axios');
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function sendToHook(msg, media_url, category) {
   const payload = createPayload(msg, category, media_url);

   try {
       await axios.post(WEBHOOK_URL, payload, {
           "Content-Type": "application/json"
       });

       if (category) {
           await sendToCategory(payload, category);
       }
   } catch (err) {
       console.error('Error sending to hook:', err);
   }
}

function createPayload(msg, category, media_url) {
   return {
       message: msg.body,
       from: msg.from.includes('@g.us') ? msg.author : msg.from,
       to: msg.to,
       is_group: msg.id.remote.includes('@g.us'),
       chat_id: msg.id.remote,
       message_id: msg.id.id,
       timestamp: msg.t,
       media_url,
       category
   };
}

async function sendToCategory(payload, category) {
   payload.message = payload.message.replace(/\[.*?\]/g, "").trim();

   const requests = category.map(item =>
       axios.post(`${WEBHOOK_URL}/${item}`, payload, {
           "Content-Type": "application/json"
       })
   );

   try {
       const responses = await Promise.all(requests);
       responses.forEach(response => console.log(response.status));
   } catch (err) {
       console.error('Error sending to category:', err);
   }
}

module.exports = {
   sendToHook,
   sendToCategory
};
