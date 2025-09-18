# Canadian Gas Technician Tutor - Setup Guide

This guide will help you set up the enhanced Canadian Gas Technician Tutor app with AI functionality powered by Anthropic Claude.

## 🚀 Quick Setup

### 1. Environment Configuration

The app is configured to use Anthropic Claude for enhanced AI responses. To enable full functionality:

1. Copy the environment template:
   ```bash
   cp .env.local .env.local.backup  # backup existing file
   ```

2. Update your `.env.local` file with your Anthropic API key:
   ```env
   # Gas Technician AI Tutor - Environment Variables
   NEXT_PUBLIC_APP_NAME="Canadian Gas Technician Tutor"
   NEXT_PUBLIC_CSA_VERSION="B149.1-25, B149.2-25"

   # Anthropic API Configuration (SERVER-SIDE ONLY - NEVER EXPOSE TO BROWSER)
   ANTHROPIC_API_KEY=your-actual-anthropic-api-key-here
   NEXT_PUBLIC_AI_PROVIDER=anthropic
   NEXT_PUBLIC_CLAUDE_MODEL=claude-3-sonnet-20240229

   # Feature Flags
   NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   NEXT_PUBLIC_DEBUG=false

   # LARK Labs Integration
   NEXT_PUBLIC_LARK_LABS_URL=https://www.larklabs.org
   NEXT_PUBLIC_INTEGRATION_MODE=standalone
   ```

### 2. Get Your Anthropic API Key

1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key and paste it into your `.env.local` file

### 3. Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000` (or the next available port).

## 🧪 Testing the Setup

### 1. Check API Connection

Visit `http://localhost:3000/api/chat` in your browser. You should see:

```json
{
  "message": "Canadian Gas Technician Tutor API",
  "version": "2.0.0",
  "supported_levels": ["G3", "G2"],
  "ai_provider": "anthropic",
  "connection_status": "connected",
  "features": [
    "Enhanced AI responses with CSA code references",
    "Module-specific guidance (1-9 for G3, 10-24 for G2)",
    "Real-time code section mapping",
    "Advanced troubleshooting support",
    "LARK Labs educational integration"
  ]
}
```

If `connection_status` shows "disconnected", check your API key configuration.

### 2. Test G3 and G2 Functionality

1. **G3 Testing**:
   - Select G3 Gas Technician
   - Ask: "What are the clearance requirements for residential furnaces?"
   - Expected: Response referencing CSA B149.1-25 and Units 1-9

2. **G2 Testing**:
   - Select G2 Gas Technician
   - Ask: "How do I size piping for a commercial kitchen?"
   - Expected: Response referencing both CSA codes and Units 10-24

## 🔧 Advanced Configuration

### Alternative AI Providers

If you prefer OpenAI instead of Anthropic, update your `.env.local`:

```env
# OpenAI Configuration (alternative) (SERVER-SIDE ONLY)
NEXT_PUBLIC_AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key-here
NEXT_PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview
```

### Feature Flags

- `NEXT_PUBLIC_ENABLE_VOICE_INPUT`: Enable/disable voice recording button
- `NEXT_PUBLIC_ENABLE_ANALYTICS`: Enable usage analytics (future feature)
- `NEXT_PUBLIC_DEBUG`: Enable debug logging in console

## 📚 Enhanced Features

### CSA Code Integration

The enhanced app includes:

- **G3 Coverage**: Units 1-9, CSA B149.1-25
- **G2 Coverage**: Units 10-24, CSA B149.1-25 + B149.2-25
- **Real-time code references** in AI responses
- **Module-specific guidance** based on certification level

### AI Response Enhancement

Each AI response includes:
- **Content**: Detailed explanation
- **Confidence**: AI confidence score
- **Sources**: Reference materials
- **Code References**: Specific CSA sections
- **Module References**: Related training units

## 🚨 Troubleshooting

### Common Issues

1. **"No API key configured" error**:
   - Check `.env.local` file exists and contains your API key
   - Ensure the key starts with `NEXT_PUBLIC_ANTHROPIC_API_KEY=`
   - Restart the development server after changes

2. **"Failed to get AI response" error**:
   - Verify your API key is valid and has credits
   - Check internet connection
   - The app will use enhanced fallback responses if AI fails

3. **Build errors**:
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors: `npm run build`

### Fallback Mode

The app works without an API key using enhanced fallback responses that include:
- CSA code references
- Module-specific guidance
- Professional gas technician content
- Safety-first messaging

## 🎯 What's Different from the Original

### Enhanced Features Added:

1. **Advanced AI Integration**:
   - Anthropic Claude integration with professional system prompts
   - Context-aware responses based on G3/G2 level
   - CSA code section extraction and referencing

2. **CSA Training Module Integration**:
   - Units 1-9 mapped to G3 certification
   - Units 10-24 mapped to G2 certification
   - Module-specific competency guidance

3. **Professional Response Quality**:
   - Enhanced system prompts with CSA knowledge
   - Real-world installation scenarios
   - Safety-first approach with regulatory compliance

4. **Improved Fallback System**:
   - Rich fallback responses when API unavailable
   - Module references in offline mode
   - Consistent educational quality

### Visual Design Maintained:

- ✅ Original LARK Labs professional styling
- ✅ G3 (blue) and G2 (red) color coding
- ✅ Canadian flag and CSA compliance messaging
- ✅ Mobile-first responsive design
- ✅ Professional dark theme with gradients

## 📞 Support

For issues with:
- **Setup**: Check this guide and troubleshooting section
- **API Keys**: Visit Anthropic Console support
- **CSA Content**: Reference official CSA B149.1-25 and B149.2-25 codes
- **LARK Labs**: Educational excellence in HVAC technology

---

**Ready to train the next generation of Canadian Gas Technicians!** 🇨🇦⚡