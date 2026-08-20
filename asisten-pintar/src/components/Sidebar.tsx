import React, { useState, useEffect, useRef } from 'react';
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
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartRename = (chat: ChatSession) => {
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
    setOpenMenuId(null);
  };

  const handleSaveRename = (id: string) => {
    if (onRenameChat) {
      onRenameChat(id, editingTitle);
    }
    setEditingChatId(null);
  };

  const sortedChatSessions = [...chatSessions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });
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
          <div className="px-1 mt-1 mb-4">
            <button
              onClick={() => {
                onNewChat();
                setIsOpenMobile(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#6f5092] hover:opacity-95 text-white rounded-xl font-body text-[14px] font-medium transition-colors shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Obrolan Baru
            </button>
          </div>

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
              menu_book
            </span>
            <span>Dokumentasi</span>
          </button>

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

          <p className="font-body text-[11px] font-semibold text-[#4a454f] dark:text-gray-400 uppercase tracking-wider mb-2 px-3 mt-6">
            Riwayat Obrolan
          </p>

          {/* Chat History List */}
          <div className="space-y-1 relative" ref={menuRef}>
            {sortedChatSessions.length === 0 ? (
              <p className="px-4 py-2 text-[12px] text-gray-400 italic">Belum ada obrolan</p>
            ) : (
              sortedChatSessions.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    if (editingChatId !== chat.id) {
                      onSelectChat(chat.id);
                      setActiveTab('tanya');
                      setIsOpenMobile(false);
                    }
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer ${
                    currentChatId === chat.id && activeTab === 'tanya'
                      ? 'bg-[#e7e8e9] dark:bg-[#2e3132] font-semibold text-[#6f5092] dark:text-[#d8b4fe]'
                      : 'text-[#4a454f] dark:text-gray-300 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132]'
                  }`}
                >
                  {editingChatId === chat.id ? (
                    <div
                      className="flex items-center gap-1.5 w-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(chat.id);
                          if (e.key === 'Escape') setEditingChatId(null);
                        }}
                        autoFocus
                        className="flex-1 bg-white dark:bg-[#121216] border border-[#6f5092] dark:border-[#d8b4fe] rounded px-2 py-0.5 text-[12px] text-gray-900 dark:text-gray-100 focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveRename(chat.id)}
                        className="p-1 text-green-600 hover:text-green-700 cursor-pointer"
                        title="Simpan"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </button>
                      <button
                        onClick={() => setEditingChatId(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        title="Batal"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 truncate pr-1 flex-1">
                        {chat.pinned ? (
                          <span
                            className="material-symbols-outlined text-[15px] text-[#6f5092] dark:text-[#d8b4fe] shrink-0"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                            title="Disematkan"
                          >
                            push_pin
                          </span>
                        ) : (
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              currentChatId === chat.id
                                ? 'bg-[#6f5092] dark:bg-[#d8b4fe]'
                                : 'bg-[#cdc3d0]'
                            }`}
                          ></span>
                        )}
                        <span className="truncate">{chat.title || 'Obrolan'}</span>
                      </div>

                      {/* Hamburger / Menu Trigger Button */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                          }}
                          title="Menu Pilihan"
                          className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-opacity shrink-0 cursor-pointer ${
                            openMenuId === chat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">more_vert</span>
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === chat.id && (
                          <div
                            className="absolute right-0 top-7 w-36 bg-white dark:bg-[#25252d] border border-[#cdc3d0]/60 dark:border-gray-700 rounded-xl shadow-lg py-1 z-50 text-[12px] font-normal"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleStartRename(chat)}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">edit</span>
                              <span>Ganti nama</span>
                            </button>

                            <button
                              onClick={() => {
                                if (onPinChat) onPinChat(chat.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">push_pin</span>
                              <span>{chat.pinned ? 'Lepas Sematan' : 'Sematkan'}</span>
                            </button>

                            <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                            <button
                              onClick={() => {
                                onDeleteChat(chat.id);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center gap-2 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-[#cdc3d0] dark:border-gray-800 flex flex-col gap-3 px-2">
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-1">
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
