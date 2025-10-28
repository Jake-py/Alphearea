import fs from "fs";
import path from "path";
import { readFileSync } from "fs";
import { extractRawText } from "mammoth"; // для DOC/DOCX
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // для PDF
import iconv from "iconv-lite"; // для кодировок

const root = "./public/materials";
const output = "./public/materials/materials.json";

const buildTree = async (dir) => {
  const result = {};
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = fullPath.replace("public/", "");

    if (entry.isDirectory()) {
      result[entry.name] = await buildTree(fullPath);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      let content = "";
      if (ext === ".txt") {
        const buffer = readFileSync(fullPath);
        let decoded = iconv.decode(buffer, 'cp1251');
        if (!decoded || decoded.includes('')) {
          decoded = iconv.decode(buffer, 'utf8');
        }
        if (!decoded || decoded.includes('')) {
          decoded = iconv.decode(buffer, 'koi8-r');
        }
        content = decoded || buffer.toString('utf8');
      } else if (ext === ".docx") {
        const buffer = readFileSync(fullPath);
        const { value } = await extractRawText({ buffer });
        content = value;
      } else if (ext === ".pdf") {
        const dataBuffer = readFileSync(fullPath);
        const data = await new pdfParse.PDFParse(dataBuffer);
        content = data.text;
      } else if (/\.(jpg|jpeg|png|gif)$/i.test(ext)) {
        content = "(Изображение)";
      } else {
        continue;
      }

      if (!result.files) result.files = [];
      result.files.push({
        name: entry.name,
        path: relativePath,
        extension: ext,
        content: (content || "").slice(0, 2000) // ограничим текст
      });
    }
  }

  return result;
};

const materials = await buildTree(root);

fs.writeFileSync(output, JSON.stringify(materials, null, 2));
console.log(`✅ materials.json создан с иерархической структурой`);
