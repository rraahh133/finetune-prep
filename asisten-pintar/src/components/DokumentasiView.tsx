import React from 'react';
import logoIcon from '../../assets/cleaning.png';

interface DokumentasiViewProps {
  darkMode: boolean;
}

export const DokumentasiView: React.FC<DokumentasiViewProps> = ({ darkMode }) => {
  void darkMode;
  return (
    <div className="relative flex-1 w-full min-h-full overflow-hidden">
      {/* ====== DEKORASI BACKGROUND ====== */}
      {/* Orb cahaya lembut */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#8b6bb5]/30 dark:bg-[#8b6bb5]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full bg-[#6f5092]/25 dark:bg-[#d8b4fe]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-[#e9d5ff]/70 dark:bg-[#4f4062]/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-40 w-[300px] h-[300px] rounded-full bg-[#d8b4fe]/40 dark:bg-[#6f5092]/25 blur-3xl pointer-events-none" />

      {/* Frame akademik di sudut */}
      <div className="absolute top-5 left-5 md:top-9 md:left-9 w-16 h-16 md:w-20 md:h-20 border-t-[3px] border-l-[3px] border-[#6f5092]/60 dark:border-[#d8b4fe]/50 rounded-tl-lg pointer-events-none" />
      <div className="absolute bottom-5 right-5 md:bottom-9 md:right-9 w-16 h-16 md:w-20 md:h-20 border-b-[3px] border-r-[3px] border-[#6f5092]/60 dark:border-[#d8b4fe]/50 rounded-br-lg pointer-events-none" />

      {/* Garis margin vertikal (kiri & kanan) */}
      <div className="absolute top-0 bottom-0 left-[7%] hidden lg:block w-[2px] bg-gradient-to-b from-transparent via-[#6f5092]/45 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-[7%] hidden lg:block w-[2px] bg-gradient-to-b from-transparent via-[#6f5092]/45 to-transparent pointer-events-none" />

      {/* ====== KONTEN ====== */}
      <div className="relative z-10 flex-1 max-w-[920px] mx-auto w-full px-6 md:px-14 pt-12 md:pt-16 pb-24">
        {/* Masthead */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-14 h-14 rounded-2xl bg-[#6f5092]/10 dark:bg-[#4f4062]/40 flex items-center justify-center mb-5 border border-[#cdc3d0]/30 dark:border-gray-700">
            <img src={logoIcon} alt="Asisten Pintar" className="w-8 h-8 object-contain" />
          </div>
          <p className="font-body text-[11px] font-semibold tracking-[0.24em] uppercase text-[#6f5092] dark:text-[#d8b4fe] mb-3">
            Sistem Tanya Jawab Berbasis Dokumen
          </p>
          <h1 className="font-headline text-[32px] md:text-[42px] font-bold tracking-[-0.02em] leading-[1.12] text-[#191c1d] dark:text-gray-100">
            Asisten Pintar
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-[2px] w-12 bg-[#6f5092]/70 dark:bg-[#d8b4fe]/60" />
            <span className="w-2 h-2 rotate-45 bg-[#6f5092]/80 dark:bg-[#d8b4fe]/70" />
            <span className="h-[2px] w-12 bg-[#6f5092]/70 dark:bg-[#d8b4fe]/60" />
          </div>
          <p className="font-body text-[14px] md:text-[15px] text-[#4a454f] dark:text-gray-300 leading-[1.9] max-w-[640px] mt-6 text-justify">
            Platform <em>Retrieval-Augmented Generation</em> yang menjawab pertanyaan secara kontekstual berdasarkan
            dokumen pribadi Anda — bukan sekadar jawaban umum. Setiap respons dirangkai dari sumber yang relevan,
            dengan rujukan yang dapat ditelusuri.
          </p>
        </div>

        {/* I. Prinsip Kerja */}
        <section className="mb-14">
          <h2 className="font-headline text-[16px] font-bold text-[#191c1d] dark:text-gray-100 mb-6 flex items-baseline gap-3">
            <span className="font-body text-[13px] font-bold text-[#6f5092] dark:text-[#d8b4fe] tracking-widest">I</span>
            <span className="tracking-wide">Prinsip Kerja</span>
            <span className="flex-1 h-[2px] bg-[#cdc3d0]/60 dark:bg-gray-700 translate-y-[-4px]" />
          </h2>
          <div className="space-y-5">
            <p className="font-body text-[13.5px] md:text-[14px] text-[#4a454f] dark:text-gray-300 leading-[1.95] text-justify">
              Aplikasi bekerja dalam tiga tahap. <span className="font-semibold text-[#191c1d] dark:text-gray-100">Pertama</span>,
              dokumen yang Anda impor — dalam format PDF, teks biasa, Markdown, Jupyter Notebook, Word, Excel, maupun
              gambar — dibaca dan diproses menjadi indeks yang dapat dicari. <span className="font-semibold text-[#191c1d] dark:text-gray-100">Kedua</span>,
              setiap pertanyaan yang Anda ajukan dicocokkan terhadap indeks tersebut untuk menemukan bagian-bagian yang
              paling relevan. <span className="font-semibold text-[#191c1d] dark:text-gray-100">Ketiga</span>, model AI
              menyusun jawaban dengan berlandaskan bagian-bagian itu, sehingga setiap pernyataan dapat ditelusuri kembali
              ke sumber aslinya.
            </p>
            <p className="font-body text-[13.5px] md:text-[14px] text-[#4a454f] dark:text-gray-300 leading-[1.95] text-justify">
              Pendekatan ini membedakan Asisten Pintar dari asisten percakapan pada umumnya: jawaban tidak berasal dari
              pengetahuan umum model semata, melainkan dari korpus dokumen yang Anda kendalikan sendiri. Semakin relevan
              dan lengkap dokumen yang diimpor, semakin akurat pula jawaban yang dihasilkan.
            </p>
          </div>
        </section>

        {/* II. Fitur Utama */}
        <section className="mb-14">
          <h2 className="font-headline text-[16px] font-bold text-[#191c1d] dark:text-gray-100 mb-7 flex items-baseline gap-3">
            <span className="font-body text-[13px] font-bold text-[#6f5092] dark:text-[#d8b4fe] tracking-widest">II</span>
            <span className="tracking-wide">Fitur Utama</span>
            <span className="flex-1 h-[2px] bg-[#cdc3d0]/60 dark:bg-gray-700 translate-y-[-4px]" />
          </h2>
          <div className="space-y-7">
            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-9 h-9 rounded-lg bg-[#6f5092]/10 dark:bg-[#4f4062]/40 flex items-center justify-center shrink-0 mt-0.5 border border-[#cdc3d0]/30 dark:border-gray-700">
                <span className="material-symbols-outlined text-[18px] text-[#6f5092] dark:text-[#d8b4fe]">import_contacts</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-[14.5px] font-bold text-[#191c1d] dark:text-gray-100 leading-snug">
                  Impor & Kelola Dokumen
                </h3>
                <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-[1.85] mt-1.5 text-justify">
                  Masukkan seluruh folder berisi materi belajar, buku, atau arsip. Dokumen tersusun rapi di satu tempat,
                  siap dijadikan dasar jawaban kapan saja.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-9 h-9 rounded-lg bg-[#6f5092]/10 dark:bg-[#4f4062]/40 flex items-center justify-center shrink-0 mt-0.5 border border-[#cdc3d0]/30 dark:border-gray-700">
                <span className="material-symbols-outlined text-[18px] text-[#6f5092] dark:text-[#d8b4fe]">forum</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-[14.5px] font-bold text-[#191c1d] dark:text-gray-100 leading-snug">
                  Tanya AI Berbasis Sumber
                </h3>
                <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-[1.85] mt-1.5 text-justify">
                  Ajukan pertanyaan dengan atau tanpa fokus pada dokumen tertentu. Setiap jawaban disertai daftar sumber,
                  lengkap dengan nama dokumen dan tingkat kecocokan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-9 h-9 rounded-lg bg-[#6f5092]/10 dark:bg-[#4f4062]/40 flex items-center justify-center shrink-0 mt-0.5 border border-[#cdc3d0]/30 dark:border-gray-700">
                <span className="material-symbols-outlined text-[18px] text-[#6f5092] dark:text-[#d8b4fe]">bookmark</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-[14.5px] font-bold text-[#191c1d] dark:text-gray-100 leading-snug">
                  Template Pertanyaan
                </h3>
                <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-[1.85] mt-1.5 text-justify">
                  Simpan pertanyaan yang sering diulang sebagai template, lalu gunakan kembali dengan sekali klik — cocok
                  untuk pola kerja rutin seperti merangkum atau mengulas materi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 md:gap-5">
              <div className="w-9 h-9 rounded-lg bg-[#6f5092]/10 dark:bg-[#4f4062]/40 flex items-center justify-center shrink-0 mt-0.5 border border-[#cdc3d0]/30 dark:border-gray-700">
                <span className="material-symbols-outlined text-[18px] text-[#6f5092] dark:text-[#d8b4fe]">verified_user</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline text-[14.5px] font-bold text-[#191c1d] dark:text-gray-100 leading-snug">
                  Transparansi & Verifikasi
                </h3>
                <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-[1.85] mt-1.5 text-justify">
                  Setiap klaim dapat ditelusuri balik ke dokumen asalnya. Anda tidak perlu mempercayai jawaban secara
                  membabi buta — periksa rujukannya sendiri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catatan */}
        <section className="mb-4">
          <div className="border-l-2 border-[#6f5092]/40 dark:border-[#d8b4fe]/40 pl-5 py-1">
            <p className="font-body text-[12.5px] text-[#4a454f] dark:text-gray-400 leading-[1.9] text-justify">
              <span className="font-semibold text-[#191c1d] dark:text-gray-200">Catatan.</span> Asisten menjawab sebaik
              mungkin berdasarkan dokumen yang tersedia, namun tetap dapat keliru. Untuk keputusan akademik atau
              profesional, periksa kembali informasi penting pada sumber aslinya. Dokumentasi teknis lengkap tersedia
              untuk pengguna dengan peran admin.
            </p>
          </div>
        </section>

        <div className="mt-14 pt-6 border-t border-[#cdc3d0]/30 dark:border-gray-800/40 flex items-center justify-between">
          <span className="font-body text-[11px] tracking-wide text-[#aaa4b0] dark:text-gray-500">Asisten Pintar</span>
          <span className="font-body text-[11px] text-[#aaa4b0] dark:text-gray-500">RAG • Berbasis Dokumen</span>
        </div>
      </div>
    </div>
  );
};
