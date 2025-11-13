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
    'baseconv': 'Base Converters'
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
 * Toggle sidebar on mobile
 */
function toggleSidebar() {
    if (sidebar && mainWrapper) {
        sidebar.classList.toggle('show');
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
    
    // Setup sidebar toggle button
    const btnToggleSidebar = document.getElementById('btnToggleSidebar');
    if (btnToggleSidebar) {
        btnToggleSidebar.addEventListener('click', toggleSidebar);
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
