const Image = require('../models/image');

class ImageRepository {
 constructor() {
  this.model = Image;
 }

 async save(imageData) {
  const image = new this.model(imageData);
  return image.save();
 }

 async getImage(chatId) {
  return this.model.findOne({ chat_id: chatId });
 }
}

module.exports = new ImageRepository();
