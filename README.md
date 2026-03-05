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