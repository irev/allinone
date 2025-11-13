// Ping Builder / Network Tools
export function render(container) {
    container.innerHTML = initPingBuilder();
    
    // Initialize after render
    setTimeout(() => {
        updateNetCommand();
        
        // Attach quick network buttons
        const quickBtns = container.querySelectorAll('.btn-secondary.btn-sm');
        const commands = [
            'ip addr show',
            'ip route show',
            'ss -tulnp',
            'netstat -rn',
            'curl ifconfig.me',
            'dig +short myip.opendns.com @resolver1.opendns.com'
        ];
        quickBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                setQuickNet(commands[index]);
            });
        });
    }, 100);
}

function initPingBuilder() {
    return `
        <div class="tool-header">
            <h2>🌐 Network Tools</h2>
            <p>Generate network diagnostic commands</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Target Host</label>
                <input type="text" id="netTarget" class="form-control" placeholder="google.com or 8.8.8.8" oninput="updateNetCommand()">
            </div>

            <div class="input-group">
                <label>Tool Type</label>
                <select id="netTool" class="form-control" onchange="updateNetCommand()">
                    <option value="ping">ping (connectivity test)</option>
                    <option value="traceroute">traceroute (route path)</option>
                    <option value="mtr">mtr (live traceroute)</option>
                    <option value="curl">curl (HTTP test)</option>
                    <option value="wget">wget (download test)</option>
                    <option value="dig">dig (DNS lookup)</option>
                    <option value="nslookup">nslookup (DNS query)</option>
                    <option value="host">host (DNS info)</option>
                    <option value="netstat">netstat (connections)</option>
                    <option value="ss">ss (socket stats)</option>
                </select>
            </div>

            <div id="pingOptions" class="tool-options">
                <div class="input-group">
                    <label>Ping Count</label>
                    <input type="number" id="pingCount" class="form-control" value="4" min="1" max="100" onchange="updateNetCommand()">
                </div>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="pingFlood" onchange="updateNetCommand()"> -f (flood mode - requires sudo)
                    </label>
                </div>
            </div>

            <div id="digOptions" class="tool-options" style="display:none;">
                <div class="input-group">
                    <label>Query Type</label>
                    <select id="digType" class="form-control" onchange="updateNetCommand()">
                        <option value="A">A (IPv4 address)</option>
                        <option value="AAAA">AAAA (IPv6 address)</option>
                        <option value="MX">MX (mail servers)</option>
                        <option value="NS">NS (nameservers)</option>
                        <option value="TXT">TXT (text records)</option>
                        <option value="CNAME">CNAME (canonical name)</option>
                        <option value="SOA">SOA (start of authority)</option>
                        <option value="ANY">ANY (all records)</option>
                    </select>
                </div>
            </div>

            <div id="curlOptions" class="tool-options" style="display:none;">
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="curlHeaders" checked onchange="updateNetCommand()"> -I (headers only)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="curlVerbose" onchange="updateNetCommand()"> -v (verbose)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="curlTime" onchange="updateNetCommand()"> -w (timing info)
                    </label>
                </div>
            </div>

            <div id="ssOptions" class="tool-options" style="display:none;">
                <div class="input-group">
                    <label>Port Filter</label>
                    <input type="text" id="ssPort" class="form-control" placeholder="80, 443, 3306" onchange="updateNetCommand()">
                </div>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="ssTCP" checked onchange="updateNetCommand()"> -t (TCP)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="ssUDP" onchange="updateNetCommand()"> -u (UDP)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="ssListen" checked onchange="updateNetCommand()"> -l (listening)
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="ssProcesses" checked onchange="updateNetCommand()"> -p (processes)
                    </label>
                </div>
            </div>

            <div class="input-group">
                <label>Generated Command</label>
                <textarea id="netOutput" class="form-control" readonly rows="3"></textarea>
                <button class="btn-copy-inline" onclick="copyToClipboard('netOutput')">📋 Copy</button>
            </div>

            <div class="input-group">
                <label>Quick Network Commands</label>
                <div class="button-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem;">
                    <button class="btn-secondary btn-sm">Show IP addresses</button>
                    <button class="btn-secondary btn-sm">Show routes</button>
                    <button class="btn-secondary btn-sm">Open ports</button>
                    <button class="btn-secondary btn-sm">Routing table</button>
                    <button class="btn-secondary btn-sm">Public IP</button>
                    <button class="btn-secondary btn-sm">Public IP (DNS)</button>
                </div>
            </div>

            <div class="input-group">
                <label>Command Explanation</label>
                <div id="netExplanation" class="form-control" style="min-height: 60px; background: var(--bg-secondary); padding: 1rem;"></div>
            </div>
        </div>
    `;
}

function updateNetCommand() {
    const target = document.getElementById('netTarget').value.trim();
    const tool = document.getElementById('netTool').value;
    let command = '';
    let explanation = '';

    // Show/hide relevant options
    document.getElementById('pingOptions').style.display = tool === 'ping' ? 'block' : 'none';
    document.getElementById('digOptions').style.display = (tool === 'dig' || tool === 'host') ? 'block' : 'none';
    document.getElementById('curlOptions').style.display = (tool === 'curl' || tool === 'wget') ? 'block' : 'none';
    document.getElementById('ssOptions').style.display = (tool === 'ss' || tool === 'netstat') ? 'block' : 'none';

    if (!target && !['netstat', 'ss'].includes(tool)) {
        document.getElementById('netOutput').value = 'Enter a target host';
        document.getElementById('netExplanation').textContent = '';
        return;
    }

    switch(tool) {
        case 'ping':
            const count = document.getElementById('pingCount').value;
            command = `ping -c ${count} ${target}`;
            if (document.getElementById('pingFlood')?.checked) command = `sudo ping -f ${target}`;
            explanation = `Send ${count} ICMP packets to ${target} to test connectivity`;
            break;
        case 'traceroute':
            command = `traceroute ${target}`;
            explanation = `Show the route packets take to reach ${target}`;
            break;
        case 'mtr':
            command = `mtr ${target}`;
            explanation = `Live traceroute with packet loss statistics`;
            break;
        case 'curl':
            command = 'curl';
            if (document.getElementById('curlHeaders')?.checked) command += ' -I';
            if (document.getElementById('curlVerbose')?.checked) command += ' -v';
            if (document.getElementById('curlTime')?.checked) command += ' -w "\\nTime: %{time_total}s\\n"';
            command += ` https://${target}`;
            explanation = `Test HTTP connection to ${target}`;
            break;
        case 'wget':
            command = `wget --spider https://${target}`;
            explanation = `Test if ${target} is reachable via HTTP`;
            break;
        case 'dig':
            const digType = document.getElementById('digType')?.value || 'A';
            command = `dig ${digType} ${target}`;
            explanation = `Query ${digType} DNS records for ${target}`;
            break;
        case 'nslookup':
            command = `nslookup ${target}`;
            explanation = `Query DNS information for ${target}`;
            break;
        case 'host':
            const hostType = document.getElementById('digType')?.value || 'A';
            command = `host -t ${hostType} ${target}`;
            explanation = `Look up ${hostType} records for ${target}`;
            break;
        case 'netstat':
            command = 'netstat -tulnp';
            explanation = 'Show all TCP/UDP listening ports with process info';
            break;
        case 'ss':
            command = 'ss';
            if (document.getElementById('ssTCP')?.checked) command += ' -t';
            if (document.getElementById('ssUDP')?.checked) command += ' -u';
            if (document.getElementById('ssListen')?.checked) command += ' -l';
            command += ' -n';
            if (document.getElementById('ssProcesses')?.checked) command += ' -p';
            const port = document.getElementById('ssPort')?.value;
            if (port) command += ` | grep :${port}`;
            explanation = 'Show socket statistics and active connections';
            break;
    }

    document.getElementById('netOutput').value = command;
    document.getElementById('netExplanation').textContent = explanation;
}

function setQuickNet(cmd) {
    document.getElementById('netOutput').value = cmd;
    let explanation = '';
    if (cmd.includes('ip addr')) explanation = 'Display all network interfaces and IP addresses';
    else if (cmd.includes('ip route')) explanation = 'Show routing table';
    else if (cmd.includes('ss -tulnp')) explanation = 'List all open TCP/UDP ports';
    else if (cmd.includes('netstat -rn')) explanation = 'Display kernel routing table';
    else if (cmd.includes('ifconfig.me')) explanation = 'Get your public IP address via HTTP';
    else if (cmd.includes('opendns.com')) explanation = 'Get your public IP address via DNS query';
    document.getElementById('netExplanation').textContent = explanation;
}

setTimeout(() => {
    if (document.getElementById('netTool')) {
        updateNetCommand();
    }
}, 100);
