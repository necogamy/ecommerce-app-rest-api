const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const createResponse = require('../utils/createResponse');
const errorHandler = require('errorhandler');

router.get('/products', async (req, res) => {
    try {
        const products = await pool.query(`
            SELECT *
            FROM product;
        `);

        if (products.rows.length < 1) return res.sendStatus(204);

        res.status(200).send(createResponse(200, 'OK', 'products', products.rows));
    } 
    catch(err) {
        res.sendStatus(404);
    }
});

router.post('/products/add', async (req, res) => {
    try {
        const { product_name, price, quantity } = req.body;

        const select = await pool.query(`
            SELECT MAX(id)
            FROM product;
        `);
        const id = select.rows[0].max + 1;

        await pool.query(`
            INSERT INTO product
            VALUES ($1, $2, $3, $4)
        `, [id, product_name, price, quantity]);

        const createItem = await pool.query(`
            SELECT *
            FROM product
            WHERE id = $1;
        `, [id]);

        res.status(200).send(createResponse(201, 'CREATED', 'createdProduct', createItem.rows[0]));
    }
    catch(err) {
        res.sendStatus(500);
    }
});

router.param('id', async (req, res, next, id) => {
    try {
        if (id) {
            id = Number(id);

            const product = await pool.query(`
                SELECT *
                FROM product
                WHERE id = $1
            `, [id]);
    
            if (!product.rows) return res.sendStatus(404)
            else if (product.rows.length < 1) return res.sendStatus(204);
    
            req.id = id;
            req.product = product;
            next();
        }
    }
    catch(err) {
        next(err);
    }
});

router.get('/products/:id', (req, res) => {
    res.status(200).send(
        createResponse(200, 'OK', 'product', req.product.rows[0])
    )
});

router.delete('/products/:id', async (req, res) => {
    const { id } = req;
    
    await pool.query(`
        DELETE FROM product
        WHERE id = $1;
    `, [id]);

    res.status(200).send(
        createResponse(200, 'DELETED', 'deletedProduct', req.product.rows[0])
    );
});

router.put('/products/:id', async (req, res) => {
    const { id } = req;
    const { product_name, price, quantity } = req.body;
    
    try {
        await pool.query(`
            UPDATE product
            SET
                product_name = $1,
                price = $2,
                quantity = $3
            WHERE id = $4;
        `, [product_name, price, quantity, id]);

        const updatedItem = await pool.query(`
            SELECT *
            FROM product
            WHERE id = $1;
        `, [id]);

        res.status(200).send(
            createResponse(200, 'UPDATE OK', 'updatedItem', updatedItem.rows[0])
        );
    }
    catch(e) {
        res.sendStatus(500);
    }
});

router.use((err, req, res, next) => {
    res.status(500).send(errorHandler());
});

module.exports = router;