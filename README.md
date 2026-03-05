# Cloud Posture Scanner

A lightweight cloud security scanner that connects to an AWS account,
discovers resources, evaluates CIS security checks, and visualizes results
through a web dashboard.

## Features

- EC2 instance discovery
- S3 bucket discovery
- CIS security checks
  - Root account MFA enabled
  - CloudTrail enabled
  - Security groups not open to 0.0.0.0/0 for SSH/RDP
  - No public S3 buckets
  - S3 encryption enabled
- REST APIs
- React dashboard
- Scan results stored in Amazon S3

## Architecture

Frontend (React) → Backend (Node.js Express) → AWS APIs → Results stored in S3

scanner/  
   ec2Scanner.js  
   s3Scanner.js  
   cisChecks.js  

storage/  
   s3Storage.js  

api/  
   server.js

## APIs

- GET /instances
- GET /buckets
- GET /cis-results
- POST /scan


## Tech Stack

- Node.js
- Express
- React
- AWS SDK v3
- Amazon S3

## How To Use

- First, Configure with AWS using secret access key and access key id, region etc.
- then headover to ./backend and run
  ```
  node server.js
  ```
- the headover ../fronend/src/ and run
  ```
  npm run dev
  ```
- Now open localhost:5173 and voila!
- You can also click on "Run scan" on the top to run the scan again, in case any changes made to AWS dashboard.

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/b87c1bc8-34ae-4f98-a391-a07852c15fbc" />


## Data Flow to AWS

- The scanner follows this pipeline:
  
  Frontend → Backend API → Scanner → AWS APIs  
                                  ↓  
                           Resource Data  
                                  ↓  
                        CIS Security Checks  
                                  ↓  
                          Results Generated  
                                  ↓  
                         Stored in Amazon S3  
                                  ↓  
                         Backend APIs serve data  
                                  ↓  
                        React dashboard displays

- All scan results are stored in an S3 Bucket as JSON files.
<img width="955" height="613" alt="image" src="https://github.com/user-attachments/assets/7ba39fed-b7bd-4688-b72b-8a483ff817c5" />
