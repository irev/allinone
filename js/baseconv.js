/**
 * Base Converters Tool
 * Convert between decimal, hex, base36, base62, and binary
 */

import { utils } from './main.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>Base Converters</h2>
      <p class="tool-description">
        Convert angka dan ID antara berbagai number bases: Decimal (base-10), Hexadecimal (base-16),
        Base36 (0-9, a-z), Base62 (0-9, a-z, A-Z), dan Binary (base-2). Berguna untuk token analysis dan ID encoding.
      </p>

      <!-- Input Section -->
      <div class="input-group">
        <label for="inputValue">
          <i class="icon">📥</i> Input Value
        </label>
        <input 
          type="text" 
          id="inputValue" 
          placeholder="Enter number or string..."
        >
      </div>

      <div class="input-group">
        <label for="inputBase">
          <i class="icon">🎯</i> Input Base
        </label>
        <select id="inputBase">
          <option value="10">Decimal (base-10)</option>
          <option value="16">Hexadecimal (base-16)</option>
          <option value="2">Binary (base-2)</option>
          <option value="8">Octal (base-8)</option>
          <option value="36">Base36 (0-9, a-z)</option>
          <option value="62">Base62 (0-9, a-z, A-Z)</option>
        </select>
      </div>

      <div class="button-group">
        <button id="btnConvert" class="btn-primary">
          <i class="icon">🔄</i> Convert All
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
          <i class="icon">🔢</i> Conversion Results
        </label>
        <div id="conversionResults" class="output-content"></div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang Number Bases</h3>
        
        <h4>🔢 Common Bases:</h4>
        <ul>
          <li><strong>Decimal (10):</strong> Standard 0-9, everyday numbers</li>
          <li><strong>Binary (2):</strong> 0-1, computer representation</li>
          <li><strong>Octal (8):</strong> 0-7, legacy systems, Unix permissions</li>
          <li><strong>Hexadecimal (16):</strong> 0-9, A-F, colors, memory addresses</li>
          <li><strong>Base36 (36):</strong> 0-9, a-z, case-insensitive short IDs</li>
          <li><strong>Base62 (62):</strong> 0-9, a-z, A-Z, URL-safe short IDs</li>
        </ul>

        <h4>🎯 Use Cases:</h4>
        <ul>
          <li><strong>Base36:</strong> YouTube video IDs, short URLs (case-insensitive)</li>
          <li><strong>Base62:</strong> Short URLs, database IDs, session tokens</li>
          <li><strong>Hexadecimal:</strong> Color codes (#FF5733), hashes, UUIDs</li>
          <li><strong>Binary:</strong> Permissions (755 = rwxr-xr-x), bitwise operations</li>
        </ul>

        <h4>💡 Examples:</h4>
        <ul>
          <li>Decimal 1234567890 = Hex 499602D2 = Base36 KF12OI</li>
          <li>Decimal 255 = Hex FF = Binary 11111111 = Octal 377</li>
          <li>YouTube ID "dQw4w9WgXcQ" (Base64-like) ≈ Base62 concept</li>
        </ul>

        <h4>⚙️ Conversion Tips:</h4>
        <ul>
          <li>Base36/62 case-sensitive atau insensitive tergantung implementasi</li>
          <li>JavaScript <code>parseInt(str, base)</code> & <code>num.toString(base)</code></li>
          <li>Max safe integer di JS: 2^53 - 1 (9007199254740991)</li>
          <li>Untuk angka lebih besar, gunakan BigInt</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const inputValue = container.querySelector('#inputValue');
  const inputBase = container.querySelector('#inputBase');
  const btnConvert = container.querySelector('#btnConvert');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const outputSection = container.querySelector('#outputSection');
  const conversionResults = container.querySelector('#conversionResults');

  // Base62 charset
  const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Convert to all bases
  function convertAll() {
    const value = inputValue.value.trim();
    const fromBase = parseInt(inputBase.value);

    if (!value) {
      showError('⚠️ Harap masukkan value untuk convert!');
      return;
    }

    try {
      let decimalValue;

      // Convert input to decimal first
      if (fromBase === 62) {
        decimalValue = base62ToDecimal(value);
      } else {
        decimalValue = parseInt(value, fromBase);
        if (isNaN(decimalValue)) {
          throw new Error('Invalid input for the selected base');
        }
      }

      // Check if within safe integer range
      if (decimalValue > Number.MAX_SAFE_INTEGER) {
        showError(`⚠️ Warning: Number exceeds JavaScript's safe integer range (${Number.MAX_SAFE_INTEGER}). Results may be inaccurate.`);
      }

      // Convert to all bases
      const results = {
        decimal: decimalValue.toString(10),
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        hex: decimalValue.toString(16).toUpperCase(),
        base36: decimalValue.toString(36).toUpperCase(),
        base62: decimalToBase62(decimalValue)
      };

      displayResults(results, decimalValue);

    } catch (error) {
      showError(`❌ Conversion error: ${error.message}`);
    }
  }

  // Base62 to Decimal
  function base62ToDecimal(str) {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const value = base62Chars.indexOf(char);
      if (value === -1) {
        throw new Error(`Invalid Base62 character: ${char}`);
      }
      result = result * 62 + value;
    }
    return result;
  }

  // Decimal to Base62
  function decimalToBase62(num) {
    if (num === 0) return '0';
    
    let result = '';
    while (num > 0) {
      result = base62Chars[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  // Display results
  function displayResults(results, decimalValue) {
    const bases = [
      { name: 'Decimal (Base-10)', value: results.decimal, key: 'decimal', description: 'Standard numeric representation' },
      { name: 'Binary (Base-2)', value: results.binary, key: 'binary', description: 'Computer binary representation' },
      { name: 'Octal (Base-8)', value: results.octal, key: 'octal', description: 'Octal representation (Unix permissions)' },
      { name: 'Hexadecimal (Base-16)', value: results.hex, key: 'hex', description: 'Hex (colors, memory addresses)' },
      { name: 'Base36 (0-9, a-z)', value: results.base36, key: 'base36', description: 'Case-insensitive alphanumeric' },
      { name: 'Base62 (0-9, a-z, A-Z)', value: results.base62, key: 'base62', description: 'Case-sensitive short IDs' }
    ];

    let html = '<div style="display: grid; gap: 1rem;">';

    bases.forEach((base, index) => {
      const isHighlighted = inputBase.value === (base.key === 'decimal' ? '10' : 
                                                  base.key === 'binary' ? '2' :
                                                  base.key === 'octal' ? '8' :
                                                  base.key === 'hex' ? '16' :
                                                  base.key === 'base36' ? '36' : '62');
      
      html += `
        <div style="padding: 1rem; background: ${isHighlighted ? 'rgba(0,188,212,0.2)' : 'rgba(255,255,255,0.05)'}; border-left: 3px solid ${isHighlighted ? '#00bcd4' : '#666'}; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: bold; color: var(--primary-color);">
              ${base.name}
              ${isHighlighted ? '<span style="font-size: 0.7rem; padding: 0.2rem 0.4rem; background: #00bcd4; color: black; border-radius: 3px; margin-left: 0.5rem;">INPUT</span>' : ''}
            </div>
          </div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.5rem;">${base.description}</div>
          <div class="baseconv-output code-block" style="font-size: 0.95rem; word-break: break-all; font-family: 'Courier New', monospace;" data-copy-value="${escapeAttr(base.value)}">
            ${escapeHtml(base.value)}
          </div>
          <div style="font-size: 0.75rem; opacity: 0.6; margin-top: 0.5rem;">
            Length: ${base.value.length} characters
          </div>
        </div>
      `;
    });

    html += '</div>';

    // Additional info
    html += `
      <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(100,100,100,0.2); border-radius: 8px;">
        <h4 style="margin: 0 0 0.5rem 0;">📊 Additional Info</h4>
        <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.9rem;">
          <li>Decimal value: ${decimalValue.toLocaleString()}</li>
          <li>Scientific notation: ${decimalValue.toExponential(2)}</li>
          <li>Binary length: ${results.binary.length} bits</li>
          <li>Hex prefix notation: 0x${results.hex}</li>
          ${decimalValue <= Number.MAX_SAFE_INTEGER ? 
            '<li style="color: green;">✓ Within safe integer range</li>' : 
            '<li style="color: orange;">⚠️ Exceeds safe integer range</li>'}
        </ul>
      </div>
    `;

    conversionResults.innerHTML = html;
    outputSection.style.display = 'block';

    // Add copy buttons to all outputs
    const outputs = container.querySelectorAll('.baseconv-output');
    outputs.forEach(output => {
      const copyValue = output.getAttribute('data-copy-value');
      if (copyValue) {
        // Create temporary element with the value to copy
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.width = '100%';
        
        output.parentNode.insertBefore(wrapper, output);
        wrapper.appendChild(output);
        
        utils.addCopyToOutput(output, copyValue);
      }
    });
  }

  // Show error
  function showError(message) {
    conversionResults.innerHTML = `<div class="error-message">${message}</div>`;
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    inputValue.value = '';
    inputBase.value = '10';
    outputSection.style.display = 'none';
  }

  // Load example
  function loadExample() {
    inputValue.value = '1234567890';
    inputBase.value = '10';
    setTimeout(() => convertAll(), 100);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Helper: Escape attribute
  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Event Listeners
  btnConvert.addEventListener('click', convertAll);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExample);

  // Enter key to convert
  inputValue.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      convertAll();
    }
  });

  // Make info sections collapsible
  setTimeout(() => {
    utils.initAllCollapsibles(container);
  }, 100);
}
