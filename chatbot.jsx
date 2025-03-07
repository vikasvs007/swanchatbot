"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Phone, Download, MessageCircle, Maximize2, Minimize2, Loader2 } from "lucide-react"
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

// API endpoint for products
const API_ENDPOINT = "https://crud-backend-a70z.onrender.com/api/products" // Your actual API endpoint

// Languages available for the chatbot
const languages = {
  en: {
  welcome: "Hello! Welcome to SwanSorter. How can I assist you today? You can type 'Product' to see our data sorting solutions, 'Contact' to get our details, 'Enquiry' to submit a request, 'Catalog' to download our catalog, or 'Support' to speak with our team.",
  productIntro: "Here are our SwanSorter solutions:",
  contactInfo: "Contact Information",
  loadingProducts: "Loading products...",
  enquirySubmitted: "Thank you, {name}! Your enquiry has been submitted. Our team will contact you shortly at {email}.",
  notUnderstood: "I'm not sure I understand. You can type 'Product', 'Contact', 'Enquiry', 'Catalog', or 'Support' to get started.",
  submitEnquiry: "Submit an Enquiry",
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
  required: "required",
  invalidEmail: "Email is invalid",
  cancel: "Cancel",
  submit: "Submit",
  downloadCatalog: "Download our SwanSorter catalog",
  catalogDesc: "Our comprehensive product catalog with detailed specifications and pricing.",
  downloadPDF: "Download PDF",
  supportTeam: "Connect with our support team",
  supportDesc: "Our support team is available 24/7 to assist you with any questions or issues.",
  callNow: "Call Now",
  liveChat: "Live Chat",
  learnMore: "Learn More",
  typeMessage: "Type a message...",
  },
  es: {
    welcome: "¡Hola! Bienvenido a SwanSorter. ¿Cómo puedo ayudarte hoy? Puedes escribir 'Producto' para ver nuestras soluciones de clasificación de datos, 'Contacto' para obtener nuestros detalles, 'Consulta' para enviar una solicitud, 'Catálogo' para descargar nuestro catálogo o 'Soporte' para hablar con nuestro equipo.",
    productIntro: "Aquí están nuestras soluciones SwanSorter:",
    contactInfo: "Información de Contacto",
    loadingProducts: "Cargando productos...",
    enquirySubmitted: "¡Gracias, {name}! Tu consulta ha sido enviada. Nuestro equipo se pondrá en contacto contigo pronto en {email}.",
    notUnderstood: "No estoy seguro de entender. Puedes escribir 'Producto', 'Contacto', 'Consulta', 'Catálogo' o 'Soporte' para comenzar.",
    submitEnquiry: "Enviar una Consulta",
    name: "Nombre",
    email: "Correo electrónico",
    phone: "Teléfono",
    message: "Mensaje",
    required: "requerido",
    invalidEmail: "El correo electrónico no es válido",
    cancel: "Cancelar",
    submit: "Enviar",
    downloadCatalog: "Descarga nuestro catálogo SwanSorter",
    catalogDesc: "Nuestro catálogo completo de productos con especificaciones detalladas y precios.",
    downloadPDF: "Descargar PDF",
    supportTeam: "Conecta con nuestro equipo de soporte",
    supportDesc: "Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier pregunta o problema.",
    callNow: "Llamar Ahora",
    liveChat: "Chat en Vivo",
    learnMore: "Más Información",
    typeMessage: "Escribe un mensaje...",
  },
  fr: {
    welcome: "Bonjour! Bienvenue à SwanSorter. Comment puis-je vous aider aujourd'hui? Vous pouvez taper 'Produit' pour voir nos solutions de tri de données, 'Contact' pour obtenir nos coordonnées, 'Demande' pour soumettre une requête, 'Catalogue' pour télécharger notre catalogue, ou 'Support' pour parler avec notre équipe.",
    productIntro: "Voici nos solutions SwanSorter:",
    contactInfo: "Informations de Contact",
    loadingProducts: "Chargement des produits...",
    enquirySubmitted: "Merci, {name}! Votre demande a été soumise. Notre équipe vous contactera bientôt à {email}.",
    notUnderstood: "Je ne suis pas sûr de comprendre. Vous pouvez taper 'Produit', 'Contact', 'Demande', 'Catalogue', ou 'Support' pour commencer.",
    submitEnquiry: "Soumettre une Demande",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    message: "Message",
    required: "requis",
    invalidEmail: "L'email est invalide",
    cancel: "Annuler",
    submit: "Soumettre",
    downloadCatalog: "Téléchargez notre catalogue SwanSorter",
    catalogDesc: "Notre catalogue complet de produits avec des spécifications détaillées et des prix.",
    downloadPDF: "Télécharger PDF",
    supportTeam: "Connectez-vous avec notre équipe de support",
    supportDesc: "Notre équipe de support est disponible 24/7 pour vous aider avec toutes questions ou problèmes.",
    callNow: "Appeler Maintenant",
    liveChat: "Chat en Direct",
    learnMore: "En Savoir Plus",
    typeMessage: "Tapez un message...",
}
};

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
  const [currentLanguage, setCurrentLanguage] = useState('en')

  // Initialize language from localStorage or default to English
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);
      
  // Change language function
  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    // Refresh welcome message
    if (messages.length === 1 && messages[0].type === MessageType.BOT) {
      setMessages([
        {
          id: Date.now().toString(),
          type: MessageType.BOT,
          content: languages[lang].welcome,
          timestamp: new Date(),
        },
      ]);
      }
    };

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            type: MessageType.BOT,
            content: languages[currentLanguage].welcome,
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
    }
  }, [isOpen, messages.length, currentLanguage])

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
          languages[currentLanguage].enquirySubmitted.replace("{name}", formData.name).replace("{email}", formData.email),
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
        addMessage(MessageType.PRODUCT, languages[currentLanguage].productIntro)
        fetchProducts();
      } else if (userInput.includes("contact") || userInput.includes("contacto") || userInput.includes("contact")) {
        addMessage(MessageType.CONTACT, languages[currentLanguage].contactInfo)
      } else if (userInput.includes("enquiry") || userInput.includes("consulta") || userInput.includes("demande")) {
        setShowEnquiryForm(true)
      } else if (userInput.includes("catalog") || userInput.includes("catálogo") || userInput.includes("catalogue")) {
        addMessage(MessageType.CATALOG, languages[currentLanguage].downloadCatalog)
      } else if (userInput.includes("support") || userInput.includes("soporte") || userInput.includes("support")) {
        addMessage(MessageType.SUPPORT, languages[currentLanguage].supportTeam)
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
          languages[currentLanguage].notUnderstood,
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
                  {/* Language selector */}
                  <div className="mr-2">
                    <select 
                      value={currentLanguage}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="bg-secondary text-foreground border border-primary/30 rounded p-1 text-sm"
                    >
                      <option value="en">🇺🇸 EN</option>
                      <option value="es">🇪🇸 ES</option>
                      <option value="fr">🇫🇷 FR</option>
                    </select>
                </div>
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
                              <span className="ml-2 text-foreground">{languages[currentLanguage].loadingProducts}</span>
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
                                          {languages[currentLanguage].learnMore}
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
                            {languages[currentLanguage].callNow}
                              </Button>
                            </div>
                          </div>
                      ) : message.type === MessageType.CATALOG ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                          <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                          <p className="text-foreground mb-3">
                            {languages[currentLanguage].catalogDesc}
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
                            {languages[currentLanguage].downloadPDF}
                              </Button>
                              </div>
                      ) : message.type === MessageType.SUPPORT ? (
                        <div className="bg-secondary/50 rounded-lg p-4 max-w-[85%] neon-border">
                          <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                          <p className="text-foreground mb-3">
                            {languages[currentLanguage].supportDesc}
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
                              {languages[currentLanguage].callNow}
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
                              {languages[currentLanguage].liveChat}
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
                      <h3 className="font-semibold text-primary mb-3">{languages[currentLanguage].submitEnquiry}</h3>
                    <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-foreground">
                            {languages[currentLanguage].name} <span className="text-red-500">*</span>
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
                            {languages[currentLanguage].email} <span className="text-red-500">*</span>
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
                            {languages[currentLanguage].phone}
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
                            {languages[currentLanguage].message} <span className="text-red-500">*</span>
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
                            {languages[currentLanguage].cancel}
                          </Button>
                          <Button onClick={handleSubmitEnquiry} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {languages[currentLanguage].submit}
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
                      placeholder={languages[currentLanguage].typeMessage}
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

