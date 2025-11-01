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
    
import { auth, db } from "../models/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const userId = userCredential.user.uid;
//     res.status(200).json({ message: "Login successful", userId });
//   } catch (error) {
//     console.error("Login error:", error.message);
//     res.status(400).json({ error: "Login failed", details: error.message });
//   }
// };

// export const registerUser = async (req, res) => {
//   const { name, email, password } = req.body;

//   // Validate input data
//   if (!name || !email || !password) {
//     return res.status(400).json({
//       error: "Registration failed",
//       details: "Name, email, and password are required fields."
//     });
//   }

//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Save additional user data to Firestore
//     await setDoc(doc(db, "users", user.uid), {
//       name,
//       email,
//       createdAt: new Date()
//     });

//     res.status(201).json({ message: "Registration successful", userId: user.uid });
//   } catch (error) {
//     console.error("Registration error:", error.message);
//     res.status(400).json({ error: "Registration failed", details: error.message });
//   }
// };

// export const logoutUser = async (req, res) => {
//   try {
//     await signOut(auth);
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     console.error("Logout error:", error.message);
//     res.status(400).json({ error: "Logout failed", details: error.message });
//   }
// };

// export const dashboardPage = (req, res) => {
//   res.status(200).json({ message: "Dashboard endpoint reached" });
// };
