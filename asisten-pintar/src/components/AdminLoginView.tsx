import React, { useState } from 'react';
import logoIcon from '../../assets/cleaning.png';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'ragprodi@gmail.com' && password === 'admin123') {
      localStorage.setItem('asisten_pintar_admin_auth', 'true');
      localStorage.setItem('asisten_pintar_admin_user', username.trim());
      setError('');
      onLoginSuccess();
    } else {
      setError('Username atau password salah. Cek kembali.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f5f2fa] via-[#ece6f6] to-[#e3d9f2] dark:from-[#171422] dark:via-[#211c33] dark:to-[#2c2444]">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 rounded-[24px] shadow-[0_12px_32px_rgba(111,80,146,0.12)] p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#6f5092] dark:bg-[#8b6bb5] flex items-center justify-center shadow-md mb-3">
            <img src={logoIcon} alt="Asisten Pintar" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="font-headline text-[22px] font-extrabold text-[#191c1d] dark:text-gray-100">Masuk Admin</h1>
          <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-400 mt-1">Asisten Pintar • Area kelola sumber & pengaturan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-body text-[12px] font-bold text-[#4a454f] dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">person</span> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              className="w-full bg-[#f5f2fa] dark:bg-[#121216] border border-[#cdc3d0] dark:border-gray-700 rounded-2xl px-4 py-2.5 font-body text-[14px] text-[#191c1d] dark:text-gray-100 placeholder-[#aaa4b0] focus:outline-none focus:ring-2 focus:ring-[#6f5092] focus:border-[#6f5092]"
              autoFocus
            />
          </div>

          <div>
            <label className="block font-body text-[12px] font-bold text-[#4a454f] dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">key</span> Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                className="w-full bg-[#f5f2fa] dark:bg-[#121216] border border-[#cdc3d0] dark:border-gray-700 rounded-2xl px-4 py-2.5 pr-10 font-body text-[14px] text-[#191c1d] dark:text-gray-100 placeholder-[#aaa4b0] focus:outline-none focus:ring-2 focus:ring-[#6f5092] focus:border-[#6f5092]"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a454f] dark:text-gray-400 hover:text-[#6f5092] dark:hover:text-[#d8b4fe]"
              >
                <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <p className="font-body text-[11px] text-[#4a454f]/70 dark:text-gray-400/50 mt-1.5">Default: <span className="font-mono font-bold">ragprodi@gmail.com / admin123</span></p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl px-3 py-2.5 flex items-center gap-2 font-body text-[12px] font-medium">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#6f5092] hover:bg-[#5d4179] text-white rounded-2xl font-headline font-extrabold text-[14px] shadow-[0_6px_16px_rgba(111,80,146,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">login</span>
            Masuk ke Admin
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#cdc3d0] dark:border-gray-800 flex items-center justify-between">
          <a href="/" className="font-body text-[12px] font-bold text-[#4a454f] dark:text-gray-400 hover:text-[#6f5092] dark:hover:text-[#d8b4fe] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span> Kembali ke Beranda
          </a>
          <span className="font-body text-[11px] text-[#aaa4b0] dark:text-gray-500">v1.0 • Aman</span>
        </div>
      </div>
    </div>
  );
};
