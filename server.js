const express = require('express');
const app = express();
const usersRoute = require('./routes/users'),
productsRoute = require('./routes/products');
const PORT = 3000;


app.use(express.json());
app.use(usersRoute);
app.use(productsRoute);


app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`);
});

module.exports = app;