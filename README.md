# 🔥 Gas Technician AI Tutor

An intelligent AI-powered tutoring system for Canadian Gas Technician certification training. Specialized tutors for G3 and G2 certification levels with comprehensive CSA B149.1-25 and B149.2-25 code coverage.

![Gas Technician AI Tutor](https://img.shields.io/badge/AI-Claude%20Powered-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## 🌟 Features

### 🎓 **Specialized AI Tutors**
- **G3 Tutor**: Residential & small commercial installations
- **G2 Tutor**: Large commercial & industrial gas systems

### 📚 **Comprehensive Code Coverage**
- **CSA B149.1-25**: Complete natural gas installation code
- **CSA B149.2-25**: Propane installation code (G2 level)
- **TSSA Regulations**: Ontario gas safety compliance

### 🎯 **Learning Modules Integration**
- **G3 Modules**: 1-9 (Foundation level competencies)
- **G2 Modules**: 10-24 (Advanced system competencies)

### 🚀 **Advanced AI Capabilities**
- **Code Compass Style Explanations**: Step-by-step breakdowns
- **Real-World Examples**: Installation scenarios and troubleshooting
- **Interactive Chat Interface**: Natural language Q&A
- **Voice Input Support**: Speech-to-text capability
- **Code Reference Linking**: Automatic CSA section references

## 🏗️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **AI Integration**: Anthropic Claude 3 Sonnet
- **Animations**: Framer Motion
- **State Management**: React Context + Local Storage
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/gas-technician-ai-tutor.git
   cd gas-technician-ai-tutor
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Add your API key to `.env.local`:
   ```env
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your-api-key-here
   NEXT_PUBLIC_AI_PROVIDER=anthropic
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### **1. Select Your Tutor Level**
Choose between G3 or G2 based on your certification goals:

- **G3**: Perfect for residential work, basic commercial applications
- **G2**: Advanced commercial, industrial systems, propane installations

### **2. Ask Questions**
Examples of questions you can ask:

**G3 Level:**
- "What are clearance requirements for a residential water heater?"
- "How do I size gas piping for a 75,000 BTU furnace?"
- "Explain TSSA inspection requirements for G3 scope"

**G2 Level:**
- "Design approach for a 500,000 BTU commercial boiler"
- "CSA B149.2-25 propane system requirements"
- "Multi-appliance installation coordination"

### **3. Interactive Learning**
- View code references with section numbers
- Get real-world installation examples
- Track learning module progress
- Use voice input for hands-free learning

## 🌐 Deployment

### **Vercel (Recommended)**

1. **Connect to Vercel**
   - Import your GitHub repository in Vercel
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/.next`

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_ANTHROPIC_API_KEY=your-api-key
   NEXT_PUBLIC_AI_PROVIDER=anthropic
   NEXT_PUBLIC_CLAUDE_MODEL=claude-3-sonnet-20240229
   ```

3. **Custom Domain**
   Configure your domain (e.g., `gas-tutor.larklabs.org`)

### **Self-Hosting**
See [deployment-guide.md](./deployment-guide.md) for detailed instructions.

## 🔧 Configuration

### **AI Provider Settings**
```env
# Use Anthropic Claude (recommended)
NEXT_PUBLIC_AI_PROVIDER=anthropic
NEXT_PUBLIC_CLAUDE_MODEL=claude-3-sonnet-20240229

# Or use OpenAI
NEXT_PUBLIC_AI_PROVIDER=openai
NEXT_PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview
```

### **Feature Flags**
```env
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG=false
```

## 📊 Project Structure

```
gas-technician-ai-tutor/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   ├── components/         # React components
│   │   │   ├── tutor/         # Tutor selection
│   │   │   ├── chat/          # Chat interface
│   │   │   └── ui/            # UI components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   ├── types/             # TypeScript types
│   │   └── hooks/             # Custom hooks
│   ├── public/                # Static assets
│   └── package.json
├── docs/                       # Documentation
├── deployment-guide.md         # Deployment instructions
└── README.md
```

## 🎨 Customization

### **Branding Integration**
To integrate with your website (like LARK Labs):

1. **Update colors** in `tailwind.config.js`
2. **Add your logo** in `/public/`
3. **Modify header** in `src/app/layout.tsx`
4. **Custom domain** setup in Vercel

### **Content Customization**
- **Add CSA content** in `/knowledge-base/`
- **Update modules** in `/src/types/tutor.ts`
- **Modify prompts** in `/src/services/ai/aiService.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2025 LARK Labs

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/gas-technician-ai-tutor/issues)
- **Documentation**: [Wiki](https://github.com/YOUR_USERNAME/gas-technician-ai-tutor/wiki)
- **Email**: support@larklabs.org

## 🏆 Features Roadmap

- [ ] **CSA Content Integration**: Full B149.1-25 and B149.2-25 content
- [ ] **Vector Search**: Semantic search through gas codes
- [ ] **Learning Progress Tracking**: Student progress analytics
- [ ] **Multi-language Support**: French language support
- [ ] **Mobile App**: React Native version
- [ ] **Offline Mode**: Downloadable content for offline use

## 🎯 LARK Labs Integration

This AI tutor is part of the LARK Labs educational ecosystem:
- **Website**: [www.larklabs.org](https://www.larklabs.org)
- **Integration**: Embeddable widget available
- **API**: REST API for custom integrations

---

**Built with ❤️ for Canadian Gas Technician Excellence**

*Empowering the next generation of gas technicians with AI-powered education*