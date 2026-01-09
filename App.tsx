
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message, ChatState } from './types';
import { geminiService } from './services/geminiService';
import ChatBubble from './components/ChatBubble';
import ActionPanel from './components/ActionPanel';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        role: 'assistant',
        content: 'Greetings, seeker. I am Master Zixu. I dwell within the silences between thoughts and the ink upon the page. How may I guide your spirit today?',
        timestamp: new Date(),
        type: 'text'
      }
    ],
    isLoading: false,
    error: null
  });

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  const handleSend = async (customPrompt?: string, forceType?: 'text' | 'image') => {
    const text = customPrompt || inputValue.trim();
    if (!text || state.isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
      type: 'text'
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true,
      error: null
    }));
    setInputValue('');

    try {
      // Logic for painting if the user asks specifically or uses the button
      const isPaintRequest = forceType === 'image' || text.toLowerCase().includes('paint') || text.toLowerCase().includes('draw');

      if (isPaintRequest) {
        const imageUrl = await geminiService.paintImage(text);
        if (imageUrl) {
          const assistantMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I have gathered the celestial ink to visualize your thought: "${text}"`,
            timestamp: new Date(),
            type: 'image',
            imageUrl
          };
          setState(prev => ({ ...prev, messages: [...prev.messages, assistantMsg], isLoading: false }));
        } else {
          throw new Error("Could not paint the vision.");
        }
      } else {
        const history = state.messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model', // Gemini expects 'model' role
          parts: [{ text: m.content }]
        }));

        const responseText = await geminiService.generateResponse(text, history as any);
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseText,
          timestamp: new Date(),
          type: 'text'
        };
        setState(prev => ({ ...prev, messages: [...prev.messages, assistantMsg], isLoading: false }));
      }
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Master Zixu's connection to the ethereal plane was severed. Please try again."
      }));
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto shadow-2xl bg-[#fdfcf7] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <h1 className="calligraphy text-9xl">子虚</h1>
      </div>
      <div className="absolute bottom-20 left-4 opacity-10 pointer-events-none">
        <span className="text-6xl">🎋</span>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-emerald-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-800 rounded-lg flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <span className="text-white calligraphy text-2xl">子</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">Zixu AI</h1>
            <p className="text-xs text-emerald-600 font-medium">Master of the Void</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <button className="hover:text-emerald-600 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          {state.messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {state.isLoading && (
            <div className="flex justify-start mb-6 items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl">🎋</div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-emerald-100 shadow-sm text-slate-400 italic text-sm">
                Master Zixu is grinding the ink...
              </div>
            </div>
          )}
          {state.error && (
            <div className="text-center p-4 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {state.error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Footer / Input Area */}
      <footer className="p-4 md:p-6 bg-white/90 backdrop-blur-md border-t border-emerald-100">
        <div className="max-w-3xl mx-auto">
          <ActionPanel 
            onAction={(p, t) => handleSend(p, t)} 
            disabled={state.isLoading} 
          />
          
          <div className="relative group">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Whisper your thoughts to the void..."
              disabled={state.isLoading}
              className="w-full px-6 py-4 pr-16 rounded-full border border-slate-200 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all shadow-inner
                       disabled:opacity-50 text-slate-700 placeholder:text-slate-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={state.isLoading || !inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 rounded-full bg-emerald-800 text-white font-medium 
                       hover:bg-emerald-700 active:scale-95 transition-all disabled:bg-slate-300 disabled:scale-100
                       shadow-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest">
            Ancient Wisdom • Modern Intelligence • Truly Fictional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
