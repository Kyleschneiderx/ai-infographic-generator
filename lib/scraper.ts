import * as cheerio from "cheerio";

export async function scrapeArticle(url: string): Promise<{ title: string; text: string }> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, nav, footer, header, aside, .sidebar, .comments, .ad, .advertisement, iframe, noscript").remove();

  // Try to find the article title
  const title =
    $("h1").first().text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    "Untitled Article";

  // Try to find the main article content
  const selectors = ["article", '[role="main"]', ".post-content", ".entry-content", ".article-body", "main", ".content"];

  let text = "";
  for (const selector of selectors) {
    const el = $(selector);
    if (el.length && el.text().trim().length > 200) {
      text = el.text().trim();
      break;
    }
  }

  // Fallback: get all paragraph text
  if (!text) {
    text = $("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter((t) => t.length > 20)
      .join("\n\n");
  }

  // Clean up whitespace
  text = text.replace(/\s+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

  if (text.length < 100) {
    throw new Error("Could not extract meaningful content from this URL");
  }

  return { title, text };
}
