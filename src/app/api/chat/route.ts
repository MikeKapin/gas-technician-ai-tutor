import { NextRequest, NextResponse } from 'next/server';

interface ChatRequest {
  message: string;
  level: 'G3' | 'G2';
}

const G3_RESPONSES = [
  "That's a great question about G3 gas technician requirements. For natural gas appliances up to 400,000 BTU/hr, CSA B149.1-25 requires specific installation procedures and safety protocols. Always ensure proper ventilation and follow manufacturer guidelines.",

  "According to CSA B149.1-25 standards for G3 technicians, proper ventilation and clearance requirements are essential for safe gas appliance installation. Remember to check gas pressure, test for leaks, and verify proper combustion air supply.",

  "For G3 certification preparation, understanding the BTU capacity limits and basic gas installation procedures is crucial for your exam success. Focus on studying gas piping sizing, appliance connections, and safety shut-off procedures.",

  "CSA B149.1-25 outlines specific requirements for G3 technicians working with residential gas appliances. Key areas include proper pipe sizing, leak testing procedures, and understanding gas appliance venting requirements.",

  "Safety is paramount in G3 gas technician work. Always follow lockout/tagout procedures, use proper PPE, and ensure adequate ventilation when working with gas systems. Never skip leak testing procedures."
];

const G2_RESPONSES = [
  "Excellent question regarding G2 advanced gas systems. CSA B149.1-25 and B149.2-25 outline comprehensive requirements for complex installations and commercial systems. Advanced G2 technicians must understand system design, load calculations, and complex venting systems.",

  "As a G2 technician, you'll work with all gas appliances including complex commercial systems. Understanding advanced troubleshooting, system commissioning, and proper testing procedures is essential for safe installations.",

  "For G2 certification, mastering both residential and commercial gas systems, including proper testing procedures and safety protocols, is required. Study complex piping systems, pressure regulation, and advanced appliance controls.",

  "G2 technicians handle unlimited BTU capacity systems and complex installations. CSA B149.1-25 and B149.2-25 require thorough understanding of gas system design, pressure testing, and advanced safety systems.",

  "Advanced G2 work includes commercial boilers, industrial appliances, and complex distribution systems. Focus on understanding gas train components, safety interlocks, and proper commissioning procedures for your certification exam."
];

const CSA_CODE_REFERENCES = [
  "According to CSA B149.1-25, section 5.2, all gas piping must be properly sized and tested for leaks before commissioning.",
  "CSA B149.2-25 requires specific venting requirements for appliances in commercial installations.",
  "Per CSA standards, proper combustion air supply calculations are essential for safe appliance operation.",
  "CSA code requires annual inspection and maintenance of gas appliances in commercial settings.",
  "Gas technician certification requires understanding of both CSA B149.1-25 residential and B149.2-25 commercial codes."
];

function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateAIResponse(message: string, level: 'G3' | 'G2'): string {
  const baseResponses = level === 'G3' ? G3_RESPONSES : G2_RESPONSES;
  let response = getRandomResponse(baseResponses);

  // Add CSA code reference occasionally
  if (Math.random() > 0.6) {
    response += " " + getRandomResponse(CSA_CODE_REFERENCES);
  }

  // Customize response based on keywords
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('safety')) {
    response = `Safety is the top priority in gas technician work. ${response}`;
  }

  if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('certification')) {
    response += " This is an important topic for your certification exam preparation.";
  }

  if (lowerMessage.includes('btu')) {
    if (level === 'G3') {
      response += " Remember, G3 technicians are limited to appliances up to 400,000 BTU/hr capacity.";
    } else {
      response += " As a G2 technician, you can work with unlimited BTU capacity systems.";
    }
  }

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, level } = body;

    if (!message || !level) {
      return NextResponse.json(
        { error: 'Message and level are required' },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    const aiResponse = generateAIResponse(message, level);

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Canadian Gas Technician Tutor API',
    version: '1.0.0',
    supported_levels: ['G3', 'G2']
  });
}