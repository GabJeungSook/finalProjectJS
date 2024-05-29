const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Connected to database');
});

class DBServices {
    static getDBServiceInstance() {
        return instance ? instance : new DBServices();
    }

    async getAllTransactionTypes() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM types;";
                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async getCategories({id}) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT id, name FROM categories WHERE type_id = ?;";
                db.query(query, [id], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async getAllTransactions() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id;";
                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

    async insertTransaction({user, transaction_number, type, category, description, amount, date}) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO transactions (user_id, type_id, category_id, transaction_number, description, amount, date) VALUES (?, ?, ?, ?, ?, ?, ?);";
                db.query(query, [user, type, category, transaction_number, description, amount, date], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });

            return {response};
        } catch (error)
        {
            console.log(error);
        }
    }

    async getAllTotal() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions;";
                db.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                });
            });
            return response;
        } catch (error)
        {
            console.log(error);
        }
    }

}

module.exports = DBServices;