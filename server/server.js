import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
// import mongoose from 'mongoose';
import dbConnect from './config/db.js';
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import productRouter from './routes/product.route.js'
import cartRouter from './routes/cart.route.js'
import wishListRouter from './routes/wishlist.route.js'
import addressRouter from './routes/address.route.js'
import orderRouter from './routes/order.route.js'
import paymentRouter from "./routes/payment.route.js";
import path from "path";


const app = express();


dotenv.config();

// data base connection
dbConnect();
// middlewares
app.use(express.json()) 
app.use(cors({
    origin:process.env.CLIENT_BASE_URL,
    methods :['GET','POST','DELETE','PUT'],
    allowedHeaders :[
        'Content-Type',
        'Authorization',
        'Cache-Control',
        'Expires',
        'Pragma'
    ],
    credentials:true
}))
app.use(cookieParser())

// for path -> /auth
app.use('/api/auth',authRouter)

// for path  -> /admin/products
app.use('/api/admin/products',productRouter)

// for cart
app.use('/api/cart',cartRouter)

// for wishlist
app.use('/api/wishlist',wishListRouter)

// for address
app.use('/api/address',addressRouter)

// for order 
app.use("/api/order", orderRouter);

// for payemnt 
app.use("/api/payment", paymentRouter);

// gst bill 
app.use("/invoices", express.static("invoices"));

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})