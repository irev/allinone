// Find Command Generator Tool
import { utils } from './main.js';

export function render(container) {
    container.innerHTML = initFindGenerator();
    
    // Add event listeners after render
    setTimeout(() => {
        document.getElementById('findPath')?.addEventListener('input', generateFindCommand);
        document.getElementById('findType')?.addEventListener('change', generateFindCommand);
        document.getElementById('findName')?.addEventListener('input', generateFindCommand);
        document.getElementById('findTime')?.addEventListener('change', generateFindCommand);
        document.getElementById('findSize')?.addEventListener('change', generateFindCommand);
        document.getElementById('findPerm')?.addEventListener('change', generateFindCommand);
        
        // Button listeners
        document.getElementById('btnGenerateFind')?.addEventListener('click', generateFindCommand);
        document.getElementById('btnClearFind')?.addEventListener('click', clearFindForm);
        document.getElementById('btnExportFind')?.addEventListener('click', exportFindCommand);
        
        // Auto-generate with default values
        generateFindCommand();

        // Add copy button to output
        const findOutput = document.getElementById('findOutput');
        if (findOutput) {
            utils.addTextareaActions(findOutput, {
                showCopy: true,
                showPaste: false
            });
        }

        // Make info sections collapsible
        utils.initAllCollapsibles(container);
    }, 100);
}

function initFindGenerator() {
    // Auto-generate on first load
    setTimeout(() => generateFindCommand(), 150);
    
    return `
        <div class="tool-header">
            <h2>🔍 Find Command Generator</h2>
            <p>Generate Linux find command with filters</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Search Path</label>
                <input type="text" id="findPath" class="form-control" value="/var/log" placeholder="/path/to/search">
            </div>

            <div class="input-group">
                <label>File Type</label>
                <select id="findType" class="form-control">
                    <option value="">Any</option>
                    <option value="f">File</option>
                    <option value="d">Directory</option>
                    <option value="l">Symbolic Link</option>
                </select>
            </div>

            <div class="input-group">
                <label>Name Pattern</label>
                <input type="text" id="findName" class="form-control" placeholder="*.log">
                <span class="hint">Use wildcards: *.txt, file*, *name*</span>
            </div>

            <div class="input-group">
                <label>Modified Time</label>
                <select id="findTime" class="form-control">
                    <option value="">Any</option>
                    <option value="-mtime -1">Last 24 hours</option>
                    <option value="-mtime -7">Last 7 days</option>
                    <option value="-mtime -30">Last 30 days</option>
                    <option value="-mtime +30">Older than 30 days</option>
                </select>
            </div>

            <div class="input-group">
                <label>File Size</label>
                <select id="findSize" class="form-control">
                    <option value="">Any</option>
                    <option value="-size +100M">Larger than 100MB</option>
                    <option value="-size +1G">Larger than 1GB</option>
                    <option value="-size -1M">Smaller than 1MB</option>
                </select>
            </div>

            <div class="input-group">
                <label>Permissions</label>
                <select id="findPerm" class="form-control">
                    <option value="">Any</option>
                    <option value="-perm /4000">SUID files</option>
                    <option value="-perm /2000">SGID files</option>
                    <option value="-perm 777">777 (all permissions)</option>
                    <option value="-perm /o+w">World-writable</option>
                </select>
            </div>

            <div class="button-group">
                <button class="btn-primary" id="btnGenerateFind">
                    🔧 Generate Command
                </button>
                <button class="btn-secondary" id="btnClearFind">
                    🔄 Clear
                </button>
                <button class="btn-secondary" id="btnExportFind">
                    💾 Export
                </button>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="findOutput" class="form-control" readonly rows="4"></textarea>
            </div>

            <div class="input-group">
                <label>Command Explanation</label>
                <div id="findExplanation" class="form-control" style="min-height: 60px; background: var(--bg-secondary); padding: 1rem; white-space: pre-wrap;"></div>
            </div>
        </div>
    `;
}

function generateFindCommand() {
    const path = document.getElementById('findPath').value.trim() || '/';
    const type = document.getElementById('findType').value;
    const name = document.getElementById('findName').value.trim();
    const time = document.getElementById('findTime').value;
    const size = document.getElementById('findSize').value;
    const perm = document.getElementById('findPerm').value;

    let command = `find ${path}`;
    let explanation = `Search in: ${path}\n`;

    if (type) {
        command += ` -type ${type}`;
        const typeMap = { f: 'files', d: 'directories', l: 'symbolic links' };
        explanation += `Type: ${typeMap[type]}\n`;
    }

    if (name) {
        command += ` -name "${name}"`;
        explanation += `Name pattern: ${name}\n`;
    }

    if (time) {
        command += ` ${time}`;
        explanation += `Time filter: ${time.replace('-mtime ', '')}\n`;
    }

    if (size) {
        command += ` ${size}`;
        explanation += `Size filter: ${size.replace('-size ', '')}\n`;
    }

    if (perm) {
        command += ` ${perm}`;
        explanation += `Permission: ${perm}\n`;
    }

    document.getElementById('findOutput').value = command;
    document.getElementById('findExplanation').textContent = explanation;
}

function clearFindForm() {
    document.getElementById('findPath').value = '/var/log';
    document.getElementById('findType').value = '';
    document.getElementById('findName').value = '';
    document.getElementById('findTime').value = '';
    document.getElementById('findSize').value = '';
    document.getElementById('findPerm').value = '';
    document.getElementById('findOutput').value = '';
    document.getElementById('findExplanation').textContent = '';
    generateFindCommand();
}

function exportFindCommand() {
    const command = document.getElementById('findOutput').value;
    if (!command) return;
    
    const blob = new Blob([command], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'find-command.sh';
    a.click();
    URL.revokeObjectURL(url);
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.select();
        document.execCommand('copy');
        
        // Visual feedback
        const btn = event.target.closest('button');
        if (btn) {
            const originalText = btn.innerHTML;
            btn.innerHTML = '✅ Copied!';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        }
    }
}
