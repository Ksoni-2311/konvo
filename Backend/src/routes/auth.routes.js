import express from 'express';
import {
  signup,
  login,
  logout,
  chechAuth,
  updateProfilePic
} from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

console.log("auth.routes.js loaded");

// Log router stack before adding routes
console.log("Router stack before routes:", router.stack.map(layer => layer.route?.path));

// Define routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfilePic);
router.get("/check", protectRoute, chechAuth);

// Log router stack after adding routes
console.log("Router stack after routes:", router.stack.map(layer => layer.route?.path));

export default router;
