// Grep Command Builder Tool
export function render(container) {
    container.innerHTML = initGrepBuilder();
}

function initGrepBuilder() {
    return `
        <div class="tool-header">
            <h2>🔎 Grep Command Builder</h2>
            <p>Build grep/egrep/awk search patterns</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Search Pattern</label>
                <input type="text" id="grepPattern" class="form-control" placeholder="error|warning|critical">
                <span class="hint">Use regex patterns or simple text</span>
            </div>

            <div class="input-group">
                <label>Target File/Path</label>
                <input type="text" id="grepTarget" class="form-control" value="/var/log/syslog" placeholder="/path/to/file or directory/*">
            </div>

            <div class="input-group">
                <label>Grep Type</label>
                <select id="grepType" class="form-control">
                    <option value="grep">grep (basic)</option>
                    <option value="egrep">egrep (extended regex)</option>
                    <option value="grep -E">grep -E (extended)</option>
                    <option value="rg">ripgrep (fast)</option>
                </select>
            </div>

            <div class="input-group">
                <label>Options</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepIgnoreCase" checked> -i (ignore case)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepRecursive"> -r (recursive)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepLineNumber" checked> -n (line numbers)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepCount"> -c (count matches)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepInvert"> -v (invert match)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="grepColor" checked> --color (highlight)
                    </label>
                </div>
            </div>

            <div class="input-group">
                <label>Context Lines</label>
                <select id="grepContext" class="form-control">
                    <option value="">No context</option>
                    <option value="-A 3">After 3 lines</option>
                    <option value="-B 3">Before 3 lines</option>
                    <option value="-C 3">Around 3 lines</option>
                    <option value="-C 5">Around 5 lines</option>
                </select>
            </div>

            <div class="button-group">
                <button class="btn-primary" onclick="generateGrepCommand()">
                    🔧 Generate Command
                </button>
                <button class="btn-secondary" onclick="clearGrepForm()">
                    🔄 Clear
                </button>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="grepOutput" class="form-control" readonly rows="4"></textarea>
                <button class="btn-copy-inline" onclick="copyToClipboard('grepOutput')">📋 Copy</button>
            </div>

            <div class="input-group">
                <label>Example Use Cases</label>
                <div class="form-control" style="background: var(--bg-secondary); padding: 1rem;">
                    <strong>Common Patterns:</strong><br>
                    • Search errors: <code>error|ERROR|Error</code><br>
                    • IP addresses: <code>[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}</code><br>
                    • Email: <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}</code><br>
                    • URLs: <code>https?://[^\s]+</code>
                </div>
            </div>
        </div>
    `;
}

function generateGrepCommand() {
    const pattern = document.getElementById('grepPattern').value.trim();
    const target = document.getElementById('grepTarget').value.trim();
    const type = document.getElementById('grepType').value;

    if (!pattern) {
        document.getElementById('grepOutput').value = 'Error: Please enter a search pattern';
        return;
    }

    let command = type;
    let options = [];

    if (document.getElementById('grepIgnoreCase').checked) options.push('-i');
    if (document.getElementById('grepRecursive').checked) options.push('-r');
    if (document.getElementById('grepLineNumber').checked) options.push('-n');
    if (document.getElementById('grepCount').checked) options.push('-c');
    if (document.getElementById('grepInvert').checked) options.push('-v');
    if (document.getElementById('grepColor').checked) options.push('--color=auto');

    const context = document.getElementById('grepContext').value;
    if (context) options.push(context);

    if (options.length > 0) {
        command += ' ' + options.join(' ');
    }

    command += ` "${pattern}" ${target || '.'}`;

    document.getElementById('grepOutput').value = command;
}

function clearGrepForm() {
    document.getElementById('grepPattern').value = '';
    document.getElementById('grepTarget').value = '/var/log/syslog';
    document.getElementById('grepType').value = 'grep';
    document.getElementById('grepIgnoreCase').checked = true;
    document.getElementById('grepRecursive').checked = false;
    document.getElementById('grepLineNumber').checked = true;
    document.getElementById('grepCount').checked = false;
    document.getElementById('grepInvert').checked = false;
    document.getElementById('grepColor').checked = true;
    document.getElementById('grepContext').value = '';
    document.getElementById('grepOutput').value = '';
}
