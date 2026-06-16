/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, BookOpen, Layers, Calendar, GraduationCap, 
  Unlock, Download, FolderHeart, Sparkles, Network,
  ExternalLink, Filter, RotateCcw, AlertCircle, FileText, CheckCircle2, Bookmark
} from 'lucide-react';
import { AcademicResource, SearchFilters, ResourceType, AccessLevel } from '../types';

interface SearchViewProps {
  resources: AcademicResource[];
  onAskAIAboutResource: (resource: AcademicResource) => void;
  onViewInKnowledgeGraph: (resourceId: string) => void;
}

export default function SearchView({ 
  resources, 
  onAskAIAboutResource, 
  onViewInKnowledgeGraph 
}: SearchViewProps) {
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<ResourceType | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'borrowed'>('all');
  const [selectedAccess, setSelectedAccess] = useState<AccessLevel | 'all'>('all');
  const [authorSearch, setAuthorSearch] = useState('');

  // Notifications
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [savedCollectionIds, setSavedCollectionIds] = useState<Set<string>>(new Set());
  
  // Selected resource for detailed Modal view
  const [selectedResourceModal, setSelectedResourceModal] = useState<AcademicResource | null>(null);

  // Departments list built dynamically
  const departments = useMemo(() => {
    const list = new Set(resources.map(r => r.department));
    return Array.from(list);
  }, [resources]);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedResourceType('all');
    setSelectedYear('all');
    setSelectedDept('all');
    setSelectedAvailability('all');
    setSelectedAccess('all');
    setAuthorSearch('');
    setSearchQuery('');
  };

  const handleSaveToCollection = (id: string, title: string) => {
    const nextSaved = new Set(savedCollectionIds);
    if (nextSaved.has(id)) {
      nextSaved.delete(id);
      triggerToast(`Removed "${title.substring(0, 30)}..." from saved collections.`);
    } else {
      nextSaved.add(id);
      triggerToast(`Successfully saved "${title.substring(0, 30)}..." to your Reading Collection.`);
    }
    setSavedCollectionIds(nextSaved);
  };

  const triggerToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => {
      setAlertMsg(null);
    }, 4000);
  };

  const handleDownload = (title: string, accessLevel: string) => {
    if (accessLevel === "Restricted") {
      triggerToast(`Access Denied: "${title}" is restricted. Please request digital access token via Faculty portal.`);
      return;
    }
    triggerToast(`Ingestion Pipeline: Initiated secure file stream for "${title}". PDF download started.`);
  };

  // Live filter computation & scoring simulated realistically!
  const filteredResources = useMemo(() => {
    return resources.map(res => {
      let score = 70; // baseline

      const query = searchQuery.toLowerCase().trim();
      if (query) {
        let matchMultiplier = 0;
        if (res.title.toLowerCase().includes(query)) matchMultiplier += 20;
        if (res.abstract.toLowerCase().includes(query)) matchMultiplier += 10;
        if (res.authors.some(a => a.toLowerCase().includes(query))) matchMultiplier += 15;
        if (res.department.toLowerCase().includes(query)) matchMultiplier += 12;

        if (matchMultiplier === 0) {
          return null; // doesn't match query at all
        }
        score += matchMultiplier;
      }

      // Filter: Resource Type
      if (selectedResourceType !== 'all' && res.type !== selectedResourceType) {
        return null;
      }

      // Filter: Publication Year
      if (selectedYear !== 'all') {
        const currentYear = 2026;
        if (selectedYear === 'recent') {
          if (currentYear - res.year > 3) return null;
        } else if (selectedYear === '5years') {
          if (currentYear - res.year > 5) return null;
        } else if (selectedYear === '10years') {
          if (currentYear - res.year > 10) return null;
        } else {
          // specific year match
          if (res.year !== parseInt(selectedYear)) return null;
        }
      }

      // Filter: Department
      if (selectedDept !== 'all' && res.department !== selectedDept) {
        return null;
      }

      // Filter: Availability
      if (selectedAvailability !== 'all') {
        if (selectedAvailability === 'available' && !res.availability) return null;
        if (selectedAvailability === 'borrowed' && res.availability) return null;
      }

      // Filter: Access Level
      if (selectedAccess !== 'all' && res.accessLevel !== selectedAccess) {
        return null;
      }

      // Filter: Author specific search
      if (authorSearch.trim()) {
        const authQ = authorSearch.toLowerCase();
        if (!res.authors.some(a => a.toLowerCase().includes(authQ))) {
          return null;
        }
      }

      // Caps relevance score at 99
      const finalRelevance = Math.min(score, 99);
      // Simulated AI Confidence indicator
      const confidence = Math.min(Math.round(finalRelevance * 0.96 + Math.random() * 2), 99);

      return {
        ...res,
        relevanceScore: finalRelevance,
        confidenceIndicator: confidence
      };
    })
    .filter((r): r is any => r !== null)
    // Sort by relevance score descending
    .sort((a,b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

  }, [resources, searchQuery, selectedResourceType, selectedYear, selectedDept, selectedAvailability, selectedAccess, authorSearch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="search-interface-root">
      
      {/* Alert Portal */}
      {alertMsg && (
        <div id="toast-notification" className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 shadow-xl transition-all duration-300 transform translate-y-0 text-sm font-medium text-zinc-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
          <span>{alertMsg}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="search-section-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Global Unified Library Retrieval</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Search academic books, research papers, master&apos;s theses, and journals using ALIS intelligent ranking model.
          </p>
        </div>
        
        {/* Statistics Tag */}
        <div className="flex items-center gap-2 rounded-lg bg-zinc-100 border border-zinc-200/60 px-3 py-1.5 text-xs font-semibold text-zinc-600">
          <Layers className="h-3.5 w-3.5 text-zinc-400" />
          <span>Showing {filteredResources.length} matching entities of {resources.length} resources</span>
        </div>
      </div>

      {/* Centerpiece Intelligent Search Bar */}
      <div className="relative mb-6" id="intelligent-search-input-container">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          id="alis-global-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search books, papers, theses, journals, authors, or ask a research question..."
          className="block w-full rounded-xl border border-zinc-300 bg-white py-4 pl-12 pr-4 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
        {searchQuery && (
          <button 
            id="clear-search-query-btn"
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-xs font-semibold text-zinc-400 hover:text-zinc-600 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="search-body-layout">
        
        {/* Filters Panel */}
        <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-5 h-fit shadow-sm" id="search-filters-panel">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-zinc-900">
              <Filter className="h-4 w-4 text-zinc-400" />
              Advanced Filters
            </h3>
            <button
              id="reset-filters-btn"
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 font-mono transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Resource Type */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Resource Type
              </label>
              <select
                id="filter-resource-type"
                value={selectedResourceType}
                onChange={(e) => setSelectedResourceType(e.target.value as ResourceType | 'all')}
                className="w-full text-xs font-medium rounded-md border border-zinc-200 bg-zinc-50/50 p-2 text-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Literatures</option>
                <option value="book">Books</option>
                <option value="paper">Scientific Papers</option>
                <option value="thesis">Research Theses</option>
                <option value="journal">Academic Journals</option>
              </select>
            </div>

            {/* Department Selection */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Department
              </label>
              <select
                id="filter-department"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full text-xs font-medium rounded-md border border-zinc-200 bg-zinc-50/50 p-2 text-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Publication Year Range */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Publication Window
              </label>
              <select
                id="filter-publication-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full text-xs font-medium rounded-md border border-zinc-200 bg-zinc-50/50 p-2 text-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Historic Data</option>
                <option value="recent">Last 3 Years (&gt;= 2023)</option>
                <option value="5years">Last 5 Years (&gt;= 2021)</option>
                <option value="10years">Last 10 Years (&gt;= 2016)</option>
                <option value="2017">2017 (Transformer Launch)</option>
                <option value="2010">2010 (Classical Mechanics)</option>
              </select>
            </div>

            {/* Specific Author Filter */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Specific Author
              </label>
              <input
                type="text"
                id="filter-author"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                placeholder="Author's name..."
                className="w-full text-xs font-medium rounded-md border border-zinc-200 p-2 text-zinc-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Access Level */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Access Tier Authorization
              </label>
              <select
                id="filter-access-level"
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value as AccessLevel | 'all')}
                className="w-full text-xs font-medium rounded-md border border-zinc-200 bg-zinc-50/50 p-2 text-zinc-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Access Clearance</option>
                <option value="Public">Public (Unrestricted)</option>
                <option value="Institutional">Institutional Clearance</option>
                <option value="Restricted">Restricted Vault Entries</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest font-mono block mb-1.5">
                Physical Availability
              </label>
              <div className="flex flex-col gap-2 pt-1" id="filter-availability-checkboxes">
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'all'}
                    onChange={() => setSelectedAvailability('all')}
                    className="h-3.5 w-3.5 border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Show All</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'available'}
                    onChange={() => setSelectedAvailability('available')}
                    className="h-3.5 w-3.5 border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ready for Dispatch</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={selectedAvailability === 'borrowed'}
                    onChange={() => setSelectedAvailability('borrowed')}
                    className="h-3.5 w-3.5 border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>On Loan Only</span>
                </label>
              </div>
            </div>

          </div>

          <div className="border-t border-zinc-150 mt-6 pt-4 text-[11px] text-zinc-400 text-center font-sans tracking-tight">
            ALIS indexing utilizes real-time hybrid scoring (BM25 token dense TF-IDF vectors).
          </div>
        </div>

        {/* Search Results list */}
        <div className="lg:col-span-3 space-y-4" id="search-results-list">
          {filteredResources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center" id="search-results-empty">
              <AlertCircle className="mx-auto h-8 w-8 text-zinc-400" />
              <h3 className="mt-2 text-sm font-bold text-zinc-950">No Academic Materials Solved</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
                No matching materials found inside our database. Click the &apos;Reset&apos; button above to restore database filters.
              </p>
              <button
                id="empty-results-reset-btn"
                onClick={handleResetFilters}
                className="mt-4 rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredResources.map((res) => {
              const scoreHex = (res.relevanceScore || 70) > 90 ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50';
              const indicatorHex = (res.confidenceIndicator || 70) > 90 ? 'text-purple-600 bg-purple-50' : 'text-zinc-600 bg-zinc-50';
              const isSaved = savedCollectionIds.has(res.id);

              return (
                <div 
                  key={res.id} 
                  id={`resource-card-${res.id}`}
                  className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  
                  {/* Top line badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    
                    {/* Catalog ID & Category badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase rounded bg-zinc-100 text-zinc-700 px-1.5 py-0.5">
                        {res.type}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {res.doi}
                      </span>
                    </div>

                    {/* Algorithmic Scoring badges */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${scoreHex}`}>
                        {res.relevanceScore}% Relevance Match
                      </span>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${indicatorHex}`}>
                        🤖 AI Confidence: {res.confidenceIndicator}%
                      </span>
                    </div>

                  </div>

                  {/* Header title */}
                  <h3 className="text-base font-bold text-zinc-900 group cursor-pointer hover:text-blue-600" onClick={() => setSelectedResourceModal(res)}>
                    {res.title}
                  </h3>

                  {/* Authors line */}
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    By {res.authors.join(', ')} • <span className="font-semibold text-zinc-500">{res.year}</span> • Departamento de <span className="font-semibold text-zinc-500">{res.department}</span>
                  </p>

                  {/* Abstract Preview */}
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans mt-3 line-clamp-2">
                    {res.abstract}
                  </p>

                  {/* Badges footer */}
                  <div className="flex flex-wrap items-center justify-between border-t border-zinc-100 mt-4 pt-3.5 gap-2">
                    
                    {/* Meta count metrics */}
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                      <span>Citations: <strong>{res.citationsCount.toLocaleString()}</strong></span>
                      <span>•</span>
                      <span>Related: <strong>{res.relatedResourcesCount} topics</strong></span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 font-semibold ${res.availability ? 'text-emerald-600' : 'text-amber-600'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${res.availability ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                        {res.availability ? 'Available for dispatch' : 'On loan'}
                      </span>
                    </div>

                    {/* Quick Trigger actions */}
                    <div className="flex items-center gap-1.5" id={`resource-card-actions-${res.id}`}>
                      
                      {/* Deep-dive trigger modal */}
                      <button 
                        id={`action-open-res-${res.id}`}
                        onClick={() => setSelectedResourceModal(res)}
                        className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 text-xs font-semibold flex items-center gap-1"
                        title="Open document metadata details"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Details</span>
                      </button>

                      {/* Download original */}
                      <button 
                        id={`action-download-res-${res.id}`}
                        onClick={() => handleDownload(res.title, res.accessLevel)}
                        className="p-1.5 rounded text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                        title="Download publication source PDF"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>

                      {/* Safe to reading collection */}
                      <button 
                        id={`action-save-res-${res.id}`}
                        onClick={() => handleSaveToCollection(res.id, res.title)}
                        className={`p-1.5 rounded ${isSaved ? 'text-pink-600 hover:bg-pink-50 bg-pink-50/50' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'}`}
                        title="Save to your favorite lists"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>

                      {/* Ask AI Trigger */}
                      <button 
                        id={`action-ask-ai-res-${res.id}`}
                        onClick={() => onAskAIAboutResource(res)}
                        className="rounded bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 text-xs font-semibold flex items-center gap-1 hover:bg-blue-100"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                        <span>Ask AI</span>
                      </button>

                      {/* Highlight in Knowledge Network */}
                      <button 
                        id={`action-view-graph-res-${res.id}`}
                        onClick={() => onViewInKnowledgeGraph(res.id)}
                        className="rounded bg-zinc-100 border border-zinc-200 text-zinc-700 px-2.5 py-1 text-xs font-semibold flex items-center gap-1 hover:bg-zinc-200"
                        title="View connections inside network graph"
                      >
                        <Network className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Graph</span>
                      </button>

                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* METADATA MODAL DETAIL VIEW CONTAINER */}
      {selectedResourceModal && (
        <div id="resource-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xl relative">
            
            <div className="h-1 bg-blue-600"></div>

            <div className="p-6">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase rounded bg-blue-50 text-blue-700 px-2 py-0.5 mb-1.5 inline-block">
                    {selectedResourceModal.type} Index Profile
                  </span>
                  <h2 className="text-xl font-extrabold text-zinc-900 leading-tight">
                    {selectedResourceModal.title}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    By {selectedResourceModal.authors.join(', ')}
                  </p>
                </div>
                <button
                  id="close-metadata-modal-btn"
                  onClick={() => setSelectedResourceModal(null)}
                  className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                >
                  Close
                </button>
              </div>

              {/* Core catalog info metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-lg bg-zinc-50 border border-zinc-200/50 p-4 mb-4 text-xs font-sans">
                <div>
                  <span className="text-zinc-400 block font-medium">Department</span>
                  <span className="font-bold text-zinc-800">{selectedResourceModal.department}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-medium">Publication Year</span>
                  <span className="font-bold text-zinc-800">{selectedResourceModal.year}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-medium">System Doi</span>
                  <span className="font-bold text-zinc-700 font-mono break-all">{selectedResourceModal.doi}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-medium">Access clearance</span>
                  <span className="font-bold text-zinc-800">{selectedResourceModal.accessLevel}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block font-medium">Index Location</span>
                  <span className="font-bold text-zinc-800">C-Wing Vault Entry</span>
                </div>
                {selectedResourceModal.pages && (
                  <div>
                    <span className="text-zinc-400 block font-medium">Document Length</span>
                    <span className="font-bold text-zinc-800">{selectedResourceModal.pages} pages</span>
                  </div>
                )}
              </div>

              {/* Abstract */}
              <div className="mb-6">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Abstract Statement</span>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans bg-zinc-50/20 p-3 rounded-md border border-zinc-100">
                  {selectedResourceModal.abstract}
                </p>
              </div>

              {/* Action feet */}
              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-zinc-100">
                <button
                  id="modal-download-original-btn"
                  onClick={() => {
                    handleDownload(selectedResourceModal.title, selectedResourceModal.accessLevel);
                    setSelectedResourceModal(null);
                  }}
                  className="rounded-md border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Publication Source File</span>
                </button>
                <button
                  id="modal-ask-ai-refer-btn"
                  onClick={() => {
                    onAskAIAboutResource(selectedResourceModal);
                    setSelectedResourceModal(null);
                  }}
                  className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                  <span>Ask AI assistant regarding this</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
