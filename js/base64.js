/**
 * Base64 Encoder/Decoder Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - Encode teks ke Base64
 * - Decode Base64 ke teks
 * 
 * Semua operasi dilakukan client-side menggunakan native JavaScript API
 */

/**
 * Fungsi utama untuk render UI Base64 tool
 * @param {HTMLElement} container - Container element untuk render
 */
export function render(container) {
    // Buat HTML untuk tool
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🔤 Base64 Encoder / Decoder</h2>
            <p class="tool-description">
                Konversi teks ke Base64 atau sebaliknya. Base64 adalah encoding yang umum digunakan 
                untuk mentransfer data biner melalui media yang hanya mendukung teks.
            </p>
        </div>

        <div class="alert alert-info">
            ℹ️ <strong>Catatan:</strong> Semua proses dilakukan di browser Anda. Data tidak dikirim ke server.
        </div>

        <!-- Section Encode -->
        <div class="tool-section">
            <h3 class="section-title">📤 Encode (Teks → Base64)</h3>
            
            <div class="form-group">
                <label class="form-label" for="encodeInput">Input Teks:</label>
                <textarea 
                    id="encodeInput" 
                    class="form-textarea" 
                    placeholder="Masukkan teks yang akan di-encode ke Base64..."
                    rows="5"
                ></textarea>
            </div>

            <div class="btn-group">
                <button id="btnEncode" class="btn btn-primary">
                    🔒 Encode ke Base64
                </button>
                <button id="btnCopyEncoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearEncode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output Base64:</label>
                <div id="encodeOutput" class="output-box">
                    <!-- Hasil encode akan tampil di sini -->
                </div>
            </div>
        </div>

        <hr style="border: 1px solid #e5e7eb; margin: 2rem 0;">

        <!-- Section Decode -->
        <div class="tool-section">
            <h3 class="section-title">📥 Decode (Base64 → Teks)</h3>
            
            <div class="form-group">
                <label class="form-label" for="decodeInput">Input Base64:</label>
                <textarea 
                    id="decodeInput" 
                    class="form-textarea" 
                    placeholder="Masukkan string Base64 yang akan di-decode..."
                    rows="5"
                ></textarea>
            </div>

            <div class="btn-group">
                <button id="btnDecode" class="btn btn-secondary">
                    🔓 Decode dari Base64
                </button>
                <button id="btnCopyDecoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearDecode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output Teks:</label>
                <div id="decodeOutput" class="output-box">
                    <!-- Hasil decode akan tampil di sini -->
                </div>
            </div>
        </div>
    `;

    // Inisialisasi event listeners
    initializeEventListeners(container);
}

/**
 * Inisialisasi semua event listeners
 * @param {HTMLElement} container - Container element
 */
function initializeEventListeners(container) {
    // Elements
    const encodeInput = container.querySelector('#encodeInput');
    const encodeOutput = container.querySelector('#encodeOutput');
    const decodeInput = container.querySelector('#decodeInput');
    const decodeOutput = container.querySelector('#decodeOutput');

    // Buttons
    const btnEncode = container.querySelector('#btnEncode');
    const btnDecode = container.querySelector('#btnDecode');
    const btnCopyEncoded = container.querySelector('#btnCopyEncoded');
    const btnCopyDecoded = container.querySelector('#btnCopyDecoded');
    const btnClearEncode = container.querySelector('#btnClearEncode');
    const btnClearDecode = container.querySelector('#btnClearDecode');

    // Event: Encode
    btnEncode.addEventListener('click', () => {
        const text = encodeInput.value;
        
        if (!text.trim()) {
            encodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan teks terlebih dahulu</span>';
            return;
        }

        try {
            const encoded = encodeToBase64(text);
            encodeOutput.textContent = encoded;
        } catch (error) {
            encodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
        }
    });

    // Event: Decode
    btnDecode.addEventListener('click', () => {
        const base64 = decodeInput.value;
        
        if (!base64.trim()) {
            decodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan Base64 terlebih dahulu</span>';
            return;
        }

        try {
            const decoded = decodeFromBase64(base64);
            decodeOutput.textContent = decoded;
        } catch (error) {
            decodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: Input bukan Base64 yang valid. ${error.message}</span>`;
        }
    });

    // Event: Copy Encoded
    btnCopyEncoded.addEventListener('click', async () => {
        const text = encodeOutput.textContent;
        if (text && text.trim()) {
            try {
                await navigator.clipboard.writeText(text);
                showTempMessage(btnCopyEncoded, '✅ Tersalin!');
            } catch (error) {
                showTempMessage(btnCopyEncoded, '❌ Gagal menyalin');
            }
        }
    });

    // Event: Copy Decoded
    btnCopyDecoded.addEventListener('click', async () => {
        const text = decodeOutput.textContent;
        if (text && text.trim()) {
            try {
                await navigator.clipboard.writeText(text);
                showTempMessage(btnCopyDecoded, '✅ Tersalin!');
            } catch (error) {
                showTempMessage(btnCopyDecoded, '❌ Gagal menyalin');
            }
        }
    });

    // Event: Clear Encode
    btnClearEncode.addEventListener('click', () => {
        encodeInput.value = '';
        encodeOutput.textContent = '';
    });

    // Event: Clear Decode
    btnClearDecode.addEventListener('click', () => {
        decodeInput.value = '';
        decodeOutput.textContent = '';
    });
}

/**
 * Encode teks ke Base64
 * @param {string} text - Teks yang akan di-encode
 * @returns {string} - String Base64
 */
function encodeToBase64(text) {
    // Gunakan native btoa() untuk ASCII
    // Untuk Unicode, perlu konversi dulu
    try {
        // Encode ke UTF-8 lalu ke Base64
        return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
        throw new Error('Gagal melakukan encoding');
    }
}

/**
 * Decode Base64 ke teks
 * @param {string} base64 - String Base64
 * @returns {string} - Teks hasil decode
 */
function decodeFromBase64(base64) {
    try {
        // Decode dari Base64 lalu dari UTF-8
        return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
        throw new Error('Input bukan Base64 yang valid');
    }
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
