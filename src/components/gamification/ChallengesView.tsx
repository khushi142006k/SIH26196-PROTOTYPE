/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeaderboardEntry } from '../../types';
import { Trophy, Flame, Users, Award, Shield, CheckCircle2 } from 'lucide-react';

export function ChallengesView() {
  const { challenges, streak, points, useFreezeToken } = useApp();

  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]);
  const [joined, setJoined] = useState<boolean>(true);

  // Mock Leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { userId: 'u1', userName: 'Computer Science Dept', score: 98, rank: 1, streakDays: 14 },
    { userId: 'u2', userName: 'Aarav Patel (CS)', score: 92, rank: 2, streakDays: 5 },
    { userId: 'u3', userName: 'Mechanical Eng Dept', score: 88, rank: 3, streakDays: 10 },
    { userId: 'u4', userName: 'Hostel A Squad', score: 82, rank: 4, streakDays: 7 },
    { userId: 'u5', userName: 'Electrical Eng', score: 75, rank: 5, streakDays: 4 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B45309] dark:text-[#FBBF24] mb-1">
            <Trophy className="w-4 h-4" />
            <span>Community & Campus Challenges</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
            Consistency Leaderboards & Rewards
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-0.5">
            Ranked by active consistency days, never on extreme exertion
          </p>
        </div>

        {/* User Rewards Summary */}
        <div className="flex items-center gap-3 bg-[#FFF4D6] dark:bg-[#18233B] p-3 rounded-xl border border-[#F59E0B]/40">
          <div>
            <div className="text-[10px] text-[#B45309] dark:text-[#FBBF24] font-semibold uppercase">Total Points</div>
            <div className="font-mono-numbers font-black text-xl text-[#B45309] dark:text-[#FBBF24]">{points} PTS</div>
          </div>
          <div className="h-8 w-px bg-[#F59E0B]/40" />
          <button
            onClick={useFreezeToken}
            className="px-3 py-1.5 bg-[#F59E0B] text-[#1C1917] font-extrabold text-xs rounded-lg shadow hover:bg-[#F59E0B]/90"
            title="Protect your streak during busy exam / travel days"
          >
            🛡️ Claim Freeze ({streak.freezeTokens})
          </button>
        </div>
      </div>

      {/* Challenges Cards & Leaderboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Active Challenges List */}
        <div className="space-y-4">
          <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
            Active Partner Challenges
          </h2>

          {challenges.map(ch => (
            <div
              key={ch.id}
              onClick={() => setSelectedChallenge(ch)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedChallenge.id === ch.id
                  ? 'border-[#F59E0B] bg-[#FFF4D6] dark:bg-[#18233B] shadow-md'
                  : 'border-[#E2E8F0] dark:border-[#26334F] bg-[#FFFFFF] dark:bg-[#111A2E] hover:border-[#F59E0B]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-[#B45309] bg-[#F59E0B]/20 dark:text-[#FBBF24] dark:bg-[#FBBF24]/20 px-2 py-0.5 rounded">
                  {ch.partnerType} Challenge
                </span>
                <span className="text-xs text-[#475569] dark:text-[#9FB0C8] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {ch.participantsCount} Joined
                </span>
              </div>

              <h3 className="font-heading font-bold text-sm text-[#0F172A] dark:text-[#E6EDF7]">
                {ch.title}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8] mt-1 line-clamp-2">
                {ch.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-[#26334F] flex items-center justify-between text-xs">
                <span className="text-[#475569] dark:text-[#9FB0C8]">Target: {ch.targetValue} Active Days</span>
                <span className="font-bold text-[#B45309] dark:text-[#FBBF24]">Leaderboard Active →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Cols: Live Leaderboard */}
        <div className="lg:col-span-2 bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-extrabold text-lg text-[#0F172A] dark:text-[#E6EDF7]">
                {selectedChallenge.title}
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                Department & Team Rankings • Updated Live
              </p>
            </div>

            <button
              onClick={() => setJoined(!joined)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                joined
                  ? 'bg-[#E6F6EC] dark:bg-[#18233B] text-[#15803D] dark:text-[#4ADE80]'
                  : 'brand-gradient text-[#0F172A] shadow'
              }`}
            >
              {joined ? '✓ Joined Challenge' : 'Join Challenge'}
            </button>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2 mt-4">
            {leaderboard.map(entry => (
              <div
                key={entry.userId}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                  entry.rank === 1
                    ? 'border-[#F59E0B] bg-[#FFF4D6] dark:bg-[#18233B]'
                    : 'border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B]/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    entry.rank === 1 ? 'bg-[#F59E0B] text-[#1C1917]' : 'bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7]'
                  }`}>
                    #{entry.rank}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#0F172A] dark:text-[#E6EDF7] flex items-center gap-1.5">
                      {entry.userName}
                      {entry.rank === 1 && <Trophy className="w-3.5 h-3.5 text-[#B45309] dark:text-[#FBBF24] fill-[#F59E0B]" />}
                    </div>
                    <div className="text-[10px] text-[#475569] dark:text-[#9FB0C8]">
                      Consistency Streak: {entry.streakDays} Days
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono-numbers font-black text-sm text-[#0F766E] dark:text-[#5EEAD4]">
                    {entry.score} %
                  </div>
                  <div className="text-[10px] text-[#475569] dark:text-[#9FB0C8]">Target Score</div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
