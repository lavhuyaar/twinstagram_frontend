# Twinstagram — Frontend

This is the frontend for **Twinstagram**, a full-stack social media platform inspired by Instagram. Built with **Vite + React + TypeScript**, it offers a clean, responsive, and theme-toggleable UI for seamless user experience.

P.s. - It's an Instagram clone, minus the chat feature (and a LOTTT of other features)

---

## Tech Stack

- Vite + React + TypeScript
- React Router
- Yup
- React Hook Form
- React Toastify
- React Icons
- Axios
- TailwindCSS (w/ custom theme)
- Deployed on **Vercel**

---

## Features

- Login / Register / Guest Login
- Light & Dark mode toggle
- Protected routes
- Feed with posts from followed users and public users
- Create/Edit/Delete posts (allows user to attach an image)
- Follow/Unfollow users
- Send follow requests to private users
- Accept/Reject received follow requests
- Profile view with followers/following
- Edit profile (image + privacy toggle)
- Search users by username / name

---

## Getting Started (Local Setup)

> Make sure your backend is already running at `http://localhost:4040` or your configured URL.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/twinstagram-frontend.git
cd twinstagram-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create an `.env` file in the root of the folder and paste the variables mentioned below

```bash
VITE_BACKEND_URL=http://localhost:4040
VITE_GUEST_USERNAME=guestuser
VITE_GUEST_PASSWORD=123456
```

### 4. Run the development server

```bash
npm run dev
```

---

## Inspiration

- Pinterest
- Instagram (official website)
- Dribbble
- Google ofc

---

## Personal words hehe

I loved this project, tried to achieve all I wanted to achieve. Even implemented a simple pagination and search feature.

Just so you know, I DO NOT use Instagram, so I had to ask a friend to give me his Instagram account so that I can clone some of it's UI and understand how things work.

Did a good work Lav. Proud of you, even implemented HTTP only Cookie for security (due to which the website won't work with Brave's shields on, but I can let that thing slide).

22-07-2025
