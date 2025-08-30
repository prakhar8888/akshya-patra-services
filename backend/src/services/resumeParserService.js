import fs from 'fs';
import PDFParser from 'pdf2json';
import chalk from 'chalk';

// --- HELPER FUNCTIONS WITH CONFIDENCE SCORING ---

const extractEmail = (text) => {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return { value: match ? match[0] : null, confidence: match ? 0.95 : 0.1 };
};

const extractPhone = (text) => {
  const match = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return { value: match ? match[0] : null, confidence: match ? 0.9 : 0.1 };
};

const extractName = (text) => {
    const lines = text.split('\n');
    for (const line of lines) {
        if (line.trim() && !line.match(/@|\d{5,}|http|linkedin|github/i)) {
            return { value: line.trim(), confidence: 0.7 };
        }
    }
    return { value: null, confidence: 0.1 };
};

const extractTotalExperience = (text) => {
  const expRegex = /(\d{1,2})\+?\s*(?:years|yrs|year)/i;
  const match = text.match(expRegex);
  const value = match ? parseInt(match[1], 10) : 0;
  return { value, confidence: match ? 0.85 : 0.2 };
};

const isResume = (text) => {
    const resumeKeywords = ['experience', 'education', 'skills', 'summary', 'objective', 'employment', 'work history', 'qualifications', 'contact'];
    const textLower = text.toLowerCase();
    let score = 0;
    for (const keyword of resumeKeywords) {
        if (textLower.includes(keyword)) score++;
    }
    return score >= 3;
};

// --- MAIN PARSER "MICROSERVICE" ---

/**
 * Parses a resume PDF to extract key information and confidence scores.
 * @param {string} filePath - The path to the PDF file to be parsed.
 * @returns {Promise<object>} A promise that resolves with the extracted data.
 */
const parseResume = (filePath) => {
  return new Promise((resolve, reject) => {
    console.log(chalk.blue(`[Parser] Starting to parse resume at: ${filePath}`));
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', errData => {
      console.error(chalk.red.bold('[Parser] PDF parsing error:'), errData.parserError);
      reject(new Error('Failed to parse PDF file. It may be corrupt or protected.'));
    });

    pdfParser.on('pdfParser_dataReady', () => {
      try {
        const rawText = pdfParser.getRawTextContent();

        if (!isResume(rawText)) {
          fs.unlinkSync(filePath); // Clean up the invalid file
          console.log(chalk.yellow(`[Parser] Rejected file: ${filePath}. Does not appear to be a resume.`));
          return reject(new Error('The uploaded document does not appear to be a valid resume or CV.'));
        }

        const name = extractName(rawText);
        const email = extractEmail(rawText);
        const phone = extractPhone(rawText);
        const experience = extractTotalExperience(rawText);

        const totalConfidence = (name.confidence + email.confidence + phone.confidence + experience.confidence);
        const overallConfidence = totalConfidence / 4;

        const extractedData = {
          name: name.value,
          email: email.value,
          phone: phone.value,
          totalExperience: experience.value,
          parserConfidence: {
            overall: parseFloat(overallConfidence.toFixed(2)),
            fields: {
              name: name.confidence,
              email: email.confidence,
              phone: phone.confidence,
              experience: experience.confidence,
            }
          }
        };

        fs.unlinkSync(filePath); // Clean up the temp file after successful parsing
        console.log(chalk.green(`[Parser] Successfully parsed resume for: ${extractedData.name}`));
        resolve(extractedData);
      } catch (err) {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Ensure cleanup even if processing fails
        }
        console.error(chalk.red.bold('[Parser] Error processing parsed resume data:'), err);
        reject(err);
      }
    });

    pdfParser.loadPDF(filePath);
  });
};

export { parseResume };
