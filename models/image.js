const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  chat_id: String,
  image_url: String,
 },
 { timestamps: true }
);

module.exports = mongoose.model('Image', imageSchema);