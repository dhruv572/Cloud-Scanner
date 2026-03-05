const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "ap-south-1" });

const BUCKET = "dhruv-visiblaze-cs-results";

async function saveJSON(key, data) {

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json"
  }));

}

async function readJSON(key) {

  const obj = await s3.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  }));

  const body = await obj.Body.transformToString();

  return JSON.parse(body);
}

module.exports = { saveJSON, readJSON };