const { runScan } = require("./runScan");
const express = require("express");
const cors = require("cors");

const { readJSON } = require("./storage/s3Storage");

const app = express();
app.use(cors());

app.get("/instances", async (req,res)=>{
  res.json(await readJSON("ec2-instances.json"));
});

app.get("/buckets", async (req,res)=>{
  res.json(await readJSON("s3-buckets.json"));
});

app.get("/cis-results", async (req,res)=>{
  res.json(await readJSON("cis-results.json"));
});

app.listen(3000,()=>{
  console.log("Server running on port 3000");
});

app.post("/scan", async (req,res)=>{
    try {
        const result = await runScan();
        
        res.json({
            message: "scan completed successfully",
            result
        });

    }   catch (err) {
            console.error(err);

            res.status(500).json({
                error: "scan failed"
            });
    }
});