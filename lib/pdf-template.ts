import { Insight } from "./insights";

function insightSection(insight: Insight, imageUrl: string, index: number): string {
  const isEven = index % 2 === 0; // 0-indexed: 0,2,4 = text left; 1,3 = image left
  const number = index + 1;

  const textBlock = `
    <div style="flex: 1; padding: 30px;">
      <div style="
        display: inline-block;
        background: #6366f1;
        color: white;
        font-size: 14px;
        font-weight: 700;
        padding: 4px 14px;
        border-radius: 20px;
        margin-bottom: 16px;
      ">INSIGHT ${number}</div>
      <h2 style="
        font-size: 26px;
        font-weight: 800;
        color: #1e1b4b;
        margin: 0 0 14px 0;
        line-height: 1.2;
      ">${insight.title}</h2>
      <p style="
        font-size: 16px;
        color: #4b5563;
        line-height: 1.7;
        margin: 0;
      ">${insight.description}</p>
    </div>
  `;

  const imageBlock = `
    <div style="flex: 1; padding: 15px;">
      <img src="${imageUrl}" style="
        width: 100%;
        height: 280px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      " />
    </div>
  `;

  return `
    <div style="
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 10px 0;
    ">
      ${isEven ? textBlock + imageBlock : imageBlock + textBlock}
    </div>
  `;
}

export function buildPdfHtml(
  infographicTitle: string,
  insights: Insight[],
  imageUrls: string[]
): string {
  const sections = insights
    .map((insight, i) => insightSection(insight, imageUrls[i], i))
    .join('<div style="border-top: 2px solid #e5e7eb; margin: 0 30px;"></div>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      color: #1f2937;
    }
  </style>
</head>
<body>
  <div style="
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
    padding: 60px 50px;
    text-align: center;
  ">
    <h1 style="
      font-size: 42px;
      font-weight: 900;
      color: white;
      line-height: 1.2;
      letter-spacing: -1px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.15);
    ">${infographicTitle}</h1>
    <div style="
      width: 80px;
      height: 4px;
      background: rgba(255,255,255,0.6);
      margin: 20px auto 0;
      border-radius: 2px;
    "></div>
  </div>

  <div style="padding: 30px 20px;">
    ${sections}
  </div>

  <div style="
    background: #f9fafb;
    padding: 25px;
    text-align: center;
    border-top: 2px solid #e5e7eb;
  ">
    <p style="font-size: 13px; color: #9ca3af;">
      Generated with AI Infographic Generator
    </p>
  </div>
</body>
</html>`;
}
