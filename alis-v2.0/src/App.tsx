/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import SearchView from './components/SearchView';
import AskAIView from './components/AskAIView';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import RecommendationsView from './components/RecommendationsView';
import CollectionsView from './components/CollectionsView';
import DashboardView from './components/DashboardView';
import AdminPanel from './components/AdminPanel';

import { mockResources, mockUsers } from './data/mockData';
import { AcademicResource } from './types';

export default function App() {
  
  // Navigation tabs: 'landing' | 'search' | 'ask-ai' | 'knowledge-graph' | 'recommendations' | 'collections' | 'dashboard' | 'admin'
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Role switcher: 'Student' | 'Faculty' | 'Librarian' | 'Admin'
  const [activeRole, setActiveRole] = useState<'Student' | 'Faculty' | 'Librarian' | 'Admin'>('Student');

  // Shared conversational hooks
  const [askAIPrompt, setAskAIPrompt] = useState<string>('');
  
  // Selected resource for Graph centering/node triggers
  const [graphFocusResourceId, setGraphFocusResourceId] = useState<string>('');

  // Search catalog filter trigger
  const [searchCatalogQuery, setSearchCatalogQuery] = useState<string>('');

  // 1. CTA: Start Exploring
  const handleStartExploring = () => {
    setActiveTab('search');
  };

  // 2. CTA: Trigger Q&A Stream
  const handleAskAIQuery = (selectedTopic: string) => {
    setAskAIPrompt(selectedTopic);
    setActiveTab('ask-ai');
  };

  // 3. Search Result Action: Ask AI about individual resource
  const handleAskAIAboutResource = (resource: AcademicResource) => {
    const promptText = `Explain the major contributions of this resource: "${resource.title}" by ${resource.authors[0]} et al.`;
    handleAskAIQuery(promptText);
  };

  // 4. Search Result Action: Highlight & center node in Graph View
  const handleViewInKnowledgeGraph = (resourceId: string) => {
    setGraphFocusResourceId(resourceId);
    setActiveTab('knowledge-graph');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans text-zinc-900" id="alis-application-v2-container">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeRole={activeRole} 
        setActiveRole={setActiveRole}
        mockUsers={mockUsers}
      />

      {/* Main Content Area */}
      <main className="flex-1" id="alis-active-main-container">
        {activeTab === 'landing' && (
          <LandingView 
            onStartExploring={handleStartExploring} 
            onAskAIQuery={handleAskAIQuery}
          />
        )}

        {activeTab === 'search' && (
          <SearchView 
            resources={mockResources} 
            onAskAIAboutResource={handleAskAIAboutResource}
            onViewInKnowledgeGraph={handleViewInKnowledgeGraph}
          />
        )}

        {activeTab === 'ask-ai' && (
          <AskAIView 
            initialPromptText={askAIPrompt} 
            setInitialPromptText={setAskAIPrompt}
            onReferenceClick={handleViewInKnowledgeGraph}
          />
        )}

        {activeTab === 'knowledge-graph' && (
          <KnowledgeGraphView 
            highlightedResourceId={graphFocusResourceId}
            setHighlightedResourceId={setGraphFocusResourceId}
            onAskAIQuery={handleAskAIQuery}
            onCatalogSearch={(tag) => {
              // search
              setActiveTab('search');
            }}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView 
            resources={mockResources} 
            onOpenDetails={(res) => {
              // open search and select this resource modal
              setActiveTab('search');
            }}
            onAskAI={handleAskAIAboutResource}
          />
        )}

        {activeTab === 'collections' && (
          <CollectionsView 
            resources={mockResources}
            onOpenResource={(res) => {
              setActiveTab('search');
            }}
            onAskAI={handleAskAIQuery}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            activeRole={activeRole} 
            resources={mockResources}
            onOpenResource={(res) => {
              setActiveTab('search');
            }}
            onAskAI={handleAskAIQuery}
          />
        )}

        {activeTab === 'admin' && activeRole === 'Admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Campus footer marker */}
      <footer className="border-t border-zinc-200 bg-white py-6" id="alis-general-footer">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-400">
            © 2026 AI Library Intelligence System (ALIS) V2.0 • Digital Academic Preservation Act Compliant.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-[10px] text-zinc-400 uppercase font-mono tracking-tight">
            <span>Status: Operational (99.9% Green)</span>
            <span>•</span>
            <span>Security protocol: Active JWT / RBAC Middleware Layer</span>
            <span>•</span>
            <span>Sandboxed Client Environment</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
