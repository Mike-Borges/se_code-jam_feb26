# Chronicle

A friendship timeline application where users can preserve and share memories with friends through posts, photos, and messaging.

## 📖 Overview

Chronicle helps you stay connected with the people who matter most. Build timelines of your friendships through shared posts and photos, track your history together, and keep those connections alive—even when life gets busy.

**Key Features:**

- 🔐 Secure authentication (JWT-based login/registration)
- 👥 Friend management (add, accept, decline, remove)
- 📝 Timeline posts with text and photo uploads
- 💬 Messaging (coming soon)
- 📱 Responsive design (coming soon)

---

## 🛠️ Tech Stack

### Frontend

- **React 19** — UI library
- **React Router DOM 7** — client-side routing
- **Vite 7** — build tool & dev server
- **Plain CSS** — styling (no framework)

### Backend

- **Express 5** — REST API server
- **MongoDB + Mongoose 9** — database & ODM
- **JWT (jsonwebtoken)** — authentication tokens
- **bcryptjs** — password hashing
- **multer** — file uploads (stores in `server/uploads/`)
- **dotenv** — environment variables
- **CORS** — cross-origin support

### Dev Tooling

- **ESLint 9** — code linting
- **Vite proxy** — proxies API requests to Express during development

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (local instance or MongoDB Atlas connection)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/chronicle.git
   cd chronicle
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root with the following:

   ```env
   MONGO_URI=mongodb://localhost:27017/chronicle
   JWT_SECRET=your-random-secret-string-here
   PORT=5000
   ```

   - `MONGO_URI` — Your MongoDB connection string (local or Atlas)
   - `JWT_SECRET` — A random secret string for signing JWT tokens
   - `PORT` — Backend server port (optional, defaults to 5000)

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

### Running the App

You need **two terminal windows** — one for backend, one for frontend:

**Terminal 1 — Backend:**

```bash
npm run server
```

Backend runs on `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173` (Vite default)

The Vite dev server proxies API requests to `http://localhost:5000` automatically.

---

## 📂 Project Structure

```
chronicle/
├── public/                # Static assets
├── server/                # Backend (Express API)
│   └── uploads/           # User-uploaded files (photos)
├── src/                   # Frontend (React app)
│   ├── assets/            # Images, icons, etc.
│   ├── components/        # Reusable React components
│   │   ├── AddMemoryModal/
│   │   ├── ContactList/
│   │   ├── Header/
│   │   ├── MessageThread/
│   │   ├── Nav/
│   │   └── View/
│   ├── pages/             # Route-level page components
│   │   ├── Feed/
│   │   ├── Login/
│   │   ├── Messages/
│   │   ├── Profile/
│   │   └── Register/
│   ├── styles/            # Global CSS files
│   │   ├── globals.css
│   │   └── tokens.css
│   ├── App.jsx            # Main app component & routes
│   ├── App.css
│   ├── index.css
│   └── main.jsx           # React entry point
├── .env                   # Environment variables (not tracked)
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

---

## 🔑 Environment Variables

| Variable     | Purpose                           | Example                               |
| ------------ | --------------------------------- | ------------------------------------- |
| `MONGO_URI`  | MongoDB connection string         | `mongodb://localhost:27017/chronicle` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `mysecretkey123`                      |
| `PORT`       | Backend server port (optional)    | `5000`                                |

⚠️ **Security Note:** Never commit your `.env` file. It's already included in `.gitignore`.

---

## 🧪 Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start frontend dev server (Vite)   |
| `npm run server`  | Start backend API server (Express) |
| `npm run build`   | Build frontend for production      |
| `npm run preview` | Preview production build locally   |
| `npm run lint`    | Run ESLint on the codebase         |

---

## 🗺️ API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Log in and receive JWT token

### Friends

- `GET /api/friends` — Get user's friend list
- `POST /api/friends/add` — Send friend request
- `POST /api/friends/accept/:id` — Accept friend request
- `POST /api/friends/decline/:id` — Decline friend request
- `DELETE /api/friends/remove/:id` — Remove a friend

### Posts

- `GET /api/posts` — Get timeline posts
- `POST /api/posts` — Create a new post (supports text + photo)
- `DELETE /api/posts/:id` — Delete a post

### Messaging _(Coming Soon)_

- `GET /api/messages` — Get user's messages
- `POST /api/messages/send` — Send a message

---

## 🎨 Design System

Chronicle uses a custom color palette defined in `src/styles/tokens.css`:

- **Warm Nostalgia Theme** — Cream, amber, and brown tones for a nostalgic, scrapbook feel
- Fully responsive layout (mobile-first design)
- Clean, minimal UI with focus on content

---

## 🤝 Contributing

This project is being developed by a team of 4:

- **2 Software Engineers** — Full-stack development
- **2 UI/UX Designers** — Design, prototyping, user research

### Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Commit with clear messages: `git commit -m "Add user profile page"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a pull request for review

---

## 🐛 Known Issues / Roadmap

- [ ] Messaging feature (in progress)
- [ ] Notifications for friend requests and new posts
- [ ] Photo albums and galleries
- [ ] Timeline filters (by date, friend, etc.)
- [ ] Export timeline as PDF or photo book
- [ ] Mobile app (React Native)

---

## 📄 Figma & Deployment

[Figma](https://www.figma.com/design/kBSR4S5QiA2hMmnm6IAu5m)

---

## 👥 Team

Built by Michael Borges SE, Jordan Campbell SE, Caitlin Forcier UX/UI, & Imani Gordon UX/UI

---

**Happy chronicling! 📖✨**
