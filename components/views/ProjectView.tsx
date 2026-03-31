import React, { useState } from 'react';
import { 
  Search, Filter, Sparkles, Navigation, ZoomIn, ZoomOut, Archive, Calendar, 
  Globe, FileText, X, Download, Share2, Info, 
  MapPin, Layers, BarChart3, PieChart, Clock, Briefcase, 
  ChevronDown, ChevronRight, FileCode, CheckCircle2, AlertCircle
} from 'lucide-react';
import { generateAIContent } from '../../services/geminiService';
import { Project } from '../../types';

// --- Extended Data Types for Detail View ---
interface ProjectFile {
    name: string;
    size: string;
    date: string;
    type: 'dwg' | 'pdf' | 'docx' | 'xlsx';
}

interface ProjectDocCategory {
    name: string;
    count: number;
    files: ProjectFile[];
}

interface ProjectPhase {
    name: string;
    start: string; // YYYY-MM
    end: string;   // YYYY-MM
    status: 'completed' | 'in-progress' | 'pending';
    progress: number;
}

// --- Helper Components ---

const GanttChart: React.FC<{ phases: ProjectPhase[] }> = ({ phases }) => {
    // 1. Calculate the timeline range
    const dates = phases.flatMap(p => [new Date(p.start), new Date(p.end)]);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Add buffer: 1 month before, 2 months after
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 2);

    const totalMonths = (maxDate.getFullYear() - minDate.getFullYear()) * 12 + (maxDate.getMonth() - minDate.getMonth());

    // Helper to get percentage position of a date
    const getPosition = (dateStr: string) => {
        const d = new Date(dateStr);
        const monthsDiff = (d.getFullYear() - minDate.getFullYear()) * 12 + (d.getMonth() - minDate.getMonth());
        return (monthsDiff / totalMonths) * 100;
    };

    // Generate Year Markers
    const years = [];
    let current = new Date(minDate);
    while (current <= maxDate) {
        if (current.getMonth() === 0 || current.getTime() === minDate.getTime()) {
             years.push({ 
                 year: current.getFullYear(), 
                 left: getPosition(`${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,'0')}-01`) 
             });
        }
        current.setMonth(current.getMonth() + 1);
    }

    return (
        <div className="mt-4 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px] p-4 relative">
                    {/* Grid Lines (Every 3 months/Quarterly roughly) */}
                    <div className="absolute inset-0 pt-8 px-4 pointer-events-none flex">
                         {Array.from({ length: totalMonths }).map((_, i) => (
                             <div key={i} className={`flex-1 border-r ${i % 3 === 0 ? 'border-slate-100' : 'border-transparent'}`}></div>
                         ))}
                    </div>

                    {/* Timeline Header */}
                    <div className="h-6 border-b border-slate-100 relative mb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest select-none">
                        {years.map((y, i) => (
                            <div key={i} className="absolute top-0 transform translate-x-1" style={{ left: `${y.left}%` }}>
                                {y.year}
                            </div>
                        ))}
                    </div>
                    
                    {/* Phases Bars */}
                    <div className="space-y-4 relative z-10">
                        {phases.map((phase, idx) => {
                            const left = getPosition(phase.start);
                            const width = getPosition(phase.end) - left;
                            
                            return (
                                <div key={idx} className="group relative">
                                    {/* Task Label */}
                                    <div className="flex justify-between items-center mb-1.5 px-0.5">
                                        <div className="flex items-center gap-1.5 z-20 bg-white/80 pr-2 backdrop-blur-sm rounded">
                                            {phase.status === 'completed' ? <CheckCircle2 size={10} className="text-emerald-500" /> : 
                                             phase.status === 'in-progress' ? <Clock size={10} className="text-blue-500 animate-spin-slow" /> :
                                             <AlertCircle size={10} className="text-slate-300" />}
                                            <span className={`text-[10px] font-bold ${phase.status === 'in-progress' ? 'text-blue-700' : 'text-slate-600'}`}>
                                                {phase.name}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {phase.start} ~ {phase.end}
                                        </span>
                                    </div>
                                    
                                    {/* Bar Container */}
                                    <div className="h-2.5 w-full bg-slate-50 rounded-full relative">
                                        {/* The Actual Gantt Bar */}
                                        <div 
                                            className={`absolute h-full rounded-full shadow-sm border border-white/20 transition-all duration-300 group-hover:h-3 group-hover:-top-0.5 ${
                                                phase.status === 'completed' ? 'bg-emerald-400' :
                                                phase.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-300'
                                            }`}
                                            style={{ 
                                                left: `${left}%`,
                                                width: `${width}%`
                                            }}
                                        >
                                            {/* Progress Fill inside the bar */}
                                            {phase.status === 'in-progress' && (
                                                 <div 
                                                    className="h-full bg-white/30 rounded-full" 
                                                    style={{ width: `${phase.progress}%` }}
                                                 ></div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocCategory: React.FC<{ category: ProjectDocCategory }> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-100 rounded-xl bg-white overflow-hidden transition-all">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                    <span className="text-xs font-bold text-slate-700">{category.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-black">{category.count}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Download All</div>
            </button>
            
            {isOpen && (
                <div className="bg-slate-50/50 border-t border-slate-100 divide-y divide-slate-100">
                    {category.files.map((file, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between group hover:bg-white transition-colors">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileCode size={14} className="text-slate-400 shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] font-medium text-slate-700 truncate max-w-[180px]">{file.name}</span>
                                    <span className="text-[8px] text-slate-400">{file.date} · {file.size}</span>
                                </div>
                            </div>
                            <button className="p-1.5 hover:bg-blue-100 hover:text-blue-600 rounded text-slate-300 transition-colors">
                                <Download size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Components ---

interface ProjectDetailPanelProps {
  project: Project;
  onClose: () => void;
  isLoading: boolean;
  content: string;
  colorClass: string;
}

const ProjectDetailPanel: React.FC<ProjectDetailPanelProps> = ({ project, onClose, isLoading, content, colorClass }) => {
    // Extract base color name from tailwind class
    const baseColor = colorClass.split('-')[1] || 'blue';

    // Mock Extended Data (In a real app, this comes from an API)
    const mockPhases: ProjectPhase[] = [
        { name: "立项与可行性研究", start: "2023-01", end: "2023-04", status: "completed", progress: 100 },
        { name: "勘察与初步设计", start: "2023-05", end: "2023-09", status: "completed", progress: 100 },
        { name: "施工图设计审查", start: "2023-10", end: "2023-12", status: "completed", progress: 100 },
        { name: "主体工程施工", start: "2024-01", end: "2024-12", status: "in-progress", progress: 65 },
        { name: "竣工验收与交付", start: "2025-01", end: "2025-06", status: "pending", progress: 0 },
    ];

    const mockDocs: ProjectDocCategory[] = [
        { 
            name: "建筑专业 (Architecture)", 
            count: 4, 
            files: [
                { name: "01_总平面图_v3.dwg", size: "12.4 MB", date: "2023-11-05", type: "dwg" },
                { name: "02_一层平面图_审定版.dwg", size: "8.2 MB", date: "2023-11-05", type: "dwg" },
                { name: "建筑设计说明书.pdf", size: "4.5 MB", date: "2023-11-02", type: "pdf" },
                { name: "日照分析报告.docx", size: "2.1 MB", date: "2023-10-28", type: "docx" }
            ]
        },
        { 
            name: "结构专业 (Structure)", 
            count: 2, 
            files: [
                { name: "基础配筋图.dwg", size: "15.1 MB", date: "2023-11-10", type: "dwg" },
                { name: "结构计算书_终版.pdf", size: "28.4 MB", date: "2023-11-09", type: "pdf" }
            ]
        },
        { 
            name: "机电专业 (MEP)", 
            count: 3, 
            files: [
                { name: "给排水综合管网图.dwg", size: "18.2 MB", date: "2023-11-12", type: "dwg" },
                { name: "暖通系统原理图.pdf", size: "5.6 MB", date: "2023-11-12", type: "pdf" },
                { name: "强弱电点位图.dwg", size: "9.3 MB", date: "2023-11-12", type: "dwg" }
            ]
        },
    ];

    return (
        <div className="h-full flex flex-col bg-white border-r border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-300 w-full md:w-[500px]">
            {/* Header */}
            <div className="p-4 md:p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 bg-${baseColor}-100 text-${baseColor}-600`}>
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-sm tracking-tight text-slate-900 line-clamp-1">{project.name}</h3>
                        <p className={`text-[9px] text-${baseColor}-600 font-bold uppercase tracking-widest`}>{project.industry} | {project.location}</p>
                    </div>
                 </div>
                 <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl text-slate-400 transition-colors"><X size={18} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* 1. Dashboard Grid */}
                <div className="p-5 md:p-6 grid grid-cols-2 gap-3 border-b border-slate-100 bg-white">
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><Briefcase size={10} /> 所属行业</p>
                        <p className="text-xs font-black text-slate-800">{project.industry}</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><MapPin size={10} /> 投资估算</p>
                        <p className="text-xs font-black text-blue-600">¥ {project.investment}</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><Calendar size={10} /> 开展时间</p>
                        <p className="text-xs font-black text-slate-800">{project.startTime}</p>
                     </div>
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-[9px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><Archive size={10} /> 归档资料</p>
                        <p className="text-xs font-black text-slate-800">{project.archivedFiles} 卷</p>
                     </div>
                </div>

                {/* 2. Core Participants */}
                <div className="p-5 md:p-6 border-b border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Layers size={12} className="text-blue-500" /> 核心参与方
                    </h4>
                    <div className="space-y-3">
                         {/* Mock splitting standard string into structured data */}
                         <div className="flex items-start gap-3">
                             <span className="w-16 shrink-0 text-[10px] font-bold text-slate-400 bg-slate-50 py-1 px-2 rounded">建设单位</span>
                             <span className="text-xs font-bold text-slate-700 mt-1">{project.participants.split('、')[0] || '待定'}</span>
                         </div>
                         <div className="flex items-start gap-3">
                             <span className="w-16 shrink-0 text-[10px] font-bold text-slate-400 bg-slate-50 py-1 px-2 rounded">设计单位</span>
                             <span className="text-xs font-bold text-slate-700 mt-1">{project.participants.split('、')[1] || '某甲级设计院'}</span>
                         </div>
                         <div className="flex items-start gap-3">
                             <span className="w-16 shrink-0 text-[10px] font-bold text-slate-400 bg-slate-50 py-1 px-2 rounded">施工单位</span>
                             <span className="text-xs font-bold text-slate-700 mt-1">{project.participants.split('、')[2] || '某大型建筑工程局'}</span>
                         </div>
                    </div>
                </div>

                {/* 3. Gantt Chart Progress */}
                <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/30">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Clock size={12} className="text-blue-500" /> 项目全生命周期进度
                        </h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                            project.stage === '已完工' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>{project.stage}</span>
                     </div>
                     <p className="text-[9px] text-slate-400 mb-2">Engineering Schedule · Real-time</p>
                     <GanttChart phases={mockPhases} />
                </div>

                {/* 4. AI Analysis */}
                <div className="p-5 md:p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <Sparkles size={12} className="text-blue-500" /> AI 智能概览
                        </div>
                        {isLoading && <span className="text-[9px] text-blue-500 animate-pulse font-bold">Thinking...</span>}
                    </div>
                     {isLoading ? (
                        <div className="py-6 flex flex-col items-center justify-center gap-3 text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                           <div className="w-5 h-5 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
                           <p className="text-[9px] font-black uppercase tracking-widest">正在分析项目数据...</p>
                        </div>
                      ) : (
                        <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-600 font-medium bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <div className="whitespace-pre-wrap">{content || "点击地图上的项目，获取 AI 生成的深度分析报告。"}</div>
                        </div>
                      )}
                </div>
                
                {/* 5. Documentation */}
                <div className="p-5 md:p-6 pb-20">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Archive size={12} className="text-blue-500" /> 项目资料归档
                    </h4>
                    <div className="space-y-3">
                        {mockDocs.map((cat, idx) => (
                            <DocCategory key={idx} category={cat} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-white absolute bottom-0 w-full z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">
                    <FileText size={14} /> 导出项目全案报告 (PDF)
               </button>
            </div>
        </div>
    )
}

type ViewMode = 'industry' | 'stage' | 'business';

const ProjectView: React.FC = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [aiContent, setAiContent] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('industry');

    const projects: Project[] = [
        { 
          name: "华东某市光储充一体化示范站", 
          industry: "新能源", 
          location: "中国·苏州", 
          investment: "1.2亿", 
          stage: "招标中", 
          color: "blue", 
          x: "51.5%", 
          y: "50%", 
          archivedFiles: 15,
          participants: "国网江苏、华为、宁德时代",
          startTime: "2024-03-15"
        },
        { 
          name: "西部生物质制氨产业基地一期", 
          industry: "生物质能", 
          location: "中国·成都", 
          investment: "35.6亿", 
          stage: "规划设计", 
          color: "green", 
          x: "44.5%", 
          y: "55%", 
          archivedFiles: 8,
          participants: "成投集团、西南院、中化学",
          startTime: "2023-11-20"
        },
        { 
          name: "环渤海智能装备制造产业园", 
          industry: "智能制造", 
          location: "中国·烟台", 
          investment: "8.5亿", 
          stage: "已完工", 
          color: "indigo", 
          x: "52.5%", 
          y: "46%", 
          archivedFiles: 42,
          participants: "烟台开投、中建三局、沈阳机床",
          startTime: "2022-05-10"
        },
        { 
          name: "大湾区第三代半导体产业基地", 
          industry: "高精尖制造", 
          location: "中国·深圳", 
          investment: "128亿", 
          stage: "施工中", 
          color: "purple", 
          x: "49.8%", 
          y: "60.5%", 
          archivedFiles: 120,
          participants: "中芯国际、华润微、深投控",
          startTime: "2023-06-01"
        },
        { 
          name: "深远海千万千瓦级风电基地", 
          industry: "新能源", 
          location: "中国·阳江", 
          investment: "450亿", 
          stage: "前期调研", 
          color: "sky", 
          x: "48.2%", 
          y: "61.8%", 
          archivedFiles: 5,
          participants: "三峡集团、中广核、华南理工",
          startTime: "2024-01-10"
        },
        { 
          name: "北方某城TOD轨道交通枢纽", 
          industry: "基础设施", 
          location: "中国·天津", 
          investment: "210亿", 
          stage: "规划设计", 
          color: "orange", 
          x: "51.8%", 
          y: "45.5%", 
          archivedFiles: 24,
          participants: "中国铁建、天津轨道、SOM事务所",
          startTime: "2023-09-15"
        },
        { 
          name: "海绵城市生态修复综合治理项目", 
          industry: "生态环保", 
          location: "中国·武汉", 
          investment: "45.2亿", 
          stage: "施工中", 
          color: "teal", 
          x: "49.5%", 
          y: "53.2%", 
          archivedFiles: 56,
          participants: "长江设计院、中国交建、武建集团",
          startTime: "2022-12-20"
        },
    ];

    const getProjectColor = (p: Project) => {
        if (viewMode === 'stage') {
            if (['招标中', '前期调研'].includes(p.stage)) return 'bg-orange-500';
            if (p.stage === '已完工') return 'bg-emerald-500';
            if (p.stage === '施工中') return 'bg-purple-600';
            return 'bg-blue-600'; // 规划设计
        }
        if (viewMode === 'business') {
            // Mock business units
            if (['新能源', '生物质能'].includes(p.industry)) return 'bg-sky-500'; // 能源板块
            if (['基础设施', '生态环保'].includes(p.industry)) return 'bg-teal-500'; // 城市建设
            return 'bg-indigo-600'; // 科创制造
        }
        // Industry default
        if (p.industry === '新能源') return 'bg-blue-500';
        if (p.industry === '生物质能') return 'bg-green-500';
        if (p.industry === '智能制造') return 'bg-indigo-500';
        if (p.industry === '高精尖制造') return 'bg-purple-600';
        if (p.industry === '基础设施') return 'bg-orange-500';
        if (p.industry === '生态环保') return 'bg-teal-500';
        return 'bg-slate-500';
    };

    const getPingColor = (p: Project) => {
        if (viewMode === 'stage') {
            if (['招标中', '前期调研'].includes(p.stage)) return 'bg-orange-400';
            if (p.stage === '已完工') return 'bg-emerald-400';
            if (p.stage === '施工中') return 'bg-purple-400';
            return 'bg-blue-400'; 
        }
        if (viewMode === 'business') {
            if (['新能源', '生物质能'].includes(p.industry)) return 'bg-sky-400';
            if (['基础设施', '生态环保'].includes(p.industry)) return 'bg-teal-400';
            return 'bg-indigo-400';
        }
        // Industry default
        if (p.industry === '新能源') return 'bg-blue-400';
        if (p.industry === '生物质能') return 'bg-green-400';
        if (p.industry === '智能制造') return 'bg-indigo-400';
        if (p.industry === '高精尖制造') return 'bg-purple-400';
        if (p.industry === '基础设施') return 'bg-orange-400';
        if (p.industry === '生态环保') return 'bg-teal-400';
        return 'bg-slate-400';
    };

    const handleProjectOverview = async (project: Project) => {
        setSelectedProject(project);
        setAiLoading(true);
        setAiContent(""); // Clear previous content

        const prompt = `请基于以下信息：项目名称"${project.name}"，位置${project.location}，投资${project.investment}，行业${project.industry}，阶段${project.stage}。请生成一段客观、精炼的项目概况介绍（第三人称，非报告口吻）。重点描述建设性质、规模体量及当前建设状态。字数控制在150字以内。`;
        const result = await generateAIContent(prompt, "你是一位工程咨询专家，擅长撰写客观精炼的项目工程概况。");

        setAiContent(result);
        setAiLoading(false);
    };

    const renderLegend = () => {
        let items: { color: string, label: string }[] = [];

        switch (viewMode) {
            case 'industry':
                items = [
                    { color: 'bg-blue-500', label: '新能源' },
                    { color: 'bg-green-500', label: '生物质能' },
                    { color: 'bg-indigo-500', label: '智能制造' },
                    { color: 'bg-purple-600', label: '高精尖制造' },
                    { color: 'bg-orange-500', label: '基础设施' },
                    { color: 'bg-teal-500', label: '生态环保' },
                ];
                break;
            case 'stage':
                items = [
                    { color: 'bg-orange-500', label: '招标/调研' },
                    { color: 'bg-blue-600', label: '规划设计' },
                    { color: 'bg-purple-600', label: '施工中' },
                    { color: 'bg-emerald-500', label: '已完工' },
                ];
                break;
            case 'business':
                items = [
                    { color: 'bg-sky-500', label: '能源板块' },
                    { color: 'bg-teal-500', label: '城市建设' },
                    { color: 'bg-indigo-600', label: '科创制造' },
                ];
                break;
        }

        return (
            <div className="absolute bottom-6 left-6 bg-[#0f172a]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 min-w-[120px]">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
                    {viewMode === 'industry' ? '产业分类' : viewMode === 'stage' ? '项目阶段' : '业务板块'}
                </div>
                <div className="flex flex-col gap-1.5">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${item.color} shadow-[0_0_8px_currentColor]`}></span>
                            <span className="text-[10px] text-slate-300 font-bold">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {/* 左侧详情边栏 - 宽度 500px */}
            <div className={`transition-all duration-500 ease-in-out relative flex-shrink-0 z-30 shadow-2xl overflow-hidden ${
                selectedProject ? 'w-full md:w-[500px]' : 'w-0'
            }`}>
                {selectedProject && (
                    <ProjectDetailPanel 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                        isLoading={aiLoading} 
                        content={aiContent}
                        colorClass={getProjectColor(selectedProject)}
                    />
                )}
            </div>

            {/* 右侧主内容区域 */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* GIS 核心地图区域 - 高度调整为 35% */}
                <div className="h-[35%] bg-[#020617] relative w-full group overflow-hidden border-b border-white/10 shadow-inner flex items-center justify-center shrink-0">
                    {/* 数字化网格装饰层 */}
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', 
                            backgroundSize: '40px 40px' 
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]/50 opacity-80 pointer-events-none"></div>
                    
                    {/* 中心装饰字样 - 修改为 GIS MAP */}
                    <div className="relative z-0 pointer-events-none select-none flex flex-col items-center">
                        <h1 className="text-8xl font-black text-white/[0.03] tracking-[0.3em] uppercase">GIS MAP</h1>
                        <div className="h-1 w-64 bg-blue-500/10 mt-6 rounded-full"></div>
                        <p className="text-blue-500/10 text-[10px] mt-4 font-black tracking-[0.8em] uppercase">Spatial Intelligence Interface</p>
                    </div>

                    {/* 左下角动态图例 */}
                    {renderLegend()}

                    {/* 视图模式切换控件 - 移动到右下角 */}
                    <div className="absolute bottom-6 right-6 z-20 flex bg-[#0f172a]/90 backdrop-blur-md border border-white/10 rounded-xl p-1 shadow-2xl">
                        <button 
                            onClick={() => setViewMode('industry')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'industry' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Layers size={12} /> 按行业
                        </button>
                        <button 
                            onClick={() => setViewMode('stage')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'stage' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <BarChart3 size={12} /> 按进度
                        </button>
                         <button 
                            onClick={() => setViewMode('business')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'business' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <PieChart size={12} /> 按板块
                        </button>
                    </div>

                    {/* 项目动态标记点 */}
                    {projects.map((p, i) => (
                        <div 
                            key={i}
                            className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2"
                            style={{ left: p.x, top: p.y }}
                            onMouseEnter={() => setHoveredProject(p.name)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => handleProjectOverview(p)}
                        >
                            {/* 扩散波纹 */}
                            <div className={`absolute inset-0 w-12 h-12 -left-6 -top-6 rounded-full animate-ping opacity-20 ${getPingColor(p)}`}></div>
                            
                            {/* 实体标记点 */}
                            <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)] relative z-10 transition-all duration-300 ${
                                hoveredProject === p.name ? 'scale-150 ring-4 ring-blue-500/30' : ''
                            } ${getProjectColor(p)}`}></div>

                            {/* 悬停信息面板 - 适配深色背景 */}
                            <div className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-3 bg-[#0f172a]/95 backdrop-blur-xl rounded-2xl border border-white/10 text-white transition-all duration-300 z-50 shadow-2xl ${
                                hoveredProject === p.name ? 'opacity-100 translate-x-1' : 'opacity-0 -translate-x-4 pointer-events-none'
                            }`}>
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full animate-pulse ${getProjectColor(p)}`}></span>
                                        <span className="font-black text-sm">{p.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <Navigation size={10} className="text-blue-500" />
                                            <span>{p.location}</span>
                                        </div>
                                        <span className="text-blue-400 font-black">¥ {p.investment}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 地图控制工具 - 移动到上方以避开切换按钮 */}
                    <div className="absolute right-6 bottom-20 flex flex-col gap-2">
                        <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl border border-white/10 transition-all shadow-xl backdrop-blur-md active:scale-95"><ZoomIn size={18} /></button>
                        <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl border border-white/10 transition-all shadow-xl backdrop-blur-md active:scale-95"><ZoomOut size={18} /></button>
                    </div>

                    <div className="absolute top-6 left-6 flex gap-3">
                        <div className="bg-[#0f172a]/80 border border-white/10 rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-4 backdrop-blur-xl w-[320px]">
                            <Search size={18} className="text-blue-500" />
                            <input className="bg-transparent border-none outline-none text-xs text-white w-full placeholder:text-slate-500 font-bold uppercase tracking-wider" placeholder="在GIS地图上搜索项目集" />
                        </div>
                    </div>
                </div>
                
                {/* 列表区域 - 占据剩余高度 */}
                <div className="flex-1 bg-white p-6 overflow-y-auto">
                    <div className="max-w-[98%] mx-auto">
                        <div className="flex justify-between items-end mb-6">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">项目资源中心</h2>
                                <p className="text-sm text-slate-500 font-medium">聚合全球高价值工程项目，提供基于 AI 的概览与详情洞察</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 text-xs font-black text-slate-700 px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest"><Filter size={16} className="text-slate-400" /> 区域筛选</button>
                                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2 group uppercase tracking-widest">
                                    <Globe size={16} className="text-blue-200 group-hover:rotate-12 transition-transform" /> 导出选址报告
                                </button>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-xl bg-white">
                            <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                                <thead className="text-slate-500 bg-slate-50/80 uppercase text-[10px] tracking-widest font-black sticky top-0 z-10 backdrop-blur-md">
                                    <tr>
                                        <th className="py-5 px-6">工程名称与行业分类</th>
                                        <th className="py-5 px-4">核心参与方</th>
                                        <th className="py-5 px-4">开展时间</th>
                                        <th className="py-5 px-4">地理位置</th>
                                        <th className="py-5 px-4">投资估算</th>
                                        <th className="py-5 px-4">资料卷数</th>
                                        <th className="py-5 px-4 text-center">当前进度</th>
                                        <th className="py-5 px-6 text-right">智慧服务</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {projects.map((p, i) => (
                                        <tr 
                                            key={i} 
                                            className={`hover:bg-blue-50/30 transition-all cursor-pointer group relative ${hoveredProject === p.name ? 'bg-blue-50/50' : ''}`}
                                            onMouseEnter={() => setHoveredProject(p.name)}
                                            onMouseLeave={() => setHoveredProject(null)}
                                            onClick={() => handleProjectOverview(p)}
                                        >
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full shadow-sm transition-transform group-hover:scale-125 ${
                                                        p.industry === '新能源' ? 'bg-blue-600' : 
                                                        p.industry === '高精尖制造' ? 'bg-purple-600' :
                                                        p.industry === '基础设施' ? 'bg-orange-600' :
                                                        p.industry === '生态环保' ? 'bg-teal-600' :
                                                        'bg-indigo-600'
                                                    }`}></div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-slate-800 group-hover:text-blue-700 transition-colors text-base tracking-tight">{p.name}</span>
                                                        <span className={`text-[10px] font-bold uppercase mt-0.5 tracking-wider ${
                                                            p.industry === '新能源' ? 'text-blue-600' : 
                                                            p.industry === '高精尖制造' ? 'text-purple-700' :
                                                            p.industry === '基础设施' ? 'text-orange-700' :
                                                            p.industry === '生态环保' ? 'text-teal-700' :
                                                            'text-indigo-700'
                                                        }`}>{p.industry}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="text-xs font-medium text-slate-600 line-clamp-1 max-w-[180px]">{p.participants}</span>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-2 text-slate-500 font-mono text-xs font-bold">
                                                    <Calendar size={14} className="text-slate-400" />
                                                    {p.startTime}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                                    <Navigation size={12} />
                                                    <span className="text-xs">{p.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <span className="font-mono font-black text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg text-xs border border-slate-100 shadow-sm">¥ {p.investment}</span>
                                            </td>
                                            <td className="py-5 px-4 text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <Archive size={16} className="text-slate-400" />
                                                    <span className="font-black text-sm">{p.archivedFiles}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex flex-col items-center justify-center min-w-[120px]">
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2 shadow-inner">
                                                        <div className={`h-full transition-all duration-1000 ease-out ${
                                                            p.stage === '招标中' || p.stage === '前期调研' ? 'w-1/4 bg-orange-500' : 
                                                            p.stage === '已完工' ? 'w-full bg-emerald-500' : 'w-2/3 bg-blue-600'
                                                        }`}></div>
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                                        p.stage === '招标中' || p.stage === '前期调研' ? 'text-orange-700 bg-orange-50' : 
                                                        p.stage === '已完工' ? 'text-emerald-700 bg-emerald-50' : 'text-blue-700 bg-blue-50'
                                                    }`}>{p.stage}</span>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-right">
                                                <button 
                                                    className="inline-flex items-center gap-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95 group/btn uppercase tracking-widest"
                                                >
                                                    <FileText size={14} /> 项目概览
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectView;