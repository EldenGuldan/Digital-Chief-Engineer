
import React from 'react';
import { 
  Activity, TrendingUp, Coins, PieChart, AlertTriangle, 
  MessageSquare, Lock, Database, Search, ThumbsUp, 
  ThumbsDown, Mail, ArrowUpRight, Clock, Zap, MoreHorizontal, Filter
} from 'lucide-react';

// 辅助组件：顶部指标卡
const MetricCard = ({ label, value, trend, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-4 lg:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-all h-full">
    <div className="flex flex-col justify-between h-full">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="text-2xl font-black text-slate-800 tracking-tight mb-1">{value}</div>
      </div>
      {(trend || sub) && (
        <div className={`text-[10px] font-bold flex items-center gap-1 ${trend ? 'text-emerald-600' : 'text-slate-400'}`}>
          {trend && <TrendingUp size={10} />}
          {trend || sub}
        </div>
      )}
    </div>
    <div className={`p-2.5 rounded-xl ${
        color === 'blue' ? 'bg-blue-50 text-blue-600' :
        color === 'amber' ? 'bg-amber-50 text-amber-600' :
        color === 'purple' ? 'bg-purple-50 text-purple-600' :
        'bg-emerald-100 text-emerald-600'
    }`}>
      <Icon size={18} />
    </div>
  </div>
);

// 辅助组件：卡片标题
const CardHeader = ({ title, icon: Icon, color, action }: any) => (
  <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50 shrink-0">
     <div className="flex items-center gap-2.5">
        <div className={`p-1.5 rounded-lg ${color.replace('text-', 'bg-').replace('600', '50')} ${color}`}>
            <Icon size={16} />
        </div>
        <h3 className="font-black text-sm text-slate-800 tracking-tight">{title}</h3>
     </div>
     {action || <button className="text-slate-300 hover:text-slate-500"><MoreHorizontal size={16} /></button>}
  </div>
);

const MissingItem = ({ text }: { text: string }) => (
  <div className="flex items-center justify-between text-[11px] group cursor-pointer hover:bg-white/50 p-1.5 rounded transition-colors border-b border-transparent hover:border-slate-100 last:border-0">
     <span className="text-slate-600 font-medium truncate flex-1 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-red-400 shrink-0"></span>
        <span className="truncate">{text}</span>
     </span>
     <ArrowUpRight size={10} className="text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
  </div>
);

const FeedbackItem = ({ type, color, text, time }: any) => (
  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all cursor-pointer group shrink-0">
     <div className="flex justify-between items-start mb-1.5">
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
            color === 'blue' ? 'bg-blue-100 text-blue-600' :
            color === 'amber' ? 'bg-amber-100 text-amber-600' :
            color === 'red' ? 'bg-red-100 text-red-600' :
            'bg-emerald-100 text-emerald-600'
        }`}>{type}</span>
        <span className="text-[9px] text-slate-400 font-medium">{time}</span>
     </div>
     <p className="text-[11px] font-medium text-slate-700 leading-relaxed line-clamp-2 mb-1.5">
        {text}
     </p>
     <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        <Mail size={10} /> 回复用户
     </div>
  </div>
);

const AdminView: React.FC = () => {
    // 24小时数据点 (0-100 Scale, where 100 = 500k tokens)
    const dataPoints = [
        2, 1, 1, 1, 2, 3, 5, 12, // 00:00 - 07:00: 极低消耗，确保 y 接近 100
        35, 65, 80, 75, 60,      // 08:00 - 12:00: 上午爬升，10点高峰(80)
        70, 95, 100, 85, 65,     // 13:00 - 17:00: 下午爬升，15点最高峰(100)
        45, 25, 10, 5, 3, 2      // 18:00 - 23:00: 晚间回落
    ];
    
    // Output 数据约为 Input 的 35%
    const outputPoints = dataPoints.map(v => Math.max(0.5, Math.floor(v * 0.35)));

    // 将数据点转换为坐标数组 [x, y]
    const getCoordinates = (arr: number[]) => {
        return arr.map((val, i) => {
            const x = (i / (arr.length - 1)) * 100;
            const y = 100 - val; // 坐标系翻转，100 是底部 (Value 0)，0 是顶部 (Value 100)
            return [x, y];
        });
    };

    // 生成平滑贝塞尔曲线路径 (Catmull-Rom style logic for simple smoothing)
    const generateSmoothPath = (arr: number[]) => {
        const points = getCoordinates(arr);
        if (points.length === 0) return "";
        if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;

        let d = `M ${points[0][0]},${points[0][1]}`;
        
        // Tension: controls the "tightness" of the curve. 0.2 is a good balance.
        const tension = 0.2; 

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i < points.length - 2 ? points[i + 2] : p2;

            // Calculate control points
            const cp1x = p1[0] + (p2[0] - p0[0]) * tension;
            const cp1y = p1[1] + (p2[1] - p0[1]) * tension;

            const cp2x = p2[0] - (p3[0] - p1[0]) * tension;
            const cp2y = p2[1] - (p3[1] - p1[1]) * tension;
            
            // Clamping Y to [0, 100] to prevent the curve from dipping below the axis (y=100) or going above top (y=0)
            // This fixes the visual "less than 0" issue.
            const safeCp1y = Math.min(100, Math.max(0, cp1y));
            const safeCp2y = Math.min(100, Math.max(0, cp2y));

            d += ` C ${cp1x},${safeCp1y} ${cp2x},${safeCp2y} ${p2[0]},${p2[1]}`;
        }
        return d;
    };

    const inputPath = generateSmoothPath(dataPoints);
    const outputPath = generateSmoothPath(outputPoints);

    // 计算峰值点位置 (用于绝对定位 div，确保是正圆)
    const peakIndex = dataPoints.indexOf(Math.max(...dataPoints));
    const peakVal = dataPoints[peakIndex];
    const peakLeft = (peakIndex / (dataPoints.length - 1)) * 100;
    const peakTop = 100 - peakVal;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-hidden">
      {/* 顶部 Header - 紧凑型 */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 flex justify-between items-center z-10 shadow-sm/50">
         <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
               <div className="bg-slate-900 text-white p-1.5 rounded-lg">
                  <Lock size={14} />
               </div>
               后台管理数据看板
            </h1>
         </div>
         <div className="flex items-center gap-3">
             <div className="hidden md:flex bg-slate-100 rounded-lg p-1">
                <button className="px-3 py-1 bg-white rounded shadow-sm text-[10px] font-bold text-slate-800">24H</button>
                <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">7D</button>
                <button className="px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-700">30D</button>
             </div>
             <div className="h-4 w-px bg-slate-200 mx-1"></div>
             <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
             </span>
         </div>
      </div>

      {/* 主内容区域 - Flex 布局撑满高度 */}
      <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 md:gap-6 min-h-0 overflow-hidden">
         {/* 1. 核心指标条 (Metrics Strip) - 固定高度区域 */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0 h-28">
             <MetricCard 
                label="今日调用 (PV)" 
                value="12,458" 
                trend="+12.5%" 
                icon={Activity} 
                color="blue"
             />
             <MetricCard 
                label="预估成本 (Day)" 
                value="$14.52" 
                sub="4.2M Tokens" 
                icon={Coins} 
                color="amber"
             />
             <MetricCard 
                label="RAG 命中率" 
                value="94.8%" 
                sub="High Quality" 
                icon={Database} 
                color="purple"
             />
             <MetricCard 
                label="平均响应耗时" 
                value="1.2s" 
                sub="P99: 1.8s" 
                icon={Zap} 
                color="emerald"
             />
         </div>

         {/* 2. 主功能网格 (Bento Grid) - 撑满剩余高度 */}
         <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Col 1: 流量与成本 (Token Usage) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <CardHeader title="Token 消耗趋势 (24H)" icon={Coins} color="text-blue-600" />
                
                <div className="flex items-center gap-4 mb-4 shrink-0">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Input</p>
                      <p className="text-lg font-black text-slate-800">3.8M</p>
                   </div>
                   <div className="w-px h-6 bg-slate-100"></div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Output</p>
                      <p className="text-lg font-black text-slate-800">0.4M</p>
                   </div>
                   <div className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      Peak: 14:00 PM
                   </div>
                </div>

                <div className="flex-1 w-full flex gap-3 min-h-0">
                    {/* Y-Axis (Scale: 0 to 500k) */}
                    <div className="flex flex-col justify-between text-[9px] text-slate-400 font-bold py-0.5 h-[calc(100%-24px)] shrink-0 text-right w-8">
                        <span>500k</span>
                        <span>375k</span>
                        <span>250k</span>
                        <span>125k</span>
                        <span>0</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-end min-h-0 relative">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-[28px]">
                             <div className="w-full h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                             <div className="w-full h-px bg-slate-50"></div>
                             <div className="w-full h-px bg-slate-50"></div>
                             <div className="w-full h-px bg-slate-50"></div>
                             <div className="w-full h-px bg-slate-200"></div>
                        </div>

                        {/* Chart Area - SVG Smooth Line Chart */}
                        <div className="flex-1 w-full h-full relative min-h-0 z-10 pb-6 pl-1 group">
                             <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                <defs>
                                     <linearGradient id="gradInput" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                     </linearGradient>
                                     <linearGradient id="gradOutput" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                                     </linearGradient>
                                </defs>
                                
                                {/* Input Area & Line (Smooth) */}
                                <path d={`${inputPath} L 100,100 L 0,100 Z`} fill="url(#gradInput)" />
                                <path d={inputPath} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />

                                {/* Output Area & Line (Smooth) */}
                                <path d={`${outputPath} L 100,100 L 0,100 Z`} fill="url(#gradOutput)" />
                                <path d={outputPath} fill="none" stroke="#34d399" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            {/* Peak Marker (Independent Div for Perfect Circle) */}
                            <div 
                                className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-300 z-20 cursor-crosshair"
                                style={{ left: `${peakLeft}%`, top: `${peakTop}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Peak: 14:00
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1 border-t border-slate-200 pt-2 shrink-0 absolute bottom-0 w-full bg-white">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>23:59</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Col 2: 知识洞察 (Knowledge) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <CardHeader title="知识图谱洞察" icon={PieChart} color="text-purple-600" />
                
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="relative shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">高频检索词云</p>
                        <div className="flex flex-wrap gap-2 content-start">
                            {["光伏用地红线", "消防强条", "碳排放因子", "抗震等级", "装配式评价", "海绵城市", "充电桩间距", "绿证交易", "生物育种", "TOD开发"].map((t, i) => (
                                <span key={i} className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all hover:scale-105 cursor-default ${
                                    i < 3 ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 
                                    i < 6 ? 'bg-slate-50 text-slate-700 border-slate-200' : 
                                    'bg-white text-slate-500 border-slate-100 border-dashed'
                                }`}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 flex flex-col min-h-0">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center justify-between shrink-0">
                           <span className="flex items-center gap-1.5"><AlertTriangle size={12} /> 待补充知识 (Miss)</span>
                           <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px]">3 Pending</span>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                            <MissingItem text="深远海漂浮式风电锚固规范" />
                            <MissingItem text="2025年跨省电力输送损耗补偿" />
                            <MissingItem text="最新版生物育种实验室洁净度标准" />
                            <MissingItem text="复杂地形下的光伏支架基础设计规范" />
                            <MissingItem text="储能电站消防安全间距强条解读" />
                        </div>
                        <button className="w-full mt-3 text-[10px] font-black text-amber-600 bg-amber-100 hover:bg-amber-200 py-2 rounded-lg transition-colors uppercase tracking-wider shrink-0">
                           + 导入文档
                        </button>
                    </div>
                </div>
            </div>

            {/* Col 3: 质量反馈 (Feedback) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
                <CardHeader 
                    title="质量与反馈" 
                    icon={MessageSquare} 
                    color="text-emerald-600" 
                    action={<div className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded">本周</div>}
                />
                
                <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 shrink-0">
                     <div className="flex justify-between items-end mb-2">
                         <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-800">92.4%</span>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">CSAT Score</span>
                                <span className="text-[9px] text-emerald-600 font-bold">+1.2%</span>
                            </div>
                         </div>
                         <div className="flex gap-2">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600"><ThumbsUp size={10} className="text-emerald-500"/> 4.2k</div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600"><ThumbsDown size={10} className="text-red-400"/> 352</div>
                         </div>
                     </div>
                     <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                         <div className="w-[92%] h-full bg-emerald-500"></div>
                     </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 min-h-0">
                     <FeedbackItem type="纠错" color="blue" text="GB 50016-2014 的 5.1.2 条款引用似乎是旧版，请核实 2018 修订版内容。" time="10:42 AM" />
                     <FeedbackItem type="建议" color="amber" text="希望能增加导出 Word 格式报告的功能，目前只能复制很不方便。" time="昨天" />
                     <FeedbackItem type="投诉" color="red" text="查询响应速度有点慢，有时候需要等 5 秒以上。" time="2天前" />
                     <FeedbackItem type="表扬" color="emerald" text="关于海绵城市的资料非常全，检索很精准。" time="3天前" />
                     <FeedbackItem type="建议" color="amber" text="建议增加夜间模式，长时间查看图纸眼睛比较累。" time="4天前" />
                     <FeedbackItem type="纠错" color="blue" text="关于抗震等级的解释在第3段似乎有歧义，建议优化。" time="5天前" />
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminView;
