/**
 * Hash Identifier
 * Identify hash type from hash string
 */

import { utils } from './main.js';

function initHashIdentifier() {
    return `
        <div class="tool-header">
            <h2>Hash Identifier</h2>
            <p>Identify hash types from hash strings (MD5, SHA1, SHA256, etc.)</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Identify Hash</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter hash string</label>
                    <textarea 
                        id="hashInput" 
                        class="form-control" 
                        rows="4"
                        placeholder="5d41402abc4b2a76b9719d911017c592"
                    ></textarea>
                </div>
                
                <div class="button-group">
                    <button id="btnIdentify" class="btn btn-primary">
                        🔍 Identify Hash
                    </button>
                    <button id="btnClear" class="btn btn-secondary">
                        🗑️ Clear
                    </button>
                </div>
                
                <div id="identifyOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Bulk Hash Identification</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter multiple hashes (one per line)</label>
                    <textarea 
                        id="bulkHashInput" 
                        class="form-control" 
                        rows="10"
                        placeholder="5d41402abc4b2a76b9719d911017c592&#10;356a192b7913b04c54574d18c28d46e6395428ab&#10;e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                    ></textarea>
                </div>
                
                <div class="button-group">
                    <button id="btnBulkIdentify" class="btn btn-primary">
                        🔍 Identify All
                    </button>
                    <button id="btnExport" class="btn btn-secondary">
                        📥 Export Results
                    </button>
                </div>
                
                <div id="bulkOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Hash Reference</h3>
            </div>
            <div class="card-body">
                <table style="width: 100%; font-size: 0.9rem;">
                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Length</th>
                            <th>Pattern</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>MD5</strong></td>
                            <td>32 hex</td>
                            <td>[a-f0-9]{32}</td>
                            <td><code style="font-size: 0.75rem;">5d41402abc4b...</code></td>
                        </tr>
                        <tr>
                            <td><strong>SHA-1</strong></td>
                            <td>40 hex</td>
                            <td>[a-f0-9]{40}</td>
                            <td><code style="font-size: 0.75rem;">356a192b7913b04...</code></td>
                        </tr>
                        <tr>
                            <td><strong>SHA-224</strong></td>
                            <td>56 hex</td>
                            <td>[a-f0-9]{56}</td>
                            <td><code style="font-size: 0.75rem;">d14a028c2a3a2b...</code></td>
                        </tr>
                        <tr>
                            <td><strong>SHA-256</strong></td>
                            <td>64 hex</td>
                            <td>[a-f0-9]{64}</td>
                            <td><code style="font-size: 0.75rem;">e3b0c44298fc1c1...</code></td>
                        </tr>
                        <tr>
                            <td><strong>SHA-384</strong></td>
                            <td>96 hex</td>
                            <td>[a-f0-9]{96}</td>
                            <td><code style="font-size: 0.75rem;">38b060a751ac96...</code></td>
                        </tr>
                        <tr>
                            <td><strong>SHA-512</strong></td>
                            <td>128 hex</td>
                            <td>[a-f0-9]{128}</td>
                            <td><code style="font-size: 0.75rem;">cf83e1357eefb8...</code></td>
                        </tr>
                        <tr>
                            <td><strong>NTLM</strong></td>
                            <td>32 hex</td>
                            <td>[a-f0-9]{32}</td>
                            <td><code style="font-size: 0.75rem;">8846f7eaee8fb1...</code></td>
                        </tr>
                        <tr>
                            <td><strong>MySQL</strong></td>
                            <td>16 hex</td>
                            <td>[a-f0-9]{16}</td>
                            <td><code style="font-size: 0.75rem;">6bb4837eb74329...</code></td>
                        </tr>
                        <tr>
                            <td><strong>bcrypt</strong></td>
                            <td>60 chars</td>
                            <td>$2[aby]$...</td>
                            <td><code style="font-size: 0.75rem;">$2a$10$N9qo8...</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 About Hash Identification</h4>
            <ul>
                <li><strong>Detection Method:</strong> Based on length and pattern matching</li>
                <li><strong>Limitation:</strong> Some hashes have the same length (e.g., MD5 and NTLM both 32 hex)</li>
                <li><strong>Context Matters:</strong> Use additional context to determine exact algorithm</li>
                <li><strong>Common Uses:</strong> Password auditing, forensics, malware analysis</li>
            </ul>
        </div>
    `;
}

const hashPatterns = [
    {
        name: 'MD5',
        length: 32,
        pattern: /^[a-f0-9]{32}$/i,
        description: 'Message Digest Algorithm 5 (128-bit)',
        common: true
    },
    {
        name: 'SHA-1',
        length: 40,
        pattern: /^[a-f0-9]{40}$/i,
        description: 'Secure Hash Algorithm 1 (160-bit)',
        common: true
    },
    {
        name: 'SHA-224',
        length: 56,
        pattern: /^[a-f0-9]{56}$/i,
        description: 'Secure Hash Algorithm 224-bit'
    },
    {
        name: 'SHA-256',
        length: 64,
        pattern: /^[a-f0-9]{64}$/i,
        description: 'Secure Hash Algorithm 256-bit',
        common: true
    },
    {
        name: 'SHA-384',
        length: 96,
        pattern: /^[a-f0-9]{96}$/i,
        description: 'Secure Hash Algorithm 384-bit'
    },
    {
        name: 'SHA-512',
        length: 128,
        pattern: /^[a-f0-9]{128}$/i,
        description: 'Secure Hash Algorithm 512-bit',
        common: true
    },
    {
        name: 'NTLM',
        length: 32,
        pattern: /^[a-f0-9]{32}$/i,
        description: 'Windows NT LAN Manager hash (same format as MD5)',
        note: 'Cannot distinguish from MD5 by format alone'
    },
    {
        name: 'MySQL323',
        length: 16,
        pattern: /^[a-f0-9]{16}$/i,
        description: 'Old MySQL password hash'
    },
    {
        name: 'MySQL5',
        length: 40,
        pattern: /^\*[a-f0-9]{40}$/i,
        description: 'MySQL 5.x password hash (starts with *)'
    },
    {
        name: 'bcrypt',
        length: 60,
        pattern: /^\$2[aby]\$[0-9]{2}\$.{53}$/,
        description: 'Bcrypt password hash (Blowfish-based)',
        common: true
    },
    {
        name: 'Argon2',
        pattern: /^\$argon2[id]{0,2}\$/,
        description: 'Argon2 password hash',
        common: true
    },
    {
        name: 'scrypt',
        pattern: /^\$scrypt\$/,
        description: 'scrypt password hash'
    },
    {
        name: 'PBKDF2',
        pattern: /^pbkdf2:sha256:/,
        description: 'PBKDF2 with SHA-256'
    },
    {
        name: 'Unix crypt',
        pattern: /^\$[156]\$/,
        description: 'Unix crypt password hash'
    },
    {
        name: 'Cisco Type 7',
        pattern: /^[a-f0-9]{4,}/i,
        length: [4, 100],
        description: 'Cisco Type 7 password (weak encryption)'
    }
];

function identifyHash(hash) {
    const trimmed = hash.trim();
    const length = trimmed.length;
    const matches = [];
    
    // Check each pattern
    hashPatterns.forEach(pattern => {
        if (pattern.pattern.test(trimmed)) {
            matches.push({
                ...pattern,
                confidence: pattern.common ? 'High' : 'Medium'
            });
        }
    });
    
    // If no pattern match, try length-based detection
    if (matches.length === 0) {
        const lengthMatches = hashPatterns.filter(p => p.length === length);
        lengthMatches.forEach(pattern => {
            matches.push({
                ...pattern,
                confidence: 'Low',
                note: 'Matched by length only'
            });
        });
    }
    
    return {
        hash: trimmed,
        length,
        matches,
        identified: matches.length > 0
    };
}

function displayIdentification() {
    const input = document.getElementById('hashInput').value.trim();
    const output = document.getElementById('identifyOutput');
    
    if (!input) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a hash</div>';
        return;
    }
    
    const result = identifyHash(input);
    
    if (!result.identified) {
        output.innerHTML = `
            <div class="alert alert-danger">
                <h4 style="margin-top: 0;">❌ Unknown Hash Type</h4>
                <div><strong>Length:</strong> ${result.length} characters</div>
                <div style="margin-top: 1rem;">
                    The hash doesn't match any known patterns. It might be:
                    <ul>
                        <li>A custom or proprietary hash</li>
                        <li>Encoded data (not a hash)</li>
                        <li>Corrupted or incomplete</li>
                    </ul>
                </div>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="alert alert-success">
            <h4 style="margin-top: 0;">✅ Possible Hash Type${result.matches.length > 1 ? 's' : ''}</h4>
            <div><strong>Length:</strong> ${result.length} characters</div>
        </div>
    `;
    
    result.matches.forEach((match, index) => {
        const confidenceColor = {
            'High': '#22c55e',
            'Medium': '#f59e0b',
            'Low': '#ef4444'
        }[match.confidence];
        
        html += `
            <div class="alert alert-info" style="border-left: 4px solid ${confidenceColor};">
                <h5 style="margin-top: 0;">
                    ${index + 1}. ${match.name}
                    <span style="background: ${confidenceColor}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">
                        ${match.confidence} Confidence
                    </span>
                </h5>
                <div><strong>Description:</strong> ${match.description}</div>
                ${match.note ? `<div style="margin-top: 0.5rem; color: #f59e0b;"><strong>Note:</strong> ${match.note}</div>` : ''}
                ${match.common ? '<div style="margin-top: 0.5rem; color: #22c55e;">✅ Common hash type</div>' : ''}
            </div>
        `;
    });
    
    output.innerHTML = html;
}

function bulkIdentifyHashes() {
    const input = document.getElementById('bulkHashInput').value.trim();
    const output = document.getElementById('bulkOutput');
    
    if (!input) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please enter hashes to identify</div>';
        return;
    }
    
    const lines = input.split('\n').filter(line => line.trim());
    const results = lines.map(line => identifyHash(line));
    
    const identified = results.filter(r => r.identified).length;
    const unknown = results.filter(r => !r.identified).length;
    
    let html = `
        <div class="alert alert-info">
            <h4 style="margin-top: 0;">📊 Bulk Identification Results</h4>
            <div style="font-size: 1.1rem; margin: 1rem 0;">
                ✅ Identified: ${identified} | ❌ Unknown: ${unknown} | Total: ${lines.length}
            </div>
        </div>
    `;
    
    // Group by hash type
    const grouped = {};
    results.forEach((result, index) => {
        if (result.identified) {
            result.matches.forEach(match => {
                if (!grouped[match.name]) {
                    grouped[match.name] = [];
                }
                grouped[match.name].push({ index: index + 1, hash: result.hash });
            });
        }
    });
    
    // Display grouped results
    Object.keys(grouped).sort().forEach(hashType => {
        const hashes = grouped[hashType];
        html += `
            <div class="alert alert-success">
                <h5>${hashType} (${hashes.length})</h5>
                <div style="max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 0.85rem;">
                    ${hashes.map(h => `#${h.index}: ${h.hash.substring(0, 40)}${h.hash.length > 40 ? '...' : ''}`).join('<br>')}
                </div>
            </div>
        `;
    });
    
    // Display unknown hashes
    const unknownHashes = results.filter(r => !r.identified);
    if (unknownHashes.length > 0) {
        html += `
            <div class="alert alert-danger">
                <h5>❌ Unknown Hashes (${unknownHashes.length})</h5>
                <div style="max-height: 150px; overflow-y: auto; font-family: monospace; font-size: 0.85rem;">
                    ${unknownHashes.map(r => `${r.hash.substring(0, 40)}${r.hash.length > 40 ? '...' : ''} (${r.length} chars)`).join('<br>')}
                </div>
            </div>
        `;
    }
    
    output.innerHTML = html;
}

function exportResults() {
    const input = document.getElementById('bulkHashInput').value.trim();
    
    if (!input) return;
    
    const lines = input.split('\n').filter(line => line.trim());
    const results = lines.map(line => identifyHash(line));
    
    let csv = 'Hash,Length,Identified Type(s),Confidence\n';
    
    results.forEach(result => {
        const types = result.matches.map(m => m.name).join(' | ');
        const confidence = result.matches.length > 0 ? result.matches[0].confidence : 'N/A';
        csv += `"${result.hash}",${result.length},"${types || 'Unknown'}","${confidence}"\n`;
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hash-identification-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    const btn = event?.target;
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Exported!';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    }
}

export function render(container) {
    container.innerHTML = initHashIdentifier();
    
    setTimeout(() => {
        // Event listeners
        document.getElementById('btnIdentify')?.addEventListener('click', displayIdentification);
        document.getElementById('btnBulkIdentify')?.addEventListener('click', bulkIdentifyHashes);
        document.getElementById('btnExport')?.addEventListener('click', exportResults);
        document.getElementById('btnClear')?.addEventListener('click', () => {
            document.getElementById('hashInput').value = '';
            document.getElementById('identifyOutput').innerHTML = '';
        });
        
        // Auto-identify on input
        let timeout;
        document.getElementById('hashInput')?.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const value = document.getElementById('hashInput').value.trim();
                if (value.length >= 16) {
                    displayIdentification();
                }
            }, 500);
        });

        // Add copy/paste buttons to textareas
        const hashInput = document.getElementById('hashInput');
        const bulkHashInput = document.getElementById('bulkHashInput');
        if (hashInput) {
            utils.addTextareaActions(hashInput, {
                showCopy: true,
                showPaste: true
            });
        }
        if (bulkHashInput) {
            utils.addTextareaActions(bulkHashInput, {
                showCopy: true,
                showPaste: true
            });
        }
    }, 100);
}
