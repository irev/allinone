/**
 * QR Code Generator
 * Generate QR codes from text, URLs, WiFi credentials, etc.
 */

function initQRGenerator() {
    return `
        <div class="tool-header">
            <h2>QR Code Generator</h2>
            <p>Generate QR codes for text, URLs, WiFi, contact info, and more</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Generate QR Code</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>QR Code Type</label>
                    <select id="qrType" class="form-control">
                        <option value="text">Plain Text</option>
                        <option value="url">URL/Website</option>
                        <option value="wifi">WiFi Network</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="phone">Phone Number</option>
                        <option value="vcard">Contact Card (vCard)</option>
                    </select>
                </div>
                
                <!-- Text/URL Input -->
                <div id="textInput" class="qr-input-section">
                    <div class="form-group">
                        <label>Text Content</label>
                        <textarea 
                            id="qrText" 
                            class="form-control" 
                            rows="3"
                            placeholder="Enter text or URL..."
                        ></textarea>
                    </div>
                </div>
                
                <!-- WiFi Input -->
                <div id="wifiInput" class="qr-input-section" style="display: none;">
                    <div class="form-group">
                        <label>Network Name (SSID)</label>
                        <input type="text" id="wifiSSID" class="form-control" placeholder="MyWiFi">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="text" id="wifiPassword" class="form-control" placeholder="password123">
                    </div>
                    <div class="form-group">
                        <label>Security Type</label>
                        <select id="wifiSecurity" class="form-control">
                            <option value="WPA">WPA/WPA2</option>
                            <option value="WEP">WEP</option>
                            <option value="">None (Open)</option>
                        </select>
                    </div>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="wifiHidden">
                            Hidden Network
                        </label>
                    </div>
                </div>
                
                <!-- Email Input -->
                <div id="emailInput" class="qr-input-section" style="display: none;">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="emailTo" class="form-control" placeholder="example@domain.com">
                    </div>
                    <div class="form-group">
                        <label>Subject (Optional)</label>
                        <input type="text" id="emailSubject" class="form-control" placeholder="Email subject">
                    </div>
                    <div class="form-group">
                        <label>Message (Optional)</label>
                        <textarea id="emailBody" class="form-control" rows="3" placeholder="Email message..."></textarea>
                    </div>
                </div>
                
                <!-- SMS Input -->
                <div id="smsInput" class="qr-input-section" style="display: none;">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="smsNumber" class="form-control" placeholder="+1234567890">
                    </div>
                    <div class="form-group">
                        <label>Message</label>
                        <textarea id="smsMessage" class="form-control" rows="3" placeholder="SMS message..."></textarea>
                    </div>
                </div>
                
                <!-- Phone Input -->
                <div id="phoneInput" class="qr-input-section" style="display: none;">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="tel" id="phoneNumber" class="form-control" placeholder="+1234567890">
                    </div>
                </div>
                
                <!-- vCard Input -->
                <div id="vcardInput" class="qr-input-section" style="display: none;">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="vcardName" class="form-control" placeholder="John Doe">
                    </div>
                    <div class="form-group">
                        <label>Organization</label>
                        <input type="text" id="vcardOrg" class="form-control" placeholder="Company Inc.">
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <input type="tel" id="vcardPhone" class="form-control" placeholder="+1234567890">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="vcardEmail" class="form-control" placeholder="john@example.com">
                    </div>
                    <div class="form-group">
                        <label>Website</label>
                        <input type="url" id="vcardUrl" class="form-control" placeholder="https://example.com">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>QR Code Size</label>
                    <select id="qrSize" class="form-control">
                        <option value="200">Small (200x200)</option>
                        <option value="300" selected>Medium (300x300)</option>
                        <option value="400">Large (400x400)</option>
                        <option value="500">Extra Large (500x500)</option>
                    </select>
                </div>
                
                <div class="button-group">
                    <button id="btnGenerateQR" class="btn btn-primary">
                        📱 Generate QR Code
                    </button>
                    <button id="btnDownloadQR" class="btn btn-secondary" disabled>
                        💾 Download PNG
                    </button>
                    <button id="btnClearQR" class="btn btn-secondary">
                        🗑️ Clear
                    </button>
                </div>
                
                <div id="qrOutput" style="margin-top: 2rem; text-align: center;"></div>
                <div id="qrInfo" style="margin-top: 1rem;"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 About QR Codes</h4>
            <ul>
                <li><strong>Quick Response:</strong> 2D barcode that can be scanned by smartphones</li>
                <li><strong>Capacity:</strong> Can store up to 4,296 alphanumeric characters</li>
                <li><strong>Error Correction:</strong> Can be scanned even if partially damaged</li>
                <li><strong>Use Cases:</strong> URLs, contact info, WiFi credentials, payment links, etc.</li>
                <li><strong>Privacy:</strong> Generated 100% client-side using canvas API</li>
            </ul>
        </div>
    `;
}

function switchQRType() {
    const type = document.getElementById('qrType').value;
    
    // Hide all input sections
    document.querySelectorAll('.qr-input-section').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show relevant section
    const sectionMap = {
        'text': 'textInput',
        'url': 'textInput',
        'wifi': 'wifiInput',
        'email': 'emailInput',
        'sms': 'smsInput',
        'phone': 'phoneInput',
        'vcard': 'vcardInput'
    };
    
    const sectionId = sectionMap[type];
    if (sectionId) {
        document.getElementById(sectionId).style.display = 'block';
    }
    
    // Update placeholder for text/url
    if (type === 'url') {
        document.getElementById('qrText').placeholder = 'https://example.com';
    } else if (type === 'text') {
        document.getElementById('qrText').placeholder = 'Enter any text...';
    }
}

function getQRContent() {
    const type = document.getElementById('qrType').value;
    let content = '';
    
    switch (type) {
        case 'text':
        case 'url':
            content = document.getElementById('qrText').value.trim();
            break;
            
        case 'wifi':
            const ssid = document.getElementById('wifiSSID').value.trim();
            const password = document.getElementById('wifiPassword').value.trim();
            const security = document.getElementById('wifiSecurity').value;
            const hidden = document.getElementById('wifiHidden').checked;
            
            if (!ssid) {
                throw new Error('Please enter WiFi network name (SSID)');
            }
            
            // WiFi QR format: WIFI:S:ssid;T:security;P:password;H:hidden;;
            content = `WIFI:S:${ssid};T:${security};P:${password};H:${hidden};`;
            break;
            
        case 'email':
            const emailTo = document.getElementById('emailTo').value.trim();
            const subject = document.getElementById('emailSubject').value.trim();
            const body = document.getElementById('emailBody').value.trim();
            
            if (!emailTo) {
                throw new Error('Please enter email address');
            }
            
            content = `mailto:${emailTo}`;
            if (subject || body) {
                content += '?';
                if (subject) content += `subject=${encodeURIComponent(subject)}`;
                if (subject && body) content += '&';
                if (body) content += `body=${encodeURIComponent(body)}`;
            }
            break;
            
        case 'sms':
            const smsNumber = document.getElementById('smsNumber').value.trim();
            const smsMessage = document.getElementById('smsMessage').value.trim();
            
            if (!smsNumber) {
                throw new Error('Please enter phone number');
            }
            
            content = `sms:${smsNumber}`;
            if (smsMessage) {
                content += `?body=${encodeURIComponent(smsMessage)}`;
            }
            break;
            
        case 'phone':
            const phoneNumber = document.getElementById('phoneNumber').value.trim();
            
            if (!phoneNumber) {
                throw new Error('Please enter phone number');
            }
            
            content = `tel:${phoneNumber}`;
            break;
            
        case 'vcard':
            const name = document.getElementById('vcardName').value.trim();
            const org = document.getElementById('vcardOrg').value.trim();
            const phone = document.getElementById('vcardPhone').value.trim();
            const email = document.getElementById('vcardEmail').value.trim();
            const url = document.getElementById('vcardUrl').value.trim();
            
            if (!name) {
                throw new Error('Please enter contact name');
            }
            
            content = 'BEGIN:VCARD\n';
            content += 'VERSION:3.0\n';
            content += `FN:${name}\n`;
            if (org) content += `ORG:${org}\n`;
            if (phone) content += `TEL:${phone}\n`;
            if (email) content += `EMAIL:${email}\n`;
            if (url) content += `URL:${url}\n`;
            content += 'END:VCARD';
            break;
    }
    
    if (!content) {
        throw new Error('Please enter content for the QR code');
    }
    
    return content;
}

function generateQRCode(text, size = 300) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Simple QR code generation using data matrix
    // For production, you'd use a library like qrcode.js
    // This is a simplified version using text encoding
    
    const padding = 20;
    const moduleSize = 10;
    const modules = Math.ceil(Math.sqrt(text.length * 8) / 4) * 4 + 8; // Simplified calculation
    
    canvas.width = size;
    canvas.height = size;
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR pattern (simplified - this is a placeholder)
    ctx.fillStyle = '#000000';
    
    // For a real QR code, you'd use a proper QR library
    // This creates a simple pattern as placeholder
    const modulePixelSize = (size - 2 * padding) / modules;
    
    // Create a simple data pattern from the text
    const data = text.split('').map(c => c.charCodeAt(0));
    
    for (let y = 0; y < modules; y++) {
        for (let x = 0; x < modules; x++) {
            const index = (y * modules + x) % data.length;
            const value = data[index];
            
            // Simple pattern based on character code
            if ((value + x + y) % 2 === 0) {
                const px = padding + x * modulePixelSize;
                const py = padding + y * modulePixelSize;
                ctx.fillRect(px, py, modulePixelSize, modulePixelSize);
            }
        }
    }
    
    // Draw finder patterns (corners)
    drawFinderPattern(ctx, padding, padding, modulePixelSize * 7);
    drawFinderPattern(ctx, size - padding - modulePixelSize * 7, padding, modulePixelSize * 7);
    drawFinderPattern(ctx, padding, size - padding - modulePixelSize * 7, modulePixelSize * 7);
    
    return canvas;
}

function drawFinderPattern(ctx, x, y, size) {
    // Outer square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, size, size);
    
    // White square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7);
    
    // Inner black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + size * 0.3, y + size * 0.3, size * 0.4, size * 0.4);
}

function generateQR() {
    const output = document.getElementById('qrOutput');
    const info = document.getElementById('qrInfo');
    const btnDownload = document.getElementById('btnDownloadQR');
    
    try {
        const content = getQRContent();
        const size = parseInt(document.getElementById('qrSize').value);
        
        // Use QRCode.js for real QR code generation
        output.innerHTML = '';
        const qrDiv = document.createElement('div');
        qrDiv.style.display = 'flex';
        qrDiv.style.justifyContent = 'center';
        qrDiv.style.alignItems = 'center';
        qrDiv.style.width = '100%';
        qrDiv.style.margin = '0 auto';
        output.appendChild(qrDiv);
        // QRCode.js expects an element and options
        // eslint-disable-next-line no-undef
        const qr = new window.QRCode(qrDiv, {
            text: content,
            width: size,
            height: size,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.H
        });
        // Find the generated <img> or <canvas> for download
        setTimeout(() => {
            let qrImg = qrDiv.querySelector('img');
            let qrCanvas = qrDiv.querySelector('canvas');
            let dataUrl = '';
            if (qrImg && qrImg.src) {
                dataUrl = qrImg.src;
            } else if (qrCanvas) {
                dataUrl = qrCanvas.toDataURL();
            }
            btnDownload.disabled = false;
            btnDownload.onclick = () => {
                const link = document.createElement('a');
                link.download = `qrcode-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            };
        }, 200);
        // Show info
        info.innerHTML = `
            <div class="alert alert-success">
                ✅ QR Code generated successfully!<br>
                <small>Content length: ${content.length} characters | Size: ${size}x${size}px</small>
            </div>
            <div class="alert alert-info" style="margin-top: 0.5rem;">
                <strong>📝 Note:</strong> QR code is generated using QRCode.js and can be scanned by any QR reader app.
            </div>
        `;
    } catch (error) {
        output.innerHTML = '';
        info.innerHTML = `
            <div class="alert alert-danger">
                ❌ ${error.message}
            </div>
        `;
        btnDownload.disabled = true;
    }
}

function clearQR() {
    document.getElementById('qrText').value = '';
    document.getElementById('wifiSSID').value = '';
    document.getElementById('wifiPassword').value = '';
    document.getElementById('emailTo').value = '';
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailBody').value = '';
    document.getElementById('smsNumber').value = '';
    document.getElementById('smsMessage').value = '';
    document.getElementById('phoneNumber').value = '';
    document.getElementById('vcardName').value = '';
    document.getElementById('vcardOrg').value = '';
    document.getElementById('vcardPhone').value = '';
    document.getElementById('vcardEmail').value = '';
    document.getElementById('vcardUrl').value = '';
    
    document.getElementById('qrOutput').innerHTML = '';
    document.getElementById('qrInfo').innerHTML = '';
    document.getElementById('btnDownloadQR').disabled = true;
}

export function render(container) {
    container.innerHTML = initQRGenerator();
    
    setTimeout(() => {
        // Event listeners
        document.getElementById('qrType')?.addEventListener('change', switchQRType);
        document.getElementById('btnGenerateQR')?.addEventListener('click', generateQR);
        document.getElementById('btnClearQR')?.addEventListener('click', clearQR);
        
        // Initialize
        switchQRType();
    }, 100);
}
