/**
 * HTML Entities Encoder/Decoder Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - Encode karakter HTML special ke entities (&lt;, &gt;, &amp;, dll)
 * - Decode HTML entities ke karakter asli
 * - Named entities dan numeric entities
 * 
 * Berguna untuk sanitasi HTML, mencegah XSS, dan menampilkan kode HTML
 */

/**
 * Fungsi utama untuk render UI HTML Entities
 * @param {HTMLElement} container - Container element untuk render
 */
export async function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🏷️ HTML Entities Encoder / Decoder</h2>
            <p class="tool-description">
                Konversi karakter HTML khusus ke HTML entities atau sebaliknya. 
                Penting untuk keamanan web (mencegah XSS) dan menampilkan kode HTML sebagai teks.
            </p>
        </div>

        <div class="alert alert-warning">
            ⚠️ <strong>Keamanan:</strong> Selalu encode user input sebelum menampilkan di HTML 
            untuk mencegah Cross-Site Scripting (XSS) attacks.
        </div>

        <!-- Section Encode -->
        <div class="tool-section">
            <h3 class="section-title">📤 Encode (Text → HTML Entities)</h3>
            
            <div class="form-group">
                <label class="form-label" for="encodeInput">Input Text/HTML:</label>
                <textarea 
                    id="encodeInput" 
                    class="form-textarea" 
                    placeholder='Contoh: <script>alert("XSS")</script>'
                    rows="5"
                ></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Tipe Encoding:</label>
                <select id="encodeType" class="form-select">
                    <option value="all">All Characters (Maksimal keamanan)</option>
                    <option value="basic" selected>Basic HTML Characters</option>
                    <option value="numeric">Numeric Entities Only</option>
                </select>
            </div>

            <div class="btn-group">
                <button id="btnEncode" class="btn btn-primary">
                    🔒 Encode
                </button>
                <button id="btnCopyEncoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearEncode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output (Encoded):</label>
                <div id="encodeOutput" class="output-box"></div>
            </div>
        </div>

        <hr style="border: 1px solid #e5e7eb; margin: 2rem 0;">

        <!-- Section Decode -->
        <div class="tool-section">
            <h3 class="section-title">📥 Decode (HTML Entities → Text)</h3>
            
            <div class="form-group">
                <label class="form-label" for="decodeInput">Input HTML Entities:</label>
                <textarea 
                    id="decodeInput" 
                    class="form-textarea" 
                    placeholder="Contoh: &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"
                    rows="5"
                ></textarea>
            </div>

            <div class="btn-group">
                <button id="btnDecode" class="btn btn-secondary">
                    🔓 Decode
                </button>
                <button id="btnCopyDecoded" class="btn btn-outline">
                    📋 Salin Hasil
                </button>
                <button id="btnClearDecode" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>

            <div class="form-group mt-2">
                <label class="form-label">Output (Decoded):</label>
                <div id="decodeOutput" class="output-box"></div>
            </div>

            <div class="alert alert-danger mt-2">
                ⚠️ <strong>PERINGATAN:</strong> Jangan langsung menampilkan hasil decode sebagai HTML 
                tanpa validasi! Ini bisa menyebabkan XSS vulnerability.
            </div>
        </div>

        <!-- Info Section -->
        <div class="tool-section">
            <h3 class="section-title">💡 Referensi HTML Entities</h3>
            <div class="alert alert-info">
                <strong>Common HTML Entities:</strong><br><br>
                <code>&lt;</code> → <code>&amp;lt;</code> (less than)<br>
                <code>&gt;</code> → <code>&amp;gt;</code> (greater than)<br>
                <code>&amp;</code> → <code>&amp;amp;</code> (ampersand)<br>
                <code>"</code> → <code>&amp;quot;</code> (double quote)<br>
                <code>'</code> → <code>&amp;#39;</code> atau <code>&amp;apos;</code> (single quote)<br>
                <code>&nbsp;</code> → <code>&amp;nbsp;</code> (non-breaking space)<br>
                <code>©</code> → <code>&amp;copy;</code> (copyright)<br>
                <code>®</code> → <code>&amp;reg;</code> (registered trademark)<br>
                <code>™</code> → <code>&amp;trade;</code> (trademark)<br><br>
                
                <strong>Numeric Entities:</strong><br>
                Format: <code>&amp;#[decimal];</code> atau <code>&amp;#x[hex];</code><br>
                Contoh: <code>A</code> = <code>&amp;#65;</code> = <code>&amp;#x41;</code>
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
        
        if (!text) {
            encodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan teks terlebih dahulu</span>';
            return;
        }

        try {
            const type = encodeType.value;
            const encoded = encodeHTMLEntities(text, type);
            encodeOutput.textContent = encoded;
        } catch (error) {
            encodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
        }
    });

    // Event: Decode
    btnDecode.addEventListener('click', () => {
        const text = decodeInput.value;
        
        if (!text) {
            decodeOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan HTML entities terlebih dahulu</span>';
            return;
        }

        try {
            const decoded = decodeHTMLEntities(text);
            decodeOutput.textContent = decoded;
        } catch (error) {
            decodeOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
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

// ========== HTML Entities Map ==========

const htmlEntitiesMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

/**
 * Encode text ke HTML entities
 * @param {string} text - Text yang akan di-encode
 * @param {string} type - Tipe encoding (all, basic, numeric)
 * @returns {string} - Encoded text
 */
function encodeHTMLEntities(text, type = 'basic') {
    switch (type) {
        case 'all':
            // Encode semua karakter ke numeric entities
            return Array.from(text)
                .map(char => {
                    const code = char.charCodeAt(0);
                    // Keep basic ASCII alphanumeric
                    if ((code >= 48 && code <= 57) ||  // 0-9
                        (code >= 65 && code <= 90) ||  // A-Z
                        (code >= 97 && code <= 122)) { // a-z
                        return char;
                    }
                    return `&#${code};`;
                })
                .join('');
        
        case 'numeric':
            // Encode hanya karakter khusus ke numeric entities
            return text.replace(/[&<>"'\/`=]/g, char => {
                return `&#${char.charCodeAt(0)};`;
            });
        
        case 'basic':
        default:
            // Encode menggunakan named entities untuk karakter umum
            return text.replace(/[&<>"'\/`=]/g, char => htmlEntitiesMap[char]);
    }
}

/**
 * Decode HTML entities ke text
 * @param {string} text - Text dengan HTML entities
 * @returns {string} - Decoded text
 */
function decodeHTMLEntities(text) {
    // Buat temporary element untuk decode
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
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
