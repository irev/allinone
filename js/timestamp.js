/**
 * Timestamp Converter
 * Convert between UNIX timestamp and human-readable date/time
 */

function initTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    
    return `
        <div class="tool-header">
            <h2>Timestamp Converter</h2>
            <p>Convert between UNIX timestamp and human-readable date/time</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Current Time</h3>
            </div>
            <div class="card-body">
                <div class="alert alert-info" id="currentTime" style="font-size: 1.1rem; font-weight: 500;">
                    Loading...
                </div>
                <div class="button-group">
                    <button id="btnUseNow" class="btn btn-primary">
                        🕐 Use Current Timestamp
                    </button>
                    <button id="btnRefresh" class="btn btn-secondary">
                        🔄 Refresh
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>UNIX Timestamp → Date/Time</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>UNIX Timestamp (seconds)</label>
                    <input 
                        type="text" 
                        id="unixInput" 
                        class="form-control" 
                        placeholder="1699999999"
                        value="${now}"
                    />
                </div>
                
                <div class="button-group">
                    <button id="btnConvertUnix" class="btn btn-primary">
                        → Convert to Date/Time
                    </button>
                    <button id="btnCopyUnix" class="btn btn-secondary">
                        📋 Copy Timestamp
                    </button>
                </div>
                
                <div id="unixOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Date/Time → UNIX Timestamp</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Date</label>
                    <input 
                        type="date" 
                        id="dateInput" 
                        class="form-control"
                    />
                </div>
                
                <div class="form-group">
                    <label>Time (24-hour format)</label>
                    <input 
                        type="time" 
                        id="timeInput" 
                        class="form-control"
                        value="12:00"
                    />
                </div>
                
                <div class="form-group">
                    <label>Timezone</label>
                    <select id="timezoneSelect" class="form-control">
                        <option value="local">Local Time</option>
                        <option value="utc">UTC</option>
                    </select>
                </div>
                
                <div class="button-group">
                    <button id="btnConvertDate" class="btn btn-primary">
                        → Convert to UNIX
                    </button>
                    <button id="btnUseToday" class="btn btn-secondary">
                        📅 Use Today
                    </button>
                </div>
                
                <div id="dateOutput" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Quick Reference</h3>
            </div>
            <div class="card-body">
                <div id="quickRef"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 About UNIX Timestamp</h4>
            <ul>
                <li><strong>Definition:</strong> Number of seconds since January 1, 1970 00:00:00 UTC (Unix Epoch)</li>
                <li><strong>Range:</strong> Can represent dates from 1970 to 2038 (32-bit) or beyond (64-bit)</li>
                <li><strong>Common Uses:</strong> Databases, APIs, system logs, file timestamps</li>
                <li><strong>Milliseconds:</strong> JavaScript uses milliseconds (multiply by 1000)</li>
            </ul>
        </div>
    `;
}

function updateCurrentTime() {
    const now = new Date();
    const unix = Math.floor(now.getTime() / 1000);
    const element = document.getElementById('currentTime');
    
    if (element) {
        element.innerHTML = `
            <div style="display: grid; gap: 0.5rem;">
                <div>🕐 <strong>Local:</strong> ${now.toLocaleString()}</div>
                <div>🌍 <strong>UTC:</strong> ${now.toUTCString()}</div>
                <div>⏱️ <strong>UNIX:</strong> ${unix}</div>
                <div>📱 <strong>ISO:</strong> ${now.toISOString()}</div>
            </div>
        `;
    }
}

function convertUnixToDate() {
    const input = document.getElementById('unixInput').value.trim();
    const output = document.getElementById('unixOutput');
    
    if (!input) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please enter a UNIX timestamp</div>';
        return;
    }
    
    const unix = parseInt(input);
    
    if (isNaN(unix)) {
        output.innerHTML = '<div class="alert alert-danger">❌ Invalid timestamp (must be a number)</div>';
        return;
    }
    
    // Handle both seconds and milliseconds
    let timestamp = unix;
    let unit = 'seconds';
    
    if (unix > 10000000000) {
        timestamp = Math.floor(unix / 1000);
        unit = 'milliseconds';
    }
    
    const date = new Date(timestamp * 1000);
    
    if (isNaN(date.getTime())) {
        output.innerHTML = '<div class="alert alert-danger">❌ Invalid timestamp value</div>';
        return;
    }
    
    const relativeTime = getRelativeTime(date);
    
    output.innerHTML = `
        <div class="alert alert-success">
            <h4 style="margin-top: 0;">✅ Conversion Result ${unit === 'milliseconds' ? '(detected milliseconds)' : ''}</h4>
            <div style="display: grid; gap: 0.75rem; font-family: 'Courier New', monospace;">
                <div><strong>Local Time:</strong><br>${date.toLocaleString()}</div>
                <div><strong>UTC:</strong><br>${date.toUTCString()}</div>
                <div><strong>ISO 8601:</strong><br>${date.toISOString()}</div>
                <div><strong>Relative:</strong><br>${relativeTime}</div>
                <div><strong>Date Only:</strong><br>${date.toLocaleDateString()}</div>
                <div><strong>Time Only:</strong><br>${date.toLocaleTimeString()}</div>
            </div>
        </div>
    `;
}

function convertDateToUnix() {
    const dateInput = document.getElementById('dateInput').value;
    const timeInput = document.getElementById('timeInput').value;
    const timezone = document.getElementById('timezoneSelect').value;
    const output = document.getElementById('dateOutput');
    
    if (!dateInput) {
        output.innerHTML = '<div class="alert alert-warning">⚠️ Please select a date</div>';
        return;
    }
    
    const dateTimeStr = `${dateInput}T${timeInput || '00:00'}`;
    let date;
    
    if (timezone === 'utc') {
        date = new Date(dateTimeStr + 'Z');
    } else {
        date = new Date(dateTimeStr);
    }
    
    if (isNaN(date.getTime())) {
        output.innerHTML = '<div class="alert alert-danger">❌ Invalid date/time</div>';
        return;
    }
    
    const unixSeconds = Math.floor(date.getTime() / 1000);
    const unixMillis = date.getTime();
    const relativeTime = getRelativeTime(date);
    
    output.innerHTML = `
        <div class="alert alert-success">
            <h4 style="margin-top: 0;">✅ Conversion Result</h4>
            <div style="display: grid; gap: 0.75rem; font-family: 'Courier New', monospace;">
                <div><strong>UNIX (seconds):</strong><br><code>${unixSeconds}</code></div>
                <div><strong>UNIX (milliseconds):</strong><br><code>${unixMillis}</code></div>
                <div><strong>Full Date:</strong><br>${date.toString()}</div>
                <div><strong>ISO 8601:</strong><br>${date.toISOString()}</div>
                <div><strong>Relative:</strong><br>${relativeTime}</div>
            </div>
            <div class="button-group" style="margin-top: 1rem;">
                <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText('${unixSeconds}')">
                    📋 Copy Seconds
                </button>
                <button class="btn btn-sm btn-secondary" onclick="navigator.clipboard.writeText('${unixMillis}')">
                    📋 Copy Milliseconds
                </button>
            </div>
        </div>
    `;
}

function getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);
    
    if (diffSec < 60) {
        return diffSec === 0 ? 'just now' : `${Math.abs(diffSec)} seconds ${diffSec < 0 ? 'from now' : 'ago'}`;
    } else if (diffMin < 60) {
        return `${Math.abs(diffMin)} minute${Math.abs(diffMin) !== 1 ? 's' : ''} ${diffMin < 0 ? 'from now' : 'ago'}`;
    } else if (diffHour < 24) {
        return `${Math.abs(diffHour)} hour${Math.abs(diffHour) !== 1 ? 's' : ''} ${diffHour < 0 ? 'from now' : 'ago'}`;
    } else if (diffDay < 30) {
        return `${Math.abs(diffDay)} day${Math.abs(diffDay) !== 1 ? 's' : ''} ${diffDay < 0 ? 'from now' : 'ago'}`;
    } else if (diffMonth < 12) {
        return `${Math.abs(diffMonth)} month${Math.abs(diffMonth) !== 1 ? 's' : ''} ${diffMonth < 0 ? 'from now' : 'ago'}`;
    } else {
        return `${Math.abs(diffYear)} year${Math.abs(diffYear) !== 1 ? 's' : ''} ${diffYear < 0 ? 'from now' : 'ago'}`;
    }
}

function useCurrentTimestamp() {
    const unix = Math.floor(Date.now() / 1000);
    document.getElementById('unixInput').value = unix;
    convertUnixToDate();
}

function useTodayDate() {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().slice(0, 5);
    
    document.getElementById('dateInput').value = dateStr;
    document.getElementById('timeInput').value = timeStr;
    convertDateToUnix();
}

function updateQuickReference() {
    const element = document.getElementById('quickRef');
    if (!element) return;
    
    const now = new Date();
    const timestamps = [
        { label: 'Now', date: now },
        { label: '1 hour ago', date: new Date(now - 3600000) },
        { label: '1 day ago', date: new Date(now - 86400000) },
        { label: '1 week ago', date: new Date(now - 604800000) },
        { label: '1 month ago', date: new Date(now - 2592000000) },
        { label: 'Unix Epoch', date: new Date(0) }
    ];
    
    let html = '<table style="width: 100%; font-size: 0.9rem;"><thead><tr><th>Event</th><th>UNIX Timestamp</th><th>Date</th></tr></thead><tbody>';
    
    timestamps.forEach(({ label, date }) => {
        const unix = Math.floor(date.getTime() / 1000);
        html += `
            <tr>
                <td><strong>${label}</strong></td>
                <td><code>${unix}</code></td>
                <td>${date.toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    element.innerHTML = html;
}

export function render(container) {
    container.innerHTML = initTimestamp();
    
    setTimeout(() => {
        // Initialize
        updateCurrentTime();
        updateQuickReference();
        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dateInput').value = today;
        
        // Update current time every second
        setInterval(updateCurrentTime, 1000);
        
        // Event listeners
        document.getElementById('btnConvertUnix')?.addEventListener('click', convertUnixToDate);
        document.getElementById('btnConvertDate')?.addEventListener('click', convertDateToUnix);
        document.getElementById('btnUseNow')?.addEventListener('click', useCurrentTimestamp);
        document.getElementById('btnUseToday')?.addEventListener('click', useTodayDate);
        document.getElementById('btnRefresh')?.addEventListener('click', () => {
            updateCurrentTime();
            updateQuickReference();
        });
        document.getElementById('btnCopyUnix')?.addEventListener('click', () => {
            const input = document.getElementById('unixInput');
            if (input && input.value) {
                navigator.clipboard.writeText(input.value);
                const btn = event?.target;
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✅ Copied!';
                    setTimeout(() => btn.innerHTML = originalText, 2000);
                }
            }
        });
        
        // Auto-convert on input
        document.getElementById('unixInput')?.addEventListener('input', () => {
            const value = document.getElementById('unixInput').value;
            if (value && !isNaN(value)) {
                convertUnixToDate();
            }
        });
        
        document.getElementById('dateInput')?.addEventListener('change', convertDateToUnix);
        document.getElementById('timeInput')?.addEventListener('change', convertDateToUnix);
        document.getElementById('timezoneSelect')?.addEventListener('change', convertDateToUnix);
        
        // Initial conversion
        convertUnixToDate();
    }, 100);
}
