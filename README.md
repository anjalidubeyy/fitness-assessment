# FAT (Fitness Assessment Tracker)

A full-stack MERN application for tracking fitness assessments and progress.

## Features

- User authentication (signup, login, logout)
- Profile management
- Fitness data tracking
- Contact form with email notifications
- Responsive design

## Tech Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, JWT Authentication
- **Email**: Nodemailer

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for contact form emails)

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   CONTACT_RECEIVER_EMAIL=email_to_receive_contact_form
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with:
   ```
   REACT_APP_API_BASE=http://localhost:5000/api
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage

1. Register a new account or login with existing credentials
2. Complete your profile setup
3. Add fitness data to track your progress
4. View your fitness history on the dashboard
5. Use the contact form to send messages

## Email Setup for Contact Form

To enable the contact form to send emails:

1. Use a Gmail account
2. Enable 2-factor authentication
3. Generate an App Password:
   - Go to Google Account > Security > App Passwords
   - Select "Mail" and your device
   - Use the generated password in your .env file

## License

MIT 