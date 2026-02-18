import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";
import {io} from 'socket.io-client'

const BASE_URL=import.meta.env.MODE==="development"?"https://konvo-1.onrender.com":"/"
export const userAuthStore=create((set,get)=>({
    authUser:null,
    isSignedUp:false,
    isLoggedIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async () => {
        try {
            const res=axiosInstance.get('/auth/check');
            set ({authUser:(await res).data})
            get().connectSocket()

        } catch (error) {
            console.log("error in checkAuth:",error)
            set(await {authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async (data) => {
        set({isSignedUp:true})
        try {
            const res=axiosInstance.post("/auth/signup",data)
            set({authUser:(await res).data})
            toast.success("Account has been created successfully")
            get().connectSocket()
            console.log(get().connectSocket(),'90');
        } catch (error) {
            console.log(error);   
            toast.error(error.message)
        }finally{
            set({isSignedUp:false})
        }
    },
    logout:async () => {
        try {
            axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("logged Out Successfully")
            get().disconnectSocket()
            console.log(get().disconnectSocket(),'91');

        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    login:async (data) => {
        set({isLoggedIn:false})
        try {
            const res=axiosInstance.post("/auth/login",data)
            set({authUser:(await res).data})
            toast.success("Logged In Successfully")
            get().connectSocket()
        } catch (error) {
            console.log(error)
            toast.error("Invalid Crediantials")
        }finally{
            set({isLoggedIn:false})
        }
    },
    updateProfile:async (data) => {
        set({isUpdatingProfile:true})
        try {
            const res= axiosInstance.put("/auth/update-profile",data)
            // console.log(data);
            
            set({authUser: (await res).data})
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("Error in update profile",error);
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:() => {
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return
        
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            }}
        )
        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUsers" ,(userId)=>{
            set({onlineUsers:userId})
        })
    },
    disconnectSocket:() => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}))