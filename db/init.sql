CREATE TABLE IF NOT EXISTS web_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_desc TEXT,
    content TEXT NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telegram_users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_seen TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT REFERENCES telegram_users(telegram_id),
    question_text TEXT NOT NULL,
    bot_answer TEXT,
    answered BOOLEAN DEFAULT FALSE,
    asked_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO lessons (title, short_desc, content, slug) VALUES
('Foundations of InfoSec', 'CIA triad, basic threats, and why security matters.',
'Lesson 1: Foundations of Information Security\n\nThe core of information security rests on the CIA triad:\n- Confidentiality\n- Integrity\n- Availability\n\nCommon threats: malware, phishing, insider attacks, DDoS.\n\nUnderstanding these principles helps you build a strong security mindset.',
'foundations'),
('Password Management & 2FA', 'Strong passwords, managers, and two-factor authentication.',
'Lesson 2: Password Management & Multi-Factor Authentication\n\nWeak passwords are the number one attack vector. Create strong passwords:\n- At least 12 characters, mix of cases, numbers, symbols.\n- Avoid common words.\n\nUse password managers and enable 2FA.',
'password-security'),
('Phishing & Social Engineering', 'Recognize scams, fake emails, and psychological tricks.',
'Lesson 3: Phishing & Social Engineering\n\nPhishing attacks trick you into revealing credentials. Red flags: urgent language, mismatched URLs, spelling mistakes.\n\nProtection: never click suspicious links, verify sender, enable 2FA.',
'phishing'),
('Wi-Fi & Network Security', 'Secure your home network and stay safe on public Wi-Fi.',
'Lesson 4: Wi-Fi and Network Security\n\nPublic Wi-Fi hotspots are insecure. Use VPN, HTTPS, disable file sharing. At home: use WPA2/WPA3, change default password, disable WPS.',
'wifi-security'),
('Antivirus, Firewalls & Updates', 'Essential software layers and patch management.',
'Lesson 5: Antivirus, Firewalls & Regular Updates\n\nAntivirus detects malware, firewalls block unauthorized access. Keep software updated to patch vulnerabilities.',
'antivirus-updates');
