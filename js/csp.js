/**
 * CSP (Content Security Policy) Analyzer Tool
 * Parse and visualize CSP directives with security warnings
 */

import { utils } from './main.js';

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>CSP Analyzer</h2>
      <p class="tool-description">
        Parse dan visualisasi Content-Security-Policy header. Deteksi unsafe directives,
        weak configurations, dan berikan rekomendasi untuk CSP yang lebih secure.
      </p>

      <!-- Input Section -->
      <div class="input-group">
        <label for="cspInput">
          <i class="icon">📥</i> Content-Security-Policy
        </label>
        <textarea 
          id="cspInput" 
          placeholder="Paste CSP header value di sini...&#10;&#10;Contoh:&#10;default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src * data:; font-src 'self' data:; object-src 'none'"
          rows="6"
        ></textarea>
      </div>

      <div class="button-group">
        <button id="btnAnalyze" class="btn-primary">
          <i class="icon">🔍</i> Analyze CSP
        </button>
        <button id="btnClear" class="btn-secondary">
          <i class="icon">🗑️</i> Clear
        </button>
        <button id="btnExampleStrict" class="btn-secondary">
          💡 Strict CSP
        </button>
        <button id="btnExampleWeak" class="btn-secondary">
          ⚠️ Weak CSP
        </button>
      </div>

      <!-- Output Section -->
      <div class="output-group" id="outputSection" style="display: none;">
        <label>
          <i class="icon">📊</i> Security Rating
        </label>
        <div id="securityRating" class="output-content"></div>
        
        <label style="margin-top: 1rem;">
          <i class="icon">📋</i> Directives Analysis
        </label>
        <div id="directivesAnalysis" class="output-content"></div>

        <label style="margin-top: 1rem;">
          <i class="icon">⚠️</i> Security Warnings
        </label>
        <div id="warningsSection" class="output-content"></div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang CSP</h3>
        <p><strong>Content Security Policy (CSP)</strong> adalah security layer untuk mendeteksi dan mitigasi attacks seperti XSS dan data injection.</p>
        
        <h4>🎯 Key Directives:</h4>
        <ul>
          <li><strong>default-src:</strong> Fallback untuk semua -src directives</li>
          <li><strong>script-src:</strong> Control JavaScript sources</li>
          <li><strong>style-src:</strong> Control CSS sources</li>
          <li><strong>img-src:</strong> Control image sources</li>
          <li><strong>connect-src:</strong> Control AJAX, WebSocket, EventSource</li>
          <li><strong>font-src:</strong> Control font sources</li>
          <li><strong>object-src:</strong> Control plugins (Flash, etc.)</li>
          <li><strong>frame-src:</strong> Control iframe sources</li>
        </ul>

        <h4>⚠️ Unsafe Keywords:</h4>
        <ul>
          <li><code>'unsafe-inline'</code> - Allows inline scripts/styles (XSS risk)</li>
          <li><code>'unsafe-eval'</code> - Allows eval() and similar (code injection risk)</li>
          <li><code>'unsafe-hashes'</code> - Allows event handlers with hashes</li>
          <li><code>*</code> - Allows all sources (too permissive)</li>
        </ul>

        <h4>💡 Best Practices:</h4>
        <ul>
          <li>Start with <code>default-src 'self'</code></li>
          <li>Avoid <code>'unsafe-inline'</code> - use nonces or hashes</li>
          <li>Set <code>object-src 'none'</code> to block plugins</li>
          <li>Use <code>base-uri 'self'</code> to prevent base tag injection</li>
          <li>Add <code>form-action 'self'</code> to restrict form submissions</li>
          <li>Test with <code>Content-Security-Policy-Report-Only</code> first</li>
        </ul>

        <h4>🔧 CSP Level Support:</h4>
        <ul>
          <li><strong>CSP 1:</strong> Basic directives (all modern browsers)</li>
          <li><strong>CSP 2:</strong> Nonces, hashes, 'strict-dynamic'</li>
          <li><strong>CSP 3:</strong> 'unsafe-hashes', sources in workers</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const cspInput = container.querySelector('#cspInput');
  const btnAnalyze = container.querySelector('#btnAnalyze');
  const btnClear = container.querySelector('#btnClear');
  const btnExampleStrict = container.querySelector('#btnExampleStrict');
  const btnExampleWeak = container.querySelector('#btnExampleWeak');
  const outputSection = container.querySelector('#outputSection');
  const securityRating = container.querySelector('#securityRating');
  const directivesAnalysis = container.querySelector('#directivesAnalysis');
  const warningsSection = container.querySelector('#warningsSection');

  // CSP Directive definitions
  const directiveInfo = {
    'default-src': { name: 'default-src', description: 'Fallback for all fetch directives', critical: true },
    'script-src': { name: 'script-src', description: 'JavaScript sources', critical: true },
    'style-src': { name: 'style-src', description: 'CSS sources', critical: false },
    'img-src': { name: 'img-src', description: 'Image sources', critical: false },
    'connect-src': { name: 'connect-src', description: 'AJAX, WebSocket, EventSource', critical: false },
    'font-src': { name: 'font-src', description: 'Font sources', critical: false },
    'object-src': { name: 'object-src', description: 'Plugins (Flash, etc.)', critical: true },
    'media-src': { name: 'media-src', description: 'Audio/video sources', critical: false },
    'frame-src': { name: 'frame-src', description: 'Iframe sources', critical: true },
    'child-src': { name: 'child-src', description: 'Web workers, iframes (deprecated)', critical: false },
    'base-uri': { name: 'base-uri', description: 'Base element URLs', critical: true },
    'form-action': { name: 'form-action', description: 'Form submission targets', critical: true },
    'frame-ancestors': { name: 'frame-ancestors', description: 'Valid parents for embedding', critical: true },
    'worker-src': { name: 'worker-src', description: 'Worker sources', critical: false },
    'manifest-src': { name: 'manifest-src', description: 'Manifest sources', critical: false }
  };

  // Analyze CSP
  function analyzeCSP() {
    const input = cspInput.value.trim();
    if (!input) {
      showError('⚠️ Harap masukkan CSP header value!');
      return;
    }

    try {
      // Parse CSP
      const directives = parseCSP(input);
      
      // Analyze security
      const analysis = analyzeSecurityIssues(directives);
      
      // Display results
      displayResults(directives, analysis);
    } catch (error) {
      showError(`❌ Error: ${error.message}`);
    }
  }

  // Parse CSP string
  function parseCSP(csp) {
    const directives = new Map();
    
    // Remove "Content-Security-Policy:" prefix if exists
    csp = csp.replace(/^Content-Security-Policy:\s*/i, '');
    
    // Split by semicolon
    const parts = csp.split(';').map(p => p.trim()).filter(p => p);
    
    for (const part of parts) {
      const tokens = part.split(/\s+/);
      if (tokens.length === 0) continue;
      
      const directive = tokens[0];
      const sources = tokens.slice(1);
      
      directives.set(directive, sources);
    }
    
    return directives;
  }

  // Analyze security issues
  function analyzeSecurityIssues(directives) {
    const warnings = [];
    const recommendations = [];
    let score = 100;

    // Check for unsafe-inline
    for (const [directive, sources] of directives) {
      if (sources.includes("'unsafe-inline'")) {
        warnings.push({
          severity: 'high',
          directive,
          message: `'unsafe-inline' in ${directive} allows inline scripts/styles (XSS risk)`,
          recommendation: 'Use nonces or hashes instead of unsafe-inline'
        });
        score -= 15;
      }
      
      if (sources.includes("'unsafe-eval'")) {
        warnings.push({
          severity: 'high',
          directive,
          message: `'unsafe-eval' in ${directive} allows eval() (code injection risk)`,
          recommendation: 'Remove unsafe-eval and refactor code to avoid eval()'
        });
        score -= 15;
      }
      
      if (sources.includes('*')) {
        warnings.push({
          severity: 'medium',
          directive,
          message: `Wildcard (*) in ${directive} allows all sources (too permissive)`,
          recommendation: 'Specify explicit domains instead of wildcard'
        });
        score -= 10;
      }

      // Check for data: URIs in script-src
      if (directive === 'script-src' && sources.includes('data:')) {
        warnings.push({
          severity: 'high',
          directive,
          message: 'data: URIs in script-src allow arbitrary scripts (XSS risk)',
          recommendation: 'Remove data: from script-src'
        });
        score -= 10;
      }
    }

    // Check missing critical directives
    if (!directives.has('default-src')) {
      recommendations.push({
        severity: 'medium',
        message: 'default-src not set - should be fallback for all directives',
        recommendation: "Add: default-src 'self'"
      });
      score -= 10;
    }

    if (!directives.has('object-src')) {
      recommendations.push({
        severity: 'medium',
        message: 'object-src not set - plugins might be allowed',
        recommendation: "Add: object-src 'none'"
      });
      score -= 5;
    }

    if (!directives.has('base-uri')) {
      recommendations.push({
        severity: 'low',
        message: 'base-uri not set - base tag injection possible',
        recommendation: "Add: base-uri 'self'"
      });
      score -= 5;
    }

    if (!directives.has('form-action')) {
      recommendations.push({
        severity: 'low',
        message: 'form-action not set - forms can submit to any URL',
        recommendation: "Add: form-action 'self'"
      });
      score -= 5;
    }

    // Ensure score doesn't go negative
    score = Math.max(0, score);

    return { warnings, recommendations, score };
  }

  // Display results
  function displayResults(directives, analysis) {
    // Security Rating
    let ratingColor = 'red';
    let ratingLabel = 'Weak';
    if (analysis.score >= 85) {
      ratingColor = 'green';
      ratingLabel = 'Excellent';
    } else if (analysis.score >= 70) {
      ratingColor = 'lightgreen';
      ratingLabel = 'Good';
    } else if (analysis.score >= 50) {
      ratingColor = 'orange';
      ratingLabel = 'Fair';
    }

    securityRating.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; font-weight: bold; color: ${ratingColor};">
          ${analysis.score}%
        </div>
        <div style="font-size: 1.2rem; margin-top: 0.5rem;">
          Security Rating: ${ratingLabel}
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
          ${directives.size} directives • ${analysis.warnings.length} warnings • ${analysis.recommendations.length} recommendations
        </div>
      </div>
    `;

    // Directives Analysis
    let directivesHtml = '<div style="display: grid; gap: 1rem;">';
    
    for (const [directive, sources] of directives) {
      const info = directiveInfo[directive] || { name: directive, description: 'Unknown directive', critical: false };
      const isCritical = info.critical;
      
      directivesHtml += `
        <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-left: 3px solid ${isCritical ? '#00bcd4' : '#666'}; border-radius: 4px;">
          <div style="font-weight: bold; margin-bottom: 0.5rem;">
            ${directive}
            ${isCritical ? '<span style="font-size: 0.7rem; padding: 0.2rem 0.4rem; background: #00bcd4; color: black; border-radius: 3px; margin-left: 0.5rem;">CRITICAL</span>' : ''}
          </div>
          <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 0.5rem;">${info.description}</div>
          <div class="code-block" style="font-size: 0.85rem;">
            ${sources.map(s => escapeHtml(s)).join(' ')}
          </div>
        </div>
      `;
    }
    
    directivesHtml += '</div>';
    directivesAnalysis.innerHTML = directivesHtml;

    // Warnings Section
    let warningsHtml = '';
    
    if (analysis.warnings.length > 0) {
      warningsHtml += '<div style="margin-bottom: 1.5rem;"><h4 style="color: orange; margin-bottom: 0.5rem;">⚠️ Security Warnings</h4>';
      analysis.warnings.forEach(warning => {
        const color = warning.severity === 'high' ? 'red' : 'orange';
        warningsHtml += `
          <div style="margin: 0.5rem 0; padding: 0.75rem; background: rgba(255,0,0,0.1); border-left: 3px solid ${color}; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 0.25rem;">
              ${warning.directive}: ${warning.message}
            </div>
            <div style="font-size: 0.85rem; color: lightblue;">
              💡 ${warning.recommendation}
            </div>
          </div>
        `;
      });
      warningsHtml += '</div>';
    }

    if (analysis.recommendations.length > 0) {
      warningsHtml += '<div><h4 style="color: yellow; margin-bottom: 0.5rem;">💡 Recommendations</h4>';
      analysis.recommendations.forEach(rec => {
        warningsHtml += `
          <div style="margin: 0.5rem 0; padding: 0.75rem; background: rgba(255,255,0,0.1); border-left: 3px solid yellow; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 0.25rem;">
              ${rec.message}
            </div>
            <div style="font-size: 0.85rem; color: lightblue;">
              💡 ${rec.recommendation}
            </div>
          </div>
        `;
      });
      warningsHtml += '</div>';
    }

    if (analysis.warnings.length === 0 && analysis.recommendations.length === 0) {
      warningsHtml = '<div style="text-align: center; padding: 2rem; color: green;">✅ No security issues detected! Great CSP configuration.</div>';
    }

    warningsSection.innerHTML = warningsHtml;
    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    securityRating.innerHTML = `<div class="error-message">${message}</div>`;
    directivesAnalysis.innerHTML = '';
    warningsSection.innerHTML = '';
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    cspInput.value = '';
    outputSection.style.display = 'none';
  }

  // Example: Strict CSP
  function loadExampleStrict() {
    cspInput.value = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests";
    setTimeout(() => analyzeCSP(), 100);
  }

  // Example: Weak CSP
  function loadExampleWeak() {
    cspInput.value = "default-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: data:; style-src 'self' 'unsafe-inline' *; img-src * data: blob:";
    setTimeout(() => analyzeCSP(), 100);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnAnalyze.addEventListener('click', analyzeCSP);
  btnClear.addEventListener('click', clearAll);
  btnExampleStrict.addEventListener('click', loadExampleStrict);
  btnExampleWeak.addEventListener('click', loadExampleWeak);

  // Ctrl+Enter to analyze
  cspInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      analyzeCSP();
    }
  });

  // Add copy/paste buttons to textarea
  setTimeout(() => {
    utils.addTextareaActions(cspInput, {
      showCopy: true,
      showPaste: true
    });

    // Make info alerts collapsible
    utils.initAllCollapsibles(container);
  }, 100);
}
