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
}

module.exports = DBServices;