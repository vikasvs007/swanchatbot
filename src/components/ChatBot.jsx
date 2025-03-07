import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Phone, Download, MessageCircle, Maximize2, Minimize2, Loader2, Globe } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

// Define message types
const MessageType = {
  USER: "user",
  BOT: "bot",
  PRODUCT: "product",
  CONTACT: "contact",
  ENQUIRY: "enquiry",
  CATALOG: "catalog",
  SUPPORT: "support",
};

// API endpoint for products
const API_ENDPOINT = "https://crud-backend-a70z.onrender.com/api/products";

// Form validation function
const validateForm = (formData) => {
  const errors = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }
  
  if (!formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }
  
  if (!formData.message.trim()) {
    errors.message = "Message is required";
  }

  return errors;
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeMode, setIsLargeMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [language, setLanguage] = useState('en');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const translations = {
    en: {
      welcome: "Hello! How can I assist you today? You can type 'Product' to see our product list, 'Contact' to get our details, 'Enquiry' to submit a request, 'Catalog' to download our catalog, or 'Support' to speak with an agent.",
      product: "Our Products",
      contact: "Contact Information",
      enquiry: "Submit Enquiry",
      support: "Support Options",
      catalog: "Download Catalog",
      thankYou: "Thank you for your enquiry! Our team will reach out to you shortly.",
      supportHours: "Support Hours: Monday - Friday, 9 AM - 6 PM EST",
      loadingProducts: "Loading products...",
      catalogDesc: "Our comprehensive product catalog with detailed specifications and pricing.",
      supportDesc: "Our support team is available 24/7 to assist you with any questions or issues.",
      notUnderstood: "I'm not sure I understand. You can type 'Product', 'Contact', 'Enquiry', 'Catalog', or 'Support' to get started.",
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      cancel: "Cancel",
      submit: "Submit",
      callNow: "Call Now",
      liveChat: "Live Chat",
      learnMore: "Learn More",
      typeMessage: "Type your message...",
      downloadPDF: "Download PDF",
      enquirySubmitted: "Thank you, {name}! Your enquiry has been submitted. Our team will contact you shortly at {email}."
    },
    es: {
      welcome: "¡Hola! ¿Cómo puedo ayudarte hoy? Escribe 'Producto' para ver nuestra lista de productos, 'Contacto' para obtener nuestros detalles, 'Consulta' para enviar una solicitud, 'Catálogo' para descargar nuestro catálogo o 'Soporte' para hablar con un agente.",
      product: "Nuestros Productos",
      contact: "Información de Contacto",
      enquiry: "Enviar Consulta",
      support: "Opciones de Soporte",
      catalog: "Descargar Catálogo",
      thankYou: "¡Gracias por tu consulta! Nuestro equipo se pondrá en contacto contigo pronto.",
      supportHours: "Horario de Soporte: Lunes - Viernes, 9 AM - 6 PM EST",
      loadingProducts: "Cargando productos...",
      catalogDesc: "Nuestro catálogo completo de productos con especificaciones detalladas y precios.",
      supportDesc: "Nuestro equipo de soporte está disponible 24/7 para ayudarte con cualquier pregunta o problema.",
      notUnderstood: "No estoy seguro de entender. Puedes escribir 'Producto', 'Contacto', 'Consulta', 'Catálogo' o 'Soporte' para comenzar.",
      name: "Nombre",
      email: "Correo electrónico",
      phone: "Teléfono",
      message: "Mensaje",
      cancel: "Cancelar",
      submit: "Enviar",
      callNow: "Llamar Ahora",
      liveChat: "Chat en Vivo",
      learnMore: "Más Información",
      typeMessage: "Escribe tu mensaje...",
      downloadPDF: "Descargar PDF",
      enquirySubmitted: "¡Gracias, {name}! Tu consulta ha sido enviada. Nuestro equipo te contactará pronto en {email}."
    },
    fr: {
      welcome: "Bonjour! Comment puis-je vous aider aujourd'hui? Tapez 'Produit' pour voir notre liste de produits, 'Contact' pour obtenir nos coordonnées, 'Demande' pour soumettre une requête, 'Catalogue' pour télécharger notre catalogue, ou 'Support' pour parler avec notre équipe.",
      product: "Nos Produits",
      contact: "Informations de Contact",
      enquiry: "Soumettre une Demande",
      support: "Options de Support",
      catalog: "Télécharger le Catalogue",
      thankYou: "Merci pour votre demande! Notre équipe vous contactera bientôt.",
      supportHours: "Heures de Support: Lundi - Vendredi, 9h - 18h EST",
      loadingProducts: "Chargement des produits...",
      catalogDesc: "Notre catalogue complet de produits avec spécifications détaillées et prix.",
      supportDesc: "Notre équipe de support est disponible 24/7 pour vous aider avec toutes questions ou problèmes.",
      notUnderstood: "Je ne suis pas sûr de comprendre. Vous pouvez taper 'Produit', 'Contact', 'Demande', 'Catalogue', ou 'Support' pour commencer.",
      name: "Nom",
      email: "Email",
      phone: "Téléphone",
      message: "Message",
      cancel: "Annuler",
      submit: "Soumettre",
      callNow: "Appeler Maintenant",
      liveChat: "Chat en Direct",
      learnMore: "En Savoir Plus",
      typeMessage: "Tapez votre message...",
      downloadPDF: "Télécharger PDF",
      enquirySubmitted: "Merci, {name}! Votre demande a été soumise. Notre équipe vous contactera bientôt à {email}."
    }
  };

  // Initialize language from localStorage or default to English
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  // Change language function
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Refresh welcome message
    if (messages.length === 1 && messages[0].type === MessageType.BOT) {
      setMessages([
        {
          id: Date.now().toString(),
          type: MessageType.BOT,
          content: translations[lang].welcome,
          timestamp: new Date(),
        },
      ]);
    }
  };

  // Initialize chatbot with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: Date.now().toString(),
            type: MessageType.BOT,
            content: translations[language].welcome,
            timestamp: new Date(),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length, language]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleEnquirySubmit = () => {
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      // Add user message
      addMessage(MessageType.USER, `I'd like to submit an enquiry.`);

      // Add bot response
      setIsTyping(true);
      setTimeout(() => {
        addMessage(
          MessageType.BOT,
          translations[language].enquirySubmitted.replace("{name}", formData.name).replace("{email}", formData.email),
        );
        setIsTyping(false);
      }, 1000);

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
      setShowEnquiryForm(false);

      // In a real application, you would send this data to your backend
      console.log("Enquiry submitted:", formData);
    } else {
      setFormErrors(errors);
    }
  };

  const addMessage = (type, content) => {
    const newMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Fetch products from API
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched products:", data);
      setProducts(data);
      setIsLoadingProducts(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoadingProducts(false);
      addMessage(
        MessageType.BOT,
        `Sorry, I couldn't fetch the products. Please try again later. (Error: ${error.message})`
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    // Add user message
    addMessage(MessageType.USER, inputValue);

    // Process user input
    const userInput = inputValue.toLowerCase();
    setInputValue("");

    // Prevent multiple requests from overlapping
    setIsProcessing(true);
    setIsTyping(true);

    // Handle different commands
    setTimeout(() => {
      setIsTyping(false);
      setIsProcessing(false);
      
      if (userInput.includes("product")) {
        addMessage(MessageType.PRODUCT, translations[language].productIntro);
        fetchProducts();
      } else if (userInput.includes("contact")) {
        addMessage(MessageType.CONTACT, translations[language].contactInfo);
      } else if (userInput.includes("enquiry")) {
        setShowEnquiryForm(true);
      } else if (userInput.includes("catalog")) {
        addMessage(MessageType.CATALOG, translations[language].downloadCatalog);
      } else if (userInput.includes("support")) {
        addMessage(MessageType.SUPPORT, translations[language].supportTeam);
      } else if (userInput.includes("language")) {
        addMessage(
          MessageType.BOT,
          "You can change the language to: English (en), Spanish (es), or French (fr). Type 'en', 'es', or 'fr' to change."
        );
      } else if (userInput === "en" || userInput === "es" || userInput === "fr") {
        changeLanguage(userInput);
        addMessage(
          MessageType.BOT,
          `Language changed to ${userInput === "en" ? "English" : userInput === "es" ? "Spanish" : "French"}.`
        );
      } else {
        addMessage(
          MessageType.BOT,
          translations[language].notUnderstood,
        );
      }
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat toggle button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
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
              width: isLargeMode ? 'min(95vw, 800px)' : 'min(90vw, 400px)',
              height: isLargeMode ? 'min(85vh, 800px)' : 'min(70vh, 500px)',
              maxHeight: 'calc(100vh - 120px)'
            }}
          >
            <Card className="flex flex-col h-full border-primary/30 neon-border bg-card/90 backdrop-blur-sm shadow-xl">
              {/* Chat header */}
              <div className="flex items-center justify-between p-4 border-b border-primary/30 bg-gradient-to-r from-[#1a1f2c] to-[#2d364d] shadow-[0_2px_8px_rgba(0,255,0,0.1)]">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img src="/swansorter.png" alt="SwanSorter" className="h-10 w-10 animate-float rounded-full shadow-[0_0_10px_rgba(0,255,0,0.2)]" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1f2c] shadow-[0_0_5px_rgba(0,255,0,0.3)]"></div>
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-primary">SwanSorter Assistant</h2>
                    <p className="text-xs text-primary/70">Online</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Language selector */}
                  <div className="mr-2">
                    <select 
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      className="bg-[#2d364d] text-white border border-primary/30 rounded-md py-1.5 px-2 text-sm hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 cursor-pointer shadow-[0_2px_4px_rgba(0,255,0,0.1)]"
                    >
                      <option value="en" className="bg-[#1a1f2c]">🇺🇸 English</option>
                      <option value="es" className="bg-[#1a1f2c]">🇪🇸 Spanish</option>
                      <option value="fr" className="bg-[#1a1f2c]">🇫🇷 French</option>
                    </select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsLargeMode(!isLargeMode)}
                    className="text-foreground hover:text-primary hover:bg-secondary"
                    aria-label={isLargeMode ? "Minimize chat" : "Maximize chat"}
                  >
                    {isLargeMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary hover:bg-secondary"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === MessageType.USER ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === MessageType.PRODUCT ? (
                      <div className="bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] backdrop-blur-sm rounded-lg p-4 max-w-[95%] space-y-4 border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
                        <p className="text-foreground">{message.content}</p>
                        {isLoadingProducts ? (
                          <div className="flex justify-center items-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-foreground">{translations[language].loadingProducts}</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {products && products.length > 0 ? (
                              products.map((product) => (
                                <div key={product._id} className="bg-[#0f1219] backdrop-blur-sm p-3 rounded-md border border-primary/20 shadow-md hover:shadow-primary/20 transition-all duration-300 shadow-[0_2px_8px_rgba(0,255,0,0.1)]">
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
                                    {translations[language].learnMore}
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
                      <div className="bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] backdrop-blur-sm rounded-lg p-4 max-w-[85%] border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
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
                            {translations[language].callNow}
                          </Button>
                        </div>
                      </div>
                    ) : message.type === MessageType.CATALOG ? (
                      <div className="bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] backdrop-blur-sm rounded-lg p-4 max-w-[85%] border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
                        <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                        <p className="text-foreground mb-3">
                          {translations[language].catalogDesc}
                        </p>
                        <Button
                          variant="outline"
                          className="text-primary border-primary/50 hover:bg-primary/10"
                          onClick={() => {
                            addMessage(
                              MessageType.BOT,
                              "Your catalog download has started. You'll receive it shortly."
                            );
                            setTimeout(() => {
                              window.open('catalog.pdf', '_blank');
                            }, 1500);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {translations[language].downloadPDF}
                        </Button>
                      </div>
                    ) : message.type === MessageType.SUPPORT ? (
                      <div className="bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] backdrop-blur-sm rounded-lg p-4 max-w-[85%] border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
                        <h3 className="font-semibold text-primary mb-2">{message.content}</h3>
                        <p className="text-foreground mb-3">
                          {translations[language].supportDesc}
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
                            {translations[language].callNow}
                          </Button>
                          <Button
                            variant="outline"
                            className="text-primary border-primary/50 hover:bg-primary/10"
                            onClick={() => {
                              addMessage(
                                MessageType.BOT,
                                "Connecting you to live chat. A support agent will be with you shortly."
                              );
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            {translations[language].liveChat}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`rounded-lg p-3 max-w-[85%] backdrop-blur-sm shadow-lg transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)] ${
                          message.type === MessageType.USER
                            ? "bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] text-primary-foreground ml-auto border border-primary/20 hover:shadow-[0_4px_16px_rgba(0,255,0,0.15)]"
                            : "bg-gradient-to-br from-[#0f1219] to-[#1c2333] text-foreground border border-primary/10 hover:shadow-[0_4px_16px_rgba(0,255,0,0.15)]"
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
                    <div className="bg-gradient-to-br from-[#0f1219] to-[#1c2333] backdrop-blur-sm rounded-lg p-3 max-w-[85%] border border-primary/10 shadow-lg shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
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
                  <div className="bg-gradient-to-br from-[#1a1f2c] to-[#2d364d] backdrop-blur-sm rounded-lg p-4 max-w-[85%] border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 shadow-[0_4px_12px_rgba(0,255,0,0.1)]">
                    <h3 className="font-semibold text-primary mb-3">{translations[language].submitEnquiry}</h3>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="name" className="text-foreground">
                          {translations[language].name} <span className="text-red-500">*</span>
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
                          {translations[language].email} <span className="text-red-500">*</span>
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
                          {translations[language].phone}
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
                          {translations[language].message} <span className="text-red-500">*</span>
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
                          {translations[language].cancel}
                        </Button>
                        <Button onClick={handleEnquirySubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                          {translations[language].submit}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Invisible element for auto-scrolling */}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-primary/30 bg-gradient-to-r from-[#1a1f2c] to-[#2d364d]">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={translations[language].typeMessage}
                    className="bg-[#2d364d] border-primary/30 text-white placeholder-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-[0_2px_4px_rgba(0,255,0,0.1)]"
                    disabled={isProcessing}
                  />
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isProcessing}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-[0_2px_4px_rgba(0,255,0,0.2)]"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot; 