import React, { useEffect } from 'react'
import {Routes , Route, Navigate} from 'react-router-dom'
import {Loader} from "lucide-react"
import {Toaster} from 'react-hot-toast'

import Navbar from '../src/pages/Navbar.jsx'
import Homepage from '../src/pages/Homepage.jsx'

import Login from './pages/Login.jsx'
import SettingsPage from '../src/pages/SettingsPage.jsx'
import ProfilePage from '../src/pages/ProfilePage.jsx'
import { userAuthStore } from './store/useAUthStore.js'
import SignupPage from './pages/SignupPage.jsx'
import { useThemeStore } from './store/useThemeStore.js'

function App() {
  const {authUser,checkAuth,isChekingAuth}=userAuthStore()
  // console.log({onlineUsers});
  
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  // console.log({authUser});
  
  if(!isChekingAuth && !checkAuth){
    <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
  }
  const {theme}=useThemeStore()


  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
          <Route path='/' element={authUser ? <Homepage />: <Navigate to ="/login"/>} />
          <Route path='/signup' element={!authUser ? <SignupPage /> :<Navigate to="/"/>} />
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
          {/* <Route path='/settings' element={<SettingsPage />} /> */}
          <Route path='/profile' element={authUser ? <ProfilePage />:<Navigate to ="/login"/>} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App