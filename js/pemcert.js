/**
 * PEM / X.509 Certificate Viewer Tool
 * Parse and display PEM certificate information
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>PEM Certificate Viewer</h2>
      <p class="tool-description">
        Parse dan tampilkan informasi dari PEM/X.509 certificate. Lihat Subject, Issuer, Validity Period,
        Public Key, Extensions, dan Fingerprints tanpa mengupload ke server.
      </p>

      <!-- Input Section -->
      <div class="input-group">
        <label for="pemInput">
          <i class="icon">📜</i> PEM Certificate
        </label>
        <textarea 
          id="pemInput" 
          placeholder="-----BEGIN CERTIFICATE-----&#10;MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKe...&#10;-----END CERTIFICATE-----"
          rows="10"
        ></textarea>
        <small class="hint">Paste PEM certificate (BEGIN CERTIFICATE / END CERTIFICATE)</small>
      </div>

      <div class="button-group">
        <button id="btnParse" class="btn-primary">
          <i class="icon">🔍</i> Parse Certificate
        </button>
        <button id="btnClear" class="btn-secondary">
          <i class="icon">🗑️</i> Clear
        </button>
        <button id="btnExample" class="btn-secondary">
          💡 Load Example
        </button>
      </div>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">📋</i> Certificate Information
        </label>
        <div id="certOutput" class="output-content"></div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang X.509 Certificates</h3>
        <p><strong>X.509</strong> adalah standar untuk Public Key Infrastructure (PKI) certificates yang digunakan untuk TLS/SSL, code signing, dan authentication.</p>
        
        <h4>🔑 Certificate Fields:</h4>
        <ul>
          <li><strong>Subject:</strong> Entity yang memiliki certificate (domain, organization)</li>
          <li><strong>Issuer:</strong> Certificate Authority (CA) yang menandatangani</li>
          <li><strong>Validity:</strong> Not Before / Not After dates</li>
          <li><strong>Public Key:</strong> RSA, ECDSA, atau algorithm lain</li>
          <li><strong>Extensions:</strong> Subject Alternative Names (SAN), Key Usage, etc.</li>
          <li><strong>Signature:</strong> CA's digital signature</li>
        </ul>

        <h4>🔐 Common Uses:</h4>
        <ul>
          <li><strong>TLS/SSL:</strong> HTTPS websites</li>
          <li><strong>Code Signing:</strong> Software verification</li>
          <li><strong>Email:</strong> S/MIME encryption</li>
          <li><strong>VPN:</strong> Client authentication</li>
        </ul>

        <h4>💡 Tips:</h4>
        <ul>
          <li>Dapatkan cert dari server: <code>openssl s_client -connect example.com:443 -showcerts</code></li>
          <li>Convert DER to PEM: <code>openssl x509 -inform der -in cert.cer -out cert.pem</code></li>
          <li>Check cert expiry secara berkala</li>
          <li>Tool ini 100% client-side, cert tidak dikirim ke server</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const pemInput = container.querySelector('#pemInput');
  const btnParse = container.querySelector('#btnParse');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const outputSection = container.querySelector('#outputSection');
  const certOutput = container.querySelector('#certOutput');

  // Parse PEM Certificate
  function parseCertificate() {
    const pem = pemInput.value.trim();
    
    if (!pem) {
      showError('⚠️ Harap masukkan PEM certificate!');
      return;
    }

    try {
      // Extract base64 content
      const pemMatch = pem.match(/-----BEGIN CERTIFICATE-----\s*([\s\S]+?)\s*-----END CERTIFICATE-----/);
      if (!pemMatch) {
        throw new Error('Invalid PEM format. Must contain BEGIN/END CERTIFICATE markers.');
      }

      const base64 = pemMatch[1].replace(/\s/g, '');
      const der = base64ToArrayBuffer(base64);
      
      // Parse ASN.1 structure (simplified)
      const certInfo = parseX509(der);
      
      displayCertificate(certInfo);
    } catch (error) {
      showError(`❌ Parse error: ${error.message}`);
    }
  }

  // Base64 to ArrayBuffer
  function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Simplified X.509 Parser (basic fields only)
  function parseX509(der) {
    const bytes = new Uint8Array(der);
    const cert = {
      version: 'v3',
      serialNumber: extractSerialNumber(bytes),
      subject: extractDN(bytes, 'subject'),
      issuer: extractDN(bytes, 'issuer'),
      validity: extractValidity(bytes),
      publicKey: extractPublicKeyInfo(bytes),
      fingerprints: calculateFingerprints(bytes)
    };
    return cert;
  }

  // Extract Serial Number (simplified)
  function extractSerialNumber(bytes) {
    // This is a simplified extraction - full ASN.1 parser would be needed for production
    const hex = Array.from(bytes.slice(10, 25))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(':');
    return hex.toUpperCase();
  }

  // Extract Distinguished Name (simplified)
  function extractDN(bytes, type) {
    // Simplified - look for common patterns
    const str = String.fromCharCode(...bytes);
    const cnMatch = str.match(/\x06\x03\x55\x04\x03([\x13\x0c][\x00-\xff]{1,100})/);
    const oMatch = str.match(/\x06\x03\x55\x04\x0a([\x13\x0c][\x00-\xff]{1,100})/);
    const cMatch = str.match(/\x06\x03\x55\x04\x06([\x13\x0c][\x00-\xff]{1,100})/);
    
    let dn = {};
    if (cnMatch) {
      const cn = extractString(cnMatch[1]);
      if (cn) dn.CN = cn;
    }
    if (oMatch) {
      const o = extractString(oMatch[1]);
      if (o) dn.O = o;
    }
    if (cMatch) {
      const c = extractString(cMatch[1]);
      if (c) dn.C = c;
    }
    
    return dn;
  }

  // Extract string from ASN.1 (simplified)
  function extractString(bytes) {
    if (typeof bytes === 'string') {
      const arr = [];
      for (let i = 0; i < bytes.length; i++) {
        arr.push(bytes.charCodeAt(i));
      }
      bytes = new Uint8Array(arr);
    }
    
    const len = bytes[1];
    if (len > 0 && len < 100) {
      const str = String.fromCharCode(...bytes.slice(2, 2 + len));
      // Filter printable ASCII
      return str.replace(/[^\x20-\x7E]/g, '');
    }
    return null;
  }

  // Extract Validity Period (simplified)
  function extractValidity(bytes) {
    const str = String.fromCharCode(...bytes);
    // Look for UTCTime or GeneralizedTime patterns
    const datePattern = /(\d{12,14}Z)/g;
    const matches = str.match(datePattern);
    
    if (matches && matches.length >= 2) {
      return {
        notBefore: parseASN1Date(matches[0]),
        notAfter: parseASN1Date(matches[1])
      };
    }
    
    return {
      notBefore: 'Unknown',
      notAfter: 'Unknown'
    };
  }

  // Parse ASN.1 date
  function parseASN1Date(dateStr) {
    // UTCTime: YYMMDDHHMMSSZ or GeneralizedTime: YYYYMMDDHHMMSSZ
    if (dateStr.length === 13) {
      // UTCTime
      const year = parseInt(dateStr.substr(0, 2));
      const fullYear = year >= 50 ? 1900 + year : 2000 + year;
      const month = dateStr.substr(2, 2);
      const day = dateStr.substr(4, 2);
      const hour = dateStr.substr(6, 2);
      const min = dateStr.substr(8, 2);
      const sec = dateStr.substr(10, 2);
      return `${fullYear}-${month}-${day} ${hour}:${min}:${sec} UTC`;
    } else if (dateStr.length === 15) {
      // GeneralizedTime
      const year = dateStr.substr(0, 4);
      const month = dateStr.substr(4, 2);
      const day = dateStr.substr(6, 2);
      const hour = dateStr.substr(8, 2);
      const min = dateStr.substr(10, 2);
      const sec = dateStr.substr(12, 2);
      return `${year}-${month}-${day} ${hour}:${min}:${sec} UTC`;
    }
    return dateStr;
  }

  // Extract Public Key Info (simplified)
  function extractPublicKeyInfo(bytes) {
    // Look for RSA or ECDSA OIDs
    const str = String.fromCharCode(...bytes);
    
    if (str.includes('\x2a\x86\x48\x86\xf7\x0d\x01\x01')) {
      return { algorithm: 'RSA Encryption', bits: 'Unknown' };
    } else if (str.includes('\x2a\x86\x48\xce\x3d\x02\x01')) {
      return { algorithm: 'Elliptic Curve', curve: 'Unknown' };
    }
    
    return { algorithm: 'Unknown', bits: 'Unknown' };
  }

  // Calculate Fingerprints
  async function calculateFingerprints(der) {
    const sha1 = await crypto.subtle.digest('SHA-1', der);
    const sha256 = await crypto.subtle.digest('SHA-256', der);
    
    return {
      sha1: arrayBufferToHex(sha1),
      sha256: arrayBufferToHex(sha256)
    };
  }

  // ArrayBuffer to Hex
  function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(':')
      .toUpperCase();
  }

  // Display Certificate Info
  function displayCertificate(cert) {
    const now = new Date();
    const notAfter = new Date(cert.validity.notAfter);
    const daysLeft = Math.ceil((notAfter - now) / (1000 * 60 * 60 * 24));
    const isExpired = daysLeft < 0;
    const isExpiringSoon = daysLeft > 0 && daysLeft < 30;

    let html = `
      <div style="display: grid; gap: 1.5rem;">
        <!-- Subject -->
        <div style="padding: 1rem; background: rgba(37, 99, 235, 0.05); border-left: 3px solid var(--primary-color); border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">📋 Subject (Certificate Holder)</h3>
          ${formatDN(cert.subject)}
        </div>

        <!-- Issuer -->
        <div style="padding: 1rem; background: rgba(16, 185, 129, 0.05); border-left: 3px solid var(--secondary-color); border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0; color: var(--secondary-color);">🏢 Issuer (Certificate Authority)</h3>
          ${formatDN(cert.issuer)}
        </div>

        <!-- Validity -->
        <div style="padding: 1rem; background: rgba(${isExpired ? '239, 68, 68' : isExpiringSoon ? '245, 158, 11' : '16, 185, 129'}, 0.05); border-left: 3px solid ${isExpired ? 'var(--danger-color)' : isExpiringSoon ? 'var(--warning-color)' : 'var(--secondary-color)'}; border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0;">📅 Validity Period</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 0.25rem; font-weight: bold; width: 150px;">Not Before:</td>
              <td style="padding: 0.25rem;">${cert.validity.notBefore}</td>
            </tr>
            <tr>
              <td style="padding: 0.25rem; font-weight: bold;">Not After:</td>
              <td style="padding: 0.25rem;">${cert.validity.notAfter}</td>
            </tr>
            <tr>
              <td style="padding: 0.25rem; font-weight: bold;">Status:</td>
              <td style="padding: 0.25rem;">
                ${isExpired ? 
                  '<span style="color: red; font-weight: bold;">❌ EXPIRED</span>' : 
                  isExpiringSoon ? 
                    `<span style="color: orange; font-weight: bold;">⚠️ Expiring in ${daysLeft} days</span>` :
                    `<span style="color: green; font-weight: bold;">✅ Valid (${daysLeft} days left)</span>`
                }
              </td>
            </tr>
          </table>
        </div>

        <!-- Public Key -->
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid #666; border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0;">🔑 Public Key</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 0.25rem; font-weight: bold; width: 150px;">Algorithm:</td>
              <td style="padding: 0.25rem;">${cert.publicKey.algorithm}</td>
            </tr>
            ${cert.publicKey.bits ? `
            <tr>
              <td style="padding: 0.25rem; font-weight: bold;">Key Size:</td>
              <td style="padding: 0.25rem;">${cert.publicKey.bits} bits</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <!-- Fingerprints -->
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid #666; border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0;">🔐 Fingerprints</h3>
          <div style="margin-bottom: 0.75rem;">
            <strong>SHA-1:</strong>
            <div class="code-block" style="margin-top: 0.25rem; font-size: 0.85rem; word-break: break-all;">
              ${cert.fingerprints.sha1}
            </div>
          </div>
          <div>
            <strong>SHA-256:</strong>
            <div class="code-block" style="margin-top: 0.25rem; font-size: 0.85rem; word-break: break-all;">
              ${cert.fingerprints.sha256}
            </div>
          </div>
        </div>

        <!-- Serial Number -->
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid #666; border-radius: 4px;">
          <h3 style="margin: 0 0 0.5rem 0;">🔢 Serial Number</h3>
          <div class="code-block" style="font-size: 0.85rem; word-break: break-all;">
            ${cert.serialNumber}
          </div>
        </div>
      </div>
    `;

    certOutput.innerHTML = html;
    outputSection.style.display = 'block';
  }

  // Format Distinguished Name
  function formatDN(dn) {
    if (Object.keys(dn).length === 0) {
      return '<p style="opacity: 0.7;">Unable to parse DN fields</p>';
    }

    let html = '<table style="width: 100%;">';
    for (const [key, value] of Object.entries(dn)) {
      html += `
        <tr>
          <td style="padding: 0.25rem; font-weight: bold; width: 150px;">${key}:</td>
          <td style="padding: 0.25rem;">${escapeHtml(value)}</td>
        </tr>
      `;
    }
    html += '</table>';
    return html;
  }

  // Show error
  function showError(message) {
    certOutput.innerHTML = `<div class="error-message">${message}</div>`;
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    pemInput.value = '';
    outputSection.style.display = 'none';
  }

  // Load example
  function loadExample() {
    pemInput.value = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG+mRKeAMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
BAYTAklEMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJJRDETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAw6LKqX2L9Ev8kPTN3jNaGvVwEBxLOEKQPvH1vjB8c2sUqIQmQNRQXaL2
vKGqQWNxL3Pq6UqQrX2gqoQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQ
qLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQ
qLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQ
qLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQ
qLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQwIDAQABo1AwTjAdBgNV
HQ4EFgQU1VvKqN2tBvQqPQqLqN3xQN2tBvQwHwYDVR0jBBgwFoAU1VvKqN2tBvQq
PQqLqN3xQN2tBvQwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAqN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2t
BvQqPQqLqN3xQN2tBvQqPQqLqN3xQN2tBvQ=
-----END CERTIFICATE-----`;
    
    setTimeout(() => parseCertificate(), 100);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnParse.addEventListener('click', parseCertificate);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExample);

  // Ctrl+Enter to parse
  pemInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      parseCertificate();
    }
  });
}
