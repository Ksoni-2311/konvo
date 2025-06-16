import { Image, Send, SmilePlus, X } from 'lucide-react'
import React, {useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useChatStore } from '../store/useChatStore'
import EmojiPicker from 'emoji-picker-react';

function MessageInput() {
  const {sendMessage}=useChatStore()
  const [text,setText]=useState("")
  const [imagePreview,setimagePreview]=useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef=useRef(null)

  const handleImageChange=(e)=>{
    const file=e.target.files[0];
    if(!file.type.startsWith('image/')){
      toast.error("Please Select an Image")
      return
    }
    const reader=new FileReader();
    reader.onloadend=()=>{
      setimagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }
  const removeImage=()=>{
    setimagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value=""
  }
  const removeEmojiTab=()=>{
    setShowEmojiPicker(false);
  }
  const handleEmojiClick = (emojiData) => {
    setText((prevMessage) => prevMessage + emojiData.emoji);
  }
  const handleSendMessage=async(e)=>{
    e.preventDefault()
    if(!text && !imagePreview ) return
    try {
      await sendMessage({
        text:text.trim(),
        image:imagePreview
      })

      // clear form
      setText("")
      setimagePreview(null)
      if(fileInputRef.current) fileInputRef.current.value=""

    } catch (error) {
      console.log("Failed To send message",error);
    }
  }

   return (
    <div className="p-4 ml w-full ">
      {imagePreview && (
        <div className="mb- ml-13 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

        <div className='p-4 w-10'>
          {showEmojiPicker &&(<div className="mb-3 flex items-center gap-2">
          <div className=" relative ">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
            <button
              onClick={removeEmojiTab}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>)}
        </div>

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <button 
          type="button"
          // className={`hidden sm:flex btn btn-circle"}`}
          onClick={()=>{setShowEmojiPicker(!showEmojiPicker)}}
          onChange={handleEmojiClick}
          value={text}
        ><SmilePlus /></button>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={` sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image color="#b0c2a8" strokeWidth={1.25} size={21} />
        </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
          onClick={removeEmojiTab}
        >
             <Send size={22}/>

        </button>

      </form>
    </div>
  );
};


export default MessageInput