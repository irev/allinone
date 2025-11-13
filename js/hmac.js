/**
 * HMAC Generator Tool
 * Generate HMAC signatures using SHA-256 and SHA-1 algorithms
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>HMAC Generator</h2>
      <p class="tool-description">
        Generate HMAC (Hash-based Message Authentication Code) signatures for message authentication and integrity verification.
        Gunakan untuk API authentication, webhook verification, dan validasi data integrity.
      </p>

      <!-- Input Section -->
      <div class="input-group">
        <label for="hmacMessage">
          <i class="icon">📝</i> Message/Data
        </label>
        <textarea 
          id="hmacMessage" 
          placeholder="Masukkan text atau data yang akan di-sign..."
          rows="5"
        ></textarea>
      </div>

      <div class="input-group">
        <label for="hmacSecret">
          <i class="icon">🔑</i> Secret Key
        </label>
        <textarea 
          id="hmacSecret" 
          placeholder="Masukkan secret key..."
          rows="3"
        ></textarea>
      </div>

      <div class="input-group">
        <label for="hmacAlgorithm">
          <i class="icon">⚙️</i> Algorithm
        </label>
        <select id="hmacAlgorithm">
          <option value="SHA-256">HMAC-SHA256 (Recommended)</option>
          <option value="SHA-1">HMAC-SHA1</option>
          <option value="SHA-512">HMAC-SHA512</option>
        </select>
      </div>

      <div class="input-group">
        <label for="hmacOutputFormat">
          <i class="icon">🎯</i> Output Format
        </label>
        <select id="hmacOutputFormat">
          <option value="hex">Hexadecimal</option>
          <option value="base64">Base64</option>
        </select>
      </div>

      <div class="button-group">
        <button id="btnGenerate" class="btn-primary">
          <i class="icon">🔐</i> Generate HMAC
        </button>
        <button id="btnClear" class="btn-secondary">
          <i class="icon">🗑️</i> Clear
        </button>
        <button id="btnExample" class="btn-secondary">
          💡 Contoh
        </button>
      </div>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">✅</i> HMAC Signature
        </label>
        <div class="output-box">
          <div id="hmacOutput" class="output-content"></div>
          <button id="btnCopy" class="btn-copy">
            <i class="icon">📋</i> Copy
          </button>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang HMAC</h3>
        <p><strong>HMAC (Hash-based Message Authentication Code)</strong> adalah metode kriptografi untuk memverifikasi integritas dan autentikasi pesan menggunakan secret key.</p>
        
        <h4>🎯 Use Cases:</h4>
        <ul>
          <li><strong>API Authentication:</strong> AWS Signature, GitHub Webhooks</li>
          <li><strong>JWT:</strong> HS256, HS512 token signing</li>
          <li><strong>Webhook Verification:</strong> Stripe, PayPal, Twilio</li>
          <li><strong>Data Integrity:</strong> Memastikan data tidak dimodifikasi</li>
        </ul>

        <h4>🔐 Algorithms:</h4>
        <ul>
          <li><strong>HMAC-SHA256:</strong> Most common, 256-bit output (Recommended)</li>
          <li><strong>HMAC-SHA1:</strong> Legacy, 160-bit output (use for compatibility only)</li>
          <li><strong>HMAC-SHA512:</strong> Maximum security, 512-bit output</li>
        </ul>

        <h4>💡 Tips:</h4>
        <ul>
          <li>Secret key harus dijaga kerahasiaannya (jangan hardcode di client)</li>
          <li>Gunakan key dengan panjang minimal 32 bytes untuk SHA-256</li>
          <li>HMAC-SHA256 adalah standar untuk modern applications</li>
          <li>Verifikasi signature dengan timing-safe comparison</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const messageInput = container.querySelector('#hmacMessage');
  const secretInput = container.querySelector('#hmacSecret');
  const algorithmSelect = container.querySelector('#hmacAlgorithm');
  const formatSelect = container.querySelector('#hmacOutputFormat');
  const btnGenerate = container.querySelector('#btnGenerate');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const btnCopy = container.querySelector('#btnCopy');
  const outputSection = container.querySelector('#outputSection');
  const hmacOutput = container.querySelector('#hmacOutput');

  // Generate HMAC
  async function generateHMAC() {
    const message = messageInput.value.trim();
    const secret = secretInput.value.trim();
    const algorithm = algorithmSelect.value;
    const format = formatSelect.value;

    if (!message) {
      showError('⚠️ Harap masukkan message!');
      return;
    }

    if (!secret) {
      showError('⚠️ Harap masukkan secret key!');
      return;
    }

    try {
      // Convert secret and message to ArrayBuffer
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(message);

      // Import the secret key
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
      );

      // Generate HMAC signature
      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);

      // Format output
      let result;
      if (format === 'hex') {
        result = bufferToHex(signature);
      } else {
        result = bufferToBase64(signature);
      }

      showOutput(result, algorithm, format);
    } catch (error) {
      showError(`❌ Error: ${error.message}`);
    }
  }

  // Helper: ArrayBuffer to Hex
  function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Helper: ArrayBuffer to Base64
  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Show output
  function showOutput(signature, algorithm, format) {
    const formatLabel = format === 'hex' ? 'Hexadecimal' : 'Base64';
    
    hmacOutput.innerHTML = `
      <div style="margin-bottom: 0.5rem;">
        <strong>Algorithm:</strong> HMAC-${algorithm}<br>
        <strong>Format:</strong> ${formatLabel}<br>
        <strong>Length:</strong> ${signature.length} characters
      </div>
      <div class="code-block" style="word-break: break-all;">
        ${signature}
      </div>
    `;
    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    hmacOutput.innerHTML = `<div class="error-message">${message}</div>`;
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    messageInput.value = '';
    secretInput.value = '';
    algorithmSelect.value = 'SHA-256';
    formatSelect.value = 'hex';
    outputSection.style.display = 'none';
    hmacOutput.textContent = '';
  }

  // Load example
  function loadExample() {
    messageInput.value = 'POST&https://api.example.com/v1/orders&amount=100&currency=USD&timestamp=1699876543';
    secretInput.value = 'my-secret-key-32-characters-long!';
    algorithmSelect.value = 'SHA-256';
    formatSelect.value = 'hex';
    
    // Auto-generate
    setTimeout(() => generateHMAC(), 100);
  }

  // Copy to clipboard
  async function copyToClipboard() {
    const codeBlock = hmacOutput.querySelector('.code-block');
    if (!codeBlock) return;

    try {
      await navigator.clipboard.writeText(codeBlock.textContent.trim());
      const originalText = btnCopy.innerHTML;
      btnCopy.innerHTML = '<i class="icon">✅</i> Copied!';
      setTimeout(() => {
        btnCopy.innerHTML = originalText;
      }, 2000);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  }

  // Event Listeners
  btnGenerate.addEventListener('click', generateHMAC);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExample);
  btnCopy.addEventListener('click', copyToClipboard);

  // Enter key to generate
  messageInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      generateHMAC();
    }
  });

  secretInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      generateHMAC();
    }
  });
}
