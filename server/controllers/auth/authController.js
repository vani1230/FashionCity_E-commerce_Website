import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";
import nodemailer from 'nodemailer'


// register
export const RegisterController = async (req, res) => {
  console.log("Controller", req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields required",
    });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    console.log("Register Error:",error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login
export const LoginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Controller:", req.body);
  try {
    // 1️⃣ Check empty fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3️⃣ Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    console.log(process.env.JWT_CLIENT_SECRET_KEY);
    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_CLIENT_SECRET_KEY,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, { httpOnly: true, secure: true,  sameSite: "lax", });

    // 5️⃣ Send response
    // res.status(200).json({
    //   success: true,
    //   message: "Login successful",
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     role: user.role,
    //   },
    // });

    res.status(200).json({
      success:true,
      message:"Logged In Successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.log("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// logout
export const LogoutController = async (req, res) => {
  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
        sameSite: "lax",
        path:'/'

    });

    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something Error Occurred",
    });
  }
};

// auth middleware

// export const AuthMiddleware = (req, res, next) => {
//   try {
//     const token = req.cookies?.token;

//     // If token not present
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized User",
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET_KEY);

//     // Attach decoded user data to request
//     req.user = decoded;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or Expired Token",
//     });
//   }
// };

// forget password
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  console.log("email = ",process.env.EMAIL)
  console.log("Passowrd = ",process.env.EMAIL_PASSWORD)
  console.log("POrt = ",process.env.PORT)
  console.log("mongoURL = ",process.env.MONGO_URL)
  try {

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 60000; // 1 minute expiry
    await user.save();

    // send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Fashion City Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 1 minute.`
    });

    res.json({
      success: true,
      message: "OTP sent to email"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP"
    });
  }
};

// verify otp 
export const verifyOtpController = async(req,res)=>{
  const {email,otp} = req.body
  console.log("Email otp fetch to verify with the user",email,otp)

  try {
    const user = await User.findOne({email})
    console.log(user)
    if(!user) 
      return res.status(404).json({success:false, message:"User Not Found"})
    if(user.resetOtp!=otp)
      return res.status(400).json({success:false, message:"Invalid OTP"})
    if(user.resetOtpExpire <Date.now())
      return res.status(400).json({success:false, message:"OTP Expired"})

     res.json({success:true, message:"OTP verified"})

  } catch (error) {
      res.status(500).json({success:false, message:"Error Verifying OTP"})
  }
}

// update password
export const updatePasswordController = async (req,res)=>{
  const {email,password} = req.body
  console.log("updated information = ",email,password)

  try{
    const user = await User.findOne({email})
    if(!user) 
      return res.json({success:false, message:"User Not Exists"})

    const hashPassword = await bcrypt.hash(password, 12);
    user.password = hashPassword;
    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();

    res.json({
      success: true,
      message: "Password Updated Successfully"
    });
    
  }catch(error){
    res.json({
      success: false,
      message: "Password Reset Failed"
    });
  }
}

// fetching users for admin.dashboard
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");

  res.json({
    success: true,
    users,
  });
};
