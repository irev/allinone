// Service Control Tool
export function render(container) {
    container.innerHTML = initServiceControl();
    
    // Initialize after render
    setTimeout(() => {
        // Add event listeners
        document.getElementById('serviceName')?.addEventListener('input', updateServiceCommand);
        document.getElementById('serviceAction')?.addEventListener('change', updateServiceCommand);
        document.getElementById('serviceSudo')?.addEventListener('change', updateServiceCommand);
        document.getElementById('logType')?.addEventListener('change', updateLogCommand);
        
        // Initial update
        updateServiceCommand();
        
        // Copy buttons
        document.getElementById('btnCopyService')?.addEventListener('click', () => copyToClipboard('serviceOutput'));
        document.getElementById('btnCopyLog')?.addEventListener('click', () => copyToClipboard('logOutput'));
        
        // Attach quick service buttons
        const quickBtns = container.querySelectorAll('.btn-secondary.btn-sm');
        const commands = [
            'systemctl list-units --type=service',
            'systemctl list-unit-files --type=service',
            'systemctl --failed',
            'systemctl daemon-reload',
            'systemd-analyze blame',
            'journalctl -xe'
        ];
        quickBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                setQuickService(commands[index]);
            });
        });
    }, 100);
}

function initServiceControl() {
    return `
        <div class="tool-header">
            <h2>⚙️ Service Control</h2>
            <p>Generate systemd and service management commands</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Service Name</label>
                <input type="text" id="serviceName" class="form-control" placeholder="nginx">
                <span class="hint">Example: nginx, apache2, mysql, ssh</span>
            </div>

            <div class="input-group">
                <label>Action</label>
                <select id="serviceAction" class="form-control">
                    <option value="status">status (check status)</option>
                    <option value="start">start (start service)</option>
                    <option value="stop">stop (stop service)</option>
                    <option value="restart">restart (restart service)</option>
                    <option value="reload">reload (reload config)</option>
                    <option value="enable">enable (auto-start on boot)</option>
                    <option value="disable">disable (prevent auto-start)</option>
                    <option value="is-active">is-active (check if running)</option>
                    <option value="is-enabled">is-enabled (check if enabled)</option>
                </select>
            </div>

            <div class="input-group">
                <label>Use sudo</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="serviceSudo" checked> Prefix with sudo
                    </label>
                </div>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="serviceOutput" class="form-control" readonly rows="2"></textarea>
                <button class="btn-copy-inline" id="btnCopyService">📋 Copy</button>
            </div>

            <div class="input-group">
                <label>Log Viewer Commands</label>
                <select id="logType" class="form-control">
                    <option value="">-- Select Log Type --</option>
                    <option value="unit">View service logs</option>
                    <option value="follow">Follow logs (live)</option>
                    <option value="today">Today's logs</option>
                    <option value="errors">Errors only</option>
                    <option value="boot">Since last boot</option>
                </select>
            </div>

            <div class="input-group">
                <label>Log Command</label>
                <textarea id="logOutput" class="form-control" readonly rows="2"></textarea>
                <button class="btn-copy-inline" id="btnCopyLog">📋 Copy</button>
            </div>

            <div class="input-group">
                <label>Quick Service Commands</label>
                <div class="button-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem;">
                    <button class="btn-secondary btn-sm">List all services</button>
                    <button class="btn-secondary btn-sm">List service files</button>
                    <button class="btn-secondary btn-sm">Failed services</button>
                    <button class="btn-secondary btn-sm">Reload daemon</button>
                    <button class="btn-secondary btn-sm">Boot time analysis</button>
                    <button class="btn-secondary btn-sm">System logs</button>
                </div>
            </div>

            <div class="input-group">
                <label>Common Services Reference</label>
                <div class="form-control" style="background: var(--bg-secondary); padding: 1rem;">
                    <strong>Web Servers:</strong> nginx, apache2, httpd<br>
                    <strong>Databases:</strong> mysql, mariadb, postgresql, mongod<br>
                    <strong>Network:</strong> ssh, sshd, networking, network-manager<br>
                    <strong>Docker:</strong> docker, containerd<br>
                    <strong>Other:</strong> cron, rsyslog, ufw, fail2ban
                </div>
            </div>
        </div>
    `;
}

function updateServiceCommand() {
    const serviceName = document.getElementById('serviceName').value.trim();
    const action = document.getElementById('serviceAction').value;
    const useSudo = document.getElementById('serviceSudo').checked;

    if (!serviceName) {
        document.getElementById('serviceOutput').value = 'Enter a service name';
        return;
    }

    let command = useSudo ? 'sudo ' : '';
    command += `systemctl ${action} ${serviceName}`;

    document.getElementById('serviceOutput').value = command;
}

function updateLogCommand() {
    const serviceName = document.getElementById('serviceName').value.trim();
    const logType = document.getElementById('logType').value;

    if (!serviceName) {
        document.getElementById('logOutput').value = 'Enter a service name first';
        return;
    }

    let command = 'journalctl';

    switch(logType) {
        case 'unit':
            command += ` -u ${serviceName}`;
            break;
        case 'follow':
            command += ` -u ${serviceName} -f`;
            break;
        case 'today':
            command += ` -u ${serviceName} -S today`;
            break;
        case 'errors':
            command += ` -u ${serviceName} -p err`;
            break;
        case 'boot':
            command += ` -u ${serviceName} -b`;
            break;
        default:
            command = 'Select a log type';
    }

    document.getElementById('logOutput').value = command;
}

function setQuickService(cmd) {
    document.getElementById('serviceOutput').value = cmd;
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
