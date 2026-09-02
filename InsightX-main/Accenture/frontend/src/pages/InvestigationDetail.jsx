import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Play, 
  Compass, 
  Cpu, 
  Clock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Info,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { api } from '../services/api';

function CustomChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-[#0c0c0c]/90 border border-white/10 rounded-xl shadow-2xl text-xs space-y-1 backdrop-blur-xl">
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

export default function InvestigationDetail() {
  const { id } = useParams();
  const [investigation, setInvestigation] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [hypotheses, setHypotheses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [dimensionTab, setDimensionTab] = useState('region');
  const [activeNode, setActiveNode] = useState(null);
  const [highlightedEvidenceIds, setHighlightedEvidenceIds] = useState([]);

  const stages = [
    "Detecting anomaly...",
    "Analyzing dimensions...",
    "Finding affected segments...",
    "Collecting business evidence...",
    "Cross-checking logistics data...",
    "Analyzing customer complaints...",
    "Evaluating competitor pricing...",
    "Generating hypotheses...",
    "Testing alternative explanations...",
    "Calculating confidence...",
    "Generating recommendation..."
  ];

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getInvestigation(id),
      api.getEvidence(id),
      api.getHypotheses(id)
    ]).then(([inv, ev, hyp]) => {
      setInvestigation(inv);
      setEvidence(ev);
      setHypotheses(hyp);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleRunInvestigation = () => {
    setIsRunning(true);
    setCurrentStep(0);

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= stages.length - 1) {
          clearInterval(interval);
          api.runInvestigation(id).then(() => {
            setIsRunning(false);
            loadData();
          });
          return prev;
        }
        return prev + 1;
      });
    }, 320);
  };

  const handleNodeClick = (nodeType) => {
    setActiveNode(nodeType === activeNode ? null : nodeType);
    if (nodeType === 'evidence' || nodeType === 'hypothesis') {
      setHighlightedEvidenceIds(['ev-1', 'ev-2', 'ev-3', 'ev-4']);
    } else {
      setHighlightedEvidenceIds([]);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-10 w-96 bg-white/5 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  const trendData = [
    { name: "Week 1", expected: 42.0, actual: 42.2 },
    { name: "Week 2", expected: 43.0, actual: 43.1 },
    { name: "Week 3", expected: 44.5, actual: 44.6 },
    { name: "Week 4", expected: 45.0, actual: 45.2 },
    { name: "Week 5", expected: 46.0, actual: 45.9 },
    { name: "Week 6 (Current)", expected: 46.6, actual: 42.8 }
  ];

  return (
    <div className="space-y-8 pb-12 relative max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-white/40">
            <Link to="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/investigations" className="hover:text-white transition-colors">Investigations</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Detail</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Revenue Decline Investigation</h1>
          <p className="text-xs text-white/50">
            Status: <span className="font-semibold text-white">INVESTIGATING</span> &bull; Severity: <span className="font-semibold text-[#ff5f57]">HIGH</span> &bull; Detected: <span className="font-semibold text-white">August 24, 2026</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            investigation.status === 'COMPLETED' ? 'bg-[#28c840]/15 text-[#28c840]' : 'bg-[#00d2ff]/15 text-[#00d2ff]'
          }`}>
            {investigation.status === 'COMPLETED' ? 'Diagnosis Completed' : 'INVESTIGATING'}
          </span>
          {investigation.status !== 'COMPLETED' && (
            <button
              onClick={handleRunInvestigation}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black font-semibold rounded-full text-xs transition-all hover:bg-white/90 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Investigation</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Investigation Flow */}
      <div className="liquid-glass p-6 rounded-2xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#A4F4FD]">
          <Sparkles className="w-4 h-4" />
          <span>Core Investigation Flow</span>
        </div>
        <div className="text-lg font-semibold text-white">
          Main Question: "Why did revenue decline by 8.2%?"
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs pt-1">
          <div className="p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="text-[9px] uppercase text-white/40 font-bold">1 &bull; WHAT HAPPENED?</div>
            <div className="text-white font-semibold mt-0.5">Revenue ↓8.2%</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="text-[9px] uppercase text-white/40 font-bold">2 &bull; WHERE?</div>
            <div className="text-white font-semibold mt-0.5">North Region ↓17.4%</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="text-[9px] uppercase text-white/40 font-bold">3 &bull; WHO AFFECTED?</div>
            <div className="text-white font-semibold mt-0.5">Enterprise ↓23.1%</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="text-[9px] uppercase text-white/40 font-bold">4 &bull; WHAT EVIDENCE?</div>
            <div className="text-white font-semibold mt-0.5">Delivery delays ↑31%</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-white/10">
            <div className="text-[9px] uppercase text-white/40 font-bold">5 &bull; WHY HAPPENED?</div>
            <div className="text-white font-semibold mt-0.5">Logistics &bull; 87% Conf.</div>
          </div>
          <div className="p-3 bg-black/40 rounded-xl border border-[#28c840]/30">
            <div className="text-[9px] uppercase text-[#28c840] font-bold">6 &bull; WHAT TO DO?</div>
            <div className="text-[#28c840] font-semibold mt-0.5">Investigate Logistics</div>
          </div>
        </div>
      </div>

      {/* Investigation Progress Overlay (11 Stages) */}
      <AnimatePresence>
        {isRunning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-xl p-8 liquid-glass rounded-3xl border border-white/20 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-[#00d2ff] animate-pulse" />
                  <span className="font-semibold text-white text-sm">Aura Investigation Engine</span>
                </div>
                <span className="text-xs text-white/50 font-mono">Stage {currentStep + 1} of {stages.length}</span>
              </div>
              
              <div className="h-56 overflow-y-auto space-y-2 font-mono text-xs text-white/60 pr-2">
                {stages.slice(0, currentStep + 1).map((stage, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between py-1 border-b border-white/5"
                  >
                    <span className={idx === currentStep ? 'text-[#00d2ff] font-semibold' : 'text-white/80'}>
                      &gt; {stage}
                    </span>
                    {idx < currentStep ? (
                      <span className="text-[#28c840] font-bold">[OK]</span>
                    ) : (
                      <span className="text-[#00d2ff]">[PROCESSING]</span>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-1.5">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#00d2ff] to-[#3D81E3] transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / stages.length) * 100}%` }}
                  />
                </div>
                <div className="text-right text-[10px] text-white/40">
                  Programmatic diagnostic checks in execution.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid: What Happened & Where */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section A: What Happened */}
        <div className="lg:col-span-7 p-6 liquid-glass rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <span className="w-2 h-2 bg-[#ff5f57] rounded-full mr-2" />
              SECTION A — WHAT HAPPENED?
            </h2>
            <span className="text-xs text-[#ff5f57] font-semibold">Change: -8.2%</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-black/40 rounded-xl text-center border border-white/10">
              <div className="text-[10px] text-white/40 uppercase font-bold">Expected</div>
              <div className="text-base font-bold text-white mt-1">₹46.6M</div>
            </div>
            <div className="p-3 bg-black/40 rounded-xl text-center border border-white/10">
              <div className="text-[10px] text-white/40 uppercase font-bold">Actual</div>
              <div className="text-base font-bold text-[#ff5f57] mt-1">₹42.8M</div>
            </div>
            <div className="p-3 bg-black/40 rounded-xl text-center border border-white/10">
              <div className="text-[10px] text-white/40 uppercase font-bold">Variance</div>
              <div className="text-base font-bold text-[#ff5f57] mt-1">-₹3.8M</div>
            </div>
            <div className="p-3 bg-black/40 rounded-xl text-center border border-white/10">
              <div className="text-[10px] text-white/40 uppercase font-bold">Change</div>
              <div className="text-base font-bold text-[#ff5f57] mt-1">-8.2%</div>
            </div>
          </div>

          <div className="h-52 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActualDet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff5f57" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ff5f57" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} domain={[38, 48]} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="actual" stroke="#ff5f57" strokeWidth={2} fillOpacity={1} fill="url(#colorActualDet)" name="Actual" />
                <Line type="monotone" dataKey="expected" stroke="#00d2ff" strokeWidth={2} strokeDasharray="4 4" name="Expected" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section B: Where Did It Happen */}
        <div className="lg:col-span-5 p-6 liquid-glass rounded-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 bg-[#00d2ff] rounded-full mr-2" />
                SECTION B — WHERE DID IT HAPPEN?
              </h2>
            </div>

            {/* Segment selector */}
            <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              {['region', 'customer', 'product'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDimensionTab(tab)}
                  className={`py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                    dimensionTab === tab 
                      ? 'bg-white text-black font-bold' 
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tab === 'customer' ? 'Customer' : tab}
                </button>
              ))}
            </div>

            {/* Dimension Breakdown Bars */}
            <div className="space-y-3 pt-1">
              {investigation.affectedDimensions[dimensionTab]?.map((item, idx) => {
                const isNegative = item.change < 0;
                const valuePercent = Math.min(Math.abs(item.change) * 2.5, 100);
                const isTopContributor = (dimensionTab === 'region' && item.name === 'North') ||
                                         (dimensionTab === 'customer' && item.name === 'Enterprise') ||
                                         (dimensionTab === 'product' && item.name === 'Product A');
                
                return (
                  <div key={idx} className={`p-3 rounded-xl border transition-all ${
                    isTopContributor ? 'bg-[#ff5f57]/[0.08] border-[#ff5f57]/30' : 'bg-black/30 border-white/10'
                  }`}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="font-medium text-white flex items-center">
                        {item.name}
                        {isTopContributor && (
                          <span className="ml-2 px-1.5 py-0.2 rounded-full bg-[#ff5f57]/20 text-[#ff5f57] text-[8px] font-bold uppercase tracking-wider">
                            Major Impact
                          </span>
                        )}
                      </span>
                      <span className={`font-semibold ${isNegative ? 'text-[#ff5f57]' : 'text-[#28c840]'}`}>
                        {isNegative ? '' : '+'}{item.change}%
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isNegative ? 'bg-[#ff5f57]' : 'bg-[#28c840]'}`}
                        style={{ width: `${valuePercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[10px] text-white/50 mt-4 border-t border-white/10 pt-3 leading-relaxed">
            Identified: <b className="text-white">North Region (-17.4%)</b> and <b className="text-white">Enterprise Customers (-23.1%)</b> as the major affected dimensions.
          </div>
        </div>
      </div>

      {/* Investigation Tree */}
      <div className="liquid-glass p-6 rounded-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 bg-[#A4F4FD] rounded-full mr-2" />
            INVESTIGATION TREE
          </h2>
          <span className="text-[10px] text-white/40 font-mono">Visual Reasoning Trace</span>
        </div>

        {/* Visual Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 py-2">
          <div 
            onClick={() => handleNodeClick('root')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
              activeNode === 'root' ? 'bg-[#ff5f57]/20 border-[#ff5f57]' : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-[8px] text-[#ff5f57] font-bold uppercase">Root Metric</div>
            <div className="text-sm font-bold text-white mt-1">Revenue</div>
            <div className="text-xs text-[#ff5f57] font-semibold mt-0.5">↓8.2%</div>
          </div>

          <div 
            onClick={() => handleNodeClick('segment')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
              activeNode === 'segment' ? 'bg-[#00d2ff]/20 border-[#00d2ff]' : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-[8px] text-[#00d2ff] font-bold uppercase">Region</div>
            <div className="text-sm font-bold text-white mt-1">North Region</div>
            <div className="text-xs text-[#ff5f57] font-semibold mt-0.5">↓17.4%</div>
          </div>

          <div 
            onClick={() => handleNodeClick('subsegment')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
              activeNode === 'subsegment' ? 'bg-[#00d2ff]/20 border-[#00d2ff]' : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-[8px] text-[#00d2ff] font-bold uppercase">Segment</div>
            <div className="text-sm font-bold text-white mt-1">Enterprise Clients</div>
            <div className="text-xs text-[#ff5f57] font-semibold mt-0.5">↓23.1%</div>
          </div>

          <div 
            onClick={() => handleNodeClick('evidence')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center relative ${
              activeNode === 'evidence' || highlightedEvidenceIds.length > 0 ? 'bg-[#A4F4FD]/20 border-[#A4F4FD]' : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-[8px] text-[#A4F4FD] font-bold uppercase">Evidence</div>
            <div className="text-sm font-bold text-white mt-1">Delivery Delays</div>
            <div className="text-xs text-[#A4F4FD] font-semibold mt-0.5">↑31%</div>
          </div>

          <div 
            onClick={() => handleNodeClick('hypothesis')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
              activeNode === 'hypothesis' ? 'bg-[#28c840]/20 border-[#28c840]' : 'bg-black/30 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-[8px] text-[#28c840] font-bold uppercase">Hypothesis</div>
            <div className="text-sm font-bold text-white mt-1">Logistics Hypothesis</div>
            <div className="text-xs text-[#28c840] font-semibold mt-0.5">Confidence 87%</div>
          </div>
        </div>

        <div className="text-[11px] text-white/40 text-center">
          💡 <i>Click any node block above to highlight connected evidence.</i>
        </div>
      </div>

      {/* Grid: Evidence Section & Hypothesis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evidence Section */}
        <div className="lg:col-span-6 p-6 liquid-glass rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <span className="w-2 h-2 bg-[#00d2ff] rounded-full mr-2" />
              BUSINESS EVIDENCE
            </h2>
            <Link to={`/investigations/${id}/evidence`} className="text-xs text-[#00d2ff] hover:underline flex items-center font-medium">
              Audit Explorer
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {evidence.map((ev) => {
              const isHighlighted = highlightedEvidenceIds.includes(ev._id) || highlightedEvidenceIds.includes(ev.id);
              return (
                <div 
                  key={ev._id || ev.id} 
                  className={`p-4 rounded-2xl border transition-all ${
                    isHighlighted ? 'bg-white/10 border-white' : 'bg-black/30 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-2 font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/70 font-semibold border border-white/10">
                      {ev.source}
                    </span>
                    <span className="text-white/40">Reliability: <b className="text-white">{ev.reliability}%</b></span>
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-relaxed">{ev.finding}</h4>
                  <div className="flex items-center justify-between mt-2.5 text-[10px] text-white/40">
                    <span>{new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span className="text-[#A4F4FD] font-medium">Hypothesis: {ev.relatedHypotheses[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hypothesis Section */}
        <div className="lg:col-span-6 p-6 liquid-glass rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <span className="w-2 h-2 bg-[#A4F4FD] rounded-full mr-2" />
              HYPOTHESES
            </h2>
            <span className="text-[10px] text-white/40 font-mono">Causal Weighting</span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {hypotheses.map((hyp) => {
              const isSupported = hyp.causalStatus === 'SUPPORTED';
              const isCorrelated = hyp.causalStatus === 'CORRELATED';
              
              return (
                <div key={hyp._id || hyp.id} className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-bold text-white uppercase max-w-[70%]">{hyp.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider uppercase ${
                      isSupported ? 'bg-[#28c840]/15 text-[#28c840]' : (isCorrelated ? 'bg-[#febc2e]/15 text-[#febc2e]' : 'bg-white/10 text-white/50')
                    }`}>
                      {hyp.causalStatus}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border-2 border-dashed border-[#00d2ff]/40 bg-white/5">
                      <div className="text-center">
                        <div className="text-xs font-bold text-[#00d2ff]">{hyp.confidence}%</div>
                        <div className="text-[6px] text-white/40 uppercase font-bold">Confidence</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-white/60">
                        <span className="font-semibold text-white">Alternative:</span> {hyp.alternatives}
                      </div>
                      <div className="text-[10px] text-white/60">
                        <span className="font-semibold text-white">Supporting evidence:</span> {hyp.supportingEvidence ? hyp.supportingEvidence.length : 0} items
                      </div>
                    </div>
                  </div>

                  {/* Causal Warning */}
                  <div className="p-2.5 rounded-xl bg-black/40 text-[9.5px] text-white/60 border-l-2 border-[#A4F4FD] leading-relaxed">
                    ⚠ <b>Causal warning:</b> {hyp.causalWarning}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final Recommendation Callout */}
      {investigation.status === 'COMPLETED' && (
        <div className="p-6 rounded-2xl liquid-glass border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left max-w-3xl">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#ff5f57]/20 text-[#ff5f57] text-[9px] font-bold uppercase tracking-wider">
                CRITICAL PRIORITY
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00d2ff]/20 text-[#00d2ff] text-[9px] font-bold uppercase tracking-wider">
                82% CONFIDENCE
              </span>
              <span className="text-xs text-white/50">Owner: <b className="text-white">OPERATIONS</b></span>
            </div>
            <h4 className="text-base font-semibold text-white">
              "Investigate North-region logistics partners and prioritize delayed enterprise orders."
            </h4>
            <p className="text-xs text-white/60">
              Reason: Delivery delays increased 31%, North-region delays increased 44%, and enterprise delayed orders increased 39%.
            </p>
          </div>
          <Link
            to="/recommendations"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-xs px-6 py-3 transition-all hover:bg-white/90 shrink-0"
          >
            <span>Create Action</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[1px]" />
          </Link>
        </div>
      )}
    </div>
  );
}
