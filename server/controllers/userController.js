import { v4 as uuidv4 } from "uuid";
import { users } from "../database/inMemoryDB.js";
import { createError } from "../utils/error.js";

// Register a new user
export const registerUser = (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return next(createError(400, "Email and name are required"));
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return next(createError(400, "User already exists"));
    }

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    next(error);
  }
};

// Check if a user exists
export const checkUserExists = (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return next(createError(400, "Email is required"));
    }

    const user = users.find((user) => user.email === email);

    res.json({ exists: !!user });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = (req, res, next) => {
  try {
    const { id } = req.params;

    const user = users.find((user) => user.id === id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Don't send sensitive information
    const { password, ...userInfo } = user;

    res.json(userInfo);
  } catch (error) {
    next(error);
  }
};

// Get all users (for admin purposes)
export const getAllUsers = (req, res, next) => {
  try {
    // Don't send sensitive information
    const safeUsers = users.map((user) => {
      const { password, ...userInfo } = user;
      return userInfo;
    });

    res.json(safeUsers);
  } catch (error) {
    next(error);
  }
};
