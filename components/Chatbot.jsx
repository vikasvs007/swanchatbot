"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Phone, Download, MessageCircle, Maximize2, Minimize2, Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { motion, AnimatePresence } from "framer-motion"
import SwanSorterLogo from "./SwanSorterLogo"
import { MessageType, defaultStrings } from "../lib/constants"

// API endpoint for products
const API_ENDPOINT = "https://crud-backend-a70z.onrender.com/api/products"

// Form validation function
const validateForm = (formData) => {
  const errors = {}
  
  if (!formData.name.trim()) {
    errors.name = "Name is required"
  }
  
  if (!formData.email.trim()) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid"
  }
  
  if (!formData.message.trim()) {
    errors.message = "Message is required"
  }
  
  return errors
}

export default function Chatbot() {
  // ... rest of your existing Chatbot component code ...
} 