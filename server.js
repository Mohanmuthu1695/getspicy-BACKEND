const express=require('express');
require('dotenv').config();
const http =require("http");
// db
const connection=require("./config/connection")
// 
var cors=require('cors');
const app=express();
app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// routes
app.use("/user",require("./Routes/userRoutes"));
app.use("/category",require("./Routes/categoryRoutes"));
app.use("/product",require("./Routes/productroutes"));
app.use("/bill",require("./Routes/billRoutes"));
app.use("/dashboard",require("./Routes/dashboardRoutes"));
// 
const server=http.createServer(app);
server.listen(process.env.PORT);