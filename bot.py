import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton

# ---------- CONFIG ----------
BOT_TOKEN = "8106771591:AAEFKota1aHf1gtPKn6qiIgMrxlinU3VKIc"

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# ---------- KEYBOARDS ----------
def main_keyboard():
    buttons = [
        [KeyboardButton(text="📚 Lessons"), KeyboardButton(text="❓ FAQ")],
        [KeyboardButton(text="ℹ️ About"), KeyboardButton(text="🆘 Help")]
    ]
    return ReplyKeyboardMarkup(keyboard=buttons, resize_keyboard=True)

def lessons_inline_keyboard():
    buttons = [
        [InlineKeyboardButton(text="Lesson 1: Basics", callback_data="lesson_1")],
        [InlineKeyboardButton(text="Lesson 2: Passwords & 2FA", callback_data="lesson_2")],
        [InlineKeyboardButton(text="Lesson 3: Phishing", callback_data="lesson_3")],
        [InlineKeyboardButton(text="Lesson 4: Wi-Fi Security", callback_data="lesson_4")],
        [InlineKeyboardButton(text="Lesson 5: Antivirus & Updates", callback_data="lesson_5")],
    ]
    return InlineKeyboardMarkup(inline_keyboard=buttons)

# ---------- COMMAND HANDLERS ----------
@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        "👋 Welcome to **InnoSecSchool Bot**!\n\n"
        "I can help you with:\n"
        "✅ InfoSec questions\n"
        "✅ Navigating our 5 online lessons\n"
        "✅ Account issues on the website\n\n"
        "Use /help to see what I can do.",
        reply_markup=main_keyboard(),
        parse_mode="Markdown"
    )

@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    await message.answer(
        "📖 *Commands:*\n"
        "/start – Restart the bot\n"
        "/help – Show this message\n"
        "/lessons – List all lessons\n"
        "/faq – Common security questions\n\n"
        "Or just ask me anything about cybersecurity!"
    )

@dp.message(Command("lessons"))
async def cmd_lessons(message: types.Message):
    await message.answer(
        "📚 *Our 5 InfoSec Lessons:*\n\n"
        "1️⃣ Foundations of InfoSec\n"
        "2️⃣ Password Management & 2FA\n"
        "3️⃣ Phishing & Social Engineering\n"
        "4️⃣ Wi‑Fi & Network Security\n"
        "5️⃣ Antivirus, Firewalls & Updates\n\n"
        "👉 Full details on our website: https://your-site.com/lessons",
        parse_mode="Markdown"
    )

@dp.message(Command("faq"))
async def cmd_faq(message: types.Message):
    await message.answer(
        "❓ *Common Questions:*\n\n"
        "• *How to create a strong password?* – Use 12+ chars with mixed case, numbers, symbols.\n"
        "• *What is phishing?* – Fake emails/websites that steal your data.\n"
        "• *Is public Wi-Fi safe?* – Use a VPN and HTTPS.\n\n"
        "Ask me more!",
        parse_mode="Markdown"
    )

# ---------- TEXT MESSAGE HANDLER (basic Q&A) ----------
@dp.message()
async def answer_question(message: types.Message):
    text = message.text.lower()
    if "password" in text or "strong password" in text:
        await message.answer(
            "🔐 *Strong Password Tips:*\n"
            "• Minimum 12 characters\n"
            "• Uppercase + lowercase + numbers + symbols\n"
            "• Avoid common words or personal info\n"
            "• Use a password manager (Bitwarden, 1Password)",
            parse_mode="Markdown"
        )
    elif "phishing" in text:
        await message.answer(
            "🎣 *Phishing* is a scam where attackers impersonate legitimate services.\n"
            "⚠️ Never click suspicious links or share personal data via email.",
            parse_mode="Markdown"
        )
    elif "2fa" in text or "two-factor" in text:
        await message.answer(
            "🔑 *Two-Factor Authentication (2FA)* adds an extra layer of security.\n"
            "Enable it on all accounts that support it (Google, GitHub, email, etc.).",
            parse_mode="Markdown"
        )
    elif "wifi" in text or "wi-fi" in text:
        await message.answer(
            "📡 *Public Wi-Fi Risks:*\n"
            "• Use a VPN\n"
            "• Only visit HTTPS sites\n"
            "• Turn off file sharing\n"
            "• Forget the network after use",
            parse_mode="Markdown"
        )
    elif "lesson" in text:
        await message.answer("Choose a lesson:", reply_markup=lessons_inline_keyboard())
    else:
        await message.answer(
            "I'm still learning. Try asking about passwords, phishing, 2FA, Wi-Fi, or use /lessons.\n"
            "You can also visit our website for full lessons."
        )

# ---------- CALLBACK QUERY HANDLER (inline buttons) ----------
@dp.callback_query(lambda c: c.data.startswith("lesson_"))
async def inline_lesson_info(callback: types.CallbackQuery):
    lesson_num = callback.data.split("_")[1]
    lessons = {
        "1": "📘 *Lesson 1: Foundations of InfoSec*\nCIA triad: Confidentiality, Integrity, Availability. Learn basic threats and why security matters.",
        "2": "🔐 *Lesson 2: Password Management & 2FA*\nStrong passwords, password managers, and enabling two-factor authentication.",
        "3": "🎣 *Lesson 3: Phishing & Social Engineering*\nHow to recognize scams, fake emails, and psychological tricks.",
        "4": "📡 *Lesson 4: Wi‑Fi & Network Security*\nSecure your home network, use VPNs, and stay safe on public hotspots.",
        "5": "🛡️ *Lesson 5: Antivirus, Firewalls & Updates*\nEssential software layers, regular patching, and defense in depth."
    }
    await bot.send_message(
        callback.from_user.id,
        lessons.get(lesson_num, "Lesson not found. Visit our website."),
        parse_mode="Markdown"
    )
    await callback.answer()

# ---------- MAIN ----------
async def main():
    print("Bot is running...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
