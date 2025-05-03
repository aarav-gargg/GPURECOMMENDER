import React, { useState, useCallback } from 'react';
import WorkloadForm from './components/WorkloadForm';
import RecommendationsList from './components/RecommendationsList';
import CostComparison from './components/CostComparison';
import Chatbot from './components/Chatbot';
import { WorkloadRequirements, Recommendation, ChatMessage } from './types';
import { generateRecommendations } from './services/recommendationService';
import { analyzeWorkloadDescription, getChatbotResponse } from './services/aiService';
import { Zap, AlignJustify, Moon, Sun } from 'lucide-react';

function App() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [workloadType, setWorkloadType] = useState<'training' | 'inference'>('training');
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleRequirementsSubmit = useCallback((requirements: WorkloadRequirements) => {
    setWorkloadType(requirements.workloadType);
    const newRecommendations = generateRecommendations(requirements);
    setRecommendations(newRecommendations);
  }, []);

  const handleAiAssist = useCallback(async (description: string) => {
    try {
      const requirements = await analyzeWorkloadDescription(description);
      // Display a message to the user that AI is analyzing their input
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've analyzed your workload description and filled in the form with my best guess. Feel free to adjust any values before getting recommendations.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error using AI assistant:', error);
    }
  }, []);

  const handleChatMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);
    
    try {
      const response = await getChatbotResponse(message);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap size={28} className="text-purple-600 dark:text-purple-400" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AceCloud GPU Optimizer</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <nav>
                <ul className="flex space-x-8">
                  <li>
                    <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      Cost Calculator
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                      Documentation
                    </a>
                  </li>
                </ul>
              </nav>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none mr-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Open menu"
              >
                <AlignJustify size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileNav && (
          <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
            <nav className="px-4 py-3">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Cost Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Documentation
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form section */}
            <div className="lg:col-span-4">
              <WorkloadForm 
                onSubmit={handleRequirementsSubmit} 
                onAiAssist={handleAiAssist} 
              />
            </div>
            
            {/* Results section */}
            <div className="lg:col-span-8 space-y-8">
              {recommendations.length > 0 ? (
                <>
                  <CostComparison 
                    recommendations={recommendations} 
                    workloadType={workloadType} 
                  />
                  <RecommendationsList 
                    recommendations={recommendations} 
                    workloadType={workloadType} 
                  />
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to AceCloud GPU Optimizer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Find the perfect GPU for your AI workloads at the best price. Fill out the form to get started.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        Personalized Recommendations
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Get GPU recommendations tailored to your specific workload requirements.
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        Cost Optimization
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Compare costs across different GPU options to maximize your budget.
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                        AI-Powered Assistance
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Describe your workload in plain language and let our AI fill in the technical details.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Zap size={20} className="text-purple-600 dark:text-purple-400" />
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                AceCloud GPU Optimizer © 2025
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot
        onSendMessage={handleChatMessage}
        messages={chatMessages}
        isLoading={chatLoading}
      />
    </div>
  );
}

export default App;