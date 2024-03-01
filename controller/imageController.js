const imageRepository = require('../repositories/imageRepository');

const saveImage = async (imageData) => {
    const image = await imageRepository.save(imageData);
    return image;
   };
   

const getImage = async (req, res) => {
 const chatId = req.params.chatId;

 try {
  const image = await imageRepository.getImage(chatId);
  res.status(200).send(image);
 } catch (error) {
  res.status(400).send(error);
 }
};

module.exports = {
 saveImage,
 getImage
};
