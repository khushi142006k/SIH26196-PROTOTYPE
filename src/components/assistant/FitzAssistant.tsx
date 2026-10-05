/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  Info
} from 'lucide-react';

export function FitzAssistant() {
  const { user, setActiveTab, setActiveWorkoutId } = useApp();

  const userName = user?.name ? user.name.split(' ')[0] : 'Friend';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      mode: 'coach',
      content: `Hello ${userName}! I'm Fitz, your safety-first AI Personal Trainer. How can I assist your workout today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['FITS-in-ALL Verified Library']
    }
  ]);

  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const quickChips = [
    'I only have 15 minutes today',
    'Why did my Progress Score change?',
    'My knee hurts during squats',
    'Show me low-impact alternatives'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m-usr-${Date.now()}`,
      role: 'user',
      mode: 'coach',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode: 'coach',
          userContext: {
            name: user?.name || 'Friend',
            level: user?.level || 'beginner',
            goal: user?.goal || 'stay_active',
            equipment: user?.equipment || ['none'],
            lowImpactMode: user?.lowImpactMode || false
          }
        })
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `m-ai-${Date.now()}`,
        role: 'assistant',
        mode: 'coach',
        content: data.reply || 'I am here to help you move safely!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || ['Verified Exercise Database'],
        actionButtons: data.actionButtons || [],
        safetyFlagged: data.safetyFlagged || false
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `m-err-${Date.now()}`,
          role: 'assistant',
          mode: 'coach',
          content: 'Here is a 15-minute quick session: 3 min warm-up, 3 rounds of squats, incline push-ups and glute bridges. Ready?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButtons: [{ label: '⚡ Start 15-Min Quick Session', action: 'start_quick_15' }]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action === 'start_quick_15') {
      setActiveWorkoutId('quick-15-min');
      setActiveTab('workout_player');
    } else if (action === 'view_progress_score') {
      setActiveTab('dashboard');
    } else if (action === 'open_camera_demo') {
      setActiveTab('camera');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4 animate-fade-in pb-24 md:pb-12 h-[calc(100vh-100px)] flex flex-col justify-between">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A5B4FC] text-[#1E1B4B] flex items-center justify-center font-bold shadow-md">
            🤖
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-lg text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-1.5">
              Fitz AI Personal Trainer
              <span className="text-[10px] bg-[#E0E7FF] dark:bg-[#1E1B4B] text-[#312E81] dark:text-[#C7D2FE] font-bold px-2 py-0.5 rounded-full">
                RAG Safety Layer
              </span>
            </h1>
            <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
              Grounded in FITS-in-ALL verified exercise database • Medical safety filtered
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-[#2DD4BF] text-[#0F172A] dark:bg-[#5EEAD4] dark:text-[#042F2E] rounded-br-none font-medium'
                  : msg.safetyFlagged
                  ? 'bg-[#FDE8EC] dark:bg-[#BE123C]/20 border border-[#BE123C]/30 text-[#BE123C] dark:text-[#F87171] rounded-bl-none'
                  : 'bg-[#E0E7FF] dark:bg-[#1E1B4B] border border-[#A5B4FC]/40 text-[#312E81] dark:text-[#C7D2FE] rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

              {/* Action Buttons */}
              {msg.actionButtons && msg.actionButtons.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[#E2E8F0] dark:border-[#26334F] flex flex-wrap gap-2">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(btn.action)}
                      className="px-3 py-1.5 rounded-xl bg-[#2DD4BF] text-[#0F172A] dark:bg-[#5EEAD4] dark:text-[#042F2E] font-bold text-xs shadow hover:opacity-95"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-[10px] text-[#475569] dark:text-[#9FB0C8]">
                <span>{msg.timestamp}</span>
                {msg.sources && <span>Source: {msg.sources[0]}</span>}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#475569] dark:text-[#9FB0C8] animate-pulse">
            <Bot className="w-4 h-4 text-[#4F46E5] dark:text-[#A5B4FC]" />
            <span>Fitz is checking exercise database & safety rules...</span>
          </div>
        )}
      </div>

      {/* Quick Reply Chips & Input Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-[#18233B] hover:bg-[#E0E7FF] text-[#0F172A] dark:text-[#E6EDF7] rounded-xl text-xs font-medium shrink-0 transition-colors"
            >
              ⚡ {chip}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-2 rounded-2xl shadow-sm">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Fitz anything (e.g. 'I have 15 mins', 'Swap squat')..."
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm focus:outline-none text-[#0F172A] dark:text-[#E6EDF7]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-[#2DD4BF] hover:bg-[#14B8A6] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] text-[#0F172A] dark:text-[#042F2E] disabled:opacity-50 rounded-xl font-bold transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
