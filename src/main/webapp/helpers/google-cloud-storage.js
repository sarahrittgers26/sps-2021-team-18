const GoogleCloudStorage = require('@google-cloud/storage');

const GOOGLE_CLOUD_PROJECT_ID = 'spring21-sps-18';
const GOOGLE_CLOUD_KEYFILE = '../../../spring21-sps-18-38c4db8c1fec.json';

const storage = GoogleCloudStorage({
  projectId: GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: GOOGLE_CLOUD_KEYFILE,
});

module.exports = storage
