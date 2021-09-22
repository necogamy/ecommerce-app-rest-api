const express = require('express');
const app = express();
const pool = require('./db/db');
const PORT = 3000;

app.get('/probe', async (req, res) => {
    try {
        const query = await pool.query('SELECT * FROM probe;');
        res.status(200).send(query.rows);
    } catch(e) {
        res.status(500).send(e);
    }
});



app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`);
});

module.exports = app;