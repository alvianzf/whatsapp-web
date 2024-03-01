// mediaDataHandler.js
const { redisImage } = require('../redis-config');
const imageController = require('../../controller/imageController');

async function handleMediaData(id, filename) {
   const toSave = {
       chat_id: id,
       image_url: 'uploads/' + filename,
   }

   await imageController.saveImage(toSave);
   await redisImage.set(id, filename);
}

module.exports = {
   handleMediaData
};
