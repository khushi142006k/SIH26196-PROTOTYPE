/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProgressScoreComponents, WorkoutSessionLog, UserStreak } from '../types';

export function calculateFitnessProgressScore(
  sessionLogs: WorkoutSessionLog[],
  streak: UserStreak,
  weeklyTargetSessions: number = 3,
  weeklyTargetMinutes: number = 90
): ProgressScoreComponents {
  const last28DaysLogs = sessionLogs.filter(log => {
    const date = new Date(log.startedAt);
    const now = new Date();
    const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 28;
  });

  // 1. Consistency (max 35)
  // Target in 28 days = weeklyTargetSessions * 4
  const target28Sessions = Math.max(1, weeklyTargetSessions * 4);
  const completed28Sessions = last28DaysLogs.filter(l => l.completionPct >= 70).length;
  const consistency = Math.min(35, Math.round((completed28Sessions / target28Sessions) * 35));

  // 2. Progression (max 25)
  // Based on streak & completed volume/PRs
  const streakFactor = Math.min(10, streak.currentStreak * 2);
  const completionAvg = last28DaysLogs.length > 0
    ? last28DaysLogs.reduce((acc, l) => acc + l.completionPct, 0) / last28DaysLogs.length
    : 80;
  const progression = Math.min(25, Math.round((completionAvg / 100) * 15 + streakFactor));

  // 3. Activity (max 20)
  // Target active minutes in 28 days = weeklyTargetMinutes * 4
  const totalMins = last28DaysLogs.reduce((acc, l) => {
    const mins = (new Date(l.endedAt).getTime() - new Date(l.startedAt).getTime()) / (1000 * 60);
    return acc + (isNaN(mins) || mins <= 0 ? 20 : mins);
  }, 0);
  const target28Mins = Math.max(1, weeklyTargetMinutes * 4);
  const activity = Math.min(20, Math.round((totalMins / target28Mins) * 20));

  // 4. Technique (max 10)
  // Camera form score average
  const cameraLogs = last28DaysLogs.filter(l => l.usedCamera && l.avgFormScore !== undefined);
  let technique = 8; // Default base if camera not used yet
  if (cameraLogs.length > 0) {
    const avgForm = cameraLogs.reduce((acc, l) => acc + (l.avgFormScore || 75), 0) / cameraLogs.length;
    technique = Math.min(10, Math.round((avgForm / 100) * 10));
  }

  // 5. Recovery (max 10)
  // Rest days honored, no consecutive overtraining (pain flags penalized)
  const painCount = last28DaysLogs.filter(l => l.painFlag).length;
  const recovery = Math.max(2, Math.min(10, 10 - painCount * 3));

  const total = Math.min(100, consistency + progression + activity + technique + recovery);

  let explanation = '';
  if (total >= 85) {
    explanation = 'Outstanding momentum! High workout consistency and strong technique score.';
  } else if (total >= 70) {
    explanation = `Solid progress (+${completed28Sessions} completed sessions). Keep hitting your ${weeklyTargetSessions}x weekly goal to reach 85+!`;
  } else if (total >= 50) {
    explanation = 'Good start! Try staying consistent on active days to boost your streak and score.';
  } else {
    explanation = 'App metric baseline initialized. Complete your first 3 workouts to build consistency points!';
  }

  return {
    consistency,
    progression,
    activity,
    technique,
    recovery,
    total,
    explanation
  };
}
