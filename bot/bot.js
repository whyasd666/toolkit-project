require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const LESSONS = [
    {
        slug: "sql-injection",
        title: "SQL Injection",
        short_desc: "What is SQLi and how to prevent it",
        full_content: `SQL Injection is a code injection technique that exploits vulnerabilities in an application's database layer.

How it works: Attackers insert malicious SQL code into input fields. If not sanitized, the injected code is executed.

Example: SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'

Prevention:
- Use parameterized queries (prepared statements)
- Use an ORM
- Apply input validation and least privilege`
    },
    {
        slug: "xss",
        title: "Cross-Site Scripting (XSS)",
        short_desc: "Understanding XSS attacks",
        full_content: `XSS allows attackers to inject malicious scripts into web pages viewed by other users.

Types:
- Reflected: script is immediately returned
- Stored: script permanently stored on server
- DOM-based: client-side vulnerability

Prevention:
- Output encoding
- Content Security Policy (CSP)
- Use frameworks that auto-escape`
    },
    {
        slug: "phishing",
        title: "Phishing",
        short_desc: "How to recognize phishing attacks",
        full_content: `Phishing is a social engineering attack where criminals trick victims into revealing sensitive information.

Red flags:
- Urgent language
- Generic greetings
- Suspicious links
- Spelling mistakes

Protection:
- Never click links in unexpected emails
- Verify sender through another channel
- Enable 2FA`
    },
    {
        slug: "password-security",
        title: "Password Security",
        short_desc: "Best practices for strong passwords",
        full_content: `Strong password characteristics:
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Not based on personal info

Additional measures:
- Use a password manager
- Enable Two-Factor Authentication (2FA)
- Never reuse passwords`
    },
    {
        slug: "wifi-security",
        title: "Wi-Fi Security",
        short_desc: "Secure your wireless network",
        full_content: `Risks of public Wi-Fi:
- Evil twin attacks
- Packet sniffing
- Man-in-the-middle

Protection:
- Use a VPN
- Ensure HTTPS
- Turn off file sharing
- At home: use WPA2/WPA3, change default password, disable WPS`
    }
];

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const QUESTIONS_FILE = path.join(DATA_DIR, 'questions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function readJson(file, defaultVal = []) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) { console.error(e); }
    return defaultVal;
}

function writeJson(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function saveUser(telegram_id, username) {
    const users = readJson(USERS_FILE);
    if (!users.find(u => u.telegram_id === telegram_id)) {
        users.push({ telegram_id, username, first_seen: new Date().toISOString() });
        writeJson(USERS_FILE, users);
    }
}

function saveQuestion(telegram_id, question, answer) {
    const questions = readJson(QUESTIONS_FILE);
    questions.push({ telegram_id, question, answer, timestamp: new Date().toISOString() });
    writeJson(QUESTIONS_FILE, questions);
}

const knowledgeBase = [
    {
        keywords: ['sql injection', 'sqli'],
        answer: 'SQL injection is an attack that inserts malicious SQL code. Use parameterized queries. Lesson: /lesson sql-injection'
    },
    {
        keywords: ['xss', 'cross-site scripting'],
        answer: 'XSS allows attackers to inject scripts into web pages. Protect with output encoding and CSP. Lesson: /lesson xss'
    },
    {
        keywords: ['phishing', 'phishing attack'],
        answer: 'Phishing tricks you into revealing personal info. Never click suspicious links. Lesson: /lesson phishing'
    },
    {
        keywords: ['password', '2fa', 'two-factor', 'strong password'],
        answer: 'Use long unique passwords, password managers, and enable 2FA. Lesson: /lesson password-security'
    },
    {
        keywords: ['wifi', 'wi-fi', 'wireless', 'wpa2'],
        answer: 'Secure your Wi-Fi with WPA2/WPA3, disable WPS, update router firmware. Lesson: /lesson wifi-security'
    }
];

async function sendPlain(ctx, text) {
    await ctx.reply(text);
}

bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || '';
    saveUser(userId, username);

    const text = ctx.message.text;
    const match = text.match(/\/start question_(.+)/);
    if (match) {
        const slug = match[1];
        const lesson = LESSONS.find(l => l.slug === slug);
        if (lesson) {
            await ctx.reply(
                `${lesson.title}\n\n${lesson.full_content.substring(0, 400)}...\n\nFull lesson on the website: http://localhost:3000/lesson/${slug}`,
                Markup.inlineKeyboard([
                    Markup.button.url('Open lesson on website', `http://localhost:3000/lesson/${slug}`)
                ])
            );
            return;
        }
    }

    await ctx.reply(
        `Welcome to Cyber Security Learning Bot!\n\nI can help you learn about cybersecurity.\n\nCommands:\n/lessons - List all lessons\n/lesson <slug> - Show full lesson (e.g., /lesson sql-injection)\n/help - Show this help\n\nYou can also ask me a question in plain English.`
    );
});

bot.help(async (ctx) => {
    await ctx.reply(
        `Available commands:\n/start — Start the bot\n/help — Show this help\n/lessons — List all lessons\n/lesson <slug> — Show full lesson (e.g., /lesson sql-injection)\n\nYou can also ask me questions like "What is XSS?" or "How to create a strong password?"`
    );
});

bot.command('lessons', async (ctx) => {
    let message = 'List of lessons:\n\n';
    LESSONS.forEach(lesson => {
        message += `• ${lesson.title} — ${lesson.short_desc}\n   /lesson ${lesson.slug}\n\n`;
    });
    await ctx.reply(message);
});

bot.command('lesson', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        await ctx.reply('Please specify lesson slug. Example: /lesson sql-injection');
        return;
    }
    const slug = args[1];
    const lesson = LESSONS.find(l => l.slug === slug);
    if (!lesson) {
        await ctx.reply(`Lesson "${slug}" not found. Use /lessons to see available lessons.`);
        return;
    }
    const content = `${lesson.title}\n\n${lesson.full_content}`;
    if (content.length > 4096) {
        const parts = content.match(/[\s\S]{1,4000}/g) || [];
        for (const part of parts) {
            await ctx.reply(part);
        }
    } else {
        await ctx.reply(content);
    }
});

bot.on('text', async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    const userId = ctx.from.id;
    const username = ctx.from.username || '';
    saveUser(userId, username);

    let answer = null;
    for (const item of knowledgeBase) {
        if (item.keywords.some(kw => text.includes(kw))) {
            answer = item.answer;
            break;
        }
    }

    if (answer) {
        await ctx.reply(answer);
        saveQuestion(userId, text, answer);
    } else {
        const fallback = `I'm still learning. Your question has been saved. Meanwhile, check our lessons on the website: http://localhost:3000/lessons`;
        await ctx.reply(fallback);
        saveQuestion(userId, text, fallback);
    }
});

bot.action(/lesson_(.+)/, async (ctx) => {
    const slug = ctx.match[1];
    const lesson = LESSONS.find(l => l.slug === slug);
    if (lesson) {
        await ctx.reply(`${lesson.title}\n\n${lesson.full_content.substring(0, 500)}...\n\nFull lesson: http://localhost:3000/lesson/${slug}`);
    } else {
        await ctx.reply('Lesson not found.');
    }
    await ctx.answerCbQuery();
});

bot.launch().then(() => {
    console.log('✅ Telegram bot is running!');
    console.log(`Bot username: @CyberSecLearning_bot`);
}).catch((err) => {
    console.error('❌ Failed to start bot:', err.message);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
