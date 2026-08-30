import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, AlertTriangle, ArrowLeft, Shield, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function EvidenceExplorer() {
  const { id } = useParams();
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [strengthFilter, setStrengthFilter] = useState('');

  useEffect(() => {
    loadEvidence();
  }, [id, sourceFilter, strengthFilter]);

  const loadEvidence = () => {
    setLoading(true);
    api.getEvidence(id, sourceFilter, strengthFilter)
      .then(res => {
        setEvidenceList(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs text-white/40 mb-2">
          <Link to="/investigations" className="hover:text-white transition-colors">Investigations</Link>
          <span>/</span>
          <Link to={`/investigations/${id}`} className="hover:text-white transition-colors">Detail</Link>
          <span>/</span>
          <span className="text-white/70">Evidence Explorer</span>
        </div>
        <div className="flex items-center space-x-3">
          <Link to={`/investigations/${id}`} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Evidence Explorer</h1>
            <p className="text-xs text-white/50">Trace reasoning models back to source operational telemetry.</p>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <div className="liquid-glass p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Source filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'LOGISTICS', 'ORDERS', 'CUSTOMER SUPPORT', 'MARKET INTELLIGENCE', 'SALES'].map((src) => (
            <button
              key={src}
              onClick={() => setSourceFilter(src)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-colors whitespace-nowrap ${
                sourceFilter === src 
                  ? 'bg-white text-black font-bold' 
                  : 'bg-black/30 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {src === 'MARKET INTELLIGENCE' ? 'Market Intel' : (src === 'CUSTOMER SUPPORT' ? 'Support' : src)}
            </button>
          ))}
        </div>

        {/* Reliability filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-white/50 shrink-0 font-medium flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1 text-[#00d2ff]" />
            Reliability:
          </span>
          <select
            value={strengthFilter}
            onChange={(e) => setStrengthFilter(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
          >
            <option value="">All strengths</option>
            <option value="STRONG">Strong (&gt;80%)</option>
            <option value="MEDIUM">Medium (50-80%)</option>
            <option value="WEAK">Weak (&lt;50%)</option>
          </select>
        </div>
      </div>

      {/* Audit Table */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : evidenceList.length > 0 ? (
        <div className="overflow-hidden border border-white/10 liquid-glass rounded-2xl shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/40 text-white/40 uppercase tracking-wider font-semibold border-b border-white/10">
                <th className="p-4">Source</th>
                <th className="p-4">Finding Details</th>
                <th className="p-4">Reported Metric</th>
                <th className="p-4 text-center">Reliability</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {evidenceList.map((ev) => {
                const isStrong = ev.reliability >= 80;
                const isMedium = ev.reliability >= 50 && ev.reliability < 80;
                return (
                  <tr key={ev._id || ev.id} className="hover:bg-white/5 text-white transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/40 text-white/70 font-mono text-[10px] font-semibold border border-white/10">
                        {ev.source}
                      </span>
                    </td>
                    <td className="p-4 font-medium leading-relaxed max-w-sm">
                      {ev.finding}
                    </td>
                    <td className="p-4 font-mono font-bold text-[#00d2ff]">
                      {ev.value}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isStrong ? 'bg-[#28c840]/15 text-[#28c840]' : (isMedium ? 'bg-[#febc2e]/15 text-[#febc2e]' : 'bg-[#ff5f57]/15 text-[#ff5f57]')
                      }`}>
                        {ev.reliability}%
                      </span>
                    </td>
                    <td className="p-4 text-white/40 whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleDateString()} &bull; {new Date(ev.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 liquid-glass rounded-2xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-white/40 mx-auto" />
          <h4 className="text-sm font-semibold text-white">No evidence records found</h4>
          <p className="text-xs text-white/50">No audit logs match the selected filter combination.</p>
        </div>
      )}
    </div>
  );
}
