/**
 * Hash Generator Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - Generate SHA-256 hash
 * - Generate SHA-512 hash
 * - Generate SHA-1 hash
 * 
 * Menggunakan Web Crypto API (crypto.subtle.digest)
 * Catatan: MD5 tidak tersedia di Web Crypto API karena tidak aman
 */

/**
 * Fungsi utama untuk render UI Hash Generator
 * @param {HTMLElement} container - Container element untuk render
 */
export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🔐 Hash Generator</h2>
            <p class="tool-description">
                Generate hash cryptographic dari teks menggunakan algoritma SHA-1, SHA-256, atau SHA-512.
                Hash adalah fungsi satu arah yang mengubah input menjadi string dengan panjang tetap.
            </p>
        </div>

        <div class="alert alert-warning">
            ⚠️ <strong>Peringatan Keamanan:</strong><br>
            • SHA-1 sudah tidak aman untuk keamanan, gunakan hanya untuk kompatibilitas<br>
            • Gunakan SHA-256 atau SHA-512 untuk keamanan yang lebih baik<br>
            • MD5 tidak tersedia karena algoritma ini sudah sangat tidak aman
        </div>

        <!-- Input Section -->
        <div class="tool-section">
            <h3 class="section-title">📝 Input</h3>
            
            <div class="form-group">
                <label class="form-label" for="hashInput">Teks untuk di-hash:</label>
                <textarea 
                    id="hashInput" 
                    class="form-textarea" 
                    placeholder="Masukkan teks yang akan di-hash..."
                    rows="5"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Pilih Algoritma Hash:</label>
                <select id="hashAlgorithm" class="form-select">
                    <option value="SHA-256" selected>SHA-256 (Recommended)</option>
                    <option value="SHA-512">SHA-512 (Lebih Aman)</option>
                    <option value="SHA-1">SHA-1 (Legacy - Tidak Aman)</option>
                </select>
            </div>

            <div class="btn-group">
                <button id="btnGenerate" class="btn btn-primary">
                    🔐 Generate Hash
                </button>
                <button id="btnClear" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>
        </div>

        <!-- Output Section -->
        <div class="tool-section">
            <h3 class="section-title">📤 Hasil Hash</h3>
            
            <div id="hashResults" class="hidden">
                <div class="form-group">
                    <label class="form-label">
                        <strong id="resultAlgorithmLabel">SHA-256</strong> Hash:
                    </label>
                    <div id="hashOutput" class="output-box"></div>
                </div>

                <div class="btn-group">
                    <button id="btnCopyHash" class="btn btn-outline">
                        📋 Salin Hash
                    </button>
                    <button id="btnCopyUppercase" class="btn btn-outline">
                        📋 Salin (UPPERCASE)
                    </button>
                </div>

                <div class="form-group mt-2">
                    <label class="form-label">Informasi Hash:</label>
                    <div class="alert alert-info">
                        <div id="hashInfo"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Info Section -->
        <div class="tool-section">
            <h3 class="section-title">💡 Informasi Hash</h3>
            <div class="alert alert-info">
                <strong>Perbedaan Algoritma:</strong><br><br>
                <strong>SHA-1:</strong><br>
                • Panjang: 160 bit (40 karakter hex)<br>
                • Status: Tidak aman, rentan terhadap collision attack<br>
                • Gunakan: Hanya untuk kompatibilitas legacy<br><br>
                
                <strong>SHA-256:</strong><br>
                • Panjang: 256 bit (64 karakter hex)<br>
                • Status: Aman untuk sebagian besar penggunaan<br>
                • Gunakan: Untuk verifikasi file, password hashing (dengan salt), digital signature<br><br>
                
                <strong>SHA-512:</strong><br>
                • Panjang: 512 bit (128 karakter hex)<br>
                • Status: Sangat aman<br>
                • Gunakan: Untuk keamanan tingkat tinggi, aplikasi kritikal
            </div>
        </div>
    `;

    initializeEventListeners(container);
}

/**
 * Inisialisasi event listeners
 * @param {HTMLElement} container - Container element
 */
function initializeEventListeners(container) {
    // Elements
    const hashInput = container.querySelector('#hashInput');
    const hashAlgorithm = container.querySelector('#hashAlgorithm');
    const hashOutput = container.querySelector('#hashOutput');
    const hashResults = container.querySelector('#hashResults');
    const resultAlgorithmLabel = container.querySelector('#resultAlgorithmLabel');
    const hashInfo = container.querySelector('#hashInfo');

    // Buttons
    const btnGenerate = container.querySelector('#btnGenerate');
    const btnClear = container.querySelector('#btnClear');
    const btnCopyHash = container.querySelector('#btnCopyHash');
    const btnCopyUppercase = container.querySelector('#btnCopyUppercase');

    // Event: Generate Hash
    btnGenerate.addEventListener('click', async () => {
        const text = hashInput.value;
        
        if (!text.trim()) {
            hashOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan teks terlebih dahulu</span>';
            hashResults.classList.add('hidden');
            return;
        }

        try {
            const algorithm = hashAlgorithm.value;
            btnGenerate.disabled = true;
            btnGenerate.innerHTML = '⏳ Generating...';
            
            const hash = await generateHash(text, algorithm);
            
            // Update UI
            hashOutput.textContent = hash;
            resultAlgorithmLabel.textContent = algorithm;
            hashResults.classList.remove('hidden');
            
            // Update info
            updateHashInfo(hashInfo, algorithm, hash, text);
            
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = '🔐 Generate Hash';
        } catch (error) {
            hashOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = '🔐 Generate Hash';
        }
    });

    // Event: Clear
    btnClear.addEventListener('click', () => {
        hashInput.value = '';
        hashOutput.textContent = '';
        hashResults.classList.add('hidden');
    });

    // Event: Copy Hash (lowercase)
    btnCopyHash.addEventListener('click', async () => {
        const hash = hashOutput.textContent;
        if (hash && hash.trim()) {
            try {
                await navigator.clipboard.writeText(hash.toLowerCase());
                showTempMessage(btnCopyHash, '✅ Hash tersalin!');
            } catch (error) {
                showTempMessage(btnCopyHash, '❌ Gagal menyalin');
            }
        }
    });

    // Event: Copy Hash (uppercase)
    btnCopyUppercase.addEventListener('click', async () => {
        const hash = hashOutput.textContent;
        if (hash && hash.trim()) {
            try {
                await navigator.clipboard.writeText(hash.toUpperCase());
                showTempMessage(btnCopyUppercase, '✅ Hash tersalin!');
            } catch (error) {
                showTempMessage(btnCopyUppercase, '❌ Gagal menyalin');
            }
        }
    });

    // Auto-update algorithm label when selection changes
    hashAlgorithm.addEventListener('change', () => {
        hashResults.classList.add('hidden');
    });
}

/**
 * Generate hash menggunakan Web Crypto API
 * @param {string} text - Teks yang akan di-hash
 * @param {string} algorithm - Algoritma hash (SHA-1, SHA-256, SHA-512)
 * @returns {Promise<string>} - Hash dalam format hexadecimal
 */
async function generateHash(text, algorithm) {
    try {
        // Konversi text ke ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Generate hash menggunakan Web Crypto API
        const hashBuffer = await crypto.subtle.digest(algorithm, data);
        
        // Konversi ArrayBuffer ke hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error) {
        throw new Error(`Gagal generate hash: ${error.message}`);
    }
}

/**
 * Update informasi hash
 * @param {HTMLElement} element - Element untuk menampilkan info
 * @param {string} algorithm - Algoritma yang digunakan
 * @param {string} hash - Hash yang dihasilkan
 * @param {string} originalText - Teks asli
 */
function updateHashInfo(element, algorithm, hash, originalText) {
    const bitLength = {
        'SHA-1': 160,
        'SHA-256': 256,
        'SHA-512': 512
    }[algorithm];
    
    element.innerHTML = `
        <strong>Algoritma:</strong> ${algorithm}<br>
        <strong>Panjang Hash:</strong> ${bitLength} bit (${hash.length} karakter hex)<br>
        <strong>Panjang Input:</strong> ${originalText.length} karakter<br>
        <strong>Format:</strong> Hexadecimal (lowercase)
    `;
}

/**
 * Tampilkan pesan sementara pada button
 * @param {HTMLElement} button - Button element
 * @param {string} message - Pesan yang akan ditampilkan
 */
function showTempMessage(button, message) {
    const originalText = button.innerHTML;
    button.innerHTML = message;
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}
