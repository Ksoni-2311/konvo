import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeaderComponent from './ChatHeaderComponent';
import MessageInput from './MessageInput';
import MessageSkeleton from './skletons/MessageSkeleton';
import { userAuthStore } from '../store/useAUthStore';
import { formatMessageTime } from '../lib/utils';
import avatar from '../assets/avatar.jpeg'
function ChatContainer() {
       const {messages,getMessages,isMessageLoading,selectedUser,SubscribeToMessage,UnsubscribeToMessage}=useChatStore();
       const {authUser}=userAuthStore()
       const messageEndRef=useRef(null)
    useEffect(()=>{
        getMessages(selectedUser._id)
        SubscribeToMessage()

        return ()=>{UnsubscribeToMessage()}
    },[selectedUser._id,getMessages,SubscribeToMessage,UnsubscribeToMessage])

    useEffect(()=>{
      if(messages && messageEndRef.current){
        messageEndRef.current.scrollIntoView({behavior:"smooth"})
      }
    },[messages])
    
    if(isMessageLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeaderComponent />
      <MessageSkeleton />
      <MessageInput />
    </div>)

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeaderComponent />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || avatar
                      : selectedUser.profilePic || avatar
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
        
    </div>
  )
}

export default ChatContainer