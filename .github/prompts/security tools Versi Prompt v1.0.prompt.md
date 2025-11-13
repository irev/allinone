---
agent: agent
---
# 🧠 Project Prompt: Web Security Tools

## 🎯 Tujuan Proyek
Membangun koleksi alat bantu (*web tools*) untuk analisis keamanan web, konversi data, dan enkripsi ringan, berbasis **client-side JavaScript**.  
Fokus: kecepatan, keamanan, dan modularitas.

---

## ⚙️ Lingkungan Pengembangan
- **Editor**: Visual Studio Code  
- **Source Control**: Git & GitHub  
- **Hosting**: Netlify (tanpa backend server)  
- **Bahasa utama**: HTML, CSS, JavaScript (ES Modules)

---

## 🧩 Struktur Fitur
Setiap fitur adalah **modul JS** di dalam folder `/js/`, yang di-load secara dinamis oleh `js/main.js`.

| Fitur | Nama Modul | Status |
|-------|-------------|--------|
| Base64 Encode / Decode | `base64.js` | ✅ |
| URL Encode / Decode | `url.js` | 🔜 |
| Hash Generator (MD5, SHA256, SHA512) | `hash.js` | ⏳ |
| Text ↔ Hex / Binary Convert | `converter.js` | ⏳ |
| HTML Entities Encode / Decode | `htmlentities.js` | ⏳ |
| JWT Inspector | `jwt.js` | ⏳ |

---

## 🧱 Struktur Folder
web-security-tools/
├── index.html
├── style.css
├── js/
│ ├── main.js
│ ├── base64.js
│ ├── url.js
│ ├── hash.js
│ ├── converter.js
│ ├── htmlentities.js
│ └── jwt.js
├── README.md
├── INSTRUCTION.md
└── .github/
    └── prompt
---

## 🧠 Panduan untuk Asisten AI (Copilot / GPT / LLM)
- Gunakan **bahasa Indonesia** untuk semua instruksi & komentar.  
- Semua kode harus **clean, modular, tanpa dependensi eksternal**.  
- Gunakan **async import()** untuk load modul tool.  
- Hindari penggunaan `eval()` atau API berisiko.  
- Setiap fitur wajib memiliki fungsi `render(container)` sebagai entry point.  
- Gunakan `innerHTML` untuk render sederhana, bukan framework.

---

## 🚀 Alur Workflow Git
1. Setiap fitur baru dikerjakan di branch terpisah:
   ```bash
   git checkout -b feature/<nama-fitur>
   git add .
   git commit -m "Add <nama-fitur> tool"
   git push -u origin feature/<nama-fitur>
   ```

2. Merge ke main setelah review manual.
    ```bash
    git checkout main
    git merge feature/<nama-fitur>
    git push origin main
    ```


# 🔒 Prinsip Keamanan
- Semua operasi dilakukan client-side.
- Jangan kirim data ke server.
- Gunakan fungsi native JavaScript untuk hash/encode sederhana.
- Tambahkan peringatan jika ada operasi berisiko.

# 💬 Contoh Interaksi Ideal

User:

Lanjut ke fitur Hash Generator.
AI Assistant:
Buat branch feature/hash. Tambahkan file js/hash.js dengan fungsi render(container). Implementasikan pilihan algoritma MD5, SHA-256, SHA-512 menggunakan crypto.subtle.digest().


# ✅ Tujuan Akhir

Repositori ini menjadi satu portal praktis untuk:

- Encode/Decode umum
- Konversi data dasar
- Pemeriksaan JWT
  - Input: JWT
  - Output: Payload
- Hash generator

- Pilihan algoritma: MD5, SHA-256, SHA-512
  - Input: Teks
  - Output: Hash
- Analisis cepat keamanan sisi-klien


# Design Input Form on tool Container
- jika length input/output panjang jadikan input satu colom ex: col-12
- jika length input/output pendek bisa dua kolom ex: col-6 sesuaikan dengan kebutuhan minimal col-3