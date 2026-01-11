# MiniSocial Backend

A simple social media backend API built with Node.js, Express, TypeScript, and Sequelize.

## 🚀 How to Run

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Start the Server
**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

## 🔑 Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=
DATABASE=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
```

## 📡 Example Interactions

Here is a typical user flow to test the API.

### 1. Login (Mock)
Authenticates a user by ID. Creates the user if they don't exist.
*   **Endpoint:** `POST /auth/login`
*   **Body:** `{ "userId": "john_doe" }`
*   **Response:** Returns a token (User ID) and user details.
    ```json
    { "token": "1", "user": { ... } }
    ```

### 2. Update Profile
Set your display name, headline, and bio.
*   **Endpoint:** `PUT /me/profile`
*   **Headers:** `Authorization: <token>`
*   **Body:**
    ```json
    {
      "displayName": "John Doe",
      "headline": "Software Engineer",
      "bio": "Building cool things."
    }
    ```

### 3. Follow a User
Follow another user by their ID.
*   **Endpoint:** `POST /follow/:targetUserId`
*   **Headers:** `Authorization: <token>`
*   **Example:** `POST /follow/2`

### 4. Create a Post
Share a new update.
*   **Endpoint:** `POST /posts`
*   **Headers:** `Authorization: <token>`
*   **Body:**
    ```json
    {
      "text": "Hello world! This is my first post on MiniSocial."
    }
    ```

### 5. Get Feed
View posts from yourself and people you follow.
*   **Endpoint:** `GET /feed`
*   **Headers:** `Authorization: <token>`
*   **Response:** List of posts with author and like details.
