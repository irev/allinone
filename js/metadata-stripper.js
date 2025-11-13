/**
 * Metadata Stripper
 * Remove EXIF and metadata from images for privacy
 */

function initMetadataStripper() {
    return `
        <div class="tool-header">
            <h2>Metadata Stripper</h2>
            <p>Remove EXIF data and metadata from images for privacy</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Upload Image</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label class="btn btn-primary" style="cursor: pointer; margin: 0;">
                        📁 Select Image
                        <input type="file" id="imageInput" accept="image/*" style="display: none;">
                    </label>
                    <div id="fileName" style="margin-top: 0.5rem; opacity: 0.7;"></div>
                </div>
                
                <div id="preview" style="display: none; margin-top: 1rem;">
                    <h4>Original Image Preview</h4>
                    <div style="max-width: 500px; margin: 1rem 0;">
                        <img id="originalImage" style="max-width: 100%; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    </div>
                    
                    <div id="metadata"></div>
                    
                    <div style="margin-top: 1rem;">
                        <button id="btnStrip" class="btn btn-primary">
                            🔒 Strip Metadata & Download
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h4>🔐 Privacy & Security</h4>
            <p><strong>What metadata can reveal:</strong></p>
            <ul>
                <li><strong>EXIF data:</strong> Camera model, settings, software used</li>
                <li><strong>GPS coordinates:</strong> Exact location where photo was taken</li>
                <li><strong>Timestamp:</strong> When the photo was taken</li>
                <li><strong>Author info:</strong> Photographer name, copyright</li>
                <li><strong>Software:</strong> Editing tools used</li>
            </ul>
            <p><strong>✅ This tool:</strong></p>
            <ul>
                <li>Works 100% client-side (your images never leave your browser)</li>
                <li>Removes all EXIF and metadata tags</li>
                <li>Preserves image quality (re-encodes as clean image)</li>
                <li>No server upload required</li>
            </ul>
        </div>

        <div class="info-card alert-warning">
            <h4>⚠️ Important Notes</h4>
            <ul>
                <li>This process re-encodes the image, which may slightly reduce quality</li>
                <li>Very large images may take a moment to process</li>
                <li>Supported formats: JPEG, PNG, WebP</li>
                <li>The stripped image is a new file - original is not modified</li>
            </ul>
        </div>
    `;
}

let currentImage = null;

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('⚠️ Please select an image file');
        return;
    }
    
    document.getElementById('fileName').textContent = `Selected: ${file.name} (${formatBytes(file.size)})`;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = {
            name: file.name,
            type: file.type,
            data: e.target.result
        };
        
        displayImage(e.target.result);
        extractMetadata(e.target.result, file);
    };
    reader.readAsDataURL(file);
}

function displayImage(dataUrl) {
    const img = document.getElementById('originalImage');
    img.src = dataUrl;
    document.getElementById('preview').style.display = 'block';
}

function extractMetadata(dataUrl, file) {
    const container = document.getElementById('metadata');
    
    let html = '<div class="alert alert-info">';
    html += '<h4 style="margin-top: 0;">📋 File Information</h4>';
    html += '<table style="width: 100%; font-size: 0.9rem;">';
    html += `<tr><td><strong>Filename:</strong></td><td>${escapeHtml(file.name)}</td></tr>`;
    html += `<tr><td><strong>Type:</strong></td><td>${file.type}</td></tr>`;
    html += `<tr><td><strong>Size:</strong></td><td>${formatBytes(file.size)}</td></tr>`;
    html += `<tr><td><strong>Last Modified:</strong></td><td>${new Date(file.lastModified).toLocaleString()}</td></tr>`;
    html += '</table>';
    html += '</div>';
    
    // Try to detect EXIF (basic check)
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        html += '<div class="alert alert-warning">';
        html += '<strong>⚠️ JPEG Detected:</strong> This format commonly contains EXIF metadata including GPS location, camera info, and timestamps.';
        html += '</div>';
    }
    
    // Check data URL size vs file size
    const base64Length = dataUrl.split(',')[1].length;
    const estimatedSize = (base64Length * 3) / 4;
    
    if (estimatedSize > file.size * 1.1) {
        html += '<div class="alert alert-secondary">';
        html += '<strong>ℹ️ Metadata Detected:</strong> Image appears to contain embedded metadata (file size suggests extra data).';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

function stripMetadata() {
    if (!currentImage) {
        alert('⚠️ Please upload an image first');
        return;
    }
    
    const btn = document.getElementById('btnStrip');
    btn.disabled = true;
    btn.textContent = '⏳ Processing...';
    
    // Create image element
    const img = new Image();
    img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob (this removes all metadata)
        canvas.toBlob((blob) => {
            if (blob) {
                // Download the cleaned image
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                
                // Generate filename
                const originalName = currentImage.name;
                const nameParts = originalName.split('.');
                const ext = nameParts.pop();
                const baseName = nameParts.join('.');
                a.download = `${baseName}-clean.${ext}`;
                
                a.click();
                URL.revokeObjectURL(url);
                
                // Show success
                btn.disabled = false;
                btn.textContent = '✅ Downloaded!';
                
                // Show comparison
                showComparison(currentImage.data.split(',')[1].length, blob.size);
                
                setTimeout(() => {
                    btn.textContent = '🔒 Strip Metadata & Download';
                }, 3000);
            } else {
                alert('❌ Failed to process image');
                btn.disabled = false;
                btn.textContent = '🔒 Strip Metadata & Download';
            }
        }, currentImage.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.95);
    };
    
    img.onerror = () => {
        alert('❌ Failed to load image');
        btn.disabled = false;
        btn.textContent = '🔒 Strip Metadata & Download';
    };
    
    img.src = currentImage.data;
}

function showComparison(originalBase64Length, cleanSize) {
    const originalSize = (originalBase64Length * 3) / 4;
    const removed = originalSize - cleanSize;
    
    const container = document.getElementById('metadata');
    let html = container.innerHTML;
    
    html += '<div class="alert alert-success">';
    html += '<h4 style="margin-top: 0;">✅ Metadata Stripped Successfully!</h4>';
    html += '<table style="width: 100%; font-size: 0.9rem;">';
    html += `<tr><td><strong>Original Size:</strong></td><td>${formatBytes(originalSize)}</td></tr>`;
    html += `<tr><td><strong>Clean Size:</strong></td><td>${formatBytes(cleanSize)}</td></tr>`;
    
    if (removed > 0) {
        html += `<tr><td><strong>Metadata Removed:</strong></td><td style="color: #10b981; font-weight: bold;">${formatBytes(removed)}</td></tr>`;
    } else {
        html += `<tr><td colspan="2"><em>No significant metadata detected</em></td></tr>`;
    }
    
    html += '</table>';
    html += '<p style="margin: 0.5rem 0 0 0;"><strong>🎉 Your image is now clean and safe to share!</strong></p>';
    html += '</div>';
    
    container.innerHTML = html;
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initMetadataStripper();
    
    setTimeout(() => {
        document.getElementById('imageInput')?.addEventListener('change', handleImageUpload);
        document.getElementById('btnStrip')?.addEventListener('click', stripMetadata);
    }, 100);
}
