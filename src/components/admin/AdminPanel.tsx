/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VERIFIED_EXERCISES } from '../../data/exercises';
import { ShieldAlert, Database, Plus, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

export function AdminPanel() {
  const { safetyEvents, updateSafetyEventStatus } = useApp();

  const [activeTab, setActiveTab] = useState<'safety' | 'exercises' | 'audit'>('safety');
  const [exercises, setExercises] = useState(VERIFIED_EXERCISES);

  const pendingSafety = safetyEvents.filter(e => e.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#BE123C] dark:text-[#F87171] mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Platform Operations & Content Safety Control</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
            Admin Governance Panel
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'safety' ? 'bg-[#BE123C] text-white dark:bg-[#F87171] dark:text-[#0B1220]' : 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7]'
            }`}
          >
            Safety Queue ({pendingSafety.length})
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercises' ? 'bg-[#2DD4BF] text-[#0F172A] dark:bg-[#5EEAD4] dark:text-[#042F2E]' : 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7]'
            }`}
          >
            Exercise Library ({exercises.length})
          </button>
        </div>
      </div>

      {/* SAFETY REVIEW QUEUE */}
      {activeTab === 'safety' && (
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-5 rounded-2xl shadow-sm space-y-4">
          <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
            Flagged AI Safety & Medical Events
          </h2>

          <div className="space-y-3">
            {safetyEvents.map(event => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#BE123C] bg-[#FDE8EC] dark:text-[#F87171] dark:bg-[#BE123C]/20 uppercase text-[10px] px-2 py-0.5 rounded">
                      {event.severity} • {event.category}
                    </span>
                    <span className="text-[#475569] dark:text-[#9FB0C8]">{event.timestamp.split('T')[0]}</span>
                  </div>
                  <div className="font-semibold text-[#0F172A] dark:text-[#E6EDF7] mt-1">
                    {event.redactedText}
                  </div>
                  <div className="text-[#475569] dark:text-[#9FB0C8] mt-0.5">
                    Action: {event.actionTaken}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {event.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => updateSafetyEventStatus(event.id, 'reviewed')}
                        className="px-3 py-1.5 bg-[#15803D] text-white dark:bg-[#4ADE80] dark:text-[#042F2E] font-bold rounded-lg text-xs"
                      >
                        Approve Action
                      </button>
                      <button
                        onClick={() => updateSafetyEventStatus(event.id, 'dismissed')}
                        className="px-3 py-1.5 bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] font-bold rounded-lg text-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <span className="text-[#15803D] dark:text-[#4ADE80] font-bold capitalize">✓ {event.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXERCISES CRUD */}
      {activeTab === 'exercises' && (
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
              Verified Exercise Database
            </h2>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#2DD4BF] hover:bg-[#14B8A6] text-[#0F172A] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] dark:text-[#042F2E] font-bold text-xs rounded-xl shadow">
              <Plus className="w-4 h-4" /> Add New Exercise
            </button>
          </div>

          <div className="space-y-2">
            {exercises.slice(0, 8).map(ex => (
              <div
                key={ex.id}
                className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0F172A] dark:text-[#E6EDF7]">{ex.name}</div>
                  <div className="text-[#475569] dark:text-[#9FB0C8] text-[11px]">
                    Impact: <span className="font-semibold">{ex.impactClass}</span> • Level: {ex.level} • Pose CV: {ex.poseSupported ? 'Yes' : 'No'}
                  </div>
                </div>
                <button className="px-2.5 py-1 bg-[#F1F5F9] dark:bg-[#18233B] rounded-lg text-[#0F172A] dark:text-[#E6EDF7] font-semibold text-[11px]">
                  Edit Configuration
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
