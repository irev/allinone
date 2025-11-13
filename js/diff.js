/**
 * Diff/Compare Tool
 * Side-by-side text comparison with diff highlighting and hash comparison
 */

export function render(container) {
    container.innerHTML = `
        <div class="tool-container">
            <h2>Diff/Compare Tool</h2>
            <p class="tool-description">
                Compare two text inputs side-by-side with diff highlighting, or compare 
                hash values for security verification.
            </p>

            <div class="form-group">
                <label>
                    <input type="radio" name="compareMode" value="text" checked> Text Comparison
                </label>
                <label style="margin-left: 20px;">
                    <input type="radio" name="compareMode" value="hash"> Hash Comparison
                </label>
            </div>

            <!-- Text Comparison Mode -->
            <div id="textCompareMode">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group">
                        <label for="text1"><strong>Text 1 (Original):</strong></label>
                        <textarea 
                            id="text1" 
                            class="form-control" 
                            rows="10"
                            placeholder="Enter first text..."
                        ></textarea>
                    </div>
                    <div class="form-group">
                        <label for="text2"><strong>Text 2 (Modified):</strong></label>
                        <textarea 
                            id="text2" 
                            class="form-control" 
                            rows="10"
                            placeholder="Enter second text..."
                        ></textarea>
                    </div>
                </div>

                <div class="form-group">
                    <label>
                        <input type="checkbox" id="ignoreWhitespace"> Ignore whitespace differences
                    </label>
                    <label style="margin-left: 20px;">
                        <input type="checkbox" id="ignoreCase"> Ignore case
                    </label>
                </div>

                <button id="compareBtn" class="btn btn-primary">Compare</button>
                <button id="clearTextBtn" class="btn btn-danger">Clear</button>

                <div id="diffStats" style="display: none; margin-top: 15px;">
                    <div class="alert alert-info">
                        <strong>Comparison Stats:</strong>
                        <ul style="margin: 10px 0 0 0;">
                            <li>Lines added: <span id="linesAdded" style="color: green;">0</span></li>
                            <li>Lines removed: <span id="linesRemoved" style="color: red;">0</span></li>
                            <li>Lines unchanged: <span id="linesUnchanged">0</span></li>
                            <li>Similarity: <span id="similarity">0%</span></li>
                        </ul>
                    </div>
                </div>

                <div id="diffResult" style="display: none; margin-top: 20px;">
                    <h3>Diff Result</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div>
                            <h4>Original</h4>
                            <pre id="diffLeft" class="diff-output"></pre>
                        </div>
                        <div>
                            <h4>Modified</h4>
                            <pre id="diffRight" class="diff-output"></pre>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hash Comparison Mode -->
            <div id="hashCompareMode" style="display: none;">
                <div class="form-group">
                    <label for="hash1"><strong>Hash 1 (Expected):</strong></label>
                    <textarea 
                        id="hash1" 
                        class="form-control" 
                        rows="3"
                        placeholder="Enter expected hash value..."
                    ></textarea>
                </div>

                <div class="form-group">
                    <label for="hash2"><strong>Hash 2 (Actual):</strong></label>
                    <textarea 
                        id="hash2" 
                        class="form-control" 
                        rows="3"
                        placeholder="Enter actual hash value..."
                    ></textarea>
                </div>

                <button id="compareHashBtn" class="btn btn-primary">Compare Hashes</button>
                <button id="clearHashBtn" class="btn btn-danger">Clear</button>

                <div id="hashResult" style="margin-top: 15px;">
                    <!-- Hash comparison result -->
                </div>

                <div id="hashDetails" style="display: none; margin-top: 15px;">
                    <h3>Hash Details</h3>
                    <div class="output-section">
                        <table class="info-table">
                            <tr>
                                <td><strong>Hash Type:</strong></td>
                                <td id="hashType"></td>
                            </tr>
                            <tr>
                                <td><strong>Length:</strong></td>
                                <td id="hashLength"></td>
                            </tr>
                            <tr>
                                <td><strong>Format:</strong></td>
                                <td id="hashFormat"></td>
                            </tr>
                            <tr>
                                <td><strong>Match:</strong></td>
                                <td id="hashMatch"></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <div id="charByCharComparison" style="display: none; margin-top: 15px;">
                    <h3>Character-by-Character Comparison</h3>
                    <div class="output-section">
                        <div id="charComparison" style="font-family: 'Courier New', monospace; word-break: break-all;"></div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .diff-output {
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.5;
                overflow-x: auto;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .diff-line {
                display: block;
                padding: 2px 5px;
                margin: 0;
            }

            .diff-added {
                background-color: #d4edda;
                color: #155724;
            }

            .diff-removed {
                background-color: #f8d7da;
                color: #721c24;
            }

            .diff-unchanged {
                background-color: transparent;
                color: #333;
            }

            .char-match {
                background-color: #d4edda;
            }

            .char-mismatch {
                background-color: #f8d7da;
                font-weight: bold;
            }
        </style>
    `;

    // Elements
    const textCompareMode = container.querySelector('#textCompareMode');
    const hashCompareMode = container.querySelector('#hashCompareMode');
    const modeRadios = container.querySelectorAll('input[name="compareMode"]');

    const text1 = container.querySelector('#text1');
    const text2 = container.querySelector('#text2');
    const ignoreWhitespace = container.querySelector('#ignoreWhitespace');
    const ignoreCase = container.querySelector('#ignoreCase');
    const compareBtn = container.querySelector('#compareBtn');
    const clearTextBtn = container.querySelector('#clearTextBtn');
    
    const diffStats = container.querySelector('#diffStats');
    const diffResult = container.querySelector('#diffResult');
    const diffLeft = container.querySelector('#diffLeft');
    const diffRight = container.querySelector('#diffRight');

    const hash1 = container.querySelector('#hash1');
    const hash2 = container.querySelector('#hash2');
    const compareHashBtn = container.querySelector('#compareHashBtn');
    const clearHashBtn = container.querySelector('#clearHashBtn');
    const hashResult = container.querySelector('#hashResult');
    const hashDetails = container.querySelector('#hashDetails');
    const charByCharComparison = container.querySelector('#charByCharComparison');

    // Mode switching
    modeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'text') {
                textCompareMode.style.display = 'block';
                hashCompareMode.style.display = 'none';
            } else {
                textCompareMode.style.display = 'none';
                hashCompareMode.style.display = 'block';
            }
        });
    });

    // Text comparison
    compareBtn.addEventListener('click', () => {
        const t1 = text1.value;
        const t2 = text2.value;

        if (!t1 && !t2) {
            alert('Please enter text to compare');
            return;
        }

        performTextDiff(t1, t2);
    });

    clearTextBtn.addEventListener('click', () => {
        text1.value = '';
        text2.value = '';
        diffStats.style.display = 'none';
        diffResult.style.display = 'none';
    });

    // Hash comparison
    compareHashBtn.addEventListener('click', () => {
        const h1 = hash1.value.trim();
        const h2 = hash2.value.trim();

        if (!h1 || !h2) {
            hashResult.innerHTML = '<div class="alert alert-warning">Please enter both hash values</div>';
            return;
        }

        performHashComparison(h1, h2);
    });

    clearHashBtn.addEventListener('click', () => {
        hash1.value = '';
        hash2.value = '';
        hashResult.innerHTML = '';
        hashDetails.style.display = 'none';
        charByCharComparison.style.display = 'none';
    });

    // Text diff implementation
    function performTextDiff(t1, t2) {
        let lines1 = t1.split('\n');
        let lines2 = t2.split('\n');

        // Apply options
        if (ignoreWhitespace.checked) {
            lines1 = lines1.map(l => l.trim());
            lines2 = lines2.map(l => l.trim());
        }

        if (ignoreCase.checked) {
            lines1 = lines1.map(l => l.toLowerCase());
            lines2 = lines2.map(l => l.toLowerCase());
        }

        // Simple line-by-line diff
        const diff = computeLineDiff(lines1, lines2);
        
        // Display results
        displayDiff(diff, t1.split('\n'), t2.split('\n'));
        
        // Calculate stats
        const added = diff.filter(d => d.type === 'added').length;
        const removed = diff.filter(d => d.type === 'removed').length;
        const unchanged = diff.filter(d => d.type === 'unchanged').length;
        const total = Math.max(lines1.length, lines2.length);
        const similarity = total > 0 ? Math.round((unchanged / total) * 100) : 0;

        container.querySelector('#linesAdded').textContent = added;
        container.querySelector('#linesRemoved').textContent = removed;
        container.querySelector('#linesUnchanged').textContent = unchanged;
        container.querySelector('#similarity').textContent = similarity + '%';

        diffStats.style.display = 'block';
        diffResult.style.display = 'block';
    }

    function computeLineDiff(lines1, lines2) {
        const diff = [];
        const maxLen = Math.max(lines1.length, lines2.length);

        for (let i = 0; i < maxLen; i++) {
            const line1 = lines1[i];
            const line2 = lines2[i];

            if (line1 === line2) {
                diff.push({ type: 'unchanged', line1, line2, index: i });
            } else if (line1 === undefined) {
                diff.push({ type: 'added', line2, index: i });
            } else if (line2 === undefined) {
                diff.push({ type: 'removed', line1, index: i });
            } else {
                // Both exist but different
                diff.push({ type: 'changed', line1, line2, index: i });
            }
        }

        return diff;
    }

    function displayDiff(diff, originalLines, modifiedLines) {
        let leftHtml = '';
        let rightHtml = '';

        diff.forEach((item, idx) => {
            const lineNum = idx + 1;

            if (item.type === 'unchanged') {
                leftHtml += `<span class="diff-line diff-unchanged">${lineNum}: ${escapeHtml(item.line1 || '')}</span>\n`;
                rightHtml += `<span class="diff-line diff-unchanged">${lineNum}: ${escapeHtml(item.line2 || '')}</span>\n`;
            } else if (item.type === 'added') {
                leftHtml += `<span class="diff-line" style="opacity: 0.3;">${lineNum}: </span>\n`;
                rightHtml += `<span class="diff-line diff-added">${lineNum}: + ${escapeHtml(item.line2)}</span>\n`;
            } else if (item.type === 'removed') {
                leftHtml += `<span class="diff-line diff-removed">${lineNum}: - ${escapeHtml(item.line1)}</span>\n`;
                rightHtml += `<span class="diff-line" style="opacity: 0.3;">${lineNum}: </span>\n`;
            } else if (item.type === 'changed') {
                leftHtml += `<span class="diff-line diff-removed">${lineNum}: ${escapeHtml(item.line1)}</span>\n`;
                rightHtml += `<span class="diff-line diff-added">${lineNum}: ${escapeHtml(item.line2)}</span>\n`;
            }
        });

        diffLeft.innerHTML = leftHtml;
        diffRight.innerHTML = rightHtml;
    }

    // Hash comparison implementation
    function performHashComparison(h1, h2) {
        // Normalize hashes (remove spaces, convert to lowercase)
        const hash1Normalized = h1.replace(/\s+/g, '').toLowerCase();
        const hash2Normalized = h2.replace(/\s+/g, '').toLowerCase();

        const matches = hash1Normalized === hash2Normalized;

        // Detect hash type
        const hashType = detectHashType(hash1Normalized);

        // Display result
        if (matches) {
            hashResult.innerHTML = `
                <div class="alert alert-success">
                    <strong>✓ Hashes Match!</strong><br>
                    The hash values are identical.
                </div>
            `;
        } else {
            hashResult.innerHTML = `
                <div class="alert alert-danger">
                    <strong>✗ Hashes Do Not Match!</strong><br>
                    The hash values are different.
                </div>
            `;

            // Show character-by-character comparison
            displayCharacterComparison(hash1Normalized, hash2Normalized);
        }

        // Display hash details
        container.querySelector('#hashType').textContent = hashType;
        container.querySelector('#hashLength').textContent = 
            `Hash 1: ${hash1Normalized.length} chars, Hash 2: ${hash2Normalized.length} chars`;
        container.querySelector('#hashFormat').textContent = 
            /^[0-9a-f]+$/.test(hash1Normalized) ? 'Hexadecimal' : 
            /^[0-9A-Za-z+/]+=*$/.test(h1) ? 'Base64' : 'Unknown';
        container.querySelector('#hashMatch').innerHTML = matches ? 
            '<span style="color: green;">Yes ✓</span>' : 
            '<span style="color: red;">No ✗</span>';

        hashDetails.style.display = 'block';
    }

    function detectHashType(hash) {
        const len = hash.length;
        
        if (len === 32) return 'MD5 (128-bit)';
        if (len === 40) return 'SHA-1 (160-bit)';
        if (len === 56) return 'SHA-224 (224-bit)';
        if (len === 64) return 'SHA-256 (256-bit)';
        if (len === 96) return 'SHA-384 (384-bit)';
        if (len === 128) return 'SHA-512 (512-bit)';
        
        return `Unknown (${len} characters)`;
    }

    function displayCharacterComparison(h1, h2) {
        const maxLen = Math.max(h1.length, h2.length);
        let html = '<div style="line-height: 2;">';
        
        html += '<div><strong>Hash 1:</strong> ';
        for (let i = 0; i < maxLen; i++) {
            const char = h1[i] || ' ';
            const match = h1[i] === h2[i];
            html += `<span class="${match ? 'char-match' : 'char-mismatch'}">${escapeHtml(char)}</span>`;
        }
        html += '</div>';

        html += '<div style="margin-top: 10px;"><strong>Hash 2:</strong> ';
        for (let i = 0; i < maxLen; i++) {
            const char = h2[i] || ' ';
            const match = h1[i] === h2[i];
            html += `<span class="${match ? 'char-match' : 'char-mismatch'}">${escapeHtml(char)}</span>`;
        }
        html += '</div>';

        html += `<div style="margin-top: 10px;"><strong>Differences:</strong> ${countDifferences(h1, h2)} characters</div>`;
        html += '</div>';

        container.querySelector('#charComparison').innerHTML = html;
        charByCharComparison.style.display = 'block';
    }

    function countDifferences(s1, s2) {
        const maxLen = Math.max(s1.length, s2.length);
        let count = 0;
        for (let i = 0; i < maxLen; i++) {
            if (s1[i] !== s2[i]) count++;
        }
        return count;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
