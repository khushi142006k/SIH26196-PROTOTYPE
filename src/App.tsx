/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { AuthModal } from './components/auth/AuthModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { WorkoutPlayer } from './components/workout/WorkoutPlayer';
import { CameraCoach } from './components/camera/CameraCoach';
import { JourneyView } from './components/journey/JourneyView';
import { ChallengesView } from './components/gamification/ChallengesView';
import { FitzAssistant } from './components/assistant/FitzAssistant';
import { PartnerDashboard } from './components/partner/PartnerDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { LandingPage } from './components/landing/LandingPage';
import { ShieldAlert, Loader2, Lock, ArrowLeft } from 'lucide-react';

function UnauthorizedView({ requiredRole }: { requiredRole: string }) {
  const { setActiveTab } = useApp();

  return (
    <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-xl text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#FDE8EC] dark:bg-[#BE123C]/20 text-[#BE123C] dark:text-[#F87171] flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
        Access Restricted
      </h2>
      <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
        You need the <span className="font-semibold text-[#0F766E] dark:text-[#5EEAD4] capitalize">{requiredRole.replace('_', ' ')}</span> role to access this panel.
      </p>
      <button
        onClick={() => setActiveTab('dashboard')}
        className="px-6 py-2.5 rounded-xl bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] font-bold text-sm shadow-md inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </button>
    </div>
  );
}

function MainContent() {
  const {
    activeTab,
    onboardingOpen,
    firebaseUser,
    authLoading,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    openAuthModal,
    role
  } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#0F766E] dark:text-[#5EEAD4]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase">Loading Session...</span>
        </div>
      </div>
    );
  }

  const isProtectedRoute = activeTab !== 'landing';

  // If unauthenticated user attempts to visit protected route, show Landing Page with Auth prompt
  if (isProtectedRoute && !firebaseUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E6EDF7] flex flex-col font-sans transition-colors">
        <Header />
        
        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 text-center space-y-6">
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#0F766E] dark:text-[#5EEAD4] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
              Authentication Required
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Please log in or create an account to access your personalized fitness dashboard and features.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-6 py-2.5 rounded-xl bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="px-6 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] font-bold text-sm hover:bg-[#E2E8F0] dark:hover:bg-[#26334F] transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
        />
        <BottomNav />
      </div>
    );
  }

  // Role-based access control checks
  const canAccessAdmin = role === 'editor' || role === 'super_admin';
  const canAccessPartner = role === 'partner_admin' || role === 'super_admin';

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#0F172A] dark:text-[#E6EDF7] flex flex-col font-sans transition-colors">
      <Header />

      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage />}
        {activeTab === 'dashboard' && <UserDashboard />}
        {activeTab === 'workout_player' && <WorkoutPlayer />}
        {activeTab === 'camera' && <CameraCoach />}
        {activeTab === 'journey' && <JourneyView />}
        {activeTab === 'challenges' && <ChallengesView />}
        {activeTab === 'assistant' && <FitzAssistant />}
        
        {activeTab === 'partner' && (
          canAccessPartner ? <PartnerDashboard /> : <UnauthorizedView requiredRole="Partner Admin" />
        )}

        {activeTab === 'admin' && (
          canAccessAdmin ? <AdminPanel /> : <UnauthorizedView requiredRole="Admin" />
        )}
      </main>

      {onboardingOpen && <OnboardingWizard />}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
