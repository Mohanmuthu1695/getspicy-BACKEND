const { query, response } = require("express");
const connection = require("../config/connection");
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
require("dotenv").config();



const addProduct=async(req,res)=>{
    let product=req.body;
    var query="INSERT INTO product (name,categoryID,description,price,status) VALUES (?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryID,product.description,product.price,product.status],(err,result)=>{
if(!err){
    return res.status(200).json({
        message:"product added sucessfully "
    })
}else{
    return res.status(500).json(err)
}
    })
};
const getProduct = async (req, res) => {
    var query =
      "SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryID, c.name AS categoryName FROM product AS p INNER JOIN category AS c ON p.categoryID = c.id";
    connection.query(query, (err, result) => {
      if (!err) {
        return res.status(200).json(result);
      } else {
        return res.status(500).json({ message: "Error retrieving products" });
      }
    });
  };
const getProductByCategory=async(req,res,next)=>{
    const id=req.params.id;
    var query="SELECT id,name FROM product WHERE categoryID=? AND status='true'";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            return res.status(200).json(result)

        }else{
            return res.status(400).json({message:"no product on id"})
        }
    })
};
const getById=async(req,res,next)=>{
    const id=req.params.id;
    var query="SELECT id,name,description,price FROM product WHERE id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            return res.status(200).json(result[0]); 
        }else {
            return res.status(500).json({ message: "Error retrieving products" });
          }
    })
};
const updateProduct = async (req, res, next) => {
    try {
      const product = req.body;
      const query = "UPDATE product SET name=?, categoryID=?, description=?, price=? WHERE id=?";
      connection.query(query, [product.name, product.categoryID, product.description, product.price, product.id], (err, result) => {
        if (!err) {
          if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No product found" });
          }
          return res.status(200).json({ message: "Product updated successfully" });
        } else {
          return res.status(400).json({ message: "Failed to update product" });
        }
      });
    } catch (err) {
      next(err);
    }
  };
  
const deleteProduct=async(req,res,next)=>{
    const id=req.params.id;
    var query="DELETE FROM product WHERE id=?";
    connection.query(query,[id],(err,result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(400).json({
                    message:"id not found"
                })   
            }
            return res.status(200).json({
                message:"Product deleted .."
            })

        }else{
            return res.status(400).json({
                message:"id not found"
            })
        }
    })
};
const updateProductStatus = async (req, res, next) => {
    let product = req.body;
    var query = "UPDATE product SET status=? WHERE id=?";
    connection.query(query, [product.status, product.id], (err, result) => {
      if (!err) {
        if (result.affectedRows === 0) {
          return res.status(400).json({ message: "No product found with the provided id" });
        }
        return res.status(200).json({ message: "Product status updated successfully" });
      } else {
        return res.status(500).json({ message: "Error updating product status" });
      }
    });
  };
  


module.exports={addProduct,getProduct,getProductByCategory,getById,updateProduct,deleteProduct,updateProductStatus}