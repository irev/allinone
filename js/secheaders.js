/**
 * Security Headers Checker Tool
 * Analyze HTTP security headers and provide recommendations
 */

export function render(container) {
  container.innerHTML = `
    <div class="tool-section">
      <h2>Security Headers Checker</h2>
      <p class="tool-description">
        Analisa HTTP security headers untuk menemukan kelemahan konfigurasi keamanan.
        Check CSP, HSTS, X-Frame-Options, dan headers penting lainnya.
      </p>

      <!-- Input Section -->
      <div class="input-group">
        <label for="headersInput">
          <i class="icon">📥</i> Response Headers
        </label>
        <textarea 
          id="headersInput" 
          placeholder="Paste response headers di sini (dari DevTools Network tab atau curl -I)&#10;&#10;Contoh:&#10;Content-Security-Policy: default-src 'self'&#10;Strict-Transport-Security: max-age=31536000&#10;X-Frame-Options: DENY&#10;X-Content-Type-Options: nosniff&#10;Referrer-Policy: no-referrer"
          rows="10"
        ></textarea>
        <small class="hint">💡 Tip: Buka DevTools → Network → pilih request → lihat Response Headers, lalu copy paste.</small>
      </div>

      <div class="button-group">
        <button id="btnCheck" class="btn-primary">
          <i class="icon">🔍</i> Check Headers
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
          <i class="icon">📊</i> Security Analysis
        </label>
        <div id="securityScore" class="output-content"></div>
        
        <label style="margin-top: 1rem;">
          <i class="icon">📋</i> Headers Report
        </label>
        <div id="headersReport" class="output-content"></div>
      </div>

      <!-- Info Section -->
      <div class="info-box">
        <h3>📚 Tentang Security Headers</h3>
        <p><strong>HTTP Security Headers</strong> adalah response headers yang memberikan proteksi tambahan terhadap common web vulnerabilities.</p>
        
        <h4>🔐 Important Headers:</h4>
        <ul>
          <li><strong>Content-Security-Policy (CSP):</strong> Mencegah XSS, clickjacking, code injection</li>
          <li><strong>Strict-Transport-Security (HSTS):</strong> Enforce HTTPS connections</li>
          <li><strong>X-Frame-Options:</strong> Clickjacking protection</li>
          <li><strong>X-Content-Type-Options:</strong> Prevent MIME-sniffing attacks</li>
          <li><strong>Referrer-Policy:</strong> Control referrer information leakage</li>
          <li><strong>Permissions-Policy:</strong> Control browser features (camera, mic, etc.)</li>
        </ul>

        <h4>💡 Best Practices:</h4>
        <ul>
          <li>Implementasikan semua recommended security headers</li>
          <li>Test CSP dengan report-only mode sebelum enforce</li>
          <li>Gunakan HSTS dengan <code>includeSubDomains</code> dan <code>preload</code></li>
          <li>Regular audit dan update header configurations</li>
        </ul>

        <h4>🧪 Testing Tools:</h4>
        <ul>
          <li><a href="https://securityheaders.com" target="_blank">securityheaders.com</a> - Online scanner</li>
          <li><a href="https://observatory.mozilla.org" target="_blank">Mozilla Observatory</a> - Comprehensive analysis</li>
        </ul>
      </div>
    </div>
  `;

  // DOM Elements
  const headersInput = container.querySelector('#headersInput');
  const btnCheck = container.querySelector('#btnCheck');
  const btnClear = container.querySelector('#btnClear');
  const btnExample = container.querySelector('#btnExample');
  const outputSection = container.querySelector('#outputSection');
  const securityScore = container.querySelector('#securityScore');
  const headersReport = container.querySelector('#headersReport');

  // Security header definitions
  const securityHeaders = {
    'content-security-policy': {
      name: 'Content-Security-Policy',
      severity: 'critical',
      description: 'Mencegah XSS dan code injection attacks',
      recommendation: "Gunakan CSP strict: default-src 'self'; script-src 'self'; object-src 'none'"
    },
    'strict-transport-security': {
      name: 'Strict-Transport-Security',
      severity: 'critical',
      description: 'Enforce HTTPS connections',
      recommendation: 'Gunakan: max-age=31536000; includeSubDomains; preload'
    },
    'x-frame-options': {
      name: 'X-Frame-Options',
      severity: 'high',
      description: 'Clickjacking protection',
      recommendation: "Gunakan: DENY atau SAMEORIGIN"
    },
    'x-content-type-options': {
      name: 'X-Content-Type-Options',
      severity: 'high',
      description: 'Prevent MIME-sniffing',
      recommendation: 'Gunakan: nosniff'
    },
    'referrer-policy': {
      name: 'Referrer-Policy',
      severity: 'medium',
      description: 'Control referrer information',
      recommendation: 'Gunakan: no-referrer atau strict-origin-when-cross-origin'
    },
    'permissions-policy': {
      name: 'Permissions-Policy',
      severity: 'medium',
      description: 'Control browser features',
      recommendation: 'Gunakan: camera=(), microphone=(), geolocation=()'
    },
    'x-xss-protection': {
      name: 'X-XSS-Protection',
      severity: 'low',
      description: 'Legacy XSS filter (deprecated, gunakan CSP)',
      recommendation: 'Gunakan: 1; mode=block (atau hapus jika CSP sudah ada)'
    }
  };

  // Check headers
  function checkHeaders() {
    const input = headersInput.value.trim();
    if (!input) {
      showError('⚠️ Harap masukkan response headers!');
      return;
    }

    try {
      // Parse headers
      const headers = parseHeaders(input);
      
      // Analyze security
      const analysis = analyzeSecurityHeaders(headers);
      
      // Display results
      displayResults(analysis);
    } catch (error) {
      showError(`❌ Error: ${error.message}`);
    }
  }

  // Parse headers from input
  function parseHeaders(input) {
    const headers = new Map();
    const lines = input.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('HTTP/')) continue;

      const colonPos = trimmed.indexOf(':');
      if (colonPos === -1) continue;

      const name = trimmed.substring(0, colonPos).trim().toLowerCase();
      const value = trimmed.substring(colonPos + 1).trim();
      
      headers.set(name, value);
    }

    return headers;
  }

  // Analyze security headers
  function analyzeSecurityHeaders(headers) {
    const found = [];
    const missing = [];
    const warnings = [];
    let score = 0;
    const maxScore = 100;

    // Check each security header
    for (const [key, config] of Object.entries(securityHeaders)) {
      if (headers.has(key)) {
        const value = headers.get(key);
        const analysis = analyzeHeaderValue(key, value, config);
        found.push({ ...config, value, ...analysis });
        score += analysis.score;
      } else {
        missing.push(config);
      }
    }

    // Calculate final score
    const totalPossible = Object.keys(securityHeaders).length * 20;
    const finalScore = Math.round((score / totalPossible) * 100);

    return {
      score: finalScore,
      found,
      missing,
      warnings,
      totalHeaders: headers.size
    };
  }

  // Analyze individual header value
  function analyzeHeaderValue(key, value, config) {
    let score = 15; // Base score for having the header
    const issues = [];

    switch (key) {
      case 'content-security-policy':
        if (value.includes("'unsafe-inline'")) {
          issues.push("⚠️ unsafe-inline detected (XSS risk)");
          score -= 5;
        }
        if (value.includes("'unsafe-eval'")) {
          issues.push("⚠️ unsafe-eval detected (code injection risk)");
          score -= 5;
        }
        if (!value.includes("default-src")) {
          issues.push("⚠️ default-src directive missing");
          score -= 3;
        }
        break;

      case 'strict-transport-security':
        const maxAge = value.match(/max-age=(\d+)/);
        if (maxAge && parseInt(maxAge[1]) < 31536000) {
          issues.push("⚠️ max-age < 1 year (31536000)");
          score -= 3;
        }
        if (!value.includes('includeSubDomains')) {
          issues.push("💡 Consider adding includeSubDomains");
        }
        if (!value.includes('preload')) {
          issues.push("💡 Consider adding preload");
        }
        break;

      case 'x-frame-options':
        if (!['DENY', 'SAMEORIGIN'].includes(value.toUpperCase())) {
          issues.push("⚠️ Value should be DENY or SAMEORIGIN");
          score -= 5;
        }
        break;

      case 'x-content-type-options':
        if (value.toLowerCase() !== 'nosniff') {
          issues.push("⚠️ Value should be 'nosniff'");
          score -= 5;
        }
        break;

      case 'referrer-policy':
        const safe = ['no-referrer', 'strict-origin', 'strict-origin-when-cross-origin'];
        if (!safe.includes(value.toLowerCase())) {
          issues.push("💡 Consider more restrictive policy");
          score -= 2;
        }
        break;
    }

    return { score, issues };
  }

  // Display results
  function displayResults(analysis) {
    // Security Score
    let scoreColor = 'red';
    let scoreLabel = 'Poor';
    if (analysis.score >= 80) {
      scoreColor = 'green';
      scoreLabel = 'Excellent';
    } else if (analysis.score >= 60) {
      scoreColor = 'orange';
      scoreLabel = 'Good';
    } else if (analysis.score >= 40) {
      scoreColor = 'yellow';
      scoreLabel = 'Fair';
    }

    securityScore.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 3rem; font-weight: bold; color: ${scoreColor};">
          ${analysis.score}%
        </div>
        <div style="font-size: 1.2rem; margin-top: 0.5rem;">
          Security Score: ${scoreLabel}
        </div>
        <div style="margin-top: 1rem; font-size: 0.9rem; opacity: 0.8;">
          ${analysis.found.length} headers found • ${analysis.missing.length} missing
        </div>
      </div>
    `;

    // Headers Report
    let reportHtml = '';

    // Found headers
    if (analysis.found.length > 0) {
      reportHtml += '<div style="margin-bottom: 2rem;"><h3 style="color: green;">✅ Headers Present</h3>';
      analysis.found.forEach(header => {
        reportHtml += `
          <div style="margin: 1rem 0; padding: 1rem; background: rgba(0,255,0,0.05); border-left: 3px solid green; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">${header.name}</div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">${header.description}</div>
            <div class="code-block" style="margin: 0.5rem 0; font-size: 0.85rem; word-break: break-all;">
              ${escapeHtml(header.value)}
            </div>
        `;
        if (header.issues && header.issues.length > 0) {
          reportHtml += '<div style="margin-top: 0.5rem;">';
          header.issues.forEach(issue => {
            reportHtml += `<div style="font-size: 0.85rem; margin-top: 0.25rem;">${issue}</div>`;
          });
          reportHtml += '</div>';
        }
        reportHtml += '</div>';
      });
      reportHtml += '</div>';
    }

    // Missing headers
    if (analysis.missing.length > 0) {
      reportHtml += '<div><h3 style="color: orange;">⚠️ Missing Headers</h3>';
      analysis.missing.forEach(header => {
        const severityColor = header.severity === 'critical' ? 'red' : 
                               header.severity === 'high' ? 'orange' : 'yellow';
        reportHtml += `
          <div style="margin: 1rem 0; padding: 1rem; background: rgba(255,165,0,0.05); border-left: 3px solid ${severityColor}; border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">
              ${header.name}
              <span style="font-size: 0.8rem; padding: 0.2rem 0.5rem; background: ${severityColor}; color: black; border-radius: 3px; margin-left: 0.5rem;">${header.severity.toUpperCase()}</span>
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">${header.description}</div>
            <div style="font-size: 0.85rem; color: lightblue;">
              💡 ${header.recommendation}
            </div>
          </div>
        `;
      });
      reportHtml += '</div>';
    }

    headersReport.innerHTML = reportHtml;
    outputSection.style.display = 'block';
  }

  // Show error
  function showError(message) {
    securityScore.innerHTML = `<div class="error-message">${message}</div>`;
    headersReport.innerHTML = '';
    outputSection.style.display = 'block';
  }

  // Clear all
  function clearAll() {
    headersInput.value = '';
    outputSection.style.display = 'none';
  }

  // Load example
  function loadExample() {
    headersInput.value = `HTTP/2 200 
content-type: text/html; charset=utf-8
strict-transport-security: max-age=31536000; includeSubDomains; preload
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), geolocation=()`;

    setTimeout(() => checkHeaders(), 100);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Event Listeners
  btnCheck.addEventListener('click', checkHeaders);
  btnClear.addEventListener('click', clearAll);
  btnExample.addEventListener('click', loadExample);

  // Ctrl+Enter to check
  headersInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      checkHeaders();
    }
  });
}
