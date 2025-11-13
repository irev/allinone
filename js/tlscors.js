/**
 * TLS/SSL & CORS Tester
 * Test TLS/SSL configurations and CORS policies
 * Note: Due to browser security restrictions, some tests require a proxy server
 */

export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h1 class="tool-title">TLS/CORS Tester</h1>
            <p class="tool-description">
                Test TLS/SSL certificate information and CORS policies. Due to browser 
                security restrictions, some features are limited to same-origin or require 
                a CORS proxy.
            </p>

            <div class="alert alert-info">
                <strong>ℹ️ Browser Limitations:</strong>
                <ul style="margin: 10px 0 0 0;">
                    <li>Certificate details cannot be accessed directly from JavaScript</li>
                    <li>CORS requests are subject to server CORS policy</li>
                    <li>For full TLS testing, use browser DevTools (Security tab) or command-line tools</li>
                </ul>
            </div>

            <div class="form-group">
                <label>
                    <input type="radio" name="testMode" value="cors" checked> CORS Test
                </label>
                <label style="margin-left: 20px;">
                    <input type="radio" name="testMode" value="ssl"> SSL/TLS Info
                </label>
            </div>

            <!-- CORS Test Mode -->
            <div id="corsMode">
                <h3>CORS Policy Tester</h3>
                <div class="form-group">
                    <label for="corsUrl"><strong>Target URL:</strong></label>
                    <input 
                        type="url" 
                        id="corsUrl" 
                        class="form-control" 
                        placeholder="https://api.example.com/endpoint"
                    >
                </div>

                <div class="form-group">
                    <label for="corsMethod"><strong>HTTP Method:</strong></label>
                    <select id="corsMethod" class="form-control">
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="OPTIONS">OPTIONS (Preflight)</option>
                        <option value="HEAD">HEAD</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="corsHeaders"><strong>Custom Headers (optional):</strong></label>
                    <textarea 
                        id="corsHeaders" 
                        class="form-control" 
                        rows="3"
                        placeholder="Content-Type: application/json&#10;Authorization: Bearer token123"
                    ></textarea>
                    <small>One header per line in format: Header-Name: value</small>
                </div>

                <button id="testCorsBtn" class="btn btn-primary">Test CORS</button>
                <button id="clearCorsBtn" class="btn btn-danger">Clear</button>

                <div id="corsResult" style="margin-top: 20px;">
                    <!-- CORS test results -->
                </div>
            </div>

            <!-- SSL/TLS Info Mode -->
            <div id="sslMode" style="display: none;">
                <h3>SSL/TLS Information</h3>
                <div class="form-group">
                    <label for="sslUrl"><strong>Target URL:</strong></label>
                    <input 
                        type="url" 
                        id="sslUrl" 
                        class="form-control" 
                        placeholder="https://example.com"
                    >
                </div>

                <button id="testSslBtn" class="btn btn-primary">Get SSL Info</button>
                <button id="clearSslBtn" class="btn btn-danger">Clear</button>

                <div class="alert alert-warning" style="margin-top: 15px;">
                    <strong>⚠️ Limited Information Available</strong><br>
                    JavaScript cannot access full SSL/TLS certificate details. This tool will:
                    <ul style="margin: 10px 0 0 0;">
                        <li>Test if the connection is HTTPS</li>
                        <li>Verify the endpoint is reachable</li>
                        <li>Check for mixed content warnings</li>
                    </ul>
                    For full certificate inspection, use:
                    <ul style="margin: 10px 0 0 0;">
                        <li>Browser DevTools → Security tab</li>
                        <li>Command-line: <code>openssl s_client -connect example.com:443</code></li>
                        <li>Online tools: SSL Labs, Qualys SSL Test</li>
                    </ul>
                </div>

                <div id="sslResult" style="margin-top: 20px;">
                    <!-- SSL test results -->
                </div>
            </div>

            <div id="recommendedTools" style="margin-top: 30px; display: none;">
                <h3>Recommended External Tools</h3>
                <div class="output-section">
                    <ul>
                        <li><strong>SSL Labs:</strong> <a href="https://www.ssllabs.com/ssltest/" target="_blank">https://www.ssllabs.com/ssltest/</a> - Comprehensive SSL/TLS testing</li>
                        <li><strong>SecurityHeaders.com:</strong> <a href="https://securityheaders.com/" target="_blank">https://securityheaders.com/</a> - Security headers analysis</li>
                        <li><strong>Mozilla Observatory:</strong> <a href="https://observatory.mozilla.org/" target="_blank">https://observatory.mozilla.org/</a> - Overall security scan</li>
                        <li><strong>HardenizeZ:</strong> <a href="https://www.hardenize.com/" target="_blank">https://www.hardenize.com/</a> - Network security testing</li>
                    </ul>
                </div>
            </div>
    `;

    // Elements
    const corsMode = container.querySelector('#corsMode');
    const sslMode = container.querySelector('#sslMode');
    const modeRadios = container.querySelectorAll('input[name="testMode"]');
    const recommendedTools = container.querySelector('#recommendedTools');

    const corsUrl = container.querySelector('#corsUrl');
    const corsMethod = container.querySelector('#corsMethod');
    const corsHeaders = container.querySelector('#corsHeaders');
    const testCorsBtn = container.querySelector('#testCorsBtn');
    const clearCorsBtn = container.querySelector('#clearCorsBtn');
    const corsResult = container.querySelector('#corsResult');

    const sslUrl = container.querySelector('#sslUrl');
    const testSslBtn = container.querySelector('#testSslBtn');
    const clearSslBtn = container.querySelector('#clearSslBtn');
    const sslResult = container.querySelector('#sslResult');

    // Mode switching
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'cors') {
                corsMode.style.display = 'block';
                sslMode.style.display = 'none';
            } else {
                corsMode.style.display = 'none';
                sslMode.style.display = 'block';
            }
        });
    });

    // CORS testing
    testCorsBtn.addEventListener('click', async () => {
        const url = corsUrl.value.trim();
        if (!url) {
            corsResult.innerHTML = '<div class="alert alert-warning">Please enter a URL</div>';
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            corsResult.innerHTML = '<div class="alert alert-danger">URL must start with http:// or https://</div>';
            return;
        }

        corsResult.innerHTML = '<div class="alert alert-info">Testing CORS policy...</div>';
        
        try {
            await testCORS(url, corsMethod.value, parseHeaders(corsHeaders.value));
        } catch (error) {
            corsResult.innerHTML = `<div class="alert alert-danger">Error: ${escapeHtml(error.message)}</div>`;
        }
    });

    clearCorsBtn.addEventListener('click', () => {
        corsUrl.value = '';
        corsHeaders.value = '';
        corsResult.innerHTML = '';
    });

    // SSL testing
    testSslBtn.addEventListener('click', async () => {
        const url = sslUrl.value.trim();
        if (!url) {
            sslResult.innerHTML = '<div class="alert alert-warning">Please enter a URL</div>';
            return;
        }

        if (!url.startsWith('https://')) {
            sslResult.innerHTML = '<div class="alert alert-danger">URL must start with https:// for SSL/TLS testing</div>';
            return;
        }

        sslResult.innerHTML = '<div class="alert alert-info">Testing SSL/TLS connection...</div>';
        
        try {
            await testSSL(url);
        } catch (error) {
            sslResult.innerHTML = `<div class="alert alert-danger">Error: ${escapeHtml(error.message)}</div>`;
        }
    });

    clearSslBtn.addEventListener('click', () => {
        sslUrl.value = '';
        sslResult.innerHTML = '';
    });

    // CORS testing implementation
    async function testCORS(url, method, headers) {
        const startTime = Date.now();
        let response;
        let corsHeaders = {};

        try {
            const fetchOptions = {
                method: method,
                mode: 'cors',
                cache: 'no-cache',
                headers: headers
            };

            response = await fetch(url, fetchOptions);
            const endTime = Date.now();

            // Extract CORS headers
            corsHeaders = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
                'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials'),
                'Access-Control-Expose-Headers': response.headers.get('Access-Control-Expose-Headers'),
                'Access-Control-Max-Age': response.headers.get('Access-Control-Max-Age')
            };

            displayCORSResult(true, response.status, corsHeaders, endTime - startTime);
            recommendedTools.style.display = 'none';

        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('CORS')) {
                displayCORSResult(false, null, {}, 0, 'CORS request blocked. The server does not allow cross-origin requests from this domain.');
            } else {
                displayCORSResult(false, null, {}, 0, error.message);
            }
            recommendedTools.style.display = 'block';
        }
    }

    function displayCORSResult(success, status, headers, time, errorMsg = null) {
        let html = '';

        if (success) {
            html = `
                <div class="alert alert-success">
                    <strong>✓ CORS Request Successful</strong><br>
                    HTTP Status: ${status}<br>
                    Response Time: ${time}ms
                </div>
            `;

            // Display CORS headers
            html += '<h4>CORS Headers Received:</h4><div class="output-section"><table class="info-table">';
            
            for (const [key, value] of Object.entries(headers)) {
                const displayValue = value || '<span style="color: #999;">Not set</span>';
                const rowClass = value ? '' : ' style="opacity: 0.5;"';
                html += `<tr${rowClass}><td><strong>${escapeHtml(key)}:</strong></td><td>${displayValue}</td></tr>`;
            }
            
            html += '</table></div>';

            // Analysis
            html += '<h4>CORS Policy Analysis:</h4><div class="output-section"><ul>';
            
            if (headers['Access-Control-Allow-Origin'] === '*') {
                html += '<li style="color: orange;">⚠️ Allows requests from any origin (wildcard *)</li>';
            } else if (headers['Access-Control-Allow-Origin']) {
                html += `<li style="color: green;">✓ Allows requests from: ${headers['Access-Control-Allow-Origin']}</li>`;
            } else {
                html += '<li style="color: red;">✗ No Access-Control-Allow-Origin header (CORS not configured)</li>';
            }

            if (headers['Access-Control-Allow-Credentials'] === 'true') {
                html += '<li style="color: green;">✓ Credentials (cookies) are allowed</li>';
            }

            if (headers['Access-Control-Allow-Methods']) {
                html += `<li>Allowed methods: ${headers['Access-Control-Allow-Methods']}</li>`;
            }

            if (headers['Access-Control-Allow-Headers']) {
                html += `<li>Allowed headers: ${headers['Access-Control-Allow-Headers']}</li>`;
            }

            if (headers['Access-Control-Max-Age']) {
                html += `<li>Preflight cache max-age: ${headers['Access-Control-Max-Age']} seconds</li>`;
            }

            html += '</ul></div>';

        } else {
            html = `
                <div class="alert alert-danger">
                    <strong>✗ CORS Request Failed</strong><br>
                    ${escapeHtml(errorMsg)}
                </div>
                <div class="alert alert-info">
                    <strong>Common CORS Issues:</strong>
                    <ul style="margin: 10px 0 0 0;">
                        <li>Server doesn't send <code>Access-Control-Allow-Origin</code> header</li>
                        <li>Origin not allowed in server's CORS policy</li>
                        <li>Preflight request (OPTIONS) is blocked</li>
                        <li>Custom headers not allowed by server</li>
                    </ul>
                </div>
            `;
        }

        corsResult.innerHTML = html;
    }

    // SSL testing implementation
    async function testSSL(url) {
        const startTime = Date.now();
        
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors', // Avoid CORS issues for SSL testing
                cache: 'no-cache'
            });
            
            const endTime = Date.now();
            
            // Parse URL
            const urlObj = new URL(url);
            const isHTTPS = urlObj.protocol === 'https:';
            const isMixedContent = window.location.protocol === 'https:' && !isHTTPS;

            let html = '';

            if (isHTTPS) {
                html = `
                    <div class="alert alert-success">
                        <strong>✓ HTTPS Connection Established</strong><br>
                        Response Time: ${endTime - startTime}ms
                    </div>
                `;

                html += '<h4>Connection Details:</h4><div class="output-section"><table class="info-table">';
                html += `<tr><td><strong>Protocol:</strong></td><td>HTTPS (Secure)</td></tr>`;
                html += `<tr><td><strong>Hostname:</strong></td><td>${escapeHtml(urlObj.hostname)}</td></tr>`;
                html += `<tr><td><strong>Port:</strong></td><td>${urlObj.port || '443 (default)'}</td></tr>`;
                html += `<tr><td><strong>Mixed Content:</strong></td><td>${isMixedContent ? '<span style="color: orange;">⚠️ Yes (loading HTTP from HTTPS)</span>' : '<span style="color: green;">✓ No</span>'}</td></tr>`;
                html += '</table></div>';

                html += `
                    <div class="alert alert-info" style="margin-top: 15px;">
                        <strong>ℹ️ For Detailed Certificate Information:</strong><br>
                        1. Click the padlock icon in your browser's address bar<br>
                        2. Open DevTools → Security tab<br>
                        3. View certificate details (issuer, validity, algorithms, etc.)
                    </div>
                `;

            } else {
                html = `
                    <div class="alert alert-warning">
                        <strong>⚠️ Not HTTPS</strong><br>
                        This URL uses HTTP (not secure). No SSL/TLS certificate is present.
                    </div>
                `;
            }

            sslResult.innerHTML = html;
            recommendedTools.style.display = 'block';

        } catch (error) {
            sslResult.innerHTML = `
                <div class="alert alert-danger">
                    <strong>✗ Connection Failed</strong><br>
                    ${escapeHtml(error.message)}
                </div>
                <div class="alert alert-info">
                    <strong>Possible Reasons:</strong>
                    <ul style="margin: 10px 0 0 0;">
                        <li>Server is unreachable or down</li>
                        <li>Invalid SSL/TLS certificate</li>
                        <li>Certificate has expired</li>
                        <li>Hostname mismatch</li>
                        <li>Self-signed certificate</li>
                        <li>Network or firewall blocking the request</li>
                    </ul>
                </div>
            `;
            recommendedTools.style.display = 'block';
        }
    }

    function parseHeaders(headersText) {
        const headers = {};
        const lines = headersText.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex > 0) {
                const key = trimmed.substring(0, colonIndex).trim();
                const value = trimmed.substring(colonIndex + 1).trim();
                headers[key] = value;
            }
        }
        
        return headers;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
