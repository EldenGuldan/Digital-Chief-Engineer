
import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import Sidebar from './components/Sidebar';
import IndustryView from './components/views/IndustryView';
import ProjectView from './components/views/ProjectView';
import StandardView from './components/views/StandardView';
import CollectionView from './components/views/CollectionView';
import AIChatFullView from './components/views/AIChatFullView';
import HomeView from './components/views/HomeView';
import AdminView from './components/views/AdminView';
import AIChatPanel from './components/AIChatPanel';
import { generateStructuredAIContent } from './services/geminiService';
import { Message, AppTab, Source } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: 'ai', content: '您好，我是您的AI数字主工。基于RAG知识库，我可以为您解答产业政策、查询设计规范或分析项目数据。请问今天需要协助什么？' }
  ]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now(), type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    const systemPrompt = `你是一位建筑工程行业的‘数字主工’（高级总工程师助手）。
你的任务是根据企业知识库回答问题。回答应严谨、专业。
你必须在回答中通过 [n] 格式标注引用来源。
你必须在 citations 数组中提供每一个引用来源的原文片段(snippet)和具体章节(location)。`;
    
    const { answer, citations } = await generateStructuredAIContent(text, systemPrompt);

    setIsThinking(false);
    
    // 将返回的引用数据转换为应用内的 Source 类型
    const mappedSources: Source[] = citations.map(c => ({
      id: c.id.toString(),
      title: c.sourceTitle,
      snippet: c.snippet,
      location: c.location
    }));

    const aiResponse: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: answer,
        sources: mappedSources
    };
    setMessages(prev => [...prev, aiResponse]);
  };

  const renderContent = () => {
    switch(activeTab) {
        case 'home': return <HomeView onNavigate={setActiveTab} />;
        case 'ai-chat': return <AIChatFullView messages={messages} onSendMessage={handleSendMessage} isThinking={isThinking} />;
        case 'industry': return <IndustryView />;
        case 'project': return <ProjectView />;
        case 'standard': return <StandardView />;
        case 'collection': return <CollectionView />;
        case 'admin': return <AdminView />;
        default: return <HomeView onNavigate={setActiveTab} />;
    }
  };

  const getTitle = () => {
    switch(activeTab) {
      case 'home': return '概览中心 / Overview';
      case 'ai-chat': return 'AI 数字主工 (全屏模式)';
      case 'industry': return '产业研究 / 市场洞察';
      case 'project': return '项目推荐 / 选址决策';
      case 'standard': return '技术中心 / 规范查询';
      case 'collection': return '个人中心 / 知识库';
      case 'admin': return '系统管理 / Admin Dashboard';
      default: return '';
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isChatPanelOpen && activeTab !== 'ai-chat' ? 'mr-[400px]' : ''}`}>
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-10">
             <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span className="font-bold text-slate-700">工作区：</span>
                <span className={`${activeTab !== 'home' ? 'text-blue-600 font-medium' : ''}`}>
                  {getTitle()}
                </span>
             </div>
             
             {activeTab !== 'ai-chat' && activeTab !== 'home' && !isChatPanelOpen && (
                 <button 
                    onClick={() => setIsChatPanelOpen(true)}
                    className="flex items-center gap-2 text-sm text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                 >
                    <Bot size={18} /> 呼叫数字主工
                 </button>
             )}
        </div>

        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
      </div>

      {activeTab !== 'ai-chat' && activeTab !== 'home' && (
          <AIChatPanel 
            isOpen={isChatPanelOpen} 
            toggleOpen={() => setIsChatPanelOpen(false)} 
            messages={messages}
            onSendMessage={handleSendMessage}
            isThinking={isThinking}
          />
      )}
    </div>
  );
}
