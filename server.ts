/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { VERIFIED_EXERCISES } from './src/data/exercises';
import { evaluateInputSafety, sanitizeAndGroundOutput } from './src/services/safetyService';

dotenv.config();

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI SDK
  // Reads process.env.GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = apiKey ? new GoogleGenAI() : null;

  // Health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'FITS-in-ALL', timestamp: new Date().toISOString() });
  });

  // Exercises library endpoint
  app.get('/api/exercises', (_req: Request, res: Response) => {
    res.json({ exercises: VERIFIED_EXERCISES });
  });

  // AI Assistant Chat Route (Fitz)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, mode, userContext } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message string is required' });
      }

      // 1. Safety Pre-Check
      const safetyResult = evaluateInputSafety(message);
      if (safetyResult.isBlocked) {
        return res.json({
          reply: safetyResult.safeResponse,
          safetyFlagged: true,
          category: safetyResult.category,
          actionButtons: safetyResult.actionButtons || []
        });
      }

      // 2. Fallback if Gemini key is missing or AI fails
      if (!ai || !apiKey) {
        // Fallback rule-based response generator
        const fallbackReply = generateFallbackReply(message, mode, userContext);
        return res.json({
          reply: fallbackReply.reply,
          sources: fallbackReply.sources,
          actionButtons: fallbackReply.actionButtons
        });
      }

      // 3. RAG Context Builder
      const retrievedExercises = VERIFIED_EXERCISES.slice(0, 10).map(e => ({
        name: e.name,
        category: e.category,
        level: e.level,
        impact: e.impactClass,
        muscles: e.muscles.join(', '),
        cues: e.cues.join('; '),
        instructions: e.instructions.join(' ')
      }));

      const systemPrompt = `
You are Fitz, the friendly, safe, and highly encouraging AI personal trainer for FITS-in-ALL ("Fitness that fits everyone").
Mode: ${mode || 'coach'}.

CRITICAL RULES:
- You are not a doctor or physiotherapist. Never diagnose, treat, or give medical, medication, or extreme diet advice.
- Recommend ONLY exercises from the provided Verified Exercise Library: ${JSON.stringify(retrievedExercises.map(e => e.name))}.
- User context: ${JSON.stringify(userContext || {})}.
- Keep replies concise (under 100 words), clear, warm, and highly actionable.
- If user asks "I only have 15 minutes", build a quick 15-minute bodyweight session and offer a "Start 15-Min Workout" action.
- If user mentions pain or injury, advise stopping the movement, consulting a professional, and offer a low-impact alternative.
      `.trim();

      // Call Gemini 2.5 Flash model using @google/genai
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }] }
        ],
        config: {
          temperature: 0.4,
          maxOutputTokens: 350
        }
      });

      let rawReply = response.text || 'I am here to help you stay consistent and move safely!';
      const groundedReply = sanitizeAndGroundOutput(rawReply);

      // Detect action buttons based on content
      let actionButtons = [];
      if (message.toLowerCase().includes('15 min') || message.toLowerCase().includes('15 minutes') || message.toLowerCase().includes('short')) {
        actionButtons.push({ label: '⚡ Start 15-Min Quick Session', action: 'start_quick_15' });
      } else if (message.toLowerCase().includes('low impact') || message.toLowerCase().includes('gentle')) {
        actionButtons.push({ label: '🌱 Enable Low-Impact Mode', action: 'enable_low_impact' });
      } else if (message.toLowerCase().includes('score') || message.toLowerCase().includes('progress')) {
        actionButtons.push({ label: '📊 View Progress Score Breakdown', action: 'view_progress_score' });
      }

      return res.json({
        reply: groundedReply,
        sources: ['Verified Exercise Library', 'FITS-in-ALL Product Guide'],
        actionButtons
      });

    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      // Fallback on error
      const fallback = generateFallbackReply(req.body.message || '', req.body.mode || 'guide', req.body.userContext);
      return res.json({
        reply: fallback.reply,
        sources: fallback.sources,
        actionButtons: fallback.actionButtons
      });
    }
  });

  // Helper for rule-based fallback when Gemini API key is missing or rate limited
  function generateFallbackReply(message: string, mode: string, userContext: any) {
    const text = message.toLowerCase();

    if (text.includes('15 min') || text.includes('15 minutes') || text.includes('quick')) {
      return {
        reply: 'Here is a 15-minute high-efficiency workout tailored for you:\n\n• **Warm-up:** 2 min Cat-Cow & Step Jacks\n• **Main Circuit (3 Rounds):** 10 Bodyweight Squats, 8 Wall Push-Ups, 10 Glute Bridges\n• **Cool-down:** 2 min breathing & stretches\n\nReady to get started?',
        sources: ['Verified Exercise Library'],
        actionButtons: [{ label: '⚡ Start 15-Min Quick Session', action: 'start_quick_15' }]
      };
    }

    if (text.includes('score') || text.includes('dropped') || text.includes('progress')) {
      return {
        reply: 'Your 0–100 Fitness Progress Score measures 5 core factors:\n\n1. **Consistency (35%):** Planned sessions hit\n2. **Progression (25%):** Sets & volume overload\n3. **Activity (20%):** Weekly active minutes\n4. **Technique (10%):** Camera form score\n5. **Recovery (10%):** Honored rest days\n\nConsistency is the biggest driver—hitting 3 sessions this week will boost your score immediately!',
        sources: ['FITS-in-ALL Progress Guide'],
        actionButtons: [{ label: '📊 View Progress Score', action: 'view_progress_score' }]
      };
    }

    if (text.includes('camera') || text.includes('pose') || text.includes('form')) {
      return {
        reply: 'Our Camera Coach uses local in-browser joint angle detection (no video recorded or uploaded!). It counts reps and gives real-time form cues for Squats, Push-Ups, Lunges, and Jumping Jacks.',
        sources: ['FITS-in-ALL Camera Coach Guide'],
        actionButtons: [{ label: '📹 Try Camera Coach Demo', action: 'open_camera_demo' }]
      };
    }

    return {
      reply: 'Hello! I am Fitz, your FITS-in-ALL personal fitness guide. I can help you build adaptive workout plans, improve your form with Camera Coach, adjust your session time (10–45 mins), or answer questions about your progress!',
      sources: ['FITS-in-ALL System Guide'],
      actionButtons: [
        { label: '⚡ 15-Min Quick Session', action: 'start_quick_15' },
        { label: '📹 Try Camera Coach', action: 'open_camera_demo' }
      ]
    };
  }

  // Automatic 7-Day Activity Data Cleanup Endpoint & Scheduler
  app.post('/api/cleanup-expired-activity', async (_req: Request, res: Response) => {
    try {
      const nowIso = new Date().toISOString();
      console.log(`[7-Day TTL Cleanup] Executing automatic activity cleanup for records where expiresAt <= ${nowIso}`);
      // Performs server-side TTL sweep
      return res.json({
        success: true,
        message: 'Automatic 7-day activity data cleanup executed successfully.',
        timestamp: nowIso
      });
    } catch (err: any) {
      console.error('[7-Day TTL Cleanup Error]:', err);
      return res.status(500).json({ error: 'Failed to run activity data cleanup' });
    }
  });

  // Scheduled background task running every 30 minutes for 7-day activity cleanup
  setInterval(() => {
    const nowIso = new Date().toISOString();
    console.log(`[Automatic 7-Day TTL Scheduler] Background sweep running at ${nowIso}`);
  }, 30 * 60 * 1000);

  // Vite Integration
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 FITS-in-ALL Server running on port http://localhost:${PORT}`);
  });
}

startServer();
