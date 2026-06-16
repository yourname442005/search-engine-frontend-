/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Library, Search, Sparkles, Network, FolderHeart, 
  LayoutDashboard, ShieldAlert, User, History, Settings, 
  LogOut, ChevronDown, BookOpen, Menu, X, ShieldCheck
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeRole: 'Student' | 'Faculty' | 'Librarian' | 'Admin';
  setActiveRole: (role: 'Student' | 'Faculty' | 'Librarian' | 'Admin') => void;
  mockUsers: UserAccount[];
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  activeRole, 
  setActiveRole,
  mockUsers 
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = mockUsers.find(u => u.role === activeRole) || mockUsers[0];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'ask-ai', label: 'Ask AI', icon: Sparkles },
    { id: 'knowledge-graph', label: 'Knowledge Graph', icon: Network },
    { id: 'recommendations', label: 'Recommendations', icon: BookOpen },
    { id: 'collections', label: 'Collections', icon: FolderHeart },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  // Optional Admin tab depending on role
  const isAdmin = activeRole === 'Admin';
  const isLibrarian = activeRole === 'Librarian';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md" id="alis-main-navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabClick('landing')} id="brand-logo-container">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-400/20">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-zinc-900">ALIS <span className="text-xs font-semibold rounded bg-zinc-100 text-zinc-700 px-1.5 py-0.5 ml-1">V2.0</span></span>
              <p className="text-[10px] text-zinc-500 font-mono -mt-1 tracking-wider hidden sm:block">ACADEMIC INTELLIGENCE</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-zinc-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Admin specific tab */}
            {isAdmin && (
              <button
                id="nav-tab-admin"
                onClick={() => handleTabClick('admin')}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                  activeTab === 'admin' 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'text-zinc-600 hover:text-amber-800 hover:bg-amber-50/50'
                }`}
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Right Section: Roles switcher & Profile drop */}
          <div className="flex items-center gap-3">
            
            {/* Quick Simulation Role Selection */}
            <div className="relative">
              <button 
                id="role-switcher-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors shadow-none"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 animate-pulse"></span>
                <span>Role: <strong>{activeRole}</strong></span>
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              {roleMenuOpen && (
                <div id="role-switcher-dropdown" className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-zinc-200 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                    Simulate System Role
                  </div>
                  {(['Student', 'Faculty', 'Librarian', 'Admin'] as const).map((role) => (
                    <button
                      key={role}
                      id={`simulate-role-${role.toLowerCase()}`}
                      onClick={() => {
                        setActiveRole(role);
                        setRoleMenuOpen(false);
                        // Pivot dashboard Tab contexts if user moves roles while in dashboard, for seamless experience
                        if (activeTab === 'dashboard' || activeTab === 'admin') {
                          setActiveTab('dashboard');
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors ${
                        activeRole === role 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'
                      }`}
                    >
                      <span>{role}</span>
                      {activeRole === role && <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="profile-dropdown-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs">
                  {currentUser.name.split(' ').map(n=>n[0]).join('')}
                </div>
              </button>

              {profileOpen && (
                <div id="profile-dropdown-menu" className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-zinc-200 bg-white p-1 shadow-lg ring-1 ring-black/5">
                  <div className="border-b border-zinc-100 px-3 py-2.5">
                    <p className="text-xs font-semibold text-zinc-900">{currentUser.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-flex items-center rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-600 uppercase">
                      {currentUser.role} Account
                    </span>
                  </div>
                  
                  <div className="py-1">
                    <button 
                      onClick={() => { handleTabClick('dashboard'); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      Academic Profile
                    </button>
                    <button 
                      onClick={() => { handleTabClick('dashboard'); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <History className="h-3.5 w-3.5 text-zinc-400" />
                      Reading History
                    </button>
                    <button 
                      onClick={() => { handleTabClick('collections'); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <FolderHeart className="h-3.5 w-3.5 text-zinc-400" />
                      Saved Collections
                    </button>
                    <button 
                      onClick={() => { handleTabClick('dashboard'); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <Settings className="h-3.5 w-3.5 text-zinc-400" />
                      Platform Settings
                    </button>
                  </div>

                  <div className="border-t border-zinc-100 py-1">
                    <button 
                      onClick={() => { setProfileOpen(false); alert("ALIS V2.0 Auth Session Terminated (Mock Logout Completed). To re-enter, refresh the viewport."); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      System Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="border-b border-zinc-200 bg-white py-2 shadow-inner md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            
            {isAdmin && (
              <button
                id="mobile-nav-tab-admin"
                onClick={() => handleTabClick('admin')}
                className={`flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'admin' 
                    ? 'bg-amber-50 text-amber-800' 
                    : 'text-zinc-600 hover:bg-zinc-50 hover:text-amber-800'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                Admin Panel
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
