import React, { useState, useRef, useEffect } from 'react';
import { ChatSession, DocumentItem, Citation, PromptTemplate } from '../types';
import { SaveTemplateModal } from './SaveTemplateModal';
import { MarkdownMessage } from './MarkdownMessage';
import logoIcon from '../../assets/cleaning.png';

/** Kotak kutipan dokumen — collapsible, default tertutup, isi full (tidak diringkas). */
const CitationBlock: React.FC<{
  citations: Citation[];
  onInspectCitation: (citation: Citation) => void;
}> = ({ citations, onInspectCitation }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3 rounded-lg border border-[#cdc3d0]/60 dark:border-gray-700 bg-[#f5f2fa]/60 dark:bg-[#1e1e24]/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left cursor-pointer hover:bg-[#ece6f6]/60 dark:hover:bg-[#211c33]/60 transition-colors"
      >
        <span className="flex items-center gap-2 font-body text-[13px] font-semibold text-[#6f5092] dark:text-[#d8b4fe]">
          <span className="material-symbols-outlined text-[15px]">source</span>
          Kutipan Dokumen ({citations.length})
        </span>
        <span
          className={`material-symbols-outlined text-[16px] text-[#6a5a7e] dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-[#cdc3d0]/40 dark:border-gray-800 pt-2">
          <div className="flex flex-wrap gap-2">
            {citations.map((cite, idx) => (
              <button
                key={idx}
                onClick={() => onInspectCitation(cite)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e9d5ff]/60 dark:bg-[#4f4062]/60 hover:bg-[#d8b4fe] text-[#604283] dark:text-[#eddcff] font-body text-[11px] font-medium transition-colors cursor-pointer border border-[#cdc3d0]/40"
                title="Klik untuk lihat sumber dokumen"
              >
                <span className="material-symbols-outlined text-[12px]">description</span>
                <span className="truncate max-w-[160px]">
                  {cite.docName} (Bagian {cite.chunkIndex})
                </span>
                <span className="text-[10px] opacity-75">{(cite.score * 100).toFixed(0)}%</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface TanyaJawabViewProps {
  currentChat: ChatSession | null;
  documents: DocumentItem[];
  onSendMessage: (text: string, targetDocId?: string) => Promise<void>;
  onInspectCitation: (citation: Citation) => void;
  onSaveTemplate?: (template: PromptTemplate) => void;
  darkMode: boolean;
}

export const TanyaJawabView: React.FC<TanyaJawabViewProps> = ({
  currentChat,
  documents,
  onSendMessage,
  onInspectCitation,
  onSaveTemplate,
  darkMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [promptToSave, setPromptToSave] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isSending]);

  const handleSaveTemplateSubmit = (tpl: PromptTemplate) => {
    if (onSaveTemplate) {
      onSaveTemplate(tpl);
      setToastMsg(`Template "${tpl.title}" berhasil disimpan!`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    setInputText('');
    setIsSending(true);

    try {
      await onSendMessage(text, selectedDocId || undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = currentChat?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-gradient-to-br from-[#f5f2fa] via-[#ece6f6] to-[#e3d9f2] dark:from-[#171422] dark:via-[#211c33] dark:to-[#2c2444]">
      {/* Scrollable Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col items-center pb-36 pt-6">
        <div className="w-full max-w-[800px] flex-1 flex flex-col">
          {messages.length === 0 ? (
            /* Welcome Area */
            <div className="flex-1 flex flex-col justify-center items-center text-center my-auto py-10">
              <span
                className="material-symbols-outlined text-6xl text-[#6f5092] dark:text-[#d8b4fe] mb-4"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                waving_hand
              </span>
              <h2 className="font-headline text-[26px] md:text-[32px] font-bold text-[#191c1d] dark:text-gray-100">
                Halo! Apa yang bisa saya bantu hari ini?
              </h2>
            </div>
          ) : (
            /* Active Message List */
            <div className="space-y-6 my-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 font-body text-[14px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#6f5092] text-white rounded-br-none'
                        : 'bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 text-[#191c1d] dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    {/* Role Header */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#cdc3d0]/40 dark:border-gray-800">
                        <img
                          className="w-5 h-5 object-contain"
                          src={logoIcon}
                          alt="Asisten Pintar"
                        />
                        <span className="font-headline font-semibold text-[13px] text-[#6f5092] dark:text-[#d8b4fe]">
                          Asisten Pintar
                        </span>
                      </div>
                    )}

                    {/* Message Content formatted */}
                    {msg.role === 'assistant' ? (
                      <MarkdownMessage content={msg.content} />
                    ) : (
                      <div className="whitespace-pre-wrap font-body">{msg.content}</div>
                    )}

                    {/* Citations / Sources list — collapsible, default tertutup */}
                    {msg.citations && msg.citations.length > 0 && (
                      <CitationBlock citations={msg.citations} onInspectCitation={onInspectCitation} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-[10px] text-gray-400">
                      {msg.timestamp}
                    </span>
                    {msg.role === 'user' && (
                      <button
                        type="button"
                        onClick={() => {
                          setPromptToSave(msg.content);
                          setSaveModalOpen(true);
                        }}
                        className="p-1 rounded-full text-gray-400 hover:text-[#6f5092] dark:hover:text-[#d8b4fe] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        title="Simpan sebagai template"
                      >
                        <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex flex-col items-start">
                  <div className="bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
                    <span
                      className="material-symbols-outlined text-[20px] text-[#6f5092] animate-spin"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      sync
                    </span>
                    <span className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 animate-pulse">
                      Sedang membaca dokumen & menyusun jawaban...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Bar Fixed at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#f8f9fa] dark:from-[#121216] via-[#f8f9fa]/90 dark:via-[#121216]/90 to-transparent pointer-events-none z-20">
        <div className="max-w-[800px] mx-auto pointer-events-auto">

          {/* Document filter badge if selected */}
          {selectedDocId && (
            <div className="mb-2 flex items-center gap-2 bg-[#e9d5ff] dark:bg-[#4f4062] px-3 py-1 rounded-full text-[12px] text-[#604283] dark:text-[#eddcff] w-fit">
              <span className="material-symbols-outlined text-[14px]">filter_alt</span>
              <span>
                Fokus:{' '}
                {documents.find((d) => d.id === selectedDocId)?.name}
              </span>
              <button
                onClick={() => setSelectedDocId('')}
                className="hover:text-red-600 ml-1 font-bold"
              >
                ×
              </button>
            </div>
          )}

          <div className="bg-white dark:bg-[#1e1e24] rounded-[32px] p-2 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#cdc3d0] dark:border-gray-800 flex items-end gap-2 focus-within:ring-2 focus-within:ring-[#d8b4fe] focus-within:border-[#6f5092] transition-all">
            {/* Document Selector Button */}
            <div className="relative group">
              <button
                type="button"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#4a454f] dark:text-gray-300 hover:bg-[#f3f4f5] dark:hover:bg-[#2e3132] transition-colors flex-shrink-0 cursor-pointer"
                title="Pilih Fokus Dokumen"
              >
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>

              {/* Popup Dropdown to pick doc context */}
              <div className="absolute bottom-12 left-0 hidden group-hover:flex group-focus-within:flex flex-col bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 rounded-xl shadow-lg p-2 min-w-[220px] z-50">
                <p className="text-[11px] font-bold text-gray-500 px-2 py-1 uppercase">
                  Fokus pada dokumen:
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedDocId('')}
                  className={`text-left text-[12px] px-2 py-1.5 rounded hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] ${
                    selectedDocId === '' ? 'font-bold text-[#6f5092]' : ''
                  }`}
                >
                  📚 Semua Dokumen ({documents.length})
                </button>
                {documents.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDocId(d.id)}
                    className={`text-left text-[12px] px-2 py-1.5 rounded hover:bg-[#e7e8e9] dark:hover:bg-[#2e3132] truncate ${
                      selectedDocId === d.id ? 'font-bold text-[#6f5092]' : ''
                    }`}
                  >
                    📄 {d.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 py-2.5 font-body text-[15px] text-[#191c1d] dark:text-gray-100 placeholder-[#4a454f] dark:placeholder-gray-500"
              placeholder="Ketik pertanyaan Anda di sini..."
              rows={1}
              style={{ minHeight: '44px' }}
            />

            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isSending}
              className="w-10 h-10 bg-[#6f5092] hover:bg-[#573878] text-white rounded-full flex items-center justify-center transition-opacity flex-shrink-0 shadow-sm cursor-pointer disabled:opacity-40"
              title="Kirim pesan"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>

          <div className="text-center mt-2.5">
            <p className="font-body text-[11px] text-[#4a454f] dark:text-gray-400">
              Asisten bisa membuat kesalahan. Harap cek kembali informasi penting.
            </p>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#6f5092] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce font-body text-[13px] font-semibold">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Modal to Save Selected Prompt as Template */}
      <SaveTemplateModal
        isOpen={saveModalOpen}
        initialPrompt={promptToSave}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveTemplateSubmit}
      />
    </div>
  );
};
