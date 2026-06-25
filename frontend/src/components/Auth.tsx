import React, { useState } from 'react';
import api from '../api/axios';

export default function Auth({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Hafatra rehefa mahomby ny Inscription

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        // --- 1. LOJIKA HO AN'NY LOGIN (SE CONNECTER) ---
        const response = await api.post('/auth/login', { email, password });
        
        // Tehirizina ny token ary hiditra ao amin'ny Dashboard
        localStorage.setItem('token', response.data.access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        onLoginSuccess();
      } else {
        // --- 2. LOJIKA HO AN'NY REGISTER (S'INSCRIRE) ---
        await api.post('/auth/register', { email, password, businessName });
        
        // Tsy mampiditra mivantana fa mampiseho hafatra fahombiazana
        setSuccessMessage('Compte créé avec succès ! Veuillez vous connecter avec vos identifiants.');
        
        // Mamerina ny mpampiasa ho eo amin'ny pejy Login mandeha ho azy
        setIsLogin(true);
        
        // Diovina ny password fotsiny mba ho fiarovana
        setPassword('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 transition-all duration-300">
        <h2 className="text-3xl font-black mb-2 text-center text-emerald-400 tracking-tight">
          {isLogin ? 'FinTrack Pro' : 'Créer un compte'}
        </h2>
        <p className="text-slate-400 text-center text-sm mb-6">
          {isLogin ? 'Gérez vos dépenses intelligemment' : 'Commencez à optimiser votre Cash-Flow'}
        </p>

        {/* Fampisehoana ny fahadisoana (Error) */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-sm mb-4 font-medium">
            {error}
          </div>
        )}

        {/* Fampisehoana ny hafatra fahombiazana (Success) rehefa avy nanao Inscription */}
        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-sm mb-4 font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Nom de l'entreprise</label>
              <input 
                type="text" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                required 
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200" 
                placeholder="Ex: Cyber Espace Mada" 
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Adresse Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200" 
              placeholder="nom@entreprise.mg" 
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-400 transition text-sm text-slate-200" 
              placeholder="••••••••" 
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold p-3 rounded-xl shadow-lg shadow-emerald-500/10 transform hover:-translate-y-0.5 transition active:translate-y-0 cursor-pointer mt-2 text-sm">
            {isLogin ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          {isLogin ? "Nouveau sur la plateforme ?" : "Vous avez déjà un compte ?"} {' '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMessage(''); }} className="text-emerald-400 hover:underline font-bold focus:outline-none cursor-pointer">
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}
