/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getExerciseById } from '../../data/exercises';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Camera,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export function WorkoutPlayer() {
  const { plan, activeWorkoutId, logCompletedSession, setActiveTab, user, firebaseUser } = useApp();

  // Find selected workout
  const workout = plan.workouts.find(w => w.id === activeWorkoutId) || plan.workouts[0];

  const [currentExIdx, setCurrentExIdx] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [completedSets, setCompletedSets] = useState<{ [exId: string]: number }>({});
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isRestMode, setIsRestMode] = useState<boolean>(false);

  // Post-Workout Rating Modal
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [rpe, setRpe] = useState<number>(7);
  const [feelRating, setFeelRating] = useState<'too_easy' | 'just_right' | 'too_hard'>('just_right');
  const [painFlag, setPainFlag] = useState<boolean>(false);

  const currentWE = workout.exercises[currentExIdx] || workout.exercises[0];
  const currentExercise = getExerciseById(currentWE?.exerciseId) || {
    id: currentWE?.exerciseId || 'ex-default',
    slug: 'default',
    name: currentWE?.exerciseName || 'Bodyweight Movement',
    category: 'strength' as const,
    level: 'beginner' as const,
    impactClass: 'low' as const,
    muscles: ['Full Body'],
    equipment: ['none' as const],
    instructions: currentWE?.instructions || ['Maintain smooth control through motion.'],
    cues: currentWE?.cues || ['Keep core tight', 'Breathe steadily'],
    contraindications: currentWE?.safetyNotes || [],
    poseSupported: false,
    regressions: [],
    progressions: []
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (isRestMode) {
        setIsRestMode(false);
        setTimerSeconds(currentWE?.restSeconds || 30);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, isRestMode, currentWE]);

  const handleCompleteSet = () => {
    const totalSetsForEx = currentWE.sets;

    if (currentSet < totalSetsForEx) {
      setCurrentSet(s => s + 1);
      // Start rest timer
      setIsRestMode(true);
      setTimerSeconds(currentWE.restSeconds || 30);
      setIsTimerRunning(true);
    } else {
      // Mark exercise complete
      setCompletedSets(prev => ({ ...prev, [currentWE.id]: totalSetsForEx }));
      
      if (currentExIdx < workout.exercises.length - 1) {
        setCurrentExIdx(idx => idx + 1);
        setCurrentSet(1);
        setIsRestMode(true);
        setTimerSeconds(45);
        setIsTimerRunning(true);
      } else {
        // Workout Finished! Trigger celebration and rating modal
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setShowRatingModal(true);
      }
    }
  };

  const handleFinishAndSave = () => {
    logCompletedSession({
      id: `session-${Date.now()}`,
      userId: user?.id || firebaseUser?.uid || 'usr-w',
      planWorkoutId: workout.id,
      startedAt: new Date(Date.now() - workout.estMinutes * 60000).toISOString(),
      endedAt: new Date().toISOString(),
      completionPct: 100,
      rpe,
      feelRating,
      painFlag,
      usedCamera: false,
      setLogs: [],
      pointsEarned: 200
    });

    setShowRatingModal(false);
    setActiveTab('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in pb-24 md:pb-12">
      
      {/* Top Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wider">
            {workout.title}
          </div>
          <h1 className="font-heading font-extrabold text-xl text-[#0F172A] dark:text-[#E6EDF7]">
            Exercise {currentExIdx + 1} of {workout.exercises.length}: {currentWE.exerciseName}
          </h1>
        </div>

        {/* Camera Coach Shortcut */}
        {currentExercise?.poseSupported && (
          <button
            onClick={() => setActiveTab('camera')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] border border-[#2DD4BF]/40 text-xs font-bold hover:bg-[#CCFBF1]/80"
          >
            <Camera className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
            Switch to Camera Pose
          </button>
        )}
      </div>

      {/* Main Exercise Card & Set Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Exercise Visual, Instructions & Set Tracker */}
        <div className="md:col-span-2 bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Exercise Visual Card */}
          <div className="w-full bg-[#F1F5F9] dark:bg-[#18233B] rounded-xl flex flex-col items-center justify-center p-6 border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="w-16 h-16 rounded-2xl brand-gradient text-[#0F172A] flex items-center justify-center font-extrabold text-2xl shadow-md mb-2">
              {currentExIdx + 1}
            </div>
            <div className="font-heading font-extrabold text-[#0F172A] dark:text-[#E6EDF7] text-lg">
              {currentWE.exerciseName}
            </div>
            <div className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4] mt-1 bg-[#CCFBF1] dark:bg-[#0F3D3A] px-3 py-1 rounded-full">
              Target: {currentWE.sets} Sets × {currentWE.targetReps ? `${currentWE.targetReps} Reps` : 'Hold'} • Rest {currentWE.restSeconds}s
            </div>
          </div>

          {/* Instructions & Step-by-Step Guidance */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
              Step-by-Step Instructions
            </div>
            <div className="space-y-1.5 pl-1">
              {(currentWE.instructions || currentExercise?.instructions || []).map((stepText, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#0F172A] dark:text-[#E6EDF7]">
                  <span className="font-bold text-[#0F766E] dark:text-[#5EEAD4] shrink-0 mt-0.5">{idx + 1}.</span>
                  <span>{stepText}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Cues */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider">
              Key Form Cues
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(currentWE.cues || currentExercise?.cues || []).map((cue, idx) => (
                <div key={idx} className="p-2 bg-[#F1F5F9] dark:bg-[#18233B] rounded-xl border border-[#E2E8F0] dark:border-[#26334F] flex items-center gap-2 text-xs text-[#0F172A] dark:text-[#E6EDF7]">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4] shrink-0" />
                  <span>{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Notes / Contraindications if present */}
          {((currentWE.safetyNotes && currentWE.safetyNotes.length > 0) || (currentExercise?.contraindications && currentExercise.contraindications.length > 0)) && (
            <div className="p-3 bg-[#FDE8EC] dark:bg-[#BE123C]/20 rounded-xl border border-[#BE123C]/30 text-xs text-[#BE123C] dark:text-[#F87171] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Joint & Safety Considerations:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {(currentWE.safetyNotes || currentExercise?.contraindications || []).map((note, idx) => (
                  <li key={idx}>Avoid if experiencing: {note.replace(/_/g, ' ')}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Current Set Status */}
          <div className="p-4 bg-[#F1F5F9] dark:bg-[#18233B] rounded-xl border border-[#E2E8F0] dark:border-[#26334F] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#475569] dark:text-[#9FB0C8]">Current Progress</div>
              <div className="font-heading font-extrabold text-lg text-[#0F172A] dark:text-[#E6EDF7]">
                Set {currentSet} of {currentWE.sets}
              </div>
            </div>

            <button
              onClick={handleCompleteSet}
              className="px-6 py-3 brand-gradient text-[#0F172A] font-extrabold text-sm rounded-xl shadow-md hover:opacity-95"
            >
              Log Set {currentSet} Complete ✓
            </button>
          </div>

        </div>

        {/* Right Col: Timer, Routine Overview (Warmup, Main, Cooldown) */}
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm space-y-6 flex flex-col justify-between">
          
          {/* Rest Timer Box */}
          <div className="text-center p-6 bg-[#F1F5F9] dark:bg-[#18233B] rounded-xl border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider mb-1">
              {isRestMode ? '🌱 Rest Interval' : 'Exercise Duration'}
            </div>
            <div className="font-mono-numbers font-black text-4xl text-[#0F172A] dark:text-[#E6EDF7] my-2">
              {Math.floor(timerSeconds / 60)}:{timerSeconds % 60 < 10 ? '0' : ''}{timerSeconds % 60}
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-4 py-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F172A] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] dark:text-[#042F2E] font-bold text-xs rounded-lg shadow-sm"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setTimerSeconds(currentWE.restSeconds || 30);
                  setIsTimerRunning(false);
                }}
                className="p-2 bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] rounded-lg text-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Routine Sections: Warmup, Main, Cooldown */}
          <div className="space-y-4">
            
            {/* Warm-up */}
            {workout.warmup && workout.warmup.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wider">
                  🔥 Warm-up Routine
                </div>
                {workout.warmup.map(w => (
                  <div key={w.id} className="p-2 bg-[#CCFBF1]/30 dark:bg-[#0F3D3A]/30 rounded-lg text-xs font-medium text-[#0F172A] dark:text-[#E6EDF7]">
                    {w.exerciseName} ({w.targetReps ? `${w.targetReps} reps` : '30s'})
                  </div>
                ))}
              </div>
            )}

            {/* Main Sequence */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider">
                Main Exercise Sequence
              </div>
              {workout.exercises.map((we, idx) => (
                <button
                  key={we.id}
                  onClick={() => {
                    setCurrentExIdx(idx);
                    setCurrentSet(1);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    idx === currentExIdx
                      ? 'bg-[#CCFBF1] dark:bg-[#0F3D3A] border border-[#2DD4BF] text-[#134E4A] dark:text-[#99F6E4] font-bold'
                      : 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7]'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {we.exerciseName}</span>
                  {completedSets[we.id] && <CheckCircle2 className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4] shrink-0" />}
                </button>
              ))}
            </div>

            {/* Cool-down */}
            {workout.cooldown && workout.cooldown.length > 0 && (
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wider">
                  🧊 Cool-down Routine
                </div>
                {workout.cooldown.map(c => (
                  <div key={c.id} className="p-2 bg-[#CCFBF1]/30 dark:bg-[#0F3D3A]/30 rounded-lg text-xs font-medium text-[#0F172A] dark:text-[#E6EDF7]">
                    {c.exerciseName} ({c.targetReps ? `${c.targetReps} reps` : '30s'})
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Post Workout Rating Modal (Triggers Adaptive Engine) */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl brand-gradient flex items-center justify-center text-[#0F172A] mx-auto shadow-md mb-2">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="font-heading font-extrabold text-xl text-[#0F172A] dark:text-[#E6EDF7]">
                Workout Complete! 🎉
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-1">
                Help the Adaptive Engine adjust your next session intensity.
              </p>
            </div>

            {/* Effort RPE Slider */}
            <div>
              <label className="text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] flex justify-between mb-1">
                <span>Rate Effort (RPE 1-10):</span>
                <span className="text-[#0F766E] dark:text-[#5EEAD4] font-extrabold">{rpe} / 10</span>
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={rpe}
                onChange={e => setRpe(parseInt(e.target.value))}
                className="w-full accent-[#2DD4BF]"
              />
            </div>

            {/* Feel Rating */}
            <div>
              <label className="text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] block mb-2">
                How did this workout feel overall?
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'too_easy', label: 'Too Easy 🟢' },
                  { id: 'just_right', label: 'Just Right 🟡' },
                  { id: 'too_hard', label: 'Too Hard 🔴' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setFeelRating(item.id as any)}
                    className={`py-2.5 rounded-xl border text-center font-semibold transition-all ${
                      feelRating === item.id
                        ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] shadow'
                        : 'border-[#E2E8F0] dark:border-[#26334F] text-[#0F172A] dark:text-[#E6EDF7]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pain Flag Toggle */}
            <div className="p-3 bg-[#FDE8EC] dark:bg-[#BE123C]/20 rounded-xl border border-[#BE123C]/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#BE123C] dark:text-[#F87171]" />
                <span className="text-[#BE123C] dark:text-[#F87171] font-semibold">
                  Report Joint / Acute Pain?
                </span>
              </div>
              <input
                type="checkbox"
                checked={painFlag}
                onChange={e => setPainFlag(e.target.checked)}
                className="w-4 h-4 text-[#BE123C] rounded"
              />
            </div>

            <button
              onClick={handleFinishAndSave}
              className="w-full py-3 brand-gradient text-[#0F172A] font-extrabold text-sm rounded-xl shadow-lg hover:opacity-95 transition-opacity"
            >
              Save & Adapt Next Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
