import { v4 as uuidv4 } from "uuid";
import { users, credentials } from "../database/inMemoryDB.js";
import { createError } from "../utils/error.js";

// Register a new credential
export const registerCredential = (req, res, next) => {
  try {
    const { email, credential } = req.body;

    if (!email || !credential) {
      return next(createError(400, "Email and credential are required"));
    }

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Check if credential already exists
    const existingCredential = credentials.find(
      (cred) => cred.userId === user.id && cred.credential.id === credential.id
    );

    if (existingCredential) {
      return next(createError(400, "Credential already registered"));
    }

    // Store credential
    const newCredential = {
      id: uuidv4(),
      userId: user.id,
      credential,
      createdAt: new Date().toISOString(),
    };

    credentials.push(newCredential);

    res.status(201).json({
      message: "Credential registered successfully",
      credentialId: newCredential.id,
    });
  } catch (error) {
    next(error);
  }
};

// Get credential info
export const getCredentialInfo = (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return next(createError(400, "Email is required"));
    }

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Find credential
    const credential = credentials.find((cred) => cred.userId === user.id);
    if (!credential) {
      return next(createError(404, "Credential not found"));
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      credential: credential.credential,
    });
  } catch (error) {
    next(error);
  }
};

// Verify a credential
export const verifyCredential = (req, res, next) => {
  try {
    const { email, credential } = req.body;

    if (!email || !credential) {
      return next(createError(400, "Email and credential are required"));
    }

    // Find user
    const user = users.find((user) => user.email === email);
    if (!user) {
      return next(createError(404, "User not found"));
    }

    // Find stored credential
    const storedCredential = credentials.find(
      (cred) => cred.userId === user.id && cred.credential.id === credential.id
    );

    if (!storedCredential) {
      return next(createError(404, "Credential not found"));
    }

    // In a real application, you would verify the signature here
    // For this demo, we'll just check if the credential ID matches

    res.json({
      verified: true,
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
