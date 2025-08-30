Akshaya Patra Services - HRMS Frontend
This directory contains the complete frontend for the Akshaya Patra Services HRMS application. It is a modern Single-Page Application (SPA) built with React and Vite.

Features
Role-Based UI: Separate, tailored interfaces for Candidates, HR staff, Admins, and Super Admins.

Dynamic Dashboards: Visualizations and key metrics for different user roles.

Candidate Management: A comprehensive interface for viewing candidate details, logging calls, sending emails, and managing their status in the hiring pipeline.

Real-time Activity Feed: A live-updating panel for Super Admins to monitor user activity.

Responsive Design: Built with Tailwind CSS for a seamless experience on both desktop and mobile devices.

Project Setup
Prerequisites
Node.js (v18.x or later recommended)

Git

Installation & Setup
Navigate to the frontend directory:

cd akshya-patra-services/frontend

Install dependencies:

npm install

Create the environment file:

Make a copy of the .env.example file and name it .env.

Open the new .env file and fill in the required variables:

VITE_API_BASE_URL: The full URL to the running backend server's API (e.g., http://localhost:5000/api).

VITE_PUSHER_KEY: Your public Pusher key.

VITE_PUSHER_CLUSTER: Your Pusher cluster (e.g., ap2).

Running the Frontend
The development server is managed by Vite and includes Hot Module Replacement (HMR) for a fast and efficient development experience.

Run the development server:

npm run dev

Once running, the application will typically be available at http://localhost:3000 (or the next available port). The server will automatically reload as you make changes to the code.
