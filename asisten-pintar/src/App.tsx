import React, { useState, useEffect } from 'react';
import {
  INITIAL_DOCUMENTS,
  INITIAL_CHATS,
  INITIAL_SETTINGS,
  PROMPT_TEMPLATES,
} from './data/initialData';
import {
  DocumentItem,
  ChatSession,
  ChatMessage,
  AISettings,
  Citation,
  PromptTemplate,
} from './types';
import { Sidebar } from './components/Sidebar';
import { DokumenSayaView } from './components/DokumenSayaView';
import { TanyaJawabView } from './components/TanyaJawabView';
import { PengaturanView } from './components/PengaturanView';
import { TemplateTersimpanView } from './components/TemplateTersimpanView';
import { DokumentasiView } from './components/DokumentasiView';
import { DocumentModal } from './components/DocumentModal';
import { SourceModal } from './components/SourceModal';
import logoIcon from '../assets/cleaning.png';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dokumen' | 'tanya' | 'pengaturan' | 'template' | 'dokumentasi'>('dokumentasi');
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem('asisten_pintar_docs');
    if (!saved) return INITIAL_DOCUMENTS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.filter((d: DocumentItem) => !['doc-1', 'doc-2', 'doc-3', 'doc-4'].includes(d.id));
    } catch {
      return INITIAL_DOCUMENTS;
    }
  });

  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('asisten_pintar_chats');
    if (!saved) return INITIAL_CHATS;
    try {
      const parsed = JSON.parse(saved);
      return parsed.filter((c: ChatSession) => c.id !== 'chat-1');
    } catch {
      return INITIAL_CHATS;
    }
  });

  const [templates, setTemplates] = useState<PromptTemplate[]>(() => {
    const saved = localStorage.getItem('asisten_pintar_templates');
    if (!saved) return PROMPT_TEMPLATES;
    try {
      const parsed = JSON.parse(saved);
      return parsed.filter((t: PromptTemplate) => !['tpl-1', 'tpl-2', 'tpl-3', 'tpl-4'].includes(t.id));
    } catch {
      return PROMPT_TEMPLATES;
    }
  });

  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    return chatSessions.length > 0 ? chatSessions[0].id : '';
  });

  const [settings, setSettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('asisten_pintar_settings');
    const parsedSettings = saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    return parsedSettings;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('asisten_pintar_dark') === 'true';
  });

  const [inspectDoc, setInspectDoc] = useState<DocumentItem | null>(null);
  const [inspectCitation, setInspectCitation] = useState<Citation | null>(null);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem('asisten_pintar_docs', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('asisten_pintar_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  useEffect(() => {
    localStorage.setItem('asisten_pintar_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('asisten_pintar_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('asisten_pintar_dark', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial documents from backend
  useEffect(() => {
    fetch('/api/knowledge/files')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error('Failed to load documents:', err));
  }, []);

  // Handle New Chat Session
  const handleNewChat = () => {
    const newId = 'chat-' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'Obrolan Baru',
      createdAt: new Date().toLocaleString('id-ID'),
      updatedAt: new Date().toLocaleString('id-ID'),
      messages: [],
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentChatId(newId);
    setActiveTab('tanya');
  };

  // Handle Select Chat
  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setActiveTab('tanya');
  };

  // Handle Delete Chat
  const handleDeleteChat = (id: string) => {
    const updated = chatSessions.filter((c) => c.id !== id);
    setChatSessions(updated);
    if (currentChatId === id) {
      if (updated.length > 0) {
        setCurrentChatId(updated[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // Handle Rename Chat
  const handleRenameChat = (id: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle.trim() || 'Obrolan' } : c))
    );
  };

  // Handle Pin Chat
  const handlePinChat = (id: string) => {
    setChatSessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  // Handle Add Document
  const handleAddDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Handle Delete Document
  const handleDeleteDocument = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge/files/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Selected Documents
  const handleDeleteSelected = async (ids: string[]) => {
    await Promise.all(ids.map((id) => handleDeleteDocument(id)));
  };

  // Handle Scan Folder
  const handleScanFolder = async (folderPath: string) => {
    try {
      const res = await fetch('/api/knowledge/scan-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder: folderPath }),
      });
      if (res.ok) {
        // Refresh full list after scan
        const refreshRes = await fetch('/api/knowledge/files');
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData.documents) {
            setDocuments(refreshData.documents);
          }
        }
      }
    } catch (err) {
      console.error('Scan folder error:', err);
    }
  };

  // Handle Send Message in Chat (RAG AI Execution)
  const handleSendMessage = async (text: string, targetDocId?: string) => {
    let session = chatSessions.find((c) => c.id === currentChatId);

    if (!session) {
      const newId = 'chat-' + Date.now();
      session = {
        id: newId,
        title: text.slice(0, 24) || 'Obrolan Baru',
        createdAt: new Date().toLocaleString('id-ID'),
        updatedAt: new Date().toLocaleString('id-ID'),
        messages: [],
      };
      setChatSessions((prev) => [session!, ...prev]);
      setCurrentChatId(newId);
    }

    const userMsg: ChatMessage = {
      id: 'msg-u-' + Date.now(),
      chatId: session.id,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Update session title if first message
    const updatedTitle = session.messages.length === 0 ? text.slice(0, 24) : session.title;

    setChatSessions((prev) =>
      prev.map((c) =>
        c.id === session!.id
          ? {
              ...c,
              title: updatedTitle,
              updatedAt: new Date().toLocaleString('id-ID'),
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    // Call RAG Chat Backend API
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: session.messages,
          settings,
          targetDocId,
        }),
      });

      if (!res.ok) throw new Error('API error: ' + res.statusText);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let fullContent = '';
      let citations: Citation[] = [];
      const assistantMsgId = 'msg-a-' + Date.now();
      
      // Add empty assistant message first
      setChatSessions((prev) =>
        prev.map((c) =>
          c.id === session!.id
            ? {
                ...c,
                updatedAt: new Date().toLocaleString('id-ID'),
                messages: [
                  ...c.messages,
                  {
                    id: assistantMsgId,
                    chatId: session!.id,
                    role: 'assistant',
                    content: '',
                    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                    citations: [],
                  }
                ],
              }
            : c
        )
      );

      if (reader) {
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          let finished = false;
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr === '[DONE]') {
                finished = true;
                break;
              }
              try {
                const data = JSON.parse(dataStr);
                if (data.sources) {
                  citations = data.sources;
                }
                if (data.delta) {
                  fullContent += data.delta;
                }
                if (data.error) {
                  fullContent += '\n\n' + data.error;
                }
                
                // Update message in state
                setChatSessions((prev) =>
                  prev.map((c) =>
                    c.id === session!.id
                      ? {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMsgId
                              ? { ...m, content: fullContent, citations }
                              : m
                          ),
                        }
                      : c
                  )
                );
              } catch (e) {
                // Ignore incomplete JSON
              }
            }
          }
          if (finished) {
            reader.cancel();
            break;
          }
        }
      }
    } catch (err) {
      console.error('RAG Chat API error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'msg-a-err-' + Date.now(),
        chatId: session.id,
        role: 'assistant',
        content:
          'Maaf, terjadi kendala saat menghubungkan ke server RAG AI. Harap periksa koneksi atau pengaturan API key.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatSessions((prev) =>
        prev.map((c) =>
          c.id === session!.id ? { ...c, messages: [...c.messages, fallbackMsg] } : c
        )
      );
    }
  };

  const handleUseTemplate = (promptText: string) => {
    setActiveTab('tanya');
    handleSendMessage(promptText);
  };

  const handleSaveTemplate = (newTpl: PromptTemplate) => {
    setTemplates((prev) => [newTpl, ...prev]);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const currentChatSession = chatSessions.find((c) => c.id === currentChatId) || null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2fa] via-[#ece6f6] to-[#e3d9f2] dark:from-[#171422] dark:via-[#211c33] dark:to-[#2c2444] text-[#191c1d] dark:text-gray-100 flex font-body antialiased transition-colors duration-300">
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#f3f4f5] dark:bg-[#1e1e24] border-b border-[#cdc3d0] dark:border-gray-800 flex items-center justify-between px-4 z-20">
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="Asisten Pintar" className="w-7 h-7 object-contain" />
          <span className="font-headline font-bold text-[16px]">Asisten Pintar</span>
        </div>
        <button
          onClick={handleNewChat}
          className="p-1.5 text-[#6f5092] hover:bg-[#e9d5ff] dark:hover:bg-[#4f4062]/60 rounded-lg"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onPinChat={handlePinChat}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content View Container */}
      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen pt-14 md:pt-0 relative">
        {activeTab === 'dokumen' && (
          <DokumenSayaView
            documents={documents}
            onAddDocument={handleAddDocument}
            onDeleteDocument={handleDeleteDocument}
            onDeleteSelected={handleDeleteSelected}
            onScanFolder={handleScanFolder}
            onSelectDocForInspection={(doc) => setInspectDoc(doc)}
            onQuickChat={(msg) => {
              setActiveTab('tanya');
              handleSendMessage(msg);
            }}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'tanya' && (
          <TanyaJawabView
            currentChat={currentChatSession}
            documents={documents}
            onSendMessage={handleSendMessage}
            onInspectCitation={(cite) => setInspectCitation(cite)}
            onSaveTemplate={handleSaveTemplate}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'pengaturan' && (
          <PengaturanView
            settings={settings}
            onSaveSettings={(newSettings) => setSettings(newSettings)}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'template' && (
          <TemplateTersimpanView
            templates={templates}
            onUseTemplate={handleUseTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'dokumentasi' && (
          <DokumentasiView darkMode={darkMode} />
        )}
      </div>

      {/* Inspection Modals */}
      <DocumentModal
        doc={inspectDoc}
        onClose={() => setInspectDoc(null)}
        onAskAboutDoc={(docId, docName) => {
          setActiveTab('tanya');
          handleSendMessage(
            `Jelaskan detail dan isi penting dari dokumen ${docName}.`,
            docId
          );
        }}
      />

      <SourceModal
        citation={inspectCitation}
        onClose={() => setInspectCitation(null)}
      />
    </div>
  );
}
