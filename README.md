# OdinX

**OdinX** is a full-stack social networking application with React frontend and Node.js backend, offering user authentication, real-time communication, content management, and media uploads.

## Back-End Overview

The back-end of OdinX is built with Node.js and Express, providing RESTful APIs, user authentication, real-time communication via WebSockets, and optimizations for security and performance. It uses a PostgreSQL database with Prisma ORM, and tests the API routes with Jest and Supertest.

### Features
- **Authentication**: JWT-based authentication using `passport-jwt`.
- **Real-time Communication**: Socket.IO for features like post likes, replies, and following.
- **Media Uploads**: Upload images and videos (up to 3MB) for posts and profile pictures, stored in Cloudinary.
- **APIs**:
  - User management
  - Post creation, updates, and interactions (likes, replies)
  - Search for users and posts
- **Security Enhancements**:
  - Helmet for securing HTTP headers
  - Rate limiting to prevent abuse
- **Middleware**:
  - CORS configuration
  - Input validation with `express-validator`

- **Real-Time Events**:
    - Real-time updates via Socket.IO: `likePost`, `postReply`, `followUser`

### Unit and Integration Tests
The API includes comprehensive testing for key routes, using Jest and Supertest to validate endpoints for user authentication, post creation, likes, replies, and user interactions such as following.

Example tests include:

- Authentication: Ensures registration and login functionality works with various scenarios (e.g., valid/invalid credentials).
- Post Routes: Tests creation, editing, and interactions like likes and replies.
- User Routes: Verifies actions like following/unfollowing users.

The test setup includes a mock Express server and utility functions for clear database states, facilitating reliable and isolated testing of route logic.

### Installation and Setup

#### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Set up `.env` file

#### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/gustydev/odinX.git
   cd odinX/back-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database with Prisma:
   ```bash
   npx prisma migrate dev
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### Environment Variables

The following environment variables are required to run OdinX (set them up on .env files on the backend and frontend folders respectively):

##### Back-end
```env
PORT=3000
SECRET=your_jwt_secret
FRONTEND_URL=https://frontend.com # Only needed in production
NODE_ENV=development
CLOUDINARY_URL=cloudinary://your_user:your_pass@code
```

##### Front-end
```env
VITE_API_URL=http://localhost:3000
VITE_DEMO_USERNAME=guest_user
VITE_DEMO_PASSWORD=guest_password
```

### API Endpoints

#### Authentication Routes

| Method | Route                  | Description                      | Authentication Required |
|--------|------------------------|----------------------------------|-------------------------|
| POST   | `/api/auth/register`    | Register a new user              | No                      |
| POST   | `/api/auth/login`       | Log in a user                    | No                      |

---

#### User Routes

| Method | Route                        | Description                              | Authentication Required | Query Options  |
|--------|------------------------------|------------------------------------------|-------------------------|----------------|
| GET    | `/api/user/list`             | Get a list of users                      | Yes                     | `page`, `limit` |
| GET    | `/api/user/:userId`          | Get user details                         | Yes                     | -              |
| POST   | `/api/user/:userId/follow`   | Follow a user                            | Yes                     | -              |
| PUT    | `/api/user/:userId`          | Update user profile                      | Yes                     | -              |
| DELETE | `/api/user/:userId`          | Delete a user and their associated data  | Yes                     | -              |

---

#### Post Routes

| Method | Route                        | Description                              | Authentication Required | Query Options  |
|--------|------------------------------|------------------------------------------|-------------------------|----------------|
| GET    | `/api/post/list`             | Fetch a list of posts                    | Yes                     | `page`, `limit`, `filter`, `sort` (default `desc`), `replies` (true/false), `follows` (true/false), `likes` (true/false) |
| GET    | `/api/post/:postId`          | Fetch a specific post by ID              | Yes                     | -              |
| POST   | `/api/post`                  | Create a new post (with media upload)    | Yes                     | -              |
| PUT    | `/api/post/:postId`          | Update a post                            | Yes                     | -              |
| DELETE | `/api/post/:postId`          | Delete a post                            | Yes                     | -              |

---

#### Search Route

| Method | Route                  | Description                              | Authentication Required | Query Options  |
|--------|------------------------|------------------------------------------|-------------------------|----------------|
| GET    | `/api/search`           | Search for users and posts               | Yes                     | `page`, `limit`, `filter` |

---

#### Additional Notes:
- **Replies**, **Follows**, and **Likes** query parameters allow filtering posts based on user preferences: retrieving either replies, posts from followed users, or posts liked by the user.
- For the `POST /api/post` route, users can upload media (images or videos) which are stored in the cloud with a limit of 3MB.

## Front-End

### Technologies Used
- **React** for UI
- **Vite** for fast builds
- **React Router DOM** for routing
- **Socket.IO Client** for real-time updates
- **React Hook Form** for form management
- **React Toastify** for notifications
- **Bootstrap** for creating responsive and visually appealing interfaces

### Features
1. **Authentication**: Register, login, and guest login.
2. **Responsive Layout**: Mobile-first design with dynamic and adaptive UI.
3. **Posts**: Create, view, and interact with posts (with image/video attachments).
4. **Profile Management**: Edit profile and upload profile pictures (up to 3MB).
5. **Search**: Search for users and posts.
6. **Real-Time Updates**: Powered by Socket.IO for dynamic post interactions.

### Code Organization
- **Components**: Located in `src/components`.
- **Routes**: Defined in `src/routes.jsx`.
- **Hooks**: Custom hooks for data fetching in `src/hooks`.
- **Layout**: Responsive design with mobile and desktop views.

### Project Dependencies
**Production**: React, React Router DOM, React Toastify, Socket.IO Client, React Hook Form.

**Development**: Vite, ESLint, React/Hooks plugins.