
import jwt from 'jsonwebtoken'

export const AuthMiddlewareController = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // If token not present
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized User",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_CLIENT_SECRET_KEY);

    // Attach decoded user data to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    });
  }
};