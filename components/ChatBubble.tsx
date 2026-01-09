
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar Placeholder */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm border
          ${isUser ? 'bg-slate-100 border-slate-300' : 'bg-emerald-50 border-emerald-200'}`}>
          {isUser ? '👤' : '🎋'}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          {/* Header */}
          <span className="text-xs text-slate-400 mb-1 px-1">
            {isUser ? 'You' : 'Master Zixu'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* Content Box */}
          <div className={`p-4 rounded-2xl shadow-sm border transition-all duration-300
            ${isUser 
              ? 'bg-slate-800 text-white rounded-tr-none border-slate-700' 
              : 'bg-white text-slate-800 rounded-tl-none border-emerald-100'}`}>
            
            {message.type === 'image' && message.imageUrl ? (
              <div className="space-y-3">
                <img 
                  src={message.imageUrl} 
                  alt="Zixu's creation" 
                  className="rounded-lg w-full h-auto shadow-inner border border-slate-100"
                />
                <p className="whitespace-pre-wrap leading-relaxed text-sm italic">
                  {message.content}
                </p>
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
