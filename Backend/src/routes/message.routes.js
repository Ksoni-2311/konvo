    import express from 'express'
    import { protectRoute } from '../middleware/auth.middleware.js'
    import { getMessages, getUserForSidebar, sendMessage } from '../controllers/message.controllers.js'
    const router=express.Router()

    router.get('/users',protectRoute,getUserForSidebar)
    router.post('/send/:id',protectRoute,sendMessage)
    router.get('/:id',protectRoute,getMessages)

    export default router