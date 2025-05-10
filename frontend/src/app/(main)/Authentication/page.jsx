"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useFormik } from "formik"
import * as Yup from "yup"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useAppContext from "@/context/AppContext"
import { Eye, EyeOff, Facebook, Twitter, Linkedin, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react"
import "./style.css"

// Validation schemas
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: Yup.string().required("Email is required").email("Email is invalid"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/\W/, "Password must contain at least one special character"),
})

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "too short - should be 8 chars minimum")
    .matches(/[a-z]/, "password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "password must contain at least one uppercase letter")
    .matches(/\d/, "password must contain at least one number")
    .required("Password is required"),
})

export default function AuthPage() {
  const [isActive, setIsActive] = useState(false)
  const [passwordHidden, setPasswordHidden] = useState(true)
  const [signupPasswordHidden, setSignupPasswordHidden] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formSuccess, setFormSuccess] = useState(null)

  const { setUserLoggedIn, setEmail, setRole } = useAppContext()
  const router = useRouter()

  // Signup form
  const signupForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true)
      try {
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/add`, values)
        setFormSuccess("Account created successfully!")
        toast.success("User created successfully")
        setTimeout(() => {
          setIsActive(false)
          setFormSuccess(null)
        }, 2000)
        resetForm()
      } catch (err) {
        console.error(err)
        toast.error(err?.response?.data?.message || "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    },
    validationSchema: SignupSchema,
  })

  // Login form
  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true)
      try {
        const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, values)
        setFormSuccess("Login successful!")
        toast.success("Login Success")
        setUserLoggedIn(true)
        localStorage.setItem("token", result.data.token)
        localStorage.setItem("email", result.data.email)

        // Redirect based on role
        setTimeout(() => {
          if (result.data.role === "admin") {
            window.location.href = "/admin"
          } else {
            window.location.href = "/"
          }
          router.refresh()
        }, 1500)
      } catch (err) {
        toast.error("Login Failed")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
      resetForm()
    },
    validationSchema: LoginSchema,
  })

  // Panel switching effect
  useEffect(() => {
    const handleSignUp = () => setIsActive(true)
    const handleSignIn = () => setIsActive(false)

    const signUpButton = document.getElementById("signUp")
    const signInButton = document.getElementById("signIn")

    if (signUpButton) signUpButton.addEventListener("click", handleSignUp)
    if (signInButton) signInButton.addEventListener("click", handleSignIn)

    return () => {
      if (signUpButton) signUpButton.removeEventListener("click", handleSignUp)
      if (signInButton) signInButton.removeEventListener("click", handleSignIn)
    }
  }, [])

  // Floating particles effect
  useEffect(() => {
    const createParticle = () => {
      const overlay = document.querySelector(".overlay")
      if (!overlay) return

      const particle = document.createElement("div")
      particle.className = "particle"

      // Random position
      const posX = Math.random() * overlay.clientWidth
      const posY = Math.random() * overlay.clientHeight

      // Random size
      const size = Math.random() * 10 + 5

      // Styling
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${posX}px`
      particle.style.top = `${posY}px`
      particle.style.position = "absolute"
      particle.style.borderRadius = "50%"
      particle.style.backgroundColor = "rgba(255, 255, 255, 0.3)"
      particle.style.pointerEvents = "none"

      // Animation
      particle.style.animation = `float ${Math.random() * 5 + 3}s linear infinite`

      overlay.appendChild(particle)

      // Remove after animation
      setTimeout(() => {
        if (particle.parentNode === overlay) {
          overlay.removeChild(particle)
        }
      }, 8000)
    }

    // Create particles at intervals
    const particleInterval = setInterval(createParticle, 300)

    // Add keyframes for float animation
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        50% { opacity: 0.8; }
        100% { transform: translateY(-100px) translateX(${Math.random() > 0.5 ? "50px" : "-50px"}); opacity: 0; }
      }
    `
    document.head.appendChild(style)

    return () => {
      clearInterval(particleInterval)
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="mybody">
      <div className={`container ${isActive ? "right-panel-active" : ""}`} id="container">
        {/* Sign Up Form Container */}
        <div className="form-container sign-up-container">
          <form onSubmit={signupForm.handleSubmit}>
            <h1 className="mb-4 flex items-center gap-2">
              Create Account <Sparkles className="h-5 w-5 text-yellow-500" />
            </h1>

            <div className="social-container">
              <a href="#" className="social" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="social" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="social" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>

            <span>or use your email for registration</span>

            {/* Name input */}
            <div className="relative w-full mt-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Name"
                id="name"
                className="pl-10"
                onChange={signupForm.handleChange}
                value={signupForm.values.name}
              />
              {signupForm.touched.name && signupForm.errors.name && (
                <p className="text-sm text-red-500 text-left w-full">{signupForm.errors.name}</p>
              )}
            </div>

            {/* Email input */}
            <div className="relative w-full mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="pl-10"
                onChange={signupForm.handleChange}
                value={signupForm.values.email}
              />
              {signupForm.touched.email && signupForm.errors.email && (
                <p className="text-sm text-red-500 text-left w-full">{signupForm.errors.email}</p>
              )}
            </div>

            {/* Password input */}
            <div className="relative w-full mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={signupPasswordHidden ? "password" : "text"}
                placeholder="Password"
                id="password"
                className="pl-10 pr-10"
                onChange={signupForm.handleChange}
                value={signupForm.values.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setSignupPasswordHidden(!signupPasswordHidden)}
              >
                {signupPasswordHidden ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
              {signupForm.touched.password && signupForm.errors.password && (
                <p className="text-sm text-red-500 text-left w-full">{signupForm.errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              className="hola mt-6 flex items-center justify-center gap-2 relative overflow-hidden group"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : formSuccess ? (
                <>
                  {formSuccess}
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Sign In Form Container */}
        <div className="form-container sign-in-container">
          <form onSubmit={loginForm.handleSubmit}>
            <h1 className="mb-4 flex items-center gap-2">
              Sign in <Sparkles className="h-5 w-5 text-yellow-500" />
            </h1>

            <div className="social-container">
              <a href="#" className="social hover:bg-blue-50 transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="social hover:bg-blue-50 transition-colors" aria-label="Twitter">
                <Twitter size={16} />
              </a>
              <a href="#" className="social hover:bg-blue-50 transition-colors" aria-label="LinkedIn">
                <Linkedin size={16} />
              </a>
            </div>

            <span>or use your account</span>

            {/* Email input */}
            <div className="relative w-full mt-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="pl-10"
                onChange={loginForm.handleChange}
                value={loginForm.values.email}
              />
              {loginForm.touched.email && loginForm.errors.email && (
                <p className="text-sm text-red-500 text-left w-full">{loginForm.errors.email}</p>
              )}
            </div>

            {/* Password input */}
            <div className="relative w-full mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type={passwordHidden ? "password" : "text"}
                placeholder="Password"
                name="password"
                className="pl-10 pr-10"
                onChange={loginForm.handleChange}
                value={loginForm.values.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setPasswordHidden(!passwordHidden)}
              >
                {passwordHidden ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
              {loginForm.touched.password && loginForm.errors.password && (
                <p className="text-sm text-red-500 text-left w-full">{loginForm.errors.password}</p>
              )}
            </div>

            <Link
              href="/resetpassword"
              className="forgot-password-link mt-2 text-sm hover:text-red-500 transition-colors self-end"
            >
              Forgot your password?
            </Link>

            {/* Submit button */}
            <button
              className="hola mt-6 flex items-center justify-center gap-2 relative overflow-hidden group"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : formSuccess ? (
                <>
                  {formSuccess}
                  <Sparkles className="h-4 w-4" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Left Panel (shown when in signup mode) */}
            <div className="overlay-panel overlay-left">
              <h1 className="text-3xl mb-2">Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button
                className="ghost mt-4 hover:bg-white hover:text-red-500 transition-colors flex items-center gap-2"
                id="signIn"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Right Panel (shown when in signin mode) */}
            <div className="overlay-panel overlay-right">
              <h1 className="text-3xl mb-2">Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost mt-4 hover:bg-white hover:text-red-500 transition-colors flex items-center gap-2"
                id="signUp"
              >
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
