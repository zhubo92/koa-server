const mysql = require("mysql2");

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;

// 创建连接池
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
    user: DB_USERNAME,
    password: DB_PASSWORD,
});

// 数据库查询
function dbQuery(sql, values) {
    try {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                connection.query(sql, values, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                    connection.release();
                });
            });
        });
    } catch (e) {
        console.log(e, 'error');
        return Promise.reject();
    }
}

module.exports = {dbQuery};