/**
 * SRI (Subresource Integrity) Generator Tool
 * Generate integrity hashes for external resources (scripts, stylesheets)
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>SRI Generator</h2>
      <p class="tool-description">
        Generate Subresource Integrity (SRI) hashes untuk memverifikasi bahwa external resources tidak dimodifikasi.
        Lindungi aplikasi dari CDN compromise dan tampering attacks.
      </p>

      <!-- Input Method Selection -->
      <div class="input-group">
        <label>
          <i class="icon">📥</i> Input Method
        </label>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="inputMethod" value="text" checked>
            Text/Code
          </label>
          <label class="radio-label">
            <input type="radio" name="inputMethod" value="url">
            URL (CORS-enabled only)
          </label>
        </div>
      </div>

      <!-- Text Input -->
      <div class="input-group" id="textInputGroup">
        <label for="sriText">
          <i class="icon">📝</i> Resource Content
        </label>
        <textarea 
          id="sriText" 
          placeholder="Paste kode JavaScript atau CSS di sini..."
          rows="8"
        ></textarea>
      </div>

      <!-- URL Input -->
      <div class="input-group" id="urlInputGroup" style="display: none;">
        <label for="sriUrl">
          <i class="icon">🔗</i> Resource URL
        </label>
        <input 
          type="url" 
          id="sriUrl" 
          placeholder="https://cdn.example.com/library.min.js"
        />
        <small class="hint">⚠️ URL harus CORS-enabled. Banyak CDN memblokir cross-origin fetch.</small>
      </div>

      <!-- Algorithm Selection -->
      <div class="input-group">
        <label for="sriAlgorithm">
          <i class="icon">🔐</i> Hash Algorithm
        </label>
        <select id="sriAlgorithm">
          <option value="SHA-384">SHA-384 (Recommended)</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>

      <div class="button-group">
        <button id="btnGenerate" class="btn-primary">
          <i class="icon">⚡</i> Generate SRI Hash
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
          <i class="icon">✅</i> SRI Hash
        </label>
        <div class="output-box">
          <div id="sriOutput" class="output-content"></div>
          <button id="btnCopy" class="btn-copy">
            <i class="icon">📋</i> Copy
          </button>
        </div>

        <label>
          <i class="icon">🔖</i> HTML Tag Examples
        </label>
        <div class="output-box">
          <div id="htmlExamples" class="output-content"></div>
          <button id="btnCopyHtml" class="btn-copy">
            <i class="icon">📋</i> Copy
          </button>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang SRI</h3>
        <p><strong>Subresource Integrity (SRI)</strong> adalah security feature untuk memverifikasi bahwa resources dari CDN tidak dimodifikasi (tampered).</p>
        
        <h4>🎯 Use Cases:</h4>
        <ul>
          <li><strong>CDN Security:</strong> Verifikasi jQuery, Bootstrap, libraries dari CDN</li>
          <li><strong>Third-party Scripts:</strong> Analytics, ads, widgets</li>
          <li><strong>Stylesheets:</strong> External CSS files</li>
          <li><strong>Compliance:</strong> Security policies & best practices</li>
        </ul>

        <h4>🔐 Algorithms:</h4>
        <ul>
          <li><strong>SHA-384:</strong> Recommended by W3C (balance security & performance)</li>
          <li><strong>SHA-256:</strong> Faster, good for smaller files</li>
          <li><strong>SHA-512:</strong> Maximum security, slightly larger hash</li>
        </ul>

        <h4>💡 Tips:</h4>
        <ul>
          <li>Browser akan memblokir resource jika hash tidak match</li>
          <li>Update hash setiap kali file berubah (major updates)</li>
          <li>Gunakan <code>crossorigin="anonymous"</code> attribute</li>
          <li>SRI tidak bekerja untuk same-origin resources</li>
        </ul>

        <h4>📖 Browser Support:</h4>
        <p>✅ Chrome 45+, Firefox 43+, Safari 11.1+, Edge 17+</p>
      </div>
    </div>
  `;

  // DOM Elements
  const textInputGroup = container.querySelector('#textInputGroup');
  const urlInputGroup = container.querySelector('#urlInputGroup');
  const sriText = container.querySelector('#sriText');
  const sriUrl = container.querySelector('#sriUrl');
  const algorithmSelect = container.querySelector('#sriAlgorithm');
  const btnGenerate = container.querySelector('#btnGenerate');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const btnCopy = container.querySelector('#btnCopy');
  const btnCopyHtml = container.querySelector('#btnCopyHtml');
  const outputSection = container.querySelector('#outputSection');
  const sriOutput = container.querySelector('#sriOutput');
  const htmlExamples = container.querySelector('#htmlExamples');

  // Input method radio buttons
  const radioButtons = container.querySelectorAll('input[name="inputMethod"]');

  // Toggle input method
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'text') {
        textInputGroup.style.display = 'block';
        urlInputGroup.style.display = 'none';
      } else {
        textInputGroup.style.display = 'none';
        urlInputGroup.style.display = 'block';
      }
    });
  });

  // Generate SRI
  async function generateSRI() {
    const method = container.querySelector('input[name="inputMethod"]:checked').value;
    const algorithm = algorithmSelect.value;

    let content;

    if (method === 'text') {
      content = sriText.value.trim();
      if (!content) {
        showError('⚠️ Harap masukkan resource content!');
        return;
      }
    } else {
      const url = sriUrl.value.trim();
      if (!url) {
        showError('⚠️ Harap masukkan URL!');
        return;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        content = await response.text();
      } catch (error) {
        showError(`❌ Fetch error: ${error.message}<br><small>Pastikan URL CORS-enabled atau gunakan input Text.</small>`);
        return;
      }
    }

    try {
      // Generate hash
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);

      // Convert to base64
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashBase64 = btoa(String.fromCharCode(...hashArray));

      // Format integrity attribute
      const algorithmLower = algorithm.toLowerCase().replace('-', '');
      const integrity = `${algorithmLower}-${hashBase64}`;

      showOutput(integrity, algorithm, content.length);
    } catch (error) {
      showError(`❌ Error: ${error.message}`);
    }
  }

  // Show output
  function showOutput(integrity, algorithm, contentLength) {
    sriOutput.innerHTML = `
      <div style="margin-bottom: 0.5rem;">
        <strong>Algorithm:</strong> ${algorithm}<br>
        <strong>Content Size:</strong> ${contentLength.toLocaleString()} bytes<br>
        <strong>Hash Length:</strong> ${integrity.split('-')[1].length} characters
      </div>
      <div class="code-block" style="word-break: break-all;">
        ${integrity}
      </div>
    `;

    // Generate HTML examples
    const scriptExample = `&lt;script 
  src="https://cdn.example.com/library.min.js"
  integrity="${integrity}"
  crossorigin="anonymous"
&gt;&lt;/script&gt;`;

    const linkExample = `&lt;link 
  rel="stylesheet" 
  href="https://cdn.example.com/style.min.css"
  integrity="${integrity}"
  crossorigin="anonymous"
/&gt;`;

    htmlExamples.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <strong>📜 JavaScript:</strong>
        <div class="code-block" style="margin-top: 0.5rem;">
          ${scriptExample}
        </div>
      </div>
      <div>
        <strong>🎨 CSS:</strong>
        <div class="code-block" style="margin-top: 0.5rem;">
          ${linkExample}
        </div>
      </div>
    `;

    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    sriOutput.innerHTML = `<div class="error-message">${message}</div>`;
    htmlExamples.innerHTML = '';
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    sriText.value = '';
    sriUrl.value = '';
    algorithmSelect.value = 'SHA-384';
    outputSection.style.display = 'none';
    sriOutput.textContent = '';
    htmlExamples.textContent = '';
  }

  // Load example
  function loadExample() {
    container.querySelector('input[value="text"]').checked = true;
    textInputGroup.style.display = 'block';
    urlInputGroup.style.display = 'none';

    sriText.value = `/*!
 * Bootstrap v5.3.0 (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap=e()}(this,(function(){"use strict";const t="transitionend";return{t:t}}));`;

    algorithmSelect.value = 'SHA-384';

    // Auto-generate
    setTimeout(() => generateSRI(), 100);
  }

  // Copy to clipboard
  async function copyToClipboard(element) {
    const codeBlock = element.parentElement.querySelector('.code-block');
    if (!codeBlock) return;

    try {
      const text = codeBlock.textContent.trim();
      await navigator.clipboard.writeText(text);
      const originalText = element.innerHTML;
      element.innerHTML = '<i class="icon">✅</i> Copied!';
      setTimeout(() => {
        element.innerHTML = originalText;
      }, 2000);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  }

  // Event Listeners
  btnGenerate.addEventListener('click', generateSRI);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExample);
  btnCopy.addEventListener('click', () => copyToClipboard(btnCopy));
  btnCopyHtml.addEventListener('click', () => copyToClipboard(btnCopyHtml));

  // Enter key to generate
  sriUrl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      generateSRI();
    }
  });
}
