"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Phone, Download, MessageCircle, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import SwanSorterLogo from "./swan-sorter-logo"

// Define message types
const MessageType = {
  USER: "user",
  BOT: "bot",
  PRODUCT: "product",
  CONTACT: "contact",
  ENQUIRY: "enquiry",
  CATALOG: "catalog",
  SUPPORT: "support",
}

// Sample product data
const products = [
  {
    id: "1",
    name: "Premium SwanSorter Pro",
    description: "Our flagship data sorting solution with advanced features and premium build quality.",
    imageUrl: "/placeholder.svg?height=100&width=100",
    link: "/products/premium-swansorter",
  },
  {
    id: "2",
    name: "SwanSorter Standard",
    description: "Reliable and cost-effective data sorting for everyday business needs.",
    imageUrl: "/placeholder.svg?height=100&width=100",
    link: "/products/standard-swansorter",
  },
  {
    id: "3",
    name: "SwanSorter Lite",
    description: "Entry-level data sorting solution with essential features for small businesses.",
    imageUrl: "/placeholder.svg?height=100&width=100",
    link: "/products/lite-swansorter",
  },
]

// Form validation function
const validateForm = (formData) => {
  const errors = {}

  if (!formData.name || formData.name.length < 2) {
    errors.name = "Name must be at least 2 characters."
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email || !emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address."
  }

  const phoneRegex = /^\d{10}$/
  if (!formData.phone || !phoneRegex.test(formData.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number."
  }

  return errors
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLarge, setIsLarge] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [showEnquiryForm, setShowEnquiryForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const messagesEndRef = useRef(null)
  const [isTyping, setIsTyping] = useState(false)

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            type: MessageType.BOT,
            content:
              "Hello! Welcome to SwanSorter. How can I assist you today? You can type 'Product' to see our data sorting solutions, 'Contact' to get our details, 'Enquiry' to submit a request, 'Catalog' to download our catalog, or 'Support' to speak with our team.",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }, [isOpen, messages.length])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmitEnquiry = () => {
    const errors = validateForm(formData)

    if (Object.keys(errors).length === 0) {
      // Add user message
      addMessage(MessageType.USER, `I'd like to submit an enquiry.`)

      // Add bot response
      setIsTyping(true)
      setTimeout(() => {
        addMessage(
          MessageType.BOT,
          `Thank you, ${formData.name}! Your enquiry has been submitted. Our team will contact you shortly at ${formData.email}.`,
        )
        setIsTyping(false)
      }, 1000)

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" })
      setShowEnquiryForm(false)

      // In a real application, you would send this data to your backend
      console.log("Enquiry submitted:", formData)
    } else {
      setFormErrors(errors)
    }
  }

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    addMessage(MessageType.USER, input)

    // Process user input
    const userInput = input.toLowerCase()
    setInput("")

    // Show typing indicator
    setIsTyping(true)

    // Handle different commands
    setTimeout(() => {
      setIsTyping(false)
      if (userInput.includes("product")) {
        addMessage(MessageType.PRODUCT, "Here are our SwanSorter solutions:")
      } else if (userInput.includes("contact")) {
        addMessage(MessageType.CONTACT, "Contact Information")
      } else if (userInput.includes("enquiry")) {
        setShowEnquiryForm(true)
      } else if (userInput.includes("catalog")) {
        addMessage(MessageType.CATALOG, "Download our SwanSorter catalog")
      } else if (userInput.includes("support")) {
        addMessage(MessageType.SUPPORT, "Connect with our support team")
      } else {
        addMessage(
          MessageType.BOT,
          "I'm not sure I understand. You can type 'Product', 'Contact', 'Enquiry', 'Catalog', or 'Support' to get started.",
        )
      }
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const toggleSize = () => {
    setIsLarge(!isLarge)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${isLarge ? "bottom-20 right-0" : "bottom-16 right-0"}`}
          >
            <Card
              className={`
              ${isLarge ? "w-[90vw] h-[80vh] max-w-4xl" : "w-80 sm:w-96 h-[500px]"}
              flex flex-col shadow-2xl overflow-hidden rounded-2xl border-0
              transition-all duration-300 ease-in-out
            `}
            >
              {/* Chat header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <SwanSorterLogo size={32} />
                  <h3 className="font-bold text-black">SwanSorter Support</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSize}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    {isLarge ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleChat}
                    className="h-8 w-8 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                {messages.map((message) => {
                  switch (message.type) {
                    case MessageType.USER:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-end"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-[80%] shadow-md">
                            {message.content}
                          </div>
                        </motion.div>
                      )
                    case MessageType.BOT:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 max-w-[80%] shadow-md">
                            {message.content}
                          </div>
                        </motion.div>
                      )
                    case MessageType.PRODUCT:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 max-w-[90%] w-full shadow-md">
                            <p className="font-medium mb-3 text-blue-600">{message.content}</p>
                            <div className={`grid ${isLarge ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-3`}>
                              {products.map((product) => (
                                <motion.div
                                  key={product.id}
                                  className="border border-gray-200 rounded-xl p-3 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 bg-gray-50"
                                  whileHover={{ y: -2 }}
                                >
                                  <img
                                    src={product.imageUrl || "/placeholder.svg"}
                                    alt={product.name}
                                    className="h-32 w-full object-cover rounded-lg"
                                  />
                                  <div>
                                    <h4 className="font-medium text-blue-700">{product.name}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                    <a
                                      href={product.link}
                                      className="text-sm text-purple-600 hover:text-purple-800 hover:underline mt-2 inline-block font-medium"
                                    >
                                      View Details →
                                    </a>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )
                    case MessageType.CONTACT:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 max-w-[90%] w-full shadow-md">
                            <p className="font-medium mb-3 text-blue-600">{message.content}</p>
                            <div className="space-y-2 bg-gray-50 p-3 rounded-xl">
                              <p>
                                <span className="font-medium text-gray-700">Phone:</span> +1 (555) 123-4567
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">Email:</span> support@swansorter.com
                              </p>
                              <p>
                                <span className="font-medium text-gray-700">Address:</span> 123 Swan Street, Sorting
                                City, SC 12345
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                                onClick={() => (window.location.href = "tel:+15551234567")}
                              >
                                <Phone className="h-4 w-4 mr-2" /> Call Us
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    case MessageType.CATALOG:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 max-w-[90%] w-full shadow-md">
                            <p className="font-medium mb-3 text-blue-600">{message.content}</p>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                              <p className="mb-3 text-gray-600">
                                Get our complete product catalog with detailed specifications and pricing.
                              </p>
                              <div className="flex justify-center items-center h-10">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center items-center h-10 w-40"
                                onClick={() => window.open("VVCE_AIML_VIKASVS.pdf", "_blank")}
                              >
                                <Download className="h-5 w-5 mr-" /> Download Catalog
                              </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    case MessageType.SUPPORT:
                      return (
                        <motion.div
                          key={message.id}
                          className="flex justify-start"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-3 max-w-[90%] w-full shadow-md">
                            <p className="font-medium mb-3 text-blue-600">{message.content}</p>
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-sm mb-3 text-gray-600">
                                Our support team is available Monday-Friday, 9am-5pm EST. Connect with us through:
                              </p>
                              <div className="flex gap-2 justify-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center  h-10 w-40"
                                  onClick={() => window.open("https://wa.me/15551234567", "_blank")}
                                >
                                  WhatsApp
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center  h-10 w-40"
                                  onClick={() => window.open("https://m.me/swansorter", "_blank")}
                                >
                                  <MessageCircle className="h-4 w-4 mr-2" /> Messenger
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    default:
                      return null
                  }
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-2 px-4 max-w-[80%] shadow-md">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enquiry form */}
                {showEnquiryForm && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-4 max-w-[90%] w-full shadow-md">
                    <h4 className="font-bold mb-3 text-blue-600">Enquiry Form</h4>
                    <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-black-700">
                            Name
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className={
                              formErrors.name
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-blue-500"
                            }
                          />
                          {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-700">
                            Email
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className={
                              formErrors.email
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-blue-500"
                            }
                          />
                          {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleFormChange}
                            className={
                              formErrors.phone
                                ? "border-red-300 focus:ring-red-500"
                                : "border-gray-200 focus:ring-blue-500"
                            }
                          />
                          {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-gray-700">
                            Message (Optional)
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            rows={3}
                            className="border-black-200 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowEnquiryForm(false)}
                            className="rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center  h-10 w-20"
                            >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSubmitEnquiry}
                            className="rounded-full bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center  h-10 w-20"
                            >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-5 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 border-gray-200 focus:ring-blue-500 rounded-full py-2 px-4 flex justify-center items-center"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-100 flex justify-center  h-10 w-20"
                  >
                    <Send className="" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

