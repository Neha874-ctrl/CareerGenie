<img width="1232" height="1202" alt="diagram-export-7-12-2026-4_16_33-PM" src="https://github.com/user-attachments/assets/d6ad349d-4278-4445-8333-f50c5e590011" />


# 🚀 CareerGenie

> **AI-Powered Career Development Platform** built using the MERN stack, AWS Serverless Architecture, Terraform, and Jenkins CI/CD.

CareerGenie is a full-stack web application designed to help job seekers streamline their job application process. It enables users to create professional resumes, generate personalized cover letters using AI, discover job opportunities, and manage their career journey from a single platform. The application is built with scalability, security, and cloud-native deployment in mind by leveraging AWS Serverless services and Infrastructure as Code (Terraform).

---

# 🌟 Features

* 🔐 Secure User Authentication using JWT
* 👤 User Registration & Login
* 📄 Resume Builder
* ✍️ AI-Powered Cover Letter Generation
* 🤖 AI-Based Interview Question Generation
* 💼 Job Listings & Premium Jobs
* ⭐ Save & Manage Favorite Jobs
* 📊 User Dashboard
* 🔍 Search & Filter Jobs
* ☁️ Fully Serverless Backend on AWS
* 🚀 Automated Infrastructure using Terraform
* 🔄 CI/CD Pipeline using Jenkins

---

# 🏗️ System Architecture


The frontend of CareerGenie is built with React and provides the user interface for authentication, resume creation, AI-generated cover letters and interview questions, job browsing, and saved jobs. It uses React Router for navigation, Axios for API calls, and basic client-side validation and state management. The static frontend is hosted on Amazon S3 and delivered through Amazon CloudFront for fast and reliable access.

The backend is built with Node.js and Express.js and exposes RESTful APIs for authentication, resume handling, AI content generation, and job management. It uses JWT for security, DynamoDB for data storage, and AWS services like SNS, SQS, and EventBridge for background and event-driven tasks. On AWS, the backend runs as Lambda functions behind API Gateway, while Terraform manages infrastructure and Jenkins handles CI/CD deployment.

# AWS Deployment

The AWS deployment workflow of CareerGenie starts when the frontend sends requests through Amazon API Gateway, which routes them to AWS Lambda functions running the Express.js backend. The backend handles authentication, resume management, AI-powered content generation, and job-related operations, while also connecting to Google Gemini API for AI responses and Amazon DynamoDB for data storage. Services like Amazon SNS, SQS, and EventBridge support notifications and background tasks, and Amazon CloudWatch monitors logs and performance.

On the frontend, the React app is built as static files and hosted on Amazon S3, with Amazon CloudFront delivering it as a CDN for faster access. API requests from the frontend go through API Gateway to Lambda. The full AWS setup is managed with Terraform for consistent deployments, while Jenkins automates the process by pulling code from GitHub, building the app, deploying backend and frontend updates, and invalidating the CloudFront cache.

