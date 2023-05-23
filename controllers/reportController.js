const {
    query,
    response
} = require("express");
const connection = require("../config/connection");
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
require("dotenv").config();
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
var fs = require("fs");
var uuid = require("uuid");


const generateReport = async (req, res) => {
    const generateUuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);
    const query = "INSERT INTO bill(uuid, name, email, contactNumber, payementMethod, total, productDetails, CreatedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  
    connection.query(query, [generateUuid, orderDetails.name, orderDetails.email, orderDetails.contactNumber, orderDetails.payementMethod, orderDetails.total, orderDetails.productDetails, res.locals.email], (err, result) => {
      if (!err) {
        ejs.renderFile(path.join(__dirname, "report.ejs"), {
          productDetails: productDetailsReport,
          name: orderDetails.name,
          email: orderDetails.email,
          contactNumber: orderDetails.contactNumber,
          payementMethod: orderDetails.payementMethod,
          totalAmount: orderDetails.totalAmount
        }, (err, renderedHtml) => {
          if (err) {
            console.error("Error rendering report template:", err);
            return res.status(400).json({ message: "Report generation failed" });
          } else {
            pdf.create(renderedHtml).toFile(`./Report-pdf/${generateUuid}.pdf`, (err, result) => {
              if (err) {
                console.error("Error generating PDF:", err);
                return res.status(400).json({ message: "Report generation failed" });
              } else {
                return res.status(200).json({ uuid: generateUuid });
              }
            });
          }
        });
      } else {
        console.error("Error inserting data into the database:", err);
        return res.status(400).json({ message: "Report generation failed" });
      }
    });
  };
  
  const getpdf = function (req, res) {
    const orderDetails = req.body;
    const filePath = `./Report-pdf/${orderDetails.uuid}.pdf`;
  
    if (fs.existsSync(filePath)) {
      res.contentType("application/pdf");
      fs.createReadStream(filePath).pipe(res);
    } else {
      const productDetails = JSON.parse(orderDetails.productDetails);
  
      ejs.renderFile(path.join(__dirname, "report.ejs"), {
        productDetails: productDetails,
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        payementMethod: orderDetails.payementMethod,
        totalAmount: orderDetails.totalAmount
      }, (err, renderedHtml) => {
        if (err) {
          console.error("Error rendering report template:", err);
          return res.status(400).json({ message: "Report generation failed" });
        } else {
          pdf.create(renderedHtml).toFile(filePath, (err, result) => {
            if (err) {
              console.error("Error generating PDF:", err);
              return res.status(400).json({ message: "Report generation failed" });
            } else {
              res.contentType("application/pdf");
              fs.createReadStream(filePath).pipe(res);
            }
          });
        }
      });
    }
  };
  const getAllBills=async(req,res)=>{
    var query="SELECT * FROM bill ORDER BY id DESC"
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result);
        }else{
            return res.status(401).json(err)
        }
    })
  }
  const deleteBill=async(req,res,next)=>{
    const id=req.params.id;
    var query="DELETE FROM bill WHERE id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
           if(result.affectedRows==0){
            return res.status(500).json({
                message:"no bill id found"
            })
           }
           return res.status(200).json({
            message:"Bill deleted sucessfully"
           })

        }else{
            return res.status(500).json({
                message:"no id found"
            })
        }
    })
  }
  
  
  module.exports = { generateReport, getpdf,getAllBills ,deleteBill};
  
  
 