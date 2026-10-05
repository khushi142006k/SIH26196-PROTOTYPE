/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Activity,
  Sun,
  Moon,
  User,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Building,
  CheckCircle2,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

export function Header() {
  const {
    user,
    role,
    switchRole,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    setOnboardingOpen,
    safetyEvents,
    firebaseUser,
    logout,
    openAuthModal
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingSafetyCount = safetyEvents.filter(e => e.status === 'pending').length;

  const rolesList: { key: UserRole; label: string; desc: string }[] = [
    { key: 'user', label: 'End User', desc: 'Personal fitness journey, workouts & camera coach' },
    { key: 'trainer', label: 'Trainer (Coach)', desc: 'Client roster, plan approval & notes' },
    { key: 'partner_admin', label: 'Partner Admin', desc: 'College/Gym/Corporate dashboard & challenges' },
    { key: 'editor', label: 'Content Editor', desc: 'Exercise library & knowledge base management' },
    { key: 'super_admin', label: 'Super Admin', desc: 'System management, safety queue & audit logs' }
  ];

  const handleProtectedTab = (tabName: string) => {
    if (!firebaseUser) {
      openAuthModal('login');
      return;
    }
    setActiveTab(tabName);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 dark:bg-[#111A2E]/90 backdrop-blur border-b border-[#E2E8F0] dark:border-[#26334F] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-[#0F172A] shadow-md shadow-[#2DD4BF]/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-[#0F172A]" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-1.5">
                FITS-in-ALL
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#0F766E] dark:text-[#5EEAD4] font-semibold block -mt-1">
                Fitness that fits everyone
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'landing'
                ? 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
                : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => handleProtectedTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
                : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => handleProtectedTab('camera')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
                : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
            }`}
          >
            Camera Coach
          </button>

          <button
            onClick={() => handleProtectedTab('challenges')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'challenges'
                ? 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F766E] dark:text-[#5EEAD4] font-semibold'
                : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
            }`}
          >
            Challenges
          </button>

          {firebaseUser && (role === 'partner_admin' || role === 'super_admin') && (
            <button
              onClick={() => handleProtectedTab('partner')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 ${
                activeTab === 'partner'
                  ? 'bg-[#E0E7FF] dark:bg-[#1E1B4B] text-[#312E81] dark:text-[#C7D2FE] font-semibold'
                  : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
              }`}
            >
              <Building className="w-4 h-4" />
              Partner Org
            </button>
          )}

          {firebaseUser && (role === 'editor' || role === 'super_admin') && (
            <button
              onClick={() => handleProtectedTab('admin')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 relative ${
                activeTab === 'admin'
                  ? 'bg-[#FDE8EC] dark:bg-[#BE123C]/20 text-[#BE123C] dark:text-[#F87171] font-semibold'
                  : 'text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Admin
              {pendingSafetyCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#BE123C] dark:bg-[#F87171] absolute top-1 right-1 animate-pulse" />
              )}
            </button>
          )}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Auth State Button (Log In / Sign Up OR Profile & Log Out) */}
          {firebaseUser ? (
            <div className="flex items-center gap-2 bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F] pl-2 pr-1.5 py-1 rounded-xl">
              <img
                src={firebaseUser.photoURL || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                alt={firebaseUser.displayName || user?.name || 'User'}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="hidden lg:inline text-xs font-semibold text-[#0F172A] dark:text-[#E6EDF7] max-w-[110px] truncate">
                {firebaseUser.displayName || user?.name || firebaseUser.email?.split('@')[0]}
              </span>
              <button
                onClick={logout}
                className="p-1 text-[#475569] hover:text-[#BE123C] dark:text-[#9FB0C8] dark:hover:text-[#F87171] transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B] text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#E2E8F0] dark:hover:bg-[#26334F] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2DD4BF] dark:bg-[#5EEAD4] text-xs font-bold text-[#0F172A] dark:text-[#042F2E] hover:bg-[#14B8A6] dark:hover:bg-[#99F6E4] shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Up</span>
              </button>
            </div>
          )}
          
          {/* Persona / Role Selector (Authenticated Only) */}
          {firebaseUser && user && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B] hover:bg-[#E2E8F0] dark:hover:bg-[#26334F] text-[#0F172A] dark:text-[#E6EDF7] font-medium transition-colors"
                title="Switch role"
              >
                <span className="w-2 h-2 rounded-full bg-[#2DD4BF] dark:bg-[#5EEAD4]"></span>
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold capitalize">{role.replace('_', ' ')}</span>
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#FFFFFF] dark:bg-[#111A2E] shadow-xl border border-[#E2E8F0] dark:border-[#26334F] py-2 z-50 text-[#0F172A] dark:text-[#E6EDF7]">
                  <div className="px-3 py-2 border-b border-[#E2E8F0] dark:border-[#26334F] text-xs text-[#475569] dark:text-[#9FB0C8] font-semibold uppercase tracking-wider">
                    Select Role (Access Control)
                  </div>
                  {rolesList.map(r => (
                    <button
                      key={r.key}
                      onClick={() => {
                        switchRole(r.key);
                        setRoleMenuOpen(false);
                        if (r.key === 'partner_admin') setActiveTab('partner');
                        else if (r.key === 'editor' || r.key === 'super_admin') setActiveTab('admin');
                        else setActiveTab('dashboard');
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] flex items-start gap-2 text-xs transition-colors ${
                        role === r.key ? 'bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] font-medium' : ''
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${role === r.key ? 'text-[#0F766E] dark:text-[#5EEAD4]' : 'text-[#475569] dark:text-[#9FB0C8]'}`} />
                      <div>
                        <div className="font-semibold">{r.label}</div>
                        <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8]">{r.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] transition-colors"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-[#FBBF24]" /> : <Moon className="w-5 h-5 text-[#475569]" />}
          </button>

          {/* Quick Onboarding Button */}
          {firebaseUser && (
            <button
              onClick={() => setOnboardingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] brand-gradient shadow-sm hover:opacity-95 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Plan Setup
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] dark:border-[#26334F] bg-[#FFFFFF] dark:bg-[#111A2E] px-4 py-3 space-y-1">
          <button
            onClick={() => { setActiveTab('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            Overview
          </button>
          <button
            onClick={() => { handleProtectedTab('dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            Dashboard
          </button>
          <button
            onClick={() => { handleProtectedTab('camera'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            Camera Coach
          </button>
          <button
            onClick={() => { handleProtectedTab('challenges'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            Challenges
          </button>
          {firebaseUser ? (
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#BE123C] dark:text-[#F87171] hover:bg-[#FDE8EC] dark:hover:bg-[#BE123C]/20"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#0F766E] dark:text-[#5EEAD4] bg-[#CCFBF1] dark:bg-[#0F3D3A]"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
