/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, Move, RefreshCw, Layers, Sparkles, 
  Search, ExternalLink, HelpCircle, Network, Info
} from 'lucide-react';
import { graphNodes, graphLinks, mockResources } from '../data/mockData';

interface KnowledgeGraphViewProps {
  highlightedResourceId?: string;
  setHighlightedResourceId: (id: string) => void;
  onAskAIQuery: (topic: string) => void;
  onCatalogSearch: (query: string) => void;
}

export default function KnowledgeGraphView({
  highlightedResourceId,
  setHighlightedResourceId,
  onAskAIQuery,
  onCatalogSearch
}: KnowledgeGraphViewProps) {
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Graph States
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // If a resource was highlighted from search card direct link:
  useEffect(() => {
    if (highlightedResourceId) {
      setSelectedNodeId(highlightedResourceId);
      // center on selected node
      const targetNode = graphNodes.find(n => n.id === highlightedResourceId);
      if (targetNode) {
        setPanOffset({
          x: 400 - targetNode.x,
          y: 300 - targetNode.y
        });
      }
      setHighlightedResourceId(''); // clear state
    }
  }, [highlightedResourceId]);

  // Extract info for details panel
  const selectedNodeData = useMemo(() => {
    if (!selectedNodeId) return null;
    const baseNode = graphNodes.find(n => n.id === selectedNodeId);
    if (!baseNode) return null;

    // Check if matching full academic resource
    const connectedResource = mockResources.find(r => r.id === selectedNodeId);

    // Calculate node connections count
    const connectionsCount = graphLinks.filter(l => 
      l.source === selectedNodeId || l.target === selectedNodeId
    ).length;

    return {
      ...baseNode,
      connectedResource,
      connectionsCount
    };
  }, [selectedNodeId]);

  // Helper matching colors
  const nodeStyles: Record<string, { bg: string; border: string; text: string }> = {
    topic: { bg: 'rgba(59, 130, 246, 0.95)', border: '#2563eb', text: '#1e3a8a' }, // Blue
    paper: { bg: 'rgba(168, 85, 247, 0.95)', border: '#9333ea', text: '#581c87' }, // Purple
    book: { bg: 'rgba(234, 179, 8, 0.95)', border: '#ca8a04', text: '#713f12' },   // Yellow
    journal: { bg: 'rgba(236, 72, 153, 0.95)', border: '#db2777', text: '#700c2f' }, // Pink
    author: { bg: 'rgba(16, 185, 129, 0.95)', border: '#059669', text: '#064e3b' }  // Emerald
  };

  // Canvas Drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill dark/light theme background (minimal light background matching Notion style)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f8fafc'; // light grid canvas back
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Context Transformation
    ctx.save();
    ctx.translate(panOffset.x + canvas.width / 2, panOffset.y + canvas.height / 2);
    ctx.scale(zoom, zoom);

    // Translate coordinates centered
    const centeringX = -400; 
    const centeringY = -250;

    // Filtered connections
    const highlightedLinks = new Set<string>();
    const isNodeMuted = (nodeId: string) => {
      // If there is inquiry query, mute non-matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nodeObj = graphNodes.find(n => n.id === nodeId);
        if (nodeObj && !nodeObj.label.toLowerCase().includes(query)) return true;
      }
      // If a node is selected, mute nonconnected nodes
      if (selectedNodeId) {
        if (selectedNodeId === nodeId) return false;
        // is connected?
        const isConnected = graphLinks.some(l => 
          (l.source === selectedNodeId && l.target === nodeId) ||
          (l.target === selectedNodeId && l.source === nodeId)
        );
        return !isConnected;
      }
      return false;
    };

    // 1. Draw Links / Connections first so they sit background
    ctx.lineWidth = 1.3;
    graphLinks.forEach((link, idx) => {
      const sourceNode = graphNodes.find(n => n.id === link.source);
      const targetNode = graphNodes.find(n => n.id === link.target);

      if (sourceNode && targetNode) {
        const sx = sourceNode.x + centeringX;
        const sy = sourceNode.y + centeringY;
        const tx = targetNode.x + centeringX;
        const ty = targetNode.y + centeringY;

        const isSourceMuted = isNodeMuted(sourceNode.id);
        const isTargetMuted = isNodeMuted(targetNode.id);
        const isActiveLink = selectedNodeId === sourceNode.id || selectedNodeId === targetNode.id;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);

        if (isActiveLink) {
          ctx.strokeStyle = '#2563eb'; // brilliant blue lines for active selected relationships
          ctx.lineWidth = 2.0;
        } else if (isSourceMuted || isTargetMuted) {
          ctx.strokeStyle = 'rgba(226, 232, 240, 0.3)'; // faded lines
          ctx.lineWidth = 0.8;
        } else {
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.75)'; // normal link
          ctx.lineWidth = 1.1;
        }
        ctx.stroke();
      }
    });

    // 2. Draw Nodes
    graphNodes.forEach((node) => {
      const x = node.x + centeringX;
      const y = node.y + centeringY;
      const isMuted = isNodeMuted(node.id);
      const isSelected = selectedNodeId === node.id;
      const isHovered = hoveredNodeId === node.id;

      const style = nodeStyles[node.type] || nodeStyles.topic;

      ctx.beginPath();
      // compute visual radii
      let radii = node.size / 2;
      if (isSelected) radii += 4;
      if (isHovered) radii += 2;

      ctx.arc(x, y, radii, 0, 2 * Math.PI);

      if (isMuted) {
        ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
        ctx.strokeStyle = 'rgba(203, 213, 225, 0.4)';
      } else {
        ctx.fillStyle = style.bg;
        ctx.strokeStyle = style.border;
      }
      
      ctx.lineWidth = isSelected ? 3.0 : 1.5;
      ctx.fill();
      ctx.stroke();

      // Add elegant ring overlay for selected item
      if (isSelected && !isMuted) {
        ctx.beginPath();
        ctx.arc(x, y, radii + 4, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // 3. Node Labels Text Rendering
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query && node.label.toLowerCase().includes(query);

      // Render text if not muted, or if selected, or if zoom scale is large enough to show text
      if (!isMuted || isSelected || matchesSearch) {
        ctx.fillStyle = isMuted ? 'rgba(148, 163, 184, 0.35)' : '#0f172a';
        ctx.font = isSelected 
          ? 'bold 11px Inter, system-ui, sans-serif' 
          : matchesSearch
            ? 'bold 10px Inter, system-ui, sans-serif'
            : '9px Inter, system-ui, sans-serif';
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Draw matching search yellow backdrop highlight if needed
        if (matchesSearch) {
          const metrics = ctx.measureText(node.label);
          ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
          ctx.fillRect(x - metrics.width/2 - 2, y + radii + 3, metrics.width + 4, 12);
          ctx.fillStyle = '#854d0e';
        }

        ctx.fillText(node.label, x, y + radii + 5);
      }
    });

    ctx.restore();

  }, [zoom, panOffset, selectedNodeId, hoveredNodeId, searchQuery]);

  // Interactivity Canvas Math Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
      return;
    }

    // Hover detection math
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Back-project coordinates out of transforms
    const centeringX = -400;
    const centeringY = -250;
    const graphSpaceX = (mx - canvas.width / 2 - panOffset.x) / zoom - centeringX;
    const graphSpaceY = (my - canvas.height / 2 - panOffset.y) / zoom - centeringY;

    // Find if mouse coordinates hit node radius boundary
    let foundHoverId: string | null = null;
    for (const node of graphNodes) {
      const dx = graphSpaceX - node.x;
      const dy = graphSpaceY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < (node.size / 2 + 5)) {
        foundHoverId = node.id;
        break;
      }
    }

    setHoveredNodeId(foundHoverId);
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(false);

    // If mouse didn't drag far, it's a CLICK trigger on node
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const centeringX = -400;
    const centeringY = -250;
    const graphSpaceX = (mx - canvas.width / 2 - panOffset.x) / zoom - centeringX;
    const graphSpaceY = (my - canvas.height / 2 - panOffset.y) / zoom - centeringY;

    let clickedNodeId: string | null = null;
    for (const node of graphNodes) {
      const dx = graphSpaceX - node.x;
      const dy = graphSpaceY - node.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < (node.size / 2 + 5)) {
        clickedNodeId = node.id;
        break;
      }
    }

    setSelectedNodeId(clickedNodeId);
  };

  // Reset Graph view positioning
  const handleResetGraph = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
    setSelectedNodeId(null);
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="knowledge-graph-screen-root">
      
      {/* Header */}
      <div className="mb-6" id="graph-header-meta">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Knowledge Graph Exploration</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Explore structured references, co-author publications, and citation clusters. Drag the canvas to pan, scroll to zoom, click nodes to expand bibliographies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="graph-layout-container">
        
        {/* Interactive Canvas Workspace (occupies 3 out of 4 columns) */}
        <div className="lg:col-span-3 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm relative overflow-hidden" id="graph-canvas-workspace">
          
          {/* Controls Bar Overlay */}
          <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-1 bg-white/90 backdrop-blur border border-zinc-200 rounded-lg p-1 shadow-sm" id="graph-zoom-controller">
            <button
              id="graph-zoom-in-btn"
              onClick={() => setZoom(z => Math.min(z + 0.15, 2.5))}
              className="p-1.5 rounded hover:bg-zinc-100 text-zinc-650"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              id="graph-zoom-out-btn"
              onClick={() => setZoom(z => Math.max(z - 0.15, 0.4))}
              className="p-1.5 rounded hover:bg-zinc-100 text-zinc-650"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              id="graph-pan-reset-btn"
              onClick={handleResetGraph}
              className="p-1.5 rounded hover:bg-zinc-100 text-zinc-650 font-medium text-xs flex items-center gap-1"
              title="Reset view layout"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Center View</span>
            </button>
          </div>

          {/* Search bar inside graph overlay */}
          <div className="absolute top-4 right-4 z-10 w-44 sm:w-56" id="graph-search-overlay-input">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                id="graph-entities-search-bar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search nodes..."
                className="w-full text-xs font-semibold rounded-lg border border-zinc-200 bg-white/90 pl-8 pr-3 py-2 placeholder-zinc-400 focus:outline-none focus:border-blue-500 shadow-sm"
              />
            </div>
          </div>

          {/* Actual HTML5 Interactive Canvas */}
          <canvas
            id="obsidian-style-canvas"
            ref={canvasRef}
            width={780}
            height={500}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="w-full h-[500px] cursor-grab active:cursor-grabbing block bg-zinc-50 rounded-lg"
          />

          {/* Color Key Ribbon */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur border border-zinc-150 rounded-lg py-2 px-3 justify-center text-[10px] uppercase font-mono font-bold tracking-tight shadow-sm" id="graph-color-keys">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-blue-500"></span>
              <span>Topics</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-purple-500"></span>
              <span>Scientific Papers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-emerald-500"></span>
              <span>Authors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-yellow-500"></span>
              <span>Reference Books</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded bg-pink-500"></span>
              <span>Journals</span>
            </div>
          </div>

        </div>

        {/* Selected Entity Details Sidebar */}
        <div className="lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm" id="graph-selected-node-details">
          {selectedNodeData ? (
            <div className="space-y-4" id="graph-active-panel-body">
              
              {/* Header */}
              <div>
                <span className="text-[9px] font-mono font-bold uppercase rounded bg-zinc-100 text-zinc-650 px-2 py-0.5 inline-block">
                  {selectedNodeData.type} Node Info
                </span>
                <h3 className="text-base font-bold text-zinc-900 leading-snug mt-1.5">
                  {selectedNodeData.label}
                </h3>
                <span className="text-xs text-zinc-400 block font-mono mt-0.5">
                  Node Index: #{selectedNodeData.id}
                </span>
              </div>

              {/* Connected relations statistics */}
              <div className="rounded-lg bg-zinc-50 border border-zinc-150 p-3 text-xs font-sans">
                <span className="text-zinc-400 block font-medium">Adjacent Semantic Links</span>
                <span className="text-sm font-extrabold text-zinc-800">{selectedNodeData.connectionsCount} Active Neighbors</span>
              </div>

              {/* Deep research paper summaries if matching ID */}
              {selectedNodeData.connectedResource ? (
                <div className="space-y-3 pt-3 border-t border-zinc-150">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">Co-Authors</span>
                    <p className="text-xs font-semibold text-zinc-700">
                      {selectedNodeData.connectedResource.authors.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">Department Scope</span>
                    <p className="text-xs font-semibold text-zinc-700">
                      {selectedNodeData.connectedResource.department}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">Abstract Extract</span>
                    <p className="text-xs text-zinc-500 leading-relaxed max-h-32 overflow-y-auto pr-1">
                      {selectedNodeData.connectedResource.abstract}
                    </p>
                  </div>

                  {/* Immediate actions shifting active tab state contextually */}
                  <div className="flex flex-col gap-2 pt-2" id="node-panel-cta-buttons">
                    <button
                      id="node-action-ask-ai-link"
                      onClick={() => onAskAIQuery(`Explain the core context and contributions of the node file: "${selectedNodeData.label}"`)}
                      className="w-full rounded bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                      <span>Ask AI regarding this Node</span>
                    </button>
                    <button
                      id="node-action-search-catalogue-link"
                      onClick={() => onCatalogSearch(selectedNodeData.label)}
                      className="w-full rounded border border-zinc-250 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Search Catalog Dossier</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-zinc-150 text-xs text-zinc-500 space-y-3">
                  <p className="leading-relaxed">
                    This is a consolidated **{selectedNodeData.type}** index layer node. It serves as an overlay bridging citations across our multi-resource repository.
                  </p>
                  <button
                    id="node-action-lexical-trigger"
                    onClick={() => onCatalogSearch(selectedNodeData.label)}
                    className="w-full rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-3 py-2 text-left text-[11px] font-semibold text-zinc-700 flex items-center justify-between"
                  >
                    <span>Search for similar &quot;{selectedNodeData.label}&quot;</span>
                    <ExternalLink className="h-3 w-3 text-zinc-400" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400 text-xs flex flex-col items-center justify-center gap-3" id="no-node-selected-state">
              <Info className="h-6 w-6 text-zinc-300" />
              <span>Select any node on the left coordinate map to browse research connections panel lists.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
