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


The frontend of CareerGenie is built with React and serves as the user interface through which users interact with
 the platform. It provides pages for user authentication, resume creation, AI-powered cover letter and interview question
 generation, job browsing, and managing saved jobs. React Router enables seamless navigation between different pages, while
Axios is used to send HTTP requests to the backend APIs. The frontend performs basic client-side validation, manages application
 state, and dynamically updates the interface based on API responses. Once deployed, the static frontend files are hosted on Amazon
S3 (or Vercel during development) and delivered efficiently through Amazon CloudFront, ensuring fast loading times and high availability.

The backend is developed using Node.js and Express.js and exposes RESTful APIs that handle the application's business logic.
It manages user authentication using JWT, processes requests related to resumes, cover letters, interview questions, and job
 management, and securely communicates with the Google Gemini API to generate AI-powered content. The backend stores and retrieves
application data from Amazon DynamoDB and incorporates AWS services such as SNS, SQS, and EventBridge for asynchronous messaging
 and event-driven workflows where required. When deployed on AWS, the Express application runs as serverless AWS Lambda functions
behind Amazon API Gateway, allowing requests from the frontend to be processed in a scalable, secure, and cost-efficient manner.
The complete infrastructure is provisioned using Terraform, while Jenkins automates the build and deployment process through a CI/CD pipeline.



# AWS Deployment

The AWS deployment workflow of CareerGenie begins when the frontend sends an API request to the backend through Amazon API Gateway. 
API Gateway acts as the single entry point for all client requests, validates and routes them to the appropriate AWS Lambda function.
The Lambda function executes the Express.js backend logic, where user authentication, resume management, AI-powered cover letter generation,
interview question generation, and job-related operations are processed. If AI content is requested, the backend securely communicates with
the Google Gemini API and returns the generated response. For data storage, the backend interacts with Amazon DynamoDB to store and retrieve
user information, resumes, saved jobs, and other application data. For asynchronous tasks and event-driven processing, services such as Amazon 
SNS, Amazon SQS, and Amazon EventBridge are used to publish notifications, queue background tasks, and trigger workflows when specific events occur. 
Throughout the execution, Amazon CloudWatch collects logs and monitoring metrics to help track application performance and troubleshoot issues.

On the frontend side, the React application is built into static files and uploaded to an Amazon S3 bucket configured for static website hosting.
Amazon CloudFront sits in front of the S3 bucket as a Content Delivery Network (CDN), caching and delivering the frontend assets from edge 
locations around the world to reduce latency and improve performance. When a user opens the application, CloudFront serves the React application
from S3, and all API requests are forwarded to API Gateway, which invokes the appropriate Lambda functions. The entire AWS infrastructure, 
including S3, CloudFront, API Gateway, Lambda, DynamoDB, IAM roles, SNS, SQS, EventBridge, and CloudWatch, is provisioned and managed using 
Terraform, ensuring consistent and repeatable deployments. Jenkins automates this workflow by pulling the latest code from GitHub, installing 
dependencies, building the React application, validating the Terraform configuration, provisioning or updating AWS resources, deploying the
Lambda backend, uploading the frontend build to S3, and invalidating the CloudFront cache so users always receive the latest version of the 
application.


