import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckSquare, Clock, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function Recommendations() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    api.getRecommendations()
      .then(res => {
        setRecommendations(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCreateActionClick = (rec) => {
    setModalData(rec);
  };

  const handleConfirmCreateAction = () => {
    if (!modalData) return;

    const actionPayload = {
      recommendationId: modalData._id || modalData.id || "rec-1",
      title: modalData.title,
      owner: modalData.owner,
      priority: modalData.priority
    };

    api.createAction(actionPayload)
      .then(() => {
        setModalData(null);
        navigate('/actions');
      })
      .catch(err => {
        console.error("Error creating action:", err);
      });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">System Recommendations</h1>
        <p className="text-xs text-white/50">Review and execute AI recommendations based on weighted diagnostic evidence.</p>
      </div>

      {/* Recommendations Cards list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-white/5 rounded-2xl" />
          <div className="h-32 bg-white/5 rounded-2xl" />
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec) => {
            const isCritical = rec.priority === 'CRITICAL';
            const isHigh = rec.priority === 'HIGH';
            return (
              <div 
                key={rec._id || rec.id} 
                className={`liquid-glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                  isCritical 
                    ? 'border-white/30 shadow-lg' 
                    : (isHigh ? 'border-white/20' : 'border-white/10')
                }`}
              >
                <div className="space-y-3 max-w-3xl">
                  {/* Badge Row */}
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isCritical ? 'bg-[#ff5f57]/15 text-[#ff5f57]' : (isHigh ? 'bg-[#febc2e]/15 text-[#febc2e]' : 'bg-[#00d2ff]/15 text-[#00d2ff]')
                    }`}>
                      {rec.priority} Priority
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[9px] font-semibold uppercase tracking-wider">
                      {rec.confidence}% Confidence
                    </span>
                    <span className="text-xs text-white/50">
                      Owner: <b className="text-white uppercase">{rec.owner}</b>
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white leading-snug">{rec.title}</h3>
                  
                  <p className="text-xs text-white/60 leading-relaxed">
                    <span className="font-semibold text-white">Reason:</span> {rec.reason}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => handleCreateActionClick(rec)}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-xs px-5 py-2.5 transition-all hover:bg-white/90"
                  >
                    <span>Create Action</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-[1px]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 liquid-glass rounded-2xl">
          <Compass className="w-8 h-8 text-white/40 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-white">No recommendations generated</h4>
          <p className="text-xs text-white/50">Recommendations will appear once diagnostic runs finish.</p>
        </div>
      )}

      {/* Create Action Confirmation Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 liquid-glass rounded-3xl border border-white/20 shadow-2xl space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h3 className="text-base font-semibold text-white">Initialize Action Ticket</h3>
              <p className="text-xs text-white/50">Convert recommendation into a tracked operational task.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/10">
                <div className="text-[10px] text-white/40 font-bold uppercase">Task Name</div>
                <div className="text-xs font-semibold text-white">{modalData.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/10">
                  <div className="text-[10px] text-white/40 font-bold uppercase">Owner</div>
                  <div className="text-xs font-semibold text-white uppercase">{modalData.owner}</div>
                </div>
                <div className="p-3 bg-black/40 rounded-xl space-y-1 border border-white/10">
                  <div className="text-[10px] text-white/40 font-bold uppercase">Priority</div>
                  <div className="text-xs font-semibold text-white uppercase">{modalData.priority}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setModalData(null)}
                className="px-4 py-2 text-xs font-medium rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCreateAction}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-white text-black hover:bg-white/90"
              >
                Confirm Action Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
