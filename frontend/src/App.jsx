import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [instances,setInstances] = useState([]);
  const [buckets,setBuckets] = useState([]);
  const [checks,setChecks] = useState([]);

  const runScan = async () => {

    await axios.post("http://localhost:3000/scan");

    alert("Scan completed");

    window.location.reload();

  };

  useEffect(()=>{

    axios.get("http://localhost:3000/instances")
      .then(res=>setInstances(res.data));

    axios.get("http://localhost:3000/buckets")
      .then(res=>setBuckets(res.data));

    axios.get("http://localhost:3000/cis-results")
      .then(res=>setChecks(res.data));

  },[]);

  return (

    <div style={{padding:"40px", fontFamily:"Arial"}}>

      <h1>Cloud Posture Scanner</h1>

      <button onClick={runScan} style={{marginBottom: "20px"}}>
        Run Scan
      </button>

      {/* EC2 TABLE */}

      <h2>EC2 Instances</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Instance ID</th>
            <th>Type</th>
            <th>Region</th>
            <th>Public IP</th>
            <th>Security Groups</th>
          </tr>
        </thead>

        <tbody>
          {instances.map((i,index)=>(
            <tr key={index}>
              <td>{i.instanceId}</td>
              <td>{i.type}</td>
              <td>{i.region}</td>
              <td>{i.publicIp || "None"}</td>
              <td>{i.securityGroups.join(", ")}</td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* S3 TABLE */}

      <h2 style={{marginTop:"40px"}}>S3 Buckets</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Bucket Name</th>
            <th>Region</th>
            <th>Encryption</th>
            <th>Access</th>
          </tr>
        </thead>

        <tbody>
          {buckets.map((b,index)=>(
            <tr key={index}>
              <td>{b.bucketName}</td>
              <td>{b.region}</td>
              <td>{b.encryption}</td>
              <td>{b.access}</td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* CIS CHECKS */}

      <h2 style={{marginTop:"40px"}}>CIS Checks</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Check</th>
            <th>Resource</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((c,index)=>(
            <tr key={index}>
              <td>{c.check}</td>
              <td>{c.resource}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>

  );

}

export default App;