import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function Investigations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    api.getInvestigations()
      .then(res => {
        setList(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredList = list.filter(inv => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'HIGH') return inv.severity === 'HIGH';
    if (activeFilter === 'MEDIUM') return inv.severity === 'MEDIUM';
    if (activeFilter === 'LOW') return inv.severity === 'LOW';
    if (activeFilter === 'ACTIVE') return inv.status !== 'COMPLETED';
    if (activeFilter === 'RESOLVED') return inv.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">AI Investigations</h1>
        <p className="text-xs text-white/50">Autonomous anomaly investigations and root-cause diagnostic pipelines.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-px overflow-x-auto">
        {['ALL', 'HIGH', 'MEDIUM', 'ACTIVE', 'RESOLVED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeFilter === filter 
                ? 'border-white text-white font-bold' 
                : 'border-transparent text-white/40 hover:text-white'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid of investigations */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-white/5 rounded-2xl" />
          <div className="h-28 bg-white/5 rounded-2xl" />
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((inv) => (
            <div 
              key={inv._id} 
              className="liquid-glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    inv.severity === 'HIGH' ? 'bg-[#ff5f57]/15 text-[#ff5f57]' : 'bg-[#febc2e]/15 text-[#febc2e]'
                  }`}>
                    {inv.severity} Severity
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                    inv.status === 'COMPLETED' ? 'bg-[#28c840]/15 text-[#28c840]' : 'bg-[#00d2ff]/15 text-[#00d2ff]'
                  }`}>
                    {inv.status === 'COMPLETED' ? 'Diagnosis Completed' : 'Investigating'}
                  </span>
                  <span className="text-[11px] text-white/40 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Detected: {new Date(inv.detectedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white">{inv.name} Anomaly</h3>
                <p className="text-xs text-white/60 max-w-3xl leading-relaxed">
                  Deviation of <span className="text-[#ff5f57] font-semibold">{inv.change}%</span> from targets. 
                  Dimension isolation points to <span className="text-white font-medium">North Region logistics</span> and <span className="text-white font-medium">Enterprise customer agreements</span>.
                </p>
              </div>

              <div className="flex items-center space-x-6 shrink-0 self-end md:self-center">
                <div className="text-right hidden sm:block">
                  <div className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">Confidence</div>
                  <div className="text-sm font-bold text-[#A4F4FD]">{inv.confidence}% Supported</div>
                </div>
                <Link
                  to={`/investigations/${inv._id}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-xs px-4 py-2.5 transition-all hover:bg-white/90"
                >
                  <span>{inv.status === 'COMPLETED' ? 'View Findings' : 'Investigate'}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[1px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 liquid-glass rounded-2xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-white/40 mx-auto" />
          <h4 className="text-sm font-semibold text-white">No active investigations</h4>
          <p className="text-xs text-white/50">There are no investigations matching this criteria.</p>
        </div>
      )}
    </div>
  );
}
