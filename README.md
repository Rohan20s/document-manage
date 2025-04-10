# Document Management System

A modern web application for managing documents with features like OTP-based authentication, file upload, search, and download capabilities.

## Features

- OTP-based authentication using phone number
- Document upload with metadata (date, category, tags)
- Advanced document search with multiple filters
- Document preview and download functionality
- Bulk download as ZIP
- Admin interface for user creation
- Responsive design using Tailwind CSS

## Tech Stack

- React.js
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication
- React Dropzone for file uploads
- React Datepicker for date selection
- JSZip for bulk downloads
- React Hot Toast for notifications

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API endpoint (configure in .env file)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd document-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   REACT_APP_API_BASE_URL=http://your-api-endpoint
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open http://localhost:3000 in your browser

## Project Structure

```
src/
  ├── components/
  │   ├── auth/
  │   │   └── OTPLogin.js
  │   ├── admin/
  │   │   └── CreateUser.js
  │   └── documents/
  │       ├── FileUpload.js
  │       └── DocumentSearch.js
  ├── context/
  │   └── AuthContext.js
  ├── services/
  │   └── api.js
  ├── App.js
  └── index.js
```

## API Endpoints

The application expects the following API endpoints:

### Authentication
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- POST /api/auth/create-user

### Documents
- POST /api/documents/upload
- GET /api/documents/search
- GET /api/documents/:id
- GET /api/documents/:id/download
- GET /api/documents/tags
- GET /api/documents/categories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
