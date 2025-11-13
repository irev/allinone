/**
 * URL Parser & Normalizer
 * Parse URL components, decode/encode, normalize, and validate URLs
 */

export function render(container) {
    container.innerHTML = `
        <div class="tool-container">
            <h2>URL Parser & Normalizer</h2>
            <p class="tool-description">
                Parse and analyze URL components, normalize URLs, encode/decode URL parts, 
                and validate URL structure.
            </p>

            <div class="form-group">
                <label for="urlInput">
                    <strong>Enter URL:</strong>
                </label>
                <textarea 
                    id="urlInput" 
                    class="form-control" 
                    rows="3" 
                    placeholder="https://user:pass@example.com:8080/path?query=value#fragment"
                ></textarea>
                <button id="parseBtn" class="btn btn-primary">Parse URL</button>
                <button id="normalizeBtn" class="btn btn-secondary">Normalize URL</button>
                <button id="clearBtn" class="btn btn-danger">Clear</button>
            </div>

            <div id="urlComponents" style="display: none;">
                <h3>URL Components</h3>
                <div class="output-section">
                    <table class="info-table">
                        <tr>
                            <td><strong>Protocol:</strong></td>
                            <td id="protocol"></td>
                        </tr>
                        <tr>
                            <td><strong>Username:</strong></td>
                            <td id="username"></td>
                        </tr>
                        <tr>
                            <td><strong>Password:</strong></td>
                            <td id="password"></td>
                        </tr>
                        <tr>
                            <td><strong>Hostname:</strong></td>
                            <td id="hostname"></td>
                        </tr>
                        <tr>
                            <td><strong>Port:</strong></td>
                            <td id="port"></td>
                        </tr>
                        <tr>
                            <td><strong>Pathname:</strong></td>
                            <td id="pathname"></td>
                        </tr>
                        <tr>
                            <td><strong>Search:</strong></td>
                            <td id="search"></td>
                        </tr>
                        <tr>
                            <td><strong>Hash:</strong></td>
                            <td id="hash"></td>
                        </tr>
                        <tr>
                            <td><strong>Origin:</strong></td>
                            <td id="origin"></td>
                        </tr>
                        <tr>
                            <td><strong>Full URL:</strong></td>
                            <td id="href" style="word-break: break-all;"></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div id="queryParams" style="display: none;">
                <h3>Query Parameters</h3>
                <div class="output-section">
                    <table id="queryTable" class="info-table">
                        <!-- Populated dynamically -->
                    </table>
                </div>
            </div>

            <div id="encodingTools" class="form-group" style="margin-top: 20px;">
                <h3>Encode/Decode Tools</h3>
                <div class="form-group">
                    <label for="encodeInput"><strong>Text to Encode/Decode:</strong></label>
                    <textarea 
                        id="encodeInput" 
                        class="form-control" 
                        rows="3"
                        placeholder="Enter text to encode or decode"
                    ></textarea>
                </div>
                <div class="button-group">
                    <button id="encodeURIBtn" class="btn btn-secondary">encodeURI()</button>
                    <button id="encodeURIComponentBtn" class="btn btn-secondary">encodeURIComponent()</button>
                    <button id="decodeURIBtn" class="btn btn-secondary">decodeURI()</button>
                    <button id="decodeURIComponentBtn" class="btn btn-secondary">decodeURIComponent()</button>
                </div>
                <div class="output-section">
                    <label><strong>Result:</strong></label>
                    <textarea id="encodeOutput" class="form-control" rows="3" readonly></textarea>
                    <button id="copyEncodeBtn" class="btn btn-sm">Copy</button>
                </div>
            </div>

            <div id="normalizedOutput" style="display: none; margin-top: 20px;">
                <h3>Normalized URL</h3>
                <div class="output-section">
                    <textarea id="normalizedUrl" class="form-control" rows="3" readonly></textarea>
                    <button id="copyNormalizedBtn" class="btn btn-sm">Copy</button>
                </div>
                <div id="normalizationNotes" class="alert alert-info" style="margin-top: 10px;">
                    <!-- Populated with normalization details -->
                </div>
            </div>

            <div id="validationResult" style="margin-top: 20px;">
                <!-- Validation messages -->
            </div>
        </div>
    `;

    // Elements
    const urlInput = container.querySelector('#urlInput');
    const parseBtn = container.querySelector('#parseBtn');
    const normalizeBtn = container.querySelector('#normalizeBtn');
    const clearBtn = container.querySelector('#clearBtn');
    
    const componentsDiv = container.querySelector('#urlComponents');
    const queryParamsDiv = container.querySelector('#queryParams');
    const normalizedOutputDiv = container.querySelector('#normalizedOutput');
    const validationResultDiv = container.querySelector('#validationResult');

    const encodeInput = container.querySelector('#encodeInput');
    const encodeOutput = container.querySelector('#encodeOutput');
    const encodeURIBtn = container.querySelector('#encodeURIBtn');
    const encodeURIComponentBtn = container.querySelector('#encodeURIComponentBtn');
    const decodeURIBtn = container.querySelector('#decodeURIBtn');
    const decodeURIComponentBtn = container.querySelector('#decodeURIComponentBtn');
    const copyEncodeBtn = container.querySelector('#copyEncodeBtn');

    // Parse URL
    parseBtn.addEventListener('click', () => {
        const urlString = urlInput.value.trim();
        if (!urlString) {
            showValidation('Please enter a URL', 'error');
            return;
        }

        try {
            const url = new URL(urlString);
            displayComponents(url);
            displayQueryParams(url);
            showValidation('URL parsed successfully!', 'success');
        } catch (error) {
            showValidation(`Invalid URL: ${error.message}`, 'error');
            componentsDiv.style.display = 'none';
            queryParamsDiv.style.display = 'none';
        }
    });

    // Normalize URL
    normalizeBtn.addEventListener('click', () => {
        const urlString = urlInput.value.trim();
        if (!urlString) {
            showValidation('Please enter a URL', 'error');
            return;
        }

        try {
            const normalized = normalizeURL(urlString);
            container.querySelector('#normalizedUrl').value = normalized.url;
            container.querySelector('#normalizationNotes').innerHTML = 
                '<strong>Normalization Applied:</strong><ul>' + 
                normalized.changes.map(c => `<li>${c}</li>`).join('') + 
                '</ul>';
            normalizedOutputDiv.style.display = 'block';
            showValidation('URL normalized successfully!', 'success');
        } catch (error) {
            showValidation(`Normalization error: ${error.message}`, 'error');
            normalizedOutputDiv.style.display = 'none';
        }
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        encodeInput.value = '';
        encodeOutput.value = '';
        componentsDiv.style.display = 'none';
        queryParamsDiv.style.display = 'none';
        normalizedOutputDiv.style.display = 'none';
        validationResultDiv.innerHTML = '';
    });

    // Encoding tools
    encodeURIBtn.addEventListener('click', () => {
        const text = encodeInput.value;
        if (text) {
            encodeOutput.value = encodeURI(text);
        }
    });

    encodeURIComponentBtn.addEventListener('click', () => {
        const text = encodeInput.value;
        if (text) {
            encodeOutput.value = encodeURIComponent(text);
        }
    });

    decodeURIBtn.addEventListener('click', () => {
        const text = encodeInput.value;
        if (text) {
            try {
                encodeOutput.value = decodeURI(text);
            } catch (e) {
                encodeOutput.value = `Error: ${e.message}`;
            }
        }
    });

    decodeURIComponentBtn.addEventListener('click', () => {
        const text = encodeInput.value;
        if (text) {
            try {
                encodeOutput.value = decodeURIComponent(text);
            } catch (e) {
                encodeOutput.value = `Error: ${e.message}`;
            }
        }
    });

    copyEncodeBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(encodeOutput.value);
            copyEncodeBtn.textContent = 'Copied!';
            setTimeout(() => copyEncodeBtn.textContent = 'Copy', 2000);
        } catch (err) {
            alert('Failed to copy');
        }
    });

    container.querySelector('#copyNormalizedBtn').addEventListener('click', async () => {
        const btn = container.querySelector('#copyNormalizedBtn');
        try {
            await navigator.clipboard.writeText(container.querySelector('#normalizedUrl').value);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 2000);
        } catch (err) {
            alert('Failed to copy');
        }
    });

    // Helper functions
    function displayComponents(url) {
        container.querySelector('#protocol').textContent = url.protocol || '-';
        container.querySelector('#username').textContent = url.username || '-';
        container.querySelector('#password').textContent = url.password ? '••••••' : '-';
        container.querySelector('#hostname').textContent = url.hostname || '-';
        container.querySelector('#port').textContent = url.port || '(default)';
        container.querySelector('#pathname').textContent = url.pathname || '/';
        container.querySelector('#search').textContent = url.search || '-';
        container.querySelector('#hash').textContent = url.hash || '-';
        container.querySelector('#origin').textContent = url.origin || '-';
        container.querySelector('#href').textContent = url.href;
        
        componentsDiv.style.display = 'block';
    }

    function displayQueryParams(url) {
        const params = new URLSearchParams(url.search);
        const queryTable = container.querySelector('#queryTable');
        
        if (params.toString() === '') {
            queryParamsDiv.style.display = 'none';
            return;
        }

        let html = '<tr><th>Parameter</th><th>Value</th><th>Decoded</th></tr>';
        for (const [key, value] of params) {
            html += `
                <tr>
                    <td><code>${escapeHtml(key)}</code></td>
                    <td><code>${escapeHtml(value)}</code></td>
                    <td>${escapeHtml(decodeURIComponent(value))}</td>
                </tr>
            `;
        }
        
        queryTable.innerHTML = html;
        queryParamsDiv.style.display = 'block';
    }

    function normalizeURL(urlString) {
        const changes = [];
        let url;

        try {
            url = new URL(urlString);
        } catch (e) {
            throw new Error('Invalid URL');
        }

        // Convert protocol to lowercase
        const originalProtocol = url.protocol;
        if (url.protocol !== url.protocol.toLowerCase()) {
            changes.push('Converted protocol to lowercase');
        }

        // Convert hostname to lowercase
        const originalHostname = url.hostname;
        url.hostname = url.hostname.toLowerCase();
        if (originalHostname !== url.hostname) {
            changes.push('Converted hostname to lowercase');
        }

        // Remove default ports
        if ((url.protocol === 'http:' && url.port === '80') ||
            (url.protocol === 'https:' && url.port === '443')) {
            changes.push(`Removed default port ${url.port}`);
            url.port = '';
        }

        // Normalize path
        const originalPathname = url.pathname;
        
        // Decode unreserved characters in path
        try {
            const decoded = decodeURI(url.pathname);
            const reencoded = decoded.split('/').map(segment => {
                // Only encode what needs to be encoded
                return encodeURIComponent(decodeURIComponent(segment));
            }).join('/');
            
            if (reencoded !== url.pathname) {
                url.pathname = reencoded;
                changes.push('Normalized path encoding');
            }
        } catch (e) {
            // Keep original if decode fails
        }

        // Remove dot segments (., ..)
        const normalizedPath = url.pathname.split('/').reduce((acc, segment) => {
            if (segment === '..') {
                acc.pop();
            } else if (segment !== '.' && segment !== '') {
                acc.push(segment);
            }
            return acc;
        }, []);
        
        const newPathname = '/' + normalizedPath.join('/');
        if (newPathname !== url.pathname && url.pathname.includes('..')) {
            url.pathname = newPathname;
            changes.push('Removed dot segments from path');
        }

        // Sort query parameters alphabetically (optional normalization)
        if (url.search) {
            const params = new URLSearchParams(url.search);
            const sortedParams = new URLSearchParams(
                Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]))
            );
            const newSearch = '?' + sortedParams.toString();
            if (newSearch !== url.search) {
                url.search = newSearch;
                changes.push('Sorted query parameters alphabetically');
            }
        }

        // Remove fragment if empty
        if (url.hash === '#') {
            url.hash = '';
            changes.push('Removed empty fragment');
        }

        if (changes.length === 0) {
            changes.push('URL is already normalized');
        }

        return {
            url: url.href,
            changes: changes
        };
    }

    function showValidation(message, type) {
        const className = type === 'error' ? 'alert alert-danger' : 'alert alert-success';
        validationResultDiv.innerHTML = `<div class="${className}">${escapeHtml(message)}</div>`;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
