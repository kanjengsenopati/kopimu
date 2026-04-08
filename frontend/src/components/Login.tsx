import React, { useState } from 'react';
import { Text } from './ui/Text';
import { 
  ShieldCheck, TrendingUp, Users, Lock, Mail, 
  ArrowRight, CheckCircle, Globe, Loader2 
} from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulated Authentication
    setTimeout(() => {
      if (
        (email === 'admin@kopimu.id' || email === 'anggota@kopimu.id') && 
        password === 'password123'
      ) {
        onLogin(email);
      } else {
        setError('Email atau password salah. Coba admin@kopimu.id / password123');
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      {/* Visual Column (Left) - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-3/5 relative bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 p-20 flex-col justify-between overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[18px] flex items-center justify-center">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">KOPIMU <span className="font-light text-blue-300">SYSTEM</span></span>
          </div>

          <div className="space-y-6 max-w-lg">
            <Text.H1 className="text-white text-5xl leading-tight">
              Koperasi Pintar <br /> 
              <span className="text-blue-400">Multi Usaha.</span>
            </Text.H1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed">
              Platform manajemen koperasi modern yang transparan, aman, dan mematuhi standar SAK EP untuk masa depan ekonomi mandiri.
            </p>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: <TrendingUp size={18} />, label: 'SAK EP Accounting', desc: 'Double-entry journaling' },
            { icon: <Users size={18} />, label: 'Member Core', desc: 'Real-time database' },
            { icon: <Lock size={18} />, label: 'RBAC Security', desc: 'Granular permissions' },
            { icon: <Globe size={18} />, label: 'Cloud Native', desc: 'Sync across branches' },
          ].map((item, i) => (
            <div key={i} className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] hover:bg-white/10 transition-all cursor-default">
              <div className="text-blue-400 mb-3">{item.icon}</div>
              <div className="text-white text-sm font-bold">{item.label}</div>
              <div className="text-slate-500 text-[11px] mt-1 uppercase tracking-wider">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Column (Right) */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-slate-50 lg:bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-2 mb-12">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                 <ShieldCheck size={20} className="text-white" />
             </div>
             <span className="text-xl font-bold text-slate-900">KOPIMU</span>
        </div>

        <div className="w-full max-w-sm space-y-10">
          <div>
            <Text.H1 className="text-slate-900">Selamat Datang 👋</Text.H1>
            <Text.Body className="mt-2 text-slate-500">Masuk ke backoffice pengurus koperasi.</Text.Body>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Text.Label className="mb-2 block ml-1 text-slate-400">EMAIL CORPORATE / ANGGOTA</Text.Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kopimu.id"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 lg:bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2 px-1">
                    <Text.Label className="text-slate-400">PASSWORD AKSES</Text.Label>
                    <button type="button" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Lupa Password?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 lg:bg-white border border-slate-200 rounded-[20px] outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span className="text-xs font-bold">{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-[20px] py-4 font-bold text-sm shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Masuk Sekarang 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <Text.Caption className="not-italic text-slate-400">
              Belum punya akses? <button className="text-blue-600 font-bold hover:underline">Hubungi Sekretaris </button>
            </Text.Caption>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="absolute bottom-8 left-0 w-full text-center px-12">
            <div className="flex items-center justify-center gap-2 text-slate-300">
                <CheckCircle size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-[2px]">SAK EP Compliance Certified</span>
            </div>
        </div>
      </div>
    </div>
  );
};

const AlertCircle = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
