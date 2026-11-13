'use client';

import React, { useState } from 'react';
import { X, Building2, Mail, Lock, Phone, MapPin, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login', initialTab }) => {
  const activeInitial = initialTab || defaultTab;
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>(activeInitial);

  React.useEffect(() => {
    if (isOpen) {
      setTab(initialTab || defaultTab);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialTab, defaultTab]);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [pan, setPan] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (tab === 'login') {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        setSuccess('Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Login failed');
      }
    } else {
      if (!businessName) {
        setIsLoading(false);
        setError('Please enter your Registered Business Name.');
        return;
      }
      const res = await signup({
        email,
        password,
        businessName,
        pan,
        phone,
        address,
      });
      setIsLoading(false);
      if (res.success) {
        setSuccess('Business account created successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Registration failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex justify-between items-center px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                tab === 'login'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In (लगइन)
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setError(null);
              }}
              className={`text-sm font-bold pb-2 border-b-2 transition-all ${
                tab === 'signup'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Register Business (खाता खोल्नुहोस्)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Registered Entity / Business Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Kathmandu Studio or Your Name"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    PAN / VAT (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={9}
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    placeholder="9-digit PAN"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Mobile / Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Office / Studio Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. New Baneshwor, Kathmandu"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              {tab === 'login' ? 'Email Address or @Username *' : 'Email Address *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={tab === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tab === 'login' ? 'e.g. himalaya or name@business.com' : 'name@business.com'}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {tab === 'login' && (
              <p className="text-[11px] text-slate-400 mt-1">You can log in using either your email or your @username</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            {tab === 'signup' && (
              <p className="text-[11px] text-slate-400 mt-1">At least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{tab === 'login' ? 'Sign In to My Business' : 'Create Free Business Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-500 pt-2">
            {tab === 'login' ? (
              <>
                New to QuickBill?{' '}
                <button
                  type="button"
                  onClick={() => setTab('signup')}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Create free account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="font-bold text-emerald-600 hover:underline"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};
