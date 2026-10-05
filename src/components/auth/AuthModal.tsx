/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    sendPasswordReset
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setSuccessMessage(null);
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    resetForm();
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Google sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      setLoading(true);
      try {
        await sendPasswordReset(email.trim());
        setSuccessMessage('Password reset link sent! Check your email inbox.');
      } catch (err: any) {
        setError(err.message || 'Failed to send reset email.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      setLoading(true);
      try {
        await signUpWithEmail(email.trim(), password, name.trim());
        onClose();
      } catch (err: any) {
        setError(err.message || 'Sign up failed.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter both email and password.');
        return;
      }
      setLoading(true);
      try {
        await signInWithEmail(email.trim(), password);
        onClose();
      } catch (err: any) {
        setError(err.message || 'Login failed.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FFFFFF] dark:bg-[#111A2E] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#26334F] overflow-hidden">
        
        {/* Header bar */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#26334F]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-[#0F172A] shadow-md shadow-[#2DD4BF]/20">
              <Activity className="w-5 h-5 text-[#0F172A]" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg tracking-tight text-[#0F172A] dark:text-[#E6EDF7]">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-xs text-[#475569] dark:text-[#9FB0C8]">
                {mode === 'login' && 'Sign in to access your fitness dashboard'}
                {mode === 'signup' && 'Start your personalized fitness journey'}
                {mode === 'forgot' && 'We will send a reset link to your email'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#475569] dark:text-[#9FB0C8] hover:bg-[#F1F5F9] dark:hover:bg-[#18233B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-[#FDE8EC] dark:bg-[#BE123C]/20 border border-[#BE123C]/30 text-[#BE123C] dark:text-[#F87171] text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-[#CCFBF1] dark:bg-[#0F3D3A] border border-[#14B8A6]/30 text-[#0F766E] dark:text-[#5EEAD4] text-xs font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign In Option */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-[#E2E8F0] dark:border-[#26334F] bg-[#F1F5F9] dark:bg-[#18233B] text-[#0F172A] dark:text-[#E6EDF7] text-sm font-semibold hover:bg-[#E2E8F0] dark:hover:bg-[#26334F] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0] dark:border-[#26334F]" />
                </div>
                <span className="relative px-3 bg-[#FFFFFF] dark:bg-[#111A2E] text-[11px] font-semibold text-[#475569] dark:text-[#9FB0C8] uppercase tracking-wider">
                  or with email
                </span>
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E6EDF7] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-[#475569] dark:text-[#9FB0C8]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aarav Patel"
                    className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F] rounded-xl text-sm text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E6EDF7] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#475569] dark:text-[#9FB0C8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F] rounded-xl text-sm text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#E6EDF7]">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-[#0F766E] dark:text-[#5EEAD4] font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-[#475569] dark:text-[#9FB0C8]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-[#F1F5F9] dark:bg-[#18233B] border border-[#E2E8F0] dark:border-[#26334F] rounded-xl text-sm text-[#0F172A] dark:text-[#E6EDF7] focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#93C5FD]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#14B8A6] dark:bg-[#5EEAD4] dark:hover:bg-[#99F6E4] text-[#0F172A] dark:text-[#042F2E] font-bold text-sm shadow-md shadow-[#2DD4BF]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle modes footer */}
          <div className="pt-2 text-center text-xs text-[#475569] dark:text-[#9FB0C8]">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#0F766E] dark:text-[#5EEAD4] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#0F766E] dark:text-[#5EEAD4] font-bold hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-[#0F766E] dark:text-[#5EEAD4] font-bold hover:underline"
                >
                  Back to Login
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
