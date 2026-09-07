# SarahaApp

## What Is SaraApp?

SaraApp is a Node.js REST API for an anonymous messaging platform. It allows users to create and verify accounts, share their profiles, receive anonymous messages, and manage their account information and media.

The application is built with Express and MongoDB. It provides authentication with JWT, email OTP verification, Google login support, profile management, message management, and image uploads using local storage or Cloudinary.

## Key Features

### Authentication and account management
- Email confirmation using a one-time password (OTP).
- Resend email-confirmation OTPs.
- Login with access and refresh JWT tokens.
- Password reset through an email OTP.
- Change password for authenticated users.
- Google social login using Google ID-token verification.
- Update email after confirming the old and new email addresses.
- Soft-delete and restore user accounts.
- Permanent account deletion.

### User profiles

- View a public user profile by ID.
- Generate a shareable profile link.
- Update name, age, and phone number.
- Upload a profile image.
- Upload multiple cover images.
- Encrypt phone numbers before storing them.
- Hash passwords before storing them.

### Anonymous messaging

- Send anonymous messages to users.
- Send messages with an optional sender.
- View all messages received by the authenticated user.
- View one message by ID.
- Delete received messages.
- View messages associated with a public user profile.

### Security and API protection

- JWT authentication middleware.
- Role-based authorization for administrative actions.
- Joi validation for request data.
- Helmet security headers.
- CORS support.
- Rate limiting by IP address.
- Morgan request logging.
- Centralized error handling.
- Static file serving for local uploads.

## Tech Stack

| Technology | Function in the project |
| --- | --- |
| Node.js | Runs the server-side JavaScript application |
| Express 5 | Creates the REST API, routes, and middleware pipeline |
| MongoDB | Stores users and messages |
| Mongoose | Defines MongoDB schemas and performs database operations |
| JWT (`jsonwebtoken`) | Creates and verifies access and refresh tokens |
| bcrypt | Hashes passwords and OTP values |
| Joi | Validates request bodies and parameters |
| Multer | Handles multipart form-data and image uploads |
| Cloudinary | Stores profile and cover images in the cloud |
| Nodemailer | Sends account-confirmation and password-reset emails |
| Google Auth Library | Verifies Google ID tokens for social login |
| CryptoJS | Encrypts and decrypts phone numbers |
| Nanoid | Generates numeric OTP codes |
| Helmet | Adds security-related HTTP headers |
| CORS | Enables cross-origin API requests |
| Morgan | Logs HTTP requests |


## Installation and Usage

### Requirements

- Node.js 20 or newer is recommended.
- MongoDB Atlas .
- Gmail SMTP credentials for email features.
- Cloudinary credentials for cloud image uploads.

## Notes

- SaraApp is currently a backend API; a frontend client is not included in this repository.
- Gmail email delivery requires valid SMTP credentials, preferably an app password.
- Cloudinary features require valid Cloudinary configuration.
- Only confirmed and non-deleted users can access protected endpoints.
