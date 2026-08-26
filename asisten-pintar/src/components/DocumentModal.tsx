import React, { useState } from 'react';
import { DocumentItem } from '../types';

interface DocumentModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
  onAskAboutDoc: (docId: string, docName: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  doc,
  onClose,
  onAskAboutDoc,
}) => {
  if (!doc) return null;

  const isImage = ['png', 'jpg', 'jpeg'].includes(doc.type?.toLowerCase());
  const [activeTab, setActiveTab] = useState<'chunks' | 'fullText' | 'preview'>(isImage ? 'preview' : 'chunks');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChunks = doc.chunks.filter((c) =>
    c.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#cdc3d0]/40 dark:border-gray-800 flex items-center justify-between bg-[#f8f9fa] dark:bg-[#191c1d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d8b4fe] text-[#604283] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">
                {isImage ? 'image' : 'description'}
              </span>
            </div>
            <div>
              <h3 className="font-headline text-[18px] font-bold text-[#191c1d] dark:text-gray-100">
                {doc.name}
              </h3>
              <p className="font-body text-[12px] text-[#4a454f] dark:text-gray-400">
                {doc.chunkCount} Bagian Chunk • Status: {doc.status} • {doc.uploadedAt}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Sub-Header Tabs */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-[#cdc3d0]/40 dark:border-gray-800 bg-[#f3f4f5] dark:bg-[#2e3132]">
          <div className="flex gap-4">
            {isImage && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`pb-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'preview'
                    ? 'border-[#6f5092] text-[#6f5092] dark:text-[#d8b4fe]'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Pratinjau Gambar
              </button>
            )}
            <button
              onClick={() => setActiveTab('chunks')}
              className={`pb-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'chunks'
                  ? 'border-[#6f5092] text-[#6f5092] dark:text-[#d8b4fe]'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Bagian Chunk RAG ({doc.chunks.length})
            </button>
            <button
              onClick={() => setActiveTab('fullText')}
              className={`pb-2 text-[14px] font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'fullText'
                  ? 'border-[#6f5092] text-[#6f5092] dark:text-[#d8b4fe]'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Teks / Hasil OCR
            </button>
          </div>

          <button
            onClick={() => {
              onAskAboutDoc(doc.id, doc.name);
              onClose();
            }}
            className="px-3 py-1 bg-[#6f5092] hover:bg-[#573878] text-white rounded-lg text-[12px] font-semibold flex items-center gap-1 cursor-pointer shadow-sm mb-2"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            Tanya AI tentang Dokumen Ini
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'preview' ? (
            <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] dark:bg-[#191c1d] rounded-xl border border-[#cdc3d0]/40 dark:border-gray-800">
              <img
                src={`/api/knowledge/files/${encodeURIComponent(doc.name)}/raw`}
                alt={doc.name}
                className="max-h-[380px] max-w-full rounded-lg object-contain shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-3 italic">
                Gambar ini telah diproses dengan OCR dan diindeks ke dalam basis pengetahuan RAG.
              </p>
            </div>
          ) : activeTab === 'chunks' ? (
            <>
              {/* Search Chunks Filter */}
              <div className="relative mb-3">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari kata kunci dalam chunk..."
                  className="w-full pl-9 pr-4 py-2 bg-[#f3f4f5] dark:bg-[#2e3132] border border-[#cdc3d0] dark:border-gray-700 rounded-lg text-[13px] text-[#191c1d] dark:text-gray-100 focus:outline-none focus:border-[#6f5092]"
                />
              </div>

              {filteredChunks.length === 0 ? (
                <p className="text-[#4a454f] dark:text-gray-400 text-[13px] italic py-4 text-center">
                  Tidak ada chunk yang cocok dengan kata pencarian.
                </p>
              ) : (
                filteredChunks.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#191c1d] border border-[#cdc3d0]/40 dark:border-gray-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[12px] font-semibold text-[#6f5092] dark:text-[#d8b4fe]">
                      <span>Bagian {c.chunkIndex}</span>
                      <span className="text-[11px] text-gray-400">
                        {c.content.length} karakter
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[13px] text-[#191c1d] dark:text-gray-200 leading-relaxed">
                      {c.content}
                    </pre>
                  </div>
                ))
              )}
            </>
          ) : (
            <pre className="p-4 rounded-xl bg-[#f8f9fa] dark:bg-[#191c1d] border border-[#cdc3d0]/40 dark:border-gray-800 whitespace-pre-wrap font-sans text-[13px] text-[#191c1d] dark:text-gray-200 leading-relaxed">
              {doc.fullText || 'Tidak ada teks yang diekstrak.'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
