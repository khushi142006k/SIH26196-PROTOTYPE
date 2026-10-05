/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkoutExercise, PlanWorkout } from '../../types';
import { VERIFIED_EXERCISES } from '../../data/exercises';
import { Plus, Trash2, Edit3, Save, Check, X, Sparkles, Dumbbell, Clock, Layers } from 'lucide-react';

interface PlanEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlanEditorModal({ isOpen, onClose }: PlanEditorModalProps) {
  const { plan, savePlanToFirestore, firebaseUser } = useApp();

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(
    plan.workouts[0]?.id || ''
  );
  
  const [editingPlanName, setEditingPlanName] = useState<string>(plan.name || 'Custom Fitness Plan');
  const [saveNotice, setSaveNotice] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Quick Add Exercise State
  const [newExName, setNewExName] = useState<string>('Squats');
  const [newExSets, setNewExSets] = useState<number>(3);
  const [newExReps, setNewExReps] = useState<number>(12);
  const [newExRest, setNewExRest] = useState<number>(30);

  if (!isOpen) return null;

  const currentWorkout: PlanWorkout | undefined = plan.workouts.find(w => w.id === selectedWorkoutId) || plan.workouts[0];

  const handleUpdateExercise = async (exerciseId: string, updatedSets: number, updatedReps: number, updatedRest: number) => {
    if (!currentWorkout) return;

    const updatedExercises = currentWorkout.exercises.map(we => {
      if (we.id === exerciseId || we.exerciseId === exerciseId) {
        return {
          ...we,
          sets: updatedSets,
          targetReps: updatedReps,
          restSeconds: updatedRest
        };
      }
      return we;
    });

    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === currentWorkout.id) {
        return { ...w, exercises: updatedExercises };
      }
      return w;
    });

    const updatedPlan = {
      ...plan,
      name: editingPlanName,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };

    setIsSaving(true);
    await savePlanToFirestore(updatedPlan);
    setIsSaving(false);
    setSaveNotice('✓ Exercise updated and saved to Cloud Firestore!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    if (!currentWorkout) return;

    const remainingExercises = currentWorkout.exercises.filter(
      we => we.id !== exerciseId && we.exerciseId !== exerciseId
    );

    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === currentWorkout.id) {
        return { ...w, exercises: remainingExercises };
      }
      return w;
    });

    const updatedPlan = {
      ...plan,
      name: editingPlanName,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };

    setIsSaving(true);
    await savePlanToFirestore(updatedPlan);
    setIsSaving(false);
    setSaveNotice('✓ Exercise deleted and saved to Cloud Firestore!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleAddExercise = async () => {
    if (!currentWorkout || !newExName) return;

    const newWorkoutExercise: WorkoutExercise = {
      id: `we-custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      exerciseId: `ex-custom-${Date.now()}`,
      exerciseName: newExName,
      sets: newExSets,
      targetReps: newExReps,
      restSeconds: newExRest,
      targetRpe: 7,
      instructions: [`Perform ${newExSets} sets of ${newExReps} reps with ${newExRest}s rest.`]
    };

    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === currentWorkout.id) {
        return {
          ...w,
          exercises: [...w.exercises, newWorkoutExercise]
        };
      }
      return w;
    });

    const updatedPlan = {
      ...plan,
      name: editingPlanName,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };

    setIsSaving(true);
    await savePlanToFirestore(updatedPlan);
    setIsSaving(false);
    setSaveNotice(`✓ Added "${newExName}" and saved to Cloud Firestore!`);
    setTimeout(() => setSaveNotice(''), 3000);
  };

  const handleSaveAll = async () => {
    const updatedPlan = {
      ...plan,
      name: editingPlanName,
      version: plan.version + 1
    };

    setIsSaving(true);
    await savePlanToFirestore(updatedPlan);
    setIsSaving(false);
    setSaveNotice('✓ Entire Workout Plan saved successfully to Cloud Firestore!');
    setTimeout(() => setSaveNotice(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1220]/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto relative space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#26334F] pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-[#0F172A] font-bold">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-[#0F172A] dark:text-[#E6EDF7]">
                Workout Plan & Exercise Builder
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                Real-time sync to Cloud Firestore • {firebaseUser ? `UID: ${firebaseUser.uid.substring(0, 8)}...` : 'Guest Mode'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] dark:hover:text-[#E6EDF7] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Save Notice Toast */}
        {saveNotice && (
          <div className="p-3 bg-[#CCFBF1] dark:bg-[#0F3D3A] border border-[#2DD4BF] text-[#134E4A] dark:text-[#99F6E4] rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
            <span>{saveNotice}</span>
          </div>
        )}

        {/* Plan Title & Metadata Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider block mb-1">
              Plan Title
            </label>
            <input
              type="text"
              value={editingPlanName}
              onChange={e => setEditingPlanName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]"
            />
          </div>
        </div>

        {/* Session Selector */}
        <div>
          <label className="text-xs font-bold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider block mb-2">
            Select Workout Session to Edit
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {plan.workouts.map(w => (
              <button
                key={w.id}
                onClick={() => setSelectedWorkoutId(w.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedWorkoutId === w.id
                    ? 'brand-gradient text-[#0F172A] shadow-md'
                    : 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#475569] dark:text-[#9FB0C8] border border-[#E2E8F0] dark:border-[#26334F]'
                }`}
              >
                {w.title} ({w.exercises.length} ex)
              </button>
            ))}
          </div>
        </div>

        {/* Exercises List in Current Workout */}
        {currentWorkout && (
          <div className="space-y-3 bg-[#F8FAFC] dark:bg-[#18233B]/50 p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#26334F]">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#0F172A] dark:text-[#E6EDF7]">
                Exercises in {currentWorkout.title}
              </h3>
              <span className="text-xs font-semibold text-[#0F766E] dark:text-[#5EEAD4]">
                {currentWorkout.exercises.length} Exercises
              </span>
            </div>

            <div className="space-y-2">
              {currentWorkout.exercises.map((we, idx) => (
                <div
                  key={we.id}
                  className="p-3 bg-[#FFFFFF] dark:bg-[#111A2E] rounded-xl border border-[#E2E8F0] dark:border-[#26334F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#F1F5F9] dark:bg-[#18233B] flex items-center justify-center font-bold text-[#0F766E] dark:text-[#5EEAD4]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7]">
                        {we.exerciseName}
                      </div>
                      <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8]">
                        Rest: {we.restSeconds}s • RPE: {we.targetRpe}
                      </div>
                    </div>
                  </div>

                  {/* Sets and Reps Editors */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#18233B] px-2 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#26334F]">
                      <span className="text-[11px] text-[#475569]">Sets:</span>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={we.sets}
                        onChange={e => handleUpdateExercise(we.id, parseInt(e.target.value) || 1, we.targetReps || 10, we.restSeconds)}
                        className="w-10 bg-transparent text-center font-bold text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-[#F1F5F9] dark:bg-[#18233B] px-2 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#26334F]">
                      <span className="text-[11px] text-[#475569]">Reps:</span>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={we.targetReps || 10}
                        onChange={e => handleUpdateExercise(we.id, we.sets, parseInt(e.target.value) || 1, we.restSeconds)}
                        className="w-12 bg-transparent text-center font-bold text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => handleDeleteExercise(we.id)}
                      className="p-1.5 rounded-lg text-[#BE123C] dark:text-[#F87171] hover:bg-[#FFE4E6] dark:hover:bg-[#450A0A] transition-colors"
                      title="Remove Exercise"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Exercise Form */}
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#26334F] space-y-2">
              <label className="text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#0F766E] dark:text-[#5EEAD4]" />
                Add New Exercise to {currentWorkout.title}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <select
                    value={newExName}
                    onChange={e => setNewExName(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#FFFFFF] dark:bg-[#111A2E] text-[#0F172A] dark:text-[#E6EDF7] font-semibold"
                  >
                    <option value="Squats">Squats</option>
                    <option value="Push-ups">Push-ups</option>
                    <option value="Lunges">Lunges</option>
                    <option value="Plank">Plank</option>
                    <option value="Glute Bridge">Glute Bridge</option>
                    <option value="Jumping Jacks">Jumping Jacks</option>
                    <option value="Mountain Climbers">Mountain Climbers</option>
                    <option value="Bird Dog">Bird Dog</option>
                    <option value="High Knees">High Knees</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#111A2E] px-2 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#26334F]">
                  <span className="text-[11px] text-[#475569]">Sets:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newExSets}
                    onChange={e => setNewExSets(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent text-center font-bold text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#FFFFFF] dark:bg-[#111A2E] px-2 py-1.5 rounded-xl border border-[#E2E8F0] dark:border-[#26334F]">
                  <span className="text-[11px] text-[#475569]">Reps:</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newExReps}
                    onChange={e => setNewExReps(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent text-center font-bold text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAddExercise}
                  className="px-4 py-2 rounded-xl brand-gradient text-[#0F172A] font-extrabold text-xs shadow-sm hover:opacity-95"
                >
                  + Add Exercise
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] dark:border-[#26334F]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#475569] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] rounded-xl"
          >
            Done / Close
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] text-[#0F172A] dark:text-[#042F2E] font-extrabold text-xs shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving to Firestore...' : 'Save Plan to Firestore'}
          </button>
        </div>

      </div>
    </div>
  );
}
