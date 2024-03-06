const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "database-1.cjiy17cnskqb.ap-south-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "password",
  database: "Votingsystem",
  // connectTimeout: 20000,
});

module.exports = {
  connect: () => {
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
      }
      console.log("Connected to MySQL as id " + connection.threadId);
    });
  },
  getConnection: () => connection,
};
