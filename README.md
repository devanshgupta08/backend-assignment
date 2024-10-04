# Backend Assignment

This documentation provides an overview of the backend API built using **Express.js** for managing announcements and events. The API interacts with a **MongoDB** database and includes robust user authentication and role management features.

## Key Features

### Route Management
- `/announcement`: For retrieving and managing announcements.
- `/event`: For retrieving and managing events.
- `/user`: Provides an administrative panel to modify database entries.

### User Roles
- **Admin**: 
  - Can view, add, edit, and delete announcements.
- **Super Admin**: 
  - Has all Admin privileges plus the ability to manage events.

### Security
- **Authentication**: 
  - The API uses **JWT (JSON Web Tokens)** for secure user authentication.
  - **Password hashing** ensures that user credentials are stored securely.
  
These security measures ensure that only authorized users have access to sensitive admin functionalities.

## API Documentation

For a complete list of available routes, their request parameters, and response formats, please refer to the API documentation.

- **API Documentation**: [View API Docs](https://documenter.getpostman.com/view/29611512/2sAXxMfD5J#intro)
- **Postman Collection**: [Download Postman Collection](https://crimson-eclipse-905734.postman.co/workspace/my-space~085f277d-4821-4b8c-9d57-8064e65bacba/collection/29611512-5e28b939-db09-4484-877b-37d193bd0348?action=share&creator=29611512)
- **Hosted Link**: [Link](https://backend-assignment-m1w4.onrender.com)

## License
This project is licensed under the MIT License.
