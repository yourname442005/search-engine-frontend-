/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FolderHeart, Folder, Library, Lock, Globe, Plus, 
  Trash2, ExternalLink, Sparkles, BookOpen, Clock, Tag
} from 'lucide-react';
import { AcademicResource } from '../types';

interface CollectionsViewProps {
  resources: AcademicResource[];
  onOpenResource: (resource: AcademicResource) => void;
  onAskAI: (topic: string) => void;
}

export interface ReadingCollection {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  resourceIds: string[];
  tags: string[];
}

export default function CollectionsView({ 
  resources, 
  onOpenResource,
  onAskAI 
}: CollectionsViewProps) {
  
  // States
  const [collections, setCollections] = useState<ReadingCollection[]>([
    {
      id: "col-1",
      name: "Core NLP Transformer Foundations",
      description: "Mandatory literature and publications detailing attention weights, self-supervised bidirected training, and decoder parameters.",
      isPublic: true,
      resourceIds: ["res-1", "res-2", "res-3", "res-4"],
      tags: ["Deep Learning", "NLP", "Transformers"]
    },
    {
      id: "col-2",
      name: "Seismic Constraint Engineering",
      description: "Dissertations analyzing automatic mechanical feedback damper Joints under global tectonic stress.",
      isPublic: false,
      resourceIds: ["res-7"],
      tags: ["Structural Mechanics", "Seismic Joints"]
    },
    {
      id: "col-3",
      name: "Bio-ethics & Quantum Limits",
      description: "Class textbook references reviewing foundational entanglement math coupled with CRISPR therapeutic guidelines.",
      isPublic: true,
      resourceIds: ["res-5", "res-8"],
      tags: ["Quantum Computing", "CRISPR Ethics"]
    }
  ]);

  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColPublic, setNewColPublic] = useState(true);

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;

    const newCol: ReadingCollection = {
      id: `col-${Date.now()}`,
      name: newColName,
      description: newColDesc || "Custom structured research binder.",
      isPublic: newColPublic,
      resourceIds: [],
      tags: ["My Collection"]
    };

    setCollections([...collections, newCol]);
    setNewColName('');
    setNewColDesc('');
    setNewColPublic(true);
  };

  const handleDeleteCollection = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the reading collection "${name}"?`)) {
      setCollections(collections.filter(c => c.id !== id));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="collections-screen-root">
      
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 font-mono">Literature Binders</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 uppercase">
            Curated Reading Collections
          </h1>
        </div>

        {/* Info Tag */}
        <div className="rounded bg-zinc-100 border border-zinc-200/60 px-3 py-1.5 text-xs text-zinc-500 font-medium">
          Total collections logged: <strong className="text-zinc-700">{collections.length} Binders</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="collections-layout-bento">
        
        {/* Left Area: Collections Grid (2/3 span) */}
        <div className="lg:col-span-2 space-y-6" id="reading-collections-gird">
          
          {collections.map((col) => {
            // Get children academic resource models
            const colResources = resources.filter(r => col.resourceIds.includes(r.id));
            
            return (
              <div key={col.id} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative" id={`collection-holder-card-${col.id}`}>
                
                {/* Upper line metadata */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5" id={`collection-headers-${col.id}`}>
                    <FolderHeart className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold font-mono uppercase tracking-tight text-zinc-400">
                      Collection Folder Entry ID: #{col.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full ${col.isPublic ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-150 text-amber-900 bg-amber-50'}`}>
                      {col.isPublic ? 'Public Share Access' : 'Private Vault Reference'}
                    </span>
                    <button
                      id={`delete-col-btn-${col.id}`}
                      onClick={() => handleDeleteCollection(col.id, col.name)}
                      className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Purge reading binder"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info titles */}
                <h3 className="text-base font-extrabold text-zinc-900">
                  {col.name}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans mt-1.5">
                  {col.description}
                </p>

                {/* Resource indices tables */}
                <div className="mt-4 pt-4 border-t border-zinc-100 space-y-2" id={`collection-indices-${col.id}`}>
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-2">Indexed Reference Files ({colResources.length})</span>
                  
                  {colResources.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No publications saved inside this binder. Browse global search to add resources.</p>
                  ) : (
                    colResources.map((res) => (
                      <div key={res.id} className="rounded border border-zinc-150 bg-zinc-50/20 p-2.5 flex items-center justify-between gap-4 text-xs font-sans hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
                        <div>
                          <strong className="text-zinc-800 line-clamp-1">{res.title}</strong>
                          <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">{res.authors[0]} et al. • Published: {res.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onOpenResource(res)}
                            className="rounded bg-white border border-zinc-200 hover:bg-zinc-100 flex items-center gap-1 p-1 text-[10px] font-bold text-zinc-600"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Inspect</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Filter tags footer */}
                <div className="flex flex-wrap items-center gap-1.5 mt-5">
                  <Tag className="h-3.5 w-3.5 text-zinc-400" />
                  {col.tags.map((tg, i) => (
                    <span key={i} className="rounded bg-zinc-100 text-zinc-650 px-2 py-0.5 text-[9px] font-bold font-mono">
                      {tg}
                    </span>
                  ))}
                </div>

              </div>
            );
          })}

        </div>

        {/* Right Area: Create Collection Form */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 h-fit shadow-sm" id="create-binder-panel">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4 flex items-center gap-1.5 border-b border-zinc-100 pb-2">
            <Plus className="h-4 w-4 text-blue-600" />
            Establish New Binder
          </h3>

          <form onSubmit={handleCreateCollection} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Binder Name</label>
              <input
                type="text"
                required
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="e.g. Quantum Computing Shor algorithms"
                className="w-full text-xs font-semibold rounded-lg border border-zinc-300 p-2.5 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500">Summary Scope (Description)</label>
              <textarea
                value={newColDesc}
                onChange={(e) => setNewColDesc(e.target.value)}
                placeholder="Detailed explanation of reading bounds..."
                rows={3}
                className="w-full text-xs font-medium rounded-lg border border-zinc-300 p-2.5 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-500 block">Share Clearance</label>
              <div className="flex gap-4 pt-1" id="share-clearance-choices">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="radio"
                    name="clearance"
                    checked={newColPublic}
                    onChange={() => setNewColPublic(true)}
                  />
                  <span>Public View</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 cursor-pointer">
                  <input
                    type="radio"
                    name="clearance"
                    checked={!newColPublic}
                    onChange={() => setNewColPublic(false)}
                  />
                  <span>Restrict to Vault</span>
                </label>
              </div>
            </div>

            <button
              id="submit-create-collection-btn"
              type="submit"
              className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 mt-2 shadow-sm transition-colors"
            >
              Construct Literature Binder
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
