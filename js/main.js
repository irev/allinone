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
const toolContainer = document.getElementById('toolContainer');
const navLinks = document.querySelectorAll('.nav-link');

/**
 * Fungsi untuk memuat tool secara dinamis
 * @param {string} toolName - Nama tool yang akan dimuat
 */
async function loadTool(toolName) {
    try {
        // Tampilkan loading
        toolContainer.innerHTML = `
            <div class="loading">
                <p>⏳ Memuat alat ${toolName}...</p>
            </div>
        `;

        // Import modul secara dinamis
        const module = await import(`./js/${toolName}.js`);
        
        // Bersihkan container
        toolContainer.innerHTML = '';
        
        // Render tool menggunakan fungsi render() dari modul
        if (typeof module.render === 'function') {
            await module.render(toolContainer);
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
    navLinks.forEach(link => {
        if (link.dataset.tool === toolName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Event listener untuk navigasi
 */
navLinks.forEach(link => {
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
    });
});

/**
 * Handle browser back/forward button
 */
window.addEventListener('hashchange', async () => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== currentTool) {
        currentTool = hash;
        updateActiveNav(hash);
        await loadTool(hash);
    }
});

/**
 * Inisialisasi aplikasi saat DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Cek apakah ada hash di URL
    const hash = window.location.hash.slice(1);
    
    if (hash) {
        currentTool = hash;
        updateActiveNav(hash);
    }
    
    // Load tool pertama kali
    await loadTool(currentTool);
});

/**
 * Utility functions yang bisa digunakan oleh semua modul
 */

// Export utility functions untuk digunakan oleh modul lain
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
