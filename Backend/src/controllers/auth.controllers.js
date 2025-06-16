import express from 'express'
import User from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'

import { set } from 'mongoose'
import cloudinary from '../lib/cloudinary.js'
export const signup=async(req,res)=>{
    // console.log(req.body);
    
    const {fullName,email,password}=req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"all fields are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be greater than 6 digits"})
        }
        const user=await User.findOne({email})
        if(user)return res.status(400).json({message:"Email address already exist"})

        // basically used for hashing 
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt)

        const newUser=new User({
            fullName,email,
            password:hashPassword
        })
        if(newUser){
            generateToken(newUser._id,res)
            await newUser.save(); // .save methord use =>
            res.status(201).json({
                _id: newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }
        else{
            console.error("controller error",error);
            res.status(500).json({message:"server error"})
        }
   
    } catch (error) {
        console.log("signup cntroller error",error); 
    }
}
export const login=async(req,res)=>{
    // LEARNING=> DO NOT REHASH PASS TO COMPARE RATHER COMPARE PASSWORDS ie=>   
    //         const isMatch=await bcrypt.compare(password,user.password)



    /*wrap in try and catch
     take email pass 
     if(!email || !password) return res.status(401)...
     find email in database THEn
     if pass==passentrd
     successfull login
    catch error*/

    const {email,password}=req.body
    try {
        if(!email) {
            return res.status(401).json("invalid credentials")
        }
        const user=await User.findOne({email})
        if(!user)return res.status(402).json({message:"Email address do not exist DO SIGNUP"})

        const isMatch=await bcrypt.compare(password,user.password)
        console.log(user);
        
        if(isMatch){ 
            generateToken(user._id,res)
            return res.status(202).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic
            })
        }else{
            return res.status(401).json("Invalid crediantials")
        }
    } 
    catch (error) {
        console.log("login controller error",error.message);
    }

}
export const logout=(req,res)=>{
    try {
        console.log(req.body);
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller");
        res.send(403).json({message:"Internalserver error"})
    }
}
export const updateProfilePic=async(req,res)=>{
    try {
        const {profilePic}=req.body
        const userId=req.user._id
        // console.log(userId);

        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profilePic Function",error.message);
        return res.status(500).json({message:"internal server error"})
    }
}
export const chechAuth=async (req,res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("error in checkAuth function",error.message)
        res.status(500).json({message:"Internal server error"})
    }
}