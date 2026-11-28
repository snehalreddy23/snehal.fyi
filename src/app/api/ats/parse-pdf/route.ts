import { NextResponse } from "next/server";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 8MB limit. Please upload a smaller PDF." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Load worker module into Node environment first to prevent fake worker resolution failure
    try {
      // @ts-expect-error pdf.worker.mjs has no TypeScript declarations
      await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    } catch {
      // Fallback if worker already loaded
    }

    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    try {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = path.resolve(
          "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
        );
      }
    } catch {
      // Ignore if workerSrc path cannot be resolved
    }

    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ");
      fullText += pageText + "\n";
    }

    if (!fullText.trim()) {
      return NextResponse.json(
        {
          error:
            "No extractable text found in this PDF. It appears to be an image or scanned document. Please paste your resume text into the text box.",
          isScanned: true,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: fullText.trim(),
      numPages: pdf.numPages,
      fileName: file.name,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF parsing failed";
    console.error("PDF parse route error:", message);
    return NextResponse.json(
      {
        error:
          "Unable to extract text from this PDF file. Please switch to 'Paste Text' and paste your resume text directly.",
      },
      { status: 500 }
    );
  }
}
