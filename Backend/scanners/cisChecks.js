const { IAMClient, GetAccountSummaryCommand } = require("@aws-sdk/client-iam");
const { CloudTrailClient, DescribeTrailsCommand } = require("@aws-sdk/client-cloudtrail");
const { EC2Client, DescribeSecurityGroupsCommand } = require("@aws-sdk/client-ec2");
const { S3Client, GetPublicAccessBlockCommand } = require("@aws-sdk/client-s3");

const iam = new IAMClient({ region: "ap-south-1" });
const cloudtrail = new CloudTrailClient({ region: "ap-south-1" });
const ec2 = new EC2Client({ region: "ap-south-1" });
const s3 = new S3Client({ region: "ap-south-1" });

/* ---------- S3 ENCRYPTION CHECK ---------- */

function checkS3Encryption(buckets) {

  return buckets.map(b => ({
    check: "S3 Encryption Enabled",
    resource: b.bucketName,
    status: b.encryption === "Enabled" ? "PASS" : "FAIL"
  }));

}

/* ---------- ROOT MFA CHECK ---------- */

async function checkRootMFA() {

  const data = await iam.send(new GetAccountSummaryCommand({}));

  const enabled = data.SummaryMap.AccountMFAEnabled === 1;

  return {
    check: "Root Account MFA Enabled",
    resource: "Account",
    status: enabled ? "PASS" : "FAIL"
  };

}

/* ---------- CLOUDTRAIL CHECK ---------- */

async function checkCloudTrail() {

  const trails = await cloudtrail.send(new DescribeTrailsCommand({}));

  return {
    check: "CloudTrail Enabled",
    resource: "Account",
    status: trails.trailList.length > 0 ? "PASS" : "FAIL"
  };

}

/* ---------- SECURITY GROUP CHECK ---------- */

async function checkSecurityGroups() {

  const data = await ec2.send(new DescribeSecurityGroupsCommand({}));

  const results = [];

  data.SecurityGroups.forEach(group => {

    group.IpPermissions.forEach(permission => {

      const port = permission.FromPort;

      if (port === 22 || port === 3389) {

        permission.IpRanges.forEach(ip => {

          if (ip.CidrIp === "0.0.0.0/0") {

            results.push({
              check: "Security Group SSH/RDP Open to World",
              resource: group.GroupName,
              status: "FAIL"
            });

          }

        });

      }

    });

  });

  if (results.length === 0) {

    results.push({
      check: "Security Group SSH/RDP Open to World",
      resource: "All Security Groups",
      status: "PASS"
    });

  }

  return results;

}

/* ---------- S3 PUBLIC ACCESS CHECK ---------- */

async function checkS3PublicAccess(buckets) {

  const results = [];

  for (const bucket of buckets) {

    try {

      const data = await s3.send(
        new GetPublicAccessBlockCommand({ Bucket: bucket.bucketName })
      );

      const block = data.PublicAccessBlockConfiguration;

      const isSecure =
        block.BlockPublicAcls &&
        block.BlockPublicPolicy &&
        block.IgnorePublicAcls &&
        block.RestrictPublicBuckets;

      results.push({
        check: "S3 Bucket Public Access Blocked",
        resource: bucket.bucketName,
        status: isSecure ? "PASS" : "FAIL"
      });

    } catch {

      results.push({
        check: "S3 Bucket Public Access Blocked",
        resource: bucket.bucketName,
        status: "FAIL"
      });

    }

  }

  return results;

}

module.exports = {
  checkS3Encryption,
  checkRootMFA,
  checkCloudTrail,
  checkSecurityGroups,
  checkS3PublicAccess
};