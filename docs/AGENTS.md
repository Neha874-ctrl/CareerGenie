# Agent Prompt Tracking System (Notion Integration)

This document defines the schema, guidelines, and integration specifications for logging all AI prompts generated, tested, and utilized during the development and runtime of the **CareerGenie** application. 

To maintain transparency, optimize prompt engineering, and ensure continuous evaluation, all prompts must be recorded in a dedicated Notion database.

---

## 📊 Notion Database Schema

The Notion database must follow this exact structure to store and evaluate prompts.

| Property Name | Property Type | Description | Allowed Values / Format |
| :--- | :--- | :--- | :--- |
| **Name** | Title | A unique identifier or short descriptive title for the prompt. | e.g., `Resume Analysis V1`, `Notion Sync Instruction` |
| **Prompt** | Rich Text | The exact text of the system or user prompt sent to the LLM. | Markdown / Plain text |
| **Prompt Quality** | Select | An evaluation of the prompt's effectiveness and reliability. | `🟢 Excellent`, `🟡 Good`, `🟠 Fair`, `🔴 Poor` |
| **Suggestion** | Rich Text | Actionable feedback, optimizations, or suggestions for improving the prompt. | Text describing improvements or refactoring notes |
| **Agent / Component** | Multi-Select | The specific agent or application module that uses this prompt. | `Resume Builder`, `Job Matcher`, `Notion Sync Agent`, `System Developer` |
| **Date Logged** | Date | The date and time when the prompt was logged or modified. | ISO 8601 Timestamp |
| **Cost / Tokens** | Number | Estimated token count or cost if tracking is available. | Integer (e.g., `1240` tokens) |

---

## ⚙️ How to Set Up the Notion Database

To set up this database in your Notion workspace:

1. **Create a New Database**: 
   - Create a new page in Notion.
   - Type `/database` and select **Database - Full page** or **Database - Inline**.
   - Title the database: `CareerGenie Prompt Registry`.

2. **Configure Columns**:
   - Rename the default **Name** column to `Name`.
   - Add a new **Text** property named `Prompt`.
   - Add a new **Select** property named `Prompt Quality` with options:
     - `🟢 Excellent`
     - `🟡 Good`
     - `🟠 Fair`
     - `🔴 Poor`
   - Add a new **Text** property named `Suggestion`.
   - Add a **Multi-Select** property named `Agent / Component`.
   - Add a **Date** property named `Date Logged`.

3. **Connect to Your Notion Integration**:
   - Go to [Notion Developers - My Integrations](https://www.notion.so/my-integrations) and create a new integration.
   - Copy the **Internal Integration Token** (will be configured as `NOTION_API_KEY` in the application).
   - Go to your Notion Database page, click the three dots (`...`) in the top right, select **Add connections** (or **Connections**), and share the page with your newly created integration.

---

## 🔌 API Payload Specification

When programmatically pushing prompts to the Notion API, use the following payload structure for `POST https://api.notion.com/v1/pages`:

```json
{
  "parent": { "database_id": "3980a9dd-c6e4-8078-a29b-fa33d457a070" },
  "properties": {
    "Name": {
      "title": [
        {
          "text": {
            "content": "Resume Feedback Generator"
          }
        }
      ]
    },
    "Prompt": {
      "rich_text": [
        {
          "text": {
            "content": "You are a professional career coach. Review this resume..."
          }
        }
      ]
    },
    "Prompt Quality": {
      "select": {
        "name": "🟡 Good"
      }
    },
    "Suggestion": {
      "rich_text": [
        {
          "text": {
            "content": "Consider adding specific constraints on length and bullet point formats to improve structure."
          }
        }
      ]
    },
    "Agent / Component": {
      "multi_select": [
        { "name": "Resume Builder" }
      ]
    },
    "Date Logged": {
      "date": {
        "start": "2026-07-09T11:29:54.000Z"
      }
    }
  }
}
```

---

## 🛠️ Developer & Agent Logging Guidelines

To maintain database cleanliness:
1. **Before pushing code**: Log any new system prompts or key LLM instructions into the registry.
2. **Reviewing prompts**: Periodically review prompts rated `🟠 Fair` or `🔴 Poor` and apply the comments in the `Suggestion` column to refine code-level prompts.
3. **Automated Logging (Optional)**: If the backend supports automatic telemetry, capture run-time prompt variations and log them with `System Developer` or `Runtime Auto-Log` tags.


# Admin Login

The admin has a separate login page.

### Authentication

- Admin Email
- Password
- Role-based authorization (`role = "admin"`)

Only users with the `admin` role can access:

```
/admin/*
```

---

# Admin Dashboard

This is the first page after login.

## Dashboard Cards

Display platform statistics such as:

```
Total Users

Total Resumes Uploaded

Jobs Recommended Today

AI Analyses Completed

Average ATS Score

Active Users

New Registrations Today

Feedback Received
```

These values are fetched from MongoDB.

---

# User Management

The admin can view all registered users.

### Information

- Name
- Email
- College
- Skills
- Resume Uploaded?
- Registration Date
- Status (Active/Blocked)

### Features

- Search user
- Sort users
- Filter users
- View profile
- Block user
- Unblock user
- Delete account

---

# Resume Management

The admin can inspect uploaded resumes.

### Display

- Student Name
- Resume File
- Upload Date
- ATS Score
- Resume Status

### Features

- View resume
- Download resume
- Delete resume
- Re-run AI analysis
- Flag inappropriate content

---

# AI Analysis Monitoring

Monitor how Gemini analyzes resumes.

Display:

```
Student

Skills Extracted

Weak Skills

Strong Skills

Recommended Roles

ATS Score

Feedback Generated
```

If analysis fails, allow the admin to retry it.

---

# Job Recommendation Management

Track job recommendations.

Display:

```
User

Search Query

Jobs Recommended

Date

Status
```

The admin can refresh job recommendations if needed.

---

# Analytics Dashboard

Charts showing platform usage.

Examples:

### Pie Chart

```
Students by Branch

CSE

IT

ECE

EEE
```

### Line Chart

```
New Registrations

Monday

Tuesday

Wednesday
```

### Bar Chart

```
Most Popular Skills

React

Python

AWS

Java

Node
```

### ATS Distribution

```
90-100

80-90

70-80

Below 70
```

---

# Feedback Management

Users can submit feedback.

The admin can:

- Read feedback
- Reply (optional)
- Mark as resolved
- Delete spam

---

# Reports

Generate reports such as:

- Total users
- Resume uploads
- Job searches
- ATS score averages
- Monthly activity

Export as:

- PDF
- Excel
- CSV

---

# Notifications

Send announcements to all users.

Examples:

```
New AI features available.

Campus placements updated.

Resume workshop this Friday.

Server maintenance tonight.
```

Store notifications in MongoDB.

---

# Blog Management (Optional)

If you include career blogs, the admin can:

- Create blog posts
- Edit posts
- Delete posts
- Upload images
- Publish or unpublish

---

# FAQ Management (Optional)

Manage common questions.

```
How to improve ATS score?

How to upload resume?

How to apply for jobs?
```

The admin can add, edit, or remove FAQs.

---

# Contact Queries

If users contact support:

Display:

```
Name

Email

Subject

Message

Status
```

The admin can mark queries as resolved.

---

# System Settings

Control application settings.

Examples:

- Gemini API model
- Maximum resume upload size
- Allowed file types
- Enable/disable registrations
- Maintenance mode

---

# Admin Profile

The admin can:

- Update profile
- Change password
- Upload profile picture
- View login history

---

# Suggested Admin UI Pages

1. Admin Login
2. Dashboard
3. User Management
4. Resume Management
5. AI Analysis
6. Job Recommendations
7. Analytics
8. Feedback
9. Notifications
10. Reports
11. Blog Management (optional)
12. FAQ Management (optional)
13. Contact Queries
14. Settings
15. Profile

---

# Backend APIs

```
POST   /admin/login

GET    /admin/dashboard

GET    /admin/users
GET    /admin/user/:id
PATCH  /admin/user/block/:id
PATCH  /admin/user/unblock/:id
DELETE /admin/user/:id

GET    /admin/resumes
GET    /admin/resume/:id
DELETE /admin/resume/:id
POST   /admin/resume/reanalyze/:id

GET    /admin/jobs
POST   /admin/jobs/refresh/:id

GET    /admin/analytics

GET    /admin/feedback
PATCH  /admin/feedback/:id
DELETE /admin/feedback/:id

GET    /admin/reports
POST   /admin/reports/export

POST   /admin/notifications
GET    /admin/notifications

GET    /admin/contact
PATCH  /admin/contact/:id

GET    /admin/settings
PUT    /admin/settings

GET    /admin/profile
PUT    /admin/profile
```

---

#