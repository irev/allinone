/**
 * Snippet Vault
 * Save and manage code snippets locally using localStorage
 */

function initSnippetVault() {
    return `
        <div class="tool-header">
            <h2>Snippet Vault</h2>
            <p>Save and organize your favorite code snippets locally</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Add New Snippet</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Snippet Title</label>
                    <input 
                        type="text" 
                        id="snippetTitle" 
                        class="form-control" 
                        placeholder="e.g., Docker Compose for Node.js"
                    />
                </div>
                
                <div class="form-group">
                    <label>Language / Category</label>
                    <select id="snippetLang" class="form-control">
                        <option value="bash">Bash / Shell</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="docker">Docker</option>
                        <option value="sql">SQL</option>
                        <option value="yaml">YAML</option>
                        <option value="json">JSON</option>
                        <option value="nginx">Nginx</option>
                        <option value="systemd">Systemd</option>
                        <option value="cron">Cron</option>
                        <option value="regex">Regex</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Tags <small>(comma separated)</small></label>
                    <input 
                        type="text" 
                        id="snippetTags" 
                        class="form-control" 
                        placeholder="docker, deployment, production"
                    />
                </div>
                
                <div class="form-group">
                    <label>Code Snippet</label>
                    <textarea 
                        id="snippetCode" 
                        class="form-control" 
                        rows="8"
                        placeholder="Paste your code here..."
                        style="font-family: 'Courier New', monospace;"
                    ></textarea>
                </div>
                
                <div class="form-group">
                    <label>Description / Notes <small>(optional)</small></label>
                    <textarea 
                        id="snippetDesc" 
                        class="form-control" 
                        rows="2"
                        placeholder="What does this snippet do?"
                    ></textarea>
                </div>
                
                <div style="display: flex; gap: 0.5rem;">
                    <button id="btnSaveSnippet" class="btn btn-primary">
                        💾 Save Snippet
                    </button>
                    <button id="btnClearForm" class="btn btn-secondary">
                        🗑️ Clear Form
                    </button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Saved Snippets</h3>
                <div style="display: flex; gap: 0.5rem;">
                    <select id="filterLang" class="form-control" style="width: auto;">
                        <option value="">All Languages</option>
                    </select>
                    <input 
                        type="text" 
                        id="searchSnippets" 
                        class="form-control" 
                        placeholder="🔍 Search snippets..."
                        style="width: 200px;"
                    />
                </div>
            </div>
            <div class="card-body">
                <div id="snippetsList"></div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Import / Export</h3>
            </div>
            <div class="card-body">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button id="btnExportSnippets" class="btn btn-secondary">
                        📤 Export All Snippets (JSON)
                    </button>
                    <label class="btn btn-secondary" style="margin: 0; cursor: pointer;">
                        📥 Import Snippets
                        <input type="file" id="importFile" accept=".json" style="display: none;">
                    </label>
                    <button id="btnClearAll" class="btn btn-danger">
                        🗑️ Clear All Snippets
                    </button>
                </div>
                <div id="importStatus" style="margin-top: 0.5rem;"></div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 Tips</h4>
            <ul>
                <li>Snippets are saved in your browser's local storage</li>
                <li>Export regularly to backup your snippets</li>
                <li>Use tags for better organization (e.g., "security", "docker", "automation")</li>
                <li>Click on a snippet to view and copy the code</li>
            </ul>
        </div>
    `;
}

const STORAGE_KEY = 'snippet-vault';

function saveSnippet() {
    const title = document.getElementById('snippetTitle').value.trim();
    const lang = document.getElementById('snippetLang').value;
    const tags = document.getElementById('snippetTags').value.trim();
    const code = document.getElementById('snippetCode').value.trim();
    const desc = document.getElementById('snippetDesc').value.trim();
    
    if (!title) {
        alert('⚠️ Please enter a title');
        return;
    }
    
    if (!code) {
        alert('⚠️ Please enter code snippet');
        return;
    }
    
    const snippet = {
        id: Date.now(),
        title,
        lang,
        tags: tags.split(',').map(t => t.trim()).filter(t => t),
        code,
        desc,
        created: new Date().toISOString()
    };
    
    const snippets = getSnippets();
    snippets.unshift(snippet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
    
    clearForm();
    displaySnippets();
    
    // Show success message
    const form = document.querySelector('.card-body');
    const msg = document.createElement('div');
    msg.className = 'alert alert-success';
    msg.textContent = '✅ Snippet saved successfully!';
    form.insertBefore(msg, form.firstChild);
    setTimeout(() => msg.remove(), 3000);
}

function getSnippets() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function clearForm() {
    document.getElementById('snippetTitle').value = '';
    document.getElementById('snippetLang').value = 'bash';
    document.getElementById('snippetTags').value = '';
    document.getElementById('snippetCode').value = '';
    document.getElementById('snippetDesc').value = '';
}

function displaySnippets() {
    const snippets = getSnippets();
    const container = document.getElementById('snippetsList');
    const searchTerm = document.getElementById('searchSnippets').value.toLowerCase();
    const filterLang = document.getElementById('filterLang').value;
    
    let filtered = snippets;
    
    // Apply filters
    if (searchTerm) {
        filtered = filtered.filter(s => 
            s.title.toLowerCase().includes(searchTerm) ||
            s.desc.toLowerCase().includes(searchTerm) ||
            s.code.toLowerCase().includes(searchTerm) ||
            s.tags.some(t => t.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filterLang) {
        filtered = filtered.filter(s => s.lang === filterLang);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="alert alert-secondary">No snippets found. Create your first snippet above! 🚀</div>';
        return;
    }
    
    let html = '<div style="display: grid; gap: 1rem;">';
    
    filtered.forEach(snippet => {
        const preview = snippet.code.length > 200 
            ? snippet.code.substring(0, 200) + '...' 
            : snippet.code;
        
        html += `
            <div class="card" style="margin: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div class="card-header" style="background: var(--secondary-bg); padding: 0.75rem 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <strong>${escapeHtml(snippet.title)}</strong>
                            <span style="margin-left: 0.5rem; padding: 2px 8px; background: var(--primary-color); color: white; border-radius: 3px; font-size: 0.75rem;">
                                ${escapeHtml(snippet.lang)}
                            </span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-secondary view-snippet-btn" data-id="${snippet.id}">
                                👁️ View
                            </button>
                            <button class="btn btn-sm btn-danger delete-snippet-btn" data-id="${snippet.id}">
                                🗑️
                            </button>
                        </div>
                    </div>
                    ${snippet.desc ? `<div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.8;">${escapeHtml(snippet.desc)}</div>` : ''}
                    ${snippet.tags.length > 0 ? `
                        <div style="margin-top: 0.5rem;">
                            ${snippet.tags.map(tag => 
                                `<span style="padding: 2px 6px; background: var(--border-color); border-radius: 3px; font-size: 0.75rem; margin-right: 0.25rem;">
                                    #${escapeHtml(tag)}
                                </span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
                <div class="snippet-preview-${snippet.id}" style="display: none; padding: 1rem;">
                    <code>${escapeHtml(snippet.code)}</code>
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-primary copy-snippet-btn" data-code="${escapeHtml(snippet.code)}">
                            📋 Copy Code
                        </button>
                        <button class="btn btn-sm btn-secondary edit-snippet-btn" data-id="${snippet.id}">
                            ✏️ Edit
                        </button>
                    </div>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; opacity: 0.6;">
                        Created: ${new Date(snippet.created).toLocaleString()}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add event listeners
    container.querySelectorAll('.view-snippet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const preview = document.querySelector(`.snippet-preview-${id}`);
            if (preview.style.display === 'none') {
                preview.style.display = 'block';
                e.target.textContent = '🔼 Hide';
            } else {
                preview.style.display = 'none';
                e.target.textContent = '👁️ View';
            }
        });
    });
    
    container.querySelectorAll('.copy-snippet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = e.target.dataset.code;
            navigator.clipboard.writeText(code).then(() => {
                e.target.textContent = '✅ Copied!';
                setTimeout(() => {
                    e.target.textContent = '📋 Copy Code';
                }, 2000);
            });
        });
    });
    
    container.querySelectorAll('.delete-snippet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Delete this snippet?')) {
                const id = parseInt(e.target.dataset.id);
                const snippets = getSnippets().filter(s => s.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
                displaySnippets();
            }
        });
    });
    
    container.querySelectorAll('.edit-snippet-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            const snippet = getSnippets().find(s => s.id === id);
            if (snippet) {
                document.getElementById('snippetTitle').value = snippet.title;
                document.getElementById('snippetLang').value = snippet.lang;
                document.getElementById('snippetTags').value = snippet.tags.join(', ');
                document.getElementById('snippetCode').value = snippet.code;
                document.getElementById('snippetDesc').value = snippet.desc;
                
                // Delete old snippet
                const snippets = getSnippets().filter(s => s.id !== id);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(snippets));
                displaySnippets();
                
                // Scroll to form
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

function populateLanguageFilter() {
    const snippets = getSnippets();
    const langs = new Set(snippets.map(s => s.lang));
    const filter = document.getElementById('filterLang');
    
    let html = '<option value="">All Languages</option>';
    [...langs].sort().forEach(lang => {
        html += `<option value="${lang}">${lang}</option>`;
    });
    filter.innerHTML = html;
}

function exportSnippets() {
    const snippets = getSnippets();
    
    if (snippets.length === 0) {
        alert('No snippets to export');
        return;
    }
    
    const data = JSON.stringify(snippets, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippets-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importSnippets(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (!Array.isArray(imported)) {
                throw new Error('Invalid format');
            }
            
            const existing = getSnippets();
            const merged = [...existing, ...imported];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            
            displaySnippets();
            populateLanguageFilter();
            
            const status = document.getElementById('importStatus');
            status.innerHTML = `<div class="alert alert-success">✅ Imported ${imported.length} snippets!</div>`;
            setTimeout(() => status.innerHTML = '', 3000);
            
        } catch (error) {
            const status = document.getElementById('importStatus');
            status.innerHTML = `<div class="alert alert-danger">❌ Invalid file format</div>`;
        }
    };
    reader.readAsText(file);
}

function clearAllSnippets() {
    if (confirm('⚠️ Delete ALL snippets? This cannot be undone!')) {
        if (confirm('Are you REALLY sure? Export first if needed.')) {
            localStorage.removeItem(STORAGE_KEY);
            displaySnippets();
            populateLanguageFilter();
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initSnippetVault();
    
    setTimeout(() => {
        document.getElementById('btnSaveSnippet')?.addEventListener('click', saveSnippet);
        document.getElementById('btnClearForm')?.addEventListener('click', clearForm);
        document.getElementById('btnExportSnippets')?.addEventListener('click', exportSnippets);
        document.getElementById('btnClearAll')?.addEventListener('click', clearAllSnippets);
        document.getElementById('importFile')?.addEventListener('change', importSnippets);
        
        // Search and filter
        document.getElementById('searchSnippets')?.addEventListener('input', displaySnippets);
        document.getElementById('filterLang')?.addEventListener('change', displaySnippets);
        
        displaySnippets();
        populateLanguageFilter();
    }, 100);
}
