/**
 * Web Security Tools - Main Application
 * 
 * File ini bertanggung jawab untuk:
 * 1. Menangani navigasi antar tool
 * 2. Memuat modul tool secara dinamis menggunakan async import()
 * 3. Mengelola state aplikasi
 */

// State management
let currentTool = 'base64';
let toolContainer = null;
let navLinks = null;
let pageTitle = null;
let sidebar = null;
let mainWrapper = null;

// Tool titles mapping
const toolTitles = {
    'base64': 'Base64 Encoder/Decoder',
    'url': 'URL Encoder/Decoder',
    'hash': 'Hash Generator',
    'converter': 'Text Converter',
    'htmlentities': 'HTML Entities Encoder/Decoder',
    'jwt': 'JWT Inspector',
    'hmac': 'HMAC Generator',
    'sri': 'SRI Generator',
    'cookie': 'Cookie Parser/Builder',
    'secheaders': 'Security Headers Checker',
    'csp': 'CSP Analyzer',
    'xss': 'XSS Payload Encoder',
    'regex': 'Regex Tester',
    'baseconv': 'Base Converters',
    'pemcert': 'PEM Certificate Viewer',
    'urlparser': 'URL Parser & Normalizer',
    'diff': 'Diff/Compare Tool',
    'entropy': 'Password Strength & Entropy Calculator',
    'tlscors': 'TLS/SSL & CORS Tester',
    'sqli': 'SQL Injection Payload Encoder'
};

/**
 * Fungsi untuk memuat tool secara dinamis
 * @param {string} toolName - Nama tool yang akan dimuat
 */
async function loadTool(toolName) {
    if (!toolContainer) return;
    
    try {
        // Tampilkan loading
        toolContainer.innerHTML = `
            <div class="loading">
                <p>⏳ Memuat alat ${toolName}...</p>
            </div>
        `;

        // Import modul secara dinamis
        const module = await import(`./${toolName}.js`);
        
        // Bersihkan container
        toolContainer.innerHTML = '';
        
        // Render tool menggunakan fungsi render() dari modul
        if (typeof module.render === 'function') {
            module.render(toolContainer);
        } else {
            throw new Error(`Modul ${toolName} tidak memiliki fungsi render()`);
        }
        
    } catch (error) {
        console.error(`Error loading tool ${toolName}:`, error);
        toolContainer.innerHTML = `
            <div class="alert alert-danger">
                <strong>❌ Error!</strong><br>
                Gagal memuat alat <strong>${toolName}</strong>.<br>
                Detail: ${error.message}
            </div>
        `;
    }
}

/**
 * Fungsi untuk mengupdate navigasi aktif
 * @param {string} toolName - Nama tool yang aktif
 */
function updateActiveNav(toolName) {
    if (!navLinks) return;
    
    navLinks.forEach((link) => {
        if (link.dataset.tool === toolName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update page title
    if (pageTitle && toolTitles[toolName]) {
        pageTitle.textContent = toolTitles[toolName];
    }
}

/**
 * Toggle sidebar visibility
 */
function toggleSidebar() {
    if (sidebar && mainWrapper) {
        const btnShowSidebar = document.getElementById('btnShowSidebar');
        
        // For mobile: use 'show' class
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
        } else {
            // For desktop: use 'hidden' class
            const isHidden = sidebar.classList.toggle('hidden');
            mainWrapper.classList.toggle('sidebar-hidden');
            
            // Show/hide button show sidebar di top-bar
            if (btnShowSidebar) {
                btnShowSidebar.style.display = isHidden ? 'flex' : 'none';
            }
        }
    }
}

/**
 * Initialize navigation event listeners
 */
function initializeNavigation() {
    if (!navLinks) return;
    
    navLinks.forEach((link) => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const toolName = link.dataset.tool;
            
            // Jangan reload jika sudah di tool yang sama
            if (toolName === currentTool) {
                return;
            }
            
            // Update state
            currentTool = toolName;
            
            // Update UI navigasi
            updateActiveNav(toolName);
            
            // Load tool
            await loadTool(toolName);
            
            // Update URL hash tanpa reload page
            window.location.hash = toolName;
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('show');
            }
        });
    });
    
    // Setup sidebar toggle buttons
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    const btnHideSidebar = document.getElementById('btnHideSidebar');
    const btnShowSidebar = document.getElementById('btnShowSidebar');
    
    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', toggleSidebar);
    }
    
    if (btnHideSidebar) {
        btnHideSidebar.addEventListener('click', toggleSidebar);
    }
    
    if (btnShowSidebar) {
        btnShowSidebar.addEventListener('click', toggleSidebar);
    }
}

/**
 * Handle browser back/forward button
 */
function handleHashChange() {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== currentTool) {
        currentTool = hash;
        updateActiveNav(hash);
        loadTool(hash);
    }
}

/**
 * Inisialisasi aplikasi saat DOM ready
 */
function initializeApp() {
    // Initialize DOM references
    toolContainer = document.getElementById('toolContainer');
    navLinks = document.querySelectorAll('.nav-link');
    pageTitle = document.getElementById('pageTitle');
    sidebar = document.querySelector('.sidebar');
    mainWrapper = document.querySelector('.main-wrapper');
    
    // Cek apakah ada hash di URL
    const hash = window.location.hash.slice(1);
    
    if (hash) {
        currentTool = hash;
        updateActiveNav(hash);
    }
    
    // Setup navigation
    initializeNavigation();
    
    // Setup hash change listener
    window.addEventListener('hashchange', handleHashChange);
    
    // Load tool pertama kali
    loadTool(currentTool);
    
    // Close sidebar when clicking outside on mobile
    if (window.innerWidth <= 768) {
        document.addEventListener('click', (e) => {
            if (sidebar && !sidebar.contains(e.target) && !e.target.closest('.btn-icon')) {
                sidebar.classList.remove('show');
            }
        });
    }
}

/**
 * Main render function untuk konsistensi dengan modul lain
 * @param {HTMLElement} container - Container element (tidak digunakan di main)
 */
export function render(container) {
    // Main.js tidak memerlukan render ke container
    // Fungsi ini ada untuk konsistensi struktur modul
    console.log('Main module loaded');
}

/**
 * Utility functions yang bisa digunakan oleh semua modul
 */
export const utils = {
    /**
     * Salin teks ke clipboard
     * @param {string} text - Teks yang akan disalin
     * @returns {Promise<boolean>} - True jika berhasil
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    },

    /**
     * Tampilkan notifikasi sementara
     * @param {HTMLElement} element - Element untuk menampilkan notifikasi
     * @param {string} message - Pesan notifikasi
     * @param {string} type - Tipe notifikasi (success, error, info, warning)
     */
    showNotification(element, message, type = 'success') {
        const alertClass = `alert-${type}`;
        const notification = document.createElement('div');
        notification.className = `alert ${alertClass}`;
        notification.textContent = message;
        
        element.insertBefore(notification, element.firstChild);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transition = 'opacity 0.5s';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    },

    /**
     * Validasi apakah input tidak kosong
     * @param {string} text - Teks untuk divalidasi
     * @returns {boolean}
     */
    isNotEmpty(text) {
        return text && text.trim().length > 0;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

/**
 * ============================================
 * ADDITIONAL FEATURES: Dark Mode, Shortcuts, AutoSave
 * ============================================
 */

// Dark Mode Management
function initializeDarkMode() {
    const btnDarkMode = document.getElementById('btnDarkMode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    // Load saved preference or default to dark mode
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode === null ? true : savedMode === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeIcon) darkModeIcon.textContent = '☀️';
    }
    
    // Function to toggle dark mode
    const toggleDarkMode = () => {
        document.body.classList.toggle('dark-mode');
        const isNowDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isNowDark);
        const icon = isNowDark ? '☀️' : '🌙';
        if (darkModeIcon) darkModeIcon.textContent = icon;
    };
    
    // Toggle dark mode from top bar
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', toggleDarkMode);
    }
}

// Keyboard Shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K: Focus search/navigation
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const firstNavLink = document.querySelector('.nav-link');
            if (firstNavLink) firstNavLink.focus();
        }
        
        // Ctrl/Cmd + D: Toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            document.getElementById('btnDarkMode')?.click();
        }
        
        // Ctrl/Cmd + B: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Ctrl/Cmd + S: Save current state (autosave)
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentState();
            showToast('✓ State saved', 'success');
        }
        
        // Ctrl/Cmd + E: Export config
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            exportConfig();
        }
        
        // Escape: Clear focus
        if (e.key === 'Escape') {
            document.activeElement?.blur();
        }
    });
}

// AutoSave functionality
function saveCurrentState() {
    const state = {
        currentTool: currentTool,
        timestamp: new Date().toISOString()
    };
    
    // Save all textareas and inputs
    const inputs = document.querySelectorAll('textarea, input[type="text"]');
    const inputStates = {};
    inputs.forEach((input, index) => {
        if (input.id) {
            inputStates[input.id] = input.value;
        }
    });
    
    state.inputs = inputStates;
    localStorage.setItem('appState', JSON.stringify(state));
}

// Load saved state
function loadSavedState() {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            
            // Restore inputs after tool loads
            setTimeout(() => {
                Object.keys(state.inputs || {}).forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = state.inputs[id];
                    }
                });
            }, 500);
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }
}

// AutoSave every 30 seconds
let autoSaveInterval;
function startAutoSave() {
    autoSaveInterval = setInterval(() => {
        saveCurrentState();
    }, 30000); // 30 seconds
}

// Export configuration
function exportConfig() {
    const config = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        darkMode: document.body.classList.contains('dark-mode'),
        currentTool: currentTool,
        history: getHistory()
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-tools-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('✓ Config exported', 'success');
}

// Import configuration
function importConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const config = JSON.parse(text);
            
            // Apply configuration
            if (config.darkMode && !document.body.classList.contains('dark-mode')) {
                document.getElementById('btnDarkMode')?.click();
            } else if (!config.darkMode && document.body.classList.contains('dark-mode')) {
                document.getElementById('btnDarkMode')?.click();
            }
            
            if (config.currentTool) {
                navigateToTool(config.currentTool);
            }
            
            showToast('✓ Config imported', 'success');
        } catch (error) {
            showToast('✗ Invalid config file', 'error');
            console.error('Import error:', error);
        }
    };
    
    input.click();
}

// History management
function addToHistory(tool, action) {
    let history = getHistory();
    history.unshift({
        tool,
        action,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 items
    history = history.slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(history));
}

function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('toolHistory') || '[]');
    } catch {
        return [];
    }
}

function clearHistory() {
    localStorage.removeItem('toolHistory');
    localStorage.removeItem('appState');
    showToast('✓ History cleared', 'success');
}

// Toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 24px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 0.9rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// Initialize additional features
setTimeout(() => {
    initializeDarkMode();
    initializeKeyboardShortcuts();
    loadSavedState();
    startAutoSave();
    
    // Bind export/import buttons
    const btnExport = document.getElementById('btnExportConfig');
    const btnImport = document.getElementById('btnImportConfig');
    const btnClearHistory = document.getElementById('btnClearHistory');
    
    if (btnExport) {
        btnExport.addEventListener('click', exportConfig);
    }
    
    if (btnImport) {
        btnImport.addEventListener('click', importConfig);
    }
    
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', () => {
            if (confirm('Clear all history and saved states?')) {
                clearHistory();
            }
        });
    }
}, 100);
