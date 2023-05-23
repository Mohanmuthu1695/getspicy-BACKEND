const express=require("express");
const {addProduct,getProduct,getProductByCategory,getById,deleteProduct,updateProductStatus}=require("../controllers/productController")
const checkRole=require("../service/userrole");
const authenticate=require("../service/authentication")
const router=express.Router();

router.post("/add",authenticate.authenticate,checkRole.checkRole,addProduct);
router.get("/getproduct",authenticate.authenticate,getProduct);
router.get("/getBycategory/:id",authenticate.authenticate,getProductByCategory);
router.get("/getById/:id",authenticate.authenticate,getById);
router.delete("/deleteProduct/:id",authenticate.authenticate,checkRole.checkRole,deleteProduct);
router.patch("/updateProductStatus",authenticate.authenticate,checkRole.checkRole,updateProductStatus)





module.exports=router;