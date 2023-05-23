const mysql = require("mysql");
require("dotenv").config();

const port = 3306;
const dbName = process.env.DB_NAME || 'cafemanagement';

const connection = mysql.createConnection({
  port,
  host: 'localhost',
  user: 'root',
  password: '',
  database: dbName
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  
  console.log(`Database connected on port ${port} with database: ${dbName}`);
  
  const queries = [
    `CREATE TABLE IF NOT EXISTS bill (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      contactNumber VARCHAR(255) NOT NULL,
      payementMethod VARCHAR(255) NOT NULL,
      total INT NOT NULL,
      productDetails JSON DEFAULT NULL,
      CreatedBy VARCHAR(255)
    );`,
    `CREATE TABLE IF NOT EXISTS user (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      contactNumber VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS product (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      categoryID INT NOT NULL,
      description VARCHAR(255),
      price VARCHAR(20),
      status VARCHAR(30)
    );`
  ];
  
  queries.forEach((query) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }

      console.log('Table created successfully');
    });
  });
});

module.exports = connection;
