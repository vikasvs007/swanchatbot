// API endpoint for product data
export const API_ENDPOINT = "https://crud-backend-a70z.onrender.com/api/products"

// Message types for different chat interactions
export const MessageType = {
  BOT: "bot",
  USER: "user",
  PRODUCT: "product",
  CONTACT: "contact",
  CATALOG: "catalog",
  SUPPORT: "support",
}

// Default strings for the chatbot interface
export const defaultStrings = {
  welcome: "👋 Hello! I'm the SwanSorter Assistant. How can I help you today? You can ask about our products, request a catalog, or get support.",
  notUnderstood: "I'm sorry, I didn't understand that. You can ask about our products, contact information, submit an enquiry, download our catalog, or get support.",
  productIntro: "Here are some of our popular products:",
  contactInfo: "📞 You can reach our team at: +1 (555) 123-4567 or email us at support@swansorter.com",
  downloadCatalog: "You can download our product catalog here",
  supportTeam: "Our support team is ready to help you",
  enquirySubmitted: "Thank you {name}! We've received your enquiry and will contact you at {email} soon.",
  loadingProducts: "Loading products...",
  learnMore: "Learn More",
  callNow: "Call Now",
  catalogDesc: "Our comprehensive product catalog includes detailed specifications, pricing, and application examples for all our sorting solutions.",
  downloadPDF: "Download PDF",
  supportDesc: "Our technical support team is available 24/7 to help with any questions or issues you might have.",
  liveChat: "Live Chat",
  submitEnquiry: "Submit an Enquiry",
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
  cancel: "Cancel",
  submit: "Submit",
  typeMessage: "Type your message here...",
}

// Form validation function
export const validateForm = (data) => {
  const errors = {}
  
  if (!data.name.trim()) {
    errors.name = "Name is required"
  }
  
  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Email is invalid"
  }
  
  if (!data.message.trim()) {
    errors.message = "Message is required"
  }
  
  return errors
} 