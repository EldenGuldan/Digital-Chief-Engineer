
import React, { useState } from 'react';
import { BookOpen, MapPin, MoreHorizontal, FileBarChart, Bot, FileText } from 'lucide-react';
import { generateAIContent } from '../../services/geminiService';
import AIModal from '../AIModal';
import { Folder } from '../../types';

const CollectionView: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [modalTitle, setModalTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFolderAnalysis = async (folder: Folder) => {
        setModalTitle(`AI 智能综述：${folder.name}`);
        setModalOpen(true);
        setLoading(true);

        const prompt = `请根据收藏夹名称“${folder.name}”及其包含的资料概况（${folder.count}个文件，如${folder.desc}），撰写一份简短的研究价值综述（200字以内）。请说明这些资料在实际工程项目中的潜在价值和应用场景。`;
        const result = await generateAIContent(prompt, "你是一位知识 management 专家，擅长整理和提炼工程资料的核心价值。");

        setModalContent(result);
        setLoading(false);
    };

    const folders: Folder[] = [
        { name: "零碳园区参考规范", count: 12, desc: "包含最新的国家及团体标准", icon: BookOpen, color: "blue", type: "规范" },
        { name: "四川生物育种基地项目资料", count: 5, desc: "包含地形图、选址报告等项目文件", icon: MapPin, color: "green", type: "项目" },
    ];

    return (
        <div className="p-8 h-full bg-slate-50 overflow-y-auto">
            <AIModal 
                isOpen={modalOpen} 
                onClose={() => setModalOpen(false)} 
                title={modalTitle} 
                content={modalContent} 
                isLoading={loading} 
            />

            <h1 className="text-2xl font-bold text-slate-800 mb-6">我的收藏夹</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {folders.map((folder, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col h-44 justify-between group transition-all">
                        <div className="flex justify-between">
                            <div className={`p-3 rounded-lg w-fit ${
                              folder.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                                <folder.icon size={24} />
                            </div>
                            <MoreHorizontal className="text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">{folder.name}</h3>
                            <p className="text-sm text-slate-500">{folder.count} 个条目 • 最近更新 2小时前</p>
                        </div>
                        <div className="pt-3 border-t border-slate-50 md:opacity-0 group-hover:opacity-100 transition-opacity">
                             <button 
                                onClick={(e) => { e.stopPropagation(); handleFolderAnalysis(folder); }}
                                className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors w-full"
                             >
                                <FileBarChart size={12} /> 生成智能综述
                             </button>
                        </div>
                    </div>
                 ))}
                 
                 {/* 新建文件夹 */}
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-pointer flex flex-col h-44 justify-center items-center border-dashed border-slate-300">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">+</div>
                    <span className="text-slate-500 font-medium">新建收藏夹</span>
                 </div>
            </div>

            <h2 className="text-lg font-bold text-slate-800 mt-10 mb-4">最近调用历史</h2>
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                <div className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded"><Bot size={16} /></div>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-800">Q: 针对山地光伏项目，用地坡度限制是多少？</h4>
                        <p className="text-xs text-slate-500 truncate">AI: 根据《光伏发电站设计规范》GB 50797，山地光伏...</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">10分钟前</span>
                </div>
                <div className="p-4 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded"><FileText size={16} /></div>
                    <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-800">查看报告：2024新能源储能技术路线图</h4>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">2小时前</span>
                </div>
            </div>
        </div>
    );
};

export default CollectionView;
