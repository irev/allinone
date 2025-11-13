/**
 * URL Encoder/Decoder Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - URL Encode (percent encoding)
 * - URL Decode
 * - Component encoding (untuk query parameters)
 * 
 * Semua operasi dilakukan client-side menggunakan native JavaScript API
 */

/**
 * Fungsi utama untuk render UI URL tool
 * @param {HTMLElement} container - Container element untuk render
 */
export async function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🔗 URL Encoder / Decoder</h2>
            <p class="tool-description">
                Encode atau decode URL dan komponen URL. URL encoding mengubah karakter khusus 
                menjadi format yang aman untuk digunakan dalam URL (percent encoding).
            </p>
        </div>

        <div class="alert alert-info">
            ℹ️ <strong>Perbedaan:</strong> 
            <ul style="margin: 0.5rem 0 0 1.5rem;">
                <li><strong>URL Encode:</strong> Untuk encode seluruh URL</li>
                <li><strong>Component Encode:</strong> Untuk encode bagian URL (query parameter, dll)</li>
            </ul>
        </div>

        <!-- Section Encode -->
        <div class="tool-section">
            <h3 class="section-title">📤 URL Encode</h3>
            
            <div class="form-group">
                <label class="form-label" for="encodeInput">Input URL/Teks:</label>
                <textarea 
                    id="encodeInput" 
                    class="form-textarea" 
                    placeholder="Contoh: https://example.com/search?q=hello world&lang=id"
                    rows="4"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Tipe Encoding:</label>
                <select id="encodeType" class="form-select">
                    <option value="component">URL Component (Recommended - untuk parameter)</option>
                    <option value="full">Full URL</option>
                </select>
            </div>

            <div class="btn-group">
                <button id="btnEncode" class="btn btn-primary">
                    🔒 Encode URL
                </button>
                <button id="btnCopyEncoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearEncode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output Encoded:</label>
                <div id="encodeOutput" class="output-box"></div>
            </div>
        </div>

        <hr style="border: 1px solid #e5e7eb; margin: 2rem 0;">

        <!-- Section Decode -->
        <div class="tool-section">
            <h3 class="section-title">📥 URL Decode</h3>
            
            <div class="form-group">
                <label class="form-label" for="decodeInput">Input Encoded URL:</label>
                <textarea 
                    id="decodeInput" 
                    class="form-textarea" 
                    placeholder="Contoh: https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
                    rows="4"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Tipe Decoding:</label>
                <select id="decodeType" class="form-select">
                    <option value="component">URL Component</option>
                    <option value="full">Full URL</option>
                </select>
            </div>

            <div class="btn-group">
                <button id="btnDecode" class="btn btn-secondary">
                    🔓 Decode URL
                </button>
                <button id="btnCopyDecoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearDecode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output Decoded:</label>
                <div id="decodeOutput" class="output-box"></div>
            </div>
        </div>

        <!-- Examples Section -->
        <div class="tool-section">
            <h3 class="section-title">💡 Contoh Penggunaan</h3>
            <div class="alert alert-warning">
                <strong>Contoh karakter yang di-encode:</strong><br>
                <code>Spasi → %20</code><br>
                <code>? → %3F</code><br>
                <code>& → %26</code><br>
                <code>= → %3D</code><br>
                <code># → %23</code><br>
                <code>/ → %2F (pada component encoding)</code>
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
    const encodeInput = container.querySelector('#encodeInput');
    const encodeOutput = container.querySelector('#encodeOutput');
    const encodeType = container.querySelector('#encodeType');
    const decodeInput = container.querySelector('#decodeInput');
    const decodeOutput = container.querySelector('#decodeOutput');
    const decodeType = container.querySelector('#decodeType');

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
            encodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan URL/teks terlebih dahulu</span>';
            return;
        }

        try {
            const type = encodeType.value;
            const encoded = type === 'component' 
                ? encodeURIComponent(text)
                : encodeURI(text);
            
            encodeOutput.textContent = encoded;
        } catch (error) {
            encodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
        }
    });

    // Event: Decode
    btnDecode.addEventListener('click', () => {
        const text = decodeInput.value;
        
        if (!text.trim()) {
            decodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan encoded URL terlebih dahulu</span>';
            return;
        }

        try {
            const type = decodeType.value;
            const decoded = type === 'component'
                ? decodeURIComponent(text)
                : decodeURI(text);
            
            decodeOutput.textContent = decoded;
        } catch (error) {
            decodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: Input bukan URL encoded yang valid. ${error.message}</span>`;
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
