import mongoose from "mongoose"
import User from "../models/user.models.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"
import {getReceiverSocketId,io} from '../lib/soket.js'

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        // we pass a object id where all {id !=loggedInuserId} is selected  FOR THIS WE USE $ne:{"Inside whatever we give do not get selected rest all get selected"}
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")
        res.status(200).json(filteredUser)
    } catch (error) {
        console.error("Error in getUserForSidebar function", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const getMessages = async (req, res) => {
    try {
        // 2 id req->sender and a receiver
        // since we are using  a middleware so our id =>req.user._id  
        // userToChatId=req.params

        const { id: userToChatId } = req.params
        // console.log(req.params);
        const myId = req.user._id

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(message);

    } catch (error) {
        console.error("Error in getMessage function", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const sendMessage = async (req, res) => {
    try {
        // const { {message can be of two type} text,img}=req.body
        // sender_id=req.user._id and receiver_id=req.params 
        // if img =(then use)> cloudianary 
        // cosnt newmessage=>{} res.json(newmessage)

        const {  text, image  } = req.body
        const senderId = req.user._id
        const { id: receiverId } = req.params

        // console.log(req.body);
        let image_url
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            image_url = (await uploadResponse).secure_url
            
        }
        const newMessage = new Message({
            senderId, receiverId, text, image: image_url
        })

        await newMessage.save();

        // Todo:- To add realtime funcanality 
        // Line no-64to67 we make a chat realtime 
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        


        res.status(200).json(newMessage)
        

    } catch (error) {
        console.error("Error in sendMessage function", error.message);
        // console.log("Cloudinary config:", {
        // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        // api_key: process.env.CLOUDINARY_API_KEY,
        // api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
        // });
        res.status(500).json({ error: "Internal server error" });
    }
}