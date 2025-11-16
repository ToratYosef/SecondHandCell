'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

/**
 * ChatWidget Component
 * Placeholder for the support chat widget.
 */
const ChatWidget: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      // In a real app, this would send the message to a Firebase/socket service
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-green-600 transition z-50 focus:outline-none focus:ring-4 focus:ring-green-300"
        aria-label="Open chat widget"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faComments} size="lg" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-[100] transition-all duration-300">
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">Live Support</h3>
            <button onClick={toggleChat} className="text-white opacity-80 hover:opacity-100" aria-label="Close chat">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50">
            {/* Placeholder Messages */}
            <div className="flex justify-start">
              <div className="bg-gray-200 p-2 rounded-lg max-w-[80%]">Welcome! How can I help you sell your phone today?</div>
            </div>
            <div className="flex justify-end">
              <div className="bg-indigo-500 text-white p-2 rounded-lg max-w-[80%]">What is the quote process like?</div>
            </div>
          </div>

          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              onClick={handleSendMessage}
              className="ml-2 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-700 transition"
              aria-label="Send message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;