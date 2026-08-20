import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
  content: string;
}

/**
 * Pisahkan blok "Pemikiran" (CoT) dari jawaban utama.
 * Backend menandai CoT dengan "💭 **Pemikiran:**" dan menutupnya dengan "---".
 */
function splitThinking(content: string): { thinking: string; answer: string } {
  const marker = '💭';
  const idx = content.indexOf(marker);
  if (idx === -1) return { thinking: '', answer: content };

  // Cari penutup "---" setelah marker (baris separator)
  const rest = content.slice(idx);
  const sepMatch = rest.search(/\n\s*---\s*\n/);
  if (sepMatch === -1) return { thinking: '', answer: content };

  const thinking = rest.slice(0, sepMatch).replace(/^\n+|\n+$/g, '');
  const answer = content.slice(0, idx) + rest.slice(sepMatch).replace(/^\n\s*---\s*\n/, '\n');
  return { thinking, answer };
}

/** Komponen collapsible untuk blok pemikiran — default tertutup. */
const ThinkingBlock: React.FC<{ text: string }> = ({ text }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-2 rounded-lg border border-[#cdc3d0]/60 dark:border-gray-700 bg-[#f5f2fa]/60 dark:bg-[#1e1e24]/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left cursor-pointer hover:bg-[#ece6f6]/60 dark:hover:bg-[#211c33]/60 transition-colors"
      >
        <span className="flex items-center gap-2 font-body text-[13px] font-semibold text-[#6f5092] dark:text-[#d8b4fe]">
          <span className="text-[14px]">💭</span> Pemikiran Asisten
        </span>
        <span
          className={`material-symbols-outlined text-[16px] text-[#6a5a7e] dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap border-t border-[#cdc3d0]/40 dark:border-gray-800 pt-2">
          {text}
        </div>
      )}
    </div>
  );
};

/**
 * Render pesan asisten (markdown) dengan styling yang rapih:
 * heading, bold/italic, list, kode, blockquote, tabel (GFM), link.
 * Blok "Pemikiran" (CoT) otomatis jadi collapsible, default tertutup.
 */
export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  const { thinking, answer } = useMemo(() => splitThinking(content), [content]);

  return (
    <div className="markdown-body text-[14px] leading-relaxed">
      {thinking && <ThinkingBlock text={thinking} />}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[20px] font-headline font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[17px] font-headline font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[15px] font-headline font-bold mt-3 mb-1.5 text-gray-900 dark:text-gray-100 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[14px] font-bold mt-3 mb-1.5 text-gray-900 dark:text-gray-100 first:mt-0">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-2 text-gray-800 dark:text-gray-200 first:mt-0 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-2 space-y-1 text-gray-800 dark:text-gray-200">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-2 space-y-1 text-gray-800 dark:text-gray-200">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#d8b4fe] dark:border-[#6f5092] bg-[#f5f2fa] dark:bg-[#211c33] rounded-r-lg px-4 py-2 my-2 text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isBlock = className?.includes('language-') || String(children).includes('\n');
            if (isBlock) {
              return (
                <pre className="bg-[#1e1e24] dark:bg-black/40 text-gray-100 rounded-lg p-3 my-2 overflow-x-auto text-[13px] leading-relaxed">
                  <code className="font-mono">{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-[#f3f4f5] dark:bg-[#2c2444] text-[#6f5092] dark:text-[#d8b4fe] rounded px-1.5 py-0.5 font-mono text-[12.5px]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-[#cdc3d0] dark:border-gray-700">
              <table className="w-full text-[13px] border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#f5f2fa] dark:bg-[#211c33]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left px-3 py-2 font-bold text-gray-800 dark:text-gray-200 border-b border-[#cdc3d0] dark:border-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-gray-700 dark:text-gray-300 border-b border-[#cdc3d0]/50 dark:border-gray-800 align-top">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6f5092] dark:text-[#d8b4fe] underline hover:opacity-80"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-3 border-[#cdc3d0]/50 dark:border-gray-700" />,
        }}
      >
        {answer}
      </ReactMarkdown>
    </div>
  );
};
