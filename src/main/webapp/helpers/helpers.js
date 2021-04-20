const gc = require('./google-cloud-storage.js');
const bucketName = 'spring21-sps-18.appspot.com';
const bucket = gc.bucket(bucketName);

export const uploadImage = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file;
  const blob = bucket.file(originalname.replace(/ /g, "_"));
  const blobStream = blob.createWriteStream({ resumable: false });
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}` 
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
});
 