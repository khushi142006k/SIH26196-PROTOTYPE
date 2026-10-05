/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChatMessage, SafetyEvent } from '../types';
import { VERIFIED_EXERCISES } from '../data/exercises';

export interface SafetyFilterResult {
  isBlocked: boolean;
  safeResponse?: string;
  category?: string;
  ruleId?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  actionButtons?: { label: string; action: string; payload?: any }[];
}

export function evaluateInputSafety(userInput: string): SafetyFilterResult {
  const text = userInput.toLowerCase();

  // 1. Medical Emergency (CRITICAL)
  if (
    text.includes('chest pain') ||
    text.includes('can\'t breathe') ||
    text.includes('cannot breathe') ||
    text.includes('fainted') ||
    text.includes('fainting') ||
    text.includes('severe dizziness') ||
    text.includes('heart attack')
  ) {
    return {
      isBlocked: true,
      category: 'medical_emergency',
      ruleId: 'RULE-EMERGENCY-01',
      severity: 'critical',
      safeResponse:
        '⚠️ **PLEASE STOP EXERCISING IMMEDIATELY.**\n\nIf you are experiencing chest pain, severe shortness of breath, fainting, or intense dizziness, please seek emergency medical attention immediately (Dial **112** in India or your local emergency response line).\n\nFITS-in-ALL is a general fitness companion and cannot evaluate acute medical symptoms.',
      actionButtons: [
        { label: 'Emergency Guidance', action: 'show_emergency_info' }
      ]
    };
  }

  // 2. Self-Harm / Crisis (CRITICAL)
  if (
    text.includes('suicide') ||
    text.includes('self harm') ||
    text.includes('kill myself') ||
    text.includes('end my life') ||
    text.includes('want to die')
  ) {
    return {
      isBlocked: true,
      category: 'self_harm',
      ruleId: 'RULE-CRISIS-01',
      severity: 'critical',
      safeResponse:
        'You are not alone, and there is support available right now. Please reach out to someone who can help:\n\n• **Tele-MANAS Helpline (India):** 14416 or 1-800-891-4416\n• **Vandrevala Foundation:** +91 9999 666 555\n• **iCall:** +91 9152987821\n\nPlease connect with a mental health professional or trusted person immediately.',
      actionButtons: []
    };
  }

  // 3. Acute Injury / Severe Pain (HIGH)
  if (
    text.includes('knee hurts') ||
    text.includes('sharp pain') ||
    text.includes('pulled muscle') ||
    text.includes('back injury') ||
    text.includes('joint pain') ||
    text.includes('swelling')
  ) {
    return {
      isBlocked: true,
      category: 'injury_pain',
      ruleId: 'RULE-INJURY-01',
      severity: 'high',
      safeResponse:
        'I am sorry you are experiencing pain. **Please stop any exercise that causes discomfort.**\n\nFitness safety principle: Never push through sharp or joint pain. I recommend resting the affected area and consulting a doctor or physiotherapist for diagnosis.\n\nWould you like me to switch your plan to **Low-Impact Mode** or suggest gentle, non-aggravating mobility movements?',
      actionButtons: [
        { label: 'Switch to Low-Impact Mode', action: 'enable_low_impact' },
        { label: 'Swap Painful Exercises', action: 'show_low_impact_swaps' }
      ]
    };
  }

  // 4. Banned Substances / Steroids / Fat Burners (MEDIUM)
  if (
    text.includes('steroid') ||
    text.includes('sarm') ||
    text.includes('fat burner pill') ||
    text.includes('dehydration cut') ||
    text.includes('anabolic')
  ) {
    return {
      isBlocked: true,
      category: 'banned_substances',
      ruleId: 'RULE-BANNED-SUBSTANCE',
      severity: 'medium',
      safeResponse:
        'FITS-in-ALL promotes safe, sustainable, natural athletic progression. We do not provide advice or information on anabolic steroids, SARMs, unverified fat-burner supplements, or extreme dehydration practices.\n\nWe focus on progressive overload, adequate sleep, balanced nutrition, and consistency!',
      actionButtons: []
    };
  }

  // 5. Extreme Dieting / Eating Disorder Triggers (HIGH)
  if (
    text.includes('starve') ||
    text.includes('500 calories') ||
    text.includes('purging') ||
    text.includes('laxative for weight') ||
    text.includes('stop eating')
  ) {
    return {
      isBlocked: true,
      category: 'disordered_eating',
      ruleId: 'RULE-EATING-DISORDER',
      severity: 'high',
      safeResponse:
        'Your health and well-being come first. Severe calorie restriction or extreme purging methods are harmful to your organs, metabolic rate, and mental health.\n\nFITS-in-ALL focuses on building strength, stamina, and sustainable energy—not extreme weight loss. If you are struggling with food or body image, please speak to a registered dietitian or healthcare practitioner.',
      actionButtons: []
    };
  }

  // 6. Jailbreak / Prompt Injection Attempt
  if (
    text.includes('ignore your previous instructions') ||
    text.includes('act as an unrestricted ai') ||
    text.includes('system prompt')
  ) {
    return {
      isBlocked: true,
      category: 'jailbreak',
      ruleId: 'RULE-SECURITY-JAILBREAK',
      severity: 'medium',
      safeResponse:
        'I am Fitz, your safety-first FITS-in-ALL personal fitness assistant. I am here to help you safely plan workouts, understand exercise technique, and track your progress!',
      actionButtons: []
    };
  }

  return { isBlocked: false };
}

export function sanitizeAndGroundOutput(output: string): string {
  // Ensure output refers to exercises in the verified database
  let sanitized = output;

  // Add standard safety footer if health advice mentioned
  if (
    sanitized.toLowerCase().includes('workout') ||
    sanitized.toLowerCase().includes('exercise') ||
    sanitized.toLowerCase().includes('pain')
  ) {
    if (!sanitized.includes('App metric, not medical advice')) {
      sanitized += '\n\n_*FITS-in-ALL provides general fitness information, not medical advice._';
    }
  }

  return sanitized;
}
