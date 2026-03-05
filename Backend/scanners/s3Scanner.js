const {
  S3Client,
  ListBucketsCommand,
  GetBucketEncryptionCommand,
  GetBucketLocationCommand,
  GetPublicAccessBlockCommand
} = require("@aws-sdk/client-s3");

const s3 = new S3Client({ region: "ap-south-1" });

async function getS3Buckets() {

  const response = await s3.send(new ListBucketsCommand({}));

  const buckets = [];

  for (const b of response.Buckets) {

    const name = b.Name;

    let encryption = "Disabled";
    let region = "Unknown";
    let access = "Public";

    /* -------- REGION -------- */

    try {

      const location = await s3.send(
        new GetBucketLocationCommand({ Bucket: name })
      );

      region = location.LocationConstraint || "us-east-1";

    } catch {}

    /* -------- ENCRYPTION -------- */

    try {

      await s3.send(
        new GetBucketEncryptionCommand({ Bucket: name })
      );

      encryption = "Enabled";

    } catch {}

    /* -------- PUBLIC ACCESS -------- */

    try {

      const publicBlock = await s3.send(
        new GetPublicAccessBlockCommand({ Bucket: name })
      );

      const block = publicBlock.PublicAccessBlockConfiguration;

      const isPrivate =
        block.BlockPublicAcls &&
        block.BlockPublicPolicy &&
        block.IgnorePublicAcls &&
        block.RestrictPublicBuckets;

      access = isPrivate ? "Private" : "Public";

    } catch {

      access = "Public";

    }

    buckets.push({
      bucketName: name,
      region,
      encryption,
      access
    });

  }

  return buckets;

}

module.exports = { getS3Buckets };