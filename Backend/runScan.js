const { getEC2Instances } = require("./scanners/ec2Scanner");
const { getS3Buckets } = require("./scanners/s3Scanner");
const {
  checkS3Encryption,
  checkRootMFA,
  checkCloudTrail,
  checkSecurityGroups,
  checkS3PublicAccess
} = require("./scanners/cisChecks");


const { saveJSON } = require("./storage/s3Storage");

async function runScan() {

  console.log("starting cloud scan...");

  const ec2 = await getEC2Instances();
  const buckets = await getS3Buckets();

  const cisResults = [
    ...checkS3Encryption(buckets),
    await checkRootMFA(),
    await checkCloudTrail(),
    ...(await checkSecurityGroups()),
    ...(await checkS3PublicAccess(buckets))
  ];

  await saveJSON("ec2-instances.json", ec2);
  await saveJSON("s3-buckets.json", buckets);
  await saveJSON("cis-results.json", cisResults);

  console.log("Scan complete");

  return {
    instances: ec2.length,
    buckets: buckets.length,
    checks: cisResults.length
  };

}

module.exports = { runScan };