/*
    MIT License
    
    Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
    Mindoro State University - Philippines

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { auth, db } from "../models/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { addToBlocklist } from "../middleware/authMiddleware.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      status: "FAIL",
      message: "Email and password are required."
    });
  }

  try {
    // Authenticate user with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve additional user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      return res.status(404).json({
        status: "FAIL",
        message: "Account not found."
      });
    }

    const userData = userDoc.data();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.uid, email: user.email, name: userData.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "SUCCESS",
      message: "Login successful.",
      token,
      user: {
        id: user.uid,
        name: userData.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "An error occurred during login. Please try again later."
    });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({
      status: "FAIL",
      message: "Username, email, and password are required."
    });
  }

  try {
    // Register user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save additional user data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      createdAt: new Date()
    });

    res.status(201).json({
      status: "SUCCESS",
      message: "Registration successful.",
      user: {
        id: user.uid,
        username,
        email
      }
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      status: "ERROR",
      message: "An error occurred during registration. Please try again later."
    });
  }
};

export const getUserDetails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Validate token
  if (!token) {
    return res.status(401).json({
      status: "FAIL",
      message: "Invalid or expired session"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Log decoded token for debugging

    const userId = decoded.id;

    // Retrieve user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userId));

    if (!userDoc.exists()) {
      return res.status(404).json({
        status: "FAIL",
        message: "User not found"
      });
    }

    const userData = userDoc.data();

    // Construct response
    res.status(200).json({
      status: "SUCCESS",
      user: {
        id: userId,
        email: userData.email,
        rfid_uid: userData.rfid_uid || "Unknown",
        balance: userData.balance || 0,
        usageHistory: userData.usageHistory || []
      }
    });
  } catch (error) {
    console.error("Error retrieving user details:", error.message);

    // Handle specific JWT errors
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
      message: "An error occurred while retrieving user data"
    });
  }
};

export const logoutUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Validate token
  if (!token) {
    return res.status(401).json({
      status: "FAIL",
      message: "Invalid or missing session token."
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token for logout:", decoded); // Debugging log

    // Add token to Firestore blocklist
    await addToBlocklist(token);

    res.status(200).json({
      status: "SUCCESS",
      message: "User logged out successfully."
    });
  } catch (error) {
    console.error("Error during logout:", error.message);

    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "FAIL",
        message: "Session already ended or token expired."
      });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "FAIL",
        message: "Invalid token."
      });
    }

    res.status(500).json({
      status: "ERROR",
      message: "An error occurred during logout. Please try again later."
    });
  }
};

// export const dashboardPage = (req, res) => {
//   res.status(200).json({ message: "Dashboard endpoint reached" });
// };
