import React, { useState } from 'react'
import { userAuthStore } from '../store/useAUthStore.js'
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'
import AuthImagePattern from '../components/skletons/AuthImagePattern.jsx'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

function Login() {
  const [showPassword,setShowPassword]=useState(false)
  const [FormData,setFormData]=useState({
    email:"",
    password:""
  })
  const {login,isLoggedIn}=userAuthStore()

  const validateForm=() => {
    if(!FormData.email && !FormData.password) return toast.error("Please Enter Details")
    if(!FormData.email) return toast.error("EmailId required")
    if(!FormData.password) return toast.error("Password Required");
    // if(FormData.email && FormData.password) return toast.error("Invalid Details")
    return true;
  }

  const handleSubmit=(e) => {
    e.preventDefault();
    const success=validateForm()
    console.log(`handelSubmit = ${success}`);
    if(success===true) 
      login(FormData);
  }
  return (
     <div className="h-screen grid lg:grid-cols-2 font-mono	">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
              <MessageSquare size={36} color="#0681e0" strokeWidth={1.5} className=" text-primary " />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40 z-1" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={FormData.email}
                  onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40 z-1" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={FormData.password}
                  onChange={(e) => setFormData({ ...FormData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggedIn}>
              {isLoggedIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};


export default Login;