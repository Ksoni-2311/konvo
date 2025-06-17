import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controllers.js';

const router = express.Router();

console.log("message.routes.js loaded");

// Log router stack before adding routes
console.log("Router stack before adding routes:", router.stack.map(layer => layer.route?.path));

// Define routes with protectRoute middleware
router.get('/users', protectRoute, getUserForSidebar);
router.post('/send/:id', protectRoute, sendMessage);
router.get('/chat/:id', protectRoute, getMessages);

// Log router stack after adding routes
console.log("Router stack after adding routes:", router.stack.map(layer => layer.route?.path));

export default router;
