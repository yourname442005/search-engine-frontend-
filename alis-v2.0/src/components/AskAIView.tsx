/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, RotateCcw, AlertTriangle, BookOpen, 
  HelpCircle, ChevronRight, Activity, Percent, ArrowRight,
  ChevronDown, ChevronUp, FileText, CheckCircle2, Bookmark
} from 'lucide-react';
import { ChatMessage, AcademicResource } from '../types';
import { aiSolutionsPresetMap, mockResources } from '../data/mockData';

interface AskAIViewProps {
  initialPromptText?: string;
  setInitialPromptText: (text: string) => void;
  onReferenceClick: (resourceId: string) => void;
}

export default function AskAIView({ 
  initialPromptText, 
  setInitialPromptText,
  onReferenceClick
}: AskAIViewProps) {
  
  // States
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am ALIS Cognitive Assistant, powered by hybrid semantic indexing of the university library collections.\n\nType in your research requests or select one of the core academic themes below to trigger interactive RAG synthesis. I will extract evidence fragments and attach source citations automatically.",
      timestamp: "Just Now",
      confidence: 100
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [evidencePanelOpen, setEvidencePanelOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestedQuestions = [
    "Explain the major contributions of transformer architectures in natural language processing.",
    "What is retrieval-augmented generation and how does it prevent hallucinations?",
    "Explain the foundation level introduction of quantum computation algorithms."
  ];

  // If initialPromptText gets modified from outside (e.g., clicking Ask AI from Search Page), handle it!
  useEffect(() => {
    if (initialPromptText && initialPromptText.trim()) {
      handleQuerySubmit(initialPromptText.trim());
      // reset global state so it doesn't trigger repeat runs on tab changing
      setInitialPromptText('');
    }
  }, [initialPromptText]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Handle submit trigger
  const handleQuerySubmit = (queryText: string) => {
    if (!queryText.trim() || isStreaming) return;

    // 1. Add User Message
    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: "user",
        content: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(newMessages);
    setInputVal('');
    setIsStreaming(true);

    // 2. Prepare Assistant Answer content
    const normalizedQuery = queryText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
    
    // Look for preset answers to make it high-fidelity, else generate dynamic smart answer based on mock data
    let matchedPreset = aiSolutionsPresetMap[normalizedQuery];
    
    // If no exact match, search if any preset keys are contained in input query
    if (!matchedPreset) {
      const keys = Object.keys(aiSolutionsPresetMap);
      const matchKey = keys.find(k => normalizedQuery.includes(k) || k.includes(normalizedQuery));
      if (matchKey) {
        matchedPreset = aiSolutionsPresetMap[matchKey];
      }
    }

    let finalAnswer = "";
    let finalConfidence = 92;
    let finalSources: string[] = [];
    let finalCitations: string[] = [];
    let finalEvidence: any[] = [];
    let finalFollowups: string[] = [];

    if (matchedPreset) {
      finalAnswer = matchedPreset.answer;
      finalConfidence = matchedPreset.confidence;
      finalSources = matchedPreset.sources;
      finalCitations = matchedPreset.citations;
      finalEvidence = matchedPreset.evidence;
      finalFollowups = [
        "How do self-attention mechanisms compare to traditional Gated Recurrent Units?",
        "What are the latency tradeoffs inside long context retrieval windows?"
      ];
    } else {
      // Find matching items in library for contextual reference
      const matchingRes = mockResources.filter(r => 
        normalizedQuery.split(' ').some(word => 
          word.length > 3 && (r.title.toLowerCase().includes(word) || r.abstract.toLowerCase().includes(word))
        )
      );

      if (matchingRes.length > 0) {
        const topRes = matchingRes[0];
        finalAnswer = `Based on our university resources regarding "${queryText}", specifically referencing **${topRes.title}** (${topRes.year}) [1], we found corresponding insights.\n\n### Summary of Retrieval Findings:\n\n* **Academic Authority**: Authored by ${topRes.authors.join(', ')}.\n* **Semantic Insight**: The study presents critical observations in the domain of *${topRes.department}*.\n* **Primary Content**: ${topRes.abstract}\n\nYou can explore more about this publication directly inside our Search or Graph systems.`;
        finalConfidence = 89;
        finalSources = [topRes.id];
        finalCitations = [`${topRes.title} (${topRes.authors[0]} et al., ${topRes.year})`];
        finalEvidence = [{
          claim: `Resource states findings regarding ${topRes.title}.`,
          evidence: topRes.abstract,
          source: `${topRes.title}, Abstract Statement.`
        }];
        finalFollowups = [
          `Can you explain the citation connections for ${topRes.authors[0]}?`,
          "What other papers has this department indexed?"
        ];
      } else {
        // generic mock response
        finalAnswer = `I have scanned our **500,000+ local documents**, including dissertations and institutional reports. No highly cited match was found for the specific query: "${queryText}".\n\nHowever, in the baseline literature of our digital collections: \n\n* **Traditional Cataloging**: Studies show that general queries require explicit domain terms.\n* **RAG Guidance**: Connect other subjects such as *Natural Language Processing*, *Seismic Constraints*, or *Quantum Computation* which are fully indexed inside our repository.\n\nWould you like me to guide you through our interactive Knowledge Graph instead?`;
        finalConfidence = 80;
        finalSources = [];
        finalCitations = [];
        finalEvidence = [{
          claim: "Scanned collection fails to resolve exact keywords.",
          evidence: "Standard lexical DB scan finished under 45ms. Zero high-utility semantic results fetched above 50% matching relevance.",
          source: "ALIS Indexing Service"
        }];
        finalFollowups = [
          "Explain the major contributions of transformer architectures in natural language processing.",
          "Tell me about the Quantum Computing reference textbook."
        ];
      }
    }

    // 3. Perform Animated streaming
    // Create empty assistant message we will fill word-by-word
    const assistantMsgId = `assistant-${Date.now()}`;
    const assistantMsgObj: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: finalConfidence,
      citations: finalCitations,
      sourcesUsed: finalSources,
      evidencePanel: finalEvidence,
      followUpSuggestions: finalFollowups
    };

    setMessages(prev => [...prev, assistantMsgObj]);

    // Split target answer text into chunks (e.g. groups of characters or words)
    const words = finalAnswer.split(' ');
    let currentIdx = 0;
    
    const streamInterval = setInterval(() => {
      if (currentIdx >= words.length) {
        clearInterval(streamInterval);
        setIsStreaming(false);
        return;
      }

      const partialText = words.slice(0, currentIdx + 1).join(' ');
      setMessages(prev => prev.map(m => {
        if (m.id === assistantMsgId) {
          return { ...m, content: partialText };
        }
        return m;
      }));

      currentIdx++;
    }, 45); // highly realistic speed
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8" id="ask-ai-interface-root">
      
      {/* Upper header statistics banner */}
      <div className="border border-blue-100 rounded-xl bg-blue-50/40 p-4 mb-6 flex sm:items-center justify-between flex-col sm:flex-row gap-4" id="ai-assistant-header-banner">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest block">Institutional LLM Assistant</span>
            <h1 className="text-sm font-bold text-zinc-900 -mt-0.5">High-Fidelity RAG Pipeline Activates automatically</h1>
          </div>
        </div>

        {/* Real-time configuration metrics info */}
        <div className="flex gap-4 font-mono text-[10px] text-zinc-400">
          <div>
            <span>PROVIDER:</span> <strong className="text-zinc-600">Gemini (Isolated)</strong>
          </div>
          <div>
            <span>TEMPERATURE:</span> <strong className="text-zinc-600">0.15</strong>
          </div>
          <div>
            <span>GROUNDED INDEX:</span> <strong className="text-emerald-600">ACTIVE</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="chat-workspace-layout">
        
        {/* Chat Thread Container Column */}
        <div className="lg:col-span-2 flex flex-col h-[650px] rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden" id="chat-messages-container">
          
          {/* Thread messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5" id="chat-scroller-viewport">
            {messages.map((m) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div 
                  key={m.id} 
                  id={`chat-msg-${m.id}`}
                  className={`flex gap-3.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  
                  {/* Left profile letter */}
                  {isAssistant && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-blue-600 text-white font-mono text-[10px] font-bold">
                      AL
                    </div>
                  )}

                  {/* Bubble wrapper */}
                  <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    isAssistant 
                      ? 'bg-zinc-50 border border-zinc-150 text-zinc-800' 
                      : 'bg-zinc-900 border border-zinc-800 text-white shadow-sm'
                  }`}>
                    
                    {/* Role header stamp */}
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold uppercase tracking-wider mb-2" id={`chat-msg-header-${m.id}`}>
                      <span className={isAssistant ? 'text-blue-600' : 'text-zinc-400'}>
                        {isAssistant ? 'ALIS Cognitive Synthesis' : 'Sarah (Student)'}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-zinc-400 font-normal">{m.timestamp}</span>

                      {isAssistant && m.confidence && (
                        <span className="ml-auto inline-flex items-center gap-0.5 rounded bg-blue-100/60 px-1 py-0.5 text-[8px] font-bold text-blue-700">
                          <Percent className="h-2 w-2" />
                          <span>Conf: {m.confidence}%</span>
                        </span>
                      )}
                    </div>

                    {/* Body content text */}
                    <div className="whitespace-pre-wrap leading-relaxed font-sans prose prose-sm max-w-none text-xs sm:text-sm" id={`chat-msg-content-${m.id}`}>
                      {m.content}
                    </div>

                    {/* Sources / Citations linked directly inside Chat Bubble */}
                    {isAssistant && m.citations && m.citations.length > 0 && (
                      <div className="border-t border-zinc-150 mt-4 pt-3" id={`chat-msg-citations-${m.id}`}>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Attributed Sources:</span>
                        <div className="flex flex-col gap-1">
                          {m.citations.map((cite, idx) => {
                            const refId = m.sourcesUsed?.[idx];
                            return (
                              <button
                                key={idx}
                                id={`chat-citation-link-${m.id}-${idx}`}
                                onClick={() => refId && onReferenceClick(refId)}
                                className="text-[11px] font-mono text-left font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              >
                                <span>[{idx + 1}]</span>
                                <span className="truncate">{cite}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
            
            {/* Scroller bottom reference */}
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up / Suggestions Row */}
          {!isStreaming && messages.length > 1 && (
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-1.5" id="follow-up-suggestions-section">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Suggested Academic Queries</span>
              <div className="flex flex-col gap-1.5">
                {messages[messages.length - 1].followUpSuggestions?.map((item, i) => (
                  <button
                    key={i}
                    id={`suggested-question-btn-${i}`}
                    onClick={() => handleQuerySubmit(item)}
                    className="text-left text-xs text-zinc-600 hover:text-blue-600 font-sans truncate hover:underline flex items-center gap-1"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-blue-500 hover:scale-110" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input text form footer */}
          <div className="border-t border-zinc-200 p-4 bg-zinc-50/30" id="chat-input-form-wrapper">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuerySubmit(inputVal);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                id="ask-ai-input-field"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isStreaming}
                placeholder={isStreaming ? "Streaming research response, please stand by..." : "Ask a research question or enter query parameters..."}
                className="w-full text-xs sm:text-sm font-medium rounded-xl border border-zinc-350 bg-white py-3.5 pl-4 pr-12 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                id="submit-query-btn"
                disabled={!inputVal.trim() || isStreaming}
                className={`absolute right-2 p-2 rounded-lg transition-colors ${
                  inputVal.trim() && !isStreaming 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-zinc-300 bg-zinc-100 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Evidence & Verification Sidebar Column */}
        <div className="lg:col-span-1 space-y-4" id="evidence-sidebar-panel">
          
          {/* Preset trigger block helper for quick testing links */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold font-sans text-zinc-800 flex items-center gap-1.5 mb-3">
              <BookOpen className="h-4 w-4 text-zinc-400" />
              Academic Seminar Presets
            </h3>
            <div className="flex flex-col gap-1.5">
              {suggestedQuestions.map((topic, i) => (
                <button
                  key={i}
                  id={`preset-topic-btn-box-${i}`}
                  onClick={() => handleQuerySubmit(topic)}
                  className="rounded border border-zinc-150 p-2.5 text-left text-[11px] text-zinc-600 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/15 font-medium leading-normal transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Expandable active evidence metadata panel */}
          <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
            <button
              id="toggle-evidence-panel-btn"
              onClick={() => setEvidencePanelOpen(!evidencePanelOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-zinc-50/70 border-b border-zinc-200 hover:bg-zinc-100 transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span>RAG Evidence Extracts</span>
              </div>
              {evidencePanelOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>

            {evidencePanelOpen && (
              <div className="p-4 space-y-3.5 max-h-[400px] overflow-y-auto" id="evidence-panel-content">
                {messages && messages[messages.length - 1]?.evidencePanel ? (
                  messages[messages.length - 1].evidencePanel?.map((ev, idx) => (
                    <div key={idx} className="rounded border border-zinc-150 bg-zinc-50/20 p-3 text-xs" id={`evidence-extract-node-${idx}`}>
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-150 pb-1.5 mb-2">
                        <span className="text-[9px] font-bold font-mono text-emerald-600 uppercase">Grounded Fragment 0{idx + 1}</span>
                        <span className="text-[9px] font-semibold text-zinc-400 font-mono truncate max-w-[120px]">{ev.source}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div>
                          <span className="text-[10px] text-zinc-400 font-medium block">Key Claim Resolved</span>
                          <p className="font-bold text-zinc-800 leading-snug">{ev.claim}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 font-medium block">Empirical Context Chunk</span>
                          <p className="italic text-zinc-650 bg-white p-2 border border-zinc-150 rounded leading-normal font-sans text-[11px] font-medium">{ev.evidence}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-zinc-400 text-xs" id="no-evidence-state">
                    No active vector query. Send an academic question to run the neural indexing retrieval pipeline.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Isolated Container Disclaimer info */}
          <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-[11.5px] text-zinc-500 font-sans" id="ai-regulatory-card">
            <span className="font-bold text-zinc-700 block mb-1">Grounded RAG Guarantee</span>
            ALIS cognitive processor checks each response text segment directly with ChromaDB local embeddings. Statements without corresponding evidence nodes inside campus databases are trimmed automatically.
          </div>

        </div>

      </div>

    </div>
  );
}
