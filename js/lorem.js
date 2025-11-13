/**
 * Lorem Ipsum & Random Data Generator
 * Generate placeholder text and test data
 */

import { utils } from './main.js';

function initLorem() {
    return `
        <div class="tool-header">
            <h2>Lorem Ipsum & Random Data Generator</h2>
            <p>Generate placeholder text and random test data for your projects</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Lorem Ipsum Text</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Text Type</label>
                    <select id="loremType" class="form-control">
                        <option value="paragraphs">Paragraphs</option>
                        <option value="sentences">Sentences</option>
                        <option value="words">Words</option>
                        <option value="bytes">Bytes</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Amount</label>
                    <input 
                        type="number" 
                        id="loremAmount" 
                        class="form-control" 
                        value="3"
                        min="1"
                        max="1000"
                    />
                </div>
                
                <div class="form-group">
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="loremStartClassic" checked>
                            Start with "Lorem ipsum dolor sit amet..."
                        </label>
                    </div>
                </div>
                
                <div class="button-group">
                    <button id="btnGenLorem" class="btn btn-primary">
                        📝 Generate Lorem Ipsum
                    </button>
                    <button id="btnCopyLorem" class="btn btn-secondary">
                        📋 Copy
                    </button>
                </div>
                
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Generated Text</label>
                    <textarea 
                        id="loremOutput" 
                        class="form-control" 
                        rows="10" 
                        readonly
                    ></textarea>
                </div>
                
                <div id="loremStats"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Random Data Generator</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Data Type</label>
                    <select id="randomType" class="form-control">
                        <option value="names">Names (First + Last)</option>
                        <option value="emails">Email Addresses</option>
                        <option value="usernames">Usernames</option>
                        <option value="passwords">Passwords</option>
                        <option value="phones">Phone Numbers</option>
                        <option value="addresses">Addresses</option>
                        <option value="dates">Dates</option>
                        <option value="numbers">Numbers</option>
                        <option value="hexcolors">Hex Colors</option>
                        <option value="ipv4">IPv4 Addresses</option>
                        <option value="urls">URLs</option>
                    </select>
                </div>
                
                <!-- Password Options -->
                <div id="passwordOptions" style="display: none;">
                    <div class="form-group">
                        <label>Password Length: <strong id="pwdLengthValue">16</strong></label>
                        <input 
                            type="range" 
                            id="pwdLength" 
                            min="8"
                            max="64"
                            value="16"
                            style="cursor: pointer; width: 100%; margin: 0.5rem 0;"
                        />
                        <div style="display: flex; justify-content: space-between; color: #6b7280; font-size: 0.875rem;">
                            <span>8</span>
                            <span>64</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Character Types</label>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="pwdUppercase" checked>
                                Uppercase (A-Z)
                            </label>
                        </div>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="pwdLowercase" checked>
                                Lowercase (a-z)
                            </label>
                        </div>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="pwdNumbers" checked>
                                Numbers (0-9)
                            </label>
                        </div>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="pwdSymbols" checked>
                                Symbols (!@#$%^&*())
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Number of Items</label>
                    <input 
                        type="number" 
                        id="randomAmount" 
                        class="form-control" 
                        value="10"
                        min="1"
                        max="1000"
                    />
                </div>
                
                <div class="button-group">
                    <button id="btnGenRandom" class="btn btn-primary">
                        🎲 Generate Random Data
                    </button>
                    <button id="btnCopyRandom" class="btn btn-secondary">
                        📋 Copy
                    </button>
                    <button id="btnExportCSV" class="btn btn-secondary">
                        📥 Export CSV
                    </button>
                </div>
                
                <div class="form-group" style="margin-top: 1rem;">
                    <label>Generated Data</label>
                    <textarea 
                        id="randomOutput" 
                        class="form-control" 
                        rows="12" 
                        readonly
                    ></textarea>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 Use Cases</h4>
            <ul>
                <li><strong>Lorem Ipsum:</strong> Placeholder text for mockups, wireframes, and design templates</li>
                <li><strong>Random Data:</strong> Test data for development, database seeding, and QA testing</li>
                <li><strong>Privacy:</strong> All data is generated client-side, no external APIs</li>
                <li><strong>Format:</strong> Easy to copy and paste into your projects</li>
            </ul>
        </div>
    `;
}

// Lorem Ipsum word bank
const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'James', 'Emma', 'Robert', 'Olivia', 
                    'William', 'Ava', 'Richard', 'Isabella', 'Joseph', 'Sophia', 'Thomas', 'Mia', 'Charles', 'Charlotte'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'company.com', 'example.com', 'mail.com', 'test.com'];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[random(0, array.length - 1)];
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateLoremSentence(wordCount) {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        words.push(randomChoice(loremWords));
    }
    return capitalize(words.join(' ')) + '.';
}

function generateLoremParagraph() {
    const sentenceCount = random(4, 8);
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateLoremSentence(random(8, 16)));
    }
    return sentences.join(' ');
}

function generateLorem() {
    const type = document.getElementById('loremType').value;
    const amount = parseInt(document.getElementById('loremAmount').value) || 1;
    const startClassic = document.getElementById('loremStartClassic').checked;
    const output = document.getElementById('loremOutput');
    const stats = document.getElementById('loremStats');
    
    let result = '';
    const classic = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    
    if (type === 'paragraphs') {
        const paragraphs = [];
        for (let i = 0; i < amount; i++) {
            if (i === 0 && startClassic) {
                paragraphs.push(classic);
            } else {
                paragraphs.push(generateLoremParagraph());
            }
        }
        result = paragraphs.join('\n\n');
    } else if (type === 'sentences') {
        const sentences = [];
        for (let i = 0; i < amount; i++) {
            if (i === 0 && startClassic) {
                sentences.push(classic);
            } else {
                sentences.push(generateLoremSentence(random(8, 16)));
            }
        }
        result = sentences.join(' ');
    } else if (type === 'words') {
        const words = [];
        if (startClassic) {
            words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
        }
        while (words.length < amount) {
            words.push(randomChoice(loremWords));
        }
        result = words.slice(0, amount).join(' ');
    } else if (type === 'bytes') {
        if (startClassic) {
            result = classic + ' ';
        }
        while (result.length < amount) {
            result += randomChoice(loremWords) + ' ';
        }
        result = result.substring(0, amount);
    }
    
    output.value = result;
    
    const wordCount = result.split(/\s+/).length;
    const charCount = result.length;
    const charNoSpaces = result.replace(/\s/g, '').length;
    
    stats.innerHTML = `
        <div class="alert alert-info" style="margin-top: 1rem;">
            📊 Words: ${wordCount} | Characters: ${charCount} | Characters (no spaces): ${charNoSpaces}
        </div>
    `;
}

function generateRandomData() {
    const type = document.getElementById('randomType').value;
    const amount = parseInt(document.getElementById('randomAmount').value) || 1;
    const output = document.getElementById('randomOutput');
    
    const data = [];
    
    for (let i = 0; i < amount; i++) {
        switch (type) {
            case 'names':
                data.push(`${randomChoice(firstNames)} ${randomChoice(lastNames)}`);
                break;
                
            case 'emails':
                const first = randomChoice(firstNames).toLowerCase();
                const last = randomChoice(lastNames).toLowerCase();
                const domain = randomChoice(domains);
                data.push(`${first}.${last}${random(1, 999)}@${domain}`);
                break;
                
            case 'usernames':
                const username = randomChoice(firstNames).toLowerCase() + randomChoice(lastNames).toLowerCase() + random(1, 9999);
                data.push(username);
                break;
                
            case 'passwords':
                const length = parseInt(document.getElementById('pwdLength')?.value) || 16;
                
                // Build character set based on checkboxes
                let chars = '';
                if (document.getElementById('pwdUppercase')?.checked) {
                    chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                }
                if (document.getElementById('pwdLowercase')?.checked) {
                    chars += 'abcdefghijklmnopqrstuvwxyz';
                }
                if (document.getElementById('pwdNumbers')?.checked) {
                    chars += '0123456789';
                }
                if (document.getElementById('pwdSymbols')?.checked) {
                    chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
                }
                
                // Fallback to all chars if none selected
                if (chars.length === 0) {
                    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
                }
                
                let password = '';
                for (let j = 0; j < length; j++) {
                    password += chars.charAt(random(0, chars.length - 1));
                }
                data.push(password);
                break;
                
            case 'phones':
                data.push(`+1-${random(200, 999)}-${random(200, 999)}-${random(1000, 9999)}`);
                break;
                
            case 'addresses':
                const streetNum = random(1, 9999);
                const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Washington Blvd', 'Maple Dr', 'Lake View'];
                const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio'];
                data.push(`${streetNum} ${randomChoice(streets)}, ${randomChoice(cities)}, NY ${random(10000, 99999)}`);
                break;
                
            case 'dates':
                const year = random(2020, 2025);
                const month = String(random(1, 12)).padStart(2, '0');
                const day = String(random(1, 28)).padStart(2, '0');
                data.push(`${year}-${month}-${day}`);
                break;
                
            case 'numbers':
                data.push(random(1, 1000000));
                break;
                
            case 'hexcolors':
                const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                data.push(hex);
                break;
                
            case 'ipv4':
                data.push(`${random(1, 255)}.${random(0, 255)}.${random(0, 255)}.${random(1, 255)}`);
                break;
                
            case 'urls':
                const protocols = ['https'];
                const subdomains = ['www', 'api', 'app', 'blog', 'shop'];
                const tlds = ['com', 'org', 'net', 'io', 'dev'];
                const names = ['example', 'test', 'demo', 'sample', 'company'];
                data.push(`${randomChoice(protocols)}://${randomChoice(subdomains)}.${randomChoice(names)}.${randomChoice(tlds)}`);
                break;
        }
    }
    
    output.value = data.join('\n');
}

function exportCSV() {
    const type = document.getElementById('randomType').value;
    const data = document.getElementById('randomOutput').value.trim();
    
    if (!data) return;
    
    const lines = data.split('\n');
    let csv = '';
    
    // Determine header based on type
    const headers = {
        'names': 'Name',
        'emails': 'Email',
        'usernames': 'Username',
        'passwords': 'Password',
        'phones': 'Phone',
        'addresses': 'Address',
        'dates': 'Date',
        'numbers': 'Number',
        'hexcolors': 'Color',
        'ipv4': 'IP Address',
        'urls': 'URL'
    };
    
    csv = headers[type] + '\n';
    csv += lines.join('\n');
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-${type}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    const btn = event?.target;
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✅ Exported!';
        setTimeout(() => btn.innerHTML = originalText, 2000);
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.value) {
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

function updatePasswordOptions() {
    const type = document.getElementById('randomType').value;
    const passwordOptions = document.getElementById('passwordOptions');
    
    if (passwordOptions) {
        passwordOptions.style.display = type === 'passwords' ? 'block' : 'none';
    }
}

function updatePasswordLength() {
    const slider = document.getElementById('pwdLength');
    const valueDisplay = document.getElementById('pwdLengthValue');
    
    if (slider && valueDisplay) {
        valueDisplay.textContent = slider.value;
        
        // Update slider background gradient
        const min = parseInt(slider.min) || 8;
        const max = parseInt(slider.max) || 64;
        const value = parseInt(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        
        const isDarkMode = document.body.classList.contains('dark-mode');
        const trackColor = isDarkMode ? '#374151' : '#e5e7eb';
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#3b82f6';
        
        slider.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;
    }
}

export function render(container) {
    container.innerHTML = initLorem();
    
    setTimeout(() => {
        // Event listeners
        document.getElementById('btnGenLorem')?.addEventListener('click', generateLorem);
        document.getElementById('btnGenRandom')?.addEventListener('click', generateRandomData);
        document.getElementById('btnCopyLorem')?.addEventListener('click', () => copyToClipboard('loremOutput'));
        document.getElementById('btnCopyRandom')?.addEventListener('click', () => copyToClipboard('randomOutput'));
        document.getElementById('btnExportCSV')?.addEventListener('click', exportCSV);
        
        // Auto-generate on change
        document.getElementById('loremType')?.addEventListener('change', generateLorem);
        document.getElementById('loremAmount')?.addEventListener('change', generateLorem);
        document.getElementById('loremStartClassic')?.addEventListener('change', generateLorem);
        
        // Random data type change
        document.getElementById('randomType')?.addEventListener('change', () => {
            updatePasswordOptions();
            generateRandomData();
        });
        document.getElementById('randomAmount')?.addEventListener('change', generateRandomData);
        
        // Password slider
        document.getElementById('pwdLength')?.addEventListener('input', () => {
            updatePasswordLength();
            generateRandomData();
        });
        
        // Password checkboxes
        document.getElementById('pwdUppercase')?.addEventListener('change', generateRandomData);
        document.getElementById('pwdLowercase')?.addEventListener('change', generateRandomData);
        document.getElementById('pwdNumbers')?.addEventListener('change', generateRandomData);
        document.getElementById('pwdSymbols')?.addEventListener('change', generateRandomData);
        
        // Initial setup
        updatePasswordOptions();
        updatePasswordLength();
        
        // Initial generation
        generateLorem();
        generateRandomData();

        // Add copy/paste buttons to textareas (readonly, copy only)
        const loremOutput = document.getElementById('loremOutput');
        const randomOutput = document.getElementById('randomOutput');
        if (loremOutput) {
            utils.addTextareaActions(loremOutput, {
                showCopy: true,
                showPaste: false
            });
        }
        if (randomOutput) {
            utils.addTextareaActions(randomOutput, {
                showCopy: true,
                showPaste: false
            });
        }
    }, 100);
}
