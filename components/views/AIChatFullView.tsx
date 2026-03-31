
import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, User, Search, BookOpen, Send, Paperclip, Loader2, 
  ArrowRight, Plane, Sprout, Zap, AlertCircle, Clock, 
  Star, FolderOpen, Plus, MessageSquare, History, ChevronRight,
  CheckCircle2, Fingerprint, Database, ClipboardCheck,
  RefreshCw, Copy, ThumbsUp, ThumbsDown, Edit3, Check
} from 'lucide-react';
import { Message, Source } from '../../types';
import SourceInspector from '../SourceInspector';

interface AIChatFullViewProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isThinking: boolean;
}

const AIChatFullView: React.FC<AIChatFullViewProps> = ({ messages, onSendMessage, isThinking }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedSource, setSelectedSource] = useState<Source | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const historyItems = [
    { id: 101, title: "关于分布式光伏用地红线", time: "10:30", group: "新能源" },
    { id: 102, title: "低空经济基础设施标准", time: "昨天", group: "政策解读" },
    { id: 103, title: "某产业园实施路径自查", time: "2月10日", group: "合规审查" },
  ];

  const groups = ["全部会话", "新能源", "政策解读", "合规审查", "未分组"];

  const hotQueries = [
    { title: "低空经济政策", desc: "查询低空空域管理及补贴政策", icon: Plane, color: "text-sky-600 bg-sky-100" },
    { title: "零碳园区标准", desc: "解读《零碳园区评价标准》", icon: Sprout, color: "text-emerald-600 bg-emerald-100" },
    { title: "光伏用地规范", desc: "用地坡度与红线限制", icon: Zap, color: "text-amber-600 bg-amber-100" },
    { title: "消防强条查询", desc: "建筑设计防火规范强制性条文", icon: AlertCircle, color: "text-red-600 bg-red-100" },
    { title: "智能建造评价", desc: "智能建造评价标准与指标体系", icon: ClipboardCheck, color: "text-indigo-600 bg-indigo-100" },
    { title: "海绵城市设计", desc: "雨水年径流总量控制率计算", icon: FolderOpen, color: "text-blue-600 bg-blue-100" },
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

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

  const isInitialState = messages.length === 1 && messages[0].type === 'ai';

  return (
    <div className="flex h-full bg-[#f8fafc] overflow-hidden text-slate-800">
      {/* 左侧：侧边栏缩窄至 w-64 */}
      <aside className="w-64 bg-[#0a0f1d] text-slate-400 flex flex-col border-r border-slate-800/50 shadow-2xl z-20 shrink-0">
        <div className="p-4">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-lg active:scale-95">
            <Plus size={16} /> 新对话
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-6 py-4 custom-scrollbar">
          <div>
            <div className="flex items-center gap-2 px-3 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <Star size={10} className="text-amber-500" /> 收藏对话
            </div>
            <div className="space-y-1">
              <div className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
                <MessageSquare size={13} className="text-slate-500" />
                <span className="text-[11px] text-slate-300 truncate">重点：苏州光储充规范</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 px-3 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <FolderOpen size={10} className="text-blue-500" /> 业务分组
            </div>
            <div className="space-y-1">
              {groups.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-[11px] group transition-all">
                  <span className={idx === 1 ? 'text-blue-400 font-bold' : ''}>{g}</span>
                  <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-600 group-hover:text-slate-400">12</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 px-3 mb-3 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <History size={10} /> 历史记录
            </div>
            <div className="space-y-0.5">
              {historyItems.map((item) => (
                <div key={item.id} className="group px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
                  <div className="text-[11px] text-slate-300 truncate font-medium mb-1 group-hover:text-white">{item.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-600 uppercase font-black tracking-wider">{item.group}</span>
                    <span className="text-[8px] text-slate-600">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/5 text-[8px] text-slate-600 text-center font-bold tracking-widest uppercase">
          v1.0 Pro
        </div>
      </aside>

      {/* 中间：主对话区 */}
      <main className="flex-1 flex flex-col relative bg-white">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 lg:px-16 custom-scrollbar">
          {isInitialState ? (
            <div className="flex flex-col items-center justify-center min-h-[75vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Logo Section - Visually Larger */}
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-8 transform hover:scale-105 transition-transform duration-500">
                  <Bot size={40} className="text-white" />
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">数字主工 · 智慧决策核心</h1>
                <p className="text-slate-500 mb-12 text-center max-w-2xl text-sm md:text-base font-medium px-4 leading-relaxed">
                  已深度索引全国 <span className="text-blue-600 font-bold">20,000+</span> 工程规范及行业情报。<br/>
                  为您提供精准的规范查询、合规审查与产业决策支持。
                </p>

                {/* Hot Search Section */}
                <div className="w-full max-w-4xl">
                  <div className="flex items-center gap-2 mb-4 px-1">
                     <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                     <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">实时热搜</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotQueries.map((query, idx) => (
                      <div 
                        key={idx}
                        onClick={() => onSendMessage(`请详细介绍${query.title}相关内容`)}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer flex items-center gap-4 group h-24"
                      >
                        <div className={`p-3.5 rounded-xl ${query.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                          <query.icon size={22} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors mb-1">{query.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-snug">{query.desc}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-200 group-hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    ))}
                  </div>
                </div>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto pb-24">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                      msg.type === 'user' ? 'bg-slate-100' : 'bg-blue-600 text-white'
                    }`}>
                      {msg.type === 'user' ? <User size={18} className="text-slate-500" /> : <Bot size={18} />}
                    </div>
                    <div className={`flex-1 flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                      {msg.type === 'ai' && !isThinking && (
                        <button 
                          onClick={() => handleRegenerate(msg)}
                          className="mb-1.5 flex items-center gap-1.5 text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors tracking-widest"
                        >
                          <RefreshCw size={10} /> 重生成
                        </button>
                      )}

                      <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-[95%] leading-relaxed text-xs md:text-sm relative ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white shadow-blue-100' 
                          : 'bg-white text-slate-800 border border-slate-100'
                      }`}>
                        <div className="whitespace-pre-wrap">
                            {msg.type === 'ai' ? renderContentWithCitations(msg.content, msg.sources) : msg.content}
                        </div>
                      </div>
                      
                      {msg.type === 'ai' && (
                        <div className="mt-2.5 flex flex-col gap-2 w-full">
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {msg.sources.map(src => (
                                    <button 
                                        key={src.id} 
                                        onClick={() => setSelectedSource(src)}
                                        className={`flex items-center gap-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                          selectedSource?.id === src.id 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white text-slate-50 border-slate-200 hover:text-blue-600'
                                        }`}
                                    >
                                        <span className={selectedSource?.id === src.id ? 'text-white' : 'text-blue-500'}>#{src.id}</span>
                                        <span className="truncate max-w-[100px]">{src.title}</span>
                                    </button>
                                ))}
                            </div>
                          )}

                          <div className="flex items-center gap-0.5">
                            <button 
                              onClick={() => handleCopy(msg.content, msg.id)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg text-[10px] font-bold flex items-center gap-1"
                            >
                              {copiedId === msg.id ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                              {copiedId === msg.id ? '已复制' : '复制'}
                            </button>
                            <div className="w-px h-2.5 bg-slate-200 mx-1"></div>
                            <button className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg"><ThumbsUp size={12} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"><ThumbsDown size={12} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isThinking && (
                  <div className="flex gap-4 animate-in fade-in duration-300">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shrink-0">
                        <Bot size={18} className="animate-pulse" />
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm max-w-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <Loader2 className="animate-spin text-blue-500" size={16} />
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">正在思考...</span>
                          </div>
                          
                          <div className="space-y-3">
                             <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0"><Fingerprint size={12} className="text-blue-500" /></div>
                                <div className="flex-1">
                                   <p className="text-[10px] font-bold text-slate-700">语义建模中</p>
                                   <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                      <div className="h-full bg-blue-500 w-[100%] transition-all duration-1000"></div>
                                   </div>
                                </div>
                                <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                             </div>

                             <div className="flex items-start gap-2.5">
                                <div className="mt-0.5 shrink-0"><Database size={12} className="text-blue-500" /></div>
                                <div className="flex-1">
                                   <p className="text-[10px] font-bold text-slate-700">规范数据库检索</p>
                                   <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                      <div className="h-full bg-blue-500 w-[80%] animate-pulse"></div>
                                   </div>
                                </div>
                             </div>
                          </div>
                        </div>
                      </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 底部输入框 - 更加紧凑 */}
        <div className="bg-white/90 backdrop-blur-xl p-4 md:p-5 border-t border-slate-100">
          <div className="max-w-4xl mx-auto relative group">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="键入技术问题..."
                className="w-full pl-5 pr-14 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none resize-none bg-white/50 text-xs md:text-sm h-12 min-h-[48px] max-h-32 transition-all font-medium"
              />
              <div className="absolute right-2 bottom-2 flex gap-1.5">
                <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-all"><Paperclip size={18} /></button>
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isThinking}
                  className={`p-1.5 rounded-lg text-white transition-all ${
                    !inputValue.trim() || isThinking ? 'bg-slate-200' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                    <Send size={18} />
                </button>
              </div>
          </div>
        </div>
      </main>

      {/* 右侧：溯源详情边栏 - 宽度 350px 适配小屏 */}
      <div className={`bg-white border-l border-slate-200 transition-all duration-500 ease-in-out relative flex-shrink-0 z-30 shadow-2xl overflow-hidden ${
        selectedSource ? 'w-[350px]' : 'w-0'
      }`}>
        {selectedSource && (
          <div className="w-[350px] h-full flex flex-col">
            <SourceInspector source={selectedSource} onClose={() => setSelectedSource(null)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChatFullView;
