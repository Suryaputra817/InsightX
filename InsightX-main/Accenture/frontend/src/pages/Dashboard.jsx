import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingDown, 
  TrendingUp, 
  ArrowRight, 
  Clock, 
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2,
  X,
  Activity,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  ExternalLink,
  ArrowDown,
  ArrowUpRight,
  Target,
  UserCheck,
  Check,
  Network
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line,
  ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { DataUploadModal } from '../components/DataUploadModal';
import { Database } from 'lucide-react';



function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-[#0c0c0c]/95 border border-white/20 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-xl">
        <div className="font-bold text-white mb-1">{label}</div>
        <div className="text-[#00d2ff] flex items-center justify-between space-x-4">
          <span>Target:</span>
          <span className="font-mono font-bold">₹{payload[1]?.value || payload[0]?.value}M</span>
        </div>
        <div className="text-[#ff5f57] flex items-center justify-between space-x-4">
          <span>Actual:</span>
          <span className="font-mono font-bold">₹{payload[0]?.value}M</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBlock, setHoveredBlock] = useState(null); // '01' | '02' | '03' | '04' | '05' | null
  const [actionStatus, setActionStatus] = useState('IDENTIFIED');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [customResult, setCustomResult] = useState(null);

  useEffect(() => {
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  const handleAnalysisComplete = (result) => {
    setCustomResult(result);
    if (result && result.investigation) {
      navigate(`/stage/02?customId=${result.investigation._id}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-10 w-96 bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-80 bg-white/5 rounded-3xl" />
          <div className="h-80 bg-white/5 rounded-3xl" />
          <div className="h-80 bg-white/5 rounded-3xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-white/5 rounded-3xl" />
          <div className="h-80 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { primaryMetric } = data || {};

  const getBlockOpacity = (blockId) => {
    if (!hoveredBlock) return 1;
    return hoveredBlock === blockId ? 1 : 0.72;
  };

  const getBlockScale = (blockId) => {
    if (!hoveredBlock) return 1;
    return hoveredBlock === blockId ? 1.03 : 0.99;
  };

  return (
    <div className="relative max-w-7xl mx-auto space-y-4 pb-10">
      {/* Upload Business Data Hero Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60 border border-cyan-500/30 shadow-xl backdrop-blur-xl gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Analyze Your Business Data
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                ML Pipeline Ready
              </span>
            </h2>
            <p className="text-xs text-white/60">Upload CSV or Excel files to train isolated Random Forest & SHAP models with real validation metrics</p>
          </div>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Upload Business Data
        </button>
      </div>

      <DataUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* ============================================================
          5-BLOCK INTELLIGENCE CANVAS
          Row 1: 01 DASHBOARD | 02 INVESTIGATION | 03 EVIDENCE
          Row 2: 04 RECOMMENDATION | 05 ACTION
          ============================================================ */}
      <div className="space-y-4">

        
        {/* ROW 1: 3 BLOCKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* ------------------------------------------------------------
              BLOCK 01: DASHBOARD (What Happened?)
              ------------------------------------------------------------ */}
          <motion.div
            style={{
              opacity: getBlockOpacity('01'),
              scale: getBlockScale('01'),
            }}
            onMouseEnter={() => setHoveredBlock('01')}
            onMouseLeave={() => setHoveredBlock(null)}
            onClick={() => navigate('/stage/01')}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative glass-block glass-block-01 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              hoveredBlock === '01' 
                ? 'scale-[1.03] border-[#ff5f57] shadow-2xl shadow-[#ff5f57]/25' 
                : 'hover:border-[#ff5f57]/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#00d2ff]">
                    01
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">DASHBOARD</h3>
                    <p className="text-[10px] text-white/50">What Happened?</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Metric */}
              <div className="space-y-1 mb-4">
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">Revenue</div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">₹42.8M</span>
                  <span className="text-xs font-bold text-[#ff5f57] flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    ↓ 8.2%
                  </span>
                </div>
                <div className="text-[10px] text-white/40">vs expected ₹46.6M (Variance -₹3.8M)</div>
              </div>

              {/* Secondary KPIs */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 mb-4">
                <div>
                  <div className="text-[9px] text-white/40 uppercase">Orders</div>
                  <div className="text-xs font-bold text-white">184K <span className="text-[#00d2ff] font-normal">↑2.4%</span></div>
                </div>
                <div>
                  <div className="text-[9px] text-white/40 uppercase">Customers</div>
                  <div className="text-xs font-bold text-white">92.4K <span className="text-[#ff5f57] font-normal">↓1.8%</span></div>
                </div>
                <div>
                  <div className="text-[9px] text-white/40 uppercase">Complaints</div>
                  <div className="text-xs font-bold text-white">1,240 <span className="text-[#ff5f57] font-normal">↑18.2%</span></div>
                </div>
              </div>

              {/* Mini Trend Graph */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] text-white/40">
                  <span>Revenue Trend (Expected vs Actual)</span>
                  <span className="text-[#00d2ff]">Target: ₹46.6M</span>
                </div>
                <div className="h-20 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={primaryMetric?.trendData || []} margin={{ top: 2, right: 2, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="chart01Grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff5f57" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#ff5f57" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="actual" stroke="#ff5f57" strokeWidth={2} fill="url(#chart01Grad)" />
                      <Line type="monotone" dataKey="expected" stroke="#00d2ff" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5f57]/20 text-[#ff5f57] text-[10px] font-bold tracking-wider">
                ANOMALY DETECTED
              </span>
              <span className="text-[10px] text-white/40 group-hover:text-white flex items-center gap-1 transition-colors">
                Click to inspect <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------
              BLOCK 02: INVESTIGATION (Where Did It Happen?)
              ------------------------------------------------------------ */}
          <motion.div
            style={{
              opacity: getBlockOpacity('02'),
              scale: getBlockScale('02'),
            }}
            onMouseEnter={() => setHoveredBlock('02')}
            onMouseLeave={() => setHoveredBlock(null)}
            onClick={() => navigate('/stage/02')}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative glass-block glass-block-02 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              hoveredBlock === '02' 
                ? 'scale-[1.03] border-[#00d2ff] shadow-2xl shadow-[#00d2ff]/25' 
                : 'hover:border-[#00d2ff]/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#00d2ff]">
                    02
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">INVESTIGATION</h3>
                    <p className="text-[10px] text-white/50">Where Did It Happen?</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dimensional Decomposition Flow */}
              <div className="text-[10px] uppercase font-bold tracking-wider text-white/40 mb-2">
                Root Cause Decomposition Flow
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <span className="text-white/80 font-medium">Revenue</span>
                  <span className="text-[#ff5f57] font-bold">↓ 8.2%</span>
                </div>

                <div className="flex justify-center text-white/30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs">
                  <span className="text-white font-medium">North Region Geography</span>
                  <span className="text-[#ff5f57] font-bold">↓ 17.4%</span>
                </div>

                <div className="flex justify-center text-white/30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/15 text-xs">
                  <span className="text-white font-medium">Enterprise Customers</span>
                  <span className="text-[#ff5f57] font-bold">↓ 23.1%</span>
                </div>

                <div className="flex justify-center text-white/30">
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.05] border border-white/20 text-xs">
                  <span className="text-white font-semibold">Delayed Orders</span>
                  <span className="text-[#ff5f57] font-bold">↑ 39%</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <div className="text-[9px] text-white/40 uppercase font-semibold">Primary Anomaly</div>
                <div className="text-xs font-bold text-white">North Region (87% Confidence)</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5f57]/20 text-[#ff5f57] text-[10px] font-bold">
                HIGH SEVERITY
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------
              BLOCK 03: EVIDENCE (What Evidence Do We Have?)
              ------------------------------------------------------------ */}
          <motion.div
            style={{
              opacity: getBlockOpacity('03'),
              scale: getBlockScale('03'),
            }}
            onMouseEnter={() => setHoveredBlock('03')}
            onMouseLeave={() => setHoveredBlock(null)}
            onClick={() => navigate('/stage/03')}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative glass-block glass-block-03 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              hoveredBlock === '03' 
                ? 'scale-[1.03] border-[#a855f7] shadow-2xl shadow-[#a855f7]/25' 
                : 'hover:border-[#a855f7]/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#00d2ff]">
                    03
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">EVIDENCE</h3>
                    <p className="text-[10px] text-white/50">What Evidence Do We Have?</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Evidence Indicators List */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="text-white font-medium">Delivery Delays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff5f57] font-bold">+31%</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70">HIGH</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                    <span className="text-white font-medium">North Region Delays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#ff5f57] font-bold">+44%</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70">HIGH</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                    <span className="text-white font-medium">Customer Complaints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#febc2e] font-bold">+27%</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70">HIGH</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    <span className="text-white font-medium">Competitor Pricing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d2ff] font-bold">-12%</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70">LOW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-white/40">5 Connected Signals</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6366f1]/20 text-[#A4F4FD] text-[10px] font-bold">
                EVIDENCE CORRELATION ACTIVE
              </span>
            </div>
          </motion.div>
        </div>

        {/* ROW 2: 2 BLOCKS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* ------------------------------------------------------------
              BLOCK 04: RECOMMENDATION (Why Is This Happening?)
              ------------------------------------------------------------ */}
          <motion.div
            style={{
              opacity: getBlockOpacity('04'),
              scale: getBlockScale('04'),
            }}
            onMouseEnter={() => setHoveredBlock('04')}
            onMouseLeave={() => setHoveredBlock(null)}
            onClick={() => navigate('/stage/04')}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative glass-block glass-block-04 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              hoveredBlock === '04' 
                ? 'scale-[1.03] border-[#28c840] shadow-2xl shadow-[#28c840]/25' 
                : 'hover:border-[#28c840]/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#00d2ff]">
                    04
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">RECOMMENDATION</h3>
                    <p className="text-[10px] text-white/50">Why Is This Happening?</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Hypotheses Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                    Hypotheses Probability
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">Logistics Issue</span>
                      <span className="text-[#28c840] font-bold">82%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#28c840] h-full rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">Competitor Pricing</span>
                      <span className="text-[#febc2e] font-bold">46%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#febc2e] h-full rounded-full w-[46%]" />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">Sales Performance</span>
                      <span className="text-white/50 font-bold">21%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-white/30 h-full rounded-full w-[21%]" />
                    </div>
                  </div>
                </div>

                {/* Best Explanation Card */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#A4F4FD]">Best Explanation</div>
                    <h4 className="text-base font-bold text-white mt-1">Logistics Disruption</h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      Delivery delays and partner bottlenecks in the North explain 82% of revenue drop.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-white/40">
                    Causal Status: <span className="text-[#28c840] font-semibold">SUPPORTED (Not Proven)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Evidence → Hypothesis → Decision</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#28c840]/20 text-[#28c840] text-[10px] font-bold">
                82% CONFIDENCE
              </span>
            </div>
          </motion.div>

          {/* ------------------------------------------------------------
              BLOCK 05: ACTION (What Should We Do Next?)
              ------------------------------------------------------------ */}
          <motion.div
            style={{
              opacity: getBlockOpacity('05'),
              scale: getBlockScale('05'),
            }}
            onMouseEnter={() => setHoveredBlock('05')}
            onMouseLeave={() => setHoveredBlock(null)}
            onClick={() => navigate('/stage/05')}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative glass-block glass-block-05 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
              hoveredBlock === '05' 
                ? 'scale-[1.03] border-[#febc2e] shadow-2xl shadow-[#febc2e]/25' 
                : 'hover:border-[#febc2e]/50'
            }`}
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#00d2ff]">
                    05
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight uppercase">ACTION</h3>
                    <p className="text-[10px] text-white/50">What Should We Do Next?</p>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/15 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Action Ticket */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/15 mb-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Investigate North-region logistics partners
                    </h4>
                    <p className="text-xs text-white/60 mt-1">
                      Audit SLA penalties and prioritize delayed enterprise shipments to halt client cancellations.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#ff5f57]/20 text-[#ff5f57] text-[10px] font-bold shrink-0">
                    CRITICAL
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[9px] text-white/40 uppercase">Owner</span>
                    <div className="font-semibold text-white">Operations</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase">Priority</span>
                    <div className="font-bold text-[#ff5f57]">CRITICAL</div>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 uppercase">Status</span>
                    <div className="font-semibold text-[#00d2ff]">{actionStatus}</div>
                  </div>
                </div>
              </div>

              {/* Interactive Workflow Stepper */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-white/40">Action Workflow</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {['IDENTIFIED', 'ASSIGNED', 'INVESTIGATING', 'RESOLVED'].map((st) => {
                    const isCurrent = actionStatus === st;
                    return (
                      <button
                        key={st}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionStatus(st);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-[10px] font-mono font-semibold transition-all ${
                          isCurrent
                            ? 'bg-white text-black font-bold shadow-md'
                            : 'bg-white/5 hover:bg-white/10 text-white/50'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Status Tag */}
            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-white/40">Workflow Interactive</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/stage/05');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3.5 py-1.5 rounded-xl bg-white/10 group-hover:bg-white group-hover:text-black transition-all"
              >
                <span>View Full Action Ticket</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
