# 🔒 Web Security Tools

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-success.svg)

Koleksi alat bantu (*web tools*) untuk analisis keamanan web, konversi data, dan enkripsi ringan, berbasis **100% client-side JavaScript**. Semua operasi dilakukan di browser Anda, data **TIDAK dikirim ke server manapun**.

🌐 **[Live Demo](#)** | 📖 **[Dokumentasi Lengkap](INSTRUCTION.md)** | 🐛 **[Report Issues](#)**

---

## ✨ Fitur Utama

### 🔤 Base64 Encoder/Decoder
- ✅ Encode teks ke Base64
- ✅ Decode Base64 ke teks asli
- ✅ Support Unicode (UTF-8)
- 📌 Kegunaan: Transfer data biner, Basic Auth, encoding data

### 🔗 URL Encoder/Decoder  
- ✅ URL Component Encoding (recommended)
- ✅ Full URL Encoding
- ✅ Percent encoding support
- 📌 Kegunaan: Sanitasi parameter URL, query string encoding

### 🔐 Hash Generator
- ✅ SHA-256 (Recommended)
- ✅ SHA-512 (Extra Secure)
- ✅ SHA-1 (Legacy Support)
- 📌 Kegunaan: Verifikasi integritas file, checksum, digital signature

### 🔄 Text Converter
- ✅ Text ↔ Hexadecimal
- ✅ Text ↔ Binary
- ✅ Hexadecimal ↔ Binary
- 📌 Kegunaan: Analisis data biner, debugging, low-level programming

### 🏷️ HTML Entities Encoder/Decoder
- ✅ Named entities support (&lt;, &gt;, &amp;, dll)
- ✅ Numeric entities support (&#65;, &#x41;)
- ✅ XSS prevention
- 📌 Kegunaan: Sanitasi HTML, mencegah XSS attacks, escape karakter khusus

### 🔍 JWT Inspector
- ✅ Decode JWT (JSON Web Token)
- ✅ Display Header, Payload, Signature
- ✅ Token expiration check
- ✅ Claims inspection
- ⚠️ **Note:** Hanya inspeksi, TIDAK verifikasi signature
- 📌 Kegunaan: Debug JWT, analisis token, cek expiration time

---

## 🚀 Quick Start

### Opsi 1: Langsung di Browser (No Setup Required)

```bash
# Clone repository
git clone https://github.com/yourusername/web-security-tools.git
cd web-security-tools

# Buka index.html di browser
# Double-click file atau drag & drop ke browser
```

### Opsi 2: Menggunakan Local Server

**Python:**
```bash
python -m http.server 8000
# Akses: http://localhost:8000
```

**Node.js:**
```bash
npx http-server -p 8000
# Akses: http://localhost:8000
```

**PHP:**
```bash
php -S localhost:8000
# Akses: http://localhost:8000
```

### Opsi 3: Deploy ke Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Fork repository ini
2. Login ke Netlify
3. Click "New site from Git"
4. Pilih repository → Deploy!

---

## 📁 Struktur Proyek

```
web-security-tools/
├── index.html              # Halaman utama
├── style.css               # Stylesheet dengan CSS variables
├── js/
│   ├── main.js            # Core app & dynamic module loading
│   ├── base64.js          # ✅ Base64 encoder/decoder
│   ├── url.js             # ✅ URL encoder/decoder
│   ├── hash.js            # ✅ Hash generator (SHA-256, SHA-512, SHA-1)
│   ├── converter.js       # ✅ Text/Hex/Binary converter
│   ├── htmlentities.js    # ✅ HTML entities encoder/decoder
│   └── jwt.js             # ✅ JWT inspector
├── README.md              # Project overview (file ini)
├── INSTRUCTION.md         # 📖 Panduan lengkap penggunaan
└── .github/
    └── prompts/           # AI development prompts
```

---

## 🛠️ Teknologi

- **HTML5** - Struktur semantic
- **CSS3** - Modern styling dengan CSS Variables
- **JavaScript ES6+**
  - ES Modules (dynamic import)
  - Async/Await
  - Web Crypto API
  - Clipboard API
  - Native Base64 (btoa/atob)
- **No External Dependencies** - Pure vanilla JavaScript!

---

## 🔒 Keamanan & Privasi

- ✅ **100% Client-Side** - Semua operasi di browser, tidak ada server processing
- ✅ **No Data Collection** - Data Anda tidak dikirim kemana-mana
- ✅ **No External Libraries** - Menghindari supply chain attacks
- ✅ **Native APIs Only** - Menggunakan Web Crypto API, Base64 native
- ✅ **Open Source** - Kode dapat diaudit oleh siapapun
- ✅ **No Eval** - Tidak menggunakan fungsi berbahaya seperti `eval()`

---

## 📖 Dokumentasi

Lihat [INSTRUCTION.md](INSTRUCTION.md) untuk:
- 📚 Panduan penggunaan lengkap setiap tool
- 💡 Contoh use case
- 🔧 Tips & best practices
- 🐛 Troubleshooting
- 🛠️ Development guide

---

## 🎯 Use Cases

### Untuk Developers:
- Debug JWT tokens dari API
- Encode/decode data untuk testing
- Generate hash untuk verifikasi file
- Konversi format data (hex, binary, base64)
- Sanitasi HTML untuk mencegah XSS

### Untuk Security Researchers:
- Analisis struktur JWT
- Testing URL encoding
- Hash comparison untuk integrity check
- XSS payload encoding (ethical testing)

### Untuk DevOps:
- Generate checksum untuk deployment verification
- Encode credentials untuk configuration
- Inspect authentication tokens

---

## 🚧 Roadmap & Future Features

### Planned (v2.0):
- [ ] HMAC Generator (HMAC-SHA256, HMAC-SHA1)
- [ ] File hash support (drag & drop)
- [ ] RSA Key Generator
- [ ] Certificate (X.509) Parser
- [ ] Security Headers Checker
- [ ] CSP (Content Security Policy) Analyzer
- [ ] Cookie Parser/Builder
- [ ] SRI (Subresource Integrity) Generator
- [ ] QR Code Generator/Reader
- [ ] Password Strength Meter

### Considering (v3.0):
- [ ] API Key Generator
- [ ] UUID/GUID Generator
- [ ] Timestamp Converter (Unix, ISO8601)
- [ ] JSON Formatter/Validator
- [ ] XML to JSON Converter
- [ ] Markdown Preview
- [ ] Diff Viewer
- [ ] Regex Tester

Punya ide fitur? [Buat issue](#) atau [pull request](#)!

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Cara berkontribusi:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Workflow:

```bash
# Clone & setup
git clone <your-fork-url>
cd web-security-tools

# Buat fitur baru di branch terpisah
git checkout -b feature/new-tool

# Development
# 1. Buat file js/newtool.js dengan export function render(container)
# 2. Tambahkan link di index.html
# 3. Test di browser

# Commit & push
git add .
git commit -m "Add new tool: [tool name]"
git push origin feature/new-tool

# Buat PR di GitHub
```

### Coding Guidelines:
- Gunakan **bahasa Indonesia** untuk komentar & dokumentasi
- Ikuti struktur modul yang ada (export render function)
- Gunakan ES6+ modern JavaScript
- Tidak ada external dependencies
- Semua operasi client-side only
- Tambahkan peringatan keamanan jika diperlukan

---

## 📝 License

MIT License - bebas digunakan untuk personal maupun komersial.

Copyright (c) 2025 Web Security Tools

---

## 🙏 Acknowledgments

- Web Crypto API Documentation
- MDN Web Docs
- OWASP Security Guidelines
- JWT.io untuk inspirasi JWT Inspector
- Community contributors

---

## 📞 Support

- 🐛 **Bug Reports:** [Create an Issue](#)
- 💡 **Feature Requests:** [Create an Issue](#)
- 💬 **Discussions:** [GitHub Discussions](#)
- 📧 **Email:** your-email@example.com

---

## ⭐ Show Your Support

Jika project ini membantu Anda, berikan ⭐ di GitHub!

---

**Dibuat dengan ❤️ untuk komunitas developer & security enthusiast**

🔒 **Stay Secure. Code Safe. Test Thoroughly.**
    * Input: regex + flags + sample text; Output: matches list, groups.

14. **Base Converters (int ↔ hex ↔ base36 ↔ base62)**

    * Fungsi: angka/ID conversion useful for token analysis.
    * Input: number/string; Output: converted variant.

---

# Prioritas — Opsional / Integrasi (nice-to-have)

15. **PEM / X.509 Certificate Viewer**

    * Fungsi: parse PEM certificate, tampil subject/issuer/validity/fingerprint.
    * Input: PEM text; Output: readable fields.
    * Implementasi: JS pem/x509 parser library (client-side).

16. **URL Parser & Normalizer**

    * Fungsi: parse URL components, show normalized URL, punycode support.
    * Input: URL; Output: host, path, query, origin, punycode.

17. **Diff / Compare Tool (text/hash)**

    * Fungsi: bandingkan dua teks atau dua hash list; highlight perubahan.

18. **Entropy Calculator / Password Strength**

    * Fungsi: hitung entropy, beri saran panjang/char set.

19. **Simple TLS/CORS Tester (requires proxy)**

    * Fungsi: tes endpoint untuk CORS headers dan TLS cert chain.
    * Catatan: butuh server-side proxy atau public API karena batasan CORS.

20. **SQLi / Payload Encoders (URL-encode, hex-encode, mysql-unhex)**

    * Fungsi: encode payload untuk testing injection patterns.
    * Catatan: dual-use — tampilkan disclaimer & gunakan untuk pengujian etis.

---

# UI / UX — Sidebar & Layout

* **Sidebar (grup)**:

  * Core: Encode/Decode, Hash, Convert, Base Converters
  * Crypto: HMAC, JWT, SRI
  * HTTP/Security: Headers, CSP Analyzer, Cookie Parser, CORS Tester
  * Testing: XSS Encoder, Payload Encoder, Regex Tester
  * Tools: PEM Viewer, Entropy, Diff

* **Komponen Utama (kanan)**:

  * Panel input (textarea, file upload, options)
  * Tombol aksi (Generate / Encode / Decode / Verify)
  * Output: text + copy button + download (untuk file)
  * Riwayat (optional): log terakhir untuk copy/paste cepat
  * Keterangan/Disclaimer di setiap tool (keamanan & batasan)

* **Fitur Tambahan UX**:

  * Mode gelap, shortcut keyboard, autosave lokal (localStorage untuk draft), export/import config JSON.

---

# Catatan Keamanan & Legal

* Semua operasi sensitif (mis. verifikasi JWT dengan secret) harus tampilkan peringatan: *“Jangan masukkan secret/credential di halaman publik.”*
* Untuk fetch endpoint (header cek/CORS/TLS) jelaskan keterbatasan CORS dan saran menggunakan server proxy atau layanan pihak ketiga.
* Sertakan teks lisensi & aturan penggunaan: hanya untuk pengujian etis/authorized testing.

---

Saya bisa lanjutkan menjadi:

* 1. **Tabel final fitur** dalam format CSV/Markdown, atau
* 2. **Template UI** (HTML/CSS/JS) untuk Netlify yang implementasi MVP (Base64, URL encode, Hash, Hex convert, JWT inspector).

Pilih opsi (1 atau 2) — saya langsung buatkan.
