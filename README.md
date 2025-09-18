# Canadian Gas Technician Tutor

🇨🇦 **Enhanced AI-powered tutor** for Canadian Gas Technician certification preparation. Supports both G3 and G2 certification levels with comprehensive CSA B149.1-25 & B149.2-25 training integration.

## ✨ Enhanced Features

### 🎯 **Certification Paths**
- **G3 Path**: Units 1-9 → Residential & small commercial (up to 400,000 BTU/hr)
- **G2 Path**: Units 10-24 → Advanced commercial & industrial (unlimited capacity)

### 🤖 **Advanced AI Integration**
- **Anthropic Claude** integration with professional gas technician knowledge
- **Context-aware responses** based on certification level
- **CSA code references** extracted and highlighted in real-time
- **Module-specific guidance** tied to official training units

### 📚 **CSA Training Integration**
- **Units 1-9 (G3)**: Safety, Tools, Gas Properties, Codes, Electricity, Manuals, Customer Relations, Piping, Appliances
- **Units 10-24 (G2)**: Advanced Piping, Regulators, Controls, Commercial Systems, Venting, Air Handling

### 🎨 **Professional Design**
- **LARK Labs branding** with educational excellence standards
- **Mobile-first responsive** design optimized for field use
- **Canadian identity** with flag and CSA compliance messaging
- **Accessibility** compliant with ARIA support and screen readers

## 🚀 Quick Start

### **Option 1: Full AI Experience (Recommended)**
```bash
# 1. Setup with API key for enhanced AI responses
cp .env.local .env.local.backup

# 2. Add your Anthropic API key to .env.local
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-api-key

# 3. Install and run
npm install
npm run dev
```

### **Option 2: Offline Mode**
```bash
# Works without API key using enhanced fallback responses
npm install
npm run dev
```

📖 **[Complete Setup Guide](SETUP.md)** with API key instructions

## 🧪 Test the Enhancement

Visit your running app and test the enhanced functionality:

### **G3 Testing**
```
Question: "What are the clearance requirements for residential furnaces?"
Expected: CSA B149.1-25 references + Units 1-9 guidance
```

### **G2 Testing**
```
Question: "How do I size piping for a commercial kitchen?"
Expected: Both CSA codes + Units 10-24 advanced guidance
```

### **API Status Check**
```
Visit: http://localhost:3000/api/chat
Status: Should show "connection_status": "connected" with API key
```

## 🔧 Technology Stack

- **Framework**: Next.js 15 with App Router + Turbopack
- **AI Provider**: Anthropic Claude (with OpenAI fallback option)
- **Language**: TypeScript with comprehensive type definitions
- **Styling**: Tailwind CSS with LARK Labs professional typography
- **Icons**: Lucide React with gas technician specific iconography
- **Deployment**: Vercel-ready with optimized configuration

## 🎓 Educational Content

### **G3 Certification Coverage**
| Unit | Topic | Focus Area |
|------|-------|------------|
| 1 | Safety | Emergency procedures, PPE, hazard recognition |
| 2 | Tools & Testing | Measurement instruments, leak detection |
| 3 | Gas Properties | Natural gas characteristics, safe handling |
| 4 | Codes & Regulations | CSA B149.1-25, TSSA compliance |
| 5 | Electricity | Basic electrical principles for gas systems |
| 6 | Technical Manuals | Reading specifications and drawings |
| 7 | Customer Relations | Professional communication skills |
| 8 | Piping Systems | Residential piping design and installation |
| 9 | Gas Appliances | Residential appliance types and connections |

### **G2 Certification Coverage**
| Unit | Topic | Advanced Focus |
|------|-------|----------------|
| 10-11 | Advanced Piping & Regulators | Complex systems, pressure control |
| 12-13 | Electrical & Controls | Advanced electrical, safety controls |
| 14-15 | Building Systems & Appliances | Commercial integration, domestic systems |
| 16-18 | Specialized Equipment | Refrigeration, burners, water heating |
| 19-21 | Heating Systems | Forced air, hydronic, space heating |
| 22-24 | Venting & Air Handling | Advanced venting, air quality systems |

## 🛠️ Enhanced vs Original

| Feature | Original | Enhanced |
|---------|----------|----------|
| AI Responses | Basic random responses | Anthropic Claude with CSA knowledge |
| Code References | Generic mentions | Real-time CSA section extraction |
| Module Integration | None | Units 1-24 mapped to certification levels |
| Fallback Quality | Simple text | Professional gas technician content |
| API Integration | Simulated only | Full Anthropic + OpenAI support |
| Educational Depth | Surface level | Professional training integration |

## 📦 Deployment

### **Vercel (One-Click)**
1. Connect GitHub repository
2. Add `NEXT_PUBLIC_ANTHROPIC_API_KEY` to environment variables
3. Deploy automatically

### **Manual Deployment**
```bash
npm run build
npm start
# Or deploy .next folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/enhancement`
3. Follow CSA standards and educational best practices
4. Test with both G3 and G2 scenarios
5. Submit pull request

## 📄 License

MIT License - Built for Canadian Gas Technician education

## 🏢 Professional Partners

- **LARK Labs**: Educational Excellence in HVAC Technology
- **CSA Group**: Canadian Standards Authority
- **TSSA**: Technical Standards & Safety Authority

---

**🎯 Training the next generation of certified Canadian Gas Technicians with AI-enhanced education**

Built with ❤️ by LARK Labs | Powered by Anthropic Claude | 🇨🇦 CSA Compliant
