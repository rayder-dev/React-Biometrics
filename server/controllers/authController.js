import { users, credentials } from "../database/inMemoryDB.js";
import { createError } from "../utils/error.js";

// Login
export const login = (req, res, next) => {
  try {
    const { email, credentialId } = req.body;

    if (!email) {
      return next(createError(400, "Email is required"));
    }

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // In a real application, you would verify the credential
    // For this demo, we'll just check if the user has a credential

    const userCredential = credentials.find((cred) => cred.userId === user.id);
    if (!userCredential) {
      return next(createError(401, "No credential found for this user"));
    }

    // Set a cookie for authentication
    res.cookie("authToken", user.id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "strict",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout
export const logout = (req, res, next) => {
  try {
    res.clearCookie("authToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

// Verify authentication
export const verifyAuth = (req, res, next) => {
  try {
    const authToken = req.cookies.authToken;

    if (!authToken) {
      return next(createError(401, "Not authenticated"));
    }

    const user = users.find((user) => user.id === authToken);
    if (!user) {
      return next(createError(401, "Invalid authentication"));
    }

    res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};
