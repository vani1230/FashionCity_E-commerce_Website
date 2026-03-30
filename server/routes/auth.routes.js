import express from 'express'
import {RegisterController, getAllUsers,updatePasswordController,LoginController,LogoutController, forgotPasswordController, verifyOtpController} from '../controllers/auth/authController.js'
import { AuthMiddlewareController } from '../middlewares/AuthMiddleware.js'
import User from '../models/User.model.js'
const Router = express.Router()

Router.post('/register',RegisterController)
Router.post('/login',LoginController)
Router.post('/logout',LogoutController)
Router.post('/forgetPassword',forgotPasswordController)
Router.post('/verifyotp',verifyOtpController)
Router.post('/updatepassword',updatePasswordController)
Router.get('/users',getAllUsers)
Router.get("/checkAuth", AuthMiddlewareController, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

Router.get("/me", AuthMiddlewareController, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

export default Router