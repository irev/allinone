/**
 * JWT Inspector Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - Decode dan inspect JWT (JSON Web Token)
 * - Tampilkan Header, Payload, dan Signature
 * - Validasi format JWT
 * - Decode tanpa verifikasi signature (client-side only)
 * 
 * PENTING: Tool ini hanya untuk inspeksi, BUKAN untuk validasi keamanan!
 */

/**
 * Fungsi utama untuk render UI JWT Inspector
 * @param {HTMLElement} container - Container element untuk render
 */
export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🔍 JWT Inspector</h2>
            <p class="tool-description">
                Decode dan inspeksi JSON Web Token (JWT). Lihat header, payload, dan signature 
                dari JWT tanpa verifikasi. Tool ini hanya untuk analisis, bukan validasi keamanan.
            </p>
        </div>

        <div class="alert alert-danger">
            ⚠️ <strong>PERINGATAN KEAMANAN:</strong><br>
            • Tool ini TIDAK memverifikasi signature JWT<br>
            • JANGAN gunakan untuk validasi token di production<br>
            • Verifikasi JWT harus dilakukan di server dengan secret key<br>
            • Jangan masukkan JWT yang berisi data sensitif di tool online
        </div>

        <!-- Input Section -->
        <div class="tool-section">
            <h3 class="section-title">📝 Input JWT Token</h3>
            
            <div class="form-group">
                <label class="form-label" for="jwtInput">JWT Token:</label>
                <textarea 
                    id="jwtInput" 
                    class="form-textarea" 
                    placeholder="Paste JWT token di sini, contoh:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                    rows="6"
                ></textarea>
            </div>

            <div class="btn-group">
                <button id="btnDecode" class="btn btn-primary">
                    🔍 Decode JWT
                </button>
                <button id="btnClear" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
                <button id="btnSample" class="btn btn-outline">
                    📄 Load Sample JWT
                </button>
            </div>
        </div>

        <!-- Output Section -->
        <div id="jwtResults" class="hidden">
            <!-- Header -->
            <div class="tool-section">
                <h3 class="section-title" style="color: #ef4444;">🔴 HEADER</h3>
                <div class="form-group">
                    <label class="form-label">Algorithm & Token Type:</label>
                    <div id="headerOutput" class="output-box"></div>
                </div>
            </div>

            <!-- Payload -->
            <div class="tool-section">
                <h3 class="section-title" style="color: #8b5cf6;">🟣 PAYLOAD (Claims)</h3>
                <div class="form-group">
                    <label class="form-label">Token Data:</label>
                    <div id="payloadOutput" class="output-box"></div>
                </div>
                
                <div class="btn-group">
                    <button id="btnCopyPayload" class="btn btn-outline">
                        📋 Salin Payload
                    </button>
                </div>
            </div>

            <!-- Signature -->
            <div class="tool-section">
                <h3 class="section-title" style="color: #10b981;">🟢 SIGNATURE</h3>
                <div class="form-group">
                    <label class="form-label">Signature (Base64):</label>
                    <div id="signatureOutput" class="output-box"></div>
                </div>
                
                <div class="alert alert-warning mt-2">
                    ⚠️ Signature tidak diverifikasi. Untuk memverifikasi JWT, gunakan library di server 
                    dengan secret key atau public key yang sesuai.
                </div>
            </div>

            <!-- Token Info -->
            <div class="tool-section">
                <h3 class="section-title">📊 Informasi Token</h3>
                <div class="alert alert-info" id="tokenInfo"></div>
            </div>
        </div>

        <!-- Info Section -->
        <div class="tool-section">
            <h3 class="section-title">💡 Tentang JWT</h3>
            <div class="alert alert-info">
                <strong>Struktur JWT:</strong><br>
                JWT terdiri dari 3 bagian yang dipisahkan oleh titik (.): <code>HEADER.PAYLOAD.SIGNATURE</code><br><br>
                
                <strong>1. HEADER</strong> (warna merah)<br>
                • Berisi algoritma signing (alg) dan tipe token (typ)<br>
                • Contoh: <code>{"alg": "HS256", "typ": "JWT"}</code><br><br>
                
                <strong>2. PAYLOAD</strong> (warna ungu)<br>
                • Berisi claims (data/klaim) yang ingin ditransmisikan<br>
                • Standard claims: iss (issuer), sub (subject), aud (audience), exp (expiration), iat (issued at)<br>
                • Bisa berisi custom claims sesuai kebutuhan<br><br>
                
                <strong>3. SIGNATURE</strong> (warna hijau)<br>
                • Digunakan untuk memverifikasi token tidak diubah<br>
                • Dibuat dengan: <code>HMACSHA256(base64(header) + "." + base64(payload), secret)</code><br><br>
                
                <strong>Catatan:</strong> JWT adalah encoded (Base64URL), bukan encrypted. Siapapun bisa decode dan membaca isinya!
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
    const jwtInput = container.querySelector('#jwtInput');
    const jwtResults = container.querySelector('#jwtResults');
    const headerOutput = container.querySelector('#headerOutput');
    const payloadOutput = container.querySelector('#payloadOutput');
    const signatureOutput = container.querySelector('#signatureOutput');
    const tokenInfo = container.querySelector('#tokenInfo');

    // Buttons
    const btnDecode = container.querySelector('#btnDecode');
    const btnClear = container.querySelector('#btnClear');
    const btnSample = container.querySelector('#btnSample');
    const btnCopyPayload = container.querySelector('#btnCopyPayload');

    // Event: Decode JWT
    btnDecode.addEventListener('click', () => {
        const jwt = jwtInput.value.trim();
        
        if (!jwt) {
            alert('⚠️ Masukkan JWT token terlebih dahulu');
            jwtResults.classList.add('hidden');
            return;
        }

        try {
            const decoded = decodeJWT(jwt);
            
            // Display results
            headerOutput.textContent = JSON.stringify(decoded.header, null, 2);
            payloadOutput.textContent = JSON.stringify(decoded.payload, null, 2);
            signatureOutput.textContent = decoded.signature;
            
            // Display token info
            displayTokenInfo(tokenInfo, decoded);
            
            jwtResults.classList.remove('hidden');
            
        } catch (error) {
            alert(`❌ Error: ${error.message}`);
            jwtResults.classList.add('hidden');
        }
    });

    // Event: Clear
    btnClear.addEventListener('click', () => {
        jwtInput.value = '';
        jwtResults.classList.add('hidden');
    });

    // Event: Load Sample
    btnSample.addEventListener('click', () => {
        // Sample JWT token
        const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIn0.4Adcj0MqXKMhbR8yKZ5Z6YjhqJH8nPOa8mF3TqXwU5g';
        jwtInput.value = sampleJWT;
    });

    // Event: Copy Payload
    btnCopyPayload.addEventListener('click', async () => {
        const payload = payloadOutput.textContent;
        if (payload && payload.trim()) {
            try {
                await navigator.clipboard.writeText(payload);
                showTempMessage(btnCopyPayload, '✅ Payload tersalin!');
            } catch (error) {
                showTempMessage(btnCopyPayload, '❌ Gagal menyalin');
            }
        }
    });
}

/**
 * Decode JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded JWT dengan header, payload, dan signature
 */
function decodeJWT(token) {
    // Validasi format JWT
    const parts = token.split('.');
    
    if (parts.length !== 3) {
        throw new Error('Format JWT tidak valid. JWT harus memiliki 3 bagian yang dipisahkan titik (.)');
    }

    try {
        // Decode header
        const header = JSON.parse(base64UrlDecode(parts[0]));
        
        // Decode payload
        const payload = JSON.parse(base64UrlDecode(parts[1]));
        
        // Signature (tetap dalam bentuk base64)
        const signature = parts[2];

        return {
            header,
            payload,
            signature,
            raw: token
        };
        
    } catch (error) {
        throw new Error(`Gagal decode JWT: ${error.message}. Pastikan token valid.`);
    }
}

/**
 * Decode Base64URL (JWT menggunakan Base64URL, bukan Base64 biasa)
 * @param {string} str - Base64URL string
 * @returns {string} - Decoded string
 */
function base64UrlDecode(str) {
    // Base64URL ke Base64: replace - dengan + dan _ dengan /
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Tambahkan padding jika diperlukan
    while (base64.length % 4) {
        base64 += '=';
    }
    
    // Decode dari Base64
    try {
        return decodeURIComponent(escape(atob(base64)));
    } catch (error) {
        throw new Error('Format Base64 tidak valid');
    }
}

/**
 * Tampilkan informasi token
 * @param {HTMLElement} element - Element untuk display
 * @param {Object} decoded - Decoded JWT
 */
function displayTokenInfo(element, decoded) {
    const { header, payload } = decoded;
    
    let info = `<strong>Algoritma:</strong> ${header.alg || 'N/A'}<br>`;
    info += `<strong>Token Type:</strong> ${header.typ || 'N/A'}<br><br>`;
    
    // Check standard claims
    if (payload.iss) info += `<strong>Issuer (iss):</strong> ${payload.iss}<br>`;
    if (payload.sub) info += `<strong>Subject (sub):</strong> ${payload.sub}<br>`;
    if (payload.aud) info += `<strong>Audience (aud):</strong> ${payload.aud}<br>`;
    
    // Check timestamps
    if (payload.iat) {
        const iatDate = new Date(payload.iat * 1000);
        info += `<strong>Issued At (iat):</strong> ${iatDate.toLocaleString()} (${payload.iat})<br>`;
    }
    
    if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const isExpired = expDate < now;
        
        info += `<strong>Expiration (exp):</strong> ${expDate.toLocaleString()} (${payload.exp})`;
        if (isExpired) {
            info += ` <span style="color: var(--danger-color); font-weight: bold;">⚠️ EXPIRED</span>`;
        } else {
            info += ` <span style="color: var(--secondary-color); font-weight: bold;">✅ Valid</span>`;
        }
        info += '<br>';
    }
    
    if (payload.nbf) {
        const nbfDate = new Date(payload.nbf * 1000);
        info += `<strong>Not Before (nbf):</strong> ${nbfDate.toLocaleString()} (${payload.nbf})<br>`;
    }
    
    // Count custom claims
    const standardClaims = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'];
    const customClaimsCount = Object.keys(payload).filter(key => !standardClaims.includes(key)).length;
    
    info += `<br><strong>Custom Claims:</strong> ${customClaimsCount}`;
    
    element.innerHTML = info;
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
