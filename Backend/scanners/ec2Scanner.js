const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");

const ec2 = new EC2Client({ region: "ap-south-1" });

async function getEC2Instances() {

  const response = await ec2.send(new DescribeInstancesCommand({}));

  const instances = [];

  response.Reservations.forEach(res => {

    res.Instances.forEach(i => {

      instances.push({
        instanceId: i.InstanceId,
        type: i.InstanceType,
        region: "ap-south-1",
        publicIp: i.PublicIpAddress || null,
        securityGroups: i.SecurityGroups.map(s => s.GroupName)
      });

    });

  });

  return instances;
}

module.exports = { getEC2Instances };