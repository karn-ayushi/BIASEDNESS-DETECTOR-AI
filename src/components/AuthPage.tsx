import React, { useState } from 'react';
import { ShieldCheck, Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { User as UserType } from '../types';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup
    onLogin({
      username: formData.username || formData.email.split('@')[0],
      email: formData.email
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#d4af37]/5 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
             <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center border border-[#d4af37]/20">
               <Zap className="text-[#d4af37] w-6 h-6 fill-current" />
             </div>
             <h1 className="text-3xl font-serif italic text-[#d4af37] tracking-wider">FairDecide™</h1>
          </div>
          <p className="text-white/40 text-[11px] uppercase tracking-[0.3em] font-bold">Recruiter Governance Suite</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-sm backdrop-blur-sm shadow-2xl">
          <div className="flex gap-6 mb-8 border-b border-white/5">
            <button 
              onClick={() => setIsLogin(true)}
              className={cn(
                "pb-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                isLogin ? "text-[#d4af37]" : "text-white/30 hover:text-white/60"
              )}
            >
              Login
              {isLogin && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />}
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={cn(
                "pb-3 text-xs font-bold uppercase tracking-widest transition-all relative",
                !isLogin ? "text-[#d4af37]" : "text-white/30 hover:text-white/60"
              )}
            >
              Sign Up
              {!isLogin && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Company Name / Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Global Tech Corp"
                    className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded-sm text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors placeholder:text-white/10"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="recruiter@company.com"
                  className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded-sm text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors placeholder:text-white/10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest ml-1">Security Key / Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/10 py-3 pl-10 pr-4 rounded-sm text-sm focus:outline-none focus:border-[#d4af37]/40 transition-colors placeholder:text-white/10"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-[#d4af37] text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-[#c4a030] transition-all flex items-center justify-center gap-2 group mt-8 shadow-xl shadow-[#d4af37]/5"
            >
              {isLogin ? 'Access Suite' : 'Create Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-white/20 leading-relaxed max-w-[280px] mx-auto uppercase tracking-tighter">
            Authorized Personnel Only. Access patterns are logged for compliance monitoring.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
