/**
 * Shell Command Explainer
 * Explain Linux/Unix shell commands and their security implications
 */

import { utils } from './main.js';

function initShellExplainer() {
    return `
        <div class="tool-header">
            <h2>Shell Command Explainer</h2>
            <p>Understand complex shell commands and their security implications</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Command Input</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Enter Shell Command</label>
                    <textarea 
                        id="shellCommand" 
                        class="form-control" 
                        rows="4"
                        placeholder="find / -type f -perm /4000 -ls 2>/dev/null"
                        style="font-family: 'Courier New', monospace;"
                    ></textarea>
                </div>
                
                <button id="btnExplain" class="btn btn-primary">
                    🔍 Explain Command
                </button>
                
                <div id="explanation" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Example Commands</h3>
            </div>
            <div class="card-body">
                <div id="exampleCommands"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>⚠️ Security Warning</h4>
            <p>Always understand commands before running them, especially:</p>
            <ul>
                <li>Commands with <code>sudo</code> or <code>su</code></li>
                <li>File system modifications (<code>rm</code>, <code>chmod</code>, <code>chown</code>)</li>
                <li>Network operations (<code>curl</code>, <code>wget</code> with pipes to <code>sh</code>)</li>
                <li>Commands from untrusted sources</li>
            </ul>
        </div>
    `;
}

const commandDatabase = {
    // Core utilities
    'find': {
        description: 'Search for files in directory hierarchy',
        options: {
            '/': 'Start from root directory (entire system)',
            '-type f': 'Search only for regular files',
            '-type d': 'Search only for directories',
            '-name': 'Search by filename pattern',
            '-perm': 'Search by file permissions',
            '-user': 'Search by file owner',
            '-mtime': 'Modified time in days',
            '-size': 'Search by file size',
            '-exec': 'Execute command on each found file',
            '2>/dev/null': 'Redirect errors to null (suppress error messages)'
        },
        security: 'SUID files (-perm /4000) can be exploited for privilege escalation'
    },
    'grep': {
        description: 'Search text patterns in files',
        options: {
            '-r': 'Recursive search',
            '-i': 'Ignore case',
            '-v': 'Invert match (exclude)',
            '-n': 'Show line numbers',
            '-E': 'Extended regex',
            '-o': 'Show only matching part'
        }
    },
    'chmod': {
        description: 'Change file permissions',
        options: {
            '777': 'rwxrwxrwx - Full permissions for everyone (DANGEROUS)',
            '755': 'rwxr-xr-x - Owner can write, others can read/execute',
            '644': 'rw-r--r-- - Owner can write, others can read',
            '600': 'rw------- - Only owner can read/write',
            '+x': 'Add execute permission',
            '-w': 'Remove write permission'
        },
        security: 'chmod 777 is dangerous - gives full access to everyone'
    },
    'sudo': {
        description: 'Execute command as superuser',
        security: 'CRITICAL: Runs commands with root privileges. Verify command before running!'
    },
    'rm': {
        description: 'Remove files or directories',
        options: {
            '-r': 'Recursive (delete directories)',
            '-f': 'Force (no confirmation)',
            '-rf': 'Force recursive delete (VERY DANGEROUS)'
        },
        security: 'DANGER: rm -rf can delete entire system if used incorrectly!'
    },
    'curl': {
        description: 'Transfer data from/to server',
        options: {
            '-X': 'HTTP method (GET, POST, etc)',
            '-H': 'Add custom header',
            '-d': 'Send data in POST request',
            '-o': 'Save output to file',
            '-L': 'Follow redirects',
            '| sh': 'DANGER: Pipe output directly to shell'
        },
        security: 'Never pipe untrusted URLs to shell: curl url | sh'
    },
    'netstat': {
        description: 'Network statistics and connections',
        options: {
            '-tuln': 'Show TCP/UDP listening ports with numbers',
            '-anp': 'Show all connections with program names',
            '-r': 'Show routing table'
        }
    },
    'ps': {
        description: 'Process status',
        options: {
            'aux': 'Show all processes for all users',
            'ef': 'Full format listing',
            '-p': 'Select by PID'
        }
    },
    'awk': {
        description: 'Pattern scanning and text processing',
        options: {
            '{print $1}': 'Print first column',
            '-F': 'Field separator'
        }
    },
    'sed': {
        description: 'Stream editor for text transformation',
        options: {
            's/old/new/': 'Substitute old with new',
            '-i': 'Edit file in-place',
            '-n': 'Suppress automatic output'
        }
    },
    'nc': {
        description: 'Netcat - network utility for reading/writing network connections',
        security: 'Can be used for reverse shells and backdoors'
    },
    'wget': {
        description: 'Download files from web',
        options: {
            '-O': 'Output filename',
            '-r': 'Recursive download',
            '| sh': 'DANGER: Pipe to shell'
        },
        security: 'Never pipe untrusted URLs to shell'
    }
};

const exampleCommands = [
    {
        cmd: 'find / -type f -perm /4000 -ls 2>/dev/null',
        desc: 'Find SUID files (potential privilege escalation)',
        category: 'Security Audit'
    },
    {
        cmd: 'ps aux | grep -v grep | grep nginx',
        desc: 'Find nginx processes (exclude grep itself)',
        category: 'Process Management'
    },
    {
        cmd: 'netstat -tuln | grep LISTEN',
        desc: 'Show all listening ports',
        category: 'Network Analysis'
    },
    {
        cmd: 'find . -name "*.log" -mtime +30 -delete',
        desc: 'Delete log files older than 30 days',
        category: 'File Management'
    },
    {
        cmd: 'tar czf backup.tar.gz /etc /var/www',
        desc: 'Create compressed backup of config and web files',
        category: 'Backup'
    },
    {
        cmd: 'awk \'{print $1}\' access.log | sort | uniq -c | sort -rn | head -10',
        desc: 'Top 10 IP addresses from access log',
        category: 'Log Analysis'
    },
    {
        cmd: 'grep -r "password" /var/www',
        desc: 'Search for hardcoded passwords in web directory',
        category: 'Security Audit'
    },
    {
        cmd: 'curl -I https://example.com',
        desc: 'Check HTTP headers only (no body)',
        category: 'Network'
    }
];

function explainCommand() {
    const command = document.getElementById('shellCommand').value.trim();
    const explanationDiv = document.getElementById('explanation');
    
    if (!command) {
        explanationDiv.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a command</div>';
        return;
    }
    
    let html = '<div class="alert alert-info">';
    html += '<h4 style="margin-top: 0;">📝 Command Breakdown:</h4>';
    
    // Split by pipes and semicolons
    const parts = command.split(/[|;]/).map(p => p.trim());
    
    html += '<ol style="margin: 0;">';
    parts.forEach((part, i) => {
        html += `<li><code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px;">${escapeHtml(part)}</code></li>`;
        html += explainPart(part);
    });
    html += '</ol>';
    html += '</div>';
    
    // Security warnings
    const warnings = detectSecurityIssues(command);
    if (warnings.length > 0) {
        html += '<div class="alert alert-danger">';
        html += '<h4 style="margin-top: 0;">⚠️ Security Warnings:</h4>';
        html += '<ul style="margin: 0;">';
        warnings.forEach(w => {
            html += `<li><strong>${w}</strong></li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    // Usage tips
    const tips = generateTips(command);
    if (tips.length > 0) {
        html += '<div class="alert alert-secondary">';
        html += '<h4 style="margin-top: 0;">💡 Tips:</h4>';
        html += '<ul style="margin: 0;">';
        tips.forEach(t => {
            html += `<li>${t}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }
    
    explanationDiv.innerHTML = html;
}

function explainPart(part) {
    let explanation = '<ul style="font-size: 0.9rem; margin: 0.5rem 0;">';
    
    // Find base command
    const words = part.split(/\s+/);
    const baseCmd = words[0];
    
    if (commandDatabase[baseCmd]) {
        const info = commandDatabase[baseCmd];
        explanation += `<li><strong>${baseCmd}:</strong> ${info.description}</li>`;
        
        // Explain options
        if (info.options) {
            words.slice(1).forEach(word => {
                for (const [opt, desc] of Object.entries(info.options)) {
                    if (word.includes(opt)) {
                        explanation += `<li><code>${escapeHtml(opt)}</code> - ${desc}</li>`;
                    }
                }
            });
        }
    } else {
        explanation += `<li><em>Base command: ${escapeHtml(baseCmd)}</em></li>`;
    }
    
    explanation += '</ul>';
    return explanation;
}

function detectSecurityIssues(command) {
    const warnings = [];
    
    if (command.includes('sudo') || command.includes('su ')) {
        warnings.push('Command uses elevated privileges (sudo/su) - verify before running!');
    }
    
    if (command.match(/rm\s+-rf\s+\//)) {
        warnings.push('CRITICAL: rm -rf on root directory - THIS CAN DESTROY YOUR SYSTEM!');
    }
    
    if (command.includes('chmod 777')) {
        warnings.push('chmod 777 grants full permissions to everyone - major security risk!');
    }
    
    if (command.match(/(curl|wget).*\|\s*(sh|bash)/)) {
        warnings.push('Piping remote script directly to shell - verify source is trusted!');
    }
    
    if (command.includes('-perm /4000') || command.includes('-perm /2000')) {
        warnings.push('Searching for SUID/SGID files - used for privilege escalation analysis');
    }
    
    if (command.includes('nc ') && command.includes('-e')) {
        warnings.push('Netcat with -e can create reverse shells - potential backdoor!');
    }
    
    if (command.match(/>\s*\/dev\/sd[a-z]/)) {
        warnings.push('Writing directly to disk device - CAN DESTROY DATA!');
    }
    
    if (command.includes(':(){ :|:& };:')) {
        warnings.push('FORK BOMB DETECTED - This will crash your system!');
    }
    
    return warnings;
}

function generateTips(command) {
    const tips = [];
    
    if (command.includes('find') && !command.includes('2>')) {
        tips.push('Add <code>2>/dev/null</code> to suppress permission errors');
    }
    
    if (command.includes('grep') && !command.includes('-i')) {
        tips.push('Use <code>-i</code> flag for case-insensitive search');
    }
    
    if (command.includes('rm') && !command.includes('-i')) {
        tips.push('Consider using <code>-i</code> flag for interactive confirmation');
    }
    
    if (command.includes('|') && command.split('|').length > 3) {
        tips.push('Long pipelines can be hard to debug - consider breaking into steps');
    }
    
    if (command.includes('awk') || command.includes('sed')) {
        tips.push('Test on sample data first before running on production files');
    }
    
    return tips;
}

function loadExample(cmd) {
    document.getElementById('shellCommand').value = cmd;
    explainCommand();
}

function displayExamples() {
    const container = document.getElementById('exampleCommands');
    
    const categories = [...new Set(exampleCommands.map(e => e.category))];
    
    let html = '';
    categories.forEach(cat => {
        html += `<h4 style="margin-top: 1rem;">${cat}</h4>`;
        html += '<div style="display: grid; gap: 0.5rem;">';
        
        exampleCommands
            .filter(e => e.category === cat)
            .forEach(ex => {
                html += `
                    <button class="btn btn-sm btn-secondary example-cmd-btn" style="text-align: left; justify-content: flex-start; flex-direction: column; align-items: flex-start;">
                        <code style="font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">${escapeHtml(ex.cmd)}</code>
                        <small style="opacity: 0.8;">${ex.desc}</small>
                    </button>
                `;
            });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    const buttons = container.querySelectorAll('.example-cmd-btn');
    buttons.forEach((btn, i) => {
        const cmdIndex = Array.from(buttons).indexOf(btn);
        btn.addEventListener('click', () => {
            const foundCmd = exampleCommands.find((_, idx) => {
                let count = 0;
                for (let j = 0; j < exampleCommands.length; j++) {
                    if (count === cmdIndex) return j === idx;
                    count++;
                }
                return false;
            });
            if (foundCmd) loadExample(foundCmd.cmd);
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initShellExplainer();
    
    setTimeout(() => {
        document.getElementById('btnExplain')?.addEventListener('click', explainCommand);
        
        // Explain on Ctrl+Enter
        document.getElementById('shellCommand')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                explainCommand();
            }
        });
        
        displayExamples();

        // Add copy/paste buttons to textarea
        const shellCommand = document.getElementById('shellCommand');
        if (shellCommand) {
            utils.addTextareaActions(shellCommand, {
                showCopy: true,
                showPaste: true
            });
        }
    }, 100);
}
