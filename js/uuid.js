/**
 * UUID Generator & Validator
 * Generate UUID v4 and validate UUIDs
 */

function initUUID() {
    return `
        <div class="tool-header">
            <h2>UUID Generator</h2>
            <p>Generate and validate Universally Unique Identifiers (UUID/GUID)</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Generate UUIDs</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Number of UUIDs to generate</label>
                    <input 
                        type="number" 
                        id="uuidCount" 
                        class="form-control" 
                        value="1"
                        min="1"
                        max="1000"
                    />
                </div>
                
                <div class="form-group">
                    <label>Format</label>
                    <select id="uuidFormat" class="form-control">
                        <option value="standard">Standard (lowercase with hyphens)</option>
                        <option value="uppercase">Uppercase with hyphens</option>
                        <option value="nohyphens">No hyphens (lowercase)</option>
                        <option value="nohyphens-upper">No hyphens (uppercase)</option>
                        <option value="braces">With braces {uuid}</option>
                        <option value="urn">URN format (urn:uuid:...)</option>
                    </select>
                </div>
                
                <div class="button-group">
                    <button id="btnGenerate" class="btn btn-primary">
                        🎲 Generate UUID(s)
                    </button>
                    <button id="btnCopyUUIDs" class="btn btn-secondary">
                        📋 Copy All
                    </button>
                    <button id="btnClearUUIDs" class="btn btn-secondary">
                        🗑️ Clear
                    </button>
                </div>
                
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Generated UUIDs</label>
                    <textarea 
                        id="uuidOutput" 
                        class="form-control" 
                        rows="10" 
                        readonly
                    ></textarea>
                </div>
                
                <div id="uuidStats"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Validate UUID</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter UUID to validate</label>
                    <input 
                        type="text" 
                        id="uuidValidate" 
                        class="form-control" 
                        placeholder="550e8400-e29b-41d4-a716-446655440000"
                    />
                </div>
                
                <div class="button-group">
                    <button id="btnValidate" class="btn btn-primary">
                        ✅ Validate
                    </button>
                    <button id="btnClearValidate" class="btn btn-secondary">
                        🗑️ Clear
                    </button>
                </div>
                
                <div id="validateOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Bulk Validator</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter multiple UUIDs (one per line)</label>
                    <textarea 
                        id="bulkValidate" 
                        class="form-control" 
                        rows="8"
                        placeholder="550e8400-e29b-41d4-a716-446655440000&#10;6ba7b810-9dad-11d1-80b4-00c04fd430c8&#10;invalid-uuid"
                    ></textarea>
                </div>
                
                <div class="button-group">
                    <button id="btnBulkValidate" class="btn btn-primary">
                        ✅ Validate All
                    </button>
                    <button id="btnExtractValid" class="btn btn-secondary">
                        📥 Extract Valid Only
                    </button>
                </div>
                
                <div id="bulkOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 About UUIDs</h4>
            <ul>
                <li><strong>Format:</strong> 8-4-4-4-12 hexadecimal digits (e.g., 550e8400-e29b-41d4-a716-446655440000)</li>
                <li><strong>Version 4:</strong> Random UUIDs (122 random bits)</li>
                <li><strong>Uniqueness:</strong> Probability of collision is negligible (1 in 2^122)</li>
                <li><strong>Use Cases:</strong> Database IDs, session tokens, file names, distributed systems</li>
                <li><strong>Standards:</strong> RFC 4122 compliant</li>
            </ul>
        </div>
    `;
}

function generateUUIDv4() {
    // RFC 4122 compliant UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatUUID(uuid, format) {
    const clean = uuid.replace(/[^a-f0-9]/gi, '');
    
    switch (format) {
        case 'uppercase':
            return uuid.toUpperCase();
        case 'nohyphens':
            return clean.toLowerCase();
        case 'nohyphens-upper':
            return clean.toUpperCase();
        case 'braces':
            return `{${uuid}}`;
        case 'urn':
            return `urn:uuid:${uuid}`;
        default:
            return uuid;
    }
}

function generateUUIDs() {
    const count = parseInt(document.getElementById('uuidCount').value) || 1;
    const format = document.getElementById('uuidFormat').value;
    const output = document.getElementById('uuidOutput');
    const stats = document.getElementById('uuidStats');
    
    if (count < 1 || count > 1000) {
        stats.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a number between 1 and 1000</div>';
        return;
    }
    
    const uuids = [];
    for (let i = 0; i < count; i++) {
        const uuid = generateUUIDv4();
        uuids.push(formatUUID(uuid, format));
    }
    
    output.value = uuids.join('\n');
    
    stats.innerHTML = `
        <div class="alert alert-success" style="margin-top: 1rem;">
            ✅ Generated ${count} UUID${count > 1 ? 's' : ''} (Version 4)
        </div>
    `;
}

function validateUUID(uuid) {
    // Remove common formatting
    const cleaned = uuid.trim()
        .replace(/^{|}$/g, '')  // Remove braces
        .replace(/^urn:uuid:/i, '');  // Remove URN prefix
    
    // UUID v4 regex pattern
    const uuidRegex = /^[0-9a-f]{8}-?[0-9a-f]{4}-?4[0-9a-f]{3}-?[89ab][0-9a-f]{3}-?[0-9a-f]{12}$/i;
    const noHyphensRegex = /^[0-9a-f]{32}$/i;
    
    if (uuidRegex.test(cleaned)) {
        return { valid: true, version: 4, format: 'with-hyphens' };
    } else if (noHyphensRegex.test(cleaned)) {
        return { valid: true, version: 4, format: 'no-hyphens' };
    } else {
        // Try to detect version
        const parts = cleaned.split('-');
        if (parts.length === 5) {
            const versionChar = parts[2].charAt(0);
            return { 
                valid: false, 
                reason: 'Invalid UUID format or unsupported version',
                detectedVersion: versionChar
            };
        }
        return { valid: false, reason: 'Invalid UUID format' };
    }
}

function validateSingleUUID() {
    const input = document.getElementById('uuidValidate').value.trim();
    const output = document.getElementById('validateOutput');
    
    if (!input) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a UUID</div>';
        return;
    }
    
    const result = validateUUID(input);
    
    if (result.valid) {
        output.innerHTML = `
            <div class="alert alert-success">
                <h4 style="margin-top: 0;">✅ Valid UUID</h4>
                <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
                    <div><strong>Version:</strong> ${result.version}</div>
                    <div><strong>Format:</strong> ${result.format === 'with-hyphens' ? 'Standard (with hyphens)' : 'Compact (no hyphens)'}</div>
                    <div><strong>UUID:</strong> <code>${input}</code></div>
                </div>
            </div>
        `;
    } else {
        output.innerHTML = `
            <div class="alert alert-danger">
                <h4 style="margin-top: 0;">❌ Invalid UUID</h4>
                <div><strong>Reason:</strong> ${result.reason}</div>
                ${result.detectedVersion ? `<div><strong>Detected version char:</strong> ${result.detectedVersion} (only v4 supported)</div>` : ''}
            </div>
        `;
    }
}

function validateBulkUUIDs() {
    const input = document.getElementById('bulkValidate').value.trim();
    const output = document.getElementById('bulkOutput');
    
    if (!input) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please enter UUIDs to validate</div>';
        return;
    }
    
    const lines = input.split('\n').filter(line => line.trim());
    const results = {
        valid: [],
        invalid: []
    };
    
    lines.forEach(line => {
        const uuid = line.trim();
        const result = validateUUID(uuid);
        
        if (result.valid) {
            results.valid.push(uuid);
        } else {
            results.invalid.push({ uuid, reason: result.reason });
        }
    });
    
    const total = lines.length;
    const validCount = results.valid.length;
    const invalidCount = results.invalid.length;
    const percentage = ((validCount / total) * 100).toFixed(1);
    
    let html = `
        <div class="alert ${validCount === total ? 'alert-success' : 'alert-info'}">
            <h4 style="margin-top: 0;">📊 Validation Results</h4>
            <div style="font-size: 1.1rem; margin: 1rem 0;">
                <strong>${validCount}/${total}</strong> valid (${percentage}%)
            </div>
        </div>
    `;
    
    if (results.valid.length > 0) {
        html += `
            <div class="alert alert-success">
                <h5>✅ Valid UUIDs (${results.valid.length})</h5>
                <div style="max-height: 200px; overflow-y: auto; margin-top: 0.5rem;">
                    ${results.valid.map(uuid => `<div><code>${uuid}</code></div>`).join('')}
                </div>
            </div>
        `;
    }
    
    if (results.invalid.length > 0) {
        html += `
            <div class="alert alert-danger">
                <h5>❌ Invalid UUIDs (${results.invalid.length})</h5>
                <div style="max-height: 200px; overflow-y: auto; margin-top: 0.5rem;">
                    ${results.invalid.map(item => 
                        `<div><code>${item.uuid}</code> - ${item.reason}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    output.innerHTML = html;
}

function extractValidUUIDs() {
    const input = document.getElementById('bulkValidate').value.trim();
    
    if (!input) return;
    
    const lines = input.split('\n').filter(line => line.trim());
    const validUUIDs = lines.filter(line => validateUUID(line.trim()).valid);
    
    if (validUUIDs.length > 0) {
        document.getElementById('bulkValidate').value = validUUIDs.join('\n');
        document.getElementById('bulkOutput').innerHTML = `
            <div class="alert alert-success">
                ✅ Extracted ${validUUIDs.length} valid UUID${validUUIDs.length > 1 ? 's' : ''}
            </div>
        `;
    } else {
        document.getElementById('bulkOutput').innerHTML = `
            <div class="alert alert-warning">
                ⚠️ No valid UUIDs found
            </div>
        `;
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.value) {
        element.select();
        document.execCommand('copy');
        
        const btn = event?.target?.closest('button');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        }
    }
}

export function render(container) {
    container.innerHTML = initUUID();
    
    setTimeout(() => {
        // Generate section
        document.getElementById('btnGenerate')?.addEventListener('click', generateUUIDs);
        document.getElementById('btnCopyUUIDs')?.addEventListener('click', () => copyToClipboard('uuidOutput'));
        document.getElementById('btnClearUUIDs')?.addEventListener('click', () => {
            document.getElementById('uuidOutput').value = '';
            document.getElementById('uuidStats').innerHTML = '';
        });
        
        // Single validation
        document.getElementById('btnValidate')?.addEventListener('click', validateSingleUUID);
        document.getElementById('btnClearValidate')?.addEventListener('click', () => {
            document.getElementById('uuidValidate').value = '';
            document.getElementById('validateOutput').innerHTML = '';
        });
        
        // Bulk validation
        document.getElementById('btnBulkValidate')?.addEventListener('click', validateBulkUUIDs);
        document.getElementById('btnExtractValid')?.addEventListener('click', extractValidUUIDs);
        
        // Auto-validate on input
        document.getElementById('uuidValidate')?.addEventListener('input', () => {
            const value = document.getElementById('uuidValidate').value.trim();
            if (value.length >= 32) {
                validateSingleUUID();
            }
        });
        
        // Generate initial UUID
        generateUUIDs();
    }, 100);
}
