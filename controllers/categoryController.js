const { query, response } = require("express");
const connection = require("../config/connection");
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
require("dotenv").config()


const addCategory=async(req,res)=>{
    let category=req.body;
    var query="INSERT INTO category (name) values (?)";
    connection.query(query,[category.name],(err,result)=>{
        if(!err){
            return res.status(200).json({message:"category added sucessfully"})
        }else{
            return res.status(401).json(err)
        }
    })
};

const getCategory=async(req,res)=>{
    var query="SELECT * FROM category ORDER BY id"
    connection.query(query,(err,result)=>{
        if(!err){
            return res.status(200).json(result)
        }else{
            return res.status(401).json({message:"no product to display"})
        }
    })
}
const updateCategory = async (req, res) => {
    let category = req.body;
    var query = "UPDATE category SET name=? WHERE id=?";
    connection.query(query, [category.name, category.id], (err, result) => {
      if (!err) {
        if (result.affectedRows === 0) {
          return res.status(400).json({
            message: "Category not found or not changed",
          });
        } else {
          return res.status(200).json({ message: "Category updated successfully" });
        }
      } else {
        return res.status(500).json({ message: "Error updating category" });
      }
    });
  };
  
module.exports={addCategory,getCategory,updateCategory}