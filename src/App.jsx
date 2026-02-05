import React, { useState } from 'react';
import { Send, Paperclip, Recycle, User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ChatInput from './components/ChatInput';

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm Waste Segregator. Upload an image or ask me about any item, and I'll tell you how to dispose of it! ♻️", sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text, file) => {
    // 1. Add User Message to UI
    const userMsg = { id: Date.now(), text, file, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true); // Show thinking state
  
    // 2. Prepare FormData
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('query', text);
    }
  
    try {
      // 3. Hit the Backend
      const endpoint = file ? 'upload' : 'chat';
      const response = await fetch(`https://your-ngrok-url.ngrok-free.app/${endpoint}`, {
        method: 'POST',
        headers: {
          // THIS HEADER IS MANDATORY FOR NGROK + CORS
          "ngrok-skip-browser-warning": "69420", 
        },
        body: formData,
      });
  
      const data = await response.json();
  
      // 4. Add Bot Response to UI
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: data.analysis, 
        sender: 'bot' 
      }]);
  
    } catch (error) {
      console.error("Connection Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: "Sorry, I'm having trouble connecting to the brain (Backend). Is the Python server running?", 
        sender: 'bot' 
      }]);
    } finally {
      setIsTyping(false); // Hide thinking state
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modern Header */}
        <header className="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl">
              <Recycle size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Waste Segregation</h1>
              <p className="text-emerald-100 text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span> Online AI Assistant
              </p>
            </div>
          </div>
        </header>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.sender === 'user' ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                  {m.sender === 'user' ? <User size={16} color="white"/> : <Bot size={16} className="text-slate-600"/>}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm ${
                  m.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {/* Updated to use ReactMarkdown for better formatting */}
                  <div className="text-sm leading-relaxed prose prose-slate max-w-none">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                  
                  {m.file && (
                    <div className="mt-3 p-2 bg-black/10 rounded-lg flex items-center gap-2 text-xs border border-white/20">
                      <Paperclip size={12} />
                      <span className="truncate">{m.file.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isTyping && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-100 text-slate-400 text-xs py-2 px-4 rounded-full border border-slate-200">
                AI is analyzing waste...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}

export default App;