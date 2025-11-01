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
    
import express from "express";
const router = express.Router();

import { loginUser, registerUser, getUserDetails, logoutUser } from "../controllers/authController.js";
import { verifyTokenMiddleware } from "../middleware/authMiddleware.js";

// Apply middleware to all /api/user/* routes except /api/user/login
router.use("/api/user", (req, res, next) => {
  if (req.path === "/login" || req.path === "/register") {
    return next(); // Skip middleware for login endpoint
  }
  verifyTokenMiddleware(req, res, next);
});

// login endpoint
router.post("/api/user/login", loginUser);

// register endpoint
router.post("/api/user/register", registerUser);

// user details endpoint
router.get("/api/user/details", getUserDetails);

// logout endpoint
router.post("/api/user/logout", logoutUser);

export default router;
