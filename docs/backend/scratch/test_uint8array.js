const { PDFParse } = require('pdf-parse');

const run = async () => {
  const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 712 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000222 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n317\n%%EOF');

  try {
    const u8 = new Uint8Array(mockPdfBuffer);
    const parser = new PDFParse(u8);
    await parser.load();
    const text = await parser.getText();
    console.log('Success! Text content:', JSON.stringify(text));
  } catch (err) {
    console.log('Failed:', err.stack || err.message);
  }
};

run();
