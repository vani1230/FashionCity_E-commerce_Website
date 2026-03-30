import express from 'express'
import {deleteAddress, addAddress, fetchAll, editAddress} from '../controllers/address/address.controller.js' 
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware.js'

const Router = express.Router()

Router.post('/add',AuthMiddlewareController,addAddress)
Router.get('/get/:userId',AuthMiddlewareController,fetchAll )
Router.delete('/delete/:userId/:addressId',AuthMiddlewareController,deleteAddress )
Router.put('/update/:userId/:addressId',AuthMiddlewareController,editAddress )

export default Router