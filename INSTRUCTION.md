# 📖 INSTRUCTION.md - Panduan Penggunaan Web Security Tools

## 🎯 Deskripsi Proyek

**Web Security Tools** adalah koleksi alat bantu berbasis web untuk analisis keamanan, konversi data, dan enkripsi ringan. Semua operasi dilakukan 100% di browser (client-side), sehingga data Anda **TIDAK dikirim ke server manapun**.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Langsung di Browser (Recommended)

1. Clone repository ini:
   ```bash
   git clone <repository-url>
   cd web-security-tools
   ```

2. Buka file `index.html` langsung di browser:
   - **Cara 1:** Double-click file `index.html`
   - **Cara 2:** Drag & drop file `index.html` ke browser
   - **Cara 3:** Klik kanan → Open With → Browser pilihan Anda

### Opsi 2: Menggunakan Local Server

Jika Anda ingin menjalankan dengan local server (untuk development):

**Menggunakan Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Menggunakan Node.js (http-server):**
```bash
# Install http-server (sekali saja)
npm install -g http-server

# Jalankan server
http-server -p 8000
```

**Menggunakan PHP:**
```bash
php -S localhost:8000
```

Kemudian buka browser dan akses: `http://localhost:8000`

### Opsi 3: Deploy ke Netlify (Production)

1. Push repository ke GitHub
2. Login ke [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Pilih repository Anda
5. Deploy settings:
   - Build command: (kosongkan)
   - Publish directory: `/` atau `.`
6. Click "Deploy site"

Netlify akan memberikan URL public yang bisa diakses oleh siapapun!

---

## 🧩 Fitur-Fitur yang Tersedia

### 1. 🔤 Base64 Encoder/Decoder
**Fungsi:**
- Encode teks ke format Base64
- Decode Base64 kembali ke teks asli

**Kegunaan:**
- Transfer data biner melalui media text-only
- Encode credentials untuk Basic Authentication
- Encode data untuk URL atau JSON

**Cara Pakai:**
1. Pilih tab "Base64"
2. Untuk encode: masukkan teks di bagian atas → klik "Encode ke Base64"
3. Untuk decode: masukkan Base64 di bagian bawah → klik "Decode dari Base64"
4. Klik "Salin Hasil" untuk copy ke clipboard

---

### 2. 🔗 URL Encoder/Decoder
**Fungsi:**
- URL Encode (percent encoding)
- URL Decode
- Support untuk Component encoding dan Full URL encoding

**Kegunaan:**
- Encode parameter URL dengan karakter khusus
- Decode URL yang sudah di-encode
- Sanitasi input untuk query string

**Cara Pakai:**
1. Pilih tab "URL Encode"
2. Pilih tipe encoding:
   - **URL Component:** Untuk encode bagian URL (parameter, search query) - RECOMMENDED
   - **Full URL:** Untuk encode seluruh URL
3. Masukkan teks → klik "Encode URL" atau "Decode URL"

**Contoh:**
```
Input: hello world & special=chars
Component Output: hello%20world%20%26%20special%3Dchars
```

---

### 3. 🔐 Hash Generator
**Fungsi:**
- Generate hash SHA-256 (Recommended)
- Generate hash SHA-512 (Lebih aman)
- Generate hash SHA-1 (Legacy - tidak aman)

**Kegunaan:**
- Verifikasi integritas file
- Generate checksum
- Password hashing (dengan salt di production!)
- Digital signature

**Cara Pakai:**
1. Pilih tab "Hash Generator"
2. Masukkan teks yang akan di-hash
3. Pilih algoritma (SHA-256 recommended)
4. Klik "Generate Hash"
5. Salin hasil dalam format lowercase atau UPPERCASE

**⚠️ Perhatian:**
- SHA-1 sudah tidak aman, gunakan hanya untuk kompatibilitas
- Untuk password, selalu gunakan salt dan library khusus (bcrypt, argon2)
- MD5 tidak tersedia karena sangat tidak aman

---

### 4. 🔄 Text Converter
**Fungsi:**
- Text ↔ Hexadecimal
- Text ↔ Binary
- Hexadecimal ↔ Binary

**Kegunaan:**
- Analisis data biner
- Debugging low-level code
- Konversi encoding
- Pemrograman embedded systems

**Cara Pakai:**
1. Pilih tab "Text Converter"
2. Pilih jenis konversi dari dropdown
3. Masukkan input
4. Klik "Konversi"
5. Gunakan "Tukar Input/Output" untuk reverse conversion

**Contoh:**
```
Text: Hello
Hex: 48656c6c6f
Binary: 01001000 01100101 01101100 01101100 01101111
```

---

### 5. 🏷️ HTML Entities Encoder/Decoder
**Fungsi:**
- Encode karakter HTML ke entities
- Decode HTML entities ke karakter
- Support named entities dan numeric entities

**Kegunaan:**
- Mencegah XSS (Cross-Site Scripting)
- Sanitasi user input
- Menampilkan kode HTML sebagai teks
- Escape karakter khusus HTML

**Cara Pakai:**
1. Pilih tab "HTML Entities"
2. Untuk encode:
   - Pilih tipe: Basic (recommended), All Characters, atau Numeric
   - Masukkan HTML/text → klik "Encode"
3. Untuk decode: Masukkan HTML entities → klik "Decode"

**Contoh:**
```
Input: <script>alert("XSS")</script>
Output: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;
```

**⚠️ Keamanan:**
- Selalu encode user input sebelum menampilkan di HTML
- Jangan langsung menampilkan hasil decode tanpa validasi!

---

### 6. 🔍 JWT Inspector
**Fungsi:**
- Decode JWT (JSON Web Token)
- Inspeksi Header, Payload, dan Signature
- Tampilkan informasi token (expiration, issuer, dll)

**Kegunaan:**
- Debug JWT token
- Analisis claims dalam token
- Cek expiration time
- Memahami struktur JWT

**Cara Pakai:**
1. Pilih tab "JWT Inspector"
2. Paste JWT token (format: xxxxx.yyyyy.zzzzz)
3. Klik "Decode JWT"
4. Lihat hasil:
   - **Header:** Algoritma dan tipe token
   - **Payload:** Data/claims dalam token
   - **Signature:** Signature (tidak diverifikasi)
5. Klik "Load Sample JWT" untuk lihat contoh

**⚠️ PERINGATAN:**
- Tool ini **TIDAK memverifikasi signature**
- **JANGAN** gunakan untuk validasi token di production
- Verifikasi JWT harus dilakukan di server dengan secret key
- Jangan masukkan JWT dengan data sensitif

**Contoh JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## 🔒 Prinsip Keamanan

1. **100% Client-Side:** Semua operasi dilakukan di browser Anda, tidak ada data yang dikirim ke server
2. **No External Dependencies:** Tidak menggunakan library eksternal untuk menghindari supply chain attack
3. **Native JavaScript:** Menggunakan Web API native (Web Crypto API, Base64, dll)
4. **No Eval:** Tidak menggunakan `eval()` atau fungsi berbahaya lainnya
5. **Open Source:** Kode sumber terbuka untuk audit keamanan

---

## 📁 Struktur Folder

```
web-security-tools/
├── index.html              # Halaman utama
├── style.css               # Stylesheet
├── js/
│   ├── main.js            # Core application & routing
│   ├── base64.js          # Base64 encoder/decoder
│   ├── url.js             # URL encoder/decoder
│   ├── hash.js            # Hash generator (SHA-256, SHA-512, SHA-1)
│   ├── converter.js       # Text/Hex/Binary converter
│   ├── htmlentities.js    # HTML entities encoder/decoder
│   └── jwt.js             # JWT inspector
├── README.md              # Dokumentasi proyek
├── INSTRUCTION.md         # Panduan penggunaan (file ini)
└── .github/
    └── prompts/           # AI prompts untuk development
```

---

## 🛠️ Teknologi yang Digunakan

- **HTML5:** Struktur halaman
- **CSS3:** Styling dengan CSS Variables
- **JavaScript ES6+:** Logika aplikasi
  - ES Modules untuk modular code
  - Async/Await untuk dynamic imports
  - Web Crypto API untuk hashing
  - Native Base64 API (btoa/atob)
  - Clipboard API untuk copy

---

## 💡 Tips & Best Practices

### Untuk Developer:

1. **Tambah Tool Baru:**
   - Buat file baru di folder `js/` (misal: `newtool.js`)
   - Implementasikan fungsi `export async function render(container)`
   - Tambahkan link di navigasi (`index.html`)

2. **Debugging:**
   - Buka Developer Console (F12)
   - Lihat tab Console untuk error messages
   - Gunakan Network tab untuk cek resource loading

3. **Modifikasi Style:**
   - Edit CSS variables di `:root` untuk ganti theme
   - Semua warna dan spacing menggunakan CSS variables

### Untuk User:

1. **Keamanan Data:**
   - Tool ini aman untuk data sensitif karena client-side only
   - Namun tetap hati-hati jika menggunakan di komputer publik
   - Clear browser cache setelah menggunakan data sensitif

2. **Browser Compatibility:**
   - Gunakan browser modern (Chrome, Firefox, Edge, Safari)
   - Beberapa fitur memerlukan JavaScript ES6+ support
   - Web Crypto API tidak bekerja di HTTP (gunakan HTTPS atau localhost)

3. **Performance:**
   - Untuk data besar, proses mungkin memakan waktu
   - Browser mungkin freeze saat hash data sangat besar

---

## 🐛 Troubleshooting

### Tool tidak muncul / Error loading
**Solusi:**
- Pastikan JavaScript diaktifkan di browser
- Cek Console untuk error messages
- Pastikan semua file JS ada di folder `/js/`
- Jika pakai file://, beberapa browser block ES Modules, gunakan local server

### Hash Generator tidak bekerja
**Solusi:**
- Web Crypto API hanya bekerja di HTTPS atau localhost
- Jika akses via `file://`, gunakan local server
- Update browser ke versi terbaru

### Copy to Clipboard gagal
**Solusi:**
- Clipboard API memerlukan HTTPS atau localhost
- Atau copy manual dari output box

### JWT Decode error
**Solusi:**
- Pastikan JWT format valid (3 bagian dipisah titik)
- Hapus whitespace/newline di awal/akhir token
- Cek apakah token sudah Base64URL encoded

---

## 📞 Support & Kontribusi

- **Report Bug:** Buat issue di GitHub repository
- **Feature Request:** Buat issue dengan label "enhancement"
- **Pull Request:** Kontribusi welcome!
- **Diskusi:** Gunakan GitHub Discussions

---

## 📄 License

Open Source - bebas digunakan untuk personal maupun komersial.

---

## 🙏 Credits

Dibuat dengan ❤️ menggunakan:
- Vanilla JavaScript (No Framework)
- Web Crypto API
- Modern CSS

**Terima kasih telah menggunakan Web Security Tools!** 🎉
