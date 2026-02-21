import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

const ChatBotModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm She_Safe's AI Assistant. I'm here to help you with safety tips, travel advice, and information about our features. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const commonResponses = {
    safety: "Safety is our top priority! Always share your travel itinerary with trusted contacts, register your trip with your embassy, and keep emergency numbers handy. Use our Emergency SOS feature for immediate help.",
    buddy: "Our Buddy Finder helps you connect with verified women travelers. You can filter by destination, travel dates, and travel style. All profiles are verified through our DigiLocker integration for maximum safety.",
    schedule: "The My Schedule feature allows you to post your travel plans and find other travelers going to the same destination. You can also view others' schedules to find potential travel buddies.",
    emergency: "The Emergency SOS feature provides one-tap emergency alerts. It shares your real-time location with trusted contacts and emergency services. You can customize your emergency contacts in settings.",
    verification: "All users on She_Safe are verified through DigiLocker for added security. Our verification process ensures you're connecting with genuine women travelers only.",
    scam: "Be cautious of requests for money, requests to move communication off-platform, and too-good-to-be-true offers. Always use our in-app messaging and report suspicious behavior immediately.",
    default: "I understand! Here are some helpful topics: Safety Tips, Buddy Finder, My Schedule, Emergency Features, Verification Process, or Scam Prevention. Feel free to ask about any of these!"
  };

  const generateBotResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes('safe') || lower.includes('safety') || lower.includes('tips')) {
      return commonResponses.safety;
    } else if (lower.includes('buddy') || lower.includes('connect') || lower.includes('friend')) {
      return commonResponses.buddy;
    } else if (lower.includes('schedule') || lower.includes('trip') || lower.includes('plan')) {
      return commonResponses.schedule;
    } else if (lower.includes('emergency') || lower.includes('sos') || lower.includes('help')) {
      return commonResponses.emergency;
    } else if (lower.includes('verif') || lower.includes('authentic') || lower.includes('genuine')) {
      return commonResponses.verification;
    } else if (lower.includes('scam') || lower.includes('fraud') || lower.includes('fake')) {
      return commonResponses.scam;
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hi there! Welcome to She_Safe. How can I assist you today? You can ask about our features, safety tips, or how to get the most out of the platform.";
    }
    return commonResponses.default;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <MessageCircle size={24} />
            <h2 className="text-xl font-bold">She_Safe Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-200 dark:border-gray-600 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="btn btn-primary p-2 flex items-center justify-center disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBotModal;
