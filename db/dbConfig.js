const mysql2 = require("mysql2");
const dbConnection = mysql2.createPool({
  user: process.env.USE,
  password: process.env.PASSWORD,
  host: "localhost",
  database: process.env.DATABASE,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
