import React, { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-foreground dark:text-dark-foreground">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Support</h1>
          <div className="max-w-2xl mx-auto">
            <ChatBot />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App; 