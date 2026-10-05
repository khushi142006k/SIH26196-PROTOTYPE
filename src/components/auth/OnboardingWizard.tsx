/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, GoalType, FitnessLevel, EquipmentType } from '../../types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Clock,
  Dumbbell,
  Target,
  HeartPulse,
  Info
} from 'lucide-react';

export function OnboardingWizard() {
  const { user, firebaseUser, completeOnboarding, setOnboardingOpen } = useApp();

  const currentUser: UserProfile = user || {
    id: firebaseUser?.uid || 'usr-default',
    name: firebaseUser?.displayName || 'User',
    email: firebaseUser?.email || '',
    role: 'user',
    goal: 'build_strength',
    level: 'beginner',
    daysPerWeek: 3,
    sessionMinutes: 20,
    equipment: ['none'],
    lowImpactMode: false,
    avoidExercises: [],
    preferredTimeOfDay: 'evening',
    parqAnswers: { chestPain: false, dizziness: false, jointIssue: false, bloodPressure: false, doctorNotice: false },
    parqPassed: true,
    units: 'metric',
    theme: 'light',
    createdAt: new Date().toISOString()
  };

  const [step, setStep] = useState<number>(1);

  // Form states
  const [goal, setGoal] = useState<GoalType>(currentUser.goal || 'build_strength');
  const [level, setLevel] = useState<FitnessLevel>(currentUser.level || 'beginner');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(currentUser.daysPerWeek || 3);
  const [sessionMinutes, setSessionMinutes] = useState<number>(currentUser.sessionMinutes || 20);
  const [equipment, setEquipment] = useState<EquipmentType[]>(currentUser.equipment || ['none']);
  const [lowImpactMode, setLowImpactMode] = useState<boolean>(currentUser.lowImpactMode || false);

  // PAR-Q Questions
  const [parq, setParq] = useState({
    chestPain: currentUser.parqAnswers?.chestPain || false,
    dizziness: currentUser.parqAnswers?.dizziness || false,
    jointIssue: currentUser.parqAnswers?.jointIssue || false,
    bloodPressure: currentUser.parqAnswers?.bloodPressure || false,
    doctorNotice: currentUser.parqAnswers?.doctorNotice || false
  });

  const toggleEquipment = (eq: EquipmentType) => {
    if (eq === 'none') {
      setEquipment(['none']);
      return;
    }
    const filtered = equipment.filter(e => e !== 'none');
    if (filtered.includes(eq)) {
      const remaining = filtered.filter(e => e !== eq);
      setEquipment(remaining.length === 0 ? ['none'] : remaining);
    } else {
      setEquipment([...filtered, eq]);
    }
  };

  const handleParqToggle = (key: keyof typeof parq) => {
    const updated = { ...parq, [key]: !parq[key] };
    setParq(updated);
    // If any "yes" to PAR-Q health issues, auto-enable Low-Impact mode for safety
    const hasAnyYes = Object.values(updated).some(v => v);
    if (hasAnyYes) {
      setLowImpactMode(true);
    }
  };

  const handleSubmit = () => {
    const updatedUser: UserProfile = {
      ...currentUser,
      goal,
      level,
      daysPerWeek,
      sessionMinutes,
      equipment,
      lowImpactMode,
      parqAnswers: parq,
      parqPassed: !Object.values(parq).some(v => v)
    };

    completeOnboarding(updatedUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl shadow-2xl max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
        
        {/* Step Progress Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-[#0F172A] font-bold text-xs">
              {step}/5
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#E6EDF7]">
                Personalise Your AI Workout Plan
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                2-minute adaptive setup — no equipment required
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="text-xs text-[#475569] hover:text-[#0F172A] dark:hover:text-[#E6EDF7]"
          >
            Cancel
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#F1F5F9] dark:bg-[#18233B] rounded-full h-1.5 mb-6">
          <div
            className="bg-[#2DD4BF] dark:bg-[#5EEAD4] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP 1: GOAL */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
              What is your main fitness goal?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'build_strength', label: 'Build Muscle & Strength', desc: 'Progressive bodyweight overload & tone' },
                { id: 'lose_fat', label: 'Burn Fat & Weight Management', desc: 'Caloric burn & high-energy circuits' },
                { id: 'stay_active', label: 'Stay Active Daily', desc: 'Maintain stamina & daily activity habits' },
                { id: 'stamina', label: 'Boost Cardiovascular Endurance', desc: 'Heart rate & aerobic capacity' },
                { id: 'flexibility', label: 'Mobility & Joint Flexibility', desc: 'Posture, range of motion & recovery' },
                { id: 'general_wellness', label: 'General Health & Energy', desc: 'Gentle, balanced functional fitness' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setGoal(item.id as GoalType)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    goal === item.id
                      ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] ring-2 ring-[#2DD4BF]/20'
                      : 'border-[#E2E8F0] dark:border-[#26334F] hover:border-[#2DD4BF] text-[#0F172A] dark:text-[#E6EDF7]'
                  }`}
                >
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: FITNESS LEVEL */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
              Select your experience level
            </h3>
            <div className="space-y-3">
              {[
                {
                  id: 'beginner',
                  label: 'Beginner / Returning after break',
                  desc: 'Focus on proper form, joint safety, and building consistency safely.'
                },
                {
                  id: 'intermediate',
                  label: 'Intermediate (Active 2-3x/week)',
                  desc: 'Comfortable with basic exercises like squats and push-ups. Ready for volume progression.'
                },
                {
                  id: 'advanced',
                  label: 'Advanced (Consistently training)',
                  desc: 'High exercise stamina. Requires challenging variations and deload cycles.'
                }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id as FitnessLevel)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    level === item.id
                      ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] ring-2 ring-[#2DD4BF]/20'
                      : 'border-[#E2E8F0] dark:border-[#26334F] hover:border-[#2DD4BF] text-[#0F172A] dark:text-[#E6EDF7]'
                  }`}
                >
                  <div className="font-bold text-sm">{item.label}</div>
                  <div className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-1">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: TIME & FREQUENCY */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
                How many days per week can you commit?
              </h3>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-3 rounded-xl border text-center font-bold text-sm transition-all ${
                      daysPerWeek === d
                        ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] shadow-md'
                        : 'border-[#E2E8F0] dark:border-[#26334F] text-[#0F172A] dark:text-[#E6EDF7] hover:border-[#2DD4BF]'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
                Target session duration:
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[10, 15, 20, 30, 45].map(m => (
                  <button
                    key={m}
                    onClick={() => setSessionMinutes(m)}
                    className={`py-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                      sessionMinutes === m
                        ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#2DD4BF] dark:bg-[#5EEAD4] text-[#0F172A] dark:text-[#042F2E] shadow-md'
                        : 'border-[#E2E8F0] dark:border-[#26334F] text-[#0F172A] dark:text-[#E6EDF7] hover:border-[#2DD4BF]'
                    }`}
                  >
                    {m} Min
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-2">
                Fits into any schedule. Even 15 minutes daily builds lasting habit momentum!
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: EQUIPMENT */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#0F766E] dark:text-[#5EEAD4]" />
              What equipment do you have access to?
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'none', label: 'No Equipment (Bodyweight)' },
                { id: 'mat', label: 'Yoga / Exercise Mat' },
                { id: 'dumbbells', label: 'Dumbbells' },
                { id: 'bands', label: 'Resistance Bands' },
                { id: 'pull_up_bar', label: 'Pull-Up Bar' },
                { id: 'gym', label: 'Full Gym Access' }
              ].map(item => {
                const isSelected = equipment.includes(item.id as EquipmentType);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleEquipment(item.id as EquipmentType)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#2DD4BF] dark:border-[#5EEAD4] bg-[#CCFBF1] dark:bg-[#0F3D3A] text-[#134E4A] dark:text-[#99F6E4] font-semibold'
                        : 'border-[#E2E8F0] dark:border-[#26334F] text-[#0F172A] dark:text-[#E6EDF7] hover:border-[#2DD4BF]'
                    }`}
                  >
                    <span className="text-xs sm:text-sm">{item.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: READINESS (PAR-Q) & LOW-IMPACT MODE */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-base text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-[#BE123C] dark:text-[#F87171]" />
              Physical Readiness & Health Screening
            </h3>

            <div className="p-3 bg-[#FFF4D6] dark:bg-[#18233B] border border-[#F59E0B]/40 rounded-xl text-xs text-[#B45309] dark:text-[#FBBF24] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24] shrink-0 mt-0.5" />
              <span>
                Safety first: Please answer these 4 standard health screening questions.
                Selecting "Yes" automatically activates joint-safe Low-Impact mode.
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { key: 'chestPain', label: 'Do you feel chest discomfort or dizziness during exertion?' },
                { key: 'jointIssue', label: 'Do you have joint/bone problems aggravated by high-impact jumps?' },
                { key: 'bloodPressure', label: 'Has a physician diagnosed you with high blood pressure?' },
                { key: 'doctorNotice', label: 'Has a doctor ever advised you to perform only low-impact exercise?' }
              ].map(q => (
                <label
                  key={q.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]/50 cursor-pointer"
                >
                  <span className="text-[#0F172A] dark:text-[#E6EDF7] font-medium pr-2">{q.label}</span>
                  <input
                    type="checkbox"
                    checked={parq[q.key as keyof typeof parq]}
                    onChange={() => handleParqToggle(q.key as keyof typeof parq)}
                    className="w-4 h-4 text-[#2DD4BF] rounded focus:ring-[#2563EB]"
                  />
                </label>
              ))}
            </div>

            {/* Low impact mode toggle */}
            <div className="p-3.5 bg-[#CCFBF1] dark:bg-[#0F3D3A] rounded-xl border border-[#2DD4BF]/40 dark:border-[#5EEAD4]/40 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#134E4A] dark:text-[#99F6E4]">
                  🌱 Low-Impact Mode Enabled
                </div>
                <div className="text-[11px] text-[#134E4A] dark:text-[#99F6E4] mt-0.5">
                  Replaces jumping jacks & high-impact jumps with joint-friendly step variations.
                </div>
              </div>
              <input
                type="checkbox"
                checked={lowImpactMode}
                onChange={e => setLowImpactMode(e.target.checked)}
                className="w-5 h-5 text-[#2DD4BF] rounded focus:ring-[#2563EB] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#E2E8F0] dark:border-[#26334F]">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-[#0F172A] brand-gradient rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-extrabold text-[#0F172A] bg-[#2DD4BF] hover:bg-[#14B8A6] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] dark:text-[#042F2E] rounded-xl shadow-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate My Adaptive Plan
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
