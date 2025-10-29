import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import * as pdfParse from 'pdf-parse';
import iconv from 'iconv-lite';

// Function to read file content based on extension
async function readFileContent(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.txt') {
      const buffer = fs.readFileSync(filePath);
      // Try to detect encoding, fallback to utf8
      return iconv.decode(buffer, 'utf8');
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (ext === '.pdf') {
      // Skip PDF parsing for now due to import issues
      return '[PDF content not parsed]';
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return '';
  }

  return '';
}

// Function to scan directory recursively
async function scanDirectory(dirPath, basePath = dirPath) {
  const items = fs.readdirSync(dirPath);
  const result = {};

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(basePath, fullPath).replace(/\\/g, '/');

    if (stat.isDirectory()) {
      result[item] = await scanDirectory(fullPath, basePath);
    } else {
      const content = await readFileContent(fullPath);
      result[item] = {
        path: relativePath,
        content: content,
        size: stat.size,
        modified: stat.mtime.toISOString()
      };
    }
  }

  return result;
}

// Main function
async function main() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const materialsDir = path.join(__dirname, '..', '..', 'materials');
  const outputFile = path.join(materialsDir, 'materials.json');

  console.log('Scanning materials directory...');

  try {
    const materials = await scanDirectory(materialsDir);
    fs.writeFileSync(outputFile, JSON.stringify(materials, null, 2));
    console.log(`Materials scanned and saved to ${outputFile}`);
  } catch (error) {
    console.error('Error scanning materials:', error);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { scanDirectory, readFileContent };
