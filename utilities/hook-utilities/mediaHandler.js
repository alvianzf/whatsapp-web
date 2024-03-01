const fs = require('fs');
const { handleMediaData } = require('./mediaDataHandler');

function getFileExtension(filename) {
   const extension = filename.split('/').pop();

   if (extension === 'jpeg')
       return 'jpg';

   return extension;
} 

async function handleMedia(msg) {
   if (!msg.hasMedia)
       return null;

   try {
       const { id } = msg._data.id
       const media = await msg.downloadMedia();
   
       const extension = getFileExtension(media.mimetype);
       const filename = id + '.' + extension;

       fs.writeFile(
           "./upload/" + filename,
           media.data,
           "base64",
           function (err) {
               if (err) {
                  console.log(err);
               }
           }
       );

       await handleMediaData(id, filename);

       return 'upload/' + filename;

   } catch(error) {
       console.log(error);
       return null;
   }
}

module.exports = {
   handleMedia,
   getFileExtension
};
