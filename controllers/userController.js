const { query, response } = require("express");
const connection = require("../config/connection");
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
require("dotenv").config()

const userSignup = async (req, res) => {
  const { username,contactNumber, email, password } = req.body;

  console.log('Name:', username); // Check if 'name' value is present

  const checkQuery = "SELECT * FROM user WHERE email=?";
  connection.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.error("SELECT error:", err);
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    if (result.length > 0) {
      res.status(400).json({ message: "Email already exists" });
    } else {
      const insertQuery =
        "INSERT INTO user (username,contactNumber, email, password, status, role) VALUES (?, ?, ?, ?, 'false', 'user')";
      connection.query(
        insertQuery,
        [username, contactNumber, email, password],
        (err, result) => {
          if (err) {
            console.error("INSERT error:", err);
            res.status(500).json({ message: "Error inserting data" });
            return;
          }
          console.log("Data inserted successfully");
          res.status(200).json({ message: "Success" });
        }
      );
    }
  });
};
// login api
// /login
const userlogin = async (req, res) => {
  const user = req.body;
  const query = "SELECT email, password, status, role FROM user WHERE email=?";
  connection.query(query, [user.email], (err, result) => {
    if (!err) {
      if (result.length <= 0 || result[0].password !== user.password) {
        res.status(400).json({ message: "Username or password is invalid" });
      } else if (result[0].status === "false") {
        res.status(400).json({ message: "Admin verification pending, please contact admin" });
      } else if (result[0].password === user.password) {
        const response = {
          email: result[0].email,
          role: result[0].role,
        };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "8hr",
        });
        response.token = accessToken; // Add the token to the response object
        res.status(200).json(response);
      } else {
        res.status(400).json({ message: "Try again after some time" });
      }
    } else {
      res.status(400).json({ message: "Username or password is invalid" });
    }
  });
};



  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  const forgotPassword = async (req, res) => {
    const user = req.body;
    const query = "SELECT email, password FROM user WHERE email=?";
    connection.query(query, [user.email], (err, result) => {
      if (!err) {
        if (result.length <= 0) {
          return res
            .status(200)
            .json({ message: "User credentials successfully sent to your email" });
        } else {
          const mailerOptions = {
            from: process.env.EMAIL_ID,
            to: result[0].email,
            subject: "User Details of GET SPICY",
            html:
              "<p><b>USER CREDENTIAL</b><br><b>Email: </b>" +
              result[0].email +
              "<br><b>Password: </b>" +
              result[0].password +
              '<br>Click the following link to login <a href="#">GET SPICY </a></p>',
          };
  
          transporter.sendMail(mailerOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
                console.log(response.info)
              return res
                .status(200)
                .json({ message: "User credentials successfully sent" });
            }
          });
        }
      } else {
        console.log("Error sending email:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  };
  const getuser=async(req,res)=>{
    var query="SELECT id, username,email,contactNumber,status FROM user WHERE role = 'user'";
    connection.query(query,(err,result)=>{
        if(!err){
           return res.status(200).json(result)
        }else{
            res.status(400).json({message:"no user"})
        }
    })
  };
  const updatestatus = async (req, res) => {
    let user = req.body;
    const query = 'UPDATE user SET status=? WHERE id = ?'; // Add the condition for the id column
    connection.query(query, [user.status, user.id], (err, result) => { // Pass values as an array
      if (!err) {
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: "No user found with the provided id" });
        }
        return res.status(200).json({ message: `User updated successfully : ${user.status}` });
      } else {
        return res.status(400).json({ message: "Error updating user" });
      }
    });
  };
  
  const checkToken=async(req,res)=>{
    res.status(200).json({message:"true"})
  }
  const updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
  
    const selectQuery = "SELECT password FROM user WHERE email = ?";
    connection.query(selectQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error retrieving user data" });
      }
  
      if (result.length === 0) {
        return res.status(400).json({ message: "No user found with the provided email" });
      }
  
      const storedPassword = result[0].password;
      // Compare the old password with the stored password
      if (storedPassword !== oldPassword) {
        return res.status(401).json({ message: "Invalid old password" });
      }
  
      const updateQuery = "UPDATE user SET password = ? WHERE email = ?";
      connection.query(updateQuery, [newPassword, email], (err, result) => {
        if (!err) {
          if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No user found with the provided email" });
          }
          return res.status(200).json({ message: "Password updated successfully" });
        } else {
          return res.status(400).json({ message: "Error updating password" });
        }
      });
    });
  };
  
module.exports = { userSignup,userlogin,forgotPassword,getuser,updatestatus,checkToken,updatePassword };
