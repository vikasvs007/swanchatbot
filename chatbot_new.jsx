"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Script from "next/script"
import {
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  Send,
  Download,
  Phone,
  MessageCircle,
  Loader2,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Label } from "./components/ui/label"
import SwanSorterLogo from "./swan-sorter-logo"
import { MessageType, defaultStrings, validateForm, API_ENDPOINT } from "./constants"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLarge, setIsLarge] = useState(true)
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const translateElementRef = useRef(null)
  const [isTtsEnabled, setIsTtsEnabled] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechSynthesisRef = useRef(null)

  // Initialize Google Translate
  useEffect(() => {
    // Create Google Translate element if it doesn't exist
    if (isOpen && !document.getElementById('google_translate_element')) {
      const translateDiv = document.createElement('div');
      translateDiv.id = 'google_translate_element';
      translateDiv.style.position = 'absolute';
      translateDiv.style.top = '10px';
      translateDiv.style.right = '100px';
      translateDiv.style.zIndex = '1000';
      document.body.appendChild(translateDiv);
      
      // Load Google Translate script
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      // Initialize Google Translate
      window.googleTranslateElementInit = function() {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      };
      
      translateElementRef.current = translateDiv;
    }
    
    // Cleanup function
    return () => {
      if (!isOpen && translateElementRef.current) {
        document.body.removeChild(translateElementRef.current);
        translateElementRef.current = null;
      }
    };
  }, [isOpen]);

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            type: MessageType.BOT,
            content: defaultStrings.welcome,
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
  }, [messages, isTyping])

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
          defaultStrings.enquirySubmitted.replace("{name}", formData.name).replace("{email}", formData.email),
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

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched products:", data); // Debug log
      setProducts(data);
      setIsLoadingProducts(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoadingProducts(false);
      // Add error message to chat
      addMessage(
        MessageType.BOT,
        `Sorry, I couldn't fetch the products. Please try again later. (Error: ${error.message})`
      );
    }
  }

  const handleSendMessage = () => {
    if (!input.trim() || isProcessing) return

    // Add user message
    addMessage(MessageType.USER, input)

    // Process user input
    const userInput = input.toLowerCase()
    setInput("")

    // Prevent multiple requests from overlapping
    setIsProcessing(true)
    setIsTyping(true)

    // Handle different commands
    setTimeout(() => {
      setIsTyping(false)
      setIsProcessing(false)
      
      if (userInput.includes("product") || userInput.includes("producto") || userInput.includes("produit")) {
        addMessage(MessageType.PRODUCT, defaultStrings.productIntro)
        fetchProducts();
      } else if (userInput.includes("contact") || userInput.includes("contacto") || userInput.includes("contact")) {
        addMessage(MessageType.CONTACT, defaultStrings.contactInfo)
      } else if (userInput.includes("enquiry") || userInput.includes("consulta") || userInput.includes("demande")) {
        setShowEnquiryForm(true)
      } else if (userInput.includes("catalog") || userInput.includes("catálogo") || userInput.includes("catalogue")) {
        addMessage(MessageType.CATALOG, defaultStrings.downloadCatalog)
      } else if (userInput.includes("support") || userInput.includes("soporte") || userInput.includes("support")) {
        addMessage(MessageType.SUPPORT, defaultStrings.supportTeam)
      } else if (userInput.includes("language") || userInput.includes("idioma") || userInput.includes("langue")) {
        addMessage(
          MessageType.BOT,
          "You can change the language to: English (en), Spanish (es), or French (fr). Type 'en', 'es', or 'fr' to change."
        )
      } else if (userInput === "en" || userInput === "es" || userInput === "fr") {
        changeLanguage(userInput);
        addMessage(
          MessageType.BOT,
          `Language changed to ${userInput === "en" ? "English" : userInput === "es" ? "Spanish" : "French"}.`
        )
      } else {
        addMessage(
          MessageType.BOT,
          defaultStrings.notUnderstood,
        )
      }
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleSize = () => {
    setIsLarge(!isLarge)
  }

  const toggleTts = () => {
    setIsTtsEnabled(!isTtsEnabled)
  }

  return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat toggle button */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={toggleChat}
            className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-primary-foreground neon-glow shadow-lg"
            aria-label="Toggle chat"
          >
            <MessageSquare className="h-7 w-7" />
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
              className="fixed bottom-24 right-6 overflow-hidden"
              style={{ 
                width: isLarge ? 'min(95vw, 800px)' : 'min(90vw, 400px)',
                height: isLarge ? 'min(85vh, 800px)' : 'min(70vh, 500px)',
                maxHeight: 'calc(100vh - 120px)'
              }}
            >
              <Card className="flex flex-col h-full border-primary/30 neon-border bg-card/90 backdrop-blur-sm shadow-xl">
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b border-primary/30 bg-secondary">
                  <div className="flex items-center space-x-2">
                    <SwanSorterLogo size={24} className="text-primary" />
                    <h2 className="font-semibold text-foreground">SwanSorter Assistant</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Google Translate Element */}
                    <div id="google_translate_element" className="mr-2"></div>
                    
                    {/* Text-to-Speech Toggle */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTts}
                      className={`text-foreground hover:text-primary hover:bg-secondary ${isTtsEnabled ? 'text-primary' : ''}`}
                      aria-label={isTtsEnabled ? "Disable text-to-speech" : "Enable text-to-speech"}
                    >
                      {isTtsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSize}
                      className="text-foreground hover:text-primary hover:bg-secondary"
                      aria-label={isLarge ? "Minimize chat" : "Maximize chat"}
                    >
                      {isLarge ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleChat}
                      className="text-foreground hover:text-primary hover:bg-secondary"
                      aria-label="Close chat"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === MessageType.USER ? "justify-end" : "justify-start"}`}
                              >
                      {message.type === MessageType.PRODUCT ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[95%] space-y-4 neon-border">
                          <p className="text-foreground">{message.content}</p>
                          {isLoadingProducts ? (
                            <div className="flex justify-center items-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                              <span className="ml-2 text-foreground">{defaultStrings.loadingProducts}</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {products && products.length > 0 ? (
                                products.map((product) => (
                                  <div key={product._id} className="bg-card p-3 rounded-md neon-border">
                                    {product.image_url && (
                                      <img
                                        src={product.image_url} 
                                        alt={product.name} 
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = "/placeholder.svg?height=100&width=100";
                                        }}
                                      />
                                    )}
                                    <h3 className="font-semibold text-primary">{product.name}</h3>
                                    <p className="text-sm text-foreground/80 mt-1 line-clamp-2">{product.description}</p>
                                    <p className="text-sm text-primary mt-1">₹{product.price?.toLocaleString() || 'N/A'}</p>
                                        <Button
                                      variant="outline"
                                          size="sm"
                                      className="mt-2 text-primary border-primary/50 hover:bg-primary/10"
                                          onClick={() => {
                                        addMessage(
                                          MessageType.BOT,
                                          `You selected ${product.name}. Our team will contact you with more details about this product.`
                                        );
                                          }}
                                        >
                                          {defaultStrings.learnMore}
                                        </Button>

                                      </div>
                                ))
                              ) : (
                                <div className="col-span-2 text-center p-4">
                                  <p className="text-foreground">No products found. Please try again later.</p>
                                    </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : message.type === MessageType.CONTACT ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                          <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                          <div className="space-y-2">
                            <p className="text-foreground flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-primary" />
                              +1 (555) 123-4567
                            </p>
                            <p className="text-foreground flex items-center">
                              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                              support@swansorter.com
                            </p>
                          <Button
                              variant="outline" 
                              size="sm" 
                              className="mt-1 text-primary border-primary/50 hover:bg-primary/10"
                            onClick={() => {
                                window.open('tel:+15551234567', '_blank');
                            }}
                          >
                            {defaultStrings.callNow}
                          </Button>
                          </div>
                        </div>
                      ) : message.type === MessageType.CATALOG ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                          <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                          <p className="text-foreground mb-3">
                            {defaultStrings.catalogDesc}
                          </p>
                          <Button 
                            variant="outline" 
                            className="text-primary border-primary/50 hover:bg-primary/10"
                            onClick={() => {
                              // Simulate catalog download
                              addMessage(
                                MessageType.BOT,
                                "Your catalog download has started. You'll receive it shortly."
                              );
                              // In a real app, you would trigger an actual download here
                              setTimeout(() => {
                                window.open('VVCE_AIML_VIKASVS.pdf', '_blank');
                              }, 1500);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {defaultStrings.downloadPDF}
                          </Button>
                        </div>
                      ) : message.type === MessageType.SUPPORT ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                          <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                          <p className="text-foreground mb-3">
                          </p>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              className="text-primary border-primary/50 hover:bg-primary/10"
                              onClick={() => {
                                window.open('tel:+15551234567', '_blank');
                              }}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                            </Button>
                            <Button 
                              variant="outline"
                              className="text-primary border-primary/50 hover:bg-primary/10"
                              onClick={() => {
                                addMessage(
                                  MessageType.BOT,
                                  "Connecting you to live chat. A support agent will be with you shortly."
                                );
                                // In a real app, you would open a live chat widget here
                              }}
                            >
                              <MessageCircle className="h-4 w-4 mr-2" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-lg p-3 max-w-[85%] ${
                            message.type === MessageType.USER
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-secondary/50 text-foreground neon-border"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-secondary/50 rounded-lg p-3 max-w-[85%] neon-border">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Enquiry form */}
                  {showEnquiryForm && (
                    <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-foreground">
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className="bg-card/50 border-primary/30 text-foreground"
                          />
                          {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-foreground">
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className="bg-card/50 border-primary/30 text-foreground"
                          />
                          {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-foreground">
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleFormChange}
                            className="bg-card/50 border-primary/30 text-foreground"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-foreground">
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            className="bg-card/50 border-primary/30 text-foreground"
                            rows={3}
                          />
                          {formErrors.message && <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowEnquiryForm(false)}
                            className="border-primary/30 text-foreground hover:bg-secondary"
                          >
                          </Button>
                          <Button onClick={handleSubmitEnquiry} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invisible element for auto-scrolling */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat input */}
                <div className="p-4 border-t border-primary/30 bg-card">
                  <div className="flex space-x-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={defaultStrings.typeMessage}
                      className="bg-secondary/30 border-primary/30 text-foreground"
                      disabled={isProcessing}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isProcessing}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
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

