import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config(); // Load env variables


export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, "myname");
     console.log("✅ Decoded token:", decoded); // add this

    // Attach decoded data (like user id, email) to req.user
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
