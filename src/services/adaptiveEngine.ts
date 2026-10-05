/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise, Plan, PlanWorkout, UserProfile, WorkoutExercise, WorkoutSessionLog } from '../types';
import { VERIFIED_EXERCISES, filterExercisesForUser, getExerciseById } from '../data/exercises';

export function generateInitialPlan(user: UserProfile): Plan {
  const eligibleExercises = filterExercisesForUser(
    VERIFIED_EXERCISES,
    user.level || 'beginner',
    user.equipment || ['none'],
    user.lowImpactMode || false,
    user.avoidExercises || []
  );

  const daysCount = Math.max(2, Math.min(6, user.daysPerWeek || 3));
  const sessionMins = Math.max(10, Math.min(60, user.sessionMinutes || 20));
  const startDate = new Date().toISOString().split('T')[0];

  // Plan Name & Description based on Goal
  let planName = 'Full-Body Fitness & Health Routine';
  if (user.goal === 'build_strength') planName = 'Strength & Muscle Overload Program';
  else if (user.goal === 'lose_fat') planName = 'High-Energy Fat Burn & Conditioning';
  else if (user.goal === 'stamina') planName = 'Endurance & Cardiovascular Stamina Program';
  else if (user.goal === 'flexibility') planName = 'Mobility, Balance & Flexibility Plan';
  else if (user.goal === 'stay_active') planName = 'Active Lifestyle & Daily Energy Routine';

  const workouts: PlanWorkout[] = [];

  // Generate 4 weeks of structured, goal-aligned workouts
  for (let week = 1; week <= 4; week++) {
    for (let day = 1; day <= daysCount; day++) {
      const scheduledDate = getFutureDateStr((week - 1) * 7 + (day - 1) * 2);
      const isRecovery = week === 4 && day === daysCount; // Week 4 deload recovery day

      if (isRecovery) {
        workouts.push({
          id: `w-${week}-d-${day}`,
          planId: 'plan-1',
          scheduledDate,
          title: `Week ${week} Deload & Joint Recovery`,
          estMinutes: Math.min(15, sessionMins),
          type: 'recovery',
          completed: false,
          adaptationReason: 'Scheduled Week 4 deload to allow muscle recovery & joint regeneration',
          warmup: [
            buildWorkoutExercise(getExerciseById('ex-cat-cow')!, 1, 8, 20, 2)
          ],
          exercises: [
            buildWorkoutExercise(getExerciseById('ex-cat-cow')!, 2, 10, 30, 2),
            buildWorkoutExercise(getExerciseById('ex-glute-bridge')!, 2, 10, 30, 3),
            buildWorkoutExercise(getExerciseById('ex-bird-dog')!, 2, 8, 30, 3)
          ],
          cooldown: [
            buildWorkoutExercise(getExerciseById('ex-glute-bridge')!, 1, 8, 30, 2)
          ]
        });
        continue;
      }

      // Pick 3-5 exercises based on session time
      const exerciseCount = sessionMins <= 15 ? 3 : sessionMins <= 30 ? 4 : 5;
      const selectedMain = pickDiverseExercises(eligibleExercises, exerciseCount, day + week);

      // Construct Main Exercises
      const workoutExercises: WorkoutExercise[] = selectedMain.map(ex => {
        let sets = user.level === 'beginner' ? 2 : user.level === 'intermediate' ? 3 : 4;
        let reps = 10;
        let rest = 35;
        let targetRpe = 6;

        if (user.goal === 'build_strength') {
          reps = user.level === 'beginner' ? 8 : 10;
          rest = user.level === 'beginner' ? 50 : 40;
          targetRpe = 7;
        } else if (user.goal === 'lose_fat' || user.goal === 'stamina') {
          reps = ex.category === 'cardio' ? 15 : 12;
          rest = 25;
          targetRpe = 7;
        } else if (user.goal === 'flexibility' || user.goal === 'stay_active') {
          reps = 10;
          rest = 30;
          targetRpe = 5;
        }

        if (user.lowImpactMode) {
          rest += 10; // Extra rest for joint comfort
          targetRpe = Math.min(targetRpe, 6);
        }

        return buildWorkoutExercise(ex, sets, reps, rest, targetRpe);
      });

      // Warmup & Cooldown Routines
      const warmupEx = getExerciseById('ex-cat-cow') || eligibleExercises[0];
      const cooldownEx = getExerciseById('ex-bird-dog') || eligibleExercises[1] || eligibleExercises[0];

      const warmup: WorkoutExercise[] = warmupEx
        ? [buildWorkoutExercise(warmupEx, 1, 8, 20, 3)]
        : [];
      const cooldown: WorkoutExercise[] = cooldownEx
        ? [buildWorkoutExercise(cooldownEx, 1, 8, 20, 2)]
        : [];

      const dayTitle = user.lowImpactMode
        ? `Low-Impact ${user.goal ? user.goal.replace('_', ' ') : 'Fitness'} Day ${day}`
        : `Full-Body ${user.goal ? user.goal.replace('_', ' ') : 'Fitness'} Day ${day}`;

      workouts.push({
        id: `w-${week}-d-${day}`,
        planId: 'plan-1',
        scheduledDate,
        title: `${dayTitle} (W${week})`,
        estMinutes: sessionMins,
        type: 'workout',
        completed: false,
        adaptationReason: `Tailored for ${sessionMins}m duration, ${user.level} level, ${user.goal ? user.goal.replace('_', ' ') : 'general'} goal, ${user.equipment.join(', ') || 'bodyweight'} equipment`,
        warmup,
        exercises: workoutExercises,
        cooldown
      });
    }
  }

  return {
    id: `plan-${Date.now()}`,
    name: planName,
    userId: user.id,
    status: 'active',
    startDate,
    workouts,
    weeklyTargetSessions: daysCount,
    weeklyTargetMinutes: daysCount * sessionMins,
    version: 1,
    goal: user.goal,
    difficulty: user.level
  };
}

export function adaptPlanAfterSession(
  currentPlan: Plan,
  sessionLog: WorkoutSessionLog,
  user: UserProfile
): { updatedPlan: Plan; adaptationNotice: string } {
  const updatedWorkouts = [...currentPlan.workouts];
  const completedWorkoutIndex = updatedWorkouts.findIndex(w => w.id === sessionLog.planWorkoutId);

  if (completedWorkoutIndex !== -1) {
    updatedWorkouts[completedWorkoutIndex].completed = true;
  }

  let adaptationNotice = '';

  // Find next uncompleted workout
  const nextWorkoutIndex = updatedWorkouts.findIndex(w => !w.completed);
  if (nextWorkoutIndex === -1) {
    return {
      updatedPlan: { ...currentPlan, workouts: updatedWorkouts },
      adaptationNotice: 'Great job completing your 4-week program! A new rolling cycle has been initialized.'
    };
  }

  const nextWorkout = { ...updatedWorkouts[nextWorkoutIndex] };
  let newExercises = [...nextWorkout.exercises];
  let reason = '';

  // 1. SAFETY CHECK: Pain Flag Triggered
  if (sessionLog.painFlag) {
    reason = 'Joint/pain flag reported: Replaced high-impact movements with joint-safe regressions and increased rest intervals (+15s).';
    newExercises = newExercises.map(we => {
      const ex = getExerciseById(we.exerciseId);
      if (ex && ex.impactClass === 'high') {
        const alt = getExerciseById(ex.regressions[0] || 'ex-chair-squat') || ex;
        return buildWorkoutExercise(alt, Math.max(2, we.sets - 1), we.targetReps || 10, we.restSeconds + 15, 5);
      }
      return {
        ...we,
        restSeconds: we.restSeconds + 15,
        targetRpe: Math.max(4, we.targetRpe - 2)
      };
    });
  }
  // 2. DIFFICULTY ADJUSTMENT: Too Hard OR High RPE (>=9) OR Completion < 60%
  else if (sessionLog.feelRating === 'too_hard' || sessionLog.rpe >= 9 || sessionLog.completionPct < 60) {
    reason = `Previous workout was challenging (RPE ${sessionLog.rpe}/10). Reduced set volume (-1 set) and added +15s rest to optimize recovery.`;
    newExercises = newExercises.map(we => {
      const ex = getExerciseById(we.exerciseId);
      let targetEx = ex;
      if (ex && ex.regressions.length > 0) {
        const regEx = getExerciseById(ex.regressions[0]);
        if (regEx) targetEx = regEx;
      }
      return buildWorkoutExercise(
        targetEx || ex!,
        Math.max(2, we.sets - 1),
        Math.max(6, (we.targetReps || 10) - 2),
        we.restSeconds + 15,
        Math.max(5, we.targetRpe - 1)
      );
    });
  }
  // 3. PROGRESSIVE OVERLOAD: Too Easy AND Low RPE (<=6) AND High Completion (>=90%)
  else if (sessionLog.feelRating === 'too_easy' && sessionLog.rpe <= 6 && sessionLog.completionPct >= 90) {
    reason = `Excellent performance! Previous session felt easy (RPE ${sessionLog.rpe}/10). Progressed target reps (+2) for progressive overload.`;
    newExercises = newExercises.map(we => {
      const ex = getExerciseById(we.exerciseId);
      let targetEx = ex;
      // If user handled easily, check if progression variation exists
      if (ex && ex.progressions.length > 0 && user.level !== 'beginner') {
        const progEx = getExerciseById(ex.progressions[0]);
        if (progEx) targetEx = progEx;
      }
      return buildWorkoutExercise(
        targetEx || ex!,
        we.sets,
        (we.targetReps || 10) + 2,
        Math.max(20, we.restSeconds - 5),
        Math.min(9, we.targetRpe + 1)
      );
    });
  }
  // 4. TECHNIQUE & FORM ADJUSTMENT: Low Form Score (< 60)
  else if (sessionLog.avgFormScore && sessionLog.avgFormScore < 60) {
    reason = `Form score was below target (${Math.round(sessionLog.avgFormScore)}/100). Adjusted tempo and reduced target reps (-2) to reinforce technique and movement quality.`;
    newExercises = newExercises.map(we => ({
      ...we,
      targetReps: Math.max(6, (we.targetReps || 10) - 2),
      restSeconds: we.restSeconds + 10
    }));
  }
  // 5. MANAGED PROGRESSION: Just Right / Balanced
  else {
    reason = 'Consistent, controlled performance! Session intensity held steady for steady muscle adaptation.';
  }

  nextWorkout.exercises = newExercises;
  nextWorkout.adaptationReason = reason;
  updatedWorkouts[nextWorkoutIndex] = nextWorkout;

  adaptationNotice = reason;

  return {
    updatedPlan: {
      ...currentPlan,
      workouts: updatedWorkouts,
      version: currentPlan.version + 1
    },
    adaptationNotice
  };
}

function buildWorkoutExercise(
  ex: Exercise,
  sets: number,
  reps: number,
  rest: number,
  rpe: number
): WorkoutExercise {
  return {
    id: `we-${ex.id}-${Math.random().toString(36).substr(2, 5)}`,
    exerciseId: ex.id,
    exerciseName: ex.name,
    sets,
    targetReps: reps,
    restSeconds: rest,
    targetRpe: rpe,
    isLowImpact: ex.impactClass === 'low',
    instructions: ex.instructions || [],
    cues: ex.cues || [],
    safetyNotes: ex.contraindications || []
  };
}

function pickDiverseExercises(pool: Exercise[], count: number, seed: number): Exercise[] {
  if (pool.length <= count) return pool;
  const shuffled = [...pool].sort((a, b) => (a.id.length + seed % 3) - (b.id.length + seed % 5));
  return shuffled.slice(0, count);
}

function getFutureDateStr(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}
