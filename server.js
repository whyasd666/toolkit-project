require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API: take all course
app.get('/api/lessons', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, title, short_desc, slug FROM lessons ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// API
app.get('/api/lessons/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await pool.query('SELECT * FROM lessons WHERE slug = $1', [slug]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Lesson not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = { pool };
