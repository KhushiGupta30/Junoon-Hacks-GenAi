const { Storage } = require("@google-cloud/storage");

const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const storage = new Storage({ credentials });
const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
  console.error("GCS_BUCKET_NAME environment variable is not set.");
}

const bucket = storage.bucket(bucketName);

module.exports = { bucket, storage };
