import express from 'express'
import {addtoCart, removeItemFromCart, fetchAllCartItems, clearAllCart,increaseQty,decreaseQty} from '../controllers/cart/cart.controller.js' 
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware.js'
const Router = express.Router();

Router.post('/add',AuthMiddlewareController,addtoCart)
Router.post('/remove',AuthMiddlewareController,removeItemFromCart)
Router.get('/fetchAll',AuthMiddlewareController,fetchAllCartItems)
Router.delete('/delete',AuthMiddlewareController,clearAllCart)
Router.post('/decrease',AuthMiddlewareController,decreaseQty)
Router.post('/increase',AuthMiddlewareController,increaseQty)

export default Router 