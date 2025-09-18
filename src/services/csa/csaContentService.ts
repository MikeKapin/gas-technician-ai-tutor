import fs from 'fs';
import path from 'path';
import { TutorLevel } from '@/types';

interface CSAUnit {
  unitNumber: number;
  title: string;
  filePath: string;
  content?: string;
  applicableLevel: 'G3' | 'G2' | 'Both';
}

class CSAContentService {
  private csaUnitsPath = 'C:\\Users\\m_kap\\OneDrive\\Desktop\\Personal\\WorkFlow\\NEW_Projects\\CSA Units';
  private contentCache = new Map<string, string>();

  // Define which units apply to which certification levels
  private unitMapping: CSAUnit[] = [
    // G3 Units (1-9)
    { unitNumber: 1, title: 'Safety', filePath: 'Unit 1 - Safety', applicableLevel: 'Both' },
    { unitNumber: 2, title: 'Fasteners, Tools and Testing Equipment', filePath: 'Unit 2 - Fasteners, Tools and Testing Equipment', applicableLevel: 'Both' },
    { unitNumber: 3, title: 'Properties of Natural Gas and Fuels Safe Handling', filePath: 'Unit 3 - Properties of Natural Gas and Fuels Safe Handling', applicableLevel: 'Both' },
    { unitNumber: 4, title: 'Code and Regulations', filePath: 'Unit 4 - Code and Regs', applicableLevel: 'Both' },
    { unitNumber: 5, title: 'Introduction to Electricity', filePath: 'Unit 5 - Introduction to Electricity', applicableLevel: 'Both' },
    { unitNumber: 6, title: 'Technical Manuals, Specs, Drawings and Graphs', filePath: 'Unit 6 - Technical Manuals, Specs, Drawings and Graphs', applicableLevel: 'Both' },
    { unitNumber: 7, title: 'Customer Relations', filePath: 'Unit 7 - Customer Relations', applicableLevel: 'Both' },
    { unitNumber: 8, title: 'Introduction to Piping and Tubing Systems', filePath: 'Unit 8 - Intro to Piping and Tubing Systems', applicableLevel: 'Both' },
    { unitNumber: 9, title: 'Introduction to Gas Appliances', filePath: 'Unit 9 - Intro to Gas Appliances', applicableLevel: 'Both' },

    // G2 Units (10-24) - Advanced topics
    { unitNumber: 10, title: 'Advanced Piping and Tubing Systems', filePath: 'Unit 10 - Advanced Piping and Tubing Systems', applicableLevel: 'G2' },
    { unitNumber: 11, title: 'Pressure Regulators', filePath: 'Unit 11 - Pressure Regulators', applicableLevel: 'G2' },
    { unitNumber: 12, title: 'Basic Electricity for Gas Fired Equipment', filePath: 'Unit 12 - Basic Electricity for Gas Fired Equipment', applicableLevel: 'G2' },
    { unitNumber: 13, title: 'Controls', filePath: 'Unit 13 - Controls', applicableLevel: 'G2' },
    { unitNumber: 14, title: 'Building as a System', filePath: 'Unit 14 - Building as a System', applicableLevel: 'G2' },
    { unitNumber: 15, title: 'Domestic Appliances', filePath: 'Unit 15 - Domestic Appliances', applicableLevel: 'G2' },
    { unitNumber: 16, title: 'Gas Fired Refrigerators', filePath: 'Unit 16 - Gas Fired Refrigerators', applicableLevel: 'G2' },
    { unitNumber: 17, title: 'Conversion Burners', filePath: 'Unit 17 - Conversion Burners', applicableLevel: 'G2' },
    { unitNumber: 18, title: 'Water Heaters and Combination Systems', filePath: 'Unit 18 - Water Heaters and Combination Systems', applicableLevel: 'G2' },
    { unitNumber: 19, title: 'Forced Warm Air Heating Systems', filePath: 'Unit 19 - Forced Warm Air Heating Systems', applicableLevel: 'G2' },
    { unitNumber: 20, title: 'Hydronic Heating Systems', filePath: 'Unit 20 - Hydronic Heating Systems', applicableLevel: 'G2' },
    { unitNumber: 21, title: 'Space Heaters and Fireplaces', filePath: 'Unit 21 - Space Heaters and Fireplaces', applicableLevel: 'G2' },
    { unitNumber: 22, title: 'Venting Systems', filePath: 'Unit 22 - Venting Systems', applicableLevel: 'G2' },
    { unitNumber: 23, title: 'Forced Air Add-On Devices', filePath: 'Unit 23 - Forced Air Add-On Devices', applicableLevel: 'G2' },
    { unitNumber: 24, title: 'Air Handling', filePath: 'Unit 24 - Air Handling', applicableLevel: 'G2' }
  ];

  /**
   * Get relevant units for a specific tutor level
   */
  getUnitsForLevel(level: TutorLevel): CSAUnit[] {
    if (level === 'G3') {
      return this.unitMapping.filter(unit =>
        unit.applicableLevel === 'G3' || unit.applicableLevel === 'Both'
      ).slice(0, 9); // Units 1-9
    } else {
      return this.unitMapping; // All units 1-24
    }
  }

  /**
   * Find units related to a specific topic
   */
  findRelevantUnits(query: string, level: TutorLevel): CSAUnit[] {
    const availableUnits = this.getUnitsForLevel(level);
    const queryLower = query.toLowerCase();

    // Topic-based unit mapping
    const topicMappings: { [key: string]: number[] } = {
      'safety': [1],
      'piping': [8, 10],
      'pipe sizing': [8, 10],
      'tools': [2],
      'testing': [2],
      'gas properties': [3],
      'natural gas': [3],
      'codes': [4],
      'regulations': [4],
      'electricity': [5, 12],
      'electrical': [5, 12],
      'manuals': [6],
      'drawings': [6],
      'customer': [7],
      'appliances': [9, 15],
      'furnace': [19],
      'heating': [19, 20, 21],
      'water heater': [18],
      'venting': [22],
      'controls': [13],
      'regulators': [11],
      'clearance': [1, 21, 22],
      'installation': [8, 9, 10, 15],
      'commercial': [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      'pressure': [11, 8, 10],
      'building': [14],
      'construction': [14],
      'platform construction': [14],
      'balloon construction': [14],
      'solid construction': [14],
      'frame construction': [14],
      'cavity wall': [14]
    };

    const relevantUnitNumbers = new Set<number>();

    // Check topic mappings
    for (const [topic, units] of Object.entries(topicMappings)) {
      if (queryLower.includes(topic)) {
        units.forEach(unitNum => relevantUnitNumbers.add(unitNum));
      }
    }

    // If no specific topics found, check titles
    if (relevantUnitNumbers.size === 0) {
      availableUnits.forEach(unit => {
        if (unit.title.toLowerCase().includes(queryLower)) {
          relevantUnitNumbers.add(unit.unitNumber);
        }
      });
    }

    // Return matched units, or top 3 most relevant for the level if none found
    if (relevantUnitNumbers.size > 0) {
      return availableUnits.filter(unit => relevantUnitNumbers.has(unit.unitNumber))
        .sort((a, b) => a.unitNumber - b.unitNumber);
    } else {
      // Default relevant units for common queries
      return level === 'G3' ?
        availableUnits.slice(0, 3) : // Units 1-3 for G3
        availableUnits.slice(0, 5);   // Units 1-5 for G2
    }
  }

  /**
   * Extract key content from a unit (placeholder - would need actual file parsing)
   * This would be expanded to read PDF/HTML content from the units
   */
  async extractUnitContent(unit: CSAUnit): Promise<string> {
    const cacheKey = `unit_${unit.unitNumber}`;

    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!;
    }

    // Placeholder for actual content extraction
    // In a full implementation, this would:
    // 1. Read the PDF/HTML files from the unit directory
    // 2. Extract text content
    // 3. Parse and structure the information

    const placeholderContent = `
**Unit ${unit.unitNumber}: ${unit.title}**

[This would contain the actual CSA content from the ${unit.filePath} directory]

Key Topics:
- Detailed CSA B149.1-25 references
- Practical applications
- Safety requirements
- Code compliance procedures
- Real-world examples

*Note: Actual content extraction from PDFs/HTML files needs to be implemented*
    `.trim();

    this.contentCache.set(cacheKey, placeholderContent);
    return placeholderContent;
  }

  /**
   * Generate CSA-based context for AI prompts
   */
  async generateCSAContext(query: string, level: TutorLevel): Promise<string> {
    const relevantUnits = this.findRelevantUnits(query, level);

    let context = `**CSA Training Context for ${level} Level:**\n\n`;

    for (const unit of relevantUnits.slice(0, 3)) { // Limit to top 3 units
      const content = await this.extractUnitContent(unit);
      context += content + '\n\n';
    }

    context += `**Important:** All responses must be based on official CSA B149.1-25 and B149.2-25 codes and the above training materials. When in doubt, always defer to official CSA documentation.`;

    return context;
  }
}

export const csaContentService = new CSAContentService();
export default csaContentService;