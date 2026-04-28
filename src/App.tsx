/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  RefreshCw, 
  Zap, 
  Info,
  FileText,
  TrendingUp,
  Download,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Database,
  History,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { generateSampleData, runSimulation } from './lib/simulation';
import { Candidate, FairnessAnalysis, AuditReport, Step, User } from './types';
import { cn, formatPercent } from './lib/utils';
import { FileUpload } from './components/FileUpload';
import { Glossary } from './components/Glossary';
import { AuthPage } from './components/AuthPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isMitigationEnabled, setIsMitigationEnabled] = useState(false);
  const [activeResults, setActiveResults] = useState<Candidate[]>([]);
  const [analysis, setAnalysis] = useState<FairnessAnalysis | null>(null);
  
  // State for comparison
  const [biasedAnalysis, setBiasedAnalysis] = useState<FairnessAnalysis | null>(null);
  const [biasedResults, setBiasedResults] = useState<Candidate[]>([]);
  
  const [report, setReport] = useState<AuditReport | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>('biased');
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Initialize data
  useEffect(() => {
    handleResetData();
  }, []);

  // Run initial biased simulation and store as baseline when candidates change
  useEffect(() => {
    if (candidates.length === 0) return;
    
    // Always calculate biased baseline first
    const baseline = runSimulation(candidates, false);
    setBiasedResults(baseline.results);
    setBiasedAnalysis(baseline.analysis);
    
    // Then set the current view based on mitigation toggle
    if (!isMitigationEnabled) {
      setActiveResults(baseline.results);
      setAnalysis(baseline.analysis);
    } else {
      const fair = runSimulation(candidates, true);
      setActiveResults(fair.results);
      setAnalysis(fair.analysis);
    }
  }, [candidates, isMitigationEnabled]);

  const handleResetData = () => {
    const data = generateSampleData(40);
    setCandidates(data);
    setIsMitigationEnabled(false);
    setCurrentStep('biased');
  };

  const runFullSimulation = async () => {
    setIsDemoRunning(true);
    setCurrentStep('biased');
    await new Promise(r => setTimeout(r, 1500));
    setCurrentStep('detection');
    await new Promise(r => setTimeout(r, 2000));
    setIsMitigationEnabled(true);
    setCurrentStep('mitigation');
    await new Promise(r => setTimeout(r, 2000));
    setCurrentStep('compare');
    setIsDemoRunning(false);
  };

  const handleGenerateReport = () => {
    if (!analysis) return;

    const newReport: AuditReport = {
      timestamp: new Date().toLocaleString(),
      anyBiasDetected: analysis.anyBiasDetected,
      summary: analysis.anyBiasDetected 
        ? "Audited outcomes show significant adverse impact on specific demographic groups. Remediation recommended."
        : "Audited model demonstrates statistical parity within international compliance guidelines.",
      actionTaken: isMitigationEnabled 
        ? "Bias Mitigation V2: Feature neutralization and threshold recalibration applied." 
        : "None: Baseline auditing session.",
      analysis: analysis,
    };
    setReport(newReport);
  };

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'biased', label: 'Biased Results', icon: Database },
    { id: 'detection', label: 'Bias Detection', icon: ShieldAlert },
    { id: 'mitigation', label: 'Mitigation', icon: Zap },
    { id: 'compare', label: 'Comparison', icon: LayoutDashboard },
  ];

  const handleApplyFix = () => {
    setIsMitigationEnabled(true);
    setCurrentStep('mitigation');
  };

  const nextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0a0a] text-[#e5e7eb] font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-xl font-serif italic text-[#d4af37] tracking-wide flex items-center gap-2">
              FairDecide™ 
            </h1>
            <p className="text-[10px] uppercase font-sans not-italic text-white/40 tracking-[0.2em] font-bold">
              Governance Suite
            </p>
          </div>
          
          <nav className="hidden lg:flex items-center gap-4 border-l border-white/10 pl-6 h-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isPast = steps.findIndex(s => s.id === currentStep) > i;
              return (
                <React.Fragment key={step.id}>
                  <button 
                    onClick={() => setCurrentStep(step.id)}
                    className={cn(
                      "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                      isActive ? "text-[#d4af37]" : isPast ? "text-white/60" : "text-white/20 hover:text-white/40"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center border",
                      isActive ? "border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]" : isPast ? "border-white/20 text-white/40" : "border-white/5 text-white/10"
                    )}>
                      {isPast ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Icon className="w-2.5 h-2.5" />}
                    </div>
                    {step.label}
                  </button>
                  {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-white/5" />}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-0.5">{user.username}</p>
            <p className="text-[10px] font-mono text-[#d4af37]">{user.email}</p>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white/80 transition-all"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-6 md:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-12 gap-8"
          >
            {/* Step content starts here */}
            
            {currentStep === 'biased' && (
              <>
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif italic text-white/90">Baseline Analysis</h2>
                    <p className="text-sm text-white/40 leading-relaxed italic">
                      "Training data represents past human decisions. If previous recruitment cycles favored specific groups, the AI model codifies these preferences as merit."
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-6">Source Controls</h3>
                    <FileUpload onDataLoaded={(data) => {
                      setCandidates(data);
                      setIsMitigationEnabled(false);
                    }} />
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <button 
                        onClick={handleResetData}
                        className="w-full py-2 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all text-white/40 hover:text-[#d4af37] flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Reset Data
                      </button>
                      <button 
                        onClick={runFullSimulation}
                        disabled={isDemoRunning}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <Zap className="w-3 h-3 fill-current" />
                        Run Full Bias Simulation
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                       <Info className="w-3 h-3 text-red-400" />
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-400">Real-World Case</h4>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed italic">
                      Amazon's historical AI hiring tool favored male candidates for technical roles because it was trained on 10 years of resumes that were predominantly from men.
                    </p>
                  </div>

                  <Glossary />
                </div>
                <div className="col-span-12 lg:col-span-8 bg-white/5 border border-white/10 rounded-sm overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Biased Results (Unfiltered)</h3>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Current system state reproducing historical patterns</p>
                    </div>
                    <div className="flex gap-4">
                       <span className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Bias Likely
                       </span>
                    </div>
                  </div>
                  <div className="flex-grow overflow-x-auto">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-[#0a0a0a] text-white/40 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">Candidate</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">Profile</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">AI Score</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em] text-right">Decision</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeResults.slice(0, 12).map((c) => (
                          <tr key={c.id} className="hover:bg-white/5 transition-all">
                            <td className="px-6 py-4 font-bold text-white/80">{c.name}</td>
                            <td className="px-6 py-4 flex flex-wrap gap-2">
                              <span className="px-2 py-0.5 bg-white/5 rounded-sm text-white/40">{c.gender}</span>
                              <span className="px-2 py-0.5 bg-white/5 rounded-sm text-white/40">{c.region}</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-white/60">{(c.score || 0).toFixed(1)}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={cn(
                                "px-3 py-1 rounded-sm font-black uppercase text-[9px] tracking-widest",
                                c.selected ? "bg-red-400/10 text-red-400 border border-red-400/20" : "bg-white/5 text-white/20"
                              )}>
                                {c.selected ? "Selected" : "Declined"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-8 border-t border-white/10 flex justify-between items-center bg-black/40">
                    <p className="text-xs text-white/40 italic">Scroll through the table to see how specific groups are being excluded.</p>
                    <button 
                      onClick={nextStep}
                      className="px-8 py-3 bg-[#d4af37] text-black font-black uppercase text-[10px] tracking-[0.3em] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#d4af37]/10 flex items-center gap-3 group"
                    >
                      Analyze Bias
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'detection' && (
              <>
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div>
                    <h2 className="text-3xl font-serif italic text-white/90">Statistical Audit</h2>
                    <p className="text-sm text-white/40 mt-4 leading-relaxed">
                      "We evaluate demographic parity using the 'Impact Ratio'. A score below 0.8 signifies substantial adverse impact against a protected group."
                    </p>
                    <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-sm">
                      <p className="text-[10px] text-[#d4af37] uppercase font-bold tracking-widest mb-1 group relative cursor-help">
                        What is Impact Ratio?
                        <span className="hidden group-hover:block absolute top-full left-0 w-64 bg-black border border-white/20 p-3 mt-2 z-50 normal-case font-normal text-white/60 text-[9px] leading-relaxed shadow-2xl rounded-sm">
                          Impact Ratio compares selection rates between different groups. If the selection rate of a minority group is less than 80% of the majority group, bias is likely present.
                        </span>
                      </p>
                      <p className="text-[11px] text-white/40 italic leading-relaxed">
                        It measures the fairness of outcomes across different demographic populations.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-6">Multi-Attribute Summary</h3>
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/10">
                              <th className="pb-3">Attribute</th>
                              <th className="pb-3">Impact Ratio</th>
                              <th className="pb-3 text-right">Bias?</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {analysis && Object.entries(analysis.attributes).map(([key, attr]) => (
                             <tr key={key} className="text-[10px]">
                               <td className="py-3 font-bold text-white/60 capitalize">{key}</td>
                               <td className="py-3 font-mono">{(attr as any).impactRatio.toFixed(2)}</td>
                               <td className={cn(
                                 "py-3 text-right font-black",
                                 (attr as any).biasDetected ? "text-red-400" : "text-green-400"
                               )}>
                                 {(attr as any).biasDetected ? "YES" : "NO"}
                               </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  
                  <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-sm">
                    <p className="text-[10px] text-blue-300 leading-relaxed italic">
                      "Education is analyzed as a contextual feature and may introduce indirect bias, but it is not treated as a protected attribute."
                    </p>
                  </div>
                </div>
                
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis && Object.entries(analysis.attributes).map(([key, attr]) => {
                      const attribute = attr as any;
                      return (
                        <motion.div 
                          key={key} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "p-6 rounded-sm border transition-all",
                            attribute.biasDetected ? "bg-white/5 border-red-500/20 shadow-xl shadow-red-500/5" : "bg-white/5 border-white/10"
                          )}
                        >
                          <div className="flex justify-between items-start mb-6">
                             <div>
                               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-[#d4af37]">{key} Disparity</h3>
                               <p className="text-[9px] text-white/30 mt-1 uppercase tracking-widest">Selection Rates per Group</p>
                             </div>
                             <div className="group relative cursor-help">
                               <span className={cn(
                                 "text-[9px] font-bold px-2 py-0.5 rounded-sm",
                                 attribute.biasDetected ? "bg-red-400/10 text-red-400 border border-red-400/20" : "bg-green-400/10 text-green-400 border border-green-400/20"
                               )}>
                                 {attribute.biasDetected ? "BIASED" : "NORMATIVE"}
                               </span>
                               <span className="hidden group-hover:block absolute bottom-full right-0 w-48 bg-black border border-white/20 p-2 mb-2 z-50 normal-case font-normal text-white/60 text-[9px] leading-relaxed shadow-2xl rounded-sm">
                                 {attribute.biasDetected 
                                   ? "Unfair difference in outcomes detected between groups for this attribute."
                                   : "Outcomes for this attribute are within acceptable fairness thresholds."}
                               </span>
                             </div>
                          </div>

                          <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={attribute.groups}>
                                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="selectionRate" fill="#d4af37" radius={[1, 1, 0, 0]} barSize={40}>
                                  {attribute.groups.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={attribute.biasDetected && entry.name === attribute.disadvantagedGroup ? '#f87171' : '#d4af37'} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                          <p className="text-[9px] text-white/30 mt-4 italic text-center">
                            Unequal selection rates indicate potential bias caused by patterns in historical data.
                          </p>
                          
                          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-end">
                             <div>
                               <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Impact Ratio</p>
                               <p className={cn("text-2xl font-serif mt-1", attribute.biasDetected ? "text-red-400" : "text-white")}>
                                 {attribute.impactRatio.toFixed(2)}
                               </p>
                             </div>
                             <div className="text-right">
                               <p className="text-[9px] text-white/20 italic mb-1 uppercase tracking-widest">Compliance limit: 0.80</p>
                               <p className="text-[10px] text-white/40 uppercase font-black">Fairness: {Math.round(attribute.impactRatio * 100)}%</p>
                             </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between items-center bg-black/40 p-8 border border-white/10">
                    <button 
                      onClick={prevStep}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button 
                      onClick={handleApplyFix}
                      className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-black uppercase text-[10px] tracking-[0.3em] transition-all flex items-center gap-3 shadow-xl shadow-red-500/10"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Mitigate Algorithmic Bias
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'mitigation' && (
              <>
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div>
                    <h2 className="text-3xl font-serif italic text-[#d4af37]">Remediation Active</h2>
                    <p className="text-sm text-white/40 mt-4 leading-relaxed">
                      "We have neutralized weights for protected variables. The model now prioritizes skills and experience over historical group correlation."
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
                     <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400 mb-6">What Changed?</h3>
                     <div className="space-y-6">
                        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                           <span className="text-[10px] text-white/40 uppercase">Candidates Newly Selected</span>
                           <span className="text-lg font-serif text-green-400">
                             {activeResults.filter((c, i) => c.selected && !biasedResults[i]?.selected).length}
                           </span>
                        </div>
                        <div className="flex justify-between items-baseline border-b border-white/5 pb-3">
                           <span className="text-[10px] text-white/40 uppercase">Candidates Removed (Redundant Bias)</span>
                           <span className="text-lg font-serif text-red-400">
                             {activeResults.filter((c, i) => !c.selected && biasedResults[i]?.selected).length}
                           </span>
                        </div>
                        <div className="flex justify-between items-baseline">
                           <span className="text-[10px] text-white/40 uppercase">Fairness Improvement</span>
                           <span className="text-lg font-serif text-blue-400">
                             +{(analysis && biasedAnalysis ? analysis.overall.fairnessScore - biasedAnalysis.overall.fairnessScore : 0).toFixed(0)}%
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-green-950/20 border border-green-500/40 p-6 rounded-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold uppercase tracking-widest text-green-400 text-xs">Fairness Locked</h3>
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed border-l border-green-500/20 pl-4 py-1 italic">
                      Outcome metrics show that group-based selection disparities have been compressed below compliant thresholds.
                    </p>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-8 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="absolute inset-x-0 h-1 bg-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.3)] animate-pulse z-10" />
                  <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-green-400">Fair Selection Outcomes</h3>
                      <p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">Status changed? See highlighted rows</p>
                    </div>
                    <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest border border-green-500/30 px-3 py-1 rounded-sm bg-green-500/5">
                      Compliance V2: ACTIVE
                    </span>
                  </div>
                  <div className="flex-grow overflow-x-auto">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-[#0a0a0a] text-white/40 sticky top-0">
                        <tr>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">Candidate</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">Change Impact</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em]">Final AI Score</th>
                          <th className="px-6 py-4 font-bold uppercase tracking-[0.1em] text-right">Fair Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {activeResults.slice(0, 12).map((c, i) => {
                          const wasSelected = biasedResults[i]?.selected;
                          const isNowSelected = c.selected;
                          const changed = wasSelected !== isNowSelected;
                          
                          return (
                            <tr key={c.id} className={cn(
                              "transition-all",
                              changed ? "bg-green-500/5 hover:bg-green-500/10" : "hover:bg-white/5"
                            )}>
                              <td className="px-6 py-4">
                                <p className="font-bold text-white/80">{c.name}</p>
                                <p className="text-[9px] text-white/20">{c.gender} · {c.region}</p>
                              </td>
                              <td className="px-6 py-4">
                                {changed ? (
                                  <span className={cn(
                                    "flex items-center gap-1 font-bold italic",
                                    isNowSelected ? "text-green-400" : "text-red-400"
                                  )}>
                                    {isNowSelected ? "↑ Promoted" : "↓ Deprioritized"}
                                  </span>
                                ) : (
                                  <span className="text-white/20 italic">No change</span>
                                )}
                              </td>
                              <td className="px-6 py-4 font-mono text-white/60">{(c.score || 0).toFixed(1)}</td>
                              <td className="px-6 py-4 text-right">
                                <span className={cn(
                                  "px-3 py-1 rounded-sm font-black uppercase text-[9px] tracking-widest",
                                  c.selected ? "bg-green-400/10 text-green-400 border border-green-400/20 shadow-lg shadow-green-500/5" : "bg-white/5 text-white/20"
                                )}>
                                  {c.selected ? "Accepted" : "Declined"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-8 border-t border-white/10 flex justify-between items-center bg-black/40">
                    <button 
                      onClick={prevStep}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Detection
                    </button>
                    <button 
                      onClick={nextStep}
                      className="px-10 py-4 bg-[#d4af37] text-black font-black uppercase text-[10px] tracking-[0.3em] hover:-translate-y-0.5 transition-all flex items-center gap-3 group"
                    >
                      View Improvements
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'compare' && (
              <div className="col-span-12 space-y-12">
                <div className="text-center max-w-3xl mx-auto space-y-6">
                  <h2 className="text-4xl font-serif italic text-green-400">Fairness Optimization Complete</h2>
                  <p className="text-sm text-white/40 italic leading-relaxed">
                    "We have successfully mitigated historical selection bias. The system now demonstrates verifiable improvement in statistical parity across all protected demographics."
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white/5 border border-white/10 p-8 rounded-sm text-center relative group overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                         <Info className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Original State</p>
                      <p className="text-[11px] font-bold text-red-400 uppercase tracking-widest mb-6">Bias Detected</p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-white/60 mb-1">Impact Ratio</p>
                          <p className="text-3xl font-serif text-white">{(biasedAnalysis?.attributes.gender as any)?.impactRatio.toFixed(2) || '0.38'}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-xs text-white/60 mb-1">Fairness Score</p>
                          <p className="text-3xl font-serif text-red-500">{biasedAnalysis?.overall.fairnessScore || 38}</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-white/5 border border-[#d4af37]/30 p-8 rounded-sm text-center relative group overflow-hidden shadow-2xl shadow-[#d4af37]/5">
                      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                         <Info className="w-4 h-4 text-[#d4af37]" />
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Mitigated State</p>
                      <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-6">System Fairer</p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-white/60 mb-1">Impact Ratio</p>
                          <p className="text-3xl font-serif text-white">{(analysis?.attributes.gender as any)?.impactRatio.toFixed(2) || '0.92'}</p>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-xs text-white/60 mb-1">Fairness Score</p>
                          <p className="text-3xl font-serif text-green-500">{analysis?.overall.fairnessScore || 92}</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-[#d4af37]/10 border border-[#d4af37]/20 p-8 rounded-sm text-center relative flex flex-col justify-center gap-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-black mb-1">Net Gain</p>
                        <p className="text-5xl font-serif text-[#d4af37]">
                          +{(analysis && biasedAnalysis ? analysis.overall.fairnessScore - biasedAnalysis.overall.fairnessScore : 0).toFixed(0)}%
                        </p>
                        <p className="text-[10px] text-[#d4af37]/60 uppercase font-black mt-2">Overall Improvement</p>
                      </div>
                      <div className="pt-6 border-t border-[#d4af37]/10 grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[9px] text-[#d4af37]/40 uppercase mb-1">Bias Reduced</p>
                           <p className="text-xs font-bold text-[#d4af37]">YES</p>
                        </div>
                        <div>
                           <p className="text-[9px] text-[#d4af37]/40 uppercase mb-1">Status</p>
                           <p className="text-xs font-bold text-green-400">FAIRER</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-8">Executive Conclusion</h3>
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Bias Detected</p>
                         <p className="text-sm font-serif italic text-white/80">{biasedAnalysis?.anyBiasDetected ? "Significant" : "Minimal"}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Affected Attributes</p>
                         <p className="text-sm font-serif italic text-white/80">Gender, Region, Age</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Improvement Code</p>
                         <p className="text-sm font-mono text-white/80">RECAL_OPTIM_V2</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mb-2">Safety Rating</p>
                         <p className="text-sm font-black text-green-400">GOLD CERTIFIED</p>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col items-center gap-8 pt-12">
                   <button 
                     onClick={handleGenerateReport}
                     className="px-16 py-5 bg-[#d4af37] text-black font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#c4a030] transition-all flex items-center gap-4 shadow-2xl shadow-[#d4af37]/20"
                   >
                     <FileText className="w-5 h-5" />
                     Generate Final Audit Report
                   </button>
                   <div className="flex items-center gap-12 text-[10px] text-white/10 uppercase tracking-[0.6em] font-bold">
                      <span className="hover:text-white/40 transition-colors">EEOC SEC 1607</span>
                      <span className="hover:text-white/40 transition-colors">GDPR ART 22</span>
                      <span className="hover:text-white/40 transition-colors">EU AI ACT TITLE III</span>
                   </div>
                </div>
              </div>
            )}

            {/* Step content ends here */}
          </motion.div>
        </AnimatePresence>

        {/* Audit Report Modal Backdrop */}
        <AnimatePresence>
          {report && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReport(null)}
                className="absolute inset-0 bg-neutral-900/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-[#111] w-full max-w-2xl rounded-sm border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
              >
                <div className="bg-[#d4af37] text-black p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" />
                    <div>
                      <h3 className="text-xl font-serif italic font-bold">Audit Certificate</h3>
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">FairDecide Governance Logs</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReport(null)}
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8 text-white">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-sm bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        {report.anyBiasDetected ? (
                          <span className="text-red-400 font-bold uppercase text-xs">Failure</span>
                        ) : (
                          <span className="text-green-400 font-bold uppercase text-xs">Compliance Pass</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 rounded-sm bg-white/5 border border-white/10">
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Timestamp</p>
                      <span className="text-white/80 font-mono text-[10px]">{report.timestamp}</span>
                    </div>
                  </div>

                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-4">Executive Summary</h4>
                    <p className="text-xs text-white/60 leading-relaxed italic border-l-2 border-[#d4af37] pl-4 py-1">
                      "{report.summary}"
                    </p>
                  </section>

                  <section>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d4af37] mb-4">Intervention Strategy</h4>
                    <p className="text-xs text-white/60 leading-relaxed font-mono">
                      {report.actionTaken}
                    </p>
                  </section>

                  <section className="bg-white/5 rounded-sm p-6 border border-white/10">
                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Verified Metrics Snapshot</h4>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-[9px] text-white/30 mb-1 uppercase">Sample Size</p>
                        <p className="text-xl font-serif text-white">{report.analysis.overall.total}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/30 mb-1 uppercase">Selection</p>
                        <p className="text-xl font-serif text-blue-400">{report.analysis.overall.selected}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/30 mb-1 uppercase">Pass Code</p>
                        <p className="text-xl font-serif text-[#d4af37]">099-FD</p>
                      </div>
                    </div>
                  </section>

                  <div className="flex gap-4 pt-4">
                    <button className="flex-1 bg-white text-black font-black uppercase text-[10px] py-4 rounded-sm hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Sign & Export Audit
                    </button>
                    <button 
                      onClick={() => setReport(null)}
                      className="flex-1 border border-white/10 text-white/40 font-bold uppercase text-[10px] py-4 rounded-sm hover:bg-white/5 hover:text-white transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-12 py-6 border-t border-white/5 flex justify-between items-center text-[9px] text-white/20 uppercase tracking-[0.4em] bg-black/40">
        <p>© 2026 FairDecide Logic Corp. Global Presence.</p>
        <div className="flex gap-8">
          <span className="hover:text-white transition-colors cursor-pointer">Security Protocol 9.4</span>
          <span className="hover:text-white transition-colors cursor-pointer">Compliance Verified</span>
        </div>
      </footer>
    </div>
  );
}
