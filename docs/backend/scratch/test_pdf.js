const pdfParse = require('pdf-parse');

const run = async () => {
  try {
    // Create a mock PDF buffer or use a very minimal valid PDF byte array
    // A minimal valid PDF header
    const mockPdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << >> /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 712 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000222 00000 n\ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n317\n%%EOF');
    
    console.log('Parsing mock PDF buffer...');
    const result = await pdfParse(mockPdfBuffer);
    console.log('Result text:', JSON.stringify(result.text));
    console.log('Success!');
  } catch (error) {
    console.error('pdf-parse failed:', error.stack || error.message);
  }
};

run();
