/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlanEditorModal } from '../planner/PlanEditorModal';
import {
  Flame,
  Zap,
  TrendingUp,
  Play,
  RotateCcw,
  Award,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  Target,
  Info,
  CheckCircle2,
  ListFilter,
  SlidersHorizontal,
  Dumbbell,
  Edit3
} from 'lucide-react';

export function UserDashboard() {
  const {
    user,
    firebaseUser,
    plan,
    streak,
    progressScore,
    setActiveTab,
    setActiveWorkoutId,
    setCameraDemoActive,
    useFreezeToken,
    sessionLogs,
    setOnboardingOpen
  } = useApp();

  const userName = user?.name ? user.name.split(' ')[0] : firebaseUser?.displayName || 'Fitness Member';
  const daysPerWeek = user?.daysPerWeek || plan.weeklyTargetSessions || 3;
  const isLowImpact = user?.lowImpactMode || false;

  const [scoreDetailsOpen, setScoreDetailsOpen] = useState(false);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [planEditorOpen, setPlanEditorOpen] = useState(false);

  // Today's scheduled workout
  const todayWorkout = plan.workouts.find(w => !w.completed) || plan.workouts[0];

  const handleStartTodayWorkout = () => {
    setActiveWorkoutId(todayWorkout.id);
    setActiveTab('workout_player');
  };

  const handleStartQuickSession = () => {
    setActiveWorkoutId('quick-15-min');
    setActiveTab('workout_player');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in pb-20 md:pb-8">
      
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] mb-1">
            <span className="w-2 h-2 rounded-full bg-[#15803D] dark:bg-[#4ADE80] animate-ping"></span>
            <span>Adaptive Engine Active • {daysPerWeek}x Weekly Target</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F172A] dark:text-[#E6EDF7]">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#9FB0C8] mt-1 max-w-xl">
            {isLowImpact
              ? '🌱 Low-impact joint protection enabled. Every workout builds safe strength.'
              : '⚡ Your plan adapts automatically after every session based on your effort & form.'}
          </p>
        </div>

        {/* Streak & Freeze Status */}
        <div className="flex items-center gap-3 bg-[#F1F5F9] dark:bg-[#18233B] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] self-start md:self-auto">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center font-bold text-lg">
            <Flame className="w-6 h-6 text-[#B45309] dark:text-[#FBBF24] fill-[#F59E0B] dark:fill-[#FBBF24]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl text-[#0F172A] dark:text-[#E6EDF7]">
                {streak.currentStreak} Days
              </span>
              <span className="text-[10px] uppercase font-bold text-[#1C1917] bg-[#F59E0B] dark:bg-[#FBBF24] px-1.5 py-0.5 rounded">
                Streak
              </span>
            </div>
            <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8] flex items-center gap-1">
              <span>{streak.freezeTokens} Freeze Token Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Grid: 0-100 Fitness Progress Score Ring & Today's Workout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Score Widget (0-100) */}
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider">
                Fitness Progress Score
              </div>
              <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8]">
                App metric, not medical advice
              </div>
            </div>
            <button
              onClick={() => setScoreDetailsOpen(!scoreDetailsOpen)}
              className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] dark:hover:text-[#E6EDF7] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
              title="Score breakdown info"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-center justify-center relative">
            {/* Circle Ring Visualization */}
            <div className="w-32 h-32 rounded-full brand-gradient p-2 flex items-center justify-center shadow-lg shadow-[#2DD4BF]/20">
              <div className="w-full h-full bg-[#FFFFFF] dark:bg-[#111A2E] rounded-full flex flex-col items-center justify-center">
                <span className="font-mono-numbers font-black text-3xl text-[#0F172A] dark:text-[#E6EDF7]">
                  {progressScore.total}
                </span>
                <span className="text-[10px] text-[#0F766E] dark:text-[#5EEAD4] font-bold uppercase tracking-widest">
                  / 100
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#475569] dark:text-[#9FB0C8] bg-[#F1F5F9] dark:bg-[#18233B] p-3 rounded-xl border border-[#E2E8F0] dark:border-[#26334F]">
            <p className="font-medium text-[#0F172A] dark:text-[#E6EDF7]">
              {progressScore.explanation}
            </p>
            <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#26334F] grid grid-cols-2 gap-2 text-[11px]">
              <div>Consistency: <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{progressScore.consistency}/35</span></div>
              <div>Progression: <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{progressScore.progression}/25</span></div>
              <div>Activity: <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{progressScore.activity}/20</span></div>
              <div>Technique: <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4]">{progressScore.technique}/10</span></div>
            </div>
          </div>
        </div>

        {/* Today's Scheduled Workout Card */}
        <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 brand-gradient opacity-10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] font-bold text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Today's Scheduled Workout
              </span>
              <span className="text-xs font-medium text-[#475569] dark:text-[#9FB0C8] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#5EEAD4]" />
                ~{todayWorkout.estMinutes} Minutes
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
              {todayWorkout.title}
            </h2>

            {/* Adaptation Reason Tag */}
            {todayWorkout.adaptationReason && (
              <div className="mt-2 text-xs text-[#312E81] dark:text-[#C7D2FE] bg-[#E0E7FF] dark:bg-[#1E1B4B] p-2.5 rounded-xl border border-[#A5B4FC]/40 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#4F46E5] dark:text-[#A5B4FC] shrink-0 mt-0.5" />
                <span>
                  <strong className="font-semibold">Why this?</strong> {todayWorkout.adaptationReason}
                </span>
              </div>
            )}

            {/* Warm-up & Cool-down Indicators */}
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-[#475569] dark:text-[#9FB0C8]">
              {todayWorkout.warmup && todayWorkout.warmup.length > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
                  🔥 Warm-up: {todayWorkout.warmup.map(w => w.exerciseName).join(', ')}
                </span>
              )}
              {todayWorkout.cooldown && todayWorkout.cooldown.length > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
                  🧊 Cool-down: {todayWorkout.cooldown.map(c => c.exerciseName).join(', ')}
                </span>
              )}
            </div>

            {/* Exercise List Preview */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {todayWorkout.exercises.slice(0, 3).map((we, idx) => (
                <div
                  key={we.id}
                  className="p-2.5 bg-[#F1F5F9] dark:bg-[#18233B] rounded-xl border border-[#E2E8F0] dark:border-[#26334F] text-xs"
                >
                  <div className="font-semibold text-[#0F172A] dark:text-[#E6EDF7] truncate">
                    {idx + 1}. {we.exerciseName}
                  </div>
                  <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8] mt-0.5 flex justify-between">
                    <span>{we.sets} sets × {we.targetReps ? `${we.targetReps} reps` : '30s hold'}</span>
                    <span className="text-[#0F766E] dark:text-[#5EEAD4] font-bold">RPE {we.targetRpe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#26334F] flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleStartTodayWorkout}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl brand-gradient text-[#0F172A] font-extrabold text-sm shadow-md hover:opacity-95 transition-all"
            >
              <Play className="w-4 h-4 fill-[#0F172A]" />
              Start Workout Now
            </button>

            <button
              onClick={() => {
                setActiveWorkoutId(todayWorkout.id);
                setActiveTab('camera');
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] text-[#0F172A] dark:text-[#E6EDF7] text-xs font-semibold hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
            >
              📹 Camera Coach Mode
            </button>
          </div>
        </div>

      </div>

      {/* PERSONALIZED ADAPTIVE PLAN OVERVIEW & SCHEDULE */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#26334F] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] dark:text-[#5EEAD4] bg-[#CCFBF1] dark:bg-[#0F3D3A] px-2.5 py-0.5 rounded-full">
                Personalized Plan
              </span>
              <span className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                v{plan.version} Adaptive Cycle
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-xl text-[#0F172A] dark:text-[#E6EDF7] mt-1">
              {plan.name || 'Personalized Adaptive Fitness Program'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPlanEditorOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] font-extrabold text-xs shadow-sm hover:opacity-95 transition-opacity"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Exercises / Custom Plan
            </button>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F] text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#E2E8F0] dark:hover:bg-[#26334F] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#5EEAD4]" />
              Re-customize
            </button>
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] hover:underline"
            >
              {showFullSchedule ? 'Hide Schedule' : 'View Full Schedule'}
            </button>
          </div>
        </div>

        {/* Plan Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="text-[#475569] dark:text-[#9FB0C8]">Fitness Goal</div>
            <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7] capitalize mt-0.5">
              {(plan.goal || user?.goal || 'build_strength').replace('_', ' ')}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="text-[#475569] dark:text-[#9FB0C8]">Difficulty Level</div>
            <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7] capitalize mt-0.5">
              {plan.difficulty || user?.level || 'beginner'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="text-[#475569] dark:text-[#9FB0C8]">Weekly Target</div>
            <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7] mt-0.5">
              {plan.weeklyTargetSessions || daysPerWeek} Days / Week
            </div>
          </div>
          <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="text-[#475569] dark:text-[#9FB0C8]">Duration Target</div>
            <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7] mt-0.5">
              ~{user?.sessionMinutes || 20} Mins / Session
            </div>
          </div>
        </div>

        {/* Workouts Schedule List */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider">
            {showFullSchedule ? 'All 4-Week Workouts' : 'Upcoming Sessions'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(showFullSchedule ? plan.workouts : plan.workouts.slice(0, 4)).map((w, idx) => (
              <div
                key={w.id}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-2 transition-all ${
                  w.completed
                    ? 'bg-[#F1F5F9] dark:bg-[#18233B] border-[#E2E8F0] dark:border-[#26334F] opacity-75'
                    : w.id === todayWorkout.id
                    ? 'bg-[#CCFBF1]/40 dark:bg-[#0F3D3A]/40 border-[#2DD4BF] dark:border-[#5EEAD4]'
                    : 'bg-[#FFFFFF] dark:bg-[#111A2E] border-[#E2E8F0] dark:border-[#26334F]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-1.5">
                      <span>{w.title}</span>
                      {w.completed && (
                        <span className="text-[10px] bg-[#15803D]/20 text-[#15803D] dark:text-[#4ADE80] font-bold px-1.5 py-0.2 rounded">
                          Done ✓
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8] mt-0.5">
                      ~{w.estMinutes} mins • {w.exercises.length} exercises
                    </div>
                  </div>

                  {!w.completed && (
                    <button
                      onClick={() => {
                        setActiveWorkoutId(w.id);
                        setActiveTab('workout_player');
                      }}
                      className="px-3 py-1 rounded-lg brand-gradient text-[#0F172A] font-extrabold text-[11px] shrink-0"
                    >
                      Start
                    </button>
                  )}
                </div>

                {w.adaptationReason && (
                  <div className="text-[11px] text-[#312E81] dark:text-[#C7D2FE] bg-[#E0E7FF] dark:bg-[#1E1B4B] p-2 rounded-lg">
                    ⚡ {w.adaptationReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Quick 15-Min Session Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0F766E] dark:bg-[#0F3D3A] dark:text-[#5EEAD4] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F172A] dark:text-[#E6EDF7]">
                15-Min Quick Blast
              </div>
              <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                Short on time? Instant no-equipment workout.
              </div>
            </div>
          </div>
          <button
            onClick={handleStartQuickSession}
            className="p-2 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#2DD4BF] hover:text-[#0F172A] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Coach Demo Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0E7FF] text-[#4F46E5] dark:bg-[#1E1B4B] dark:text-[#C7D2FE] flex items-center justify-center font-bold">
              📹
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F172A] dark:text-[#E6EDF7]">
                Pose CV Rep Counter
              </div>
              <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                Squat, Push-up, Lunge & Jack AI Form Cues.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('camera')}
            className="p-2 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#A5B4FC] hover:text-[#1E1B4B] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Ask Fitz AI Assistant Card */}
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-4 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A5B4FC] text-[#1E1B4B] flex items-center justify-center font-bold">
              🤖
            </div>
            <div>
              <div className="font-bold text-sm text-[#0F172A] dark:text-[#E6EDF7]">
                Ask Fitz AI Coach
              </div>
              <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                "My knee hurts", "Swap squat", "Why did score change?"
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('assistant')}
            className="p-2 rounded-xl bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#818CF8] hover:text-[#1E1B4B] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Plan & Exercise Customizer Modal */}
      <PlanEditorModal
        isOpen={planEditorOpen}
        onClose={() => setPlanEditorOpen(false)}
      />

    </div>
  );
}
