/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, BookOpen, Clock, FolderHeart, Award, Heart, TrendingUp, 
  BarChart3, RefreshCw, Upload, FileCheck, CheckCircle, Database, 
  Settings, Activity, Users, AlertTriangle, Play, HelpCircle, HardDrive
} from 'lucide-react';
import { AcademicResource } from '../types';

interface DashboardViewProps {
  activeRole: 'Student' | 'Faculty' | 'Librarian' | 'Admin';
  resources: AcademicResource[];
  onOpenResource: (resource: AcademicResource) => void;
  onAskAI: (topic: string) => void;
}

export default function DashboardView({ 
  activeRole, 
  resources, 
  onOpenResource,
  onAskAI 
}: DashboardViewProps) {
  
  // Simulated State for Librarian Ingestion
  const [ingestionStage, setIngestionStage] = useState<'idle' | 'parsing' | 'embedding' | 'indexing' | 'success'>('idle');
  const [dummyDocName, setDummyDocName] = useState('');

  const triggerMockIngestion = () => {
    if (!dummyDocName.trim()) {
      alert("Please specify a document name (e.g. 'Shor's Algorithm Analysis.pdf')");
      return;
    }
    setIngestionStage('parsing');
    setTimeout(() => {
      setIngestionStage('embedding');
      setTimeout(() => {
        setIngestionStage('indexing');
        setTimeout(() => {
          setIngestionStage('success');
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleResetIngestedStage = () => {
    setIngestionStage('idle');
    setDummyDocName('');
  };

  // --- 1. STUDENT VIEW ---
  const renderStudentDashboard = () => {
    const recentQueries = [
      "self-attention bottlenecks in transformers",
      "Retrieval Augmented Generation models",
      "CRISPR Cas9 therapeutic ethical guidelines"
    ];

    const currentSaved = [resources[0], resources[2], resources[4]];

    return (
      <div className="space-y-6" id="student-dashboard-body">
        
        {/* Profile Card & Progress summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="md:col-span-1 rounded-xl border border-zinc-200 bg-white p-5 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-700 font-bold border-2 border-blue-200 flex items-center justify-center text-xl shadow-inner">
              SC
            </div>
            <h3 className="text-base font-bold text-zinc-900 mt-3">Sarah Connor</h3>
            <span className="text-[10px] text-zinc-400 font-sans tracking-wide block uppercase font-mono">B.Sc. Computer Science</span>
            <div className="mt-4 pt-4 border-t border-zinc-100 w-full flex items-center justify-around text-center text-xs">
              <div>
                <span className="font-bold text-zinc-800 block">4.0</span>
                <span className="text-[10px] text-zinc-400 font-medium">Research GPA</span>
              </div>
              <div className="border-l border-zinc-100 h-8"></div>
              <div>
                <span className="font-bold text-zinc-800 block">12</span>
                <span className="text-[10px] text-zinc-400 font-medium font-mono">Indexed Books</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5Under">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Active Reading Progression
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Transformer Foundations (Natural Language representation)</span>
                    <span className="text-blue-600 font-mono">82% Completed</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-700">Quantum Complexity and Polynomial Limits</span>
                    <span className="text-purple-600 font-mono">25% Completed</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 mt-6 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-zinc-400">Total session hours logged: <strong className="text-zinc-655 font-mono">48.2 hrs</strong></span>
              <button 
                onClick={() => onAskAI("Explain the self-attention mechanism in Transformers simply.")}
                className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 font-mono text-[11px]"
              >
                Launch AI seminar on active reading topics &rarr;
              </button>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Saved Reading index */}
          <div className="md:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <FolderHeart className="h-4 w-4 text-pink-500" />
              My Saved Reading Collections
            </h3>
            <div className="divide-y divide-zinc-100">
              {currentSaved.map((res) => (
                <div key={res.id} className="py-3 flex items-center justify-between gap-4 last:pb-0" id={`student-saved-row-${res.id}`}>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 hover:text-blue-600 cursor-pointer" onClick={() => onOpenResource(res)}>
                      {res.title}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">By {res.authors[0]} et al. • Doi: {res.doi}</p>
                  </div>
                  <button 
                    onClick={() => onOpenResource(res)}
                    className="rounded border border-zinc-200 hover:bg-zinc-50 px-2 py-1 text-[10px] font-bold text-zinc-600"
                  >
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent search queries */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-zinc-400" />
              Recent Semantic Queries
            </h3>
            <div className="space-y-2">
              {recentQueries.map((query, i) => (
                <div 
                  key={i} 
                  id={`recent-query-student-${i}`}
                  className="rounded bg-zinc-50 p-2.5 text-xs text-zinc-650 font-medium hover:bg-zinc-100 cursor-pointer font-sans transition-colors"
                  onClick={() => onAskAI(query)}
                >
                  <span className="truncate block">&ldquo;{query}&rdquo;</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    );
  };

  // --- 2. FACULTY VIEW ---
  const renderFacultyDashboard = () => {
    const researchTopics = [
      { topic: "Transformer architectures NLP", weight: 85, cits: "11,240 citações" },
      { topic: "Quantum Computation Textbook research", weight: 62, cits: "4,110" },
      { topic: "RAG ground limits", weight: 74, cits: "2,200" }
    ];

    return (
      <div className="space-y-6" id="faculty-dashboard-body">
        
        {/* Welcome Block */}
        <div className="rounded-xl border border-zinc-250 bg-white p-6 shadow-sm" id="faculty-welcome-card">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase">Faculty Portal</span>
              <h2 className="text-xl font-bold text-zinc-950">Welcome Back, Dr. Alistair Vance</h2>
              <p className="text-xs text-zinc-500 font-sans">
                Research Laboratory Supervisor • Department of Complex Computer Architectures
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded bg-zinc-100 border border-zinc-200 font-mono text-[10px] uppercase font-bold text-zinc-600 px-3 py-1.5">
                Lab Clearance: CLASS A
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-100 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">My Active Works</span>
              <strong className="text-xl font-bold text-zinc-900 block mt-0.5">14 Publications</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Total citations</span>
              <strong className="text-xl font-bold text-zinc-900 block mt-0.5">2,540,510</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">Co-Authors connected</span>
              <strong className="text-xl font-bold text-zinc-900 block mt-0.5">38 Faculty members</strong>
            </div>
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">H-INDEX (Local)</span>
              <strong className="text-xl font-bold text-zinc-900 block mt-0.5">54 Score</strong>
            </div>
          </div>
        </div>

        {/* Curation trends and citation networks visual simulation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              My Research Influence Network Topics
            </h3>
            <div className="space-y-4">
              {researchTopics.map((item, i) => (
                <div key={i} className="space-y-1.5" id={`faculty-topic-${i}`}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-850 truncate">{item.topic}</span>
                    <span className="text-zinc-400 font-mono font-medium">{item.cits}</span>
                  </div>
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.weight}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Cross-disciplinary Peer Citation metrics
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              The AI graph model calculates optimal proximity bounds between mechanical engineering systems (joint dampers) and computerized auto-accelerometers (CS).
            </p>
            <div className="rounded-lg bg-zinc-50 border border-zinc-150 p-4 font-mono text-[11px] text-zinc-650 space-y-1.5 shadow-inner">
              <div className="flex justify-between">
                <span>RESONANCE COEFFICIENT:</span>
                <strong className="text-zinc-800">0.9412</strong>
              </div>
              <div className="flex justify-between">
                <span>EVALUATION SAMPLE COUNT:</span>
                <strong className="text-zinc-800">2,450 documents</strong>
              </div>
              <div className="flex justify-between">
                <span>GRAPH COVERAGE RATIO:</span>
                <span className="text-emerald-600 font-bold">100.0% SECURE</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  };

  // --- 3. LIBRARIAN VIEW ---
  const renderLibrarianDashboard = () => {
    return (
      <div className="space-y-6" id="librarian-dashboard-body">
        
        {/* Welcome & Metadata Quality dial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase">Librarian Operations</span>
              <h2 className="text-base font-bold text-zinc-950">Ingestion Pipeline & Catalog Integrity</h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Approve, classify, tokenise, and parse incoming electronic theses and books into dense vector embeddings immediately.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-zinc-100 text-center">
              <div>
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight block">Dataset Health</span>
                <span className="text-xs font-extrabold text-emerald-600 block">99.8% Perfect</span>
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight block">Queue Limit</span>
                <span className="text-xs font-extrabold text-zinc-800 block">0 Pending</span>
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-tight block">API Rate</span>
                <span className="text-xs font-extrabold text-zinc-800 block">45 req/s</span>
              </div>
            </div>
          </div>

          {/* Quality Indicator Cards */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono block">Metadata Integrity Dial</span>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight mt-1">98.4 / 100</h3>
              <p className="text-xs text-zinc-505 mt-1 leading-normal">
                Determines completeness of tags, cross-referenced author indexes, DOI checks, and parsed abstract summaries.
              </p>
            </div>
            <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mt-4">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: '98.4%' }}></div>
            </div>
          </div>

        </div>

        {/* Dynamic simulator to upload incoming PDF reference */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" id="librarian-ingestion-simulation-container">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-purple-600 animate-bounce" />
            Simulate Dataset Ingestion Flow
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500">Document Reference Name</label>
                <input
                  type="text"
                  value={dummyDocName}
                  onChange={(e) => setDummyDocName(e.target.value)}
                  placeholder="e.g. Shor's Algorithm Implementation Framework.pdf"
                  className="w-full text-xs font-semibold rounded-lg border border-zinc-300 p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  id="trigger-mock-ingestion-btn"
                  onClick={triggerMockIngestion}
                  disabled={ingestionStage !== 'idle' && ingestionStage !== 'success'}
                  className="rounded bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 flex items-center gap-1 shadow-sm"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  <span>Begin Secure Ingestion</span>
                </button>
                {ingestionStage !== 'idle' && (
                  <button
                    onClick={handleResetIngestedStage}
                    className="rounded border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-650 hover:bg-zinc-50"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Ingestion progression line rendering */}
            <div className="rounded-lg bg-zinc-50 border border-zinc-150 p-4" id="ingestion-stage-tracker">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-3">Live Execution Stage Log</span>
              
              <div className="space-y-2 text-xs">
                
                {/* Stage 1: Parsing */}
                <div className="flex items-center justify-between">
                  <span className="font-sans">1. Deep PDF Text Extraction</span>
                  <span className={`font-bold font-mono ${
                    ingestionStage === 'parsing' ? 'text-amber-600 animate-pulse' :
                    (ingestionStage !== 'idle' ? 'text-emerald-600' : 'text-zinc-300')
                  }`}>
                    {ingestionStage === 'parsing' ? 'RUNNING' : (ingestionStage !== 'idle' ? 'SUCCESS' : 'PENDING')}
                  </span>
                </div>

                {/* Stage 2: Tokenizing */}
                <div className="flex items-center justify-between">
                  <span className="font-sans">2. Multi-lingual Tokenizing & Embedder</span>
                  <span className={`font-bold font-mono ${
                    ingestionStage === 'embedding' ? 'text-amber-600 animate-pulse' :
                    (ingestionStage === 'indexing' || ingestionStage === 'success' ? 'text-emerald-600' : 'text-zinc-300')
                  }`}>
                    {ingestionStage === 'embedding' ? 'RUNNING' : (ingestionStage === 'indexing' || ingestionStage === 'success' ? 'SUCCESS' : 'PENDING')}
                  </span>
                </div>

                {/* Stage 3: Indexing vector store */}
                <div className="flex items-center justify-between">
                  <span className="font-sans">3. ChromaDB Vector Space & Neo4j Graph Map</span>
                  <span className={`font-bold font-mono ${
                    ingestionStage === 'indexing' ? 'text-amber-600 animate-pulse' :
                    (ingestionStage === 'success' ? 'text-emerald-600' : 'text-zinc-300')
                  }`}>
                    {ingestionStage === 'indexing' ? 'RUNNING' : (ingestionStage === 'success' ? 'SUCCESS' : 'PENDING')}
                  </span>
                </div>

              </div>

              {ingestionStage === 'success' && (
                <div className="mt-4 border-t border-zinc-200 pt-3 text-xs text-emerald-700 flex items-center gap-1.5 font-sans" id="ingestion-success-badge">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Success: <strong>&ldquo;{dummyDocName}&rdquo;</strong> is now fully discoverable!</span>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    );
  };

  // --- 4. ADMIN VIEW (DIAGNOSTIC SYSTEM SENSORS) ---
  const renderAdminDashboard = () => {
    return (
      <div className="space-y-6" id="admin-dashboard-body">
        
        {/* Core metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="admin-system-metrics">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Active Platform Users</span>
            <strong className="text-xl font-bold text-zinc-900 block mt-1">1,240 Academic Accounts</strong>
            <span className="text-[10px] text-emerald-600 font-mono font-bold mt-0.5 inline-block">+18% growth</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Mean Request Latency</span>
            <strong className="text-xl font-bold text-zinc-900 block mt-1">124 milliseconds</strong>
            <span className="text-[10px] text-emerald-600 font-mono font-bold mt-0.5 inline-block">Healthy threshold</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Weekly Search Queries</span>
            <strong className="text-xl font-bold text-zinc-900 block mt-1">45,120 Queries</strong>
            <span className="text-[10px] text-emerald-600 font-mono font-bold mt-0.5 inline-block">84% semantic</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Err rates (RAG context)</span>
            <strong className="text-xl font-bold text-red-600 block mt-1">0.04% Error rate</strong>
            <span className="text-[10px] text-zinc-400 font-mono mt-0.5 inline-block">Sentry tracking locked</span>
          </div>
        </div>

        {/* System Health cluster & Resource indexing Growth chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="admin-analytics-grid">
          
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              Service Status Core Checklists
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <span className="font-semibold text-zinc-700">Vector Collection (ChromaDB / BGE indices)</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-0.5">ONLINE (22ms)</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <span className="font-semibold text-zinc-700">Citation Map Graph Database (Neo4j Cluster)</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-0.5">ONLINE (14ms)</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
                <span className="font-semibold text-zinc-700">Metadata Catalog storage (PostgreSQL)</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-0.5">ONLINE (8ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-700">Redis In-Memory Query Cache</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 rounded px-2 py-0.5">ONLINE (1ms)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3 flex items-center gap-1.5">
              <HardDrive className="h-4 w-4 text-blue-500" />
              Repository Growth Indices
            </h3>
            <p className="text-xs text-zinc-500 leading-normal mb-4">
              ALIS V2.0 has indexed 50,240 new scientific publications and books within Stanford and partner university networks across the current academic calendar.
            </p>
            <div className="rounded-lg bg-zinc-50 border border-zinc-150 p-4 font-mono text-xs flex justify-around text-center shadow-inner">
              <div>
                <span className="text-zinc-400 block font-medium">B.Sc. THESES</span>
                <strong className="text-sm font-extrabold text-purple-700 mt-1 block">12,450</strong>
              </div>
              <div className="border-l border-zinc-200 h-8"></div>
              <div>
                <span className="text-zinc-400 block font-medium">PUBLISHED JOURNALS</span>
                <strong className="text-sm font-extrabold text-blue-700 mt-1 block">22,140</strong>
              </div>
              <div className="border-l border-zinc-200 h-8"></div>
              <div>
                <span className="text-zinc-400 block font-medium text-amber-700">RESTRICTED VAULT</span>
                <strong className="text-sm font-extrabold text-amber-700 mt-1 block">840 papers</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  };

  // Router for dashboard based on selected role switcher!
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="unified-dashboard-wrapper">
      
      {/* Tab Header pivots depending on simulated state */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4" id="dashboard-header-toggle-tabs">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">My Workspace</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 uppercase">
            {activeRole} Intelligence Control
          </h1>
        </div>

        {/* Informational help box outlining simulation capabilities */}
        <div className="text-xs text-zinc-400 flex items-center gap-1" id="simulate-role-helper-label">
          <HelpCircle className="h-4 w-4 text-zinc-300" />
          <span>Switch roles in navbar upper corner to pivot dashboard profiles.</span>
        </div>
      </div>

      {activeRole === 'Student' && renderStudentDashboard()}
      {activeRole === 'Faculty' && renderFacultyDashboard()}
      {activeRole === 'Librarian' && renderLibrarianDashboard()}
      {activeRole === 'Admin' && renderAdminDashboard()}

    </div>
  );
}
