import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const  protectRoute=async(req,res,next)=>{
    try {
        /*
        token=req.cookie.jwt
        jwt token verify  
        find user as token has a user id 
        decode token 
        next      
        */

        const token=req.cookies.jwt
        if(!token){
            return res.status(401).json({message:"Unauthorized-access"})
        }
        const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
        // console.log('token',token);
        // console.log('d-token',decodedToken);

        if(!decodedToken){
            return res.status(404).json({message:"Unauthoirzed: Invalid token"})
        }
        const user= await User.findById(decodedToken.userId).select("-password")

        if(!user){
            res.status(404).json({message:"user not found"})
        }

        req.user=user
        next();
    } catch (error) {
        console.log("Error in protectRoute methord",error.message);
        res.status(500).json({message:"Internal server error due pr"})
    }
}