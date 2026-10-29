# SakuQ — Website pengelola uang saku

Prototipe SakuQ membantu pelajar mencatat pemasukan/pengeluaran, membuat anggaran, dan memantau target tabungan.

## File
- `index.html` — struktur halaman dan dialog formulir.
- `style.css` — layout, tema visual, responsivitas, dan komponen antarmuka.
- `script.js` — perhitungan, validasi, navigasi, dan penyimpanan `localStorage`.
- `PRD.md` — dokumen kebutuhan produk, rumus, model data, serta kriteria keberhasilan.

## Menjalankan di komputer
1. Unduh atau ekstrak semua file ke satu folder.
2. Buka `index.html` dengan browser modern, atau gunakan ekstensi Live Server di editor kode.
3. Coba tambah pemasukan, pengeluaran, anggaran, dan target tabungan.
4. Data tersimpan di `localStorage` browser yang sedang digunakan.

Tombol **Coba data contoh** di dashboard mengisi data ilustrasi agar fitur dapat dicoba. Gunakan **Reset semua data** di sidebar untuk menghapus semua catatan lokal setelah konfirmasi.

## Rumus saldo
`Sisa uang tersedia = total pemasukan − total pengeluaran − total setoran tabungan`.

Setoran tabungan bukan pengeluaran konsumsi, tetapi mengurangi uang tersedia karena dicatat sebagai uang yang telah dialokasikan untuk tujuan tabungan.

## Menerbitkan melalui GitHub Pages
1. Buat repositori GitHub baru.
2. Unggah `index.html`, `style.css`, `script.js`, `README.md`, dan `PRD.md` ke root repositori.
3. Buka **Settings → Pages**.
4. Di bagian build/deployment, pilih sumber dari branch (misalnya `main`) dan folder root (`/`).
5. Simpan pengaturan dan tunggu proses publikasi selesai. Buka URL yang ditampilkan GitHub Pages.

## Batasan prototipe
- Tidak ada login atau database server.
- Data hanya tersimpan di browser/perangkat terkait; tidak tersinkron antarperangkat.
- Jangan memasukkan PIN, kata sandi, nomor rekening, atau informasi finansial sensitif.
- SakuQ bukan layanan bank dan tidak memproses uang sungguhan.
