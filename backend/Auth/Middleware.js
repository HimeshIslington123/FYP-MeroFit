import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config(); 


export const authenticate = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(token, "myname");
   

    req.user = decoded;

    // Continue to the next middleware or route
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
