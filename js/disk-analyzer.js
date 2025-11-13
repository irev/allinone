// Disk Analyzer Tool
import { utils } from './main.js';

export function render(container) {
    container.innerHTML = initDiskAnalyzer();
    
    // Initialize after render
    setTimeout(() => {
        // Add event listeners for all inputs
        document.getElementById('diskAnalysisType')?.addEventListener('change', updateDiskCommand);
        document.getElementById('dfHuman')?.addEventListener('change', updateDiskCommand);
        document.getElementById('dfTotal')?.addEventListener('change', updateDiskCommand);
        document.getElementById('dfType')?.addEventListener('change', updateDiskCommand);
        document.getElementById('duPath')?.addEventListener('input', updateDiskCommand);
        document.getElementById('duHuman')?.addEventListener('change', updateDiskCommand);
        document.getElementById('duSummary')?.addEventListener('change', updateDiskCommand);
        document.getElementById('duDepth')?.addEventListener('change', updateDiskCommand);
        document.getElementById('duSort')?.addEventListener('change', updateDiskCommand);
        document.getElementById('lsblkFS')?.addEventListener('change', updateDiskCommand);
        document.getElementById('lsblkAll')?.addEventListener('change', updateDiskCommand);
        
        // Initial update
        updateDiskCommand();
        
        // Attach quick command buttons
        const quickBtns = container.querySelectorAll('.btn-secondary.btn-sm');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cmd = btn.textContent;
                if (cmd.includes('df -h')) setQuickDiskCommand('df -h');
                else if (cmd.includes('du -sh')) setQuickDiskCommand('du -sh *');
                else if (cmd.includes('lsblk')) setQuickDiskCommand('lsblk -f');
                else if (cmd.includes('without tmpfs')) setQuickDiskCommand('df -h | grep -v tmpfs');
                else if (cmd.includes('Top 20')) setQuickDiskCommand('du -h --max-depth=1 / | sort -hr | head -20');
                else if (cmd.includes('100MB')) setQuickDiskCommand('find / -type f -size +100M 2>/dev/null');
            });
        });

        // Add copy button to output
        const diskOutput = document.getElementById('diskOutput');
        if (diskOutput) {
            utils.addTextareaActions(diskOutput, {
                showCopy: true,
                showPaste: false
            });
        }

        // Make info sections collapsible
        utils.initAllCollapsibles(container);
    }, 100);
}

function initDiskAnalyzer() {
    return `
        <div class="tool-header">
            <h2>💾 Disk Analyzer</h2>
            <p>Generate disk usage and analysis commands</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Analysis Type</label>
                <select id="diskAnalysisType" class="form-control">
                    <option value="df">Disk Free (df)</option>
                    <option value="du">Disk Usage (du)</option>
                    <option value="lsblk">Block Devices (lsblk)</option>
                    <option value="fdisk">Partition Table (fdisk)</option>
                    <option value="ncdu">Interactive (ncdu)</option>
                </select>
            </div>

            <div id="dfOptions" class="analysis-options">
                <div class="input-group">
                    <label>Display Format</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="dfHuman" checked> -h (human readable)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="dfTotal"> --total (show total)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="dfType"> -T (show filesystem type)
                        </label>
                    </div>
                </div>
            </div>

            <div id="duOptions" class="analysis-options" style="display:none;">
                <div class="input-group">
                    <label>Target Path</label>
                    <input type="text" id="duPath" class="form-control" value="/var/log">
                </div>
                <div class="input-group">
                    <label>Options</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="duHuman" checked> -h (human readable)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="duSummary"> -s (summary only)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="duDepth"> --max-depth=1
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="duSort"> | sort -hr
                        </label>
                    </div>
                </div>
            </div>

            <div id="lsblkOptions" class="analysis-options" style="display:none;">
                <div class="input-group">
                    <label>Display Options</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="lsblkFS" checked> -f (filesystem info)
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="lsblkAll"> -a (all devices)
                        </label>
                    </div>
                </div>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="diskOutput" class="form-control" readonly rows="3"></textarea>
            </div>

            <div class="input-group">
                <label>Quick Commands</label>
                <div class="button-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    <button class="btn-secondary btn-sm">df -h</button>
                    <button class="btn-secondary btn-sm">du -sh *</button>
                    <button class="btn-secondary btn-sm">lsblk -f</button>
                    <button class="btn-secondary btn-sm">df without tmpfs</button>
                    <button class="btn-secondary btn-sm">Top 20 largest dirs</button>
                    <button class="btn-secondary btn-sm">Files > 100MB</button>
                </div>
            </div>

            <div class="input-group">
                <label>Command Explanation</label>
                <div id="diskExplanation" class="form-control" style="min-height: 80px; background: var(--bg-secondary); padding: 1rem; white-space: pre-wrap;"></div>
            </div>
        </div>
    `;
}

function updateDiskCommand() {
    const type = document.getElementById('diskAnalysisType').value;
    let command = '';
    let explanation = '';

    // Show/hide relevant options
    document.getElementById('dfOptions').style.display = type === 'df' ? 'block' : 'none';
    document.getElementById('duOptions').style.display = type === 'du' ? 'block' : 'none';
    document.getElementById('lsblkOptions').style.display = type === 'lsblk' ? 'block' : 'none';

    switch(type) {
        case 'df':
            command = 'df';
            if (document.getElementById('dfHuman')?.checked) command += ' -h';
            if (document.getElementById('dfTotal')?.checked) command += ' --total';
            if (document.getElementById('dfType')?.checked) command += ' -T';
            explanation = 'Show disk space usage for all mounted filesystems';
            break;
        case 'du':
            command = 'du';
            if (document.getElementById('duHuman')?.checked) command += ' -h';
            if (document.getElementById('duSummary')?.checked) command += ' -s';
            if (document.getElementById('duDepth')?.checked) command += ' --max-depth=1';
            const path = document.getElementById('duPath')?.value || '/var/log';
            command += ' ' + path;
            if (document.getElementById('duSort')?.checked) command += ' | sort -hr';
            explanation = `Analyze disk usage in ${path}`;
            break;
        case 'lsblk':
            command = 'lsblk';
            if (document.getElementById('lsblkFS')?.checked) command += ' -f';
            if (document.getElementById('lsblkAll')?.checked) command += ' -a';
            explanation = 'List all block devices and partitions';
            break;
        case 'fdisk':
            command = 'sudo fdisk -l';
            explanation = 'Display partition table (requires sudo)';
            break;
        case 'ncdu':
            command = 'ncdu /';
            explanation = 'Interactive disk usage analyzer (install: sudo apt install ncdu)';
            break;
    }

    document.getElementById('diskOutput').value = command;
    document.getElementById('diskExplanation').textContent = explanation;
}

function setQuickDiskCommand(cmd) {
    document.getElementById('diskOutput').value = cmd;
    let explanation = '';
    if (cmd.includes('df -h')) explanation = 'Show disk free space in human readable format';
    else if (cmd.includes('du -sh')) explanation = 'Show size of all items in current directory';
    else if (cmd.includes('lsblk')) explanation = 'List block devices with filesystem info';
    else if (cmd.includes('tmpfs')) explanation = 'Show disk usage excluding temporary filesystems';
    else if (cmd.includes('sort -hr')) explanation = 'Find top 20 largest directories';
    else if (cmd.includes('find')) explanation = 'Find all files larger than 100MB';
    document.getElementById('diskExplanation').textContent = explanation;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
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
