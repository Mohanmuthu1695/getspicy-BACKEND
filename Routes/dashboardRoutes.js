const express=require("express");
const {dashboardCount}=require("../controllers/dashboardController");
const checkRole=require("../service/userrole");
const authenticate=require("../service/authentication")
const router=express.Router();

router.get("/getData",authenticate.authenticate,dashboardCount);


module.exports=router;