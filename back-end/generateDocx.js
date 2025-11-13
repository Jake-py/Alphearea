const { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } = require('docx');
const fs = require('fs');

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Нукус давлат техника университетида суьний интллекет технологияларини жорий этиш қилиш ва малакали кадрлар тайёрлаш бўйича чора-тадбирлар режаси",
            heading: 'Heading1',
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Колонка 1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Колонка 2")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Колонка 3")],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Данные 1")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Данные 2")],
                  }),
                  new TableCell({
                    children: [new Paragraph("Данные 3")],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Киберхавфсизлиги_проект.docx', buffer);
  console.log('DOCX файл создан: Киберхавфсизлиги_проект.docx');
}

generateDocx().catch(console.error);
