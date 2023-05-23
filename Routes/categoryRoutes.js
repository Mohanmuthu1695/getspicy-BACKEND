const express=require("express");
const {addCategory,getCategory,updateCategory}=require("../controllers/categoryController")
const checkRole=require("../service/userrole");
const authenticate=require("../service/authentication")
const router=express.Router();
router.post("/addcategory",checkRole.checkRole,authenticate.authenticate,addCategory);
router.get("/getcategory",authenticate.authenticate,getCategory);
router.patch("/updatecategory",authenticate.authenticate,checkRole.checkRole,updateCategory);


module.exports=router;