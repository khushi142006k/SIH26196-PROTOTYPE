/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export function JourneyView() {
  const { sessionLogs, progressScore, streak, earnedBadges, allBadges } = useApp();

  // Mock trend data for charts
  const progressData = [
    { day: 'Week 1', score: 62, minutes: 60 },
    { day: 'Week 2', score: 71, minutes: 80 },
    { day: 'Week 3', score: 78, minutes: 90 },
    { day: 'Week 4', score: progressScore.total, minutes: 110 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm">
        <h1 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
          Fitness Journey & Analytics
        </h1>
        <p className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-1">
          Track consistency, active minutes, and milestone achievements
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Progress Score</div>
          <div className="font-mono-numbers font-black text-2xl text-[#0F766E] dark:text-[#5EEAD4] mt-1">
            {progressScore.total}/100
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Current Streak</div>
          <div className="font-mono-numbers font-black text-2xl text-[#B45309] dark:text-[#FBBF24] mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 text-[#B45309] dark:text-[#FBBF24] fill-[#F59E0B] dark:fill-[#FBBF24]" />
            {streak.currentStreak} Days
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Completed Sessions</div>
          <div className="font-mono-numbers font-black text-2xl text-[#312E81] dark:text-[#C7D2FE] mt-1">
            {sessionLogs.length}
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Badges Earned</div>
          <div className="font-mono-numbers font-black text-2xl text-[#BE123C] dark:text-[#F87171] mt-1">
            {earnedBadges.length}
          </div>
        </div>
      </div>

      {/* Progress Score Trend Chart */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
            Score Progression Trend
          </h2>
          <span className="text-xs font-semibold text-[#134E4A] dark:text-[#99F6E4] bg-[#CCFBF1] dark:bg-[#0F3D3A] px-2.5 py-1 rounded-full">
            +16 Points Increase
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#475569" fontSize={12} />
              <YAxis stroke="#475569" fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#14B8A6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-5 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
          Trophies & Milestone Badges
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {allBadges.map(badge => {
            const isEarned = earnedBadges.some(b => b.badgeId === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isEarned
                    ? 'border-[#F59E0B] bg-[#FFF4D6] dark:bg-[#18233B] text-[#B45309] dark:text-[#FBBF24]'
                    : 'border-[#E2E8F0] dark:border-[#26334F] text-[#475569] dark:text-[#9FB0C8] opacity-60'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 text-[#B45309] dark:text-[#FBBF24] flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                  🏆
                </div>
                <div className="font-bold text-xs">{badge.name}</div>
                <div className="text-[10px] text-[#475569] dark:text-[#9FB0C8] mt-1">{badge.description}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
