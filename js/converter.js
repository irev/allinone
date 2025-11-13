/**
 * Text Converter Tool
 * 
 * Modul ini menyediakan fungsi untuk:
 * - Konversi Text ↔ Hexadecimal
 * - Konversi Text ↔ Binary
 * - Konversi Hexadecimal ↔ Binary
 * 
 * Semua operasi dilakukan client-side menggunakan native JavaScript
 */

import { utils } from './main.js';

/**
 * Fungsi utama untuk render UI Text Converter
 * @param {HTMLElement} container - Container element untuk render
 */
export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h2 class="tool-title">🔄 Text Converter</h2>
            <p class="tool-description">
                Konversi teks ke format Hexadecimal atau Binary, dan sebaliknya. 
                Berguna untuk analisis data, debugging, dan pemrograman tingkat rendah.
            </p>
        </div>

        <!-- Converter Type Selection -->
        <div class="tool-section">
            <h3 class="section-title">🎯 Pilih Jenis Konversi</h3>
            <div class="form-group">
                <select id="conversionType" class="form-control">
                    <option value="text-hex">Text → Hexadecimal</option>
                    <option value="hex-text">Hexadecimal → Text</option>
                    <option value="text-binary">Text → Binary</option>
                    <option value="binary-text">Binary → Text</option>
                    <option value="hex-binary">Hexadecimal → Binary</option>
                    <option value="binary-hex">Binary → Hexadecimal</option>
                </select>
            </div>
        </div>

        <!-- Input Section -->
        <div class="tool-section">
            <h3 class="section-title">📝 Input</h3>
            
            <div class="form-group">
                <label class="form-label" id="inputLabel">Input Text:</label>
                <textarea 
                    id="converterInput" 
                    class="form-textarea" 
                    placeholder="Masukkan teks..."
                    rows="6"
                ></textarea>
            </div>

            <div class="btn-group">
                <button id="btnConvert" class="btn btn-primary">
                    🔄 Konversi
                </button>
                <button id="btnSwap" class="btn btn-secondary">
                    ⇄ Tukar Input/Output
                </button>
                <button id="btnClear" class="btn btn-danger">
                    🗑️ Bersihkan
                </button>
            </div>
        </div>

        <!-- Output Section -->
        <div class="tool-section">
            <h3 class="section-title">📤 Output</h3>
            
            <div class="form-group">
                <label class="form-label" id="outputLabel">Output:</label>
                <div id="converterOutput" class="output-box"></div>
            </div>

            <div id="outputInfo" class="form-group mt-2 hidden">
                <div class="alert alert-info" id="infoContent"></div>
            </div>
        </div>

        <!-- Info Section -->
        <div class="tool-section">
            <h3 class="section-title">💡 Informasi Format</h3>
            <div class="alert alert-info">
                <strong>Hexadecimal (Base-16):</strong><br>
                • Menggunakan digit 0-9 dan huruf A-F<br>
                • Setiap karakter = 2 digit hex (1 byte)<br>
                • Contoh: "A" = 41, "Hello" = 48656C6C6F<br><br>
                
                <strong>Binary (Base-2):</strong><br>
                • Hanya menggunakan 0 dan 1<br>
                • Setiap karakter = 8 digit binary (1 byte)<br>
                • Contoh: "A" = 01000001, "B" = 01000010<br><br>
                
                <strong>Tips:</strong><br>
                • Hexadecimal lebih ringkas daripada Binary<br>
                • Binary lebih mudah untuk memahami representasi bit
            </div>
        </div>
    `;

    initializeEventListeners(container);
}

/**
 * Inisialisasi event listeners
 * @param {HTMLElement} container - Container element
 */
function initializeEventListeners(container) {
    // Elements
    const conversionType = container.querySelector('#conversionType');
    const converterInput = container.querySelector('#converterInput');
    const converterOutput = container.querySelector('#converterOutput');
    const inputLabel = container.querySelector('#inputLabel');
    const outputLabel = container.querySelector('#outputLabel');
    const outputInfo = container.querySelector('#outputInfo');
    const infoContent = container.querySelector('#infoContent');

    // Buttons
    const btnConvert = container.querySelector('#btnConvert');
    const btnSwap = container.querySelector('#btnSwap');
    const btnClear = container.querySelector('#btnClear');

    // Update labels based on conversion type
    const updateLabels = () => {
        const type = conversionType.value;
        const labels = {
            'text-hex': { input: 'Input Text:', output: 'Output Hexadecimal:' },
            'hex-text': { input: 'Input Hexadecimal:', output: 'Output Text:' },
            'text-binary': { input: 'Input Text:', output: 'Output Binary:' },
            'binary-text': { input: 'Input Binary:', output: 'Output Text:' },
            'hex-binary': { input: 'Input Hexadecimal:', output: 'Output Binary:' },
            'binary-hex': { input: 'Input Binary:', output: 'Output Hexadecimal:' }
        };
        
        inputLabel.textContent = labels[type].input;
        outputLabel.textContent = labels[type].output;
        
        // Clear outputs when type changes
        converterOutput.textContent = '';
        outputInfo.classList.add('hidden');
    };

    // Event: Conversion type change
    conversionType.addEventListener('change', updateLabels);

    // Event: Convert
    btnConvert.addEventListener('click', () => {
        const input = converterInput.value;
        
        if (!input.trim()) {
            converterOutput.innerHTML = '<span class="text-muted">⚠️ Masukkan input terlebih dahulu</span>';
            outputInfo.classList.add('hidden');
            return;
        }

        try {
            const type = conversionType.value;
            let output = '';
            
            switch (type) {
                case 'text-hex':
                    output = textToHex(input);
                    break;
                case 'hex-text':
                    output = hexToText(input);
                    break;
                case 'text-binary':
                    output = textToBinary(input);
                    break;
                case 'binary-text':
                    output = binaryToText(input);
                    break;
                case 'hex-binary':
                    output = hexToBinary(input);
                    break;
                case 'binary-hex':
                    output = binaryToHex(input);
                    break;
            }
            
            converterOutput.textContent = output;
            updateOutputInfo(infoContent, type, input, output);
            outputInfo.classList.remove('hidden');
            
        } catch (error) {
            converterOutput.innerHTML = `<span style="color: var(--danger-color);">❌ Error: ${error.message}</span>`;
            outputInfo.classList.add('hidden');
        }
    });

    // Event: Swap input/output
    btnSwap.addEventListener('click', () => {
        const output = converterOutput.textContent;
        
        if (!output || output.includes('⚠️') || output.includes('❌')) {
            return;
        }
        
        converterInput.value = output;
        converterOutput.textContent = '';
        outputInfo.classList.add('hidden');
        
        // Reverse conversion type
        const reverseMap = {
            'text-hex': 'hex-text',
            'hex-text': 'text-hex',
            'text-binary': 'binary-text',
            'binary-text': 'text-binary',
            'hex-binary': 'binary-hex',
            'binary-hex': 'hex-binary'
        };
        
        conversionType.value = reverseMap[conversionType.value];
        updateLabels();
    });

    // Event: Clear
    btnClear.addEventListener('click', () => {
        converterInput.value = '';
        converterOutput.textContent = '';
        outputInfo.classList.add('hidden');
    });

    // Event: Copy
    // Initialize labels
    updateLabels();

    // Add copy/paste buttons to textarea
    setTimeout(() => {
        utils.addTextareaActions(converterInput, {
            showCopy: true,
            showPaste: true
        });

        // Add copy button to output
        utils.addCopyToOutput(converterOutput);

        // Make alerts collapsible
        utils.initAllCollapsibles(container);
    }, 100);
}

// ========== Conversion Functions ==========

/**
 * Konversi text ke hexadecimal
 */
function textToHex(text) {
    return Array.from(text)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Konversi hexadecimal ke text
 */
function hexToText(hex) {
    // Remove spaces and validate
    hex = hex.replace(/\s/g, '');
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
        throw new Error('Input bukan hexadecimal yang valid');
    }
    
    if (hex.length % 2 !== 0) {
        throw new Error('Panjang hexadecimal harus genap');
    }
    
    let text = '';
    for (let i = 0; i < hex.length; i += 2) {
        text += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return text;
}

/**
 * Konversi text ke binary
 */
function textToBinary(text) {
    return Array.from(text)
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
}

/**
 * Konversi binary ke text
 */
function binaryToText(binary) {
    // Remove spaces and validate
    binary = binary.replace(/\s/g, '');
    
    if (!/^[01]+$/.test(binary)) {
        throw new Error('Input bukan binary yang valid (hanya 0 dan 1)');
    }
    
    if (binary.length % 8 !== 0) {
        throw new Error('Panjang binary harus kelipatan 8');
    }
    
    let text = '';
    for (let i = 0; i < binary.length; i += 8) {
        text += String.fromCharCode(parseInt(binary.substr(i, 8), 2));
    }
    return text;
}

/**
 * Konversi hexadecimal ke binary
 */
function hexToBinary(hex) {
    hex = hex.replace(/\s/g, '');
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
        throw new Error('Input bukan hexadecimal yang valid');
    }
    
    return Array.from(hex)
        .map(char => parseInt(char, 16).toString(2).padStart(4, '0'))
        .join(' ');
}

/**
 * Konversi binary ke hexadecimal
 */
function binaryToHex(binary) {
    binary = binary.replace(/\s/g, '');
    
    if (!/^[01]+$/.test(binary)) {
        throw new Error('Input bukan binary yang valid (hanya 0 dan 1)');
    }
    
    // Pad to multiple of 4
    while (binary.length % 4 !== 0) {
        binary = '0' + binary;
    }
    
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        hex += parseInt(binary.substr(i, 4), 2).toString(16);
    }
    return hex.toUpperCase();
}

/**
 * Update informasi output
 */
function updateOutputInfo(element, type, input, output) {
    const inputLen = input.length;
    const outputLen = output.replace(/\s/g, '').length;
    
    let info = `<strong>Input:</strong> ${inputLen} karakter<br>`;
    info += `<strong>Output:</strong> ${outputLen} karakter`;
    
    if (type.includes('binary')) {
        const bits = output.replace(/\s/g, '').length;
        info += ` (${bits} bits)`;
    }
    
    element.innerHTML = info;
}

/**
 * Tampilkan pesan sementara pada button
 */
function showTempMessage(button, message) {
    const originalText = button.innerHTML;
    button.innerHTML = message;
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 2000);
}
