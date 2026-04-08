```markdown
# Cyber Security Learning Platform

> Educational website with cybersecurity lessons and an integrated Telegram bot that answers user questions.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Telegraf](https://img.shields.io/badge/Telegraf-4.x-purple)](https://telegraf.js.org/)

---

## 📌 Features

- **5 detailed cybersecurity lessons** (SQL Injection, XSS, Phishing, Password Security, Wi‑Fi Security)
- **Modern responsive frontend** with light/dark theme toggle
- **User authentication** (localStorage‑based, demo account included)
- **Telegram bot** that:
  - Answers common questions using keyword matching
  - Serves full lessons via `/lesson <slug>` and `/lessons` commands
  - Supports deep linking from the website (`?start=question_<slug>`)
  - Stores user questions and bot answers (PostgreSQL or JSON fallback)
- **Backend API** (Node.js + Express) to serve lessons from a database
- **Ready for deployment** on Render (Web Service + Background Worker + PostgreSQL)

---

## 🏗️ Architecture

```
User ──► Website (frontend) ──► Backend API (Express) ──► PostgreSQL
          │                           │
          │ (Telegram link)            │
          ▼                           ▼
      Telegram Bot ◄───────────  Database (same)
```

- **Frontend** – static HTML/CSS/JS, loads lessons via `fetch('/api/lessons')`.
- **Backend** – Express server providing REST API and serving static files.
- **Database** – PostgreSQL stores lessons, web users (optional), Telegram users and questions.
- **Bot** – separate Node.js process using Telegraf, shares the same database.

---

## 📁 Project Structure

```
cyber-learning-platform/
├── public/                   # Frontend files
│   ├── index.html            # Main page (lessons, auth, Telegram button)
│   ├── style.css             # Styling (light/dark, responsive)
│   └── script.js             # Client logic (loads lessons via API)
├── bot/
│   └── bot.js                # Telegram bot (Telegraf + DB/JSON storage)
├── db/
│   └── init.sql              # PostgreSQL table creation + sample lessons
├── server.js                 # Express backend (API + static)
├── package.json              # Node.js dependencies
├── .env                      # Environment variables (see below)
└── README.md                 # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (local or cloud – [Supabase](https://supabase.com/), [Render](https://render.com/))
- **Telegram Bot Token** – get it from [@BotFather](https://t.me/BotFather)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cyber-learning-platform.git
cd cyber-learning-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

- Create a PostgreSQL database (e.g., `cyber_learning`).
- Execute the SQL script `db/init.sql` to create tables and insert the 5 lessons.
- If you don't have PostgreSQL, the bot can work with JSON files (see comments in `bot.js`).

### 4. Configure environment variables

Create a `.env` file in the root folder:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/cyber_learning
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

Replace the values with your actual database connection string and bot token.

### 5. Start the backend server

```bash
node server.js
```

The website will be available at `http://localhost:3000`.

### 6. Start the Telegram bot (in a separate terminal)

```bash
node bot/bot.js
```

You should see:
```
✅ InnoSecSchool Bot is running!
Bot username: @YourBotUsername
```

---

## 🎮 Usage

### Website

- Open `http://localhost:3000`
- Log in with demo account:  
  **Email:** `demo@cyber.com`  
  **Password:** `demo123`
- Browse the 5 lessons, click "Read more" to see full content.
- Toggle dark/light mode with the button in the header.
- Click **"Chat with Bot"** to open Telegram and ask questions.

### Telegram Bot

| Command | Description |
|---------|-------------|
| `/start` | Welcome message + deep link handling |
| `/help`  | Show available commands |
| `/lessons` | List all lessons with slugs |
| `/lesson <slug>` | Show full lesson (e.g., `/lesson sql-injection`) |

**Example questions the bot understands:**
- "what is SQL injection?"
- "how to protect against phishing?"
- "explain XSS"
- "strong password tips"
- "Wi-Fi security"

If the bot doesn't recognise a question, it saves it for future improvement.

### Deep linking from the website

Each lesson card contains a link like:
```
https://t.me/YourBotUsername?start=question_sql-injection
```
When clicked, the bot immediately shows the beginning of the corresponding lesson.

---

## 🛠️ Customisation

### Adding or modifying lessons

1. Update the `lessons` table in PostgreSQL (or edit the `LESSONS` array in `bot.js` if using JSON storage).
2. The frontend automatically loads the updated list via the API – no need to change HTML/JS.

### Changing the bot’s knowledge base

Edit the `knowledgeBase` array in `bot/bot.js`. Each entry has:
- `keywords`: array of trigger words/phrases (case‑insensitive).
- `answer`: the bot’s reply (supports Markdown and inline links).

### Styling

Modify `public/style.css`. The design uses CSS variables for light/dark themes – you can easily change colours.

---

## 🌍 Deployment on Render

1. Push the project to a GitHub repository.
2. On [Render](https://render.com/):
   - Create a **Web Service**:
     - Build command: `npm install`
     - Start command: `node server.js`
   - Create a **Background Worker** (for the bot):
     - Start command: `node bot/bot.js`
   - Create a **PostgreSQL database** (Render offers managed PostgreSQL).
   - Add environment variables to both services:
     - `DATABASE_URL` (from your Render PostgreSQL instance)
     - `TELEGRAM_BOT_TOKEN`
3. Deploy. The website and bot will run 24/7.

> **Note**: If you use the free tier, services may spin down after inactivity. The first request may take 30–50 seconds to wake up.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Error: Cannot find module 'bcrypt'` | Run `npm install bcrypt` or remove `bcrypt` from `server.js` if not needed. |
| `ECONNREFUSED 127.0.0.1:5432` | PostgreSQL is not running or `DATABASE_URL` is incorrect. Use a cloud database or switch to JSON storage (bot only). |
| Bot does not respond | Check that the token in `.env` is correct and the bot is not blocked. Restart `bot/bot.js`. |
| Lessons not loading on website | Open browser console – verify that `GET /api/lessons` returns data. Ensure `server.js` is running. |
| `403 Forbidden` from Telegram | Your server IP might be blocked. Use a VPN or deploy to a cloud provider. |

---

## 📈 Future improvements (Version 2)

- Replace `localStorage` authentication with JWT and database‑stored users.
- Integrate OpenAI API for more intelligent, conversational answers.
- Add user progress tracking and quizzes.
- Implement an admin panel to manage lessons and view questions.
- Add interactive exercises (SQL injection sandbox, etc.).

---

## 📄 License

MIT

---

## 🙏 Acknowledgements

- [Telegraf](https://telegraf.js.org/) – Telegram bot framework
- [Express](https://expressjs.com/) – web framework
- [PostgreSQL](https://www.postgresql.org/) – relational database
- [Render](https://render.com/) – cloud hosting

---

## 📬 Contact

For questions or suggestions, please open an issue on GitHub or contact the project maintainer.

**Happy learning!** 🛡️
```
