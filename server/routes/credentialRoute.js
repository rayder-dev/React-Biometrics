import express from "express";
import {
  registerCredential,
  getCredentialInfo,
  verifyCredential,
} from "../controllers/credentialController.js";

const router = express.Router();

// Register a new credential
router.post("/register", registerCredential);

// Get credential info
router.get("/get-info", getCredentialInfo);

// Verify a credential
router.post("/verify", verifyCredential);

export default router;
