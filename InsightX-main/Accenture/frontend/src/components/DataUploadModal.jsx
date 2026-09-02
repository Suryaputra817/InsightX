import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X, ArrowRight, Loader2, Sparkles, Database, Sliders } from 'lucide-react';
import { api } from '../services/api';

export const DataUploadModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [step, setStep] = useState(1); // 1: Select, 2: Column Mapping, 3: Processing, 4: Error/Success
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [schemaData, setSchemaData] = useState(null);
  const [columnMapping, setColumnMapping] = useState({
    revenue: '',
    orders: '',
    customers: '',
    delivery_delay: '',
    region: ''
  });

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMessage('');
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setErrorMessage("Invalid file format. Please upload a .csv, .xlsx, or .xls file.");
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setErrorMessage("File size exceeds maximum limit of 25MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleStartDetect = async () => {
    if (!file) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await api.detectSchema(file);
      setSchemaData(data);
      if (data.schema && data.schema.detectedMapping) {
        setColumnMapping(prev => ({
          ...prev,
          ...data.schema.detectedMapping
        }));
      }
      setStep(2);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.response?.data?.message || err.message || "Failed to parse file schema.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    setStep(3);
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await api.analyzeDataset(file, columnMapping);
      setLoading(false);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrorMessage(err.response?.data?.message || err.message || "ML model training failed. Please check column mappings.");
      setStep(4);
    }
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setErrorMessage('');
    setSchemaData(null);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-[#0f172a] border border-cyan-500/30 shadow-2xl text-white p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Analyze Your Business Data</h3>
                <p className="text-xs text-white/50">Upload your CSV/Excel dataset to train a custom ML investigation model</p>
              </div>
            </div>
            <button
              onClick={() => { resetModal(); onClose(); }}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-0.5">Dataset Error</div>
                <div>{errorMessage}</div>
              </div>
            </div>
          )}

          {/* STEP 1: Select File */}
          {step === 1 && (
            <div className="space-y-6">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all ${
                  dragActive
                    ? "border-cyan-400 bg-cyan-500/10"
                    : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/20 bg-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                }`}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {file ? (
                  <div className="flex flex-col items-center text-center">
                    <FileSpreadsheet className="w-12 h-12 text-emerald-400 mb-3" />
                    <span className="text-sm font-semibold text-white mb-1">{file.name}</span>
                    <span className="text-xs text-white/50">{(file.size / 1024).toFixed(1)} KB</span>
                    <span className="mt-3 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      ✓ Ready for Schema Detection
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <Upload className="w-10 h-10 text-cyan-400 mb-3" />
                    <span className="text-sm font-medium text-white mb-1">
                      Drag & Drop your business dataset here
                    </span>
                    <span className="text-xs text-white/40 mb-4">Supports .CSV, .XLSX, .XLS (Max 25MB)</span>
                    <span className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/30 transition-colors">
                      Browse File
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { resetModal(); onClose(); }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!file || loading}
                  onClick={handleStartDetect}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sliders className="w-4 h-4" />}
                  Configure Columns
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Schema & Column Mapping */}
          {step === 2 && schemaData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs text-white/70">
                <span>Dataset: <strong className="text-white">{schemaData.filename}</strong></span>
                <span>Rows: <strong className="text-cyan-400">{schemaData.schema.totalRows}</strong></span>
                <span>Columns: <strong className="text-cyan-400">{schemaData.schema.totalColumns}</strong></span>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-xs text-white/60 font-medium">Verify or adjust mapped dataset attributes:</p>

                {/* Target Revenue */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      Target KPI / Revenue <span className="text-cyan-400 text-[10px] bg-cyan-500/10 px-1.5 py-0.5 rounded">Required</span>
                    </div>
                    <div className="text-[11px] text-white/40">Primary metric to analyze (e.g. sales, revenue, net_amount)</div>
                  </div>
                  <select
                    value={columnMapping.revenue || ''}
                    onChange={(e) => setColumnMapping({ ...columnMapping, revenue: e.target.value })}
                    className="bg-[#1e293b] border border-cyan-500/40 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Select column...</option>
                    {schemaData.schema.columns.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>

                {/* Orders */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white">Orders / Volume</div>
                    <div className="text-[11px] text-white/40">Total transaction or order counts</div>
                  </div>
                  <select
                    value={columnMapping.orders || ''}
                    onChange={(e) => setColumnMapping({ ...columnMapping, orders: e.target.value })}
                    className="bg-[#1e293b] border border-white/20 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Auto / Optional...</option>
                    {schemaData.schema.columns.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Delivery Delay */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white">Operational Metric / Delay</div>
                    <div className="text-[11px] text-white/40">Delivery delay, complaint rate, or operational metric</div>
                  </div>
                  <select
                    value={columnMapping.delivery_delay || ''}
                    onChange={(e) => setColumnMapping({ ...columnMapping, delivery_delay: e.target.value })}
                    className="bg-[#1e293b] border border-white/20 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Auto / Optional...</option>
                    {schemaData.schema.columns.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Region */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="text-xs font-semibold text-white">Region / Dimension</div>
                    <div className="text-[11px] text-white/40">Geographic area, category, or segment</div>
                  </div>
                  <select
                    value={columnMapping.region || ''}
                    onChange={(e) => setColumnMapping({ ...columnMapping, region: e.target.value })}
                    className="bg-[#1e293b] border border-white/20 rounded-lg text-xs text-white px-3 py-1.5 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="">Auto / Optional...</option>
                    {schemaData.schema.columns.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Train Model & Investigate
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Training & Processing Progress */}
          {step === 3 && (
            <div className="py-8 flex flex-col items-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-semibold text-white">Training Machine Learning Pipeline</h4>
                <p className="text-xs text-white/50">Building dataset-specific Random Forest & SHAP explainers...</p>
              </div>

              <div className="w-full max-w-md bg-white/5 rounded-xl p-4 border border-white/10 space-y-3 text-left">
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Dataset uploaded & validated ({file?.name})</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Schema detected & feature matrix prepared</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Training ML models & evaluating R² / F1 metrics...</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-white/30">
                  <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                  <span>Calculating SHAP driver attributions & hypotheses</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Error Screen */}
          {step === 4 && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-white">Training Interrupted</h4>
              <p className="text-xs text-white/60 max-w-md">{errorMessage || "An error occurred during dataset training."}</p>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20"
                >
                  Adjust Mappings
                </button>
                <button
                  onClick={resetModal}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-white hover:bg-cyan-400"
                >
                  Try Another File
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
