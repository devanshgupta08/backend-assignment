Here is a full-length detailed documentation in Markdown format that you can copy and paste directly into your `README.md` on GitHub:

```markdown
# Backend Assignment API Documentation

## Overview

This is the backend API for managing announcements and events. The API provides secure routes for users with different roles (Admin and Super Admin) to create, edit, delete, and view announcements and events. The backend is built using Express.js, with JWT-based authentication and MongoDB for data storage.

## Table of Contents
- [Authentication](#authentication)
  - [Register](#post-register)
  - [Login](#post-login)
  - [Login 2FA](#post-login-2fa)
  - [Verify OTP](#post-verify-otp)
  - [Logout](#post-logout)
- [Announcements](#announcements)
  - [Create Announcement](#post-create-announcement)
  - [Edit Announcement](#put-edit-announcement)
  - [Delete Announcement](#delete-announcement)
  - [Get Announcements](#get-announcement)
- [Events](#events)
  - [Create Event](#post-create-event)
  - [Edit Event](#put-edit-event)
  - [Delete Event](#delete-event)
  - [Get Events](#get-events)

---

## Authentication

### POST Register
**URL**: `/api/v1/users/register`

Registers a new user in the system.

**Request Body**:
```json
{
    "email": "superadmin@iiitkota.ac.in",
    "role": "superAdmin",
    "password": "superAdmin@iiit123"
}
```

| Field     | Type   | Required | Description                 |
|-----------|--------|----------|-----------------------------|
| email     | string | Yes      | The email of the user.       |
| role      | string | Yes      | The role (`admin`, `superAdmin`). |
| password  | string | Yes      | The password of the user.    |

**Response**:
- `201 Created`: User registered successfully.
- `400 Bad Request`: Invalid input data.

### POST Login
**URL**: `/api/v1/users/login`

Logs in a user by generating JWT tokens, which are stored in cookies and returned in the response headers.

**Request Body**:
```json
{
    "email": "admin@iiitkota.ac.in",
    "password": "Admin@iiit123"
}
```

**Response**:
- `200 OK`: Login successful, JWT tokens are set in cookies (`accessToken` and `refreshToken`).
- `400 Bad Request`: Invalid credentials.

### POST Login 2FA
**URL**: `/api/v1/users/login-2fa`

Logs in a user and sends a one-time password (OTP) to their email as part of two-factor authentication.

**Request Body**:
```json
{
    "email": "superadmin@iiitkota.ac.in",
    "password": "SuperAdmin@iiit123"
}
```

**Response**:
- `200 OK`: OTP sent to the email.
- `400 Bad Request`: Invalid credentials.

### POST Verify OTP
**URL**: `/api/v1/users/verify-otp`

Verifies the OTP for two-factor authentication and stores the JWT tokens in cookies.

**Request Body**:
```json
{
    "email": "superadmin@iiitkota.ac.in",
    "otp": "123456"
}
```

**Response**:
- `200 OK`: OTP verified, JWT tokens set in cookies (`accessToken`, `refreshToken`).
- `400 Bad Request`: Invalid OTP or email.

### POST Logout
**URL**: `/api/v1/users/logout`

Logs out the user by clearing the JWT tokens stored in cookies.

**Request Body**: *None*

**Response**:
- `200 OK`: Logout successful, cookies cleared.

---

## Announcements

### POST Create Announcement
**URL**: `/api/v1/announcement`

Allows Admin and Super Admin users to create a new announcement.

**Request Body**:
```json
{
    "title": "Announcement Title",
    "description": "Announcement description."
}
```

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| title       | string | Yes      | The title of the announcement.     |
| description | string | Yes      | A detailed description.            |

**Response**:
- `201 Created`: Announcement created successfully.
- `403 Forbidden`: Only Admins and Super Admins can create announcements.

### PUT Edit Announcement
**URL**: `/api/v1/announcement/:id`

Allows Admin and Super Admin users to edit an existing announcement.

**Request Body**:
```json
{
    "title": "Updated Announcement Title",
    "description": "Updated description."
}
```

**Response**:
- `200 OK`: Announcement updated successfully.
- `404 Not Found`: Announcement with specified ID not found.
- `403 Forbidden`: Only Admins and Super Admins can edit announcements.

### DELETE Announcement
**URL**: `/api/v1/announcement/:id`

Allows Admin and Super Admin users to delete an existing announcement.

**Response**:
- `204 No Content`: Announcement deleted successfully.
- `404 Not Found`: Announcement with specified ID not found.
- `403 Forbidden`: Only Admins and Super Admins can delete announcements.

### GET Announcement
**URL**: `/api/v1/announcement`

Retrieves all announcements.

**Response**:
- `200 OK`: List of announcements retrieved successfully.

---

## Events

### POST Create Event
**URL**: `/api/v1/event`

Allows only Super Admin users to create a new event.

**Request Body**:
```json
{
    "title": "Event Title",
    "description": "Event description.",
    "date": "2024-10-10",
    "location": "Event location",
    "organizer": "Organizer Name"
}
```

| Field       | Type   | Required | Description                        |
|-------------|--------|----------|------------------------------------|
| title       | string | Yes      | The title of the event.            |
| description | string | Yes      | A detailed description of the event.|
| date        | string | Yes      | Date of the event (`YYYY-MM-DD`).  |
| location    | string | Yes      | Location of the event.             |
| organizer   | string | Yes      | Organizer name.                    |

**Response**:
- `201 Created`: Event created successfully.
- `403 Forbidden`: Only Super Admins can create events.

### PUT Edit Event
**URL**: `/api/v1/event/:id`

Allows only Super Admin users to edit an existing event.

**Request Body**:
```json
{
    "title": "Updated Event Title",
    "description": "Updated description.",
    "date": "2024-10-12",
    "location": "Updated location",
    "organizer": "Updated Organizer Name"
}
```

**Response**:
- `200 OK`: Event updated successfully.
- `404 Not Found`: Event with specified ID not found.
- `403 Forbidden`: Only Super Admins can edit events.

### DELETE Event
**URL**: `/api/v1/event/:id`

Allows only Super Admin users to delete an existing event.

**Response**:
- `204 No Content`: Event deleted successfully.
- `404 Not Found`: Event with specified ID not found.
- `403 Forbidden`: Only Super Admins can delete events.

### GET Events
**URL**: `/api/v1/event`

Allows only Super Admin users to retrieve a list of all events.

**Response**:
- `200 OK`: List of events retrieved successfully.
- `403 Forbidden`: Only Super Admins can access events.

---

## Testing & Validation
All routes can be tested using tools like Postman or Hoppscotch to ensure functionality and proper error handling. Make sure to test the following scenarios:
- Invalid credentials for login.
- Unauthorized access to restricted routes (events, announcements).
- Validations for input data on creation and edit routes.

## Notes
- JWT tokens are stored in cookies and also returned in response headers for secure authentication.
- Only Super Admins have control over events, while Admins and Super Admins manage announcements.

---

Feel free to add more details or adjust this documentation according to your project requirements.
``` 

This is a detailed, well-structured documentation with all the routes and functionality clearly explained. You can copy and paste it directly into your `README.md` file on GitHub.
