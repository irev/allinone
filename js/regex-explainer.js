/**
 * Regex Explainer
 * Explain regex patterns, test matches, and visualize groups
 */

import { utils } from './main.js';

function initRegexExplainer() {
    return `
        <div class="tool-header">
            <h2>Regex Explainer & Tester</h2>
            <p>Understand regex patterns, test matches, and visualize capture groups</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Regex Pattern</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter Regular Expression</label>
                    <input 
                        type="text" 
                        id="regexPattern" 
                        class="form-control" 
                        placeholder="^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                        style="font-family: 'Courier New', monospace;"
                    />
                </div>
                
                <div class="form-group">
                    <label>Flags</label>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <label><input type="checkbox" id="flagG" checked> g (global)</label>
                        <label><input type="checkbox" id="flagI"> i (ignore case)</label>
                        <label><input type="checkbox" id="flagM"> m (multiline)</label>
                        <label><input type="checkbox" id="flagS"> s (dotAll)</label>
                        <label><input type="checkbox" id="flagU"> u (unicode)</label>
                    </div>
                </div>
                
                <div id="regexExplanation"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Test Input</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Test String</label>
                    <textarea 
                        id="testString" 
                        class="form-control" 
                        rows="6"
                        placeholder="Enter text to test against the regex pattern..."
                    ></textarea>
                </div>
                
                <button id="btnTestRegex" class="btn btn-primary">
                    🔍 Test Regex
                </button>
                
                <div id="regexResults" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Common Regex Patterns</h3>
            </div>
            <div class="card-body">
                <div id="commonPatterns"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 Regex Syntax Quick Reference</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div>
                    <strong>Character Classes:</strong>
                    <ul style="margin: 0.5rem 0; font-family: monospace; font-size: 0.9rem;">
                        <li>. - Any character</li>
                        <li>\\d - Digit [0-9]</li>
                        <li>\\w - Word [a-zA-Z0-9_]</li>
                        <li>\\s - Whitespace</li>
                    </ul>
                </div>
                <div>
                    <strong>Quantifiers:</strong>
                    <ul style="margin: 0.5rem 0; font-family: monospace; font-size: 0.9rem;">
                        <li>* - 0 or more</li>
                        <li>+ - 1 or more</li>
                        <li>? - 0 or 1</li>
                        <li>{n,m} - Between n and m</li>
                    </ul>
                </div>
                <div>
                    <strong>Anchors:</strong>
                    <ul style="margin: 0.5rem 0; font-family: monospace; font-size: 0.9rem;">
                        <li>^ - Start of string</li>
                        <li>$ - End of string</li>
                        <li>\\b - Word boundary</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

const commonPatterns = [
    { name: 'Email', pattern: '^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', test: 'user@example.com' },
    { name: 'URL', pattern: 'https?://[\\w\\-.]+(:\\d+)?(/[\\w\\-./?%&=]*)?', test: 'https://example.com/path' },
    { name: 'IPv4', pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b', test: '192.168.1.1' },
    { name: 'Phone (US)', pattern: '\\+?1?\\s*\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}', test: '+1-555-123-4567' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', test: '2025-11-13' },
    { name: 'Hex Color', pattern: '#[a-fA-F0-9]{6}\\b', test: '#3b82f6' },
    { name: 'MD5 Hash', pattern: '\\b[a-f0-9]{32}\\b', test: '5d41402abc4b2a76b9719d911017c592' },
    { name: 'Username', pattern: '^[a-zA-Z0-9_-]{3,16}$', test: 'user_name123' }
];

function explainRegex(pattern) {
    const explanations = [];
    
    // Anchors
    if (pattern.startsWith('^')) explanations.push('• <strong>^</strong> - Matches start of string');
    if (pattern.endsWith('$')) explanations.push('• <strong>$</strong> - Matches end of string');
    
    // Character classes
    if (pattern.includes('\\d')) explanations.push('• <strong>\\d</strong> - Matches any digit (0-9)');
    if (pattern.includes('\\w')) explanations.push('• <strong>\\w</strong> - Matches any word character (a-z, A-Z, 0-9, _)');
    if (pattern.includes('\\s')) explanations.push('• <strong>\\s</strong> - Matches any whitespace');
    if (pattern.includes('.')) explanations.push('• <strong>.</strong> - Matches any character (except newline)');
    
    // Quantifiers
    if (pattern.includes('*')) explanations.push('• <strong>*</strong> - Matches 0 or more times');
    if (pattern.includes('+')) explanations.push('• <strong>+</strong> - Matches 1 or more times');
    if (pattern.includes('?')) explanations.push('• <strong>?</strong> - Matches 0 or 1 time (optional)');
    if (/\{\d+,?\d*\}/.test(pattern)) explanations.push('• <strong>{n,m}</strong> - Matches between n and m times');
    
    // Groups
    if (pattern.includes('(')) explanations.push('• <strong>(...)</strong> - Capturing group');
    if (pattern.includes('[')) explanations.push('• <strong>[...]</strong> - Character set (matches any char inside)');
    
    // Special
    if (pattern.includes('|')) explanations.push('• <strong>|</strong> - OR operator (alternation)');
    if (pattern.includes('\\b')) explanations.push('• <strong>\\b</strong> - Word boundary');
    
    return explanations.length > 0 
        ? '<div class="alert alert-info"><strong>Pattern Components:</strong><br>' + explanations.join('<br>') + '</div>'
        : '<div class="alert alert-warning">Enter a regex pattern to see explanation</div>';
}

function testRegex() {
    const pattern = document.getElementById('regexPattern').value.trim();
    const testStr = document.getElementById('testString').value;
    const results = document.getElementById('regexResults');
    
    if (!pattern) {
        results.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a regex pattern</div>';
        return;
    }
    
    if (!testStr) {
        results.innerHTML = '<div class="alert alert-warning">⚠️ Please enter test string</div>';
        return;
    }
    
    try {
        const flags = getFlags();
        const regex = new RegExp(pattern, flags);
        
        let html = '';
        
        // Test if matches
        const matches = testStr.match(regex);
        
        if (matches) {
            html += '<div class="alert alert-success"><strong>✅ Pattern Matches!</strong></div>';
            
            // Show all matches
            const allMatches = testStr.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'));
            const matchArray = Array.from(allMatches);
            
            if (matchArray.length > 0) {
                html += '<div class="alert alert-info">';
                html += `<strong>Found ${matchArray.length} match(es):</strong><br>`;
                html += '<ol style="margin: 0.5rem 0;">';
                
                matchArray.forEach((match, i) => {
                    html += `<li><code>${escapeHtml(match[0])}</code>`;
                    
                    // Show capture groups
                    if (match.length > 1) {
                        html += ' <small>(Groups: ';
                        for (let j = 1; j < match.length; j++) {
                            html += `<code>${escapeHtml(match[j] || 'undefined')}</code>`;
                            if (j < match.length - 1) html += ', ';
                        }
                        html += ')</small>';
                    }
                    
                    html += `</li>`;
                });
                
                html += '</ol></div>';
            }
            
            // Highlight matches in original text
            const highlighted = highlightMatches(testStr, regex);
            html += '<div class="alert alert-secondary">';
            html += '<strong>Highlighted Text:</strong><br>';
            html += `<div style="background: #f9fafb; padding: 1rem; border-radius: 4px; margin-top: 0.5rem; white-space: pre-wrap; font-family: monospace;">${highlighted}</div>`;
            html += '</div>';
            
        } else {
            html += '<div class="alert alert-danger"><strong>❌ No Matches Found</strong></div>';
        }
        
        results.innerHTML = html;
        
    } catch (error) {
        results.innerHTML = `<div class="alert alert-danger"><strong>❌ Invalid Regex:</strong> ${escapeHtml(error.message)}</div>`;
    }
}

function getFlags() {
    let flags = '';
    if (document.getElementById('flagG').checked) flags += 'g';
    if (document.getElementById('flagI').checked) flags += 'i';
    if (document.getElementById('flagM').checked) flags += 'm';
    if (document.getElementById('flagS').checked) flags += 's';
    if (document.getElementById('flagU').checked) flags += 'u';
    return flags;
}

function highlightMatches(text, regex) {
    return text.replace(regex, match => `<mark style="background: #fef08a; padding: 2px 4px; border-radius: 2px; font-weight: 600;">${escapeHtml(match)}</mark>`);
}

function loadCommonPattern(pattern, test) {
    document.getElementById('regexPattern').value = pattern;
    document.getElementById('testString').value = test;
    updateExplanation();
    testRegex();
}

function displayCommonPatterns() {
    const container = document.getElementById('commonPatterns');
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    commonPatterns.forEach(p => {
        html += `
            <button class="btn btn-sm btn-secondary common-pattern-btn" style="text-align: left; justify-content: flex-start;">
                <strong>${p.name}:</strong> <code style="margin-left: 0.5rem;">${escapeHtml(p.pattern)}</code>
            </button>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add click handlers
    const buttons = container.querySelectorAll('.common-pattern-btn');
    buttons.forEach((btn, i) => {
        btn.addEventListener('click', () => loadCommonPattern(commonPatterns[i].pattern, commonPatterns[i].test));
    });
}

function updateExplanation() {
    const pattern = document.getElementById('regexPattern').value.trim();
    const explanation = document.getElementById('regexExplanation');
    
    if (pattern) {
        explanation.innerHTML = explainRegex(pattern);
        explanation.style.marginTop = '1rem';
    } else {
        explanation.innerHTML = '';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initRegexExplainer();
    
    setTimeout(() => {
        // Event listeners
        document.getElementById('btnTestRegex')?.addEventListener('click', testRegex);
        document.getElementById('regexPattern')?.addEventListener('input', updateExplanation);
        
        // Test on Enter key
        document.getElementById('testString')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                testRegex();
            }
        });
        
        // Display common patterns
        displayCommonPatterns();

        // Add copy/paste buttons to textarea
        const testString = document.getElementById('testString');
        if (testString) {
            utils.addTextareaActions(testString, {
                showCopy: true,
                showPaste: true
            });
        }
    }, 100);
}
