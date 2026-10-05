/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Exercise } from '../types';

export const VERIFIED_EXERCISES: Exercise[] = [
  // 1. SQUAT (Camera Pose Supported)
  {
    id: 'ex-squat',
    slug: 'bodyweight-squat',
    name: 'Bodyweight Squat',
    category: 'strength',
    level: 'beginner',
    impactClass: 'medium',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['none'],
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Keep your chest tall, core tight, and extend arms forward for balance.',
      'Inhale as you hinge hips back and bend knees, lowering until thighs are parallel to floor.',
      'Ensure knees track in line with toes and do not collapse inward.',
      'Exhale as you press through heels to return to standing position.'
    ],
    cues: [
      'Keep chest elevated',
      'Press through heels',
      'Push knees outward over toes',
      'Drive hips backward first'
    ],
    contraindications: ['acute_knee_pain', 'severe_lower_back_pain'],
    poseSupported: true,
    poseConfig: {
      primaryAngles: ['hip_knee_ankle', 'shoulder_hip_knee'],
      repMinAngle: 85, // Below 90deg is full depth
      repMaxAngle: 165, // Standing extension
      formThresholds: [
        { good: 85, warningCue: 'Go deeper for full depth' },
        { good: 160, warningCue: 'Stand tall at top' }
      ]
    },
    regressions: ['ex-chair-squat', 'ex-wall-sit'],
    progressions: ['ex-jump-squat', 'ex-goblet-squat']
  },

  // 2. PUSH-UP (Camera Pose Supported)
  {
    id: 'ex-pushup',
    slug: 'standard-pushup',
    name: 'Standard Push-Up',
    category: 'strength',
    level: 'intermediate',
    impactClass: 'medium',
    muscles: ['Chest', 'Triceps', 'Anterior Deltoids', 'Core'],
    equipment: ['none'],
    instructions: [
      'Start in a full plank position with hands slightly wider than shoulder-width.',
      'Keep body in a straight line from head to heels with core engaged.',
      'Lower your chest toward the floor until elbows reach 90 degrees.',
      'Keep elbows tucked at a 45-degree angle to your torso (not flared).',
      'Press firmly through palms to push back up to starting position.'
    ],
    cues: [
      'Maintain rigid plank line',
      'Tuck elbows 45 degrees',
      'Lower chest to elbow depth',
      'Engage glutes and abdomen'
    ],
    contraindications: ['wrist_injury', 'shoulder_impingement'],
    poseSupported: true,
    poseConfig: {
      primaryAngles: ['shoulder_elbow_wrist', 'shoulder_hip_ankle'],
      repMinAngle: 90,
      repMaxAngle: 165,
      formThresholds: [
        { good: 90, warningCue: 'Lower chest further' },
        { good: 165, warningCue: 'Extend elbows fully' }
      ]
    },
    regressions: ['ex-incline-pushup', 'ex-knee-pushup'],
    progressions: ['ex-decline-pushup', 'ex-diamond-pushup']
  },

  // 3. LUNGE (Camera Pose Supported)
  {
    id: 'ex-lunge',
    slug: 'forward-lunge',
    name: 'Forward Lunge',
    category: 'strength',
    level: 'beginner',
    impactClass: 'medium',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    equipment: ['none'],
    instructions: [
      'Stand upright with hands on hips or at your sides.',
      'Step forward with right leg, lowering hips until both knees form 90-degree angles.',
      'Ensure front knee is aligned directly over ankle, not past toes.',
      'Keep torso upright and back knee hovering just off the ground.',
      'Push off front foot to step back to starting position, then switch legs.'
    ],
    cues: [
      'Step long enough for 90-degree bend',
      'Keep torso vertical',
      'Press through front heel'
    ],
    contraindications: ['knee_patellar_tendinitis', 'ankle_sprain'],
    poseSupported: true,
    poseConfig: {
      primaryAngles: ['hip_knee_ankle'],
      repMinAngle: 95,
      repMaxAngle: 160,
      formThresholds: [
        { good: 95, warningCue: 'Step deeper into lunge' }
      ]
    },
    regressions: ['ex-reverse-lunge', 'ex-step-up'],
    progressions: ['ex-walking-lunge', 'ex-jumping-lunge']
  },

  // 4. JUMPING JACK (Camera Pose Supported)
  {
    id: 'ex-jumping-jack',
    slug: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    level: 'beginner',
    impactClass: 'high',
    muscles: ['Calves', 'Deltoids', 'Glutes', 'Cardiovascular'],
    equipment: ['none'],
    instructions: [
      'Stand feet together with arms at sides.',
      'Jump feet outward wider than hip-width while swinging arms overhead.',
      'Land softly on balls of feet.',
      'Immediately jump back to starting position with arms at sides.'
    ],
    cues: [
      'Land quietly on forefeet',
      'Touch hands overhead',
      'Rhythmic breathing'
    ],
    contraindications: ['joint_impact_sensitivity', 'pelvic_floor_weakness'],
    poseSupported: true,
    poseConfig: {
      primaryAngles: ['left_wrist_right_wrist', 'left_ankle_right_ankle'],
      repMinAngle: 60,
      repMaxAngle: 150,
      formThresholds: [
        { good: 150, warningCue: 'Raise hands fully overhead' }
      ]
    },
    regressions: ['ex-step-jacks'], // Low-impact alternative!
    progressions: ['ex-burpees', 'ex-star-jumps']
  },

  // 5. LOW IMPACT STEP JACKS
  {
    id: 'ex-step-jacks',
    slug: 'low-impact-step-jacks',
    name: 'Step Jacks (Low Impact)',
    category: 'low_impact',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Shoulders', 'Calves', 'Cardiovascular'],
    equipment: ['none'],
    instructions: [
      'Stand feet together and hands at sides.',
      'Step right foot out to the side while raising arms overhead.',
      'Return to center, then step left foot out while raising arms overhead.',
      'Maintain brisk pace without jumping.'
    ],
    cues: ['Keep moving arms briskly', 'Step wide without impact', 'Controlled breath'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: ['ex-jumping-jack']
  },

  // 6. CHAIR / ASSISTED SQUAT
  {
    id: 'ex-chair-squat',
    slug: 'chair-assisted-squat',
    name: 'Chair-Assisted Squat',
    category: 'low_impact',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Quadriceps', 'Glutes'],
    equipment: ['none'],
    instructions: [
      'Stand in front of a sturdy chair with feet shoulder-width apart.',
      'Lower hips slowly until lightly touching chair seat.',
      'Pause for 1 second without resting weight fully.',
      'Press through heels to stand back up.'
    ],
    cues: ['Light tap on chair', 'Keep weight in heels', 'Chest up'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: ['ex-squat']
  },

  // 7. INCLINE PUSH-UP (WALL / COUNTER)
  {
    id: 'ex-incline-pushup',
    slug: 'incline-pushup',
    name: 'Incline Wall/Counter Push-Up',
    category: 'low_impact',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['none'],
    instructions: [
      'Place hands on a wall or sturdy counter slightly wider than shoulders.',
      'Step feet back until body forms a diagonal line.',
      'Lower chest toward surface keeping elbows angled at 45 degrees.',
      'Press back up smoothly.'
    ],
    cues: ['Keep rigid core', 'Inhale down, exhale up', 'Softer angle = easier'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: ['ex-knee-pushup', 'ex-pushup']
  },

  // 8. GLUTE BRIDGE
  {
    id: 'ex-glute-bridge',
    slug: 'bodyweight-glute-bridge',
    name: 'Glute Bridge',
    category: 'low_impact',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Glutes', 'Hamstrings', 'Lower Back', 'Core'],
    equipment: ['mat'],
    instructions: [
      'Lie on back with knees bent, feet flat on floor hip-width apart.',
      'Keep arms by sides with palms down.',
      'Press through heels to lift hips until knees, hips, and shoulders form straight line.',
      'Squeeze glutes tightly at top for 2 seconds, then lower under control.'
    ],
    cues: ['Drive through heels', 'Squeeze glutes at top', 'Do not arch lower back excess'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: ['ex-single-leg-bridge']
  },

  // 9. PLANK
  {
    id: 'ex-plank',
    slug: 'forearm-plank',
    name: 'Forearm Plank',
    category: 'core',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Transverse Abdominis', 'Obliques', 'Shoulders', 'Glutes'],
    equipment: ['mat'],
    instructions: [
      'Place forearms on floor with elbows directly under shoulders.',
      'Extend legs straight back, balancing on toes.',
      'Maintain straight line from shoulders to ankles, tucking pelvis slightly.',
      'Hold position while breathing steadily.'
    ],
    cues: ['Squeeze glutes', 'Press forearms firmly down', 'Don’t sag hips'],
    contraindications: ['acute_herniated_disc'],
    poseSupported: false,
    regressions: ['ex-knee-plank'],
    progressions: ['ex-side-plank']
  },

  // 10. WALL SIT
  {
    id: 'ex-wall-sit',
    slug: 'wall-sit-hold',
    name: 'Wall Sit Hold',
    category: 'strength',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Quadriceps', 'Glutes', 'Calves'],
    equipment: ['none'],
    instructions: [
      'Slide back down wall until thighs are parallel to floor with knees at 90 degrees.',
      'Press entire back flat against wall.',
      'Keep hands off thighs and hold position.'
    ],
    cues: ['90 degree knee bend', 'Back flat against wall', 'Breathe steadily'],
    contraindications: ['patella_pain'],
    poseSupported: false,
    regressions: ['ex-chair-squat'],
    progressions: ['ex-squat']
  },

  // 11. BIRD DOG
  {
    id: 'ex-bird-dog',
    slug: 'quadruped-bird-dog',
    name: 'Bird-Dog Core Hold',
    category: 'low_impact',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Erector Spinae', 'Glutes', 'Core', 'Shoulders'],
    equipment: ['mat'],
    instructions: [
      'Start on all fours with hands under shoulders and knees under hips.',
      'Reach right arm forward and extend left leg straight backward simultaneously.',
      'Hold for 2 seconds keeping hips level to floor.',
      'Return to start and repeat on opposite side.'
    ],
    cues: ['Keep hips square', 'Reach long, don’t arch back', 'Exhale on extension'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: []
  },

  // 12. MOUNTAIN CLIMBERS
  {
    id: 'ex-mountain-climbers',
    slug: 'bodyweight-mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    level: 'intermediate',
    impactClass: 'medium',
    muscles: ['Core', 'Shoulders', 'Hip Flexors', 'Cardiovascular'],
    equipment: ['none'],
    instructions: [
      'Start in high push-up plank position with wrists under shoulders.',
      'Drive right knee in toward chest without letting hips rise.',
      'Quickly switch legs, pulling left knee in while extending right leg back.',
      'Continue in rhythmic running motion.'
    ],
    cues: ['Keep hips low', 'Drive knees straight to chest', 'Hands anchored firmly'],
    contraindications: ['wrist_pain'],
    poseSupported: false,
    regressions: ['ex-plank'],
    progressions: []
  },

  // 13. DUMBBELL BICEP CURL
  {
    id: 'ex-bicep-curl',
    slug: 'dumbbell-bicep-curl',
    name: 'Dumbbell Bicep Curl',
    category: 'strength',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Biceps', 'Brachialis', 'Forearms'],
    equipment: ['dumbbells'],
    instructions: [
      'Stand upright holding dumbbells at sides with palms facing forward.',
      'Keep elbows pinned close to torso.',
      'Curl weights upward toward shoulders while contracting biceps.',
      'Lower weights under control back to starting position.'
    ],
    cues: ['Keep elbows tucked', 'Do not swing torso', 'Full squeeze at top'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: []
  },

  // 14. DUMBBELL OVERHEAD PRESS
  {
    id: 'ex-overhead-press',
    slug: 'dumbbell-overhead-press',
    name: 'Dumbbell Overhead Shoulder Press',
    category: 'strength',
    level: 'intermediate',
    impactClass: 'low',
    muscles: ['Deltoids', 'Triceps', 'Upper Back'],
    equipment: ['dumbbells'],
    instructions: [
      'Hold dumbbells at shoulder height with palms facing forward and elbows at 90 degrees.',
      'Press weights overhead until arms are fully extended without arching back.',
      'Lower weights under control back to shoulder height.'
    ],
    cues: ['Brace core to protect lower back', 'Press straight overhead', 'Inhale down, exhale up'],
    contraindications: ['shoulder_rotator_cuff'],
    poseSupported: false,
    regressions: [],
    progressions: []
  },

  // 15. CAT-COW MOBILITY
  {
    id: 'ex-cat-cow',
    slug: 'cat-cow-stretch',
    name: 'Cat-Cow Spine Stretch',
    category: 'mobility',
    level: 'beginner',
    impactClass: 'low',
    muscles: ['Spine', 'Neck', 'Abdominals'],
    equipment: ['mat'],
    instructions: [
      'Begin on hands and knees with neutral spine.',
      'Inhale as you arch back, tilt pelvis upward, and lift head (Cow).',
      'Exhale as you round spine toward ceiling, tucking chin and pelvic floor (Cat).',
      'Move fluidly between positions.'
    ],
    cues: ['Follow breath rhythm', 'Move segmentally through spine', 'Gentle stretch'],
    contraindications: [],
    poseSupported: false,
    regressions: [],
    progressions: []
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return VERIFIED_EXERCISES.find(e => e.id === id);
}

export function filterExercisesForUser(
  exercises: Exercise[],
  level: string,
  equipment: string[],
  lowImpactOnly: boolean,
  avoidExercises: string[]
): Exercise[] {
  return exercises.filter(ex => {
    if (avoidExercises.includes(ex.id)) return false;
    if (lowImpactOnly && ex.impactClass === 'high') return false;
    
    // Check equipment compatibility
    const needsEquip = ex.equipment.some(eq => eq !== 'none');
    if (needsEquip) {
      const hasReq = ex.equipment.every(eq => eq === 'none' || equipment.includes(eq));
      if (!hasReq) return false;
    }
    
    return true;
  });
}
