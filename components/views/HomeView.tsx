
import React from 'react';
import { Bot, Map, BarChart3, ArrowRight, BookOpen, Search, ChevronRight, Activity, Database, Zap, RefreshCw, Clock } from 'lucide-react';
import { AppTab } from '../../types';

interface HomeViewProps {
  onNavigate: (tab: AppTab) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const features = [
    {
      id: 'ai-chat' as AppTab,
      title: "AI 协同决策",
      desc: "基于 RAG 的智能问答，深度链接企业知识库与国家规范。",
      icon: Bot,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    {
      id: 'industry' as AppTab,
      title: "产业情报分析",
      desc: "全领域政策追踪与市场洞察，辅助前期产业定位。",
      icon: BarChart3,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10"
    },
    {
      id: 'project' as AppTab,
      title: "GIS 选址图谱",
      desc: "可视化空间大数据分析，精准识别投资热点。",
      icon: Map,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10"
    },
    {
      id: 'standard' as AppTab,
      title: "强条合规审查",
      desc: "全量国家标准库语义检索，自动核查合规性。",
      icon: BookOpen,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10"
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#020617] text-white flex flex-col font-sans custom-scrollbar">
      {/* 极简 Hero 区域 - 缩减垂直内边距 */}
      <section className="px-8 md:px-12 py-16 md:py-20 flex flex-col justify-center border-b border-white/5 relative overflow-hidden shrink-0">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none select-none">
           <Activity size={320} className="text-blue-500" />
        </div>
        <div className="absolute -left-24 -top-24 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-5xl relative z-10">
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center gap-2.5 text-blue-500 font-bold tracking-[0.2em] text-[10px] uppercase">
              <Zap size={14} fill="currentColor" />
              Professional Engineering Intelligence | v1.0
            </div>
            
            {/* 数据库更新提醒 */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-700">
               <RefreshCw size={10} className="animate-spin-slow" />
               <span>数据库内容已更新 · Just Updated</span>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-5xl md:text-6xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tighter">
                数字主工系统
              </span>
              <span className="text-lg md:text-2xl text-slate-500/60 font-medium italic">
                Digital Chief Engineer
              </span>
            </div>
            
            <div className="text-3xl md:text-4xl mt-4 text-white font-black tracking-tighter uppercase leading-tight">
              工程勘察设计管理智库
            </div>
          </div>

          {/* 欢迎语与统计数据 - Redesigned Premium Panel */}
          <div className="mb-12 mt-16 w-full max-w-[50rem] group">
             <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0f172a]/90 to-[#0f172a]/40 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-900/20 hover:border-blue-500/30">
                {/* Decor elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"></div>
                
                <div className="flex flex-col md:flex-row">
                   {/* Left: Greeting - 居中对齐 */}
                   <div className="p-6 md:p-8 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] min-w-[260px] md:min-w-[280px]">
                      <h3 className="text-3xl font-black text-white mb-3 tracking-tight">
                         Hi, Colin <span className="inline-block animate-wave origin-bottom-right">👋</span>
                      </h3>
                      <p className="text-slate-400 text-xs font-bold leading-relaxed tracking-wide uppercase opacity-80 mb-1">
                         Senior Architect
                      </p>
                      <div className="text-slate-500 text-sm font-medium">
                         这是您使用数字主工的第 <span className="text-white font-bold">128</span> 天
                      </div>
                   </div>

                   {/* Right: Metrics Grid - 调整间距和 Padding */}
                   <div className="flex-1 p-6 md:p-8 grid grid-cols-2 gap-y-6 gap-x-8 relative z-10">
                      {/* Metric 1 */}
                      <div className="group/item">
                         <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover/item:text-blue-400 transition-colors">
                            <Search size={12} /> 累计检索
                         </div>
                         <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                            1,242 <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Queries</span>
                         </div>
                      </div>
                      
                      {/* Metric 2 */}
                      <div className="group/item">
                         <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover/item:text-emerald-400 transition-colors">
                            <Database size={12} /> 覆盖话题
                         </div>
                         <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                            364 <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Topics</span>
                         </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="group/item">
                         <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover/item:text-amber-400 transition-colors">
                            <Clock size={12} /> 沉浸时长
                         </div>
                         <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                            320 <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Hours</span>
                         </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="group/item">
                         <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2 group-hover/item:text-purple-400 transition-colors">
                            <Zap size={12} /> 效率提升
                         </div>
                         <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                            85% <span className="text-xs text-slate-600 font-bold uppercase tracking-wider">Boost</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mb-10 leading-relaxed font-medium">
            集成 RAG 检索与 GIS 空间引擎，为工程勘察设计与建设方提供权威的技术支持。
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('ai-chat')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-black transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 text-base"
            >
              启动工作区 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 核心功能看板 - 缩减内边距和字体 */}
      <section className="p-8 md:p-12">
        <div className="mb-8 flex justify-between items-end border-l-4 border-blue-600 pl-4">
           <div>
              <h2 className="text-2xl md:text-3xl font-black mb-0.5 tracking-tight">特色功能模块</h2>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase opacity-60">Functional Matrix</p>
           </div>
           <div className="hidden md:flex items-center gap-6 text-[9px] font-black text-slate-500 tracking-widest uppercase">
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 系统正常
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> AI 在线
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div 
              key={i}
              onClick={() => onNavigate(f.id)}
              className="bg-slate-900/40 border border-white/5 p-6 md:p-8 rounded-[1.5rem] hover:bg-slate-800/60 hover:border-blue-500/30 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              <div className={`w-12 h-12 ${f.bgColor} ${f.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                <f.icon size={24} />
              </div>
              
              <h3 className="text-lg font-black mb-3 group-hover:text-blue-400 transition-colors tracking-tight">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1 font-medium">
                {f.desc}
              </p>
              
              <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 group-hover:text-blue-500 transition-colors uppercase tracking-[0.2em]">
                立即启动 <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 实用数据卡片 - 响应式紧凑化 */}
      <section className="px-8 md:px-12 pb-16">
        <div className="bg-gradient-to-br from-slate-900 to-[#020617] border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between shadow-2xl relative overflow-hidden">
           <div className="flex-1 relative z-10 text-center lg:text-left">
              <h3 className="text-xl font-black mb-4 flex items-center justify-center lg:justify-start gap-3">
                 <Database size={20} className="text-blue-500" />
                 工业级数据底座支持
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                 汇聚 20,000+ 份规范，实时同步动态，提供最权威的决策支撑。
              </p>
           </div>
           
           <div className="grid grid-cols-3 gap-6 md:gap-10 w-full lg:w-auto shrink-0 relative z-10">
              <div className="text-center">
                 <div className="text-3xl font-black text-blue-500 mb-1">20k+</div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">规范基数</div>
              </div>
              <div className="text-center lg:border-x border-white/10 px-6 md:px-8">
                 <div className="text-3xl font-black text-blue-500 mb-1">98%</div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">准确率</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-black text-blue-500 mb-1">1.2s</div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">响应时延</div>
              </div>
           </div>
        </div>
      </section>

      {/* 底部导航 */}
      <footer className="mt-auto py-8 px-12 border-t border-white/5 bg-black/20 backdrop-blur-md flex flex-col md:flex-row justify-between items-center text-[9px] text-slate-500 font-black tracking-widest uppercase">
         <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">主</div>
            <span>数字主工 © 2025</span>
         </div>
         <div className="flex gap-8">
            <a href="#" className="hover:text-blue-500 transition-colors">技术文档</a>
            <a href="#" className="hover:text-blue-500 transition-colors">合规审计</a>
            <a href="#" className="hover:text-blue-500 transition-colors">技术支持</a>
         </div>
      </footer>
    </div>
  );
};

export default HomeView;
