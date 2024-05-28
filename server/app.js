const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db-connect');
const DBServices = require('./db-connect');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//get types
app.get('/getTypes', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllTransactionTypes();
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//get categories
app.get('/getCategories', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getCategories(request.query);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));