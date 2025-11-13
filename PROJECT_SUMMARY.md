# Web Security Tools - Complete Project Summary

## 📊 Project Overview
A comprehensive collection of 21 client-side web security tools built with vanilla JavaScript, organized into three priority tiers.

## 🎯 Total Tools: 21

### 1️⃣ Basic Tools (6 tools)
- **Base64 Encoder/Decoder** - Encode/decode Base64 data
- **URL Encoder/Decoder** - URL encoding/decoding utilities
- **Hash Generator** - MD5, SHA-1, SHA-256, SHA-512 hash generation
- **Text Converter** - Case conversion, reverse, remove whitespace
- **HTML Entities Encoder/Decoder** - Encode/decode HTML special characters
- **JWT Inspector** - Decode and inspect JWT tokens

### 2️⃣ Advanced Tools (8 tools)
- **HMAC Generator** - Generate HMAC signatures (SHA-256/SHA-1/SHA-512)
- **SRI Generator** - Subresource Integrity hash generator for CDN security
- **Cookie Parser/Builder** - Parse Set-Cookie headers and build cookie strings
- **Security Headers Checker** - Analyze HTTP security headers with scoring
- **CSP Analyzer** - Parse and analyze Content-Security-Policy
- **XSS Payload Encoder** - Generate context-aware XSS test payloads
- **Regex Tester** - Test regular expressions with highlighting
- **Base Converters** - Convert between decimal, hex, binary, octal, base36, base62

### 3️⃣ Optional Tools (6 tools)
- **PEM Certificate Viewer** - Parse and display X.509/PEM certificates
- **URL Parser & Normalizer** - Parse URL components, normalize, encode/decode
- **Diff/Compare Tool** - Side-by-side text comparison with diff highlighting
- **Password Strength & Entropy Calculator** - Analyze password strength, calculate entropy
- **TLS/SSL & CORS Tester** - Test TLS connections and CORS policies
- **SQL Injection Payload Encoder** - Generate SQLi payloads with encoding (ethical use only)

## 🏗️ Architecture

### Frontend Structure
```
index.html              - Main HTML file with sidebar navigation
css/
  ├── main.css          - Main CSS import file
  ├── variables.css     - CSS variables and color scheme
  ├── base.css          - Global reset and body styles
  ├── sidebar.css       - Sidebar navigation styles
  ├── header.css        - Top bar styles
  ├── layout.css        - Main layout structure
  ├── forms.css         - Form elements (inputs, textareas, etc.)
  ├── buttons.css       - All button styles
  ├── components.css    - Tool components and output sections
  ├── footer.css        - Footer styles
  ├── responsive.css    - Mobile/tablet media queries
  └── utilities.css     - Utility classes

js/
  ├── main.js           - Core application routing & navigation
  ├── base64.js         - Base64 tool module
  ├── url.js            - URL encoder/decoder module
  ├── hash.js           - Hash generator module
  ├── converter.js      - Text converter module
  ├── htmlentities.js   - HTML entities module
  ├── jwt.js            - JWT inspector module
  ├── hmac.js           - HMAC generator module
  ├── sri.js            - SRI generator module
  ├── cookie.js         - Cookie parser/builder module
  ├── secheaders.js     - Security headers checker module
  ├── csp.js            - CSP analyzer module
  ├── xss.js            - XSS payload encoder module
  ├── regex.js          - Regex tester module
  ├── baseconv.js       - Base converters module
  ├── pemcert.js        - PEM certificate viewer module
  ├── urlparser.js      - URL parser & normalizer module
  ├── diff.js           - Diff/compare tool module
  ├── entropy.js        - Password strength calculator module
  ├── tlscors.js        - TLS/CORS tester module
  └── sqli.js           - SQLi payload encoder module
```

### Key Technical Features
- **ES6 Modules**: Each tool is an independent ES6 module with `export function render(container)`
- **Dynamic Imports**: Tools loaded on-demand using `import()`
- **Web Crypto API**: Used for hash generation (SHA-256/384/512), HMAC, fingerprints
- **Clipboard API**: One-click copy functionality
- **Client-side Only**: 100% client-side processing, no server required
- **Modular CSS**: 11 separate CSS files with clear separation of concerns
- **Responsive Design**: Mobile-friendly with responsive breakpoints

## 🔒 Security Features Built-In

### Ethical Use Disclaimers
- **XSS Payload Encoder**: Prominent warning about ethical use
- **SQLi Payload Encoder**: Red alert box with legal disclaimer
- Both tools emphasize authorized testing only

### Security Best Practices
- CSP Analyzer detects unsafe-inline, unsafe-eval
- Security Headers Checker provides severity-based recommendations
- Password Strength Calculator includes pattern detection
- Cookie Parser highlights security attributes (Secure, HttpOnly, SameSite)

## 📱 User Interface

### Navigation
- **Sidebar Navigation**: Categorized into Basic Tools, Advanced Tools, Optional Tools
- **Active State**: Highlights currently selected tool
- **Responsive**: Collapsible sidebar on mobile devices

### Tool Interface Pattern
Every tool follows a consistent pattern:
1. **Header**: Tool name and description
2. **Input Section**: Form controls with labels
3. **Action Buttons**: Primary action + Clear button
4. **Output Section**: Results display with copy functionality
5. **Alerts**: Success/error/info messages as needed

## 🚀 Deployment

### Netlify Configuration (`netlify.toml`)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Requirements
- Modern browser with ES6 module support
- HTTPS recommended (required for Web Crypto API)
- No build process needed
- No dependencies

## 🎨 CSS Highlights

### Recent Fixes
- **Textarea**: `min-height: 150px` (increased from 100px)
- **Font families**: 
  - Textareas: `'Courier New', Courier, monospace` (for code)
  - Inputs: System fonts (for better text input UX)

### Color Scheme
- Primary: `#2563eb` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Danger: `#ef4444` (red)
- Sidebar: `#1e293b` (dark slate)

### Responsive Breakpoints
- Mobile: `max-width: 768px` (full-width layout, collapsible sidebar)
- Tablet: `768px - 1024px` (adaptive grid)
- Desktop: `min-width: 1024px` (full sidebar + content)

## 📚 Tool Descriptions

### Advanced Tool Highlights

#### HMAC Generator
- Supports SHA-256, SHA-1, SHA-512
- Hex and Base64 output
- Useful for API authentication, webhook signatures

#### SRI Generator
- Generate integrity hashes for CDN resources
- Supports text input or URL fetch
- SHA-256, SHA-384, SHA-512 algorithms
- Outputs `integrity` attribute for `<script>` and `<link>` tags

#### Cookie Parser/Builder
- **Parse Mode**: Analyze Set-Cookie headers
- **Build Mode**: Create cookie strings with security attributes
- Highlights: Secure, HttpOnly, SameSite, Expires, Max-Age
- Visual warnings for missing security flags

#### Security Headers Checker
- Analyzes 10+ security headers
- Scoring system (0-100%)
- Severity-based recommendations (Critical, High, Medium, Low)
- Checks: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.

#### CSP Analyzer
- Parse Content-Security-Policy directives
- Detect unsafe-inline, unsafe-eval
- Security warnings with explanations
- Visual directive breakdown

### Optional Tool Highlights

#### PEM Certificate Viewer
- Parse PEM/X.509 certificates
- Extract: Subject, Issuer, Validity dates, Serial number
- Calculate fingerprints (SHA-1, SHA-256)
- Simplified ASN.1 parsing (no external dependencies)

#### URL Parser & Normalizer
- Parse all URL components (protocol, hostname, port, path, query, hash)
- Query parameter extraction and decoding
- URL normalization (lowercase, remove default ports, sort params)
- encode/decode utilities (encodeURI, encodeURIComponent)

#### Diff/Compare Tool
- **Text Mode**: Side-by-side diff with line-by-line highlighting
- **Hash Mode**: Character-by-character comparison
- Statistics: Lines added/removed/unchanged, similarity percentage
- Ignore whitespace and case options

#### Password Strength & Entropy Calculator
- Entropy calculation in bits
- Strength scoring (0-100)
- Pattern detection (sequential numbers, keyboard patterns, common words)
- Composition breakdown (lowercase, uppercase, digits, special)
- Crack time estimation
- Built-in password generator with crypto.getRandomValues()

#### TLS/SSL & CORS Tester
- **CORS Mode**: Test cross-origin requests, display CORS headers
- **SSL Mode**: Verify HTTPS connections
- Browser limitation warnings
- Links to external tools (SSL Labs, SecurityHeaders.com)

#### SQL Injection Payload Encoder
- 10+ payload types (auth bypass, UNION, boolean, time-based, error-based)
- Database-specific payloads (MySQL, PostgreSQL, MSSQL, Oracle, SQLite)
- Encoding options: URL, Double URL, Hex, CHAR(), Unicode
- Ethical use disclaimer with legal warnings

## 🔧 Technical Implementation Notes

### Web Crypto API Usage
```javascript
// Hash generation
const hash = await crypto.subtle.digest('SHA-256', data);

// HMAC generation
const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const signature = await crypto.subtle.sign('HMAC', key, data);
```

### Dynamic Module Loading
```javascript
async function loadTool(toolName) {
    const module = await import(`./js/${toolName}.js`);
    module.render(toolContainer);
}
```

### Clipboard API
```javascript
await navigator.clipboard.writeText(text);
```

## 🎯 Future Enhancement Ideas
1. **Dark Mode**: Toggle between light/dark themes
2. **Export/Import**: Save tool configurations
3. **History**: Store recent inputs/outputs in localStorage
4. **Favorites**: Pin frequently used tools
5. **Keyboard Shortcuts**: Quick navigation (Ctrl+1, Ctrl+2, etc.)
6. **Tool Chaining**: Pipe output from one tool to another
7. **API Mode**: Expose tools via URL parameters
8. **PWA**: Offline support with service worker

## 📄 License
Check LICENSE file for details.

## 🤝 Contributing
This is an educational project demonstrating web security tools. Contributions welcome!

---

**⚠️ Important Disclaimer**: Tools like XSS Payload Encoder and SQLi Payload Encoder are for authorized security testing only. Unauthorized use may be illegal. Always obtain proper authorization before testing systems you don't own.
