/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Plan,
  WorkoutExercise,
  WorkoutSessionLog,
  UserStreak,
  UserBadge,
  Badge,
  Challenge,
  PartnerOrg,
  SafetyEvent
} from '../types';
import { generateInitialPlan, adaptPlanAfterSession } from '../services/adaptiveEngine';
import { calculateFitnessProgressScore } from '../services/progressScore';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  OperationType,
  handleFirestoreError,
  getAuthErrorMessage,
  FirebaseUser
} from '../firebase';

// Demo Badges
const ALL_BADGES: Badge[] = [
  { id: 'b-1', key: 'first_workout', name: 'First Step', description: 'Completed your very first workout on FITS-in-ALL', iconName: 'Flame', category: 'milestone' },
  { id: 'b-2', key: 'streak_7', name: '7-Day Unstoppable', description: 'Maintained a 7-day consistency streak', iconName: 'Zap', category: 'streak' },
  { id: 'b-3', key: 'form_master', name: 'Form Precision', description: 'Achieved an average camera form score > 90', iconName: 'Target', category: 'form' },
  { id: 'b-4', key: 'campus_hero', name: 'Campus Champion', description: 'Joined and completed an inter-department challenge', iconName: 'Trophy', category: 'challenge' },
  { id: 'b-5', key: 'low_impact', name: 'Gentle Power', description: 'Completed 5 low-impact joint-safe workouts', iconName: 'Shield', category: 'milestone' }
];

// Initial default user template
const DEFAULT_USER_TEMPLATE: Omit<UserProfile, 'id' | 'name' | 'email'> = {
  role: 'user',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  partnerId: 'part-college-1',
  departmentOrTeam: 'Computer Science Dept',
  goal: 'build_strength',
  level: 'beginner',
  daysPerWeek: 4,
  sessionMinutes: 20,
  equipment: ['none'],
  lowImpactMode: false,
  avoidExercises: [],
  preferredTimeOfDay: 'evening',
  parqAnswers: {
    chestPain: false,
    dizziness: false,
    jointIssue: false,
    bloodPressure: false,
    doctorNotice: false
  },
  parqPassed: true,
  units: 'metric',
  theme: 'light',
  createdAt: '2026-09-01'
};

const INITIAL_PARTNERS: PartnerOrg[] = [
  {
    id: 'part-college-1',
    type: 'college',
    name: 'National Institute of Technology',
    branding: { primaryColor: '#2DD4BF' },
    domainAllowlist: ['nit.edu.in', 'iit.edu.in'],
    inviteCode: 'NIT-FIT-2026',
    memberCount: 340,
    activeRatePct: 78,
    groups: ['Computer Science', 'Mechanical Eng', 'Hostel A', 'Sports Club']
  },
  {
    id: 'part-corporate-1',
    type: 'corporate',
    name: 'TechCorp Global Wellness',
    branding: { primaryColor: '#A5B4FC' },
    domainAllowlist: ['techcorp.com'],
    inviteCode: 'TECH-FIT-WELLNESS',
    memberCount: 850,
    activeRatePct: 65,
    groups: ['Engineering', 'Product', 'Marketing', 'Operations']
  },
  {
    id: 'part-gym-1',
    type: 'gym',
    name: 'Pulse Fitness Club',
    branding: { primaryColor: '#F59E0B' },
    domainAllowlist: ['pulsefitness.com'],
    inviteCode: 'PULSE-VIP',
    memberCount: 120,
    activeRatePct: 88,
    groups: ['Morning Squad', 'Evening Power', 'Beginners']
  }
];

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    partnerId: 'part-college-1',
    partnerType: 'college',
    title: 'Inter-Department Campus Consistency Challenge',
    description: 'Complete 3 active workouts per week for 4 weeks. Leaderboard ranks by department participation rate!',
    metric: 'active_days',
    targetValue: 12,
    startDate: '2026-10-01',
    endDate: '2026-10-28',
    teamsEnabled: true,
    participantsCount: 210
  },
  {
    id: 'ch-2',
    partnerId: 'part-corporate-1',
    partnerType: 'corporate',
    title: 'Corporate 15-Min Active Minutes Blast',
    description: 'Log 300 active session minutes this month. No equipment required!',
    metric: 'total_minutes',
    targetValue: 300,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    teamsEnabled: true,
    participantsCount: 430
  }
];

interface AppContextType {
  firebaseUser: FirebaseUser | null;
  authLoading: boolean;
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  
  // Auth Functions
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Auth Modal State
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  plan: Plan;
  setPlan: React.Dispatch<React.SetStateAction<Plan>>;
  savePlanToFirestore: (updatedPlan: Plan) => Promise<void>;
  addExerciseToPlan: (workoutId: string, newExercise: WorkoutExercise) => Promise<void>;
  updateExerciseInPlan: (workoutId: string, exerciseId: string, updatedFields: Partial<WorkoutExercise>) => Promise<void>;
  deleteExerciseFromPlan: (workoutId: string, exerciseId: string) => Promise<void>;
  sessionLogs: WorkoutSessionLog[];
  logCompletedSession: (session: WorkoutSessionLog) => void;
  streak: UserStreak;
  useFreezeToken: () => boolean;
  earnedBadges: UserBadge[];
  allBadges: Badge[];
  points: number;
  progressScore: ReturnType<typeof calculateFitnessProgressScore>;
  activeWorkoutId: string | null;
  setActiveWorkoutId: (id: string | null) => void;
  cameraDemoActive: boolean;
  setCameraDemoActive: (active: boolean) => void;
  partners: PartnerOrg[];
  challenges: Challenge[];
  safetyEvents: SafetyEvent[];
  addSafetyEvent: (event: Omit<SafetyEvent, 'id' | 'timestamp'>) => void;
  updateSafetyEventStatus: (id: string, status: 'reviewed' | 'dismissed') => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  completeOnboarding: (updatedProfile: UserProfile) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const [activeTab, setActiveTab] = useState<string>('landing');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [plan, setPlan] = useState<Plan>(() => generateInitialPlan({ ...DEFAULT_USER_TEMPLATE, id: 'temp', name: 'User', email: '' }));
  const [sessionLogs, setSessionLogs] = useState<WorkoutSessionLog[]>([]);
  const [streak, setStreak] = useState<UserStreak>({ currentStreak: 0, longestStreak: 0, freezeTokens: 1, lastActiveDate: '' });
  const [earnedBadges, setEarnedBadges] = useState<UserBadge[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const [cameraDemoActive, setCameraDemoActive] = useState<boolean>(false);
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  const [partners] = useState<PartnerOrg[]>(INITIAL_PARTNERS);
  const [challenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [safetyEvents, setSafetyEvents] = useState<SafetyEvent[]>([]);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Helper to construct/sync UserProfile with Firestore
  const syncOrCreateUserProfile = async (fbUser: FirebaseUser, fallbackName?: string): Promise<UserProfile> => {
    const userRef = doc(db, 'users', fbUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const fetched = snap.data() as UserProfile;
        return fetched;
      }
    } catch (err: any) {
      console.warn('Error fetching profile from Firestore:', err?.code, err?.message);
    }

    // Create new profile if not present
    const newProfile: UserProfile = {
      ...DEFAULT_USER_TEMPLATE,
      id: fbUser.uid,
      name: fbUser.displayName || fallbackName || (fbUser.email ? fbUser.email.split('@')[0] : 'User'),
      email: fbUser.email || '',
      avatarUrl: fbUser.photoURL || DEFAULT_USER_TEMPLATE.avatarUrl
    };

    const userPayload = {
      uid: fbUser.uid,
      name: newProfile.name,
      email: newProfile.email,
      goal: newProfile.goal,
      fitnessLevel: newProfile.level,
      equipment: newProfile.equipment,
      availableTime: newProfile.sessionMinutes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log("FIRESTORE WRITE START");
    console.log("USER UID:", fbUser.uid);
    console.log("PROFILE DATA:", userPayload);

    try {
      await setDoc(userRef, userPayload, { merge: true });
      console.log("FIRESTORE WRITE SUCCESS");
    } catch (err: any) {
      console.error("FIRESTORE WRITE FAILED - COMPLETE ERROR:", err?.code, err?.message, err);
      handleFirestoreError(err, OperationType.WRITE, `users/${fbUser.uid}`);
    }

    return newProfile;
  };

  // Firebase Auth Observer & Firestore Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const profile = await syncOrCreateUserProfile(fbUser);
          setUser(profile);
          setTheme(profile.theme === 'dark' ? 'dark' : 'light');

          // Load user plan
          let loadedPlan: Plan | null = null;
          try {
            const planRef = doc(db, 'users', fbUser.uid, 'plan', 'current');
            const planSnap = await getDoc(planRef);
            if (planSnap.exists()) {
              loadedPlan = planSnap.data() as Plan;
            }
          } catch (e) {
            console.warn('Plan fetch notice:', e);
          }

          if (!loadedPlan) {
            const savedPlanLocal = localStorage.getItem('fits_user_plan');
            if (savedPlanLocal) {
              try { loadedPlan = JSON.parse(savedPlanLocal); } catch (e) {}
            }
          }

          if (loadedPlan) {
            setPlan(loadedPlan);
          } else {
            const initialPlan = generateInitialPlan(profile);
            setPlan(initialPlan);
            localStorage.setItem('fits_user_plan', JSON.stringify(initialPlan));

            const nowMs = Date.now();
            const expiresAtMs = nowMs + 7 * 24 * 60 * 60 * 1000; // 7-day TTL
            const planPayload = {
              ...initialPlan,
              userId: fbUser.uid,
              planId: initialPlan.id,
              createdAt: new Date(nowMs).toISOString(),
              expiresAt: new Date(expiresAtMs).toISOString(),
              updatedAt: new Date(nowMs).toISOString()
            };

            console.log("FIRESTORE WRITE START - INITIAL PLAN");
            console.log("USER UID:", fbUser.uid);
            console.log("PLAN DATA:", planPayload);

            try {
              const currentRef = doc(db, 'users', fbUser.uid, 'plan', 'current');
              const planRef = doc(db, 'users', fbUser.uid, 'workoutPlans', initialPlan.id);
              const aiPlanRef = doc(db, 'users', fbUser.uid, 'aiPlans', initialPlan.id);

              await setDoc(currentRef, planPayload);
              await setDoc(planRef, planPayload);
              await setDoc(aiPlanRef, planPayload);
              console.log("FIRESTORE WRITE SUCCESS - INITIAL PLAN");
            } catch (err: any) {
              console.error("FIRESTORE WRITE FAILED - INITIAL PLAN ERROR:", err?.code, err?.message, err);
            }
          }

          // Fetch user's completed workout logs from Firestore
          const logsRef = collection(db, 'users', fbUser.uid, 'sessionLogs');
          const logsSnap = await getDocs(logsRef);
          if (!logsSnap.empty) {
            const remoteLogs: WorkoutSessionLog[] = [];
            logsSnap.forEach(d => remoteLogs.push(d.data() as WorkoutSessionLog));
            setSessionLogs(remoteLogs);
          } else {
            setSessionLogs([]);
          }
        } catch (err) {
          console.error('Error during Auth state sync:', err);
        }
      } else {
        setUser(null);
        setSessionLogs([]);
        setStreak({ currentStreak: 0, longestStreak: 0, freezeTokens: 1, lastActiveDate: '' });
        setPoints(0);
        // If logged out and on a protected tab, return to landing
        setActiveTab(prev => (prev !== 'landing' ? 'landing' : 'landing'));
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign up with Email + Password
  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        await updateProfile(res.user, { displayName: name });
        const profile = await syncOrCreateUserProfile(res.user, name);
        setUser(profile);
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  // Sign in with Email + Password
  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user) {
        const profile = await syncOrCreateUserProfile(res.user);
        setUser(profile);
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        const profile = await syncOrCreateUserProfile(res.user);
        setUser(profile);
        setActiveTab('dashboard');
      }
    } catch (err: any) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  // Send Password Reset Email
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      throw new Error(getAuthErrorMessage(err));
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(null);
      setActiveTab('landing');
      localStorage.removeItem('fits_user_profile');
      localStorage.removeItem('fits_session_logs');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Sync profile changes to Firestore
  useEffect(() => {
    if (user && firebaseUser) {
      localStorage.setItem('fits_user_profile', JSON.stringify(user));
      const userRef = doc(db, 'users', firebaseUser.uid);
      setDoc(userRef, user, { merge: true }).catch(err => {
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      });
    }
  }, [user, firebaseUser]);

  // Save Plan to Firestore helper
  const savePlanToFirestore = async (updatedPlan: Plan) => {
    setPlan(updatedPlan);
    localStorage.setItem('fits_user_plan', JSON.stringify(updatedPlan));
    
    if (firebaseUser) {
      try {
        const nowMs = Date.now();
        const expiresAtMs = nowMs + 7 * 24 * 60 * 60 * 1000; // 7-day TTL
        const fullPayload = {
          ...updatedPlan,
          userId: firebaseUser.uid,
          planId: updatedPlan.id,
          createdAt: updatedPlan.startDate || new Date(nowMs).toISOString(),
          expiresAt: new Date(expiresAtMs).toISOString(),
          updatedAt: new Date(nowMs).toISOString()
        };

        console.log("FIRESTORE WRITE START - SAVE PLAN");
        console.log("USER UID:", firebaseUser.uid);
        console.log("PLAN DATA:", fullPayload);

        const currentRef = doc(db, 'users', firebaseUser.uid, 'plan', 'current');
        const planRef = doc(db, 'users', firebaseUser.uid, 'workoutPlans', updatedPlan.id);
        const aiPlanRef = doc(db, 'users', firebaseUser.uid, 'aiPlans', updatedPlan.id);
        
        await setDoc(currentRef, fullPayload);
        await setDoc(planRef, fullPayload);
        await setDoc(aiPlanRef, fullPayload);

        console.log("FIRESTORE WRITE SUCCESS - PLAN SAVED");
      } catch (err: any) {
        console.error("FIRESTORE WRITE FAILED - SAVE PLAN ERROR:", err?.code, err?.message, err);
        handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}/workoutPlans/${updatedPlan.id}`);
      }
    }
  };

  // Add Exercise to Plan
  const addExerciseToPlan = async (workoutId: string, newExercise: WorkoutExercise) => {
    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === workoutId) {
        return {
          ...w,
          exercises: [...w.exercises, newExercise]
        };
      }
      return w;
    });
    const nextPlan: Plan = {
      ...plan,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };
    await savePlanToFirestore(nextPlan);
  };

  // Update Exercise in Plan
  const updateExerciseInPlan = async (
    workoutId: string,
    exerciseId: string,
    updatedFields: Partial<WorkoutExercise>
  ) => {
    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === workoutId) {
        const updatedExercises = w.exercises.map(we => {
          if (we.id === exerciseId || we.exerciseId === exerciseId) {
            return { ...we, ...updatedFields };
          }
          return we;
        });
        return { ...w, exercises: updatedExercises };
      }
      return w;
    });
    const nextPlan: Plan = {
      ...plan,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };
    await savePlanToFirestore(nextPlan);
  };

  // Delete Exercise from Plan
  const deleteExerciseFromPlan = async (workoutId: string, exerciseId: string) => {
    const updatedWorkouts = plan.workouts.map(w => {
      if (w.id === workoutId) {
        const remainingExercises = w.exercises.filter(
          we => we.id !== exerciseId && we.exerciseId !== exerciseId
        );
        return { ...w, exercises: remainingExercises };
      }
      return w;
    });
    const nextPlan: Plan = {
      ...plan,
      workouts: updatedWorkouts,
      version: plan.version + 1
    };
    await savePlanToFirestore(nextPlan);
  };

  // Sync plan changes to localStorage and Firestore
  useEffect(() => {
    if (plan) {
      localStorage.setItem('fits_user_plan', JSON.stringify(plan));
      if (firebaseUser) {
        const fullPayload = {
          ...plan,
          userId: firebaseUser.uid,
          planId: plan.id,
          createdAt: plan.startDate || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const currentRef = doc(db, 'users', firebaseUser.uid, 'plan', 'current');
        const planRef = doc(db, 'users', firebaseUser.uid, 'workoutPlans', plan.id);
        setDoc(currentRef, fullPayload).catch(err => {
          console.warn('Firestore current plan sync notice:', err);
        });
        setDoc(planRef, fullPayload).catch(err => {
          console.warn('Firestore workoutPlans sync notice:', err);
        });
      }
    }
  }, [plan, firebaseUser]);

  // Handle Theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (user) {
      setUser(prev => (prev ? { ...prev, theme: next } : null));
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser(prev => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const currentRole: UserRole = user ? user.role : 'user';

  const progressScore = calculateFitnessProgressScore(
    sessionLogs,
    streak,
    plan.weeklyTargetSessions,
    plan.weeklyTargetMinutes
  );

  const logCompletedSession = async (session: WorkoutSessionLog) => {
    setSessionLogs(prev => [session, ...prev]);

    const activeUid = firebaseUser ? firebaseUser.uid : (auth.currentUser ? auth.currentUser.uid : null);

    if (activeUid) {
      const nowMs = Date.now();
      const expiresAtMs = nowMs + 7 * 24 * 60 * 60 * 1000; // 7-day TTL

      const sessionPayload = {
        ...session,
        userId: activeUid,
        createdAt: session.startedAt || new Date(nowMs).toISOString(),
        expiresAt: new Date(expiresAtMs).toISOString(),
        updatedAt: new Date(nowMs).toISOString()
      };

      console.log("FIRESTORE WRITE START - WORKOUT ACTIVITY");
      console.log("USER UID:", activeUid);
      console.log("SESSION PAYLOAD:", sessionPayload);

      try {
        const logDocRef = doc(db, 'users', activeUid, 'sessionLogs', session.id);
        const activityDocRef = doc(db, 'users', activeUid, 'activity', session.id);
        const workoutDocRef = doc(db, 'users', activeUid, 'workouts', session.id);

        await setDoc(logDocRef, sessionPayload);
        await setDoc(activityDocRef, sessionPayload);
        await setDoc(workoutDocRef, sessionPayload);

        console.log("FIRESTORE WRITE SUCCESS - WORKOUT ACTIVITY STORED");
      } catch (err: any) {
        console.error("FIRESTORE WRITE FAILED - WORKOUT ACTIVITY ERROR:", err?.code, err?.message, err);
        handleFirestoreError(err, OperationType.WRITE, `users/${activeUid}/sessionLogs/${session.id}`);
      }

      // Execute Adaptive Engine & Save Updated Plan
      if (user) {
        const { updatedPlan, adaptationNotice } = adaptPlanAfterSession(plan, session, user);
        setPlan(updatedPlan);

        const adaptedPlanPayload = {
          ...updatedPlan,
          userId: activeUid,
          planId: updatedPlan.id,
          adaptationLog: adaptationNotice || 'Adapted intensity based on session feedback',
          createdAt: new Date(nowMs).toISOString(),
          expiresAt: new Date(expiresAtMs).toISOString(),
          updatedAt: new Date(nowMs).toISOString()
        };

        try {
          const currentRef = doc(db, 'users', activeUid, 'plan', 'current');
          const planRef = doc(db, 'users', activeUid, 'workoutPlans', updatedPlan.id);
          const aiPlanRef = doc(db, 'users', activeUid, 'aiPlans', updatedPlan.id);

          await setDoc(currentRef, adaptedPlanPayload);
          await setDoc(planRef, adaptedPlanPayload);
          await setDoc(aiPlanRef, adaptedPlanPayload);

          console.log("FIRESTORE WRITE SUCCESS - ADAPTIVE PLAN UPDATED");
        } catch (e: any) {
          console.error("FIRESTORE WRITE FAILED - ADAPTIVE PLAN ERROR:", e?.code, e?.message);
        }
      }

      // Save Progress Data
      const progressPayload = {
        userId: activeUid,
        progressScore,
        streak,
        points: points + session.pointsEarned,
        earnedBadges,
        createdAt: new Date(nowMs).toISOString(),
        expiresAt: new Date(expiresAtMs).toISOString(),
        updatedAt: new Date(nowMs).toISOString()
      };

      try {
        const progressRef = doc(db, 'users', activeUid, 'progress', 'current');
        await setDoc(progressRef, progressPayload);
        console.log("FIRESTORE WRITE SUCCESS - PROGRESS METRICS STORED");
      } catch (e: any) {
        console.error("FIRESTORE WRITE FAILED - PROGRESS ERROR:", e?.code, e?.message);
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (streak.lastActiveDate !== todayStr) {
      setStreak(prev => ({
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
        lastActiveDate: todayStr
      }));
    }

    setPoints(prev => prev + session.pointsEarned);

    if (sessionLogs.length === 0) {
      setEarnedBadges(prev => [...prev, { badgeId: 'b-1', earnedAt: todayStr }]);
    }
    if (session.avgFormScore && session.avgFormScore >= 90) {
      if (!earnedBadges.some(b => b.badgeId === 'b-3')) {
        setEarnedBadges(prev => [...prev, { badgeId: 'b-3', earnedAt: todayStr }]);
      }
    }
  };

  const useFreezeToken = (): boolean => {
    if (streak.freezeTokens > 0) {
      setStreak(prev => ({ ...prev, freezeTokens: prev.freezeTokens - 1 }));
      return true;
    }
    return false;
  };

  const addSafetyEvent = (event: Omit<SafetyEvent, 'id' | 'timestamp'>) => {
    const newEv: SafetyEvent = {
      ...event,
      id: `se-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setSafetyEvents(prev => [newEv, ...prev]);
  };

  const updateSafetyEventStatus = (id: string, status: 'reviewed' | 'dismissed') => {
    setSafetyEvents(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  };

  const completeOnboarding = async (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    const newPlan = generateInitialPlan(updatedProfile);
    setPlan(newPlan);
    localStorage.setItem('fits_user_profile', JSON.stringify(updatedProfile));
    localStorage.setItem('fits_user_plan', JSON.stringify(newPlan));

    const activeUid = firebaseUser ? firebaseUser.uid : (auth.currentUser ? auth.currentUser.uid : updatedProfile.id);

    if (activeUid) {
      console.log("FIRESTORE WRITE START");
      console.log("USER UID:", activeUid);
      console.log("PLAN DATA:", newPlan);

      const userPayload = {
        uid: activeUid,
        name: updatedProfile.name || 'User',
        email: updatedProfile.email || '',
        goal: updatedProfile.goal,
        fitnessLevel: updatedProfile.level,
        equipment: updatedProfile.equipment,
        availableTime: updatedProfile.sessionMinutes,
        createdAt: updatedProfile.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      try {
        const userRef = doc(db, 'users', activeUid);
        await setDoc(userRef, userPayload, { merge: true });

        const planRef = doc(db, 'users', activeUid, 'workoutPlans', newPlan.id);
        const currentPlanRef = doc(db, 'users', activeUid, 'plan', 'current');

        const planPayload = {
          ...newPlan,
          userId: activeUid,
          planId: newPlan.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await setDoc(planRef, planPayload);
        await setDoc(currentPlanRef, planPayload);

        console.log("FIRESTORE WRITE SUCCESS");
      } catch (err: any) {
        console.error("FIRESTORE WRITE FAILED - COMPLETE ERROR:", err?.code, err?.message, err);
      }
    }

    setOnboardingOpen(false);
    setActiveTab('dashboard');
  };

  const resetAllData = () => {
    localStorage.clear();
    if (user) {
      const resetProf: UserProfile = { ...user, ...DEFAULT_USER_TEMPLATE, id: user.id, name: user.name, email: user.email };
      setUser(resetProf);
      setPlan(generateInitialPlan(resetProf));
    }
    setSessionLogs([]);
    setStreak({ currentStreak: 0, longestStreak: 0, freezeTokens: 1, lastActiveDate: '' });
    setPoints(0);
  };

  return (
    <AppContext.Provider
      value={{
        firebaseUser,
        authLoading,
        user,
        setUser,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        openAuthModal,
        role: currentRole,
        switchRole,
        activeTab,
        setActiveTab,
        plan,
        setPlan,
        savePlanToFirestore,
        addExerciseToPlan,
        updateExerciseInPlan,
        deleteExerciseFromPlan,
        sessionLogs,
        logCompletedSession,
        streak,
        useFreezeToken,
        earnedBadges,
        allBadges: ALL_BADGES,
        points,
        progressScore,
        activeWorkoutId,
        setActiveWorkoutId,
        cameraDemoActive,
        setCameraDemoActive,
        partners,
        challenges,
        safetyEvents,
        addSafetyEvent,
        updateSafetyEventStatus,
        toggleTheme,
        theme,
        onboardingOpen,
        setOnboardingOpen,
        completeOnboarding,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
