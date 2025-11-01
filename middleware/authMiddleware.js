import jwt from "jsonwebtoken";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../models/firebaseConfig.js";

export const verifyTokenMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Check if token is provided
  if (!token) {
    return res.status(401).json({
      status: "FAIL",
      message: "Missing authentication token."
    });
  }

  try {
    // Check if token is in the Firestore blocklist
    const blocklistDoc = await getDoc(doc(db, "tokenBlocklist", token));
    if (blocklistDoc.exists()) {
      return res.status(401).json({
        status: "FAIL",
        message: "Invalid or expired session."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "FAIL",
        message: "Session expired. Please log in again."
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "FAIL",
        message: "Invalid token. Please log in again."
      });
    }

    res.status(500).json({
      status: "ERROR",
      message: "An error occurred during token validation."
    });
  }
};

export const addToBlocklist = async (token) => {
  try {
    await setDoc(doc(db, "tokenBlocklist", token), {
      blocklistedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error adding token to blocklist:", error.message);
    throw new Error("Failed to blocklist token.");
  }
};