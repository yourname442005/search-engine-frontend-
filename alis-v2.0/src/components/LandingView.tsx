/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, Search, Server, Sparkles, Network, BookOpen, 
  HelpCircle, ChevronRight, GraduationCap, ShieldCheck, Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  onStartExploring: () => void;
  onAskAIQuery: (selectedTopic: string) => void;
}

export default function LandingView({ onStartExploring, onAskAIQuery }: LandingViewProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const stats = [
    { label: "Academic Resources", value: "500,000+", desc: "Books, papers, theses, and journals" },
    { label: "AI-Powered Q&A", value: "Real-time RAG", desc: "Attributed, fully-cited synthesis" },
    { label: "Knowledge Graph", value: "1.2M Connections", desc: "Cross-disciplinary semantic discovery" },
    { label: "Hybrid Search Speed", value: "<150 ms", desc: "Dense vectors combined with BM25 indices" }
  ];

  const steps = [
    {
      title: "1. Search Ingestion",
      short: "Search",
      icon: Search,
      description: "User submits a standard natural language query or academic reference. ALIS maps intent, extracts publication year filters, and runs multi-lingual query expansion in real-time.",
      details: "Utilizes dual-encoder models to transform text into 1024-dimensional dense vectors alongside standard BM25 lexical token matching."
    },
    {
      title: "2. Vector Retrieval",
      short: "Retrieval",
      icon: Server,
      description: "High-utility hybrid indexing over our local vector DB (ChromaDB) returns highly specialized text passage chunks instantly.",
      details: "Passages undergo Reciprocal Rank Fusion (RRF) to merge keyword matching and dense-embedded semantic similarities perfectly."
    },
    {
      title: "3. Graph Boost",
      short: "Knowledge Graph",
      icon: Network,
      description: "Applies citation density boosts. Searches relationship graphs to find parent articles, highly rated co-authors, and adjacent research papers.",
      details: "Queries citation paths to locate authoritative nodes and contextually related research topics, reducing citation blind-spots."
    },
    {
      title: "4. Grounded RAG",
      short: "RAG Q&A",
      icon: Sparkles,
      description: "Assembles source chunks into a comprehensive, aligned query prompt for Gemini AI model generation, creating fully cited context.",
      details: "Enforces strict grounding protocols so the language models synthesize facts only using indexed references, preventing hallucination."
    },
    {
      title: "5. Recommendations",
      short: "Recommendations",
      icon: BookOpen,
      description: "Updates user context vectors. Recommends cross-disciplinary journals, similar literature files, and trending topics.",
      details: "Leverages collaborative filtering combined with user's reading interest graphs to promote unexpected serendipitous discoveries."
    }
  ];

  const demoTopics = [
    "Explain the major contributions of transformer architectures in natural language processing.",
    "What is retrieval-augmented generation and how does it prevent hallucinations?",
    "Explain the foundation level introduction of quantum computation algorithms."
  ];

  return (
    <div className="bg-zinc-50 min-h-screen" id="landing-page-root">
      
      {/* Institutional Top Trust Ribbon */}
      <div className="bg-zinc-900 text-white py-2 px-4 text-center text-xs tracking-wider uppercase font-mono flex items-center justify-center gap-2" id="academy-pennant">
        <GraduationCap className="h-4 w-4 text-blue-400" />
        <span>Stanford University Institutional Intelligence Infrastructure • ALIS V2.0 Live Build</span>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white py-20 border-b border-zinc-200" id="landing-hero-container">
        {/* Abstract Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/10 mb-6">
            <Cpu className="h-3 w-3 animate-spin text-blue-600" />
            Introducing Semantic Retrieval & Attributed Reasoning
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-[1.1] mb-6" id="hero-display-title">
            Transforming University Libraries into <span className="text-blue-600 bg-blue-50/50 px-2 rounded-lg">Intelligent Knowledge Ecosystems</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 leading-relaxed mb-10" id="hero-display-subtitle">
            Search books, papers, theses, journals, and institutional knowledge using AI-powered semantic retrieval and conversational intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-16">
            <button
              id="cta-start-exploring"
              onClick={onStartExploring}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              id="cta-scroll-architecture"
              href="#alis-architecture-section"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
            >
              View Architecture
            </a>
          </div>

          {/* Quick Academic Prompts for Instant Discovery */}
          <div className="max-w-2xl mx-auto border border-zinc-150 rounded-xl bg-zinc-50/50 p-4" id="quick-prompt-links">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5 text-blue-500" />
              <span>Instant AI Seminars — Click to Ask ALIS</span>
            </div>
            <div className="flex flex-col gap-2">
              {demoTopics.map((topic, i) => (
                <button
                  key={i}
                  id={`demo-topic-btn-${i}`}
                  onClick={() => onAskAIQuery(topic)}
                  className="w-full rounded-lg bg-white border border-zinc-200 px-3.5 py-2.5 text-left text-xs text-zinc-700 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/10 transition flex items-center justify-between"
                >
                  <span className="truncate">{topic}</span>
                  <ChevronRight className="h-3 w-3 text-zinc-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10" id="landing-stats-container">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm" id={`stat-card-${i}`}>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950">{stat.value}</h3>
              <p className="mt-1 text-xs text-zinc-400 font-sans">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive System Pipeline Architecture Section */}
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8" id="alis-architecture-section">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Cognitive Pipeline</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Under the Hood: The Retrieval Lifecycle
          </h2>
          <p className="mt-4 text-sm text-zinc-500">
            Unlike simple databases, ALIS V2.0 cross-authenticates lexical indices with dense contextual models, boosting result quality with citation and relationship graphing.
          </p>
        </div>

        {/* Process Map Nodes Row */}
        <div className="mb-10 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm" id="architecture-interactive-pipeline">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 overflow-x-auto p-1">
            {steps.map((st, i) => {
              const StepIcon = st.icon;
              const isSelected = activeStep === i;
              return (
                <div key={i} className="flex-1 flex items-center" id={`pipeline-node-wrapper-${i}`}>
                  <button
                    onClick={() => setActiveStep(i)}
                    className={`flex-1 rounded-xl p-4 text-left transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10' 
                        : 'bg-zinc-50 border-zinc-100 hover:bg-zinc-100 text-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-1.5 flex justify-center items-center ${isSelected ? 'bg-white/25 text-white' : 'bg-white border border-zinc-200 text-blue-600'}`}>
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-mono font-bold block ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                          Step 0{i + 1}
                        </span>
                        <span className="text-xs font-bold leading-tight block">{st.short}</span>
                      </div>
                    </div>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center px-2 text-zinc-300">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active Step Panel */}
          <div className="mt-6 border-t border-zinc-150 pt-6 px-4 pb-2" id="active-pipeline-details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2">
                <h4 className="text-lg font-bold text-zinc-900">{steps[activeStep].title}</h4>
                <p className="mt-2 text-zinc-600 text-sm leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>

              <div className="rounded-lg bg-zinc-50 p-4 border border-zinc-200/50">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono mb-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>Technical Execution</span>
                </div>
                <p className="text-xs font-medium text-zinc-600 font-sans">
                  {steps[activeStep].details}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Small Bottom Disclaimer */}
        <p className="text-center text-[11px] text-zinc-400 font-mono">
          System conforms with fully isolated double-encoding, complying with local data privacy acts. No third-party LLM logs persisted.
        </p>

      </div>

    </div>
  );
}
