/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { 
  Sparkles, TrendingUp, RefreshCcw, Compass, ArrowUpRight, 
  BookOpen, Bookmark, FileText, Globe
} from 'lucide-react';
import { AcademicResource } from '../types';

interface RecommendationsViewProps {
  resources: AcademicResource[];
  onOpenDetails: (resource: AcademicResource) => void;
  onAskAI: (resource: AcademicResource) => void;
}

export default function RecommendationsView({ 
  resources, 
  onOpenDetails,
  onAskAI 
}: RecommendationsViewProps) {
  
  // Classify mock resources for distinct recommendation sections
  const recommendedForYou = [resources[0], resources[3]]; // Attention & RAG
  const similarResources = [resources[1], resources[9]]; // BERT & Llama 3
  const recentlyAdded = [resources[5], resources[7]]; // Climate LSTMs & Earthquake Structural
  const crossDisciplinary = [resources[6], resources[8]]; // Western Archives & CRISPR ethics
  
  const trendingTopics = [
    { title: "Decentralized LLM Fine-Tuning Protocols", papersCount: 840, trend: "+45% this week" },
    { title: "Molecular Seismic Dampers in Structural Physics", papersCount: 120, trend: "+12%" },
    { title: "Post-Quantum Cryptography for Institutional Records", papersCount: 310, trend: "+30%" },
    { title: "CRISPR-Cas9 Bioethical Policy Harmonization", papersCount: 520, trend: "+18%" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="recommendation-dashboard-root">
      
      {/* Header Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6" id="recommendation-hero">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest block">AI-Curation Dashboard</span>
          <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Personalized Literature Advisory</h1>
          <p className="text-xs text-zinc-500">
            ALIS analyzes your reading history vectors to formulate recommendations promoting both deep focus and serendipitous cross-disciplinary exploration.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 bg-white border border-blue-100 rounded-lg px-3 py-2 text-xs font-bold text-blue-700">
          <Sparkles className="h-4 w-4 animate-bounce text-blue-500" />
          <span>Real-time curation active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="recommendation-layout-bento">
        
        {/* Left Column: Curation sections (occupies 2/3 cols) */}
        <div className="lg:col-span-2 space-y-8" id="recommendations-curated-feeds">
          
          {/* Section 1: Recommended for You */}
          <div id="section-recommended-for-you">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedForYou.map((res) => (
                <div key={res.id} className="rounded-xl border border-zinc-200 bg-white p-5 hover:border-blue-300 transition-colors flex flex-col justify-between" id={`rec-card-foryou-${res.id}`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        98% Affinity
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {res.year}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1 hover:text-blue-600 cursor-pointer" onClick={() => onOpenDetails(res)}>
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">By {res.authors[0]} et al.</p>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-2 leading-relaxed">
                      {res.abstract}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 mt-4 pt-3.5">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">{res.type}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onOpenDetails(res)}
                        className="text-[11px] font-bold text-zinc-600 hover:text-zinc-950 font-sans"
                      >
                        Inspect
                      </button>
                      <button 
                        onClick={() => onAskAI(res)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-800 font-sans"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Similar Resources */}
          <div id="section-similar-resources">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-blue-500" />
              Similar to your reading history
            </h2>
            <div className="space-y-3">
              {similarResources.map((res) => (
                <div key={res.id} className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50/50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id={`rec-card-similar-${res.id}`}>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase">{res.department}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-blue-600 cursor-pointer" onClick={() => onOpenDetails(res)}>
                      {res.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-sans">
                      Based on your interest in neural language representation.
                    </p>
                  </div>
                  <button 
                    onClick={() => onOpenDetails(res)}
                    className="shrink-0 text-xs font-semibold rounded border border-zinc-200 hover:border-zinc-300 px-3 py-1.5 text-zinc-700 bg-white"
                  >
                    Open Metadata Card
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Cross-disciplinary Discoveries */}
          <div id="section-cross-disciplinary">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-2">
              <Compass className="h-4 w-4 text-purple-500" />
              Cross-disciplinary Discoveries
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crossDisciplinary.map((res) => (
                <div key={res.id} className="rounded-xl border border-dashed border-zinc-250 bg-white p-5 hover:border-purple-300 transition-colors flex flex-col justify-between" id={`rec-card-cross-${res.id}`}>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded inline-block mb-2">
                      Bridging: CS & Humanities
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-blue-600 cursor-pointer leading-snug line-clamp-2" onClick={() => onOpenDetails(res)}>
                      {res.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-2 leading-relaxed line-clamp-2">
                      {res.abstract}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 mt-4 pt-3">
                    <span className="text-[10px] font-semibold text-zinc-400">{res.department}</span>
                    <button 
                      onClick={() => onOpenDetails(res)}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                    >
                      Explore Intersect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Trending Topics & Recently Added */}
        <div className="space-y-8" id="recommendations-sidebar-trends">
          
          {/* Trending Research Module */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" id="section-trending-topics">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Trending Research Topics
            </h2>
            <div className="space-y-4">
              {trendingTopics.map((topic, i) => (
                <div key={i} className="border-b border-zinc-100 pb-3 last:border-0 last:pb-0" id={`trending-topic-row-${i}`}>
                  <h4 className="text-xs font-bold text-zinc-900 font-sans tracking-tight leading-snug">
                    {topic.title}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mt-1">
                    <span>{topic.papersCount} indexed references</span>
                    <span className="text-emerald-600 font-bold">{topic.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Recently Added */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" id="section-recently-added">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Recently Ingested
            </h2>
            <div className="space-y-4">
              {recentlyAdded.map((res) => (
                <div key={res.id} className="group relative" id={`rec-card-recent-${res.id}`}>
                  <span className="text-[9px] font-mono text-zinc-400 block">{res.doi}</span>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-blue-600 cursor-pointer block mt-0.5" onClick={() => onOpenDetails(res)}>
                    {res.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Uploaded {res.year} • {res.department}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Curation Guarantee Badge info */}
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 font-sans text-xs text-zinc-500 leading-normal" id="curator-opt-out">
            <span className="font-bold text-zinc-700 block mb-1">Curation Transparency</span>
            ALIS V2.0 recommendations are calculated client-side in standard vectors. No search logs are shared with external publishing systems without direct authorization.
          </div>

        </div>

      </div>

    </div>
  );
}
