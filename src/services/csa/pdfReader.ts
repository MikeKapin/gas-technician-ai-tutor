import fs from 'fs';
import path from 'path';

interface CSAContent {
  unitNumber: number;
  title: string;
  content: string;
  topics: string[];
  codeReferences: string[];
}

class CSAPDFReader {
  private csaUnitsPath = 'C:\\Users\\m_kap\\OneDrive\\Desktop\\Personal\\WorkFlow\\NEW_Projects\\CSA Units';

  /**
   * Check if a unit directory and PDF exists
   */
  unitExists(unitPath: string): boolean {
    try {
      const fullPath = path.join(this.csaUnitsPath, unitPath);
      return fs.existsSync(fullPath);
    } catch (error) {
      console.error('Error checking unit path:', error);
      return false;
    }
  }

  /**
   * Find the main PDF file in a unit directory
   */
  findMainPDF(unitPath: string): string | null {
    try {
      const fullPath = path.join(this.csaUnitsPath, unitPath);
      const files = fs.readdirSync(fullPath);

      // Look for main PDF files (not temp files)
      const pdfFiles = files.filter(file =>
        file.endsWith('.pdf') &&
        file.includes('Final') &&
        !file.startsWith('~$')
      );

      if (pdfFiles.length > 0) {
        return path.join(fullPath, pdfFiles[0]);
      }

      // Fallback: any PDF file
      const anyPdf = files.find(file => file.endsWith('.pdf') && !file.startsWith('~$'));
      if (anyPdf) {
        return path.join(fullPath, anyPdf);
      }

      return null;
    } catch (error) {
      console.error('Error finding PDF:', error);
      return null;
    }
  }

  /**
   * Extract content summary from Unit 8 (Piping) to demonstrate structure
   */
  getUnit8PipingContent(): CSAContent {
    return {
      unitNumber: 8,
      title: 'Introduction to Piping and Tubing Systems',
      content: `
**CSA B149.1-25 Section 6: Gas Piping**

## Pipe Sizing Fundamentals

### Key Principles:
1. **Actual Length Method**: Use the measured pipe length directly with CSA sizing tables
2. **No Equivalent Length Additions**: CSA B149.1-25 sizing tables already include allowances for fittings
3. **Pressure Drop Limits**: Maximum 0.5" w.c. for residential applications

### Sizing Process:
1. Calculate total BTU load of all appliances
2. Measure actual pipe length (no fitting equivalents needed)
3. Select appropriate sizing table from CSA B149.1-25 Appendix A
4. Cross-reference BTU load and pipe length to determine minimum pipe size

### CSA B149.1-25 References:
- **Section 6.2**: Pipe sizing requirements
- **Section 6.3**: Pressure testing procedures
- **Appendix A**: Pipe sizing tables for natural gas
- **Table 6.1**: Maximum pressure drop allowances

### Common G3 Applications:
- Residential furnaces, water heaters, ranges
- Maximum individual appliance: 400,000 BTU/hr
- Standard operating pressure: 7" w.c.
- Typical pipe sizes: 1/2" to 1-1/4"

### Safety Requirements:
- All joints must be tested to 1.5 times operating pressure
- No compression fittings on buried lines
- Proper support and protection required
- CSA B149.1-25 Section 6.4 installation requirements

### Important Notes:
- **Never use equivalent lengths** for low-pressure gas piping sizing
- **Always verify** with current CSA B149.1-25 code
- **Pressure test** all new installations per Section 7
- **Document** all installations per TSSA requirements
      `.trim(),
      topics: [
        'Pipe Sizing',
        'CSA B149.1-25 Section 6',
        'Pressure Drop',
        'BTU Load Calculations',
        'Sizing Tables',
        'Installation Requirements',
        'Testing Procedures'
      ],
      codeReferences: [
        'CSA B149.1-25 Section 6.2 - Pipe Sizing',
        'CSA B149.1-25 Section 6.3 - Pressure Testing',
        'CSA B149.1-25 Section 6.4 - Installation',
        'CSA B149.1-25 Appendix A - Sizing Tables',
        'CSA B149.1-25 Section 7 - Testing Requirements'
      ]
    };
  }

  /**
   * Get Unit 1 Safety content
   */
  getUnit1SafetyContent(): CSAContent {
    return {
      unitNumber: 1,
      title: 'Safety',
      content: `
**CSA B149.1-25 Section 3: Safety Requirements**

## Fundamental Safety Principles

### Personal Protective Equipment (PPE):
- Safety glasses with side shields
- Hard hat when required
- Steel-toed boots
- Flame-resistant clothing
- Respiratory protection when needed

### Gas Detection and Testing:
- Combustible gas indicator required
- Test all connections with soapy water solution
- Never use open flame for leak detection
- Maintain proper ventilation during work

### Emergency Procedures:
1. **Gas Leak Response**:
   - Shut off gas supply immediately
   - Evacuate area
   - No electrical switches or open flames
   - Contact emergency services
   - Ventilate area only after gas is shut off

2. **Lockout/Tagout Procedures**:
   - Lock gas valves in OFF position
   - Tag with identification and date
   - Test that appliance cannot operate
   - Only person who applied lock removes it

### CSA B149.1-25 Safety References:
- **Section 3.1**: General safety requirements
- **Section 3.2**: Installation safety
- **Section 3.3**: Testing safety procedures
- **Section 3.4**: Emergency shutdown requirements

### Clearance Requirements:
- Combustible materials clearances per manufacturer
- Minimum clearances from property lines
- Ventilation requirements for appliance rooms
- Access clearances for service and inspection

### Common Hazards:
- Carbon monoxide poisoning
- Gas leaks and explosions
- Electrical shock
- Burns from hot surfaces
- Improper ventilation
      `.trim(),
      topics: [
        'Personal Protective Equipment',
        'Gas Leak Detection',
        'Emergency Procedures',
        'Lockout/Tagout',
        'Clearance Requirements',
        'Carbon Monoxide Safety',
        'Testing Safety'
      ],
      codeReferences: [
        'CSA B149.1-25 Section 3.1 - General Safety',
        'CSA B149.1-25 Section 3.2 - Installation Safety',
        'CSA B149.1-25 Section 3.3 - Testing Safety',
        'CSA B149.1-25 Section 3.4 - Emergency Shutdown'
      ]
    };
  }

  /**
   * Get relevant CSA content based on query and unit
   */
  getCSAContent(unitNumber: number): CSAContent | null {
    switch (unitNumber) {
      case 1:
        return this.getUnit1SafetyContent();
      case 8:
        return this.getUnit8PipingContent();
      default:
        return null;
    }
  }

  /**
   * Search for content across multiple units
   */
  searchCSAContent(query: string, level: 'G3' | 'G2'): CSAContent[] {
    const results: CSAContent[] = [];
    const queryLower = query.toLowerCase();

    // Define which units to search based on level
    const unitsToSearch = level === 'G3' ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

    // Search relevant units based on query
    if (queryLower.includes('pipe') || queryLower.includes('sizing')) {
      const unit8 = this.getCSAContent(8);
      if (unit8) results.push(unit8);
    }

    if (queryLower.includes('safety') || queryLower.includes('clearance') || queryLower.includes('emergency')) {
      const unit1 = this.getCSAContent(1);
      if (unit1) results.push(unit1);
    }

    return results;
  }
}

export const csaPDFReader = new CSAPDFReader();
export default csaPDFReader;