import React, { useState, useMemo } from 'react';
import { DocumentItem } from '../types';
import managerIcon from '../../assets/manager.jpg';

interface DokumenSayaViewProps {
  documents: DocumentItem[];
  onAddDocument: (doc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
  onDeleteSelected?: (ids: string[]) => void;
  onScanFolder: (folderPath: string) => void;
  onSelectDocForInspection: (doc: DocumentItem) => void;
  onQuickChat?: (msg: string) => void;
  darkMode: boolean;
}

export const DokumenSayaView: React.FC<DokumenSayaViewProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onDeleteSelected,
  onScanFolder,
  onSelectDocForInspection,
  onQuickChat,
  darkMode,
}) => {
  const [folderPathInput, setFolderPathInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isChoosingFolder, setIsChoosingFolder] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allFilesRef = React.useRef<HTMLDivElement>(null);

  const handleSelectAll = () => {
    setSelectedIds((prev) => {
      const allSelected = documents.length > 0 && prev.size === documents.length;
      return allSelected ? new Set() : new Set(documents.map((d) => d.id));
    });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteSelectedClick = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Hapus ${selectedIds.size} dokumen terpilih?`)) {
      if (onDeleteSelected) await onDeleteSelected([...selectedIds]);
      else await Promise.all([...selectedIds].map((id) => onDeleteDocument(id)));
      setSelectedIds(new Set());
    }
  };

  React.useEffect(() => {
    fetch('/api/knowledge/watched-folder')
      .then((res) => res.json())
      .then((data) => {
        if (data.folder) {
          setFolderPathInput(data.folder);
        }
      })
      .catch(() => { });
  }, []);

  const handleBrowseFolder = async () => {
    setIsChoosingFolder(true);
    try {
      const res = await fetch('/api/knowledge/choose-folder');
      if (res.ok) {
        const data = await res.json();
        if (data.folder) {
          setFolderPathInput(data.folder);
        }
      }
    } catch (e) {
      console.error('Error choosing folder:', e);
    } finally {
      setIsChoosingFolder(false);
    }
  };

  const handleScanClick = async () => {
    if (!folderPathInput.trim()) return;
    setIsScanning(true);
    try {
      await onScanFolder(folderPathInput);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const handleOpenOriginalDoc = (doc: DocumentItem) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${escapeHtml(doc.name)}</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; background-color: #f8fafc; color: #0f172a; line-height: 1.6; }
              header { border-bottom: 1px solid #cbd5e1; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
              h1 { margin: 0; font-size: 20px; color: #0f172a; }
              .badge { background: #e2e8f0; color: #334155; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; }
              pre { background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            </style>
          </head>
          <body>
            <header>
              <h1>${escapeHtml(doc.name)}</h1>
              <span class="badge">${escapeHtml(doc.type)}</span>
            </header>
            <pre>${escapeHtml(doc.fullText || 'Dokumen kosong.')}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const recentDocs = useMemo(() => {
    return [...documents]
      .sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime())
      .slice(0, 6);
  }, [documents]);

  const colorMap: Record<string, { bg: string, icon: string, tag: string, lightBg: string, nameIcon: string }> = {
    pdf: { bg: 'bg-red-50 dark:bg-red-900/20', icon: 'text-red-500', tag: 'bg-red-500', lightBg: 'bg-red-100', nameIcon: 'picture_as_pdf' },
    md: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-500', tag: 'bg-blue-500', lightBg: 'bg-blue-100', nameIcon: 'article' },
    txt: { bg: 'bg-gray-50 dark:bg-gray-800/40', icon: 'text-gray-500', tag: 'bg-gray-600', lightBg: 'bg-gray-200', nameIcon: 'description' },
    ipynb: { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'text-orange-500', tag: 'bg-orange-500', lightBg: 'bg-orange-100', nameIcon: 'code' },
    docx: { bg: 'bg-sky-50 dark:bg-sky-900/20', icon: 'text-sky-600', tag: 'bg-sky-600', lightBg: 'bg-sky-100', nameIcon: 'description' },
    xlsx: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600', tag: 'bg-emerald-600', lightBg: 'bg-emerald-100', nameIcon: 'table_chart' },
    png: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600', tag: 'bg-purple-600', lightBg: 'bg-purple-100', nameIcon: 'image' },
    jpg: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600', tag: 'bg-purple-600', lightBg: 'bg-purple-100', nameIcon: 'image' },
    jpeg: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-600', tag: 'bg-purple-600', lightBg: 'bg-purple-100', nameIcon: 'image' },
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1280px] mx-auto w-full pt-6 pb-20">

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="font-headline text-[28px] md:text-[32px] font-bold text-[#191c1d] dark:text-gray-100">
          Dokumen Saya
        </h2>
      </div>

      {/* Upper Section: Scan Folder Card */}
      <div className="mb-10">
        <div className="bg-white dark:bg-[#1e1e24] border border-[#cdc3d0] dark:border-gray-800 rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden">
          <div>
            <div className="flex items-start gap-4 mb-3 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#6f5092] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span
                  className="material-symbols-outlined text-[26px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  folder
                </span>
              </div>
              <div>
                <h3 className="font-headline text-[20px] font-bold text-[#191c1d] dark:text-gray-100">
                  Impor Dokumen dari Folder
                </h3>
                <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-400 mt-0.5">
                  Pindai direktori lokal (termasuk seluruh subfolder bertingkat) untuk diindeks ke dalam ChromaDB RAG.
                </p>
              </div>
            </div>

            {/* Supported Formats Grid */}
            <div className="mb-4 pt-3 border-t border-gray-100 dark:border-gray-800/80">
              <span className="text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase block mb-2">
                Format File yang Didukung:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/70 dark:border-red-800/40">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[18px]">picture_as_pdf</span>
                  <div>
                    <div className="text-[12px] font-bold text-red-900 dark:text-red-200">.PDF</div>
                    <div className="text-[10px] text-red-700/80 dark:text-red-300/80">Dokumen PDF</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200/70 dark:border-sky-800/40">
                  <span className="material-symbols-outlined text-sky-600 dark:text-sky-400 text-[18px]">description</span>
                  <div>
                    <div className="text-[12px] font-bold text-sky-900 dark:text-sky-200">.DOCX</div>
                    <div className="text-[10px] text-sky-700/80 dark:text-sky-300/80">MS Word</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[18px]">table_chart</span>
                  <div>
                    <div className="text-[12px] font-bold text-emerald-900 dark:text-emerald-200">.XLSX</div>
                    <div className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">MS Excel</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-800/40">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-[18px]">image</span>
                  <div>
                    <div className="text-[12px] font-bold text-purple-900 dark:text-purple-200">.PNG / .JPG</div>
                    <div className="text-[10px] text-purple-700/80 dark:text-purple-300/80">Gambar & OCR</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[18px]">article</span>
                  <div>
                    <div className="text-[12px] font-bold text-blue-900 dark:text-blue-200">.MD</div>
                    <div className="text-[10px] text-blue-700/80 dark:text-blue-300/80">Markdown</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40">
                  <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[18px]">code</span>
                  <div>
                    <div className="text-[12px] font-bold text-amber-900 dark:text-amber-200">.IPYNB / .TXT</div>
                    <div className="text-[10px] text-amber-700/80 dark:text-amber-300/80">Notebook / Text</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 relative z-10">
              <label className="font-body text-[12px] font-semibold text-[#191c1d] dark:text-gray-300 flex items-center gap-1.5 mb-2">
                <span
                  className="material-symbols-outlined text-[16px] text-[#f59e0b]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  folder
                </span>
                Lokasi Folder (Mendukung Subfolder Bertingkat)
              </label>

              <div className="flex gap-2 sm:gap-3 w-full">
                <input
                  type="text"
                  value={folderPathInput}
                  onChange={(e) => setFolderPathInput(e.target.value)}
                  className="flex-1 bg-[#f3f4f5] dark:bg-[#2e3132] border border-[#cdc3d0] dark:border-gray-700 rounded-lg px-3.5 py-2 font-body text-[14px] text-[#191c1d] dark:text-gray-100 focus:outline-none focus:border-[#6f5092]"
                  placeholder="Contoh: C:\Users\Username\Documents atau folder proyek..."
                />
                <button
                  type="button"
                  onClick={handleBrowseFolder}
                  disabled={isChoosingFolder || isScanning}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg font-body text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap border border-gray-300 dark:border-gray-600 cursor-pointer disabled:opacity-50"
                  title="Pilih Folder dari Komputer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isChoosingFolder ? 'hourglass_top' : 'folder_open'}
                  </span>
                  <span className="hidden sm:inline">Cari Folder</span>
                </button>
                <button
                  onClick={handleScanClick}
                  disabled={isScanning || !folderPathInput.trim()}
                  className="bg-[#FFD54F] hover:opacity-90 text-[#29074a] px-5 py-2 rounded-lg font-body text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm cursor-pointer disabled:opacity-50"
                  title="Impor semua dokumen dari folder ini"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isScanning ? 'sync' : 'search'}
                  </span>
                  <span className="hidden sm:inline">Impor</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-[64px] text-gray-300 dark:text-gray-600 mb-4 block">
            folder_off
          </span>
          <h3 className="font-headline text-[20px] font-bold text-gray-900 dark:text-gray-100 mb-2">
            Belum ada dokumen
          </h3>
          <p className="font-body text-[14px] text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Mulai dengan mengimpor folder di komputer Anda melalui tombol di atas.
          </p>
        </div>
      ) : (
        <>
          {/* Recent Files Section */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline text-[20px] font-bold text-gray-900 dark:text-gray-100">
                Dokumen Terbaru
              </h3>
              <button
                onClick={() => allFilesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-blue-600 dark:text-blue-400 font-body text-[14px] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {recentDocs.map((doc) => {
                const style = colorMap[doc.type] || colorMap.txt;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleOpenOriginalDoc(doc)}
                    className="group cursor-pointer bg-white dark:bg-[#1e1e24] rounded-2xl p-3 md:p-4 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`relative w-full aspect-[4/3] rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-[1.03] overflow-hidden bg-[#2a2a35]`}>
                      <img src={managerIcon} alt="Folder" className="w-full h-full object-cover" />
                      <div className={`absolute bottom-3 right-3 bg-white text-black text-[11px] font-bold px-2.5 py-1 rounded-md uppercase shadow-sm tracking-wider`}>
                        .{doc.type}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-headline text-[15px] font-bold text-gray-900 dark:text-gray-100 truncate mb-1" title={doc.name}>
                        {doc.name}
                      </h4>
                      <p className="font-body text-[13px] text-gray-500 dark:text-gray-400">
                        {formatSize(doc.size || 0)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Files Section */}
          <div ref={allFilesRef}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="font-headline text-[20px] font-bold text-gray-900 dark:text-gray-100">
                Semua Dokumen
              </h3>
              <div className="flex items-center gap-3">
                {selectedIds.size > 0 && (
                  <button
                    onClick={handleDeleteSelectedClick}
                    className="flex items-center gap-2 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-lg text-[13px] font-body text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Hapus Terpilih ({selectedIds.size})
                  </button>
                )}
                <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e24] px-3 py-1.5 rounded-lg text-[13px] font-body text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  Type
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-4 py-3 bg-gray-50/50 dark:bg-[#1a1a20] border-b border-gray-100 dark:border-gray-800">
                <div className="w-6 flex justify-center">
                  <input
                    type="checkbox"
                    checked={documents.length > 0 && selectedIds.size === documents.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#6f5092] cursor-pointer"
                    title="Pilih semua dokumen"
                  />
                </div>
                <div className="flex-1 font-body text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                  NAMA <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                </div>
                <div className="w-[100px] hidden sm:block font-body text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  UKURAN
                </div>
                <div className="w-[120px] hidden lg:block font-body text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  TANGGAL
                </div>
                <div className="w-8"></div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {documents.map((doc) => {
                  const style = colorMap[doc.type] || colorMap.txt;
                  return (
                    <div key={doc.id} className="flex items-center gap-4 px-4 py-3 hover:bg-blue-50/30 dark:hover:bg-gray-800/40 transition-colors group">
                      <div className="w-6 flex justify-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(doc.id)}
                          onChange={() => handleToggleSelect(doc.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 accent-[#6f5092] cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${style.lightBg} dark:bg-gray-800`}>
                          <span className={`material-symbols-outlined text-[20px] ${style.icon}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                            {style.nameIcon}
                          </span>
                        </div>
                        <span
                          className="font-body text-[14px] font-semibold text-gray-900 dark:text-gray-100 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          onClick={() => handleOpenOriginalDoc(doc)}
                          title={doc.name}
                        >
                          {doc.name}
                        </span>
                      </div>

                      <div className="w-[100px] hidden sm:block font-body text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {formatSize(doc.size || 0)}
                      </div>

                      <div className="w-[120px] hidden lg:block font-body text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {formatDate(doc.uploadedAt || '')}
                      </div>

                      <div className="w-8 flex justify-end relative">
                        <button
                          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Hapus dokumen ini?')) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          title="Hapus Dokumen"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
