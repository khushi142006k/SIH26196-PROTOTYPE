/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Sparkles,
  Camera,
  ShieldCheck,
  TrendingUp,
  Zap,
  Users,
  Building,
  Check,
  ChevronDown,
  Play,
  ArrowRight
} from 'lucide-react';

export function LandingPage() {
  const { firebaseUser, openAuthModal, setOnboardingOpen, setActiveTab } = useApp();

  const [activePersonaTab, setActivePersonaTab] = useState<'students' | 'beginners' | 'gym' | 'teams'>('students');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleStartCta = () => {
    if (firebaseUser) {
      setActiveTab('dashboard');
    } else {
      openAuthModal('signup');
    }
  };

  const handleCameraCta = () => {
    if (firebaseUser) {
      setActiveTab('camera');
    } else {
      openAuthModal('login');
    }
  };

  const personas = {
    students: {
      title: 'Hostel & Campus Friendly',
      desc: 'Fits in 15–20 minutes in a small room with zero equipment. Join inter-department campus challenges and climb consistency leaderboards with your hostel friends!',
      cta: 'Start Free Campus Workout'
    },
    beginners: {
      title: 'Gentle, Safe & Low-Impact',
      desc: 'Joint-friendly Low-Impact mode auto-protects knees and back. Real-time form cues guide you softly without intimidation.',
      cta: 'Try Low-Impact Mode'
    },
    gym: {
      title: 'Progressive Overload for Gym Members',
      desc: 'Track PRs, set volume progression, RPE ratings, and deload weeks automatically calculated after every session.',
      cta: 'Build Strength Plan'
    },
    teams: {
      title: 'Colleges, Gyms & Corporate Wellness',
      desc: 'Run privacy-first wellness programs with domain auto-join, anonymised participation analytics, and custom team challenges.',
      cta: 'Explore Partner Programs'
    }
  };

  const faqs = [
    {
      q: 'Does the Camera Coach record or upload video of me?',
      a: 'No, absolutely not. All computer vision pose detection runs locally inside your browser device memory. No video frames ever leave your device.'
    },
    {
      q: 'What if I only have 15 minutes a day?',
      a: 'FITS-in-ALL is built around time constraints! You can select 10, 15, 20, 30, or 45-minute targets. Even 15 minutes daily builds lasting consistency points.'
    },
    {
      q: 'Is this app medical advice or diagnosis?',
      a: 'No. FITS-in-ALL provides general fitness guidance and motivation. It is not a medical device. If you report joint pain or medical conditions, the safety layer advises consulting a healthcare professional.'
    },
    {
      q: 'How does the adaptive workout engine work?',
      a: 'After every workout, you rate effort (RPE) and feel ("too easy", "just right", "too hard"). The engine immediately adapts the reps, rest, or variation for your next session.'
    }
  ];

  return (
    <div className="space-y-16 py-8 animate-fade-in pb-24 md:pb-16">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] font-bold text-xs shadow-sm">
          <Sparkles className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4] animate-spin" />
          <span>Fitness That Fits Everyone • Personalised AI Companion</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-6xl text-[#0F172A] dark:text-[#E6EDF7] tracking-tight leading-tight max-w-4xl mx-auto">
          Personalised fitness that <span className="brand-gradient-text">fits your life</span>, time, and goals.
        </h1>

        <p className="text-base sm:text-lg text-[#475569] dark:text-[#9FB0C8] max-w-2xl mx-auto leading-relaxed">
          An adaptive AI trainer, camera-based computer vision coach, 0–100 progress score, and safety-first assistant—all in one installable app.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={handleStartCta}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl brand-gradient text-[#0F172A] font-extrabold text-base shadow-xl shadow-[#2DD4BF]/20 hover:scale-105 transition-transform"
          >
            Start Free Now
            <ArrowRight className="w-5 h-5 text-[#0F172A]" />
          </button>

          <button
            onClick={handleCameraCta}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#111A2E] text-[#0F172A] dark:text-[#E6EDF7] border border-[#E2E8F0] dark:border-[#26334F] font-bold text-sm hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] transition-colors shadow-sm"
          >
            <Camera className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
            Try Camera Coach
          </button>
        </div>
      </section>

      {/* KEY PILLARS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#0F766E] dark:text-[#5EEAD4] flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#E6EDF7]">Adaptive Workouts</h3>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Auto-calibrates target reps, weights, and rest based on your post-workout effort rating and feel feedback.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#E0E7FF] dark:bg-[#1E1B4B] text-[#4F46E5] dark:text-[#A5B4FC] flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#E6EDF7]">Camera Pose Coach</h3>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Real-time pose estimation evaluates squat depth, spine alignment, and rep counts privately inside your device browser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4D6] dark:bg-[#18233B] text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#E6EDF7]">0–100 Fitness Score</h3>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Consolidates consistency, progression, form quality, and recovery into a transparent, actionable daily metric.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0F766E] dark:text-[#5EEAD4]" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#E6EDF7]">Safety & Privacy First</h3>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Joint-safe low-impact alternatives, instant pain detection interrupts, and zero video frames sent to cloud servers.
            </p>
          </div>
        </div>
      </section>

      {/* PERSONAS TABBED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] dark:border-[#26334F] shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#0F172A] dark:text-[#E6EDF7]">
              Built for Every Lifestyle & Persona
            </h2>
            <p className="text-sm text-[#475569] dark:text-[#9FB0C8]">
              Choose your profile to see how FITS-in-ALL adapts specifically to you
            </p>
          </div>

          {/* Persona selector tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#F1F5F9] dark:bg-[#18233B] rounded-2xl max-w-2xl mx-auto">
            {(['students', 'beginners', 'gym', 'teams'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActivePersonaTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${
                  activePersonaTab === tab
                    ? 'bg-[#FFFFFF] dark:bg-[#111A2E] text-[#0F766E] dark:text-[#5EEAD4] shadow-sm'
                    : 'text-[#475569] dark:text-[#9FB0C8] hover:text-[#0F172A] dark:hover:text-[#E6EDF7]'
                }`}
              >
                {tab === 'students' && 'Students & Hostels'}
                {tab === 'beginners' && 'Beginners & Low Impact'}
                {tab === 'gym' && 'Gym & Lifting'}
                {tab === 'teams' && 'Corporate & Colleges'}
              </button>
            ))}
          </div>

          {/* Active persona box */}
          <div className="max-w-3xl mx-auto bg-[#F1F5F9] dark:bg-[#18233B] rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] dark:border-[#26334F] text-center space-y-4 animate-fade-in">
            <h3 className="font-heading font-black text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
              {personas[activePersonaTab].title}
            </h3>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#9FB0C8] leading-relaxed">
              {personas[activePersonaTab].desc}
            </p>
            <button
              onClick={handleStartCta}
              className="px-6 py-3 rounded-xl brand-gradient text-[#0F172A] font-extrabold text-sm shadow-md hover:scale-105 transition-transform"
            >
              {personas[activePersonaTab].cta}
            </button>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center text-[#0F172A] dark:text-[#E6EDF7]">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7]"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${openFaqIdx === idx ? 'rotate-180 text-[#0F766E] dark:text-[#5EEAD4]' : 'text-[#475569]'}`} />
              </button>
              {openFaqIdx === idx && (
                <div className="px-5 pb-5 text-sm text-[#475569] dark:text-[#9FB0C8] border-t border-[#E2E8F0] dark:border-[#26334F] pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
