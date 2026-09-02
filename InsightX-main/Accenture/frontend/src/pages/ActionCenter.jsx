import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function ActionCenter() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = () => {
    setLoading(true);
    api.getActions()
      .then(res => {
        setActions(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleStatusChange = (id, newStatus) => {
    // Optimistic UI Update
    setActions(prev => prev.map(act => {
      if (act._id === id || act.id === id) {
        return {
          ...act,
          status: newStatus,
          timeline: [...(act.timeline || []), { status: newStatus, timestamp: new Date().toISOString() }]
        };
      }
      return act;
    }));

    api.updateAction(id, newStatus)
      .then(() => {
        api.getActions().then(setActions);
      })
      .catch(err => {
        console.error("Failed to update status:", err);
        loadActions();
      });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Action Center</h1>
        <p className="text-xs text-white/50">Track resolution ticket lifecycles and verify closure audits.</p>
      </div>

      {/* Actions List Grid */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-white/5 rounded-2xl" />
        </div>
      ) : actions.length > 0 ? (
        <div className="grid grid-cols-1 gap-5">
          {actions.map((act) => {
            const idKey = act._id || act.id;
            const isOpen = act.status === 'OPEN';
            const isInvestigating = act.status === 'INVESTIGATING';
            const isResolved = act.status === 'RESOLVED';
            
            return (
              <div 
                key={idKey}
                className="liquid-glass p-6 rounded-2xl space-y-5"
              >
                {/* Top Info Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ff5f57]/15 text-[#ff5f57] text-[9px] font-bold uppercase tracking-wider">
                        {act.priority}
                      </span>
                      <span className="text-xs text-white/50">Owner: <b className="text-white uppercase">{act.owner}</b></span>
                    </div>
                    <h3 className="text-base font-semibold text-white mt-1">{act.title}</h3>
                  </div>

                  {/* Status Badges & Transitions */}
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isOpen ? 'bg-[#ff5f57]/15 text-[#ff5f57]' : (isInvestigating ? 'bg-[#febc2e]/15 text-[#febc2e]' : 'bg-[#28c840]/15 text-[#28c840]')
                    }`}>
                      {act.status}
                    </span>

                    {/* Transition controls */}
                    <div className="flex items-center bg-black/40 p-1 rounded-full border border-white/10 space-x-1">
                      {isOpen && (
                        <button
                          onClick={() => handleStatusChange(idKey, 'INVESTIGATING')}
                          className="px-3 py-1 rounded-full bg-white text-black font-semibold text-[10px] uppercase hover:bg-white/90 transition-colors"
                        >
                          Start investigating
                        </button>
                      )}
                      {isInvestigating && (
                        <button
                          onClick={() => handleStatusChange(idKey, 'RESOLVED')}
                          className="px-3 py-1 rounded-full bg-[#28c840] text-black font-semibold text-[10px] uppercase hover:bg-[#28c840]/90 transition-colors"
                        >
                          Resolve ticket
                        </button>
                      )}
                      {isResolved && (
                        <span className="px-2.5 py-1 text-[10px] font-semibold text-[#28c840] flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline track */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Action Audit History</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Step 1: Created */}
                    <div className="p-3 bg-black/40 border border-white/10 rounded-xl flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-[#28c840]" />
                      <div>
                        <div className="text-[10px] text-white font-semibold">Created</div>
                        <div className="text-[9px] text-white/40">{new Date(act.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Step 2: Investigating */}
                    <div className={`p-3 border rounded-xl flex items-center space-x-3 ${
                      isInvestigating || isResolved 
                        ? 'bg-black/40 border-white/10' 
                        : 'bg-black/20 border-transparent opacity-40'
                    }`}>
                      <Clock className={`w-4 h-4 ${isInvestigating || isResolved ? 'text-[#febc2e]' : 'text-white/40'}`} />
                      <div>
                        <div className="text-[10px] text-white font-semibold">Investigation Started</div>
                        <div className="text-[9px] text-white/40">
                          {act.timeline?.find(t => t.status === 'INVESTIGATING') 
                            ? new Date(act.timeline.find(t => t.status === 'INVESTIGATING').timestamp).toLocaleTimeString() 
                            : 'Pending'}
                        </div>
                      </div>
                    </div>

                    {/* Step 3: Resolved */}
                    <div className={`p-3 border rounded-xl flex items-center space-x-3 ${
                      isResolved 
                        ? 'bg-[#28c840]/[0.05] border-[#28c840]/20' 
                        : 'bg-black/20 border-transparent opacity-40'
                    }`}>
                      <CheckCircle2 className={`w-4 h-4 ${isResolved ? 'text-[#28c840]' : 'text-white/40'}`} />
                      <div>
                        <div className="text-[10px] text-white font-semibold">Resolved</div>
                        <div className="text-[9px] text-white/40">
                          {act.timeline?.find(t => t.status === 'RESOLVED') 
                            ? new Date(act.timeline.find(t => t.status === 'RESOLVED').timestamp).toLocaleTimeString() 
                            : 'Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 liquid-glass rounded-2xl">
          <CheckSquare className="w-8 h-8 text-white/40 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No actions initialized</h4>
          <p className="text-xs text-white/50">Actions will appear here when created from recommendations.</p>
        </div>
      )}
    </div>
  );
}
