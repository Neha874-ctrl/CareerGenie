## CareerGenie – Smart Resume Analyzer & Job Matcher

📔Guidelines for CareerGenie - smart resume analyzer & job matcher

This project is a career guidance platform designed for students to optimize their job and internship opportunities. The system allows students to upload resumes, which are analyzed using AI (via a basic ML model or third-party APIs such as GPT or Resume.io). Based on resume content, the platform provides actionable feedback and

suggests job or internship postings that best align with the student’s skills and goals.

The system streamlines the job search experience on campus, akin to platforms like

LinkedIn or Internshala.

## 💡 Core Features

- Resume Upload & Parsing – Students upload resumes in PDF format for parsing and analysis.

- AI-Powered Resume Feedback – Instant resume improvement suggestions using ML/NLP models or external APIs.

- Job Matching Algorithm – Matches resumes to job or internship postings using keyword and profile similarity scoring.

- Job/Internship Posting – Companies and faculty coordinators can post job and internship opportunities.

- Application Tracking – Students can track the jobs/internships they applied for through the dashboard.


● Role-Based Dashboards – Tailored views for students, company recruiters, and administrators. ● Notification System – Automated email or in-platform notifications about matched jobs or deadlines.

● Admin Tools – Manage users, moderate job postings, and view analytics.

## 🎭 Actors and Roles

## 🧑🎓 Student

Students can upload their resume, receive feedback, view personalized job matches,

and apply for listed roles.

## 🏢 Recruiter/Faculty Coordinator

Recruiters or faculty coordinators can post job/internship opportunities, monitor

applications, and view candidate insights.

## 🪪 Admin

Admins manage the platform by approving job postings, handling user issues, and

analyzing usage metrics.

## 🛠️Tools and Technologies to be used

## Layer Technologies

React.js, TailwindCSS

State Management

Backend

Database

Authentication

Frontend

Redux / Context API

Node.js, Express.js

MongoDB or PostgreSQL

JWT + Bcrypt


Resume Analysis

Python NLP Model / External API

Vercel (Frontend), Render/Heroku (Backend)

## 📄 Required Web Pages and Features

## Landing Page (/)

The homepage offers an overview of the platform's purpose and benefits. It includes action buttons to sign in or register, and displays featured job openings and resume tips.

## Authentication Pages (/signup, /login)

Separate pages for signing up and logging in with secure session handling. User access is controlled based on roles like student, recruiter, or administrator.

## Dashboard (Student) (/dashboard/student)

Students can see resume analysis results, job matches, and saved applications. A simple interface helps track previous uploads and edit their profile.

## Dashboard (Recruiter/Coordinator) (/dashboard/recruiter)

Recruiters or faculty can create job posts, view applicants, and review AI resume match insights. They can also message students and update job status.

## Resume Upload & Analysis Page (/resume)

Students upload resumes for parsing and feedback. Shows improvement suggestions with download option for feedback reports.

## Job Listing Page (/jobs)

This page displays all job and internship opportunities. Filters help sort by skills, roles, or deadlines, with each listing showing a match percentage.


## Job Details Page (/jobs/:id)

Contains full job information including description, requirements, and deadlines. Students can view compatibility hints and apply directly.

## Application Tracker (/applications)

Enables students to monitor where they've applied and see the current status. Updates may include acceptance, rejection, or next steps.

## Admin Panel (/admin)

Admins manage user roles, approve job listings, and respond to complaints. They also access platform usage data and activity summaries.

## 🚩 Project Learning Objectives

- Build an AI-integrated resume analysis feature

- Design a job-matching system using keyword extraction and scoring

- Practice full-stack development with secure authentication

- Implement user role-based access and personalized dashboards

- Learn NLP fundamentals for resume parsing and feedback

- Deploy a scalable web app mimicking real-world career platforms


