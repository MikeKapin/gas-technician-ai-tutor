import { TutorLevel, ChatMessage, TutorConfiguration, CodeReference, ModuleReference } from '@/types/tutor'

interface AIServiceConfig {
  provider: 'openai' | 'anthropic'
  apiKey: string
  model: string
}

interface AIResponse {
  content: string
  confidence: number
  sources: string[]
  codeReferences?: any[]
  moduleReferences?: any[]
}

class AIService {
  private config: AIServiceConfig

  constructor() {
    const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER as 'openai' | 'anthropic') || 'openai'

    this.config = {
      provider,
      apiKey: provider === 'openai'
        ? process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
        : process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || '',
      model: provider === 'openai'
        ? process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4-turbo-preview'
        : process.env.NEXT_PUBLIC_CLAUDE_MODEL || 'claude-3-sonnet-20240229'
    }

    if (!this.config.apiKey) {
      console.warn(`AI Service: No API key found for ${provider}`)
    }
  }

  async generateResponse(
    message: string,
    tutorLevel: TutorLevel,
    configuration: TutorConfiguration,
    conversationHistory: ChatMessage[] = []
  ): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error(`No API key configured for ${this.config.provider}`)
    }

    try {
      if (this.config.provider === 'openai') {
        return await this.callOpenAI(message, tutorLevel, configuration, conversationHistory)
      } else {
        return await this.callAnthropic(message, tutorLevel, configuration, conversationHistory)
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw error
    }
  }

  private async callOpenAI(
    message: string,
    tutorLevel: TutorLevel,
    configuration: TutorConfiguration,
    conversationHistory: ChatMessage[]
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(tutorLevel, configuration)
    const chatHistory = this.formatChatHistory(conversationHistory)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'

    return this.parseAIResponse(content, tutorLevel)
  }

  private async callAnthropic(
    message: string,
    tutorLevel: TutorLevel,
    configuration: TutorConfiguration,
    conversationHistory: ChatMessage[]
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(tutorLevel, configuration)
    const chatHistory = this.formatChatHistory(conversationHistory)

    // Build conversation string for Claude
    let conversationText = systemPrompt + '\n\n'
    chatHistory.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}\n\n`
    })
    conversationText += `Human: ${message}\n\nAssistant:`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: conversationText
          }
        ],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const content = data.content[0]?.text || 'Sorry, I couldn\'t generate a response.'

    return this.parseAIResponse(content, tutorLevel)
  }

  private buildSystemPrompt(tutorLevel: TutorLevel, configuration: TutorConfiguration): string {
    return `You are a specialized ${tutorLevel} Gas Technician AI Tutor for Canadian gas installations. You are an expert in:

${configuration.coverage.codes.map(code => `• ${code}`).join('\n')}
${configuration.coverage.regulations.map(reg => `• ${reg}`).join('\n')}

SPECIALIZATION LEVEL: ${tutorLevel}
${tutorLevel === 'G3' ? `
G3 FOCUS AREAS:
• Residential gas appliances and installations
• Small commercial applications (up to 400,000 BTU/hr)
• Basic piping systems and clearance requirements
• CSA B149.1-25 code compliance
• TSSA Act and Ontario regulations
• Learning modules 1-9 competency development

TARGET APPLICATIONS:
- Residential furnaces, water heaters, fireplaces
- Small commercial cooking equipment
- Basic gas piping and connections
- Standard venting systems
` : `
G2 FOCUS AREAS:
• Large commercial and industrial gas systems
• Advanced CSA B149.1-25 applications
• Complete CSA B149.2-25 (Propane) expertise
• Complex piping calculations and system design
• Multi-appliance installations and coordination
• Learning modules 10-24 advanced competencies

TARGET APPLICATIONS:
- Large commercial boilers and process equipment
- Industrial gas systems and distribution
- Propane installations (CSA B149.2-25)
- Complex multi-appliance systems
- Advanced troubleshooting and diagnostics
`}

RESPONSE STYLE:
• Use "Code Compass" explanation style - break down complex concepts into easy-to-understand steps
• Provide specific code references with section numbers
• Include real-world examples relevant to ${tutorLevel} level work
• Use practical installation scenarios
• Emphasize safety requirements and procedures
• Reference appropriate learning modules when relevant

FORMATTING:
• Use markdown formatting with headers, bullet points, and code references
• Include code section references like "CSA B149.1-25, Section X.X.X"
• Highlight key safety points
• Provide step-by-step explanations when appropriate
• Use examples specific to ${tutorLevel === 'G3' ? 'residential/small commercial' : 'large commercial/industrial'} applications

Always tailor your responses to the ${tutorLevel} certification level and avoid topics outside your coverage area.`
  }

  private formatChatHistory(conversationHistory: ChatMessage[]): { role: string, content: string }[] {
    return conversationHistory
      .filter(msg => msg.role !== 'system')
      .slice(-10) // Keep last 10 messages for context
      .map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }))
  }

  private parseAIResponse(content: string, tutorLevel: TutorLevel): AIResponse {
    // Extract code references from the response
    const codeReferences = this.extractCodeReferences(content, tutorLevel)
    const moduleReferences = this.extractModuleReferences(content, tutorLevel)

    return {
      content,
      confidence: 0.95, // AI typically has high confidence
      sources: this.getSources(tutorLevel),
      codeReferences,
      moduleReferences
    }
  }

  private extractCodeReferences(content: string, tutorLevel: TutorLevel): CodeReference[] {
    const references: CodeReference[] = []

    // Extract CSA B149.1-25 references
    const b1491Matches = content.match(/CSA B149\.1-25[,\s]*Section\s*([\d.]+)/gi)
    if (b1491Matches) {
      b1491Matches.forEach(match => {
        const sectionMatch = match.match(/([\d.]+)/)
        if (sectionMatch) {
          references.push({
            code: 'CSA B149.1-25',
            section: sectionMatch[1],
            title: this.getCodeSectionTitle(sectionMatch[1]),
            relevance: 'direct'
          })
        }
      })
    }

    // Extract CSA B149.2-25 references (for G2)
    if (tutorLevel === 'G2') {
      const b1492Matches = content.match(/CSA B149\.2-25[,\s]*Section\s*([\d.]+)/gi)
      if (b1492Matches) {
        b1492Matches.forEach(match => {
          const sectionMatch = match.match(/([\d.]+)/)
          if (sectionMatch) {
            references.push({
              code: 'CSA B149.2-25',
              section: sectionMatch[1],
              title: 'Propane Installation Code',
              relevance: 'direct'
            })
          }
        })
      }
    }

    return references
  }

  private extractModuleReferences(content: string, tutorLevel: TutorLevel): ModuleReference[] {
    const references: ModuleReference[] = []
    const moduleMatches = content.match(/Module\s*(\d+)/gi)

    if (moduleMatches) {
      moduleMatches.forEach(match => {
        const moduleNumber = parseInt(match.match(/(\d+)/)?.[1] || '0')
        if (moduleNumber > 0) {
          references.push({
            moduleNumber,
            title: this.getModuleTitle(moduleNumber),
            relevance: 'direct',
            competencies: []
          })
        }
      })
    }

    return references
  }

  private getCodeSectionTitle(section: string): string {
    // Map common code sections to titles
    const sectionTitles: { [key: string]: string } = {
      '6.2.1': 'Installation Requirements',
      '5.1': 'Piping Materials',
      '5.2': 'Pipe Sizing',
      '7.1': 'Testing Procedures',
      '3.1': 'Safety Requirements',
      '4.1': 'Appliance Classifications'
    }
    return sectionTitles[section] || 'Code Section'
  }

  private getModuleTitle(moduleNumber: number): string {
    const moduleTitles: { [key: number]: string } = {
      1: 'Gas Codes and Standards',
      2: 'Safety Procedures',
      3: 'Appliance Types',
      4: 'Piping Systems',
      5: 'Installation Requirements',
      6: 'Testing and Commissioning',
      7: 'Venting Systems',
      8: 'Service Procedures',
      9: 'Regulations and Compliance',
      10: 'Advanced Systems',
      11: 'Commercial Applications',
      12: 'Industrial Systems',
      13: 'Propane Systems',
      14: 'Complex Piping',
      15: 'System Design'
    }
    return moduleTitles[moduleNumber] || `Module ${moduleNumber}`
  }

  private getSources(tutorLevel: TutorLevel): string[] {
    const sources = ['CSA B149.1-25', 'TSSA Regulations']
    if (tutorLevel === 'G2') {
      sources.push('CSA B149.2-25')
    }
    return sources
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    if (!this.config.apiKey) {
      return false
    }

    try {
      if (this.config.provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        })
        return response.ok
      } else {
        // For Anthropic, we'll try a simple message
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: this.config.model,
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Test' }]
          })
        })
        return response.ok
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      return false
    }
  }
}

export const aiService = new AIService()
export default aiService