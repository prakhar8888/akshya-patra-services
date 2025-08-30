Akshaya Patra Services - HRMS Backend
This directory contains the complete backend server for the Akshaya Patra Services HRMS application. It is a Node.js application built with the Express.js framework, and it uses MongoDB as its database.

Features
RESTful API: Provides a complete set of endpoints for managing users, candidates, jobs, reports, and more.

Authentication: Secure JWT-based authentication with local (email/password) and Google OAuth strategies.

Role-Based Access Control (RBAC): Granular permissions for Super Admin, Admin, HR Manager, and Recruiter roles.

Resume Parsing: Service to automatically extract information from uploaded resumes.

Real-time Updates: Pusher integration for live activity monitoring.

Project Setup
Prerequisites
Node.js (v18.x or later recommended)

MongoDB (or a MongoDB Atlas cloud instance)

Git

Installation & Setup
Clone the repository:

git clone <your-repository-url>
cd akshya-patra-services/backend

Install dependencies:

npm install

Create the environment file:

Make a copy of the .env.example file and name it .env.

Open the new .env file and fill in all the required variables:

PORT: The port the server will run on (e.g., 5000).

MONGO_URI: Your MongoDB connection string.

JWT_SECRET: A long, random, and secret string for signing tokens.

GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET: Your credentials from the Google Cloud Console.

SMTP_*: Credentials for your email sending service (e.g., Mailtrap, SendGrid).

PUSHER_*: Your credentials from your Pusher account.

Running the Server
You can run the server in two modes:

Development Mode: This will use nodemon to automatically restart the server whenever you make changes to the code.

npm run dev

Production Mode: This will run the server using Node.

npm start

Once running, the API will be available at http://localhost:5000 (or whichever port you specified in your .env file).
