// testDocumentation.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDocumentation() {
  const docsDir = path.join(__dirname, 'docs');
  const files = ['USER_GUIDE.md', 'DEV_GUIDE.md', 'DEPLOYMENT_GUIDE.md'];

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    try {
      await fs.access(filePath);
      console.log(`✓ ${file} exists`);
    } catch (error) {
      console.error(`✗ ${file} is missing`);
    }
  }
}

testDocumentation();