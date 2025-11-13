/**
 * Cookie Parser / Builder Tool
 * Parse Set-Cookie headers and build cookie strings
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>Cookie Parser / Builder</h2>
      <p class="tool-description">
        Parse Set-Cookie response headers dan build cookie strings dengan attributes.
        Berguna untuk analisa session management, security testing, dan debugging.
      </p>

      <!-- Mode Selection -->
      <div class="input-group">
        <label>
          <i class="icon">⚙️</i> Mode
        </label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="cookieMode" value="parse" checked>
            🔍 Parse Cookie
          </label>
          <label class="radio-label">
            <input type="radio" name="cookieMode" value="build">
            🔨 Build Cookie
          </label>
        </div>
      </div>

      <!-- Parse Mode -->
      <div id="parseMode">
        <div class="input-group">
          <label for="cookieHeader">
            <i class="icon">📥</i> Set-Cookie Header atau Cookie String
          </label>
          <textarea 
            id="cookieHeader" 
            placeholder="Set-Cookie: sessionid=abc123; Path=/; Secure; HttpOnly; SameSite=Strict&#10;atau&#10;sessionid=abc123; token=xyz789"
            rows="5"
          ></textarea>
          <small class="hint">Support multiple Set-Cookie headers (satu per baris) atau cookie string biasa.</small>
        </div>

        <div class="button-group">
          <button id="btnParse" class="btn-primary">
            <i class="icon">🔍</i> Parse Cookie
          </button>
          <button id="btnExampleParse" class="btn-secondary">
            💡 Contoh Parse
          </button>
        </div>
      </div>

      <!-- Build Mode -->
      <div id="buildMode" style="display: none;">
        <div class="input-group">
          <label for="cookieName">
            <i class="icon">🏷️</i> Cookie Name
          </label>
          <input type="text" id="cookieName" placeholder="sessionid">
        </div>

        <div class="input-group">
          <label for="cookieValue">
            <i class="icon">💎</i> Cookie Value
          </label>
          <input type="text" id="cookieValue" placeholder="abc123xyz...">
        </div>

        <div class="input-group">
          <label for="cookiePath">
            <i class="icon">📂</i> Path
          </label>
          <input type="text" id="cookiePath" placeholder="/" value="/">
        </div>

        <div class="input-group">
          <label for="cookieDomain">
            <i class="icon">🌐</i> Domain (optional)
          </label>
          <input type="text" id="cookieDomain" placeholder=".example.com">
        </div>

        <div class="input-group">
          <label for="cookieMaxAge">
            <i class="icon">⏱️</i> Max-Age (seconds, optional)
          </label>
          <input type="number" id="cookieMaxAge" placeholder="3600">
        </div>

        <div class="input-group">
          <label for="cookieExpires">
            <i class="icon">📅</i> Expires (optional)
          </label>
          <input type="datetime-local" id="cookieExpires">
        </div>

        <div class="input-group">
          <label>
            <i class="icon">🔐</i> Security Attributes
          </label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="cookieSecure"> Secure
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="cookieHttpOnly" checked> HttpOnly
            </label>
          </div>
        </div>

        <div class="input-group">
          <label for="cookieSameSite">
            <i class="icon">🛡️</i> SameSite
          </label>
          <select id="cookieSameSite">
            <option value="">None (not set)</option>
            <option value="Strict" selected>Strict</option>
            <option value="Lax">Lax</option>
            <option value="None">None</option>
          </select>
        </div>

        <div class="button-group">
          <button id="btnBuild" class="btn-primary">
            <i class="icon">🔨</i> Build Cookie
          </button>
          <button id="btnExampleBuild" class="btn-secondary">
            💡 Contoh Build
          </button>
        </div>
      </div>

      <button id="btnClear" class="btn-secondary" style="width: 100%; margin-top: 1rem;">
        <i class="icon">🗑️</i> Clear All
      </button>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">✅</i> Result
        </label>
        <div class="output-box">
          <div id="cookieOutput" class="output-content"></div>
          <button id="btnCopy" class="btn-copy">
            <i class="icon">📋</i> Copy
          </button>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang Cookies</h3>
        <p><strong>HTTP Cookies</strong> adalah data kecil yang disimpan browser untuk session management, personalization, dan tracking.</p>
        
        <h4>🔐 Security Attributes:</h4>
        <ul>
          <li><strong>Secure:</strong> Cookie hanya dikirim via HTTPS</li>
          <li><strong>HttpOnly:</strong> Tidak bisa diakses JavaScript (XSS protection)</li>
          <li><strong>SameSite:</strong> CSRF protection
            <ul>
              <li><code>Strict</code>: Tidak dikirim cross-site (recommended)</li>
              <li><code>Lax</code>: Dikirim untuk top-level navigation</li>
              <li><code>None</code>: Dikirim semua request (butuh Secure)</li>
            </ul>
          </li>
        </ul>

        <h4>⏱️ Expiration:</h4>
        <ul>
          <li><strong>Max-Age:</strong> Lifetime dalam detik (modern, recommended)</li>
          <li><strong>Expires:</strong> Tanggal absolut (legacy)</li>
          <li>Tanpa keduanya: Session cookie (hilang saat browser ditutup)</li>
        </ul>

        <h4>💡 Best Practices:</h4>
        <ul>
          <li>Selalu gunakan <code>Secure</code> dan <code>HttpOnly</code> untuk session cookies</li>
          <li>Set <code>SameSite=Strict</code> atau <code>Lax</code> untuk CSRF protection</li>
          <li>Gunakan <code>__Secure-</code> atau <code>__Host-</code> prefix untuk extra security</li>
          <li>Batasi <code>Path</code> dan <code>Domain</code> sesuai kebutuhan</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const parseMode = container.querySelector('#parseMode');
  const buildMode = container.querySelector('#buildMode');
  const modeRadios = container.querySelectorAll('input[name="cookieMode"]');
  const cookieHeader = container.querySelector('#cookieHeader');
  const btnParse = container.querySelector('#btnParse');
  const btnExampleParse = container.querySelector('#btnExampleParse');

  const cookieName = container.querySelector('#cookieName');
  const cookieValue = container.querySelector('#cookieValue');
  const cookiePath = container.querySelector('#cookiePath');
  const cookieDomain = container.querySelector('#cookieDomain');
  const cookieMaxAge = container.querySelector('#cookieMaxAge');
  const cookieExpires = container.querySelector('#cookieExpires');
  const cookieSecure = container.querySelector('#cookieSecure');
  const cookieHttpOnly = container.querySelector('#cookieHttpOnly');
  const cookieSameSite = container.querySelector('#cookieSameSite');
  const btnBuild = container.querySelector('#btnBuild');
  const btnExampleBuild = container.querySelector('#btnExampleBuild');

  const btnClear = container.querySelector('#btnClear');
  const btnCopy = container.querySelector('#btnCopy');
  const outputSection = container.querySelector('#outputSection');
  const cookieOutput = container.querySelector('#cookieOutput');

  // Toggle mode
  modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'parse') {
        parseMode.style.display = 'block';
        buildMode.style.display = 'none';
      } else {
        parseMode.style.display = 'none';
        buildMode.style.display = 'block';
      }
      outputSection.style.display = 'none';
    });
  });

  // Parse cookie
  function parseCookie() {
    const input = cookieHeader.value.trim();
    if (!input) {
      showError('⚠️ Harap masukkan cookie header atau string!');
      return;
    }

    try {
      const lines = input.split('\n').map(l => l.trim()).filter(l => l);
      const cookies = [];

      for (const line of lines) {
        const cookie = parseSingleCookie(line);
        if (cookie) cookies.push(cookie);
      }

      if (cookies.length === 0) {
        showError('❌ Tidak ada cookie yang valid ditemukan!');
        return;
      }

      showParsedCookies(cookies);
    } catch (error) {
      showError(`❌ Parse error: ${error.message}`);
    }
  }

  // Parse single cookie
  function parseSingleCookie(line) {
    // Remove "Set-Cookie:" prefix if exists
    line = line.replace(/^Set-Cookie:\s*/i, '');

    const parts = line.split(';').map(p => p.trim());
    if (parts.length === 0) return null;

    // First part is name=value
    const [nameValue, ...attributes] = parts;
    const equalPos = nameValue.indexOf('=');
    if (equalPos === -1) return null;

    const cookie = {
      name: nameValue.substring(0, equalPos).trim(),
      value: nameValue.substring(equalPos + 1).trim(),
      attributes: {}
    };

    // Parse attributes
    for (const attr of attributes) {
      const eqPos = attr.indexOf('=');
      if (eqPos === -1) {
        // Boolean attribute (Secure, HttpOnly)
        cookie.attributes[attr.toLowerCase()] = true;
      } else {
        const key = attr.substring(0, eqPos).trim().toLowerCase();
        const val = attr.substring(eqPos + 1).trim();
        cookie.attributes[key] = val;
      }
    }

    return cookie;
  }

  // Show parsed cookies
  function showParsedCookies(cookies) {
    let html = '<div class="cookie-table">';

    cookies.forEach((cookie, index) => {
      html += `
        <div class="cookie-item" style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">Cookie ${index + 1}: ${escapeHtml(cookie.name)}</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; font-weight: bold; width: 150px;">Name</td>
              <td style="padding: 0.5rem; word-break: break-all;">${escapeHtml(cookie.name)}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; font-weight: bold;">Value</td>
              <td style="padding: 0.5rem; word-break: break-all;">${escapeHtml(cookie.value)}</td>
            </tr>
      `;

      // Attributes
      const attrOrder = ['path', 'domain', 'expires', 'max-age', 'secure', 'httponly', 'samesite'];
      for (const key of attrOrder) {
        if (cookie.attributes[key] !== undefined) {
          const val = cookie.attributes[key] === true ? '✓' : escapeHtml(String(cookie.attributes[key]));
          const displayKey = key.charAt(0).toUpperCase() + key.slice(1).replace('-', '-');
          html += `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
              <td style="padding: 0.5rem; font-weight: bold;">${displayKey}</td>
              <td style="padding: 0.5rem;">${val}</td>
            </tr>
          `;
        }
      }

      html += `
          </table>
        </div>
      `;
    });

    html += '</div>';

    cookieOutput.innerHTML = html;
    outputSection.style.display = 'block';
  }

  // Build cookie
  function buildCookie() {
    const name = cookieName.value.trim();
    const value = cookieValue.value.trim();

    if (!name) {
      showError('⚠️ Harap masukkan cookie name!');
      return;
    }

    if (!value) {
      showError('⚠️ Harap masukkan cookie value!');
      return;
    }

    let cookieString = `${name}=${value}`;

    // Path
    if (cookiePath.value.trim()) {
      cookieString += `; Path=${cookiePath.value.trim()}`;
    }

    // Domain
    if (cookieDomain.value.trim()) {
      cookieString += `; Domain=${cookieDomain.value.trim()}`;
    }

    // Max-Age
    if (cookieMaxAge.value) {
      cookieString += `; Max-Age=${cookieMaxAge.value}`;
    }

    // Expires
    if (cookieExpires.value) {
      const date = new Date(cookieExpires.value);
      cookieString += `; Expires=${date.toUTCString()}`;
    }

    // Secure
    if (cookieSecure.checked) {
      cookieString += `; Secure`;
    }

    // HttpOnly
    if (cookieHttpOnly.checked) {
      cookieString += `; HttpOnly`;
    }

    // SameSite
    if (cookieSameSite.value) {
      cookieString += `; SameSite=${cookieSameSite.value}`;
    }

    showBuiltCookie(cookieString);
  }

  // Show built cookie
  function showBuiltCookie(cookieString) {
    cookieOutput.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <strong>Set-Cookie Header:</strong>
      </div>
      <div class="code-block" style="word-break: break-all;">
        Set-Cookie: ${escapeHtml(cookieString)}
      </div>
      <div style="margin-top: 1rem;">
        <strong>JavaScript (document.cookie):</strong>
      </div>
      <div class="code-block" style="word-break: break-all;">
        document.cookie = "${escapeHtml(cookieString)}";
      </div>
    `;
    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    cookieOutput.innerHTML = `<div class="error-message">${message}</div>`;
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    cookieHeader.value = '';
    cookieName.value = '';
    cookieValue.value = '';
    cookiePath.value = '/';
    cookieDomain.value = '';
    cookieMaxAge.value = '';
    cookieExpires.value = '';
    cookieSecure.checked = false;
    cookieHttpOnly.checked = true;
    cookieSameSite.value = 'Strict';
    outputSection.style.display = 'none';
  }

  // Example parse
  function exampleParse() {
    container.querySelector('input[value="parse"]').checked = true;
    parseMode.style.display = 'block';
    buildMode.style.display = 'none';

    cookieHeader.value = `Set-Cookie: sessionid=abc123def456; Path=/; Domain=.example.com; Secure; HttpOnly; SameSite=Strict
Set-Cookie: token=xyz789; Path=/api; Max-Age=3600; Secure; HttpOnly
Set-Cookie: preferences=dark_mode; Path=/; Expires=Wed, 13 Nov 2026 12:00:00 GMT`;

    setTimeout(() => parseCookie(), 100);
  }

  // Example build
  function exampleBuild() {
    container.querySelector('input[value="build"]').checked = true;
    parseMode.style.display = 'none';
    buildMode.style.display = 'block';

    cookieName.value = 'sessionid';
    cookieValue.value = 'abc123def456ghi789';
    cookiePath.value = '/';
    cookieDomain.value = '.example.com';
    cookieMaxAge.value = '86400';
    cookieSecure.checked = true;
    cookieHttpOnly.checked = true;
    cookieSameSite.value = 'Strict';

    setTimeout(() => buildCookie(), 100);
  }

  // Copy to clipboard
  async function copyToClipboard() {
    const codeBlocks = cookieOutput.querySelectorAll('.code-block');
    if (codeBlocks.length === 0) return;

    try {
      let text = '';
      codeBlocks.forEach((block, index) => {
        if (index > 0) text += '\n\n';
        text += block.textContent.trim();
      });

      await navigator.clipboard.writeText(text);
      const originalText = btnCopy.innerHTML;
      btnCopy.innerHTML = '<i class="icon">✅</i> Copied!';
      setTimeout(() => {
        btnCopy.innerHTML = originalText;
      }, 2000);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnParse.addEventListener('click', parseCookie);
  btnBuild.addEventListener('click', buildCookie);
  btnClear.addEventListener('click', clearAll);
  btnExampleParse.addEventListener('click', exampleParse);
  btnExampleBuild.addEventListener('click', exampleBuild);
  btnCopy.addEventListener('click', copyToClipboard);

  // Enter key
  cookieHeader.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      parseCookie();
    }
  });
}
