/**
 * Entropy & Password Strength Calculator
 * Calculate entropy, analyze password strength, detect patterns
 */

export function render(container) {
    container.innerHTML = `
        <div class="tool-header">
            <h1 class="tool-title">Password Strength & Entropy Calculator</h1>
            <p class="tool-description">
                Analyze password strength, calculate entropy, detect common patterns, 
                and get suggestions for improvement.
            </p>

            <div class="form-group">
                <label for="passwordInput"><strong>Enter Password:</strong></label>
                <div style="position: relative;">
                    <input 
                        type="password" 
                        id="passwordInput" 
                        class="form-control" 
                        placeholder="Enter password to analyze..."
                        autocomplete="off"
                    >
                    <button 
                        id="toggleVisibility" 
                        class="btn btn-sm" 
                        style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);"
                    >👁️ Show</button>
                </div>
            </div>

            <div id="strengthResult" style="margin-top: 20px;">
                <!-- Strength meter and results -->
            </div>

            <div id="entropyDetails" style="display: none; margin-top: 20px;">
                <h3>Entropy Analysis</h3>
                <div class="output-section">
                    <table class="info-table">
                        <tr>
                            <td><strong>Entropy:</strong></td>
                            <td id="entropyValue"></td>
                        </tr>
                        <tr>
                            <td><strong>Pool Size:</strong></td>
                            <td id="poolSize"></td>
                        </tr>
                        <tr>
                            <td><strong>Character Set:</strong></td>
                            <td id="charSet"></td>
                        </tr>
                        <tr>
                            <td><strong>Time to Crack (brute force):</strong></td>
                            <td id="crackTime"></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div id="patternAnalysis" style="display: none; margin-top: 20px;">
                <h3>Pattern Detection</h3>
                <div id="patternsList" class="output-section">
                    <!-- Pattern warnings -->
                </div>
            </div>

            <div id="suggestions" style="display: none; margin-top: 20px;">
                <h3>Suggestions for Improvement</h3>
                <div id="suggestionsList" class="alert alert-info">
                    <!-- Suggestions -->
                </div>
            </div>

            <div id="composition" style="display: none; margin-top: 20px;">
                <h3>Password Composition</h3>
                <div class="output-section">
                    <table class="info-table">
                        <tr>
                            <td><strong>Length:</strong></td>
                            <td id="lengthInfo"></td>
                        </tr>
                        <tr>
                            <td><strong>Lowercase:</strong></td>
                            <td id="lowercaseInfo"></td>
                        </tr>
                        <tr>
                            <td><strong>Uppercase:</strong></td>
                            <td id="uppercaseInfo"></td>
                        </tr>
                        <tr>
                            <td><strong>Digits:</strong></td>
                            <td id="digitsInfo"></td>
                        </tr>
                        <tr>
                            <td><strong>Special Characters:</strong></td>
                            <td id="specialInfo"></td>
                        </tr>
                        <tr>
                            <td><strong>Unique Characters:</strong></td>
                            <td id="uniqueInfo"></td>
                        </tr>
                    </table>
                </div>
            </div>

            <div class="form-group" style="margin-top: 30px;">
                <h3>Password Generator</h3>
                
                <div class="form-group">
                    <label>Password Length: <strong id="genLengthValue">16</strong></label>
                    <input 
                        type="range" 
                        id="genLength" 
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
                    <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">Character Types</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="genLowercase" checked> Lowercase (a-z)</label>
                    </div>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="genUppercase" checked> Uppercase (A-Z)</label>
                    </div>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="genDigits" checked> Digits (0-9)</label>
                    </div>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="genSpecial" checked> Special (!@#$%^&*)</label>
                    </div>
                    <div class="checkbox-group">
                        <label><input type="checkbox" id="genAmbiguous"> Exclude ambiguous (0, O, l, I)</label>
                    </div>
                </div>
                
                <button id="generateBtn" class="btn btn-primary">🎲 Generate Password</button>
                
                <div class="output-section" style="margin-top: 10px; display: none;" id="generatedSection">
                    <label><strong>Generated Password:</strong></label>
                    <input type="text" id="generatedPassword" class="form-control" readonly>
                    <div class="button-group" style="margin-top: 0.5rem;">
                        <button id="copyGenBtn" class="btn btn-secondary btn-sm">📋 Copy</button>
                        <button id="analyzeGenBtn" class="btn btn-secondary btn-sm">🔍 Analyze</button>
                    </div>
                </div>
            </div>

        <style>
            .strength-meter {
                width: 100%;
                height: 30px;
                background: #e0e0e0;
                border-radius: 5px;
                overflow: hidden;
                margin: 10px 0;
            }

            .strength-bar {
                height: 100%;
                transition: width 0.3s, background-color 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }

            .strength-very-weak { background-color: #d32f2f; }
            .strength-weak { background-color: #f57c00; }
            .strength-medium { background-color: #fbc02d; color: #333; }
            .strength-strong { background-color: #689f38; }
            .strength-very-strong { background-color: #388e3c; }
        </style>
    `;

    // Elements
    const passwordInput = container.querySelector('#passwordInput');
    const toggleVisibility = container.querySelector('#toggleVisibility');
    const strengthResult = container.querySelector('#strengthResult');
    const entropyDetails = container.querySelector('#entropyDetails');
    const patternAnalysis = container.querySelector('#patternAnalysis');
    const suggestions = container.querySelector('#suggestions');
    const composition = container.querySelector('#composition');

    const generateBtn = container.querySelector('#generateBtn');
    const generatedSection = container.querySelector('#generatedSection');
    const generatedPassword = container.querySelector('#generatedPassword');
    const copyGenBtn = container.querySelector('#copyGenBtn');
    const analyzeGenBtn = container.querySelector('#analyzeGenBtn');
    const genLengthSlider = container.querySelector('#genLength');
    const genLengthValue = container.querySelector('#genLengthValue');

    // Update slider value display and background
    function updateGenLengthSlider() {
        if (genLengthSlider && genLengthValue) {
            genLengthValue.textContent = genLengthSlider.value;
            
            // Update slider background gradient
            const min = parseInt(genLengthSlider.min) || 8;
            const max = parseInt(genLengthSlider.max) || 64;
            const value = parseInt(genLengthSlider.value);
            const percentage = ((value - min) / (max - min)) * 100;
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            const trackColor = isDarkMode ? '#374151' : '#e5e7eb';
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#3b82f6';
            
            genLengthSlider.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${primaryColor} ${percentage}%, ${trackColor} ${percentage}%, ${trackColor} 100%)`;
        }
    }

    // Toggle password visibility
    toggleVisibility.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleVisibility.textContent = '🙈 Hide';
        } else {
            passwordInput.type = 'password';
            toggleVisibility.textContent = '👁️ Show';
        }
    });

    // Analyze on input
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        if (password.length > 0) {
            analyzePassword(password);
        } else {
            strengthResult.innerHTML = '';
            entropyDetails.style.display = 'none';
            patternAnalysis.style.display = 'none';
            suggestions.style.display = 'none';
            composition.style.display = 'none';
        }
    });

    // Update slider on input
    if (genLengthSlider) {
        genLengthSlider.addEventListener('input', updateGenLengthSlider);
    }

    // Generate password
    generateBtn.addEventListener('click', () => {
        const length = parseInt(container.querySelector('#genLength').value) || 16;
        const useLowercase = container.querySelector('#genLowercase').checked;
        const useUppercase = container.querySelector('#genUppercase').checked;
        const useDigits = container.querySelector('#genDigits').checked;
        const useSpecial = container.querySelector('#genSpecial').checked;
        const excludeAmbiguous = container.querySelector('#genAmbiguous').checked;

        if (!useLowercase && !useUppercase && !useDigits && !useSpecial) {
            alert('Please select at least one character type');
            return;
        }

        const password = generatePassword(length, {
            lowercase: useLowercase,
            uppercase: useUppercase,
            digits: useDigits,
            special: useSpecial,
            excludeAmbiguous
        });

        generatedPassword.value = password;
        generatedSection.style.display = 'block';
    });

    copyGenBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(generatedPassword.value);
            copyGenBtn.textContent = 'Copied!';
            setTimeout(() => copyGenBtn.textContent = 'Copy', 2000);
        } catch (err) {
            alert('Failed to copy');
        }
    });

    analyzeGenBtn.addEventListener('click', () => {
        passwordInput.value = generatedPassword.value;
        analyzePassword(generatedPassword.value);
    });

    // Initialize slider
    updateGenLengthSlider();

    // Analysis functions
    function analyzePassword(password) {
        const analysis = {
            length: password.length,
            lowercase: (password.match(/[a-z]/g) || []).length,
            uppercase: (password.match(/[A-Z]/g) || []).length,
            digits: (password.match(/[0-9]/g) || []).length,
            special: (password.match(/[^a-zA-Z0-9]/g) || []).length,
            unique: new Set(password).size
        };

        const entropy = calculateEntropy(password);
        const strength = calculateStrength(password, analysis, entropy);
        const patterns = detectPatterns(password);

        displayStrength(strength);
        displayEntropy(entropy, password);
        displayComposition(analysis);
        displayPatterns(patterns);
        displaySuggestions(password, analysis, patterns, strength);
    }

    function calculateEntropy(password) {
        const length = password.length;
        let poolSize = 0;

        if (/[a-z]/.test(password)) poolSize += 26;
        if (/[A-Z]/.test(password)) poolSize += 26;
        if (/[0-9]/.test(password)) poolSize += 10;
        if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32; // Approximate special chars

        const entropy = length * Math.log2(poolSize);
        
        return {
            bits: entropy,
            poolSize: poolSize,
            length: length
        };
    }

    function calculateStrength(password, analysis, entropy) {
        let score = 0;

        // Length score (0-30)
        if (analysis.length >= 16) score += 30;
        else if (analysis.length >= 12) score += 20;
        else if (analysis.length >= 8) score += 10;
        else score += 5;

        // Complexity score (0-40)
        if (analysis.lowercase > 0) score += 10;
        if (analysis.uppercase > 0) score += 10;
        if (analysis.digits > 0) score += 10;
        if (analysis.special > 0) score += 10;

        // Entropy score (0-30)
        if (entropy.bits >= 80) score += 30;
        else if (entropy.bits >= 60) score += 20;
        else if (entropy.bits >= 40) score += 10;

        // Unique characters bonus
        const uniqueRatio = analysis.unique / analysis.length;
        if (uniqueRatio > 0.8) score += 10;
        else if (uniqueRatio > 0.6) score += 5;

        // Cap at 100
        score = Math.min(score, 100);

        let level, className;
        if (score >= 80) {
            level = 'Very Strong';
            className = 'strength-very-strong';
        } else if (score >= 60) {
            level = 'Strong';
            className = 'strength-strong';
        } else if (score >= 40) {
            level = 'Medium';
            className = 'strength-medium';
        } else if (score >= 20) {
            level = 'Weak';
            className = 'strength-weak';
        } else {
            level = 'Very Weak';
            className = 'strength-very-weak';
        }

        return { score, level, className };
    }

    function detectPatterns(password) {
        const patterns = [];

        // Common patterns
        if (/^[a-z]+$/.test(password)) patterns.push('Only lowercase letters');
        if (/^[A-Z]+$/.test(password)) patterns.push('Only uppercase letters');
        if (/^[0-9]+$/.test(password)) patterns.push('Only digits');
        if (/(.)\1{2,}/.test(password)) patterns.push('Repeated characters detected');
        if (/^[a-zA-Z]+[0-9]+$/.test(password)) patterns.push('Letters followed by numbers (common pattern)');
        if (/123|234|345|456|567|678|789|890/.test(password)) patterns.push('Sequential numbers detected');
        if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) {
            patterns.push('Sequential letters detected');
        }
        if (/qwert|asdf|zxcv/i.test(password)) patterns.push('Keyboard pattern detected');
        
        // Common words (simplified check)
        const commonWords = ['password', 'admin', 'user', 'login', 'welcome', 'letmein', 'monkey', 'dragon'];
        for (const word of commonWords) {
            if (password.toLowerCase().includes(word)) {
                patterns.push(`Contains common word: "${word}"`);
            }
        }

        // Date patterns
        if (/19\d{2}|20\d{2}/.test(password)) patterns.push('Possible year detected');
        if (/\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2}/.test(password)) patterns.push('Date pattern detected');

        return patterns;
    }

    function displayStrength(strength) {
        strengthResult.innerHTML = `
            <div class="strength-meter">
                <div class="strength-bar ${strength.className}" style="width: ${strength.score}%;">
                    ${strength.level} (${strength.score}/100)
                </div>
            </div>
        `;
    }

    function displayEntropy(entropy, password) {
        container.querySelector('#entropyValue').textContent = `${entropy.bits.toFixed(2)} bits`;
        container.querySelector('#poolSize').textContent = `${entropy.poolSize} characters`;
        
        let charSetDesc = [];
        if (/[a-z]/.test(password)) charSetDesc.push('lowercase');
        if (/[A-Z]/.test(password)) charSetDesc.push('uppercase');
        if (/[0-9]/.test(password)) charSetDesc.push('digits');
        if (/[^a-zA-Z0-9]/.test(password)) charSetDesc.push('special');
        container.querySelector('#charSet').textContent = charSetDesc.join(', ');

        // Estimate crack time (assuming 1 billion guesses/second)
        const combinations = Math.pow(entropy.poolSize, entropy.length);
        const secondsToGuess = combinations / 1e9;
        container.querySelector('#crackTime').textContent = formatTime(secondsToGuess);

        entropyDetails.style.display = 'block';
    }

    function displayComposition(analysis) {
        container.querySelector('#lengthInfo').textContent = `${analysis.length} characters`;
        container.querySelector('#lowercaseInfo').textContent = `${analysis.lowercase} characters`;
        container.querySelector('#uppercaseInfo').textContent = `${analysis.uppercase} characters`;
        container.querySelector('#digitsInfo').textContent = `${analysis.digits} characters`;
        container.querySelector('#specialInfo').textContent = `${analysis.special} characters`;
        container.querySelector('#uniqueInfo').textContent = `${analysis.unique} / ${analysis.length} (${Math.round(analysis.unique/analysis.length*100)}%)`;

        composition.style.display = 'block';
    }

    function displayPatterns(patterns) {
        if (patterns.length > 0) {
            const html = '<ul>' + patterns.map(p => `<li>${escapeHtml(p)}</li>`).join('') + '</ul>';
            container.querySelector('#patternsList').innerHTML = 
                '<div class="alert alert-warning"><strong>⚠️ Patterns Detected:</strong>' + html + '</div>';
            patternAnalysis.style.display = 'block';
        } else {
            container.querySelector('#patternsList').innerHTML = 
                '<div class="alert alert-success">✓ No common patterns detected</div>';
            patternAnalysis.style.display = 'block';
        }
    }

    function displaySuggestions(password, analysis, patterns, strength) {
        const suggestionList = [];

        if (analysis.length < 12) suggestionList.push('Use at least 12 characters (16+ recommended)');
        if (analysis.lowercase === 0) suggestionList.push('Add lowercase letters');
        if (analysis.uppercase === 0) suggestionList.push('Add uppercase letters');
        if (analysis.digits === 0) suggestionList.push('Add digits');
        if (analysis.special === 0) suggestionList.push('Add special characters');
        if (analysis.unique / analysis.length < 0.7) suggestionList.push('Use more unique characters');
        if (patterns.length > 0) suggestionList.push('Avoid common patterns and predictable sequences');

        if (suggestionList.length > 0) {
            const html = '<ul>' + suggestionList.map(s => `<li>${s}</li>`).join('') + '</ul>';
            container.querySelector('#suggestionsList').innerHTML = html;
            suggestions.style.display = 'block';
        } else {
            container.querySelector('#suggestionsList').innerHTML = '✓ Your password looks good!';
            suggestions.style.display = 'block';
        }
    }

    function formatTime(seconds) {
        if (seconds < 1) return 'Instant';
        if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
        if (seconds < 3600) return `${(seconds / 60).toFixed(2)} minutes`;
        if (seconds < 86400) return `${(seconds / 3600).toFixed(2)} hours`;
        if (seconds < 31536000) return `${(seconds / 86400).toFixed(2)} days`;
        if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(2)} years`;
        return `${(seconds / 31536000).toExponential(2)} years (extremely long)`;
    }

    function generatePassword(length, options) {
        let chars = '';
        if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (options.digits) chars += '0123456789';
        if (options.special) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (options.excludeAmbiguous) {
            chars = chars.replace(/[0Ol1I]/g, '');
        }

        let password = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            password += chars[array[i] % chars.length];
        }

        return password;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
