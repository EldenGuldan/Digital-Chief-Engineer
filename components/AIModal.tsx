
import React from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading: boolean;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, title, content, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles size={20} />
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto min-h-[150px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 py-10">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <p>数字主工 正在深度思考中...</p>
            </div>
          ) : (
            <div className="prose prose-sm prose-slate max-w-none whitespace-pre-wrap leading-relaxed text-slate-700">
              {content}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl text-right">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;
