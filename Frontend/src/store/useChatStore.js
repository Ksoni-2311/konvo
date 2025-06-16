import {create} from 'zustand'
import toast from 'react-hot-toast'
import { axiosInstance } from '../lib/axios'
import {userAuthStore} from './useAUthStore.js'

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,

    getUser:async () => {
        set({isUserLoading:true})
        try {
            const res=axiosInstance.get('/messages/users')
            set({users:(await res).data})
        } catch (error) {
            toast.error(error.response.data.messages)
        }finally{
            set({isUserLoading:false})
        }
    },
    getMessages:async (userId) => {
        set({isMessageLoading:true})
        try {
            const res=axiosInstance.get(`/messages/chat/${userId}`)
            set({messages:(await res).data})
        } catch (error) {
            toast.error(error.response.data.messages)
        }finally{
            set({isMessageLoading:false})
        }
    },
    sendMessage:async (messagesData) => {
        const {messages,selectedUser}=get()
        try {
            console.log("messagesData");
            
            const res= axiosInstance.post(`/messages/send/${selectedUser._id}`,messagesData)
            set({messages:[...messages ,(await res).data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    SubscribeToMessage:()=>{
        const {selectedUser}=get()
        if(!selectedUser) return
        const socket=userAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser._id) return;
            set({messages:[...get().messages,newMessage]})
        })
    },
    UnsubscribeToMessage:()=>{
        const socket=userAuthStore.getState().socket;
        socket.off("newMessage")
    },
    setSelectedUser:(selectedUser) => {
        set({selectedUser})
        console.log(selectedUser);
    }
}))