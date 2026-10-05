/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'user' | 'trainer' | 'partner_admin' | 'editor' | 'super_admin';

export type GoalType = 'lose_fat' | 'build_strength' | 'stay_active' | 'stamina' | 'flexibility' | 'general_wellness';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type ImpactClass = 'low' | 'medium' | 'high';
export type EquipmentType = 'none' | 'dumbbells' | 'bands' | 'mat' | 'pull_up_bar' | 'gym';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  partnerId?: string; // college, gym, corporate id
  departmentOrTeam?: string;
  
  // Onboarding & Preferences
  goal: GoalType;
  level: FitnessLevel;
  daysPerWeek: number; // 2, 3, 4, 5, 6
  sessionMinutes: number; // 10, 15, 20, 30, 45
  equipment: EquipmentType[];
  lowImpactMode: boolean;
  avoidExercises: string[];
  preferredTimeOfDay: 'morning' | 'afternoon' | 'evening';
  
  // Readiness (PAR-Q)
  parqAnswers: {
    chestPain: boolean;
    dizziness: boolean;
    jointIssue: boolean;
    bloodPressure: boolean;
    doctorNotice: boolean;
  };
  parqPassed: boolean;
  
  // Bio/Units
  heightCm?: number;
  weightKg?: number;
  units: 'metric' | 'imperial';
  theme: 'system' | 'light' | 'dark';
  
  createdAt: string;
}

export interface Exercise {
  id: string;
  slug: string;
  name: string;
  category: 'strength' | 'cardio' | 'mobility' | 'core' | 'low_impact';
  level: FitnessLevel;
  impactClass: ImpactClass;
  muscles: string[]; // e.g. ['quads', 'glutes', 'core']
  equipment: EquipmentType[];
  instructions: string[];
  cues: string[];
  contraindications: string[]; // e.g. ['knee_pain', 'lower_back']
  poseSupported: boolean;
  poseConfig?: {
    primaryAngles: string[]; // e.g. ['hip_knee_ankle']
    repMinAngle: number;
    repMaxAngle: number;
    formThresholds: {
      good: number;
      warningCue: string;
    }[];
  };
  regressions: string[]; // alternative simpler exercise ids
  progressions: string[]; // harder exercise ids
  mediaUrl?: string; // SVG or diagram placeholder
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  targetReps?: number;
  targetDurationSeconds?: number;
  restSeconds: number;
  targetRpe: number; // 1-10
  isLowImpact?: boolean;
  instructions?: string[];
  cues?: string[];
  safetyNotes?: string[];
}

export interface PlanWorkout {
  id: string;
  planId: string;
  scheduledDate: string; // YYYY-MM-DD
  title: string;
  estMinutes: number;
  type: 'workout' | 'recovery' | 'mobility' | 'short_blast';
  exercises: WorkoutExercise[];
  warmup?: WorkoutExercise[];
  cooldown?: WorkoutExercise[];
  adaptationReason?: string;
  completed: boolean;
}

export interface Plan {
  id: string;
  name?: string;
  userId: string;
  status: 'active' | 'archived' | 'completed';
  startDate: string; // YYYY-MM-DD
  workouts: PlanWorkout[];
  weeklyTargetSessions: number;
  weeklyTargetMinutes: number;
  version: number;
  goal?: GoalType;
  difficulty?: FitnessLevel;
}

export interface WorkoutSetLog {
  setNo: number;
  repsCompleted: number;
  weightKg?: number;
  durationSeconds?: number;
  formScore?: number;
}

export interface WorkoutSessionLog {
  id: string;
  userId: string;
  planWorkoutId?: string;
  startedAt: string;
  endedAt: string;
  completionPct: number;
  rpe: number; // 1-10 Effort
  feelRating: 'too_easy' | 'just_right' | 'too_hard';
  painFlag: boolean;
  painNotes?: string;
  usedCamera: boolean;
  avgFormScore?: number;
  setLogs: {
    exerciseId: string;
    sets: WorkoutSetLog[];
  }[];
  pointsEarned: number;
}

export interface ProgressScoreComponents {
  consistency: number; // max 35
  progression: number;   // max 25
  activity: number;      // max 20
  technique: number;     // max 10
  recovery: number;      // max 10
  total: number;         // 0 - 100
  explanation: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  freezeTokens: number;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  iconName: string;
  category: 'streak' | 'form' | 'challenge' | 'milestone';
}

export interface UserBadge {
  badgeId: string;
  earnedAt: string;
}

export interface Challenge {
  id: string;
  partnerId?: string;
  partnerType?: 'college' | 'gym' | 'corporate' | 'global';
  title: string;
  description: string;
  metric: 'active_days' | 'total_minutes' | 'form_score' | 'total_sessions';
  targetValue: number;
  startDate: string;
  endDate: string;
  teamsEnabled: boolean;
  participantsCount: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  departmentOrTeam?: string;
  score: number;
  rank: number;
  streakDays: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode: 'guide' | 'coach';
  sources?: string[];
  actionButtons?: {
    label: string;
    action: string;
    payload?: any;
  }[];
  safetyFlagged?: boolean;
}

export interface SafetyEvent {
  id: string;
  userId: string;
  timestamp: string;
  category: string;
  ruleId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  redactedText: string;
  actionTaken: string;
  status: 'pending' | 'reviewed' | 'dismissed';
}

export interface PartnerOrg {
  id: string;
  type: 'college' | 'gym' | 'corporate';
  name: string;
  branding: {
    logoUrl?: string;
    primaryColor: string;
  };
  domainAllowlist: string[];
  inviteCode: string;
  memberCount: number;
  activeRatePct: number;
  groups: string[]; // Departments, Hostels, Teams
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  metric: 'reps' | 'duration' | 'form_score';
  value: number;
  unit: string;
  achievedAt: string;
}
