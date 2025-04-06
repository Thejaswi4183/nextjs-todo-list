# ✅ My Todo App

A modern and minimal **Todo List** app built with:

- **Next.js 14**
- **Clerk authentication**
- **ToastifyJS** for notifications
- **MongoDB** for storage (via API routes)
- **Vercel** for seamless deployment

---

## ✨ Features

- ✅ Sign in/up with Clerk modal
- 🧠 Persistent tasks per user
- 🟢 Add, complete, and delete tasks
- 🔔 Toast notifications for all actions
- ☁️ Deploys beautifully to Vercel

---

## 🔧 Tech Stack

| Tech           | Usage                           |
|----------------|---------------------------------|
| Next.js 14     | App framework                   |
| Clerk          | User authentication             |
| MongoDB        | Task database                   |
| ToastifyJS     | UI notifications                |
| Vercel         | Deployment platform             |

---

## 🚀 Getting Started
1. Clone the repo
git clone https://github.com/your-username/nextjs-todo-list.git
cd todo-app
2. Install dependencies
```npm install```
3. Add environment variables
Create a .env.local file in the root:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
```
  You can get these from Clerk.dev and MongoDB Atlas.

4. Run the dev server
```
npm run dev
```
Visit: 
```
http://localhost:3000 
```

🧪 API Routes
---
GET /api/tasks?userId=xxx → Fetch user’s tasks

POST /api/tasks → Add new task

PUT /api/tasks?id=xxx → Toggle complete

DELETE /api/tasks?id=xxx → Delete task

---
⚙️ Deployment
---
This app is fully deployable to Vercel:
  ```vercel --prod```
Or use the Vercel Dashboard and import this repo. Don’t forget to add the env variables in the project settings.
