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

    async getAllTransactions({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'day':
                        query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE DATE(t.date) = CURDATE();";
                        break;
                    case 'week':
                        query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE YEARWEEK(t.date) = YEARWEEK(CURDATE());";
                        break;
                    case 'month':
                        query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE MONTH(t.date) = MONTH(CURDATE()) AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    case 'year':
                        query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    default:
                        query = "SELECT t.transaction_number, t.type_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id;"; 
                        break;
                }
               
               
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

    async getAllTotal({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'day':
                        query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions WHERE DATE(date) = CURDATE();";
                        break;
                    case 'week':
                        query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions WHERE YEARWEEK(date) = YEARWEEK(CURDATE());";
                        break;
                    case 'month':
                        query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE());";
                        break;
                    case 'year':
                        query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions WHERE YEAR(date) = YEAR(CURDATE());";
                        break;
                    default:
                        query = "SELECT SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) AS INCOME, SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END) AS EXPENSE, (SUM(CASE WHEN type_id = 1 THEN amount ELSE 0 END) - SUM(CASE WHEN type_id = 2 THEN amount ELSE 0 END)) AS TOTAL FROM transactions;"; 
                        break;
                }
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

    async getAllIncomeTransactions({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'day':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 1 AND DATE(t.date) = CURDATE();";
                        break;
                    case 'week':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 1 AND YEARWEEK(t.date) = YEARWEEK(CURDATE());";
                        break;
                    case 'month':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 1 AND MONTH(t.date) = MONTH(CURDATE()) AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    case 'year':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 1 AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    default:
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 1;"; 
                        break;
                }
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

    async getAllExpenseTransactions({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'day':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 2 AND DATE(t.date) = CURDATE();";
                        break;
                    case 'week':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 2 AND YEARWEEK(t.date) = YEARWEEK(CURDATE());";
                        break;
                    case 'month':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 2 AND MONTH(t.date) = MONTH(CURDATE()) AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    case 'year':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 2 AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    default:
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date FROM transactions t INNER JOIN categories c ON t.category_id = c.id WHERE t.type_id = 2;"; 
                        break;
                }
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

    async deleteTransaction(transaction_number)
    {
        try{
            const response = await new Promise((resolve, reject) => {
            let query = "DELETE FROM transactions WHERE transaction_number = ?";
            db.query(query, transaction_number, (err, results) => {
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

    async updateTransaction({category, description, amount_input, transaction_number})
    {
        try{
            const response = await new Promise((resolve, reject) => {
            let query = "UPDATE transactions SET category_id = ?, description = ?, amount = ? WHERE transaction_number = ?";
            db.query(query, [category, description, amount_input, transaction_number], (err, results) => {
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

    async getAllTransactions({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'day':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date, ty.name AS type_name FROM transactions t INNER JOIN categories c ON t.category_id = c.id INNER JOIN types ty ON t.type_id = ty.id WHERE DATE(t.date) = CURDATE();";
                        break;
                    case 'week':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date, ty.name AS type_name FROM transactions t INNER JOIN categories c ON t.category_id = c.id INNER JOIN types ty ON t.type_id = ty.id WHERE YEARWEEK(t.date) = YEARWEEK(CURDATE());";
                        break;
                    case 'month':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date, ty.name AS type_name FROM transactions t INNER JOIN categories c ON t.category_id = c.id INNER JOIN types ty ON t.type_id = ty.id WHERE MONTH(t.date) = MONTH(CURDATE()) AND YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    case 'year':
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date, ty.name AS type_name FROM transactions t INNER JOIN categories c ON t.category_id = c.id INNER JOIN types ty ON t.type_id = ty.id WHERE YEAR(t.date) = YEAR(CURDATE());";
                        break;
                    default:
                        query = "SELECT t.transaction_number, t.type_id, t.category_id, c.name, t.description, t.amount, t.date, ty.name AS type_name FROM transactions t INNER JOIN categories c ON t.category_id = c.id INNER JOIN types ty ON t.type_id = ty.id;"; 
                        break;
                }
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

    async getChartData({filter}) {
        try {
            const response = await new Promise((resolve, reject) => {
                let query = "";
                switch(filter)
                {
                    case 'income':
                         query = "SELECT MONTHNAME(date) AS month, SUM(amount) AS total_amount FROM transactions WHERE type_id = 1 GROUP BY MONTH(date) ORDER BY MONTH(date);";
                        break;
                    case 'expense':
                         query = "SELECT MONTHNAME(date) AS month, SUM(amount) AS total_amount FROM transactions WHERE type_id = 2 GROUP BY MONTH(date) ORDER BY MONTH(date);";
                        break;
                    default:
                        query = "SELECT MONTHNAME(date) AS month, SUM(amount) AS total_amount FROM transactions GROUP BY MONTH(date) ORDER BY MONTH(date);";
                    }
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