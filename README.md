# Odin-X

**Odin-X** is a full-stack social networking application with React frontend and Node.js backend, offering user authentication, real-time communication, content management, and media uploads.

## Back-End Overview

The back-end of Odin-X is built with Node.js and Express, providing RESTful APIs, user authentication, real-time communication via WebSockets, and optimizations for security and performance.

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

### Installation and Setup

#### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Set up `.env` file

#### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/odin-x.git
   cd odin-x/back-end
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

The following environment variables are required to run Odin-X:

```env
PORT=3000
SECRET=your_jwt_secret
FRONTEND_URL=https://frontend.com # Only needed in production
NODE_ENV=development
CLOUDINARY_URL=cloudinary://your_user:your_pass@code
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