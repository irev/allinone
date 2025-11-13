/**
 * Template Manager
 * Pre-built templates for common config files (Dockerfile, systemd, cron, etc)
 */

function initTemplateManager() {
    return `
        <div class="tool-header">
            <h2>Template Manager</h2>
            <p>Ready-to-use templates for Docker, systemd, cron, Nginx, and more</p>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Browse Templates</h3>
            </div>
            <div class="card-body">
                <div class="form-group">
                    <label>Category</label>
                    <select id="templateCategory" class="form-control">
                        <option value="all">All Categories</option>
                        <option value="docker">Docker</option>
                        <option value="systemd">Systemd Services</option>
                        <option value="cron">Cron Jobs</option>
                        <option value="nginx">Nginx</option>
                        <option value="apache">Apache</option>
                        <option value="database">Database</option>
                        <option value="security">Security</option>
                        <option value="ci-cd">CI/CD</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div id="templateList"></div>
            </div>
        </div>

        <div id="templateDetail" style="display: none;">
            <div class="card">
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <h3 id="templateTitle"></h3>
                    <button id="btnBackToList" class="btn btn-secondary">
                        ← Back to List
                    </button>
                </div>
                <div class="card-body">
                    <div id="templateDescription"></div>
                    
                    <div class="form-group">
                        <label>Template Code</label>
                        <textarea 
                            id="templateCode" 
                            class="form-control" 
                            rows="15"
                            style="font-family: 'Courier New', monospace; font-size: 0.9rem;"
                            readonly
                        ></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button id="btnCopyTemplate" class="btn btn-primary">
                            📋 Copy to Clipboard
                        </button>
                        <button id="btnDownloadTemplate" class="btn btn-secondary">
                            💾 Download File
                        </button>
                        <button id="btnEditTemplate" class="btn btn-secondary">
                            ✏️ Edit Template
                        </button>
                    </div>
                    
                    <div id="templateNotes"></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h3>Custom Templates</h3>
            </div>
            <div class="card-body">
                <p>Save your own custom templates (stored locally in browser)</p>
                <button id="btnAddCustom" class="btn btn-primary">
                    ➕ Add Custom Template
                </button>
                <div id="customTemplates" style="margin-top: 1rem;"></div>
            </div>
        </div>
    `;
}

const templates = [
    // Docker
    {
        id: 'dockerfile-node',
        category: 'docker',
        name: 'Dockerfile - Node.js App',
        filename: 'Dockerfile',
        description: 'Production-ready Dockerfile for Node.js applications',
        code: `FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build if needed
# RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

CMD ["node", "index.js"]`,
        notes: 'Multi-stage build reduces image size. Remember to add .dockerignore file.'
    },
    {
        id: 'docker-compose-fullstack',
        category: 'docker',
        name: 'Docker Compose - Full Stack',
        filename: 'docker-compose.yml',
        description: 'Complete stack with app, database, and Redis',
        code: `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:`,
        notes: 'Change passwords before deploying! Consider using .env file for secrets.'
    },
    
    // Systemd
    {
        id: 'systemd-webapp',
        category: 'systemd',
        name: 'Systemd Service - Web App',
        filename: 'myapp.service',
        description: 'Systemd unit file for Node.js/Python web application',
        code: `[Unit]
Description=My Web Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/index.js
Restart=on-failure
RestartSec=10

# Environment
Environment="NODE_ENV=production"
Environment="PORT=3000"

# Security
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/myapp/logs

# Resource limits
LimitNOFILE=65536
LimitNPROC=512

[Install]
WantedBy=multi-user.target`,
        notes: `Install: sudo cp myapp.service /etc/systemd/system/
Enable: sudo systemctl enable myapp
Start: sudo systemctl start myapp
Status: sudo systemctl status myapp`
    },
    
    // Cron
    {
        id: 'cron-backup',
        category: 'cron',
        name: 'Cron - Daily Backup',
        filename: 'backup.cron',
        description: 'Automated daily backup script',
        code: `# Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# Weekly database dump (Sunday 3 AM)
0 3 * * 0 /usr/bin/pg_dump mydb > /backups/db-\`date +\\%Y\\%m\\%d\`.sql

# Cleanup old backups (daily at 4 AM, keep last 7 days)
0 4 * * * find /backups -name "*.sql" -mtime +7 -delete

# Health check every 5 minutes
*/5 * * * * curl -fsS -m 10 --retry 5 -o /dev/null https://myapp.com/health || echo "Health check failed"`,
        notes: `Edit with: crontab -e
List jobs: crontab -l
Cron format: minute hour day month weekday command`
    },
    
    // Nginx
    {
        id: 'nginx-reverse-proxy',
        category: 'nginx',
        name: 'Nginx - Reverse Proxy with SSL',
        filename: 'site.conf',
        description: 'Nginx reverse proxy configuration with SSL/TLS',
        code: `server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;

    # Proxy to backend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`,
        notes: `Place in: /etc/nginx/sites-available/
Enable: sudo ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/
Test: sudo nginx -t
Reload: sudo systemctl reload nginx`
    },
    
    // Database
    {
        id: 'postgres-init',
        category: 'database',
        name: 'PostgreSQL - Database Init',
        filename: 'init.sql',
        description: 'PostgreSQL database initialization script',
        code: `-- Create database
CREATE DATABASE myapp;

-- Connect to database
\\c myapp;

-- Create user
CREATE USER myapp_user WITH PASSWORD 'change_this_password';

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE myapp TO myapp_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myapp_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myapp_user;`,
        notes: 'Run with: psql -U postgres -f init.sql'
    },
    
    // Security
    {
        id: 'ufw-rules',
        category: 'security',
        name: 'UFW Firewall Rules',
        filename: 'ufw-setup.sh',
        description: 'Basic UFW firewall configuration',
        code: `#!/bin/bash
# UFW Firewall Setup Script

# Reset UFW
sudo ufw --force reset

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (IMPORTANT: Change port if not 22)
sudo ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Allow specific IP for admin access
# sudo ufw allow from 1.2.3.4 to any port 22

# Rate limit SSH (prevent brute force)
sudo ufw limit 22/tcp

# Enable firewall
sudo ufw --force enable

# Show status
sudo ufw status verbose`,
        notes: 'Make executable: chmod +x ufw-setup.sh\nRun: sudo ./ufw-setup.sh'
    },
    
    // CI/CD
    {
        id: 'github-actions-nodejs',
        category: 'ci-cd',
        name: 'GitHub Actions - Node.js CI/CD',
        filename: '.github/workflows/ci.yml',
        description: 'GitHub Actions workflow for Node.js project',
        code: `name: CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js $\{{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: $\{{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to production
      run: |
        echo "Deploy to production server"
        # Add your deployment script here`,
        notes: 'Place in .github/workflows/ directory. Configure secrets in repository settings.'
    },
    
    // Other
    {
        id: 'gitignore-node',
        category: 'other',
        name: '.gitignore - Node.js',
        filename: '.gitignore',
        description: 'Comprehensive .gitignore for Node.js projects',
        code: `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
build/
dist/
*.log

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Temporary
*.tmp
tmp/
temp/`,
        notes: 'Add to root of your project repository'
    }
];

const CUSTOM_STORAGE_KEY = 'custom-templates';

function displayTemplateList() {
    const category = document.getElementById('templateCategory').value;
    const container = document.getElementById('templateList');
    
    const filtered = category === 'all' 
        ? templates 
        : templates.filter(t => t.category === category);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="alert alert-secondary">No templates in this category</div>';
        return;
    }
    
    const grouped = {};
    filtered.forEach(t => {
        if (!grouped[t.category]) grouped[t.category] = [];
        grouped[t.category].push(t);
    });
    
    let html = '';
    Object.entries(grouped).forEach(([cat, temps]) => {
        html += `<h4 style="margin-top: 1.5rem; text-transform: capitalize;">${cat}</h4>`;
        html += '<div style="display: grid; gap: 0.5rem;">';
        
        temps.forEach(t => {
            html += `
                <button class="btn btn-secondary template-item-btn" data-id="${t.id}" style="text-align: left; justify-content: space-between;">
                    <div>
                        <strong>${escapeHtml(t.name)}</strong>
                        <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem;">${escapeHtml(t.description)}</div>
                    </div>
                    <span style="opacity: 0.6;">→</span>
                </button>
            `;
        });
        
        html += '</div>';
    });
    
    container.innerHTML = html;
    
    // Add click handlers
    container.querySelectorAll('.template-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            showTemplate(id);
        });
    });
}

function showTemplate(id) {
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    document.getElementById('templateTitle').textContent = template.name;
    document.getElementById('templateDescription').innerHTML = 
        `<p style="margin-bottom: 1rem;"><strong>${escapeHtml(template.description)}</strong></p>`;
    document.getElementById('templateCode').value = template.code;
    
    if (template.notes) {
        document.getElementById('templateNotes').innerHTML = 
            `<div class="alert alert-info" style="margin-top: 1rem;">
                <strong>📝 Notes:</strong><br>
                ${escapeHtml(template.notes).replace(/\n/g, '<br>')}
            </div>`;
    } else {
        document.getElementById('templateNotes').innerHTML = '';
    }
    
    // Store current template for download
    currentTemplate = template;
    
    // Show detail, hide list
    document.getElementById('templateDetail').style.display = 'block';
    document.querySelector('.card').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let currentTemplate = null;

function backToList() {
    document.getElementById('templateDetail').style.display = 'none';
    document.querySelector('.card').style.display = 'block';
    document.getElementById('templateCode').readOnly = true;
}

function copyTemplate() {
    const code = document.getElementById('templateCode').value;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btnCopyTemplate');
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.textContent = '📋 Copy to Clipboard';
        }, 2000);
    });
}

function downloadTemplate() {
    if (!currentTemplate) return;
    
    const code = document.getElementById('templateCode').value;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentTemplate.filename;
    a.click();
    URL.revokeObjectURL(url);
}

function editTemplate() {
    const textarea = document.getElementById('templateCode');
    const btn = document.getElementById('btnEditTemplate');
    
    if (textarea.readOnly) {
        textarea.readOnly = false;
        btn.textContent = '💾 Save Changes';
        textarea.focus();
    } else {
        textarea.readOnly = true;
        btn.textContent = '✏️ Edit Template';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function render(container) {
    container.innerHTML = initTemplateManager();
    
    setTimeout(() => {
        document.getElementById('templateCategory')?.addEventListener('change', displayTemplateList);
        document.getElementById('btnBackToList')?.addEventListener('click', backToList);
        document.getElementById('btnCopyTemplate')?.addEventListener('click', copyTemplate);
        document.getElementById('btnDownloadTemplate')?.addEventListener('click', downloadTemplate);
        document.getElementById('btnEditTemplate')?.addEventListener('click', editTemplate);
        
        displayTemplateList();
    }, 100);
}
