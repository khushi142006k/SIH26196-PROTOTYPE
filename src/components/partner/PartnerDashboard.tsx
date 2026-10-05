/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building, Users, Trophy, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function PartnerDashboard() {
  const { partners, challenges } = useApp();
  const partner = partners[0]; // NIT College

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'challenges' | 'reports'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#2DD4BF] text-[#0F172A] dark:bg-[#5EEAD4] dark:text-[#042F2E] flex items-center justify-center font-bold text-xl shadow-md">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F766E] dark:text-[#5EEAD4] uppercase tracking-wider">
              {partner.type} Partner Dashboard
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-[#0F172A] dark:text-[#E6EDF7]">
              {partner.name}
            </h1>
            <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
              Invite Code: <code className="bg-[#F1F5F9] dark:bg-[#18233B] px-1.5 py-0.5 rounded font-mono font-bold">{partner.inviteCode}</code> • Privacy-safe aggregated insights
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] text-xs font-bold text-[#0F172A] dark:text-[#E6EDF7] hover:bg-[#F1F5F9]">
          <Download className="w-4 h-4" />
          Export Cohort Report (PDF/CSV)
        </button>
      </div>

      {/* Cohort Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Total Enrolled Members</div>
          <div className="font-mono-numbers font-black text-2xl text-[#0F172A] dark:text-[#E6EDF7] mt-1">
            {partner.memberCount} Users
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Weekly Active Rate</div>
          <div className="font-mono-numbers font-black text-2xl text-[#0F766E] dark:text-[#5EEAD4] mt-1">
            {partner.activeRatePct}%
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Campus Departments</div>
          <div className="font-mono-numbers font-black text-2xl text-[#312E81] dark:text-[#C7D2FE] mt-1">
            {partner.groups.length} Groups
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-4 rounded-2xl shadow-sm">
          <div className="text-xs text-[#475569] dark:text-[#9FB0C8]">Active Challenge</div>
          <div className="font-mono-numbers font-black text-2xl text-[#B45309] dark:text-[#FBBF24] mt-1">
            1 Live
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-[#FFFFFF] dark:bg-[#111A2E] border border-[#E2E8F0] dark:border-[#26334F] p-5 rounded-2xl shadow-sm space-y-4">
        <h2 className="font-heading font-bold text-base text-[#0F172A] dark:text-[#E6EDF7]">
          Department & Hostel Participation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {partner.groups.map((group, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B]/50">
              <div className="font-bold text-xs text-[#0F172A] dark:text-[#E6EDF7]">{group}</div>
              <div className="text-[11px] text-[#475569] dark:text-[#9FB0C8] mt-1">Active Rate: {80 - idx * 4}%</div>
              <div className="w-full bg-[#E2E8F0] dark:bg-[#26334F] h-1.5 rounded-full mt-2">
                <div className="bg-[#14B8A6] dark:bg-[#5EEAD4] h-1.5 rounded-full" style={{ width: `${80 - idx * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
