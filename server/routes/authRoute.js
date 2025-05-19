import express from "express";
import { login, logout, verifyAuth } from "../controllers/authController.js";

const router = express.Router();

// Login route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Verify authentication
router.get("/verify", verifyAuth);

export default router;
