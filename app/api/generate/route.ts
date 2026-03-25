import { NextRequest } from "next/server";
import { scrapeArticle } from "@/lib/scraper";
import { extractInsights } from "@/lib/insights";
import { generateImages } from "@/lib/images";
import { buildPdfHtml } from "@/lib/pdf-template";
import { generatePdf } from "@/lib/pdf";

export const maxDuration = 300; // 5 minutes for edge timeout

export async function POST(request: NextRequest) {
  const { url } = await request.json();

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return Response.json({ error: "Invalid URL format" }, { status: 400 });
  }

  // Use SSE for progress updates
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function sendEvent(type: string, data: object) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`)
        );
      }

      try {
        // Step 1: Scrape
        sendEvent("progress", { step: "scraping", message: "Extracting article content..." });
        const { title, text } = await scrapeArticle(url);
        sendEvent("progress", { step: "scraping_done", message: `Extracted: "${title}"` });

        // Step 2: Extract insights
        sendEvent("progress", { step: "insights", message: "Analyzing article with AI..." });
        const { infographicTitle, insights } = await extractInsights(title, text);
        sendEvent("progress", {
          step: "insights_done",
          message: `Generated ${insights.length} insights`,
        });

        // Step 3: Generate images
        sendEvent("progress", { step: "images", message: "Generating AI images (this may take a minute)..." });
        const imageUrls = await generateImages(insights.map((i) => i.imagePrompt));
        sendEvent("progress", { step: "images_done", message: "All images generated" });

        // Step 4: Build PDF
        sendEvent("progress", { step: "pdf", message: "Building your infographic PDF..." });
        const html = buildPdfHtml(infographicTitle, insights, imageUrls);
        const pdfBuffer = await generatePdf(html);
        sendEvent("progress", { step: "pdf_done", message: "PDF ready!" });

        // Send PDF as base64
        const pdfBase64 = pdfBuffer.toString("base64");
        sendEvent("complete", { pdf: pdfBase64, title: infographicTitle });
      } catch (error) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred";
        sendEvent("error", { message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
