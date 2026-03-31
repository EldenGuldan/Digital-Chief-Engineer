
import React, { useState } from 'react';
import { 
  Search, AlertCircle, Sparkles, CheckSquare, BookOpen, 
  FileText, ChevronRight, Zap, ShieldCheck, Leaf, 
  X, ExternalLink, Bookmark, Scale, Info, Download, Maximize2, LayoutGrid
} from 'lucide-react';
import { generateAIContent } from '../../services/geminiService';
import AIModal from '../AIModal';
import { Standard } from '../../types';

interface StandardDetailPanelProps {
  standard: Standard;
  onClose: () => void;
  isLoading: boolean;
  content: string;
}

const StandardDetailPanel: React.FC<StandardDetailPanelProps> = ({ standard, onClose, isLoading, content }) => {
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      {/* 头部面板 - 减小内边距 */}
      <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
             <BookOpen size={18} />
          </div>
          <div>
            <h3 className="font-black text-xs md:text-sm tracking-tight text-slate-900">规范详情预览</h3>
            <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Standards Digital Library</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors" title="全屏阅读"><Maximize2 size={16} /></button>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><X size={18} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8 space-y-6 md:space-y-8 custom-scrollbar">
        {/* 基础信息卡片 */}
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-[10px] border border-blue-100">{standard.code}</span>
            {standard.isMandatory && (
              <span className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wider">
                <AlertCircle size={10} /> 强制条文
              </span>
            )}
            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{standard.status}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">{standard.name}</h2>
          <div className="grid grid-cols-2 gap-3 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
              <Scale size={13} className="text-blue-500" />
              <span className="truncate">类型: {standard.type}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
              <Bookmark size={13} className="text-blue-500" />
              <span className="truncate">专业: {standard.category}</span>
            </div>
          </div>
        </div>

        {/* 预览正文区 */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">
            <Sparkles size={13} className="text-blue-500" /> 智能导读与核心条文提炼
          </div>
          
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black uppercase tracking-widest">AI 深度解析中...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none text-xs md:text-sm leading-relaxed text-slate-600 font-medium">
              <div className="bg-blue-50/30 p-4 md:p-6 rounded-2xl border border-blue-100/50 whitespace-pre-wrap">
                {content}
              </div>
            </div>
          )}
        </div>

        {/* 交互工具栏 */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
           <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 group">
            <Download size={16} /> 下载 PDF 离线版
          </button>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <button className="flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest">
              <ExternalLink size={12} /> 官方库
            </button>
            <button className="flex items-center justify-center gap-1.5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all font-black text-[9px] uppercase tracking-widest">
              <ShieldCheck size={12} /> 版本历史
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-5 bg-slate-50 border-t border-slate-100">
        <div className="flex items-start gap-2">
          <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-[9px] text-slate-400 leading-relaxed font-medium italic">
            本预览由 AI 提取，仅供参考。正式应用请以出版文本为准。
          </p>
        </div>
      </div>
    </div>
  );
};

const StandardView: React.FC = () => {
    const standards: Standard[] = [
        { code: "GB 50016-2014", name: "建筑设计防火规范 (2018年版)", type: "国家标准", status: "现行", category: "通用/消防", isMandatory: true },
        { code: "GB 55015-2021", name: "建筑节能与可再生能源利用通用规范", type: "强制性规范", status: "现行", category: "通用/节能", isMandatory: true },
        { code: "GB 50011-2010", name: "建筑抗震设计规范 (2016年版)", type: "国家标准", status: "现行", category: "结构/抗震", isMandatory: true },
        { code: "GB 50352-2019", name: "民用建筑设计统一标准", type: "国家标准", status: "现行", category: "通用/设计" },
        { code: "GB 50010-2010", name: "混凝土结构设计规范 (2015年版)", type: "国家标准", status: "现行", category: "结构/混凝土", isMandatory: true },
        { code: "GB 50017-2017", name: "钢结构设计标准", type: "国家标准", status: "现行", category: "结构/钢结构", isMandatory: true },
        { code: "JGJ 16-2008", name: "民用建筑电气设计规范", type: "行业标准", status: "现行", category: "电气" },
        { code: "GB/T 51366-2019", name: "建筑碳排放计算标准", type: "推荐性标准", status: "现行", category: "绿色/双碳" },
        { code: "GB 51251-2017", name: "建筑防烟排烟系统技术标准", type: "国家标准", status: "现行", category: "通用/消防", isMandatory: true },
        { code: "GB 50034-2013", name: "建筑照明设计标准", type: "国家标准", status: "现行", category: "电气/照明" },
    ];

    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [loading, setLoading] = useState(false);
    
    // 右侧边栏状态
    const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null);
    const [previewContent, setPreviewContent] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);

    const handleSmartAction = async (std: Standard, action: 'interpret' | 'checklist' | 'preview') => {
        if (action === 'preview') {
            setSelectedStandard(std);
            setPreviewLoading(true);
            const prompt = `请为规范《${std.name}》（${std.code}）提供一个快速导读预览。包含：1. 规范的核心定位（一句话）；2. 核心控制要点（3-4点）；3. 涉及强条的简要说明。请保持专业精炼。`;
            const result = await generateAIContent(prompt, "你是一位资深总工助手，擅长快速提炼规范核心价值。");
            setPreviewContent(result);
            setPreviewLoading(false);
            return;
        }

        setModalOpen(true);
        setLoading(true);

        let prompt = "";
        let systemRole = "";

        if (action === 'interpret') {
            setModalTitle(`深度专家解读：${std.name}`);
            prompt = `请深入解读《${std.name}》（${std.code}）的编制背景、现行版本的重大变化，并针对设计实操给出5条专家建议。`;
            systemRole = "你是一位国家标准主编级别的专家，对规范条文有深厚的理论基础和实战经验。";
        } else if (action === 'checklist') {
            setModalTitle(`合规审查清单：${std.name}`);
            prompt = `请基于《${std.name}》（${std.code}），为设计核查生成一份结构清晰的合规性清单。请区分“强制性条文”与“一般条文”。`;
            systemRole = "你是一位极为严谨的设计质量核查员。";
        }

        const result = await generateAIContent(prompt, systemRole);
        setModalContent(result);
        setLoading(false);
    };

    const getCategoryIcon = (category: string) => {
        if (category.includes('消防')) return <ShieldCheck size={18} className="text-red-500" />;
        if (category.includes('节能') || category.includes('碳')) return <Leaf size={18} className="text-emerald-500" />;
        if (category.includes('电气')) return <Zap size={18} className="text-amber-500" />;
        return <BookOpen size={18} className="text-blue-500" />;
    };

    return (
        <div className="flex h-full bg-[#f8fafc] overflow-hidden">
            <AIModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalTitle} 
                content={modalContent} 
                isLoading={loading} 
            />

            {/* 左侧目录树 - 略微缩窄以腾出空间 */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 hidden lg:flex">
                <div className="p-5 border-b border-slate-50">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">技术标准体系</h3>
                    <div className="space-y-0.5">
                        {['国家标准 (GB)', '地区标准 (DB)', '强制性规范', '行业标准 (JGJ)', '团体标准 (T)', '企业内控'].map((t, idx) => (
                            <div key={idx} className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 group transition-all">
                                <span>{t}</span>
                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-blue-500" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">专业分类</h3>
                    <ul className="space-y-0.5 text-xs font-bold text-slate-600">
                        <li className="px-3 py-2 bg-blue-600 text-white rounded-xl shadow-md cursor-pointer flex items-center gap-2">
                            <LayoutGrid size={14} /> 全部专业
                        </li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">总图专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">建筑专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">结构专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">给排水专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">暖通空调</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">电气专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">网信专业</li>
                        <li className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-slate-500 hover:text-blue-600 transition-colors">新能源专业</li>
                    </ul>
                </div>
            </div>

            {/* 右侧主列表区 */}
            <div className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden`}>
                <div className="p-5 md:p-6 lg:p-8 overflow-y-auto flex-1">
                    <header className="mb-6">
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-1.5">国家工程建设标准库</h1>
                        <p className="text-xs text-slate-500 font-medium italic">实时接入住建部标准公开数据，保障设计合规性</p>
                    </header>

                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none shadow-sm text-xs font-medium transition-all" placeholder="输入规范号、名称或关键词搜索..." />
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">检索</button>
                    </div>

                    {/* 调整网格以适应侧边栏展开 */}
                    <div className={`grid grid-cols-1 ${selectedStandard ? 'xl:grid-cols-1' : 'xl:grid-cols-2'} gap-4`}>
                        {standards.map((std, idx) => (
                            <div 
                                key={idx} 
                                className={`bg-white p-4 md:p-5 rounded-[1.5rem] border transition-all group flex flex-col justify-between cursor-pointer ${
                                    selectedStandard?.code === std.code ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-100 hover:shadow-lg hover:border-blue-200'
                                }`}
                                onClick={() => handleSmartAction(std, 'preview')}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-[10px] border border-blue-100">{std.code}</span>
                                            {std.isMandatory && (
                                                <span className="flex items-center gap-1 text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wider">
                                                    强条
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                                            {getCategoryIcon(std.category)}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-black text-slate-800 group-hover:text-blue-600 leading-tight mb-3 transition-colors line-clamp-2">
                                        {std.name}
                                    </h3>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2 pt-4 border-t border-slate-50">
                                    <div className="flex-1 flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><FileText size={10} /> {std.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleSmartAction(std, 'checklist'); }}
                                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors uppercase tracking-widest"
                                        >
                                            <CheckSquare size={12} /> 清单
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleSmartAction(std, 'interpret'); }}
                                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1 text-[9px] font-black bg-purple-50 text-purple-600 px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors uppercase tracking-widest"
                                        >
                                            <Sparkles size={12} /> 解读
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 详情边栏 - 宽度调整为 w-[45%] 以适配 15 寸屏幕 */}
            <div className={`transition-all duration-500 ease-in-out relative flex-shrink-0 z-30 shadow-2xl overflow-hidden ${
                selectedStandard ? 'w-[45%]' : 'w-0'
            }`}>
                {selectedStandard && (
                    <StandardDetailPanel 
                        standard={selectedStandard} 
                        onClose={() => setSelectedStandard(null)}
                        isLoading={previewLoading}
                        content={previewContent}
                    />
                )}
            </div>
        </div>
    );
};

export default StandardView;
