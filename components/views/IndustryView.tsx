
import React, { useState } from 'react';
import { 
  Search, Sparkles, Plane, Zap, Sprout, Cpu, Building2, 
  X, Maximize2, FileText, Download, Share2, Info, 
  ArrowUpRight, Clock, Tag
} from 'lucide-react';
import { generateAIContent } from '../../services/geminiService';
import { Report } from '../../types';

interface ReportDetailPanelProps {
  report: Report;
  onClose: () => void;
  isLoading: boolean;
  content: string;
}

const ReportDetailPanel: React.FC<ReportDetailPanelProps> = ({ report, onClose, isLoading, content }) => {
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      {/* 头部面板 - 减小内边距 */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${report.color}`}>
             <report.icon size={18} />
          </div>
          <div>
            <h3 className="font-black text-xs md:text-sm tracking-tight text-slate-900">研报智能简报</h3>
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Industry Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors" title="全屏"><Maximize2 size={16} /></button>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8 space-y-6 md:space-y-8 custom-scrollbar">
        {/* 基础信息 */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border-2 ${
              report.color.replace('bg-', 'border-').replace('100', '200')
            } ${report.color}`}>
              {report.type}
            </span>
            <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
              <Clock size={11} /> {report.date}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{report.title}</h2>
          <div className="flex flex-wrap gap-1.5">
            {report.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 摘要正文 */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">
            <Sparkles size={13} className="text-blue-500" /> AI 智能摘要
          </div>
          
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">正在研读全文...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-600 font-medium">
              <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200/50 whitespace-pre-wrap">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* 操作项 */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
           <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 group">
            <Download size={16} /> 获取离线报告
          </button>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button className="flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest">
              <Share2 size={12} /> 转发
            </button>
            <button className="flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest">
              <ArrowUpRight size={12} /> 关联规范
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-100">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium italic">
            本摘要由 AI 生成，仅供研究参考。正式决策请查阅研报正文。
          </p>
        </div>
      </div>
    </div>
  );
};

const IndustryView: React.FC = () => {
  const reports: Report[] = [
    { title: "2025年全球低空经济发展白皮书", type: "白皮书", date: "2025-01-15", tags: ["低空经济", "基础设施"], icon: Plane, color: "bg-sky-100 text-sky-700" },
    { title: "新能源产业园零碳实施路径研究报告", type: "研究报告", date: "2024-12-28", tags: ["新能源", "零碳园区"], icon: Zap, color: "bg-amber-100 text-amber-700" },
    { title: "现代农业生物育种技术产业图谱", type: "图谱", date: "2024-12-10", tags: ["生物科技", "种业"], icon: Sprout, color: "bg-emerald-100 text-emerald-700" },
    { title: "智能制造装备产业集群竞争力分析", type: "分析报告", date: "2024-11-22", tags: ["智能制造", "数智化"], icon: Cpu, color: "bg-indigo-100 text-indigo-700" },
    { title: "绿色航运燃料加注站布局规划指引", type: "政策解读", date: "2024-11-05", tags: ["绿色航运", "基建"], icon: Building2, color: "bg-teal-100 text-teal-700" },
    { title: "未来社区数字化基座建设指南", type: "指南", date: "2024-10-15", tags: ["智慧城市", "未来社区"], icon: Building2, color: "bg-orange-100 text-orange-700" },
  ];

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [previewContent, setPreviewContent] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const handleOpenReport = async (report: Report) => {
    setSelectedReport(report);
    setPreviewLoading(true);
    
    const prompt = `请为《${report.title}》这篇关于${report.tags.join('和')}的产业报告生成一份简明扼要的摘要（300字以内）。请包括主要趋势和关键技术点，并分点呈现。`;
    const result = await generateAIContent(prompt, "你是一位产业研究专家，擅长提炼复杂的行业报告。");
    
    setPreviewContent(result);
    setPreviewLoading(false);
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* 主内容列表区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 md:p-6 lg:p-8 h-full overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">产业研究库</h1>
              <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium italic">汇聚前沿领域的高价值情报与政策</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="快速检索..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-xs font-medium" />
              </div>
            </div>
          </header>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {['全部', '新能源', '农业科技', '低空经济', '智能制造', '数字文旅'].map((tag, idx) => (
              <button key={idx} className={`px-4 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest border ${idx === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}>
                {tag}
              </button>
            ))}
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 ${selectedReport ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6`}>
            {reports.map((report, idx) => (
              <div 
                key={idx} 
                onClick={() => handleOpenReport(report)}
                className={`bg-white rounded-[1.5rem] p-5 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden border ${
                    selectedReport?.title === report.title ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200'
                }`}
              >
                {/* 类型标签 */}
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-xl ${report.color} shadow-inner transition-transform group-hover:scale-105 duration-500 shrink-0`}>
                    <report.icon size={24} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-2 ${
                    report.color.replace('bg-', 'border-').replace('100', '200')
                  } ${report.color} shadow-sm`}>
                    {report.type}
                  </span>
                </div>

                <h3 className="text-base md:text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 tracking-tight">
                  {report.title}
                </h3>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {report.tags.map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded bg-slate-50 text-slate-500 font-bold border border-slate-100">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                   <div className="flex items-center gap-1.5 text-slate-400">
                     <Building2 size={12} />
                     <span className="text-[9px] font-bold uppercase tracking-wider">{report.date}</span>
                   </div>
                   <button 
                    className="flex items-center gap-1.5 text-[9px] font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md active:scale-95 group/btn uppercase tracking-widest"
                   >
                     <Sparkles size={12} /> 简报
                   </button>
                </div>

                {/* 背景微装饰 */}
                <div className="absolute -right-3 -bottom-3 opacity-[0.02] text-slate-900 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                  <report.icon size={100} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 详情边栏 - 宽度调整为 w-[45%] */}
      <div className={`transition-all duration-500 ease-in-out relative flex-shrink-0 z-30 shadow-2xl overflow-hidden ${
          selectedReport ? 'w-[45%]' : 'w-0'
      }`}>
          {selectedReport && (
              <ReportDetailPanel 
                  report={selectedReport} 
                  onClose={() => setSelectedReport(null)}
                  isLoading={previewLoading}
                  content={previewContent}
              />
          )}
      </div>
    </div>
  );
};

export default IndustryView;
