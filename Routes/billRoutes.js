const express=require("express");
const {generateReport,getpdf,getAllBills,deleteBill}=require("../controllers/reportController")
const checkRole=require("../service/userrole");
const authenticate=require("../service/authentication")
const router=express.Router();


router.post("/generateReport",authenticate.authenticate,generateReport);
router.post("/getpdf",authenticate.authenticate,getpdf);
router.get("/getAllBills",authenticate.authenticate,getAllBills);
router.delete("/deleteBill/:id",authenticate.authenticate,deleteBill)


module.exports=router