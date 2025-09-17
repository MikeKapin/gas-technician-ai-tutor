# 🚀 Gas Technician AI Tutor - Web Deployment Guide

## Quick Deployment Options

### 🥇 **Option 1: Vercel (Recommended)**

#### **Step 1: Prepare for Deployment**
```bash
# Navigate to your project
cd gas-technician-ai-tutor

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

#### **Step 2: Deploy to Vercel**
```bash
# Deploy from the root directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: gas-technician-ai-tutor
# - Directory: ./frontend
# - Override settings? No
```

#### **Step 3: Configure Environment Variables**
In Vercel Dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables:

```
ANTHROPIC_API_KEY = your-anthropic-api-key-here
NEXT_PUBLIC_AI_PROVIDER = anthropic
NEXT_PUBLIC_CLAUDE_MODEL = claude-3-sonnet-20240229
```

#### **Step 4: Custom Domain (larklabs.org subdomain)**
1. In Vercel Dashboard → **Settings** → **Domains**
2. Add domain: `gas-tutor.larklabs.org`
3. Configure DNS (see DNS section below)

---

### 🥈 **Option 2: Netlify**

#### **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the project
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=.next
```

---

### 🥉 **Option 3: Self-Hosted (VPS/Server)**

#### **Using PM2 and Nginx**
```bash
# On your server
git clone <your-repo>
cd gas-technician-ai-tutor/frontend

# Install dependencies
npm install

# Build for production
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "gas-tutor" -- start
pm2 save
pm2 startup
```

---

## 🔗 Integration with www.larklabs.org

### **Option A: Subdomain Integration**
**Recommended URL:** `https://gas-tutor.larklabs.org`

#### **DNS Configuration**
Add these DNS records to your domain:

```
Type: CNAME
Name: gas-tutor
Value: cname.vercel-dns.com  (or your hosting provider's CNAME)

Type: A (if using A record)
Name: gas-tutor
Value: [Your server IP]
```

### **Option B: Embedded Integration**
Embed the tutor directly in your LARK Labs website:

#### **Iframe Embed Code**
```html
<!-- Add to your larklabs.org page -->
<div class="gas-tutor-container">
  <iframe
    src="https://gas-tutor.larklabs.org"
    width="100%"
    height="800px"
    frameborder="0"
    title="Gas Technician AI Tutor">
  </iframe>
</div>

<style>
.gas-tutor-container {
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border-radius: 12px;
  overflow: hidden;
}
</style>
```

### **Option C: Modal/Popup Integration**
```html
<!-- Button on your larklabs.org site -->
<button id="open-gas-tutor" class="btn-primary">
  🔥 Open Gas Technician AI Tutor
</button>

<!-- Modal -->
<div id="gas-tutor-modal" class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <iframe
      src="https://gas-tutor.larklabs.org"
      width="100%"
      height="600px">
    </iframe>
  </div>
</div>

<script>
// Modal functionality
const modal = document.getElementById('gas-tutor-modal');
const btn = document.getElementById('open-gas-tutor');
const span = document.getElementsByClassName('close')[0];

btn.onclick = () => modal.style.display = "block";
span.onclick = () => modal.style.display = "none";
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
}
</script>
```

---

## 🎨 LARK Labs Branding Integration

### **Custom Styling for Your Brand**