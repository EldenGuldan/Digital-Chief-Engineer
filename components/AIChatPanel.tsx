
import React, { useState, useEffect, useRef } from 'react';
import { Bot, ChevronRight, Send, Loader2, Fingerprint, Database, BookOpen, CheckCircle2, RefreshCw, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { Message, Source } from '../types';
import SourceInspector from './SourceInspector';

interface AIChatPanelProps {
  isOpen: boolean;
  toggleOpen: () => void;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ isOpen, toggleOpen, messages, onSendMessage, isThinking }) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    onSendMessage(input);
    setInput('');
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = (msg: Message) => {
    const msgIndex = messages.findIndex(m => m.id === msg.id);
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        onSendMessage(messages[i].content);
        break;
      }
    }
  };

  const renderContentWithCitations = (content: string, sources: Source[] | null | undefined) => {
    if (!sources || sources.length === 0) return content;
    const parts = content.split(/(\[\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const id = match[1];
        const source = sources.find(s => s.id === id);
        return (
          <sup 
            key={i} 
            className={`font-bold cursor-pointer mx-0.5 px-0.5 rounded transition-all ${
              selectedSource?.id === id ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-100'
            }`}
            onClick={() => source && setSelectedSource(source)}
          >
            {part}
          </sup>
        );
      }
      return part;
    });
  };

  return (
    <div className={`fixed right-0 top-0 h-full bg-white shadow-2xl transition-all duration-300 z-30 flex flex-col border-l border-slate-200 ${isOpen ? 'w-[400px]' : 'w-0 opacity-0 pointer-events-none'}`}>
       {/* 主聊天视图 */}
       <div className={`flex flex-col h-full transition-all duration-300 absolute inset-0 bg-white ${selectedSource ? 'translate-x-[-100px] opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
           <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                    <Bot size={18} />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">数字主工</h3>
                    <div className="flex items-center gap-1 text-[10px] text-green-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Gemini 在线
                    </div>
                </div>
              </div>
              <button onClick={toggleOpen} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <ChevronRight size={20} />
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 space-y-6 scroll-smooth">
              {messages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.type === 'ai' && !isThinking && (
                      <button 
                        onClick={() => handleRegenerate(msg)}
                        className="mb-1.5 flex items-center gap-1 text-[9px] font-black text-slate-400 hover:text-blue-600 transition-colors tracking-widest uppercase"
                      >
                        <RefreshCw size={10} /> 重生成
                      </button>
                    )}
                    <div className={`max-w-[85%] rounded-xl p-3 text-sm leading-relaxed shadow-sm ${
                        msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                    }`}>
                        <div className="whitespace-pre-wrap">
                            {msg.type === 'ai' ? renderContentWithCitations(msg.content, msg.sources) : msg.content}
                        </div>
                    </div>

                    {msg.type === 'ai' && (
                      <div className="mt-2 flex flex-col gap-2 w-full max-w-[85%]">
                        {/* 引用标签 */}
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                 {msg.sources.map(src => (
                                    <button 
                                        key={src.id} 
                                        onClick={() => setSelectedSource(src)}
                                        className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
                                    >
                                        <BookOpen size={10} /> 溯源 [{src.id}]
                                    </button>
                                 ))}
                            </div>
                        )}

                        <div className="flex items-center gap-0.5">
                            <button 
                              onClick={() => handleCopy(msg.content, msg.id)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 transition-all rounded"
                            >
                              {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 transition-all rounded">
                              <ThumbsUp size={12} />
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 transition-all rounded">
                              <ThumbsDown size={12} />
                            </button>
                        </div>
                      </div>
                    )}
                 </div>
              ))}
              
              {isThinking && (
                  <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-4 shadow-sm w-[90%] animate-in fade-in slide-in-from-left-2">
                          <div className="flex items-center gap-2 text-xs text-blue-600 font-black uppercase tracking-widest mb-3">
                              <Loader2 className="animate-spin" size={14} />
                              <span>思考中...</span>
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-slate-600">意图识别已完成</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Database size={12} className="text-blue-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-800">正在检索规范数据库...</span>
                             </div>
                             <div className="flex items-center gap-2 opacity-30">
                                <BookOpen size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400">组织专业回答</span>
                             </div>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
           </div>

           <div className="p-4 border-t border-slate-200 bg-white shrink-0">
              <div className="flex gap-2">
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="快速提问..."
                    disabled={isThinking}
                />
                <button 
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className={`bg-blue-600 text-white p-2 rounded-lg transition-all shadow-sm ${isThinking || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'}`}
                >
                    <Send size={18} />
                </button>
              </div>
           </div>
       </div>

       {/* 溯源详情展开页 (Slide in) */}
       <div className={`absolute inset-0 bg-white transition-transform duration-300 transform ${selectedSource ? 'translate-x-0' : 'translate-x-full'} z-40 shadow-xl`}>
            {selectedSource && (
                <SourceInspector source={selectedSource} onClose={() => setSelectedSource(null)} />
            )}
       </div>
    </div>
  );
};

export default AIChatPanel;
