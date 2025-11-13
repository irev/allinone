// APT Helper / Package Manager Tool
import { utils } from './main.js';

export function render(container) {
    container.innerHTML = initAptHelper();
    
    // Initialize after render
    setTimeout(() => {
        // Input listeners for auto-update
        document.getElementById('pkgManager')?.addEventListener('change', updatePkgCommand);
        document.getElementById('pkgName')?.addEventListener('input', updatePkgCommand);
        document.getElementById('pkgAction')?.addEventListener('change', updatePkgCommand);
        document.getElementById('pkgSudo')?.addEventListener('change', updatePkgCommand);
        document.getElementById('pkgYes')?.addEventListener('change', updatePkgCommand);
        
        // Search button
        document.getElementById('btnSearchPkg')?.addEventListener('click', searchPackage);
        document.getElementById('pkgSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchPackage();
        });
        
        // Initial generate
        updatePkgCommand();
        
        // Attach quick package buttons
        const quickBtns = container.querySelectorAll('.btn-secondary.btn-sm');
        const commands = [
            'sudo apt update && sudo apt upgrade -y',
            'sudo apt autoremove && sudo apt clean',
            'apt list --installed',
            'apt list --upgradable',
            'sudo apt install build-essential -y',
            'dpkg -l | grep ^ii | wc -l'
        ];
        quickBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                setQuickPkg(commands[index]);
            });
        });

        // Add copy buttons to outputs
        const pkgOutput = document.getElementById('pkgOutput');
        const pkgSearchOutput = document.getElementById('pkgSearchOutput');
        if (pkgOutput) {
            utils.addTextareaActions(pkgOutput, {
                showCopy: true,
                showPaste: false
            });
        }
        if (pkgSearchOutput) {
            utils.addTextareaActions(pkgSearchOutput, {
                showCopy: true,
                showPaste: false
            });
        }

        // Make info sections collapsible
        utils.initAllCollapsibles(container);
    }, 100);
}

function initAptHelper() {
    return `
        <div class="tool-header">
            <h2>📦 Package Manager</h2>
            <p>Generate package management commands (apt/dnf/yum)</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Package Manager</label>
                <select id="pkgManager" class="form-control">
                    <option value="apt">apt (Debian/Ubuntu)</option>
                    <option value="dnf">dnf (Fedora/RHEL 8+)</option>
                    <option value="yum">yum (CentOS/RHEL 7)</option>
                    <option value="pacman">pacman (Arch)</option>
                    <option value="zypper">zypper (openSUSE)</option>
                </select>
            </div>

            <div class="input-group">
                <label>Package Name</label>
                <input type="text" id="pkgName" class="form-control" placeholder="nginx">
                <span class="hint">Leave empty for system-wide operations</span>
            </div>

            <div class="input-group">
                <label>Action</label>
                <select id="pkgAction" class="form-control">
                    <option value="install">Install package</option>
                    <option value="remove">Remove package</option>
                    <option value="purge">Purge (remove + config)</option>
                    <option value="update">Update package list</option>
                    <option value="upgrade">Upgrade packages</option>
                    <option value="search">Search package</option>
                    <option value="show">Show package info</option>
                    <option value="list">List installed</option>
                    <option value="autoremove">Remove unused</option>
                    <option value="clean">Clean cache</option>
                </select>
            </div>

            <div class="input-group">
                <label>Options</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="pkgSudo" checked> Use sudo
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="pkgYes" checked> Auto-confirm (-y)
                    </label>
                </div>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="pkgOutput" class="form-control" readonly rows="2"></textarea>
            </div>

            <div class="input-group">
                <label>Quick Package Commands</label>
                <div class="button-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    <button class="btn-secondary btn-sm">Update & Upgrade</button>
                    <button class="btn-secondary btn-sm">Clean System</button>
                    <button class="btn-secondary btn-sm">List Installed</button>
                    <button class="btn-secondary btn-sm">Upgradable Packages</button>
                    <button class="btn-secondary btn-sm">Install Build Tools</button>
                    <button class="btn-secondary btn-sm">Count Packages</button>
                </div>
            </div>

            <div class="input-group">
                <label>Common Packages</label>
                <div class="form-control" style="background: var(--bg-secondary); padding: 1rem;">
                    <strong>Web:</strong> nginx, apache2, certbot<br>
                    <strong>Database:</strong> mysql-server, postgresql, redis-server<br>
                    <strong>Dev:</strong> git, vim, curl, wget, htop, tmux<br>
                    <strong>Security:</strong> ufw, fail2ban, clamav<br>
                    <strong>Monitoring:</strong> netdata, prometheus, grafana<br>
                    <strong>Utils:</strong> ncdu, tree, jq, zip, unzip
                </div>
            </div>

            <div class="input-group">
                <label>Package Info Lookup</label>
                <div style="display: flex; gap: 0.5rem;">
                    <input type="text" id="pkgSearch" class="form-control" placeholder="Search package...">
                    <button class="btn-primary" id="btnSearchPkg">🔍 Search</button>
                </div>
            </div>

            <div class="input-group">
                <label>Search Command</label>
                <textarea id="pkgSearchOutput" class="form-control" readonly rows="2"></textarea>
            </div>
        </div>
    `;
}

function updatePkgCommand() {
    const manager = document.getElementById('pkgManager').value;
    const pkgName = document.getElementById('pkgName').value.trim();
    const action = document.getElementById('pkgAction').value;
    const useSudo = document.getElementById('pkgSudo').checked;
    const autoYes = document.getElementById('pkgYes').checked;

    let command = useSudo ? 'sudo ' : '';
    command += manager + ' ';

    const commands = {
        apt: {
            install: `install ${pkgName}`,
            remove: `remove ${pkgName}`,
            purge: `purge ${pkgName}`,
            update: 'update',
            upgrade: 'upgrade',
            search: `search ${pkgName}`,
            show: `show ${pkgName}`,
            list: 'list --installed',
            autoremove: 'autoremove',
            clean: 'clean'
        },
        dnf: {
            install: `install ${pkgName}`,
            remove: `remove ${pkgName}`,
            purge: `remove ${pkgName}`,
            update: 'check-update',
            upgrade: 'upgrade',
            search: `search ${pkgName}`,
            show: `info ${pkgName}`,
            list: 'list installed',
            autoremove: 'autoremove',
            clean: 'clean all'
        },
        yum: {
            install: `install ${pkgName}`,
            remove: `remove ${pkgName}`,
            purge: `remove ${pkgName}`,
            update: 'check-update',
            upgrade: 'update',
            search: `search ${pkgName}`,
            show: `info ${pkgName}`,
            list: 'list installed',
            autoremove: 'autoremove',
            clean: 'clean all'
        },
        pacman: {
            install: `-S ${pkgName}`,
            remove: `-R ${pkgName}`,
            purge: `-Rns ${pkgName}`,
            update: '-Sy',
            upgrade: '-Syu',
            search: `-Ss ${pkgName}`,
            show: `-Si ${pkgName}`,
            list: '-Q',
            autoremove: '-Rns $(pacman -Qdtq)',
            clean: '-Sc'
        },
        zypper: {
            install: `install ${pkgName}`,
            remove: `remove ${pkgName}`,
            purge: `remove -u ${pkgName}`,
            update: 'refresh',
            upgrade: 'update',
            search: `search ${pkgName}`,
            show: `info ${pkgName}`,
            list: 'search -i',
            autoremove: 'remove -u',
            clean: 'clean'
        }
    };

    command += commands[manager][action] || action;

    if (autoYes && ['install', 'remove', 'purge', 'upgrade', 'autoremove'].includes(action)) {
        if (manager === 'apt' || manager === 'dnf' || manager === 'yum') {
            command += ' -y';
        } else if (manager === 'pacman') {
            command += ' --noconfirm';
        } else if (manager === 'zypper') {
            command += ' -y';
        }
    }

    if (!pkgName && ['install', 'remove', 'purge', 'search', 'show'].includes(action)) {
        command = 'Enter a package name';
    }

    document.getElementById('pkgOutput').value = command;
}

function searchPackage() {
    const manager = document.getElementById('pkgManager').value;
    const search = document.getElementById('pkgSearch').value.trim();
    
    if (!search) {
        document.getElementById('pkgSearchOutput').value = 'Enter search term';
        return;
    }

    const searchCommands = {
        apt: `apt search ${search}`,
        dnf: `dnf search ${search}`,
        yum: `yum search ${search}`,
        pacman: `pacman -Ss ${search}`,
        zypper: `zypper search ${search}`
    };

    document.getElementById('pkgSearchOutput').value = searchCommands[manager];
}

function setQuickPkg(cmd) {
    document.getElementById('pkgOutput').value = cmd;
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
