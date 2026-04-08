```markdown
# Cyber Security Learning Platform

An educational website with cybersecurity lessons and an integrated Telegram bot that answers user questions and provides links to lessons. The platform includes a responsive frontend, a backend API (Node.js + Express), a PostgreSQL database, and a Telegram bot built with Telegraf.

---

## Features

- **5 cybersecurity lessons** (SQL Injection, XSS, Phishing, Password Security, Wi‑Fi Security) with detailed content.
- **Interactive frontend**: lesson cards, full‑page lesson view, dark/light theme toggle.
- **User authentication** (localStorage‑based) – demo account included.
- **Telegram bot** that:
  - Answers common questions using keyword matching.
  - Provides lesson content via `/lesson <slug>` and `/lessons` commands.
  - Supports deep linking from the website (`?start=question_<slug>`).
  - Stores user questions and bot answers in the database (or JSON files – configurable).
- **Backend API** to serve lessons from a PostgreSQL database.
- **Ready for deployment** on Render (Web Service + Background Worker + PostgreSQL).

---

## Tech Stack

| Component       | Technology                         |
|----------------|------------------------------------|
| Frontend       | HTML, CSS, JavaScript (vanilla)    |
| Backend        | Node.js, Express                   |
| Database       | PostgreSQL (or SQLite/JSON for demo) |
| Telegram Bot   | Node.js, Telegraf                  |
| Deployment     | Render / any Node.js hosting       |

---

## Project Structure


cyber-learning-platform/
├── public/                 # Static frontend files
│   ├── index.html          # Main website (lessons, auth, Telegram button)
│   └── script.js           # Client‑side logic (loads lessons via API)
├── bot/                    # Telegram bot
│   └── bot.js              # Bot code (Telegraf, DB or JSON storage)
├── db/                     # Database scripts
│   └── init.sql            # PostgreSQL table creation + sample lessons
├── server.js               # Express backend (API + static files)
├── package.json            # Node.js dependencies
├── .env                    # Environment variables (see below)
└── README.md               # This file


> **Note**: If you prefer not to use PostgreSQL, the bot can work with JSON file storage (see comments in `bot.js`).

---

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (local or cloud – e.g., [Supabase](https://supabase.com/), [Render PostgreSQL](https://render.com/))
- **Telegram Bot Token** – get one from [@BotFather](https://t.me/BotFather)
```
### 1. Clone the repository

```bash
git clone https://github.com/whyasd666/toolkit-project
cd toolkit-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

- Create a PostgreSQL database (e.g., `cyber_learning`).
- Run the SQL script `db/init.sql` to create tables and insert the 5 lessons.
- If you don't have PostgreSQL, you can use the bot's JSON‑only mode (see `bot.js` – the code includes a file‑based fallback).

### 4. Configure environment variables

Create a `.env` file in the root folder:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/cyber_learning
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

- Replace `DATABASE_URL` with your PostgreSQL connection string.
- Replace `TELEGRAM_BOT_TOKEN` with the token from BotFather.

### 5. Start the backend server

```bash
node server.js
```

The website will be available at `http://localhost:3000`.

### 6. Start the Telegram bot (in a separate terminal)

```bash
node bot/bot.js
```

You should see: `✅ InnoSecSchool Bot is running!`

---

## Usage

### Website

- Open `http://localhost:3000`.
- Log in with the demo account:  
  **Email:** `demo@cyber.com`  
  **Password:** `demo123`
- Browse the 5 lessons, click "Read more" to view the full content.
- Use the **dark/light mode** toggle in the header.
- Click **"Chat with Bot"** to open Telegram and ask questions.

### Telegram Bot

- Find your bot on Telegram (e.g., `@CyberSecLearning_bot`).
- Send `/start` – welcome message.
- `/lessons` – list of all lessons.
- `/lesson <slug>` – get the full lesson (e.g., `/lesson sql-injection`).
- Ask plain‑text questions like "what is XSS?" – the bot will answer using keyword matching.
- If the question is not recognised, the bot saves it for future improvement.

### Deep linking from the website

Each lesson card contains a link like:
```
https://t.me/YourBotUsername?start=question_sql-injection
```
When clicked, the bot immediately shows the beginning of the corresponding lesson.

---

## Customisation

### Adding or modifying lessons

- Update the `lessons` table in PostgreSQL (or edit the `LESSONS` array in `bot.js` if using JSON storage).
- The frontend loads lessons via the API – no need to change HTML/JS.

### Changing the bot’s knowledge base

Edit the `knowledgeBase` array in `bot/bot.js`. Each entry has:
- `keywords`: array of trigger words/phrases.
- `answer`: the bot’s reply.

### Styling

Modify `public/style.css`. The CSS uses CSS variables for light/dark themes – you can easily change colours.

---

## Future improvements (Version 2)

- Replace `localStorage` authentication with JWT and database‑stored users.
- Integrate OpenAI API for more intelligent answers.
- Add user progress tracking and quizzes.
- Implement an admin panel to manage lessons and view questions.

---

## License

MIT

---

## Acknowledgements

- [Telegraf](https://telegraf.js.org/) – Telegram bot framework.
- [Express](https://expressjs.com/) – web framework.
- [PostgreSQL](https://www.postgresql.org/) – relational database.

For any questions, feel free to open an issue or contact the project maintainer.
```
