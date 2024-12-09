# OdinX

**OdinX** is a full-stack social networking application designed for seamless user interactions, real-time communication, and content sharing. Built with a React front-end and a Node.js back-end, it features user authentication, post management, and real-time updates.

---

## Front-End Overview

The OdinX front-end is developed with React, emphasizing a user-friendly experience and responsive design.

### Key Features
1. **Authentication**: Register, login, and guest access.
2. **Real-Time Updates**: Post likes, replies, and following activities update dynamically using Socket.IO.
3. **Posts Management**: Users can create posts with images/videos (up to 3MB), interact with others' posts (likes/replies), and view detailed post pages.
4. **Profile Management**: Update profile information and upload profile pictures.
5. **Search Functionality**: Find users and posts easily with dynamic filters.
6. **Responsive Design**: Mobile-friendly layout with adaptive UI for all devices.

### Code Highlights
- **Custom Hooks**: Efficient data fetching and state management (`src/hooks`).
- **Dynamic Routing**: Handled by React Router DOM (`src/routes.jsx`).
- **UI Enhancements**: Notifications with React Toastify and styled layouts with Bootstrap.

---

## Back-End Overview

The back-end of OdinX provides a robust API for handling user authentication, content management, and real-time events.

### Key Features
- **User Authentication**: Secure JWT-based authentication.
- **Real-Time Communication**: Socket.IO for live updates.
- **Media Uploads**: Store images/videos in Cloudinary (up to 3MB).
- **RESTful APIs**: Comprehensive routes for users, posts, and search functionality.
- **Security**: Enhanced with Helmet and rate limiting.
- **Testing**: Unit and integration tests using Jest and Supertest.

---

## Setup Instructions

Follow these steps to set up OdinX locally.

### Prerequisites
- Node.js (v16+)
- PostgreSQL
- A Cloudinary account for media uploads

### Back-End Setup
1. Clone the repository and navigate to the back-end folder:
   ```bash
   git clone https://github.com/gustydev/odinX.git
   cd odinX/back-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file:
   ```env
   PORT=3000
   SECRET=your_jwt_secret
   CLOUDINARY_URL=cloudinary://your_user:your_pass@code
   NODE_ENV=development
   ```
4. Set up the database with Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Front-End Setup
1. Navigate to the front-end folder:
   ```bash
   cd odinX/front-end
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_DEMO_USERNAME=guest_user
   VITE_DEMO_PASSWORD=guest_password
   ```
4. Start the front-end development server:
   ```bash
   npm run dev
   ```

---

## API Overview

The OdinX API provides comprehensive endpoints to manage authentication, users, posts, and search functionality. Below are detailed explanations of the available routes, including query parameters, authentication requirements, and expected behaviors.

### Authentication Routes

| Method | Route                  | Description                      | Authentication Required |
|--------|------------------------|----------------------------------|-------------------------|
| POST   | `/api/auth/register`   | Register a new user              | No                      |
| POST   | `/api/auth/login`      | Log in a user                    | No                      |

#### Query Parameters:
- **N/A**

---

### User Routes

| Method | Route                        | Description                              | Authentication Required | Query Options         |
|--------|------------------------------|------------------------------------------|-------------------------|-----------------------|
| GET    | `/api/user/list`             | Get a list of users                      | Yes                     | `page`, `limit`       |
| GET    | `/api/user/:userId`          | Get user details                         | Yes                     | -                     |
| POST   | `/api/user/:userId/follow`   | Follow a user                            | Yes                     | -                     |
| PUT    | `/api/user/:userId`          | Update user profile                      | Yes                     | -                     |
| DELETE | `/api/user/:userId`          | Delete a user and their associated data  | Yes                     | -                     |

#### Query Parameters:
- **`page`**: The page of results to retrieve (default: 1).
- **`limit`**: The number of results per page (default: 10).

---

### Post Routes

| Method | Route                        | Description                              | Authentication Required | Query Options                                                              |
|--------|------------------------------|------------------------------------------|-------------------------|----------------------------------------------------------------------------|
| GET    | `/api/post/list`             | Fetch a list of posts                    | Yes                     | `page`, `limit`, `filter`, `sort`, `replies`, `follows`, `likes`           |
| GET    | `/api/post/:postId`          | Fetch a specific post by ID              | Yes                     | -                                                                          |
| POST   | `/api/post`                  | Create a new post (with media upload)    | Yes                     | -                                                                          |
| PUT    | `/api/post/:postId`          | Update a post                            | Yes                     | -                                                                          |
| DELETE | `/api/post/:postId`          | Delete a post                            | Yes                     | -                                                                          |

#### Query Parameters for `/api/post/list`:
- **`page`**: The page of results to retrieve (default: 1).
- **`limit`**: The number of posts per page (default: 10).
- **`filter`**: Filter posts by specific criteria (e.g., user ID, hashtags).
- **`sort`**: Sort order of posts (`asc` or `desc`; default: `desc`).
- **`replies`**: Retrieve only posts that are replies (`true` or `false`).
- **`follows`**: Retrieve only posts from followed users (`true` or `false`).
- **`likes`**: Retrieve only posts liked by the authenticated user (`true` or `false`).

---

### Search Routes

| Method | Route                  | Description                              | Authentication Required | Query Options         |
|--------|------------------------|------------------------------------------|-------------------------|-----------------------|
| GET    | `/api/search`           | Search for users and posts               | Yes                     | `page`, `limit`, `filter` |

#### Query Parameters for `/api/search`:
- **`page`**: The page of results to retrieve (default: 1).
- **`limit`**: The number of results per page (default: 10).
- **`filter`**: Specify a search filter (e.g., keywords, hashtags).

---

### Real-Time Events
The API supports real-time interactions via Socket.IO for the following events:
- **`likePost`**: Triggered when a user likes a post.
- **`postReply`**: Triggered when a user replies to a post.
- **`followUser`**: Triggered when a user follows another user.

### Notes
- **Media Uploads**: Media (images/videos) for posts and profile pictures are uploaded to Cloudinary with a file size limit of 3MB.
- **Rate Limiting**: All endpoints are protected by rate limiting to prevent abuse.
- **Validation**: Input validation is enforced using `express-validator`. Ensure all fields meet the required criteria before sending requests.
