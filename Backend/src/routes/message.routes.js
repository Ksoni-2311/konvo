    import express from 'express'
    import { protectRoute } from '../middleware/auth.middleware.js'
    import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controllers.js'
    const router=express.Router()

    console.log("message.routes.js path test");


    console.log("router stack before routes:", router.stack);

    router.get('/users', protectRoute, getUserForSidebar);
    router.post('/send/:id', protectRoute, sendMessage);
    router.get('/chat/:id', protectRoute, getMessages);

    console.log("router stack after routes:", router.stack);


    export default router