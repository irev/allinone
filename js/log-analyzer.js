/**
 * Access Log Analyzer
 * Parse and analyze web server access logs (Nginx/Apache)
 */

import { utils } from './main.js';

function initLogAnalyzer() {
    return `
        <div class="tool-header">
            <h2>Access Log Analyzer</h2>
            <p>Parse Nginx/Apache logs and analyze traffic patterns</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Log Input</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Log Format</label>
                    <select id="logFormat" class="form-control">
                        <option value="nginx">Nginx Combined</option>
                        <option value="apache">Apache Combined</option>
                        <option value="common">Common Log Format</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Paste Access Logs</label>
                    <textarea 
                        id="logInput" 
                        class="form-control" 
                        rows="10"
                        placeholder="192.168.1.1 - - [13/Nov/2025:10:30:45 +0000] &quot;GET /api/users HTTP/1.1&quot; 200 1234 &quot;-&quot; &quot;Mozilla/5.0...&quot;"
                        style="font-family: 'Courier New', monospace; font-size: 0.85rem;"
                    ></textarea>
                </div>
                
                <button id="btnAnalyze" class="btn btn-primary">
                    📊 Analyze Logs
                </button>
                
                <button id="btnLoadSample" class="btn btn-secondary">
                    📝 Load Sample Data
                </button>
            </div>
        </div>

        <div id="results" style="display: none;">
            <div class="card">
                <div class="card-header">
                    <h3>Overview Statistics</h3>
                </div>
                <div class="card-body">
                    <div id="overview" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Status Code Distribution</h3>
                </div>
                <div class="card-body">
                    <div id="statusCodes"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Top IP Addresses</h3>
                </div>
                <div class="card-body">
                    <div id="topIPs"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Top URLs</h3>
                </div>
                <div class="card-body">
                    <div id="topURLs"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>User Agents</h3>
                </div>
                <div class="card-body">
                    <div id="userAgents"></div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <h3>Bandwidth Analysis</h3>
                </div>
                <div class="card-body">
                    <div id="bandwidth"></div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h4>📋 Log Format Examples</h4>
            <div style="font-family: monospace; font-size: 0.85rem;">
                <p><strong>Nginx Combined:</strong></p>
                <code>192.168.1.1 - - [13/Nov/2025:10:30:45 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0"</code>
                
                <p style="margin-top: 1rem;"><strong>Apache Combined:</strong></p>
                <code>
                127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326</code>
            </div>
        </div>
    `;
}

const sampleLogs = `192.168.1.1 - - [13/Nov/2025:10:30:45 +0000] "GET /api/users HTTP/1.1" 200 1234 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.2 - - [13/Nov/2025:10:30:46 +0000] "POST /api/login HTTP/1.1" 200 567 "https://example.com/login" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)"
192.168.1.1 - - [13/Nov/2025:10:30:47 +0000] "GET /api/posts HTTP/1.1" 200 8901 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.3 - - [13/Nov/2025:10:30:48 +0000] "GET /admin HTTP/1.1" 403 0 "-" "curl/7.68.0"
192.168.1.2 - - [13/Nov/2025:10:30:49 +0000] "GET /api/profile HTTP/1.1" 200 2345 "-" "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)"
192.168.1.4 - - [13/Nov/2025:10:30:50 +0000] "GET /static/app.js HTTP/1.1" 200 45678 "https://example.com/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
192.168.1.1 - - [13/Nov/2025:10:30:51 +0000] "GET /api/users/123 HTTP/1.1" 404 123 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.5 - - [13/Nov/2025:10:30:52 +0000] "POST /api/comment HTTP/1.1" 500 234 "https://example.com/post/1" "Mozilla/5.0 (Linux; Android 11)"
192.168.1.3 - - [13/Nov/2025:10:30:53 +0000] "GET /api/health HTTP/1.1" 200 12 "-" "curl/7.68.0"
192.168.1.6 - - [13/Nov/2025:10:30:54 +0000] "GET /robots.txt HTTP/1.1" 200 78 "-" "Googlebot/2.1"
192.168.1.1 - - [13/Nov/2025:10:30:55 +0000] "GET /api/settings HTTP/1.1" 200 567 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
192.168.1.7 - - [13/Nov/2025:10:30:56 +0000] "GET /favicon.ico HTTP/1.1" 200 1234 "https://example.com/" "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"`;

function parseLog(line) {
    // Combined log format regex
    const regex = /^(\S+) \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^\s]+) HTTP\/[^"]+" (\d+) (\d+|-) "?([^"]*)"? "?([^"]*)"?/;
    const match = line.match(regex);
    
    if (!match) return null;
    
    return {
        ip: match[1],
        timestamp: match[2],
        method: match[3],
        url: match[4],
        status: parseInt(match[5]),
        bytes: match[6] === '-' ? 0 : parseInt(match[6]),
        referrer: match[7] || '-',
        userAgent: match[8] || '-'
    };
}

function analyzeLogs() {
    const logInput = document.getElementById('logInput').value.trim();
    
    if (!logInput) {
        alert('⚠️ Please paste access logs');
        return;
    }
    
    const lines = logInput.split('\n').filter(l => l.trim());
    const parsed = lines.map(parseLog).filter(l => l !== null);
    
    if (parsed.length === 0) {
        alert('❌ Could not parse any log entries. Check format.');
        return;
    }
    
    // Calculate statistics
    const stats = {
        total: parsed.length,
        statusCodes: {},
        ips: {},
        urls: {},
        methods: {},
        userAgents: {},
        totalBytes: 0,
        errors: 0
    };
    
    parsed.forEach(entry => {
        // Status codes
        stats.statusCodes[entry.status] = (stats.statusCodes[entry.status] || 0) + 1;
        
        // IPs
        stats.ips[entry.ip] = (stats.ips[entry.ip] || 0) + 1;
        
        // URLs
        stats.urls[entry.url] = (stats.urls[entry.url] || 0) + 1;
        
        // Methods
        stats.methods[entry.method] = (stats.methods[entry.method] || 0) + 1;
        
        // User agents (simplified)
        const ua = simplifyUserAgent(entry.userAgent);
        stats.userAgents[ua] = (stats.userAgents[ua] || 0) + 1;
        
        // Bandwidth
        stats.totalBytes += entry.bytes;
        
        // Errors
        if (entry.status >= 400) stats.errors++;
    });
    
    displayResults(stats, parsed);
}

function simplifyUserAgent(ua) {
    if (ua.includes('Googlebot')) return 'Googlebot';
    if (ua.includes('curl')) return 'curl';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS Device';
    if (ua.includes('Android')) return 'Android Device';
    if (ua.includes('Windows')) return 'Windows Browser';
    if (ua.includes('Macintosh')) return 'Mac Browser';
    if (ua.includes('Linux')) return 'Linux Browser';
    return 'Other';
}

function displayResults(stats, parsed) {
    document.getElementById('results').style.display = 'block';
    
    // Overview
    const overview = document.getElementById('overview');
    overview.innerHTML = `
        <div class="stat-card" style="background: var(--secondary-bg); padding: 1rem; border-radius: 4px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${stats.total}</div>
            <div style="opacity: 0.8;">Total Requests</div>
        </div>
        <div class="stat-card" style="background: var(--secondary-bg); padding: 1rem; border-radius: 4px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: ${stats.errors > 0 ? '#ef4444' : '#10b981'};">${stats.errors}</div>
            <div style="opacity: 0.8;">Errors (4xx/5xx)</div>
        </div>
        <div class="stat-card" style="background: var(--secondary-bg); padding: 1rem; border-radius: 4px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${Object.keys(stats.ips).length}</div>
            <div style="opacity: 0.8;">Unique IPs</div>
        </div>
        <div class="stat-card" style="background: var(--secondary-bg); padding: 1rem; border-radius: 4px; text-align: center;">
            <div style="font-size: 2rem; font-weight: bold; color: var(--primary-color);">${formatBytes(stats.totalBytes)}</div>
            <div style="opacity: 0.8;">Total Bandwidth</div>
        </div>
    `;
    
    // Status codes
    displayStatusCodes(stats.statusCodes, stats.total);
    
    // Top IPs
    displayTopItems(stats.ips, 'topIPs', 'IP Address', 10);
    
    // Top URLs
    displayTopItems(stats.urls, 'topURLs', 'URL', 10);
    
    // User agents
    displayTopItems(stats.userAgents, 'userAgents', 'User Agent', 10);
    
    // Bandwidth by status
    displayBandwidth(parsed);
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function displayStatusCodes(codes, total) {
    const container = document.getElementById('statusCodes');
    const sorted = Object.entries(codes).sort((a, b) => b[1] - a[1]);
    
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    sorted.forEach(([code, count]) => {
        const percentage = ((count / total) * 100).toFixed(1);
        const color = getStatusColor(parseInt(code));
        
        html += `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="min-width: 80px; font-weight: bold; color: ${color};">
                    ${code}
                </div>
                <div style="flex: 1; background: var(--border-color); border-radius: 4px; height: 30px; overflow: hidden;">
                    <div style="background: ${color}; height: 100%; width: ${percentage}%; display: flex; align-items: center; padding: 0 0.5rem; color: white; font-size: 0.9rem; font-weight: 600;">
                        ${count} (${percentage}%)
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function getStatusColor(code) {
    if (code >= 200 && code < 300) return '#10b981'; // Success - green
    if (code >= 300 && code < 400) return '#3b82f6'; // Redirect - blue
    if (code >= 400 && code < 500) return '#f59e0b'; // Client error - orange
    if (code >= 500) return '#ef4444'; // Server error - red
    return '#6b7280'; // Unknown - gray
}

function displayTopItems(items, containerId, label, limit = 10) {
    const container = document.getElementById(containerId);
    const sorted = Object.entries(items).sort((a, b) => b[1] - a[1]).slice(0, limit);
    const total = Object.values(items).reduce((a, b) => a + b, 0);
    
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    sorted.forEach(([item, count], i) => {
        const percentage = ((count / total) * 100).toFixed(1);
        
        html += `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="min-width: 30px; text-align: center; font-weight: bold; opacity: 0.5;">
                    ${i + 1}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-family: monospace; font-size: 0.9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(item)}">
                        ${escapeHtml(item)}
                    </div>
                    <div style="margin-top: 0.25rem; background: var(--border-color); border-radius: 4px; height: 20px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${percentage}%; display: flex; align-items: center; padding: 0 0.5rem; color: white; font-size: 0.75rem; font-weight: 600;">
                            ${count} (${percentage}%)
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function displayBandwidth(parsed) {
    const container = document.getElementById('bandwidth');
    
    const byStatus = {};
    parsed.forEach(entry => {
        const statusGroup = Math.floor(entry.status / 100) + 'xx';
        byStatus[statusGroup] = (byStatus[statusGroup] || 0) + entry.bytes;
    });
    
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    
    let html = '<div style="display: grid; gap: 0.5rem;">';
    
    Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([status, bytes]) => {
        const percentage = total > 0 ? ((bytes / total) * 100).toFixed(1) : 0;
        
        html += `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="min-width: 80px; font-weight: bold;">
                    ${status}
                </div>
                <div style="flex: 1;">
                    <div>${formatBytes(bytes)} (${percentage}%)</div>
                    <div style="margin-top: 0.25rem; background: var(--border-color); border-radius: 4px; height: 20px; overflow: hidden;">
                        <div style="background: var(--primary-color); height: 100%; width: ${percentage}%;"></div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function loadSample() {
    document.getElementById('logInput').value = sampleLogs;
    analyzeLogs();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initLogAnalyzer();
    
    setTimeout(() => {
        document.getElementById('btnAnalyze')?.addEventListener('click', analyzeLogs);
        document.getElementById('btnLoadSample')?.addEventListener('click', loadSample);

        // Add copy/paste buttons to textarea
        const logInput = document.getElementById('logInput');
        if (logInput) {
            utils.addTextareaActions(logInput, {
                showCopy: true,
                showPaste: true
            });
        }

        // Make info sections collapsible
        utils.initAllCollapsibles(container);
    }, 100);
}
