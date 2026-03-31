
import React from 'react';
import { Bot, Building2, Map, BookOpen, Star, Home, Bell, Settings, ShieldCheck } from 'lucide-react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: AppTab; icon: any; label: string; highlight?: boolean; adminOnly?: boolean }[] = [
    { id: 'home', icon: Home, label: '概览' },
    { id: 'ai-chat', icon: Bot, label: 'AI 主工', highlight: true },
    { id: 'industry', icon: Building2, label: '产业研究' },
    { id: 'project', icon: Map, label: '项目图谱' },
    { id: 'standard', icon: BookOpen, label: '技术规范' },
    { id: 'collection', icon: Star, label: '我的收藏' },
  ];

  return (
    <div className="w-20 bg-[#0a0f1d] flex flex-col items-center py-6 text-white shrink-0 z-20 h-full border-r border-slate-800/60 shadow-2xl">
      {/* 极简建筑元素 Logo */}
      <div 
        onClick={() => setActiveTab('home')}
        className="mb-10 cursor-pointer group flex flex-col items-center"
      >
        <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M3 21h18" />
             <path d="M5 21V7l8-4v18" />
             <path d="M13 21V11l6 3v7" />
           </svg>
        </div>
        <span className="mt-2 text-[10px] font-bold text-slate-500 tracking-tighter group-hover:text-blue-400 transition-colors uppercase">D-Chief</span>
      </div>
      
      <div className="flex flex-col gap-4 w-full px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-3.5 rounded-xl transition-all relative group ${
              activeTab === item.id 
                ? 'text-white bg-white/5 border border-white/10' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={22} className={activeTab === item.id ? 'text-blue-500' : ''} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 absolute left-full ml-4 transition-all bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg shadow-2xl z-50 whitespace-nowrap pointer-events-none font-medium tracking-wide">
                {item.label}
            </span>
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_#3b82f6]"></div>
            )}
          </button>
        ))}

        {/* 管理员专区分割线 */}
        <div className="w-full h-px bg-white/10 my-1"></div>

        <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center w-full py-3.5 rounded-xl transition-all relative group ${
              activeTab === 'admin' 
                ? 'text-red-400 bg-red-500/10 border border-red-500/20' 
                : 'text-slate-500 hover:text-red-400 hover:bg-red-500/5'
            }`}
          >
            <ShieldCheck size={22} className={activeTab === 'admin' ? 'text-red-500' : ''} />
            <span className="text-[10px] opacity-0 group-hover:opacity-100 absolute left-full ml-4 transition-all bg-slate-900 border border-red-900/50 text-red-400 px-3 py-1.5 rounded-lg shadow-2xl z-50 whitespace-nowrap pointer-events-none font-medium tracking-wide flex items-center gap-2">
                后台管理 <span className="bg-red-500 text-white text-[8px] px-1 rounded">ADMIN</span>
            </span>
            {activeTab === 'admin' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full shadow-[0_0_10px_#ef4444]"></div>
            )}
        </button>
      </div>

      <div className="mt-auto flex flex-col gap-6 w-full items-center mb-4">
         <button className="text-slate-500 hover:text-white transition-colors relative"><Bell size={20} /></button>
         <button className="text-slate-500 hover:text-white transition-colors"><Settings size={20} /></button>
         <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold border border-slate-700 text-slate-400 hover:border-blue-500 hover:text-white transition-all">
            C
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
