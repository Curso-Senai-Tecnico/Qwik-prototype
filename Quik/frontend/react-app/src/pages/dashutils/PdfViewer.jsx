import { Document, Page } from "react-pdf";
import { useState } from "react";

export default function PdfViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Document
        file={fileUrl}
        onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
      >

        { numPages && Array.from({ length: numPages }, (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            width={500}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
