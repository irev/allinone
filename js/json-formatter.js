/**
 * JSON Formatter/Validator
 * Features: Beautify, Minify, Validate, Sort keys
 */

function initJSONFormatter() {
    return `
        <div class="tool-header">
            <h2>JSON Formatter & Validator</h2>
            <p>Beautify, minify, validate, and analyze JSON data</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Input JSON</h3>
            </div>
            <div class="card-body">
                <textarea 
                    id="jsonInput" 
                    class="form-control" 
                    rows="12" 
                    placeholder='{"name": "John", "age": 30, "city": "New York"}'
                ></textarea>
                
                <div class="button-group" style="margin-top: 1rem;">
                    <button id="btnBeautify" class="btn btn-primary">
                        ✨ Beautify
                    </button>
                    <button id="btnMinify" class="btn btn-secondary">
                        📦 Minify
                    </button>
                    <button id="btnSort" class="btn btn-secondary">
                        🔤 Sort Keys
                    </button>
                    <button id="btnValidate" class="btn btn-secondary">
                        ✅ Validate
                    </button>
                    <button id="btnClear" class="btn btn-secondary">
                        🗑️ Clear
                    </button>
                </div>
                
                <div id="jsonStatus" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Output</h3>
            </div>
            <div class="card-body">
                <textarea 
                    id="jsonOutput" 
                    class="form-control" 
                    rows="12" 
                    readonly
                ></textarea>
                
                <div class="button-group" style="margin-top: 1rem;">
                    <button id="btnCopyJSON" class="btn btn-primary">
                        📋 Copy Output
                    </button>
                    <button id="btnSwap" class="btn btn-secondary">
                        ⇄ Swap Input ↔ Output
                    </button>
                </div>
                
                <div id="jsonInfo" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 Features</h4>
            <ul>
                <li><strong>Beautify:</strong> Format JSON with indentation (2 spaces)</li>
                <li><strong>Minify:</strong> Remove all whitespace to reduce size</li>
                <li><strong>Sort Keys:</strong> Alphabetically sort object keys</li>
                <li><strong>Validate:</strong> Check JSON syntax and show detailed errors</li>
                <li><strong>Analysis:</strong> Show size, depth, and structure info</li>
            </ul>
        </div>
    `;
}

function beautifyJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');
    const info = document.getElementById('jsonInfo');
    
    try {
        const parsed = JSON.parse(input);
        const beautified = JSON.stringify(parsed, null, 2);
        output.value = beautified;
        
        showStatus(status, 'success', '✅ JSON is valid and beautified!');
        showJSONInfo(info, input, beautified, parsed);
    } catch (error) {
        showStatus(status, 'error', `❌ Invalid JSON: ${error.message}`);
        output.value = '';
        info.innerHTML = '';
    }
}

function minifyJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');
    const info = document.getElementById('jsonInfo');
    
    try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        output.value = minified;
        
        showStatus(status, 'success', '✅ JSON is valid and minified!');
        showJSONInfo(info, input, minified, parsed);
    } catch (error) {
        showStatus(status, 'error', `❌ Invalid JSON: ${error.message}`);
        output.value = '';
        info.innerHTML = '';
    }
}

function sortKeysJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    const output = document.getElementById('jsonOutput');
    const status = document.getElementById('jsonStatus');
    const info = document.getElementById('jsonInfo');
    
    try {
        const parsed = JSON.parse(input);
        const sorted = sortObjectKeys(parsed);
        const beautified = JSON.stringify(sorted, null, 2);
        output.value = beautified;
        
        showStatus(status, 'success', '✅ JSON keys sorted alphabetically!');
        showJSONInfo(info, input, beautified, sorted);
    } catch (error) {
        showStatus(status, 'error', `❌ Invalid JSON: ${error.message}`);
        output.value = '';
        info.innerHTML = '';
    }
}

function sortObjectKeys(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => sortObjectKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
        const sorted = {};
        Object.keys(obj).sort().forEach(key => {
            sorted[key] = sortObjectKeys(obj[key]);
        });
        return sorted;
    }
    return obj;
}

function validateJSON() {
    const input = document.getElementById('jsonInput').value.trim();
    const status = document.getElementById('jsonStatus');
    const info = document.getElementById('jsonInfo');
    
    if (!input) {
        showStatus(status, 'warning', '⚠️ Please enter JSON data');
        info.innerHTML = '';
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        const beautified = JSON.stringify(parsed, null, 2);
        
        showStatus(status, 'success', '✅ JSON is valid!');
        showJSONInfo(info, input, beautified, parsed);
    } catch (error) {
        showStatus(status, 'error', `❌ Invalid JSON: ${error.message}`);
        
        // Try to find error position
        const match = error.message.match(/position (\d+)/);
        if (match) {
            const position = parseInt(match[1]);
            const lines = input.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            
            info.innerHTML = `
                <div class="alert alert-danger">
                    <strong>Error Location:</strong> Line ${line}, Column ${column}
                </div>
            `;
        } else {
            info.innerHTML = '';
        }
    }
}

function showJSONInfo(element, original, formatted, parsed) {
    const originalSize = new Blob([original]).size;
    const formattedSize = new Blob([formatted]).size;
    const compression = ((1 - formattedSize / originalSize) * 100).toFixed(1);
    
    const depth = getJSONDepth(parsed);
    const keys = countKeys(parsed);
    const type = Array.isArray(parsed) ? 'Array' : 'Object';
    
    element.innerHTML = `
        <div class="alert alert-info">
            <strong>📊 JSON Analysis:</strong><br>
            Type: ${type} | 
            Depth: ${depth} levels | 
            Keys: ${keys} | 
            Size: ${originalSize} → ${formattedSize} bytes 
            ${compression < 0 ? `(+${Math.abs(compression)}%)` : `(-${compression}%)`}
        </div>
    `;
}

function getJSONDepth(obj, currentDepth = 1) {
    if (obj === null || typeof obj !== 'object') {
        return currentDepth;
    }
    
    if (Object.keys(obj).length === 0) {
        return currentDepth;
    }
    
    const depths = Object.values(obj).map(value => getJSONDepth(value, currentDepth + 1));
    return Math.max(...depths);
}

function countKeys(obj) {
    let count = 0;
    
    function traverse(o) {
        if (o !== null && typeof o === 'object') {
            count += Object.keys(o).length;
            Object.values(o).forEach(traverse);
        }
    }
    
    traverse(obj);
    return count;
}

function swapJSON() {
    const input = document.getElementById('jsonInput');
    const output = document.getElementById('jsonOutput');
    
    const temp = input.value;
    input.value = output.value;
    output.value = temp;
}

function clearJSON() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('jsonOutput').value = '';
    document.getElementById('jsonStatus').innerHTML = '';
    document.getElementById('jsonInfo').innerHTML = '';
}

function showStatus(element, type, message) {
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    element.innerHTML = `
        <div style="padding: 0.75rem; background: ${colors[type]}15; border-left: 3px solid ${colors[type]}; border-radius: 4px; color: ${colors[type]}; font-weight: 500;">
            ${message}
        </div>
    `;
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
    container.innerHTML = initJSONFormatter();
    
    setTimeout(() => {
        // Action buttons
        document.getElementById('btnBeautify')?.addEventListener('click', beautifyJSON);
        document.getElementById('btnMinify')?.addEventListener('click', minifyJSON);
        document.getElementById('btnSort')?.addEventListener('click', sortKeysJSON);
        document.getElementById('btnValidate')?.addEventListener('click', validateJSON);
        document.getElementById('btnClear')?.addEventListener('click', clearJSON);
        
        // Utility buttons
        document.getElementById('btnCopyJSON')?.addEventListener('click', () => copyToClipboard('jsonOutput'));
        document.getElementById('btnSwap')?.addEventListener('click', swapJSON);
        
        // Auto-format on input (debounced)
        let timeout;
        document.getElementById('jsonInput')?.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(validateJSON, 500);
        });
    }, 100);
}
