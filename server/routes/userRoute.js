import express from "express";
import {
  registerUser,
  checkUserExists,
  getUserById,
  getAllUsers,
} from "../controllers/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Check if a user exists
router.get("/check", checkUserExists);

// Get user by ID
router.get("/:id", getUserById);

// Get all users (for admin purposes)
router.get("/", getAllUsers);

export default router;
