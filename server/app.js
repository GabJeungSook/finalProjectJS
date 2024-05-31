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

//get transactions
app.get('/getTransactions', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllTransactions(request.query);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//save transaction
app.post('/insertTransaction', (request, response) => {

    const db = DBServices.getDBServiceInstance();
    const result = db.insertTransaction(request.body);

    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
})

//get total
app.get('/getTotals', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllTotal(request.query);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//incomes
app.get('/getIncomes', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllIncomeTransactions(request.query);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//expenses
app.get('/getExpenses', (request, response) => {
    const db = DBServices.getDBServiceInstance();

    const result = db.getAllExpenseTransactions(request.query);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//deleteTransaction
app.delete('/deleteTransaction/:transaction_number', (request, response) => {
    const { transaction_number } = request.params;
    const db = DBServices.getDBServiceInstance();
    const result = db.deleteTransaction(transaction_number);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
})

app.patch('/updateTransaction', (request, response) => {
    const db = DBServices.getDBServiceInstance();
    const result = db.updateTransaction(request.body);
    result
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
})




app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));