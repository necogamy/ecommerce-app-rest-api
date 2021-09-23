const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const errorHandler = require('errorhandler');
const createResponse = require('../utils/createResponse');
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// Middlewares
router.use(express.json());

router.param('id', async (req, res, next, id) => {
    try {
        if (id) {
            id = Number(id);

            const user = await pool.query(`
                SELECT *
                FROM user_data
                WHERE id = $1
            `, [id]);
    
            if (!user.rows) return res.sendStatus(404)
            else if (user.rows.length < 1) return res.sendStatus(204);
    
            req.id = id;
            req.user = user;
            next();
        }
    }
    catch(err) {
        next(err);
    }
});


// Routes
router.get('/users/login', async (req, res) => {
    try {
        const { username, password } = req.query;

        const userData = await pool.query(`
            SELECT *
            FROM user_data
            WHERE
                username = $1
                AND
                password = $2;
        `, [username, password]);

        if (userData.rows.length < 1) return res.status(400).send('Username or password incorrect');
          
        const SESSION_KEY = 'user_session.key';
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData.rows));
        const retrieveUserInfo = JSON.parse(localStorage.getItem(SESSION_KEY));

        

        res.status(200).send(userData.rows);
    }
    catch(e) {
        res.status(400).send('Username or password incorrect');
    }
});

router.post('/users/register', async (req, res) => {
    try {
        const { password, username } = req.body;

        const select = await pool.query(`
            SELECT MAX(id)
            FROM user_data;
        `);
        const id = select.rows[0].max + 1;

        await pool.query(`
            INSERT INTO user_data
            VALUES ($1, $2, $3);
        `, [id, password, username]);

        const itemCreated = await pool.query(`
            SELECT *
            FROM user_data
            WHERE id = $1;
        `, [id]);

        res.status(201).send(
            createResponse(201, 'CREATED', 'itemCreated', itemCreated.rows[0])
        )
    }
    catch(err) {
        res.status(409).send('Username already exists');
    }
});

router.get('/users/:id', async (req, res) => {
    res.status(200).send(
        createResponse(200, 'OK', 'user', req.user.rows[0])
    );
});

router.put('/users/:id', async (req, res) => {
    const { id } = req;

    try {
        const { password, username } = req.body;

        await pool.query(`
            UPDATE 
                user_data
            SET 
                password = $1, 
                username = $2
            WHERE 
                id = $3;
        `, [password, username, id]);

        const item = await pool.query(`
            SELECT *
            FROM user_data
            WHERE id = $1;
        `, [id]);

        res.status(200).send(
            createResponse(200, 'UPDATE OK', 'updatedItem', item.rows[0])
        );
    }
    catch(err) {
        res.sendStatus(500);
    }
});

router.delete('/users/:id', async (req, res) => {
    const { id, user } = req;

    await pool.query(`
        DELETE FROM user_data
        WHERE id = $1;
    `, [id]);

    res.status(200).send(
        createResponse(200, 'DELETE OK', 'updatedItem', user.rows[0])
    );
});

router.get('/users', async (req, res) => {
    try {
        const users = await pool.query(`
            SELECT *
            FROM user_data;
        `);

        if (users.rows.length < 1) return res.sendStatus(204);

        res.status(200).send(
            createResponse(200, 'OK', 'users', users.rows)
        );
    }
    catch(err) {
        res.sendStatus(500);
    }
});

router.use((err, req, res, next) => {
    res.status(500).send(errorHandler());
});


module.exports = router;