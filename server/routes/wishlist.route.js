import express from 'express'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware.js'
import {addToWishList, removeFromWishList, clearWishlist,fetchWishList} from '../controllers/wishlist/wishlist.controller.js'
const Router = express.Router()

Router.post('/add',AuthMiddlewareController,addToWishList)
Router.get('/fetch',AuthMiddlewareController,fetchWishList)
Router.post('/remove',AuthMiddlewareController,removeFromWishList)
Router.delete('/delete-all',AuthMiddlewareController,clearWishlist)

export default Router