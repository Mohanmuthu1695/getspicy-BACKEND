const express=require("express");
const checkRole=require("../service/userrole");
const authenticate=require("../service/authentication")
const connection=require("../config/connection")
const {userSignup,userlogin,forgotPassword,getuser,updatestatus,checkToken,updatePassword}=require("../controllers/userController")
const router=express.Router();
router.post("/signup",userSignup);
router.post("/login",userlogin);
router.post("/forgotPassword",forgotPassword);
router.get("/get",authenticate.authenticate,checkRole.checkRole,getuser);
router.patch("/updateuserStatus",authenticate.authenticate,checkRole.checkRole,updatestatus)
router.get("/checkToken",checkToken);
router.post("/updatepassword",updatePassword);
module.exports=router;