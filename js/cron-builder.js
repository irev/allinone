// Cron Builder Tool
export function render(container) {
    container.innerHTML = initCronBuilder();
    
    // Initialize after render
    setTimeout(() => {
        updateCronExpression();
        document.getElementById('cronRedirect')?.addEventListener('change', () => {
            document.getElementById('cronLogPath').style.display = 
                document.getElementById('cronRedirect').checked ? 'block' : 'none';
        });
        
        // Attach quick cron buttons
        const quickBtns = container.querySelectorAll('.btn-secondary.btn-sm');
        const commands = [
            'crontab -e',
            'crontab -l',
            'crontab -r',
            'sudo systemctl status cron',
            'grep CRON /var/log/syslog',
            'sudo tail -f /var/log/syslog | grep CRON'
        ];
        quickBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                setQuickCron(commands[index]);
            });
        });
    }, 100);
}

function initCronBuilder() {
    return `
        <div class="tool-header">
            <h2>⏰ Cron Builder</h2>
            <p>Generate cron schedule expressions with ease</p>
        </div>

        <div class="tool-content">
            <div class="input-group">
                <label>Preset Schedules</label>
                <select id="cronPreset" class="form-control" onchange="loadCronPreset()">
                    <option value="">-- Custom --</option>
                    <option value="* * * * *">Every minute</option>
                    <option value="*/5 * * * *">Every 5 minutes</option>
                    <option value="0 * * * *">Every hour</option>
                    <option value="0 */6 * * *">Every 6 hours</option>
                    <option value="0 0 * * *">Daily at midnight</option>
                    <option value="0 12 * * *">Daily at noon</option>
                    <option value="0 0 * * 0">Weekly (Sunday)</option>
                    <option value="0 0 1 * *">Monthly (1st day)</option>
                    <option value="0 0 1 1 *">Yearly (Jan 1st)</option>
                    <option value="@reboot">At reboot</option>
                    <option value="@daily">Daily</option>
                    <option value="@weekly">Weekly</option>
                    <option value="@monthly">Monthly</option>
                </select>
            </div>

            <div class="input-group">
                <label>Minute (0-59)</label>
                <input type="text" id="cronMinute" class="form-control" value="0" oninput="updateCronExpression()">
                <span class="hint">* = every, */5 = every 5, 0,15,30,45 = specific</span>
            </div>

            <div class="input-group">
                <label>Hour (0-23)</label>
                <input type="text" id="cronHour" class="form-control" value="*" oninput="updateCronExpression()">
                <span class="hint">0 = midnight, 12 = noon, */2 = every 2 hours</span>
            </div>

            <div class="input-group">
                <label>Day of Month (1-31)</label>
                <input type="text" id="cronDay" class="form-control" value="*" oninput="updateCronExpression()">
                <span class="hint">* = every day, 1 = first day, 15 = mid-month</span>
            </div>

            <div class="input-group">
                <label>Month (1-12)</label>
                <input type="text" id="cronMonth" class="form-control" value="*" oninput="updateCronExpression()">
                <span class="hint">* = every month, 1 = January, 12 = December</span>
            </div>

            <div class="input-group">
                <label>Day of Week (0-7, 0=Sunday)</label>
                <input type="text" id="cronDayWeek" class="form-control" value="*" oninput="updateCronExpression()">
                <span class="hint">* = every day, 0 = Sunday, 1 = Monday, 5 = Friday</span>
            </div>

            <div class="input-group">
                <label>Command to Execute</label>
                <input type="text" id="cronCommand" class="form-control" placeholder="/usr/local/bin/backup.sh" oninput="updateCronExpression()">
                <span class="hint">Full path to script or command</span>
            </div>

            <div class="input-group">
                <label>Additional Options</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="cronRedirect" onchange="updateCronExpression()"> Redirect output to log
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" id="cronEmail" onchange="updateCronExpression()"> Send errors via email
                    </label>
                </div>
            </div>

            <div class="input-group" id="cronLogPath" style="display:none;">
                <label>Log File Path</label>
                <input type="text" id="cronLogFile" class="form-control" value="/var/log/cron-job.log" oninput="updateCronExpression()">
            </div>

            <div class="input-group">
                <label>Generated Cron Expression</label>
                <textarea id="cronOutput" class="form-control" readonly rows="3"></textarea>
                <button class="btn-copy-inline" onclick="copyToClipboard('cronOutput')">📋 Copy</button>
            </div>

            <div class="input-group">
                <label>Human Readable</label>
                <div id="cronHumanReadable" class="form-control" style="background: var(--bg-secondary); padding: 1rem; font-weight: 500;"></div>
            </div>

            <div class="input-group">
                <label>How to Add to Crontab</label>
                <div class="form-control" style="background: var(--bg-secondary); padding: 1rem;">
                    <strong>1. Edit crontab:</strong> <code>crontab -e</code><br>
                    <strong>2. Add the line above</strong><br>
                    <strong>3. Save and exit</strong><br>
                    <strong>4. View crontab:</strong> <code>crontab -l</code><br>
                    <strong>5. Check logs:</strong> <code>grep CRON /var/log/syslog</code>
                </div>
            </div>

            <div class="input-group">
                <label>Quick Cron Commands</label>
                <div class="button-group" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem;">
                    <button class="btn-secondary btn-sm">Edit crontab</button>
                    <button class="btn-secondary btn-sm">List crontab</button>
                    <button class="btn-secondary btn-sm">Remove all</button>
                    <button class="btn-secondary btn-sm">Cron status</button>
                    <button class="btn-secondary btn-sm">View cron logs</button>
                    <button class="btn-secondary btn-sm">Live cron logs</button>
                </div>
            </div>

            <div class="input-group">
                <label>Quick Command Output</label>
                <textarea id="cronQuickOutput" class="form-control" readonly rows="2"></textarea>
            </div>
        </div>
    `;
}

function loadCronPreset() {
    const preset = document.getElementById('cronPreset').value;
    
    if (preset.startsWith('@')) {
        document.getElementById('cronMinute').value = preset;
        document.getElementById('cronHour').value = '';
        document.getElementById('cronDay').value = '';
        document.getElementById('cronMonth').value = '';
        document.getElementById('cronDayWeek').value = '';
    } else if (preset) {
        const parts = preset.split(' ');
        document.getElementById('cronMinute').value = parts[0] || '*';
        document.getElementById('cronHour').value = parts[1] || '*';
        document.getElementById('cronDay').value = parts[2] || '*';
        document.getElementById('cronMonth').value = parts[3] || '*';
        document.getElementById('cronDayWeek').value = parts[4] || '*';
    }
    
    updateCronExpression();
}

function updateCronExpression() {
    const minute = document.getElementById('cronMinute').value.trim() || '*';
    const hour = document.getElementById('cronHour').value.trim() || '*';
    const day = document.getElementById('cronDay').value.trim() || '*';
    const month = document.getElementById('cronMonth').value.trim() || '*';
    const dayWeek = document.getElementById('cronDayWeek').value.trim() || '*';
    const command = document.getElementById('cronCommand').value.trim();
    const redirect = document.getElementById('cronRedirect').checked;
    const email = document.getElementById('cronEmail').checked;

    document.getElementById('cronLogPath').style.display = redirect ? 'block' : 'none';

    let expression = '';
    
    if (minute.startsWith('@')) {
        expression = minute;
    } else {
        expression = `${minute} ${hour} ${day} ${month} ${dayWeek}`;
    }

    if (command) {
        expression += ` ${command}`;
        
        if (redirect) {
            const logFile = document.getElementById('cronLogFile').value.trim();
            expression += ` >> ${logFile} 2>&1`;
        } else if (!email) {
            expression += ' > /dev/null 2>&1';
        }
    }

    document.getElementById('cronOutput').value = expression;
    document.getElementById('cronHumanReadable').textContent = parseCronExpression(minute, hour, day, month, dayWeek);
}

function parseCronExpression(min, hr, day, mon, dow) {
    if (min.startsWith('@')) {
        const presets = {
            '@reboot': 'At system reboot',
            '@yearly': 'Once a year (Jan 1 at midnight)',
            '@annually': 'Once a year (Jan 1 at midnight)',
            '@monthly': 'Once a month (1st day at midnight)',
            '@weekly': 'Once a week (Sunday at midnight)',
            '@daily': 'Once a day (midnight)',
            '@midnight': 'Once a day (midnight)',
            '@hourly': 'Every hour'
        };
        return presets[min] || min;
    }

    let readable = 'Runs ';
    
    // Minute
    if (min === '*') readable += 'every minute';
    else if (min.includes('/')) readable += `every ${min.split('/')[1]} minutes`;
    else if (min.includes(',')) readable += `at minutes ${min}`;
    else readable += `at minute ${min}`;
    
    // Hour
    if (hr !== '*') {
        if (hr.includes('/')) readable += `, every ${hr.split('/')[1]} hours`;
        else if (hr.includes(',')) readable += `, at hours ${hr}`;
        else readable += `, at ${hr}:00`;
    }
    
    // Day
    if (day !== '*') {
        if (day.includes('/')) readable += `, every ${day.split('/')[1]} days`;
        else readable += `, on day ${day}`;
    }
    
    // Month
    if (mon !== '*') {
        const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        readable += `, in ${months[parseInt(mon)] || mon}`;
    }
    
    // Day of week
    if (dow !== '*') {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        readable += `, on ${days[parseInt(dow)] || dow}`;
    }
    
    return readable;
}

function setQuickCron(cmd) {
    document.getElementById('cronQuickOutput').value = cmd;
}

setTimeout(() => {
    if (document.getElementById('cronMinute')) {
        updateCronExpression();
        document.getElementById('cronRedirect').addEventListener('change', () => {
            document.getElementById('cronLogPath').style.display = 
                document.getElementById('cronRedirect').checked ? 'block' : 'none';
        });
    }
}, 100);
