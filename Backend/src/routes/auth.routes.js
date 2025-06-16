import express from 'express'
import {signup,login,logout, chechAuth,updateProfilePic} from '../controllers/auth.controllers.js' 
import { protectRoute } from '../middleware/auth.middleware.js';
const router=express.Router();

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfilePic)

router.get("/check",protectRoute,chechAuth)

export default router;


// {PUT method
// PUT is used to create or update a resource at the specified URI location. In other words, the PUT method essentially saves the body content sent in the request as a resource at the location of the URI path. RESTful APIs often use PUT to update resources.}