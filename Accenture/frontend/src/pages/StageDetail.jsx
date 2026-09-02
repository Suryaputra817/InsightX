import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { ArrowLeft, ArrowRight, TrendingUp, CheckCircle2, Clock, Target, Zap, GitBranch, ShieldCheck, Activity, BarChart2, Network, FileSearch, Info, AlertCircle, Database, Brain } from "lucide-react";

/* ─── Static NovaMart fallback data ─── */
const NM_TREND = [{week:"Wk 1",actual:45.2,expected:46.6},{week:"Wk 2",actual:46.1,expected:46.6},{week:"Wk 3",actual:44.8,expected:46.6},{week:"Wk 4",actual:43.9,expected:46.6},{week:"Wk 5",actual:43.1,expected:46.6},{week:"Wk 6",actual:42.8,expected:46.6}];
const NM_REGIONS = [{region:"North",actual:-17.4,color:"#ff5f57"},{region:"South",actual:3.1,color:"#28c840"},{region:"East",actual:1.2,color:"#00d2ff"},{region:"West",actual:-2.1,color:"#febc2e"}];
const NM_HYPOTHESES = [{name:"Logistics Disruption",probability:82,color:"#28c840",status:"SUPPORTED"},{name:"Competitor Pricing",probability:46,color:"#febc2e",status:"CORRELATED"},{name:"Sales Performance",probability:21,color:"#ff5f57",status:"INSUFFICIENT"}];
const NM_EVIDENCE = [{signal:"Delivery Delays",value:"+31%",severity:"HIGH",color:"#ff5f57",reliability:94},{signal:"North Region Delays",value:"+44%",severity:"HIGH",color:"#ff5f57",reliability:91},{signal:"Customer Complaints",value:"+27%",severity:"HIGH",color:"#febc2e",reliability:88},{signal:"Competitor Pricing",value:"-12%",severity:"LOW",color:"#00d2ff",reliability:62},{signal:"Inventory Levels",value:"-8%",severity:"MEDIUM",color:"#febc2e",reliability:75},{signal:"Enterprise Churn",value:"+23%",severity:"HIGH",color:"#ff5f57",reliability:89}];

/* ─── Helpers ─── */
function Tip({active,payload,label}){if(!active||!payload?.length)return null;return(<div className="p-3 rounded-xl border border-white/15 bg-[#05050f]/95 text-xs space-y-1 shadow-2xl"><div className="font-bold text-white mb-1">{label}</div>{payload.map((p,i)=>(<div key={i} className="flex justify-between gap-4" style={{color:p.color||"#fff"}}><span className="capitalize">{p.name}:</span><span className="font-bold font-mono">{p.value}</span></div>))}</div>);}
function ABar({value,color,delay=0}){const[w,setW]=useState(0);useEffect(()=>{const t=setTimeout(()=>setW(value),delay*1000+400);return()=>clearTimeout(t);},[value,delay]);return(<div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-1000 ease-out" style={{width:`${w}%`,backgroundColor:color}}/></div>);}
function FlowNode({label,sub,color="#00d2ff",delay=0,highlight=false}){return(<motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay,duration:0.4}} className={`px-5 py-3 rounded-xl border text-center min-w-[190px] max-w-sm ${highlight?"bg-[#ff5f57]/10 border-[#ff5f57]/45 shadow-lg":"bg-white/[0.04] border-white/15"}`}><div className="text-xs font-bold" style={{color}}>{label}</div>{sub&&<div className="text-[10px] text-white/50 mt-0.5">{sub}</div>}</motion.div>);}
function FlowArrow({delay=0}){return(<motion.div initial={{opacity:0,scaleY:0}} animate={{opacity:1,scaleY:1}} transition={{delay,duration:0.25}} className="flex justify-center my-1"><div className="w-px h-6 bg-white/20 relative"><div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/30"/></div></motion.div>);}
function Card({children,className=""}){return <div className={`bg-[#12131e] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-md ${className}`}>{children}</div>;}
function ST({icon:Icon,color="#00d2ff",children}){return(<div className="flex items-center gap-2 mb-4"><Icon className="w-4 h-4 shrink-0" style={{color}}/><h3 className="text-sm font-bold text-white uppercase tracking-wider">{children}</h3></div>);}

/* ─── Severity / status helpers ─── */
const statusColor = (s) => s==="SUPPORTED"||s==="HIGH"?"#28c840":s==="CORRELATED"||s==="MEDIUM"?"#febc2e":"#ff5f57";

/* ════════════════════════════════════════
   STAGE 01 — Dashboard: What Happened?
   ════════════════════════════════════════ */
function Stage01({cd}) {
  const inv = cd?.investigation;
  const drivers = cd?.topDrivers || [];
  const isCustom = !!cd;

  // Build KPI cards from ML data or NovaMart fallback
  const kpis = isCustom ? [
    {label: cd.datasetName || "Dataset", value: inv?.name?.split("(")[0]?.trim() || "—", delta: "Custom ML Investigation", color: "#00d2ff"},
    {label: "Baseline (avg)", value: inv ? String(Math.round(inv.expectedValue)) : "—", delta: "Historical Mean", color: "#6366f1"},
    {label: "Recent (avg)", value: inv ? String(Math.round(inv.actualValue)) : "—", delta: "Recent Period", color: "#febc2e"},
    {label: "Change %", value: inv ? `${inv.change > 0 ? "+" : ""}${inv.change}%` : "—", delta: inv?.severity || "DETECTED", color: inv?.change < 0 ? "#ff5f57" : "#28c840"},
  ] : [
    {label:"Revenue Actual",value:"$42.8M",delta:"Down 8.2%",color:"#ff5f57"},
    {label:"Expected",value:"$46.6M",delta:"Q3 Baseline",color:"#00d2ff"},
    {label:"Variance",value:"-$3.8M",delta:"Gap",color:"#febc2e"},
    {label:"Complaints",value:"1,240",delta:"Up 18.2%",color:"#ff5f57"},
  ];

  // SHAP driver trend chart data
  const driverChart = drivers.slice(0,6).map((d,i)=>({
    feature: d.feature.length > 16 ? d.feature.slice(0,16)+"…" : d.feature,
    impact: parseFloat(d.impact) || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi,i)=>(
          <motion.div key={kpi.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className="bg-[#12131e] border border-white/10 rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">{kpi.label}</div>
            <div className="text-xl font-black text-white mt-1 truncate">{kpi.value}</div>
            <div className="text-xs font-bold mt-0.5" style={{color:kpi.color}}>{kpi.delta}</div>
          </motion.div>
        ))}
      </div>

      {isCustom && drivers.length > 0 ? (
        <>
          <Card>
            <ST icon={Brain} color="#00d2ff">ML-Detected SHAP Feature Drivers (Top Influences on {cd.investigation?.metricId})</ST>
            <p className="text-xs text-white/50 mb-4">Ranked by mean absolute SHAP value. Higher score = stronger causal signal. These drivers explain the observed movement in your target metric.</p>
            <div className="space-y-3">
              {drivers.map((d,i)=>(
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium truncate max-w-[60%]">{d.feature}</span>
                    <div className="flex gap-3 shrink-0">
                      <span className="text-white/40">SHAP: {d.impact}</span>
                      <span className="font-bold" style={{color: d.direction==="negative"?"#ff5f57":"#28c840"}}>{d.direction}</span>
                    </div>
                  </div>
                  <ABar value={Math.min(100, (d.impact / (drivers[0].impact||1)) * 100)} color={d.direction==="negative"?"#ff5f57":"#28c840"} delay={i*0.1}/>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <ST icon={Activity} color="#6366f1">ML Validation Metrics</ST>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {[
                {label:"Model", value:cd.mlMetrics?.modelType?.split(" ")[0]||"RF", color:"#00d2ff"},
                {label:"R² Score", value:cd.mlMetrics?.r2Score??"-", color: cd.mlMetrics?.r2Score > 0.5 ? "#28c840" : cd.mlMetrics?.r2Score > 0 ? "#febc2e" : "#ff5f57"},
                {label:"RMSE", value:cd.mlMetrics?.rmse??"-", color:"#febc2e"},
                {label:"Rows Trained", value:`${cd.mlMetrics?.totalRows||"-"}`, color:"#6366f1"},
              ].map(m=>(
                <div key={m.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                  <div className="text-white/40 uppercase text-[9px] mb-1">{m.label}</div>
                  <div className="font-black font-mono" style={{color:m.color}}>{m.value}</div>
                </div>
              ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <ST icon={Activity} color="#ff5f57">Weekly Revenue — Expected vs Actual</ST>
            <p className="text-xs text-white/50 mb-4">Revenue deviation began Week 3 and accelerated through Week 6. Widening gap confirms supply/logistics disruption — order volumes stable.</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={NM_TREND} margin={{top:10,right:10,left:-10,bottom:0}}>
                  <defs>
                    <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ff5f57" stopOpacity={0.35}/><stop offset="95%" stopColor="#ff5f57" stopOpacity={0}/></linearGradient>
                    <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00d2ff" stopOpacity={0.15}/><stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.35)" fontSize={11}/>
                  <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} domain={[40,48]} tickFormatter={v=>`$${v}M`}/>
                  <Tooltip content={<Tip/>}/>
                  <Area type="monotone" dataKey="expected" name="expected" stroke="#00d2ff" strokeWidth={2} strokeDasharray="4 4" fill="url(#ag2)" dot={{r:3,fill:"#00d2ff"}}/>
                  <Area type="monotone" dataKey="actual" name="actual" stroke="#ff5f57" strokeWidth={2.5} fill="url(#ag1)" dot={{r:4,fill:"#ff5f57"}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <ST icon={BarChart2} color="#00d2ff">Regional Revenue % Change</ST>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={NM_REGIONS} margin={{top:5,right:5,left:-20,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false}/>
                    <XAxis dataKey="region" stroke="rgba(255,255,255,0.35)" fontSize={11}/>
                    <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickFormatter={v=>v+"%"}/>
                    <Tooltip content={<Tip/>}/>
                    <Bar dataKey="actual" name="Change%" radius={[6,6,0,0]} fill="#00d2ff"/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <ST icon={Info} color="#febc2e">Key Business Findings</ST>
              <div className="space-y-2.5">
                {[{text:"Revenue dropped $3.8M below Q3 target",sev:"CRITICAL",c:"#ff5f57"},{text:"North region is sole outlier (-17.4%)",sev:"HIGH",c:"#ff5f57"},{text:"Order volume up 2.4% — demand intact",sev:"INFO",c:"#00d2ff"},{text:"Enterprise customers down 23.1%",sev:"HIGH",c:"#febc2e"},{text:"Delivery delays spiked 39% in North",sev:"HIGH",c:"#ff5f57"},{text:"Customer complaints up 18.2%",sev:"MEDIUM",c:"#febc2e"}].map((f,i)=>(
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0" style={{color:f.c,background:f.c+"22"}}>{f.sev}</span><span className="text-xs text-white/75">{f.text}</span></div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   STAGE 02 — Investigation: Where?
   ════════════════════════════════════════ */
function Stage02({cd}) {
  const isCustom = !!cd;
  const drivers = cd?.topDrivers || [];
  const inv = cd?.investigation;

  const flowNodes = isCustom
    ? [
        {label: `${inv?.metricId || "KPI"} Anomaly Detected`, sub: `${inv?.change > 0 ? "+" : ""}${inv?.change}% movement`, color:"#ff5f57", hl:true},
        {label: drivers[0]?.feature || "Primary Driver", sub:`SHAP score: ${drivers[0]?.impact}`, color:"#febc2e", hl:false},
        ...(drivers[1] ? [{label: drivers[1].feature, sub:`Secondary SHAP: ${drivers[1].impact}`, color:"#febc2e", hl:false}] : []),
        {label: "Root Signal Isolated", sub:`${cd.mlMetrics?.totalRows} rows · R²: ${cd.mlMetrics?.r2Score}`, color:"#28c840", hl:false},
      ]
    : [
        {label:"Revenue Anomaly",sub:"Down 8.2% | $3.8M gap",color:"#ff5f57",hl:true},
        {label:"North Region",sub:"Down 17.4% | PRIMARY ANOMALY",color:"#ff5f57",hl:true},
        {label:"Enterprise Customers",sub:"Down 23.1% | 87% confidence",color:"#febc2e",hl:false},
        {label:"Delayed Orders",sub:"Up 39% | Root signal",color:"#ff5f57",hl:true},
      ];

  return (
    <div className="space-y-6">
      <Card>
        <ST icon={GitBranch} color="#00d2ff">{isCustom ? "ML Root Cause Decomposition Chain" : "Root Cause Decomposition Flowchart"}</ST>
        <p className="text-xs text-white/50 mb-6">
          {isCustom
            ? `Multi-level SHAP attribution chain from RandomForestRegressor trained on ${cd.mlMetrics?.totalRows} rows. Each node is ranked by mean absolute SHAP contribution.`
            : "Multi-level dimensional decomposition — each node tested at p < 0.05 statistical significance before elevation in the chain."}
        </p>
        <div className="flex flex-col items-center">
          {flowNodes.map((n,i)=>(
            <React.Fragment key={i}>
              <FlowNode label={n.label} sub={n.sub} color={n.color} delay={i*0.14} highlight={n.hl}/>
              {i < flowNodes.length-1 && <FlowArrow delay={i*0.14+0.07}/>}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {isCustom ? (
        <Card>
          <ST icon={BarChart2} color="#ff5f57">Top Feature Impact Breakdown</ST>
          <p className="text-xs text-white/50 mb-4">Features ranked by SHAP contribution. Bar width shows relative impact magnitude on the target metric.</p>
          <div className="space-y-4">
            {drivers.map((d,i)=>(
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium truncate max-w-[55%]">{d.feature}</span>
                  <div className="flex gap-3 shrink-0">
                    <span className="text-white/40 font-mono">{d.impact}</span>
                    <span className="font-bold px-2 py-0.5 rounded text-[9px]" style={{color:d.direction==="negative"?"#ff5f57":"#28c840",background:(d.direction==="negative"?"#ff5f57":"#28c840")+"22"}}>{d.direction?.toUpperCase()}</span>
                  </div>
                </div>
                <ABar value={Math.min(100, (d.impact / (drivers[0].impact||1)) * 100)} color={d.direction==="negative"?"#ff5f57":"#28c840"} delay={i*0.1}/>
              </div>
            ))}
          </div>
          {inv?.affectedDimensions?.length > 0 && (
            <div className="mt-5">
              <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Affected Dimensions</div>
              <div className="space-y-2">
                {inv.affectedDimensions.map((dim,i)=>(
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${dim.contribution < 0 ? "bg-[#ff5f57]/08 border-[#ff5f57]/30" : "bg-white/[0.03] border-white/10"}`}>
                    <span className="text-sm font-semibold text-white">{dim.value}</span>
                    <span className={`font-bold text-xs ${dim.contribution < 0 ? "text-[#ff5f57]" : "text-[#28c840]"}`}>{dim.contribution > 0 ? "+" : ""}{dim.contribution}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <ST icon={BarChart2} color="#ff5f57">Regional Isolation Analysis</ST>
            <div className="space-y-3">
              {[{region:"North",change:-17.4,orders:"42K",anomaly:true},{region:"South",change:+3.1,orders:"61K",anomaly:false},{region:"East",change:+1.2,orders:"48K",anomaly:false},{region:"West",change:-2.1,orders:"33K",anomaly:false}].map(r=>(
                <div key={r.region} className={`flex items-center justify-between p-3 rounded-xl border ${r.anomaly?"bg-[#ff5f57]/08 border-[#ff5f57]/30":"bg-white/[0.03] border-white/10"}`}>
                  <div className="flex items-center gap-3">{r.anomaly&&<span className="w-2 h-2 rounded-full bg-[#ff5f57] animate-pulse"/>}<span className="text-sm font-semibold text-white">{r.region}</span></div>
                  <div className="flex items-center gap-4 text-xs"><span className="text-white/50">{r.orders} orders</span><span className={`font-bold ${r.change<0?"text-[#ff5f57]":"text-[#28c840]"}`}>{r.change>0?"+":""}{r.change}%</span></div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <ST icon={Network} color="#6366f1">Customer Segment Breakdown</ST>
            <p className="text-xs text-white/50 mb-4">Enterprise accounts with SLA-sensitive contracts drove 68% of the revenue loss in North.</p>
            <div className="space-y-4">
              {[{seg:"Enterprise",change:-23.1,contribution:"68%",color:"#ff5f57"},{seg:"Mid-Market",change:-9.4,contribution:"22%",color:"#febc2e"},{seg:"SMB / Consumer",change:-1.2,contribution:"10%",color:"#00d2ff"}].map(s=>(
                <div key={s.seg} className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-white font-medium">{s.seg}</span><div className="flex gap-3"><span className="text-white/40">{s.contribution} of loss</span><span className="font-bold" style={{color:s.color}}>{s.change}%</span></div></div>
                  <ABar value={Math.abs(s.change)*3} color={s.color} delay={0.2}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   STAGE 03 — Evidence: What Evidence?
   ════════════════════════════════════════ */
function Stage03({cd}) {
  const [sel, setSel] = useState(null);
  const isCustom = !!cd;
  const drivers = cd?.topDrivers || [];

  // Build evidence signal cards from ML drivers
  const evidenceSignals = isCustom
    ? drivers.map((d,i)=>{
        const severity = i === 0 ? "HIGH" : i <= 2 ? "MEDIUM" : "LOW";
        const color = severity==="HIGH" ? "#ff5f57" : severity==="MEDIUM" ? "#febc2e" : "#00d2ff";
        const reliability = Math.min(95, Math.max(55, Math.round(90 - i * 8)));
        return {
          signal: d.feature,
          value: `SHAP: ${d.impact}`,
          severity,
          color,
          reliability,
          direction: d.direction,
        };
      })
    : NM_EVIDENCE;

  // Build hypothesis/evidence tiers
  const hypotheses = cd?.hypotheses || [];

  return (
    <div className="space-y-6">
      <Card>
        <ST icon={FileSearch} color="#6366f1">{isCustom ? "ML SHAP Evidence Signal Matrix — Click to inspect" : "Evidence Signal Matrix — Click any signal to inspect"}</ST>
        <p className="text-xs text-white/50 mb-4">
          {isCustom
            ? `${evidenceSignals.length} SHAP-attributed signals from RandomForestRegressor. Signal impact ranks are ML-computed from your dataset of ${cd.mlMetrics?.totalRows} rows.`
            : "Six telemetry signals cross-referenced. Reliability reflects data quality and sample consistency. HIGH signals above 85% are treated as primary evidence."}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceSignals.map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.07}} onClick={()=>setSel(sel===i?null:i)} className={`p-4 rounded-2xl border cursor-pointer transition-all ${sel===i?"border-white/30 bg-white/[0.07]":"border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
              <div className="flex justify-between mb-2"><span className="w-2.5 h-2.5 rounded-full mt-0.5" style={{background:s.color}}/><span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{color:s.color,background:s.color+"22"}}>{s.severity}</span></div>
              <div className="text-sm font-bold text-white mb-1 truncate">{s.signal}</div>
              <div className="text-sm font-black font-mono" style={{color:s.color}}>{s.value}</div>
              {isCustom && <div className="text-[10px] text-white/40 mt-1">Direction: <span style={{color:s.direction==="negative"?"#ff5f57":"#28c840"}}>{s.direction}</span></div>}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-white/40"><span>Reliability</span><span>{s.reliability}%</span></div>
                <ABar value={s.reliability} color={s.color} delay={i*0.07}/>
              </div>
              {sel===i && (
                <div className="mt-3 pt-3 border-t border-white/10 text-[10px] text-white/55 leading-relaxed">
                  {isCustom ? `Feature '${s.signal}' has a SHAP attribution of ${s.value} on the target metric. ${s.severity} priority signal.` : "Click again to collapse."}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <ST icon={ShieldCheck} color="#28c840">Evidence Classification Tiers</ST>
          <div className="space-y-3">
            {isCustom && hypotheses.length > 0 ? (
              hypotheses.map((h,i)=>(
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{color:statusColor(h.causalStatus)}}>{h.causalStatus}</span>
                    <span className="text-[10px] text-white/40 font-mono">{h.confidence}%</span>
                  </div>
                  <p className="text-xs text-white/80 font-semibold mb-1">{h.title}</p>
                  {h.supportingEvidence?.map((e,j)=><p key={j} className="text-[10px] text-white/55">{e}</p>)}
                </div>
              ))
            ) : (
              [{tier:"PRIMARY EVIDENCE",desc:"Delivery Delays, North Delays, Enterprise Churn",rel:"89-94%",color:"#28c840"},{tier:"SUPPORTING",desc:"Customer Complaints, Inventory Levels",rel:"75-88%",color:"#febc2e"},{tier:"CORRELATED",desc:"Competitor Pricing",rel:"62%",color:"#00d2ff"}].map(t=>(
                <div key={t.tier} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                  <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-bold uppercase tracking-wider" style={{color:t.color}}>{t.tier}</span><span className="text-[10px] text-white/40 font-mono">{t.rel}</span></div>
                  <p className="text-xs text-white/60">{t.desc}</p>
                </div>
              ))
            )}
            <div className="p-3 rounded-xl bg-[#6366f1]/08 border border-[#6366f1]/20">
              <p className="text-xs text-white/55 leading-relaxed"><span className="font-bold text-[#A4F4FD]">Caution:</span> Correlation does not equal causation. ML models identify statistical patterns. Causal proof requires domain validation and controlled experiments.</p>
            </div>
          </div>
        </Card>

        <Card>
          <ST icon={Info} color="#febc2e">Evidence Summary</ST>
          <div className="space-y-3">
            {isCustom ? (
              <>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Dataset</div>
                  <div className="text-xs font-semibold text-white">{cd.datasetName}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Model</div>
                  <div className="text-xs font-semibold text-cyan-300">{cd.mlMetrics?.modelType}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Signals Detected</div>
                  <div className="text-xs font-semibold text-white">{evidenceSignals.length} SHAP-weighted feature signals</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] text-white/40 uppercase mb-1">Primary Causal Status</div>
                  <div className="text-xs font-bold" style={{color:statusColor(hypotheses[0]?.causalStatus)}}>{hypotheses[0]?.causalStatus || "ANALYSING"}</div>
                </div>
              </>
            ) : (
              <p className="text-xs text-white/60 leading-relaxed">Six NovaMart telemetry signals cross-referenced. Three classified as primary evidence (reliability {">"}85%). Competitor pricing classified as correlated only.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   STAGE 04 — Recommendation: Why?
   ════════════════════════════════════════ */
function Stage04({cd}) {
  const [slider, setSlider] = useState(82);
  const isCustom = !!cd;
  const hypotheses = cd?.hypotheses || [];
  const inv = cd?.investigation;
  const drivers = cd?.topDrivers || [];
  const recommendations = cd?.recommendations || [];

  const hypoDisplay = isCustom
    ? hypotheses.map((h,i)=>({
        name: h.title,
        probability: h.confidence,
        color: statusColor(h.causalStatus),
        status: h.causalStatus,
      }))
    : NM_HYPOTHESES;

  const pctChange = inv?.change || -8.2;
  const totalVariance = Math.abs(pctChange);

  return (
    <div className="space-y-6">
      <Card>
        <ST icon={Target} color="#28c840">{isCustom ? "ML Hypothesis Probability Analysis" : "Hypothesis Probability Analysis (Bayesian Scoring)"}</ST>
        <p className="text-xs text-white/50 mb-5">
          {isCustom
            ? "Hypotheses are ranked by ML confidence derived from SHAP feature attributions. Primary hypothesis is the feature with highest causal signal in your uploaded dataset."
            : "Evidence supporting a hypothesis increases its posterior probability. Final probabilities reflect weighted evidence strength across all 6 signals."}
        </p>
        <div className="space-y-5">
          {hypoDisplay.map((h,i)=>(
            <div key={i}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-white truncate max-w-[60%]">{h.name}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{color:h.color,background:h.color+"22"}}>{h.status}</span>
                  <span className="text-lg font-black" style={{color:h.color}}>{h.probability}%</span>
                </div>
              </div>
              <ABar value={h.probability} color={h.color} delay={i*0.15}/>
            </div>
          ))}
        </div>
      </Card>

      {isCustom && recommendations.length > 0 && (
        <Card>
          <ST icon={ShieldCheck} color="#28c840">ML-Generated Recommendations</ST>
          <p className="text-xs text-white/50 mb-4">Recommendations derived from the trained ML model's top SHAP drivers and KPI movement analysis.</p>
          <div className="space-y-4">
            {recommendations.map((r,i)=>(
              <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-sm font-bold text-white">{r.title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold shrink-0" style={{color:r.priority==="CRITICAL"?"#ff5f57":r.priority==="HIGH"?"#febc2e":"#00d2ff",background:(r.priority==="CRITICAL"?"#ff5f57":r.priority==="HIGH"?"#febc2e":"#00d2ff")+"22"}}>{r.priority}</span>
                </div>
                <p className="text-xs text-white/60">{r.reasoning}</p>
                <div className="flex gap-4 mt-2 text-[10px] text-white/40">
                  <span>Owner: <span className="text-white/60">{r.owner}</span></span>
                  <span>Confidence: <span className="text-cyan-400">{r.confidence}%</span></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <ST icon={Zap} color="#A4F4FD">Interactive Recovery Simulation</ST>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-semibold">{isCustom ? (hypotheses[0]?.title || "Primary Hypothesis") : "Logistics Hypothesis"} Confidence</span>
              <span className="font-black text-[#28c840]">{slider}%</span>
            </div>
            <input type="range" min={0} max={100} value={slider} onChange={e=>setSlider(Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{accentColor:"#28c840"}}/>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {label:"Projected Recovery", value: isCustom ? `${(totalVariance * slider/100).toFixed(1)}% gain` : `$${(3.8*slider/100).toFixed(1)}M`, color:"#28c840"},
              {label:"Residual Variance", value: isCustom ? `${(totalVariance*(1-slider/100)).toFixed(1)}% gap` : `$${(3.8*(1-slider/100)).toFixed(1)}M`, color:"#ff5f57"},
              {label:"Confidence", value:`${slider}%`, color:"#00d2ff"},
            ].map(s=>(
              <div key={s.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
                <div className="text-[10px] text-white/40 uppercase">{s.label}</div>
                <div className="text-xl font-black mt-1 font-mono" style={{color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-white/30 italic">Simulation assumes linear recovery. Actual outcomes depend on operational response and business context.</p>
        </div>
      </Card>

      {!isCustom && (
        <Card>
          <ST icon={GitBranch} color="#28c840">Proposed Causal Chain (Hypothesis — Not Proven)</ST>
          <div className="p-3 mb-4 rounded-xl bg-[#febc2e]/08 border border-[#febc2e]/25">
            <p className="text-xs text-[#febc2e]/80">Warning: Supported by correlation evidence only. Has NOT been validated via controlled experiment.</p>
          </div>
          <div className="flex flex-col items-center space-y-1">
            {[{label:"North Logistics Partner Capacity Bottleneck",color:"#ff5f57"},{label:"Delivery SLA Breaches (Up 44% delay rate)",color:"#ff5f57"},{label:"Enterprise Customer Order Cancellations",color:"#febc2e"},{label:"Revenue Recognition Shortfall (Down 23.1%)",color:"#febc2e"},{label:"Overall Revenue Gap (-$3.8M, Down 8.2%)",color:"#ff5f57"}].map((n,i)=>(
              <React.Fragment key={i}><FlowNode label={n.label} color={n.color} delay={i*0.1}/>{i<4&&<FlowArrow delay={i*0.1+0.05}/>}</React.Fragment>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   STAGE 05 — Action: What Should We Do?
   ════════════════════════════════════════ */
function Stage05({cd}) {
  const [step, setStep] = useState(1);
  const isCustom = !!cd;
  const inv = cd?.investigation;
  const drivers = cd?.topDrivers || [];
  const recommendations = cd?.recommendations || [];
  const hypotheses = cd?.hypotheses || [];

  const primaryDriver = drivers[0]?.feature || "Primary Driver";
  const targetCol = inv?.metricId || "target metric";
  const pctChange = inv?.change || 0;
  const severity = inv?.severity || "HIGH";

  const wf = [
    {label:"Identified",desc:"Anomaly detected by ML pipeline",icon:AlertCircle,color:"#ff5f57"},
    {label:"Assigned",desc:`${recommendations[0]?.owner || "Operations"} notified`,icon:CheckCircle2,color:"#febc2e"},
    {label:"Investigating",desc:`Auditing ${primaryDriver} variance`,icon:FileSearch,color:"#00d2ff"},
    {label:"Resolved",desc:"KPI movement normalized",icon:CheckCircle2,color:"#28c840"},
  ];

  // Build ML-derived action checklist
  const actionItems = isCustom
    ? [
        {task:`Audit and monitor '${primaryDriver}' — top SHAP driver (impact: ${drivers[0]?.impact || "-"})`, owner:recommendations[0]?.owner||"Operations", done:false},
        ...(drivers[1] ? [{task:`Investigate secondary driver '${drivers[1].feature}' (SHAP: ${drivers[1].impact})`, owner:"Analytics", done:false}] : []),
        ...(drivers[2] ? [{task:`Evaluate '${drivers[2].feature}' for correlated operational patterns`, owner:"Business Intelligence", done:false}] : []),
        {task:`Validate ML model R² score (${cd.mlMetrics?.r2Score}) with domain experts`, owner:"Data Science", done:false},
        {task:`Set real-time alerting threshold on ${targetCol} metric`, owner:"Analytics", done:false},
        {task:`Schedule follow-up training on updated dataset (30 days)`, owner:"ML Team", done:false},
        {task:`Document findings and share investigation report with stakeholders`, owner:"Leadership", done:false},
      ]
    : [
        {task:"Pull SLA compliance reports for all North partners (60 days)",owner:"Operations",done:true},
        {task:"Identify partners that exceeded delay thresholds (>3-day breach)",owner:"Logistics",done:true},
        {task:"Calculate SLA penalty amounts per contract terms",owner:"Legal",done:false},
        {task:"Initiate emergency capacity negotiations with top 3 North partners",owner:"Operations",done:false},
        {task:"Brief Enterprise account managers on resolution timeline",owner:"Sales",done:false},
        {task:"Offer proactive compensation to top-30 affected enterprise accounts",owner:"CX Team",done:false},
        {task:"Monitor delay rate — target: <5% within 7 days",owner:"Analytics",done:false},
      ];

  return (
    <div className="space-y-6">
      <Card>
        <ST icon={Zap} color="#ff5f57">{isCustom ? "ML-Generated Action Ticket" : "Critical Action Ticket"}</ST>
        <div className="p-5 rounded-2xl bg-[#ff5f57]/06 border border-[#ff5f57]/25">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="text-[10px] text-white/40 font-mono uppercase mb-1">{isCustom ? `ML-ACT-${inv?._id?.toUpperCase() || "CUSTOM"}` : "ACT-2024-0821-001"}</div>
              <h4 className="text-lg font-bold text-white">
                {isCustom ? `Investigate impact of '${primaryDriver}' on ${targetCol}` : "Investigate North-Region Logistics Partners"}
              </h4>
              <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
                {isCustom
                  ? `ML pipeline identified '${primaryDriver}' as the #1 SHAP driver causing a ${pctChange > 0 ? "+" : ""}${pctChange}% movement in ${targetCol}. ${recommendations[0]?.reasoning || ""} Validate the model findings with domain experts before making operational changes.`
                  : "Audit third-party logistics partners in North region. Review SLA compliance, identify breach patterns, enforce penalties, negotiate emergency capacity agreements."}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0`} style={{background:(severity==="HIGH"?"#ff5f57":severity==="MEDIUM"?"#febc2e":"#28c840")+"20",color:severity==="HIGH"?"#ff5f57":severity==="MEDIUM"?"#febc2e":"#28c840"}}>{severity}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
            {[
              {label:"Owner", value:recommendations[0]?.owner||"Operations", color:"#00d2ff"},
              {label:"Priority", value:recommendations[0]?.priority||"HIGH", color:"#ff5f57"},
              {label:"Model R²", value:isCustom?(cd.mlMetrics?.r2Score??"-"):"87% conf.", color:"#febc2e"},
              {label:"Rows Analyzed", value:isCustom?(cd.mlMetrics?.totalRows||"-"):"$3.8M impact", color:"#28c840"},
            ].map(f=>(
              <div key={f.label}>
                <div className="text-white/40 uppercase text-[9px]">{f.label}</div>
                <div className="font-bold mt-0.5" style={{color:f.color}}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <ST icon={Activity} color="#00d2ff">Workflow Simulation — Click stages to advance</ST>
        <div className="relative mt-2">
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-white/10"><div className="h-full bg-[#00d2ff] transition-all duration-700" style={{width:`${(step/(wf.length-1))*100}%`}}/></div>
          <div className="grid grid-cols-4 gap-2 relative">
            {wf.map((s,i)=>{const Icon=s.icon;const done=i<=step;return(
              <button key={s.label} onClick={()=>setStep(i)} className="flex flex-col items-center gap-2 text-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${done?"border-[#00d2ff] bg-[#00d2ff]/15":"border-white/20 bg-white/5"}`}><Icon className="w-5 h-5" style={{color:done?s.color:"rgba(255,255,255,0.3)"}}/></div>
                <div className={`text-[11px] font-semibold ${done?"text-white":"text-white/30"}`}>{s.label}</div>
                <div className={`text-[10px] hidden sm:block leading-relaxed ${done?"text-white/55":"text-white/20"}`}>{s.desc}</div>
              </button>
            );})}
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white/60">Current: <span className="font-bold text-[#00d2ff]">{wf[step].label}</span> — {wf[step].desc}</div>
      </Card>

      <Card>
        <ST icon={CheckCircle2} color="#28c840">{isCustom ? "ML-Derived Action Checklist" : "Sub-Action Checklist"}</ST>
        <div className="space-y-2">
          {actionItems.map((item,i)=>(
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${item.done?"bg-[#28c840]/05 border-[#28c840]/25":"bg-white/[0.03] border-white/[0.06]"}`}>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${item.done?"bg-[#28c840] border-[#28c840]":"border-white/30"}`}>{item.done&&<div className="w-1.5 h-1.5 rounded-full bg-white"/>}</div>
              <span className={`text-xs flex-1 ${item.done?"text-white/40 line-through":"text-white/80"}`}>{item.task}</span>
              <span className="text-[10px] text-white/30 shrink-0">{item.owner}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Stage registry ─── */
const STAGES = {
  "01": {num:"01",title:"Dashboard",subtitle:"What Happened?",color:"#ff5f57",Component:Stage01,summary:"Overview of the detected KPI anomaly, key metrics, and ML-identified feature drivers."},
  "02": {num:"02",title:"Investigation",subtitle:"Where Did It Happen?",color:"#00d2ff",Component:Stage02,summary:"Root cause decomposition chain — SHAP attribution hierarchy showing which features drove the observed movement."},
  "03": {num:"03",title:"Evidence",subtitle:"What Evidence Do We Have?",color:"#6366f1",Component:Stage03,summary:"ML SHAP signal matrix. Each signal ranked by feature importance and classified by causal status."},
  "04": {num:"04",title:"Recommendation",subtitle:"Why Is This Happening?",color:"#28c840",Component:Stage04,summary:"Hypothesis probability ranking. ML-generated recommendations and interactive recovery simulation."},
  "05": {num:"05",title:"Action",subtitle:"What Should We Do Next?",color:"#febc2e",Component:Stage05,summary:"ML-derived action tickets and checklist generated from top SHAP drivers in your uploaded dataset."},
};
const ORDER = ["01","02","03","04","05"];

export default function StageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stage = STAGES[id];
  const [customData, setCustomData] = useState(null);
  const [loadingCustom, setLoadingCustom] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(window.location.search);
    const customId = searchParams.get('customId');
    if (customId) {
      setLoadingCustom(true);
      api.getInvestigation(customId)
        .then(res => { setCustomData(res); setLoadingCustom(false); })
        .catch(err => { console.error("Error fetching custom dataset investigation:", err); setLoadingCustom(false); });
    }
  }, [id]);

  if (!stage) return (
    <div className="flex items-center justify-center h-full text-white/50">
      Stage not found. <Link to="/dashboard" className="ml-2 text-[#00d2ff] underline">Back</Link>
    </div>
  );

  const idx = ORDER.indexOf(id);
  const prevId = ORDER[idx - 1];
  const nextId = ORDER[idx + 1];
  const { Component } = stage;
  const customIdParam = customData?.investigation?._id ? `?customId=${customData.investigation._id}` : '';

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top nav */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={()=>navigate("/dashboard")} className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4"/>Back to Intelligence Canvas
        </button>
        <div className="flex items-center gap-1.5">
          {ORDER.map(sid=>(
            <button key={sid} onClick={()=>navigate(`/stage/${sid}${customIdParam}`)} className="w-7 h-7 rounded-lg text-[11px] font-bold transition-all" style={sid===id?{background:STAGES[sid].color+"33",color:STAGES[sid].color}:{background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.3)"}}>
              {sid}
            </button>
          ))}
        </div>
      </div>

      {/* Custom dataset banner */}
      {customData && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-purple-950/60 border border-cyan-500/30">
          <Database className="w-4 h-4 text-cyan-400 shrink-0"/>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-cyan-300">{customData.datasetName}</span>
            <span className="text-[10px] text-white/40 ml-2">Custom ML Investigation · {customData.mlMetrics?.totalRows} rows · R² {customData.mlMetrics?.r2Score}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-bold border border-cyan-500/30 shrink-0">LIVE ML DATA</span>
        </div>
      )}

      {/* Stage header card */}
      <motion.div key={id} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4,ease:[0.22,1,0.36,1]}} className="bg-[#12131e] border rounded-3xl p-6 sm:p-8 shadow-lg" style={{borderColor:stage.color+"40"}}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2.5 rounded-2xl font-mono font-black text-2xl" style={{background:stage.color+"22",color:stage.color}}>{stage.num}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stage.title}</h1>
              <p className="text-sm text-white/50 mt-0.5">{stage.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {prevId&&<button onClick={()=>navigate(`/stage/${prevId}${customIdParam}`)} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"><ArrowLeft className="w-4 h-4"/></button>}
            {nextId&&(<button onClick={()=>navigate(`/stage/${nextId}${customIdParam}`)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90" style={{background:STAGES[nextId].color+"20",borderColor:STAGES[nextId].color+"50",color:STAGES[nextId].color}}><span>Next: {STAGES[nextId].title}</span><ArrowRight className="w-4 h-4"/></button>)}
          </div>
        </div>
        <p className="text-sm text-white/60 mt-4 leading-relaxed max-w-3xl">{stage.summary}</p>
      </motion.div>

      {/* Stage content — pass customData to component */}
      {loadingCustom ? (
        <div className="flex items-center justify-center h-40 text-white/40 text-sm animate-pulse">Loading ML investigation data…</div>
      ) : (
        <motion.div key={`c-${id}`} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.4}}>
          <Component cd={customData}/>
        </motion.div>
      )}

      {/* Bottom pagination */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        {prevId ? <button onClick={()=>navigate(`/stage/${prevId}${customIdParam}`)} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><ArrowLeft className="w-4 h-4"/>{STAGES[prevId].title}</button> : <div/>}
        <button onClick={()=>navigate("/dashboard")} className="text-xs text-white/30 hover:text-white transition-colors">Canvas Overview</button>
        {nextId ? <button onClick={()=>navigate(`/stage/${nextId}${customIdParam}`)} className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{color:STAGES[nextId].color}}>{STAGES[nextId].title}<ArrowRight className="w-4 h-4"/></button> : <div/>}
      </div>
    </div>
  );
}
