import React from 'react';
import { ChatSession } from '../types';
import logoIcon from '../../assets/cleaning.png';

interface SidebarProps {
  activeTab: 'dokumen' | 'tanya' | 'pengaturan' | 'template' | 'dokumentasi';
  setActiveTab: (tab: 'dokumen' | 'tanya' | 'pengaturan' | 'template' | 'dokumentasi') => void;
  chatSessions: ChatSession[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat?: (id: string, newTitle: string) => void;
  onPinChat?: (id: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (val: boolean) => void;
  variant?: 'user' | 'admin';
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  chatSessions,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onPinChat,
  darkMode,
  setDarkMode,
  isOpenMobile,
  setIsOpenMobile,
  variant = 'user',
  onLogout,
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <nav
        className={`fixed left-0 top-0 h-full w-[280px] flex flex-col p-4 z-40 transition-transform duration-300 border-r shadow-sm ${
          darkMode
            ? 'border-gray-800 text-gray-100'
            : 'border-[#cdc3d0] text-[#191c1d]'
        } ${isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="flex items-center justify-center shrink-0">
            <img src={logoIcon} alt="Asisten Pintar" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className="font-headline text-[20px] font-bold leading-tight">
              Asisten Pintar
            </h1>
            <p className="font-body text-[12px] text-[#4a454f] dark:text-gray-400">
              Teman belajar Anda
            </p>
          </div>
        </div>

        {/* Action Button & Navigation Links */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <p className="font-body text-[11px] font-semibold text-[#4a454f] dark:text-gray-400 uppercase tracking-wider mb-2 px-3 mt-4">
            Menu
          </p>

          <button
            onClick={() => {
              setActiveTab('dokumentasi');
              setIsOpenMobile(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-[14px] transition-colors cursor-pointer text-left ${
              activeTab === 'dokumentasi'
                ? 'bg-[#e9d5ff] dark:bg-[#4f4062] text-[#6a5a7e] dark:text-[#eddcff] font-bold'
                : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: activeTab === 'dokumentasi' ? "'FILL' 1" : "'FILL' 0" }}
            >
              {variant === 'user' ? 'home' : 'menu_book'}
            </span>
            <span>{variant === 'user' ? 'Beranda' : 'Dokumentasi'}</span>
          </button>

          {variant === 'user' && (
            <button
              onClick={() => {
                setActiveTab('tanya');
                setIsOpenMobile(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-[14px] transition-colors cursor-pointer text-left ${
                activeTab === 'tanya'
                  ? 'bg-[#e9d5ff] dark:bg-[#4f4062] text-[#6a5a7e] dark:text-[#eddcff] font-bold'
                  : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: activeTab === 'tanya' ? "'FILL' 1" : "'FILL' 0" }}
              >
                chat_bubble
              </span>
              <span>Tanya AI</span>
            </button>
          )}

          {variant === 'admin' && (
            <>
              <button
                onClick={() => {
                  setActiveTab('dokumen');
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-[14px] transition-colors cursor-pointer text-left ${
                  activeTab === 'dokumen'
                    ? 'bg-[#e9d5ff] dark:bg-[#4f4062] text-[#6a5a7e] dark:text-[#eddcff] font-bold'
                    : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: activeTab === 'dokumen' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  description
                </span>
                <span>Dokumen Saya</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('template');
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-[14px] transition-colors cursor-pointer text-left ${
                  activeTab === 'template'
                    ? 'bg-[#e9d5ff] dark:bg-[#4f4062] text-[#6a5a7e] dark:text-[#eddcff] font-bold'
                    : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: activeTab === 'template' ? "'FILL' 1" : "'FILL' 0" }}
                >
                  save
                </span>
                <span>Template Tersimpan</span>
              </button>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#cdc3d0] dark:border-gray-800 flex flex-col gap-3 px-2">
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-1">
              {variant === 'admin' && (
                <button
                  onClick={() => {
                    setActiveTab('pengaturan');
                    setIsOpenMobile(false);
                  }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    activeTab === 'pengaturan'
                      ? 'bg-[#e9d5ff] dark:bg-[#4f4062] text-[#6f5092] dark:text-[#d8b4fe]'
                      : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                  }`}
                  title="Pengaturan"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: activeTab === 'pengaturan' ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    settings
                  </span>
                </button>
              )}
              {variant === 'admin' && onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] rounded-full transition-colors cursor-pointer"
                  title="Keluar Admin"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] rounded-full transition-colors cursor-pointer"
                title="Toggle theme"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full text-[12px] text-[#4a454f] dark:text-gray-400">
            <span>v1.0</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              <span className="font-medium text-[#10b981]">Aktif</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
