// server.js
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'restaurant',
    password: 'Lakshyab@1237',
    port: 5432,
});
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html');
});


app.get('/', (req, res) => {
    res.render('index');
});




app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
            req.session.userId = result.rows[0].id;
            res.redirect('/');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// server.js
// ... (previous code)

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
            req.session.userId = result.rows[0].id;
            res.redirect('/dashboard'); // Redirect to the dashboard after successful login
        } else {
            res.render('login', { error: 'Invalid username or password' }); // Render login page with error message
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/dashboard', (req, res) => {
    // Check if the user is authenticated
    if (req.session.userId) {
        res.sendFile(__dirname + '/views/dashboard.html');
    } else {
        res.redirect('/login'); // Redirect to login if not authenticated
    }
});
// server.js
// ... (previous code)

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length > 0 && bcrypt.compareSync(password, result.rows[0].password)) {
            req.session.userId = result.rows[0].id;
            res.redirect('/dashboard?success=1'); // Redirect to the dashboard with success query parameter
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.redirect('/login?success=1'); // Redirect to the login page with success query parameter
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// ... (remaining code)





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
