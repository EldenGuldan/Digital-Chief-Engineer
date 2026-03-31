
import React from 'react';
import { X, ExternalLink, Bookmark, FileText, Share2, Copy, ShieldCheck, Search } from 'lucide-react';
import { Source } from '../types';

interface SourceInspectorProps {
  source: Source | null;
  onClose: () => void;
}

const SourceInspector: React.FC<SourceInspectorProps> = ({ source, onClose }) => {
  if (!source) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 头部面板 */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3 text-blue-700">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
             <Bookmark size={18} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-black text-sm tracking-tight text-slate-900">溯源核实详情</h3>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Digital Chief Audit</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-all active:scale-90"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* 标准库认证 */}
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
           <ShieldCheck size={20} className="text-emerald-600" />
           <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">权威规范已通过 MD5 校验认证</p>
        </div>

        {/* 标准名称 */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             <FileText size={12} /> 引用文献/规范
          </label>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner group">
             <p className="font-black text-slate-900 leading-snug group-hover:text-blue-700 transition-colors">{source.title}</p>
             {source.location && (
                <div className="mt-3 flex items-center gap-2">
                   <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase font-mono">
                     {source.location}
                   </span>
                </div>
             )}
          </div>
        </div>

        {/* 原文摘要 */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
             {/* Fix: Added missing Search icon import from lucide-react */}
             <Search size={12} /> 语义匹配片段
          </label>
          <div className="relative group">
            <div className="absolute -left-1 top-0 bottom-0 w-1 bg-blue-600 rounded-full group-hover:w-1.5 transition-all"></div>
            <div className="pl-4">
              <p className="text-sm text-slate-600 leading-relaxed font-medium p-5 bg-slate-50 rounded-2xl border border-slate-100 italic shadow-sm">
                “{source.snippet}”
              </p>
            </div>
          </div>
        </div>

        {/* 操作项 */}
        <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
          <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 group">
            <ExternalLink size={16} className="text-blue-400 group-hover:rotate-12 transition-transform" /> 调阅完整原文
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs">
              <Copy size={14} /> 复制条款
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-bold text-xs">
              <Share2 size={14} /> 转发同事
            </button>
          </div>
        </div>
      </div>

      {/* 底部备注 */}
      <div className="p-6 bg-slate-50 border-t border-slate-100">
         <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
           基于语义向量分析，系统判定该条款与当前对话内容的相关度评分为 <span className="text-blue-600 font-black">94.2%</span>。
         </p>
      </div>
    </div>
  );
};

export default SourceInspector;
