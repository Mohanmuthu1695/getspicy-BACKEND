const { query, response } = require("express");
const connection = require("../config/connection");
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
require("dotenv").config()


const dashboardCount = async (req, res) => {
    var productCount;
    var categoryCount;
    var billCount;
    
    var query = "SELECT COUNT(id) AS categoryCount FROM category";
    connection.query(query, (err, result) => {
      if (err) {
        return res.status(400).json(err); // Return error response and exit
      }
      categoryCount = result[0].categoryCount;
  
      query = "SELECT COUNT(id) AS productCount FROM product";
      connection.query(query, (err, result) => {
        if (err) {
          return res.status(400).json(err); // Return error response and exit
        }
        productCount = result[0].productCount;
  
        query = "SELECT COUNT(id) AS billCount FROM bill";
        connection.query(query, (err, result) => {
          if (err) {
            return res.status(400).json(err); // Return error response and exit
          }
          billCount = result[0].billCount;
  
          var data = {
            category: categoryCount,
            product: productCount,
            bill: billCount,
          };
          return res.status(200).json(data); // Return success response
        });
      });
    });
  };
  
module.exports={dashboardCount}