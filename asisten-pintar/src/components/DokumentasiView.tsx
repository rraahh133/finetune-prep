import React from 'react';

interface DokumentasiViewProps {
  darkMode: boolean;
}

const Section = ({
  id,
  number,
  title,
  desc,
  children,
}: {
  id: string;
  number: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-6 mb-12">
    <div className="flex items-start gap-4 mb-5">
      <div className="w-9 h-9 rounded-xl bg-[#6f5092] text-white flex items-center justify-center font-headline font-bold text-[15px] shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <h3 className="font-headline text-[20px] md:text-[22px] font-bold text-[#191c1d] dark:text-gray-100 leading-snug">
          {title}
        </h3>
        {desc && (
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
        )}
      </div>
    </div>
    <div className="ml-0 md:ml-[52px]">{children}</div>
  </section>
);

const Step = ({ n, t, d }: { n: string; t: string; d: React.ReactNode }) => (
  <div className="flex items-start gap-4 bg-white dark:bg-[#1e1e24] border border-[#cdc3d0]/40 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
    <div className="w-8 h-8 rounded-full bg-[#6f5092] text-white flex items-center justify-center font-headline font-bold text-[13px] shrink-0">
      {n}
    </div>
    <div className="min-w-0">
      <h5 className="font-headline font-bold text-[14px] text-[#191c1d] dark:text-gray-100 mb-1">{t}</h5>
      <div className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-relaxed">{d}</div>
    </div>
  </div>
);

const Note = ({
  type,
  title,
  children,
}: {
  type: 'info' | 'warn' | 'success';
  title: string;
  children: React.ReactNode;
}) => {
  const styles = {
    info: {
      box: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60',
      icon: 'info',
      iconColor: 'text-sky-600 dark:text-sky-300',
      title: 'text-sky-700 dark:text-sky-200',
    },
    warn: {
      box: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300/60 dark:border-amber-800/60',
      icon: 'warning',
      iconColor: 'text-amber-600 dark:text-amber-400',
      title: 'text-amber-700 dark:text-amber-300',
    },
    success: {
      box: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300/60 dark:border-emerald-800/60',
      icon: 'check_circle',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'text-emerald-700 dark:text-emerald-300',
    },
  }[type];

  return (
    <div className={`rounded-xl border p-4 md:p-5 ${styles.box}`}>
      <div className="flex items-start gap-3">
        <span className={`material-symbols-outlined text-[22px] shrink-0 ${styles.iconColor}`}>{styles.icon}</span>
        <div className="min-w-0">
          <h5 className={`font-headline font-bold text-[13px] mb-1 ${styles.title}`}>{title}</h5>
          <div className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded-md bg-[#f3f4f5] dark:bg-[#2e3132] border border-[#cdc3d0]/40 dark:border-gray-700 font-mono text-[12px] text-[#6f5092] dark:text-[#d8b4fe] break-all">
    {children}
  </code>
);

const DocTitle = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 text-[#191c1d] dark:text-gray-100 mb-2">
      <span
        className="material-symbols-outlined text-3xl text-[#6f5092] dark:text-[#d8b4fe]"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <h2 className="font-headline text-[28px] md:text-[32px] font-bold">{title}</h2>
    </div>
    <p className="font-body text-[14px] md:text-[15px] text-[#4a454f] dark:text-gray-300 leading-relaxed">{desc}</p>
  </div>
);

export const DokumentasiView: React.FC<DokumentasiViewProps> = ({ darkMode }) => {
  void darkMode;
  const toc = [
    { href: '#bagian-1', n: '1', t: 'Tentang Aplikasi', d: 'Apa itu Asisten Pintar dan cara kerjanya' },
    { href: '#bagian-2', n: '2', t: 'Koneksi Server AI', d: 'Menyambungkan asisten ke model AI Anda' },
    { href: '#bagian-3', n: '3', t: 'Mengimpor Dokumen', d: 'Memasukkan dokumen sebagai sumber jawaban' },
    { href: '#bagian-4', n: '4', t: 'Bertanya pada Asisten', d: 'Obrolan, fokus dokumen, dan sumber jawaban' },
    { href: '#bagian-5', n: '5', t: 'Template', d: 'Menyimpan & memakai ulang pertanyaan' },
    { href: '#bagian-6', n: '6', t: 'Google Drive (Opsional)', d: 'Mengambil dokumen dari Drive' },
    { href: '#bagian-7', n: '7', t: 'Tips & Pemecahan Masalah', d: 'Kendala umum dan cara mengatasinya' },
  ];

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[960px] mx-auto w-full pt-6 pb-24">
      {/* Header */}
      <DocTitle
        icon="menu_book"
        title="Dokumentasi"
        desc="Panduan lengkap penggunaan Asisten Pintar — dari menyambungkan koneksi AI, mengimpor dokumen, hingga bertanya dan mendapatkan jawaban yang akurat."
      />

      {/* Daftar Isi */}
      <div className="mb-12">
        <h3 className="font-headline text-[15px] font-bold text-[#191c1d] dark:text-gray-100 mb-4 uppercase tracking-wider">
          Daftar Isi
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toc.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 bg-white dark:bg-[#1e1e24] border border-[#cdc3d0]/40 dark:border-gray-800 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-[#6f5092] dark:hover:border-[#d8b4fe]/60 transition-all group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#e9d5ff]/60 dark:bg-[#4f4062]/60 text-[#604283] dark:text-[#eddcff] flex items-center justify-center font-headline font-bold text-[12px] shrink-0">
                {item.n}
              </div>
              <div className="min-w-0">
                <h4 className="font-headline font-bold text-[13px] text-[#191c1d] dark:text-gray-100 group-hover:text-[#6f5092] dark:group-hover:text-[#d8b4fe] transition-colors">
                  {item.t}
                </h4>
                <p className="font-body text-[12px] text-[#4a454f] dark:text-gray-400 leading-snug mt-0.5">{item.d}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ================= BAGIAN 1: TENTANG APLIKASI ================= */}
      <Section
        id="bagian-1"
        number="1"
        title="Tentang Aplikasi"
        desc="Gambaran singkat sebelum Anda mulai."
      >
        <div className="space-y-4">
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
            <span className="font-semibold text-[#191c1d] dark:text-gray-100">Asisten Pintar</span> adalah aplikasi
            asisten AI yang menjawab pertanyaan Anda <em>berdasarkan isi dokumen pribadi</em> — bukan sekadar jawaban
            umum. Dokumen yang Anda impor (PDF, teks, Markdown, atau Jupyter Notebook) diproses menjadi data yang bisa
            dicari, lalu dijadikan landasan setiap jawaban.
          </p>
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
            Aplikasi terdiri dari dua bagian yang bekerja bersama:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1e1e24] border border-[#cdc3d0]/40 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e9d5ff]/60 dark:bg-[#4f4062]/60 text-[#604283] dark:text-[#eddcff] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">monitor</span>
              </div>
              <h4 className="font-headline font-bold text-[14px] text-[#191c1d] dark:text-gray-100 mb-1">
                Tampilan (Frontend)
              </h4>
              <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
                Halaman yang Anda lihat dan gunakan: menu, dokumen, obrolan, pengaturan.
              </p>
            </div>
            <div className="bg-white dark:bg-[#1e1e24] border border-[#cdc3d0]/40 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#e9d5ff]/60 dark:bg-[#4f4062]/60 text-[#604283] dark:text-[#eddcff] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[22px]">dns</span>
              </div>
              <h4 className="font-headline font-bold text-[14px] text-[#191c1d] dark:text-gray-100 mb-1">
                Mesin (Backend)
              </h4>
              <p className="font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
                Prosesor di balik layar: membaca dokumen, menyimpannya, mencari bagian yang relevan, dan menyusun
                jawaban.
              </p>
            </div>
          </div>
          <Note type="info" title="Penting untuk diketahui">
            Asisten menjawab sebaik mungkin berdasarkan dokumen yang tersedia, tetapi bisa saja keliru. Selalu periksa
            kembali informasi penting yang Anda gunakan.
          </Note>
        </div>
      </Section>

      {/* ================= BAGIAN 2: KONEKSI SERVER AI ================= */}
      <Section
        id="bagian-2"
        number="2"
        title="Koneksi Server AI"
        desc="Menghubungkan asisten ke model AI — satu-satunya pengaturan yang wajib sebelum bertanya."
      >
        <div className="space-y-4">
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
            Buka menu <span className="font-semibold text-[#6f5092] dark:text-[#d8b4fe]">Pengaturan</span> di bagian
            bawah menu samping. Di sana terdapat kartu <span className="font-semibold">Koneksi Server AI</span> dengan
            beberapa kolom. Ikuti urutannya:
          </p>
          <div className="space-y-3">
            <Step
              n="1"
              t="Isi Alamat Server (URL)"
              d={
                <>
                  Isi alamat server AI Anda, misalnya <Code>http://localhost:8000/v1</Code>. Kolom ini biasanya sudah
                  terisi nilai bawaan dan tidak perlu diubah. Nilai ini menentukan ke mana aplikasi mengirim pertanyaan.
                </>
              }
            />
            <Step
              n="2"
              t="Isi Kunci Rahasia (API Key)"
              d={
                <>
                  Masukkan kunci API dari penyedia model AI Anda (biasanya diawali <Code>sk-</Code>). Kunci ini seperti
                  kata sandi — jangan dibagikan ke siapa pun. Jika tidak tahu kuncinya, buat/ambil dari panel penyedia
                  layanan AI yang Anda langganan.
                </>
              }
            />
            <Step
              n="3"
              t="Klik tombol Muat Model"
              d={
                <>
                  Setelah URL dan API Key terisi, klik <span className="font-semibold">Muat Model</span>. Aplikasi
                  menghubungi server untuk meminta daftar model yang tersedia. Jika berhasil, daftar muncul di kolom
                  berikutnya.
                </>
              }
            />
            <Step
              n="4"
              t="Pilih Nama Model AI"
              d={
                <>
                  Dari daftar yang dimuat, pilih model yang ingin dipakai menjawab. Jika daftar tidak muncul, Anda bisa
                  mengetik nama model secara manual pada kolom ini.
                </>
              }
            />
            <Step
              n="5"
              t="Klik Simpan Pengaturan"
              d={
                <>
                  Tekan <span className="font-semibold">Simpan Pengaturan</span>. Muncul pesan hijau{' '}
                  <em>"Pengaturan server AI berhasil disimpan!"</em> berarti koneksi aktif dan siap dipakai di seluruh
                  obrolan.
                </>
              }
            />
          </div>
          <Note type="warn" title="Jika Muat Model gagal">
            Pastikan: (1) alamat URL benar dan bisa dibuka di peramban, (2) API Key benar dan masih berlaku, (3) server
            AI sedang menyala. Pesan error akan tampil di bawah kolom API Key — perhatikan tulisannya.
          </Note>
          <Note type="success" title="Verifikasi cepat">
            Berhasil memuat daftar model = koneksi Anda sehat. Anda siap lanjut ke Bagian 3.
          </Note>
        </div>
      </Section>

      {/* ================= BAGIAN 3: MENGIMPOR DOKUMEN ================= */}
      <Section
        id="bagian-3"
        number="3"
        title="Mengimpor Dokumen"
        desc="Memasukkan dokumen Anda agar bisa menjadi dasar jawaban."
      >
        <div className="space-y-3">
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
            Buka menu <span className="font-semibold text-[#6f5092] dark:text-[#d8b4fe]">Dokumen Saya</span>. Di bagian
            atas terdapat kartu <span className="font-semibold">Impor Dokumen dari Folder</span>.
          </p>
          <Step
            n="1"
            t="Tentukan folder"
            d={
              <>
                Klik <span className="font-semibold">Cari Folder</span> untuk memilih folder dari komputer, atau ketik
                alamat foldernya langsung pada kolom <em>Lokasi Folder</em>.
              </>
            }
          />
          <Step
            n="2"
            t="Klik Impor"
            d={
              <>
                Klik tombol kuning <span className="font-semibold">Impor</span>. Aplikasi membaca semua dokumen yang
                didukung di dalam folder tersebut dan menyimpannya sebagai sumber pengetahuan. Tunggu hingga proses
                selesai (ikon tombol kembali normal).
              </>
            }
          />
          <Step
            n="3"
            t="Periksa hasil impor"
            d={
              <>
                Dokumen yang berhasil diimpor tampil di dua tempat: <em>Dokumen Terbaru</em> (kartu bergambar) dan{' '}
                <em>Semua Dokumen</em> (tabel berisi Nama, Ukuran, Tanggal). Folder yang sama tidak perlu diimpor ulang
                dua kali.
              </>
            }
          />
          <Step
            n="4"
            t="Lihat isi dokumen (opsional)"
            d={
              <>
                Klik nama atau kartu dokumen untuk membuka isi lengkapnya di jendela baru. Ini membantu Anda memastikan
                dokumen terbaca benar.
              </>
            }
          />
          <div className="rounded-xl border border-[#cdc3d0]/40 dark:border-gray-800 bg-white dark:bg-[#1e1e24] p-4 md:p-5">
            <h5 className="font-headline font-bold text-[13px] text-[#191c1d] dark:text-gray-100 mb-3">
              Format dokumen yang didukung
            </h5>
            <div className="flex flex-wrap gap-2">
              {[
                { t: 'PDF', i: 'picture_as_pdf', c: 'text-red-500' },
                { t: 'Teks (TXT)', i: 'description', c: 'text-gray-600' },
                { t: 'Markdown (MD)', i: 'article', c: 'text-blue-500' },
                { t: 'Jupyter Notebook (IPYNB)', i: 'code', c: 'text-orange-500' },
              ].map((f) => (
                <span
                  key={f.t}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f3f4f5] dark:bg-[#2e3132] border border-[#cdc3d0]/40 dark:border-gray-700 font-body text-[12px] font-medium text-[#191c1d] dark:text-gray-200"
                >
                  <span className={`material-symbols-outlined text-[16px] ${f.c}`}>{f.i}</span>
                  {f.t}
                </span>
              ))}
            </div>
          </div>
          <Note type="info" title="Menghapus dokumen">
            Pada tabel <em>Semua Dokumen</em>, arahkan kursor ke baris dokumen lalu klik ikon tempat sampah untuk
            menghapusnya. Dokumen yang dihapus tidak lagi dipakai sebagai sumber jawaban.
          </Note>
        </div>
      </Section>

      {/* ================= BAGIAN 4: BERTANYA PADA ASISTEN ================= */}
      <Section
        id="bagian-4"
        number="4"
        title="Bertanya pada Asisten"
        desc="Inti penggunaan aplikasi: tanya, dan dapatkan jawaban berdasarkan dokumen Anda."
      >
        <div className="space-y-3">
          <Step
            n="1"
            t="Mulai obrolan baru"
            d={
              <>
                Klik <span className="font-semibold">Obrolan Baru</span> di bagian atas menu samping. Halaman obrolan
                terbuka dengan sapaan <em>"Halo! Apa yang bisa saya bantu hari ini?"</em>
              </>
            }
          />
          <Step
            n="2"
            t="Pilih fokus dokumen (opsional)"
            d={
              <>
                Di kotak ketik, klik ikon penjepit kertas (
                <span className="material-symbols-outlined text-[14px] align-middle">attach_file</span>) lalu pilih{' '}
                <em>Semua Dokumen</em> atau salah satu dokumen tertentu. Pilihan ini membuat asisten menjawab hanya dari
                dokumen yang dipilih. Badge <em>Fokus: nama dokumen</em> muncul di atas kotak ketik; klik{' '}
                <span className="font-bold">×</span> untuk kembali ke semua dokumen.
              </>
            }
          />
          <Step
            n="3"
            t="Ketik dan kirim pertanyaan"
            d={
              <>
                Ketik pertanyaan Anda, lalu tekan <span className="font-semibold">Enter</span> (atau klik tombol kirim).
                Untuk baris baru, gunakan <span className="font-semibold">Shift + Enter</span>. Selama menunggu, tampil
                indikator <em>"Sedang membaca dokumen & menyusun jawaban..."</em> — jangan tutup halaman.
              </>
            }
          />
          <Step
            n="4"
            t="Baca jawaban beserta sumbernya"
            d={
              <>
                Jawaban asisten tampil dalam kotak. Jika memakai dokumen, di bawahnya tertulis{' '}
                <em>"Dikutip dari N dokumen"</em> dengan tombol sumber berisi nama dokumen, nomor bagian, dan tingkat
                kecocokan (persen). Klik tombol tersebut untuk melihat potongan dokumen yang dijadikan dasar jawaban.
              </>
            }
          />
          <Step
            n="5"
            t="Lanjutkan obrolan kapan saja"
            d={
              <>
                Semua obrolan tersimpan di menu samping. Klik nama obrolan untuk melanjutkan, atau gunakan{' '}
                <span className="material-symbols-outlined text-[14px] align-middle">push_pin</span> untuk menyematkan
                obrolan penting agar mudah ditemukan. Obrolan juga bisa diubah namanya lewat menu titik tiga.
              </>
            }
          />
          <Note type="warn" title="Jawaban tidak sesuai?">
            Pastikan dokumen yang relevan sudah diimpor, lalu ulangi pertanyaan dengan lebih spesifik. Jika ingin
            jawaban dari satu dokumen saja, gunakan fitur <em>Fokus</em> pada langkah 2.
          </Note>
        </div>
      </Section>

      {/* ================= BAGIAN 5: TEMPLATE ================= */}
      <Section
        id="bagian-5"
        number="5"
        title="Template"
        desc="Simpan pertanyaan yang sering dipakai agar bisa diulang dengan sekali klik."
      >
        <div className="space-y-3">
          <Step
            n="1"
            t="Simpan pertanyaan sebagai template"
            d={
              <>
                Di halaman obrolan, arahkan ke pertanyaan Anda lalu klik ikon penanda buku (
                <span className="material-symbols-outlined text-[14px] align-middle">bookmark_add</span>) di sampingnya.
                Isi judul dan keterangan pada jendela yang muncul, lalu simpan.
              </>
            }
          />
          <Step
            n="2"
            t="Gunakan template"
            d={
              <>
                Buka menu <span className="font-semibold">Template Tersimpan</span>. Klik{' '}
                <span className="font-semibold">Gunakan Template Ini</span> — pertanyaan langsung dipakai kembali di
                obrolan.
              </>
            }
          />
          <Step
            n="3"
            t="Hapus template (opsional)"
            d={<>Klik ikon tempat sampah pada kartu template yang tidak lagi dibutuhkan.</>}
          />
          <Note type="info" title="Kegunaan template">
            Cocok untuk pertanyaan rutin seperti merangkum dokumen, membuat ringkasan bab, atau pola pertanyaan lain
            yang Anda ulang-ulang.
          </Note>
        </div>
      </Section>

      {/* ================= BAGIAN 6: GOOGLE DRIVE ================= */}
      <Section
        id="bagian-6"
        number="6"
        title="Google Drive (Opsional)"
        desc="Fitur tambahan untuk mengambil dokumen dari Google Drive."
      >
        <div className="space-y-3">
          <p className="font-body text-[14px] text-[#4a454f] dark:text-gray-300 leading-relaxed">
            Fitur ini <span className="font-semibold">tidak wajib</span> — aplikasi tetap berfungsi penuh tanpa
            menyambungkan Drive.
          </p>
          <Step
            n="1"
            t="Buka kartu Google Drive di Pengaturan"
            d={
              <>
                Di halaman <span className="font-semibold">Pengaturan</span>, klik kartu{' '}
                <span className="font-semibold">Google Drive</span> untuk membukanya.
              </>
            }
          />
          <Step
            n="2"
            t="Set status koneksi"
            d={
              <>
                Klik tombol status untuk mengubahnya menjadi <span className="font-semibold">Terhubung</span>.
              </>
            }
          />
          <Step
            n="3"
            t="Atur folder default (opsional)"
            d={
              <>
                Kolom <em>Folder Drive Default</em> diisi alamat folder di Drive tempat dokumen Anda berada, misalnya{' '}
                <Code>G:\My Drive\Colab Notebooks</Code>. Sesuaikan dengan komputer Anda.
              </>
            }
          />
        </div>
      </Section>

      {/* ================= BAGIAN 7: TIPS & PEMECAHAN MASALAH ================= */}
      <Section
        id="bagian-7"
        number="7"
        title="Tips & Pemecahan Masalah"
        desc="Kendala yang paling sering terjadi dan cara mengatasinya."
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Note type="warn" title="Muat Model selalu gagal">
              Periksa tiga hal: alamat URL server AI (harus bisa dibuka di peramban), API Key (benar dan masih aktif),
              dan server AI (sedang menyala). Baca pesan error yang muncul di bawah kolom API Key. Lihat kembali
              Bagian 2 untuk urutan lengkapnya.
            </Note>
            <Note type="warn" title="Impor dokumen tidak menghasilkan apa-apa">
              Pastikan folder yang dipilih berisi file dengan format didukung (PDF, TXT, MD, IPYNB) dan alamat folder
              benar. Dokumen yang tidak didukung akan dilewati.
            </Note>
            <Note type="warn" title="Jawaban asisten tidak berkaitan dengan dokumen">
              Kemungkinan besar pertanyaan dijawab tanpa konteks dokumen yang relevan. Impor dokumen yang tepat (Bagian
              3), atau gunakan fitur <em>Fokus</em> untuk membatasi jawaban pada satu dokumen.
            </Note>
            <Note type="warn" title="API Key hilang atau lupa">
              Kunci tidak pernah ditampilkan penuh (kolom bertipe sandi). Ambil ulang dari panel penyedia model AI Anda,
              lalu simpan pengaturan lagi.
            </Note>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/30 border border-sky-200/70 dark:border-sky-800/40 p-5 md:p-6">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[24px] text-sky-600 dark:text-sky-400 shrink-0">
                verified
              </span>
              <div>
                <h4 className="font-headline font-bold text-[15px] text-sky-700 dark:text-sky-300 mb-2">
                  Checklist: Anda berhasil memakai Asisten Pintar bila...
                </h4>
                <ul className="space-y-2">
                  {[
                    'Koneksi Server AI tersimpan: model berhasil dimuat dari tombol Muat Model.',
                    'Minimal satu folder berhasil diimpor dan dokumennya tampil di Dokumen Saya.',
                    'Anda mengirim pertanyaan di Obrolan Baru dan menerima jawaban beserta sumber dokumen.',
                    'Jawaban yang Anda tanyakan sesuai dengan isi dokumen Anda.',
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 font-body text-[13px] text-[#4a454f] dark:text-gray-300 leading-relaxed"
                    >
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Note type="info" title="Terakhir">
            Asisten bisa membuat kesalahan. Harap cek kembali informasi penting sebelum menggunakannya — terutama untuk
            keputusan akademik atau pekerjaan.
          </Note>
        </div>
      </Section>

      {/* Footer */}
      <div className="mt-14 pt-6 border-t border-[#cdc3d0]/40 dark:border-gray-800 text-center">
        <p className="font-body text-[12px] text-[#4a454f] dark:text-gray-400">
          Asisten Pintar · Dokumentasi resmi aplikasi · Jika ada kendala yang belum tercantum, periksa kembali urutan
          langkah pada Bagian 2 dan 3.
        </p>
      </div>
    </div>
  );
};
