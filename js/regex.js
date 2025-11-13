/**
 * Regex Tester Tool
 * Test regular expressions with matches highlighting and capture groups
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>Regex Tester</h2>
      <p class="tool-description">
        Test regular expressions dengan highlighting matches, capture groups, dan replace preview.
        Support untuk multi-line dan global flags.
      </p>

      <!-- Regex Pattern -->
      <div class="input-group">
        <label for="regexPattern">
          <i class="icon">🎯</i> Regular Expression Pattern
        </label>
        <input 
          type="text" 
          id="regexPattern" 
          placeholder="\\d{3}-\\d{3}-\\d{4}"
          style="font-family: 'Courier New', monospace;"
        >
      </div>

      <!-- Regex Flags -->
      <div class="input-group">
        <label>
          <i class="icon">🚩</i> Flags
        </label>
        <div class="checkbox-group">
          <label class="checkbox-label" title="Global - find all matches">
            <input type="checkbox" id="flagGlobal" checked> g (global)
          </label>
          <label class="checkbox-label" title="Case insensitive">
            <input type="checkbox" id="flagIgnoreCase"> i (ignore case)
          </label>
          <label class="checkbox-label" title="Multi-line - ^ and $ match line breaks">
            <input type="checkbox" id="flagMultiline"> m (multiline)
          </label>
          <label class="checkbox-label" title="Dot matches newline">
            <input type="checkbox" id="flagDotAll"> s (dotAll)
          </label>
          <label class="checkbox-label" title="Unicode support">
            <input type="checkbox" id="flagUnicode"> u (unicode)
          </label>
        </div>
      </div>

      <!-- Test String -->
      <div class="input-group">
        <label for="testString">
          <i class="icon">📝</i> Test String
        </label>
        <textarea 
          id="testString" 
          placeholder="Enter text to test against the regex..."
          rows="8"
        ></textarea>
      </div>

      <!-- Replace Section -->
      <div class="input-group">
        <label for="replaceString">
          <i class="icon">🔄</i> Replace With (optional)
        </label>
        <input 
          type="text" 
          id="replaceString" 
          placeholder="Replacement text (use $1, $2 for capture groups)"
        >
        <small class="hint">💡 Use $1, $2, $& for backreferences</small>
      </div>

      <div class="button-group">
        <button id="btnTest" class="btn-primary">
          <i class="icon">▶️</i> Test Regex
        </button>
        <button id="btnClear" class="btn-secondary">
          <i class="icon">🗑️</i> Clear
        </button>
        <button id="btnExampleEmail" class="btn-secondary">
          💡 Email
        </button>
        <button id="btnExampleURL" class="btn-secondary">
          💡 URL
        </button>
        <button id="btnExamplePhone" class="btn-secondary">
          💡 Phone
        </button>
      </div>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">📊</i> Match Summary
        </label>
        <div id="matchSummary" class="output-content"></div>

        <label style="margin-top: 1rem;">
          <i class="icon">🎨</i> Highlighted Text
        </label>
        <div id="highlightedText" class="output-content"></div>

        <div id="captureGroupsSection" style="display: none;">
          <label style="margin-top: 1rem;">
            <i class="icon">📦</i> Capture Groups
          </label>
          <div id="captureGroups" class="output-content"></div>
        </div>

        <div id="replaceSection" style="display: none;">
          <label style="margin-top: 1rem;">
            <i class="icon">🔄</i> Replace Result
          </label>
          <div id="replaceResult" class="output-content"></div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Regex Quick Reference</h3>
        
        <h4>🎯 Character Classes:</h4>
        <ul style="font-family: 'Courier New', monospace; font-size: 0.9rem;">
          <li><code>\\d</code> - Digit (0-9)</li>
          <li><code>\\w</code> - Word character (a-z, A-Z, 0-9, _)</li>
          <li><code>\\s</code> - Whitespace (space, tab, newline)</li>
          <li><code>.</code> - Any character (except newline)</li>
          <li><code>[abc]</code> - Any of a, b, or c</li>
          <li><code>[^abc]</code> - Not a, b, or c</li>
          <li><code>[a-z]</code> - Any lowercase letter</li>
        </ul>

        <h4>🔢 Quantifiers:</h4>
        <ul style="font-family: 'Courier New', monospace; font-size: 0.9rem;">
          <li><code>*</code> - 0 or more</li>
          <li><code>+</code> - 1 or more</li>
          <li><code>?</code> - 0 or 1</li>
          <li><code>{n}</code> - Exactly n times</li>
          <li><code>{n,}</code> - n or more times</li>
          <li><code>{n,m}</code> - Between n and m times</li>
        </ul>

        <h4>📌 Anchors:</h4>
        <ul style="font-family: 'Courier New', monospace; font-size: 0.9rem;">
          <li><code>^</code> - Start of string/line</li>
          <li><code>$</code> - End of string/line</li>
          <li><code>\\b</code> - Word boundary</li>
          <li><code>\\B</code> - Not word boundary</li>
        </ul>

        <h4>📦 Groups:</h4>
        <ul style="font-family: 'Courier New', monospace; font-size: 0.9rem;">
          <li><code>(abc)</code> - Capture group</li>
          <li><code>(?:abc)</code> - Non-capturing group</li>
          <li><code>(a|b)</code> - Alternation (a or b)</li>
          <li><code>(?&lt;name&gt;abc)</code> - Named capture group</li>
        </ul>

        <h4>💡 Common Patterns:</h4>
        <ul style="font-family: 'Courier New', monospace; font-size: 0.9rem;">
          <li>Email: <code>[\\w.-]+@[\\w.-]+\\.\\w+</code></li>
          <li>URL: <code>https?://[^\\s]+</code></li>
          <li>Phone (US): <code>\\d{3}-\\d{3}-\\d{4}</code></li>
          <li>IPv4: <code>\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}</code></li>
          <li>Hex Color: <code>#[0-9a-fA-F]{6}</code></li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const regexPattern = container.querySelector('#regexPattern');
  const testString = container.querySelector('#testString');
  const replaceString = container.querySelector('#replaceString');
  const flagGlobal = container.querySelector('#flagGlobal');
  const flagIgnoreCase = container.querySelector('#flagIgnoreCase');
  const flagMultiline = container.querySelector('#flagMultiline');
  const flagDotAll = container.querySelector('#flagDotAll');
  const flagUnicode = container.querySelector('#flagUnicode');
  const btnTest = container.querySelector('#btnTest');
  const btnClear = container.querySelector('#btnClear');
  const btnExampleEmail = container.querySelector('#btnExampleEmail');
  const btnExampleURL = container.querySelector('#btnExampleURL');
  const btnExamplePhone = container.querySelector('#btnExamplePhone');
  const outputSection = container.querySelector('#outputSection');
  const matchSummary = container.querySelector('#matchSummary');
  const highlightedText = container.querySelector('#highlightedText');
  const captureGroupsSection = container.querySelector('#captureGroupsSection');
  const captureGroups = container.querySelector('#captureGroups');
  const replaceSection = container.querySelector('#replaceSection');
  const replaceResult = container.querySelector('#replaceResult');

  // Test regex
  function testRegex() {
    const pattern = regexPattern.value.trim();
    const text = testString.value;

    if (!pattern) {
      showError('⚠️ Harap masukkan regex pattern!');
      return;
    }

    if (!text) {
      showError('⚠️ Harap masukkan test string!');
      return;
    }

    try {
      // Build flags
      let flags = '';
      if (flagGlobal.checked) flags += 'g';
      if (flagIgnoreCase.checked) flags += 'i';
      if (flagMultiline.checked) flags += 'm';
      if (flagDotAll.checked) flags += 's';
      if (flagUnicode.checked) flags += 'u';

      // Create regex
      const regex = new RegExp(pattern, flags);

      // Find all matches
      const matches = [];
      let match;
      const regexGlobal = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

      while ((match = regexGlobal.exec(text)) !== null) {
        matches.push({
          fullMatch: match[0],
          index: match.index,
          groups: match.slice(1),
          namedGroups: match.groups || {}
        });
        
        // Prevent infinite loop on zero-length matches
        if (match.index === regexGlobal.lastIndex) {
          regexGlobal.lastIndex++;
        }
      }

      // Display results
      displayResults(regex, text, matches);

      // Replace if provided
      if (replaceString.value) {
        displayReplace(text, regex, replaceString.value);
      } else {
        replaceSection.style.display = 'none';
      }

    } catch (error) {
      showError(`❌ Regex error: ${error.message}`);
    }
  }

  // Display results
  function displayResults(regex, text, matches) {
    // Summary
    matchSummary.innerHTML = `
      <div style="padding: 1rem; background: rgba(0,255,0,0.1); border-radius: 8px;">
        <div style="font-size: 1.5rem; font-weight: bold; color: green; margin-bottom: 0.5rem;">
          ${matches.length} ${matches.length === 1 ? 'Match' : 'Matches'} Found
        </div>
        <div style="font-size: 0.9rem; opacity: 0.9;">
          Pattern: <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${escapeHtml(regex.source)}</code><br>
          Flags: <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${regex.flags || 'none'}</code>
        </div>
      </div>
    `;

    // Highlighted text
    if (matches.length > 0) {
      let highlighted = text;
      let offset = 0;

      matches.forEach((match, index) => {
        const start = match.index + offset;
        const end = start + match.fullMatch.length;
        const color = `hsl(${(index * 60) % 360}, 70%, 50%)`;
        
        const before = highlighted.substring(0, start);
        const matchText = highlighted.substring(start, end);
        const after = highlighted.substring(end);
        
        highlighted = before + 
          `<mark style="background: ${color}; color: black; padding: 0.1rem 0.2rem; border-radius: 2px;">${escapeHtml(matchText)}</mark>` + 
          after;
        
        offset += `<mark style="background: ${color}; color: black; padding: 0.1rem 0.2rem; border-radius: 2px;">`.length + '</mark>'.length;
      });

      highlightedText.innerHTML = `
        <div class="code-block" style="white-space: pre-wrap; word-break: break-word; line-height: 1.8;">
          ${highlighted}
        </div>
      `;
    } else {
      highlightedText.innerHTML = `
        <div class="code-block" style="white-space: pre-wrap; word-break: break-word;">
          ${escapeHtml(text)}
        </div>
      `;
    }

    // Capture groups
    if (matches.length > 0 && matches.some(m => m.groups.length > 0 || Object.keys(m.namedGroups).length > 0)) {
      let groupsHtml = '<div style="display: grid; gap: 1rem;">';

      matches.forEach((match, matchIndex) => {
        groupsHtml += `
          <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid var(--primary-color); border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">Match ${matchIndex + 1} at position ${match.index}</div>
            <div style="margin-bottom: 0.5rem;">
              <strong>Full match:</strong> <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${escapeHtml(match.fullMatch)}</code>
            </div>
        `;

        if (match.groups.length > 0) {
          groupsHtml += '<div style="margin-top: 0.5rem;"><strong>Groups:</strong><ul style="margin: 0.5rem 0; padding-left: 1.5rem;">';
          match.groups.forEach((group, groupIndex) => {
            if (group !== undefined) {
              groupsHtml += `<li>Group ${groupIndex + 1}: <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${escapeHtml(group)}</code></li>`;
            }
          });
          groupsHtml += '</ul></div>';
        }

        if (Object.keys(match.namedGroups).length > 0) {
          groupsHtml += '<div style="margin-top: 0.5rem;"><strong>Named Groups:</strong><ul style="margin: 0.5rem 0; padding-left: 1.5rem;">';
          for (const [name, value] of Object.entries(match.namedGroups)) {
            groupsHtml += `<li>${name}: <code style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 3px;">${escapeHtml(value)}</code></li>`;
          }
          groupsHtml += '</ul></div>';
        }

        groupsHtml += '</div>';
      });

      groupsHtml += '</div>';
      captureGroups.innerHTML = groupsHtml;
      captureGroupsSection.style.display = 'block';
    } else {
      captureGroupsSection.style.display = 'none';
    }

    outputSection.style.display = 'block';
  }

  // Display replace result
  function displayReplace(text, regex, replacement) {
    try {
      const result = text.replace(regex, replacement);
      
      replaceResult.innerHTML = `
        <div class="code-block" style="white-space: pre-wrap; word-break: break-word;">
          ${escapeHtml(result)}
        </div>
      `;
      replaceSection.style.display = 'block';
    } catch (error) {
      replaceResult.innerHTML = `<div class="error-message">Replace error: ${error.message}</div>`;
      replaceSection.style.display = 'block';
    }
  }

  // Show error
  function showError(message) {
    matchSummary.innerHTML = `<div class="error-message">${message}</div>`;
    highlightedText.innerHTML = '';
    captureGroupsSection.style.display = 'none';
    replaceSection.style.display = 'none';
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    regexPattern.value = '';
    testString.value = '';
    replaceString.value = '';
    flagGlobal.checked = true;
    flagIgnoreCase.checked = false;
    flagMultiline.checked = false;
    flagDotAll.checked = false;
    flagUnicode.checked = false;
    outputSection.style.display = 'none';
  }

  // Example: Email
  function loadExampleEmail() {
    regexPattern.value = '[\\w.-]+@[\\w.-]+\\.\\w+';
    testString.value = `Contact us at:
support@example.com
john.doe@company.co.uk
admin+test@subdomain.example.org
Invalid: @invalid.com, no-at-sign.com`;
    replaceString.value = '[REDACTED]';
    flagGlobal.checked = true;
    flagIgnoreCase.checked = true;
    setTimeout(() => testRegex(), 100);
  }

  // Example: URL
  function loadExampleURL() {
    regexPattern.value = 'https?://[^\\s]+';
    testString.value = `Visit our websites:
https://www.example.com
http://blog.example.com/post/123
https://api.example.com/v1/users?id=123&sort=desc
FTP links like ftp://files.example.com won't match`;
    replaceString.value = '<a href="$&">$&</a>';
    flagGlobal.checked = true;
    setTimeout(() => testRegex(), 100);
  }

  // Example: Phone
  function loadExamplePhone() {
    regexPattern.value = '(\\d{3})-(\\d{3})-(\\d{4})';
    testString.value = `Phone numbers:
123-456-7890
555-123-4567
800-555-0199
Invalid: 12-345-6789, 123-45-67890`;
    replaceString.value = '($1) $2-$3';
    flagGlobal.checked = true;
    setTimeout(() => testRegex(), 100);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnTest.addEventListener('click', testRegex);
  btnClear.addEventListener('click', clearAll);
  btnExampleEmail.addEventListener('click', loadExampleEmail);
  btnExampleURL.addEventListener('click', loadExampleURL);
  btnExamplePhone.addEventListener('click', loadExamplePhone);

  // Ctrl+Enter to test
  regexPattern.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      testRegex();
    }
  });

  testString.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      testRegex();
    }
  });
}
