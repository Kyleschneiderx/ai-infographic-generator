import Anthropic from "@anthropic-ai/sdk";

export interface Insight {
  title: string;
  description: string;
  imagePrompt: string;
}

export interface InsightResult {
  infographicTitle: string;
  insights: Insight[];
}

const client = new Anthropic();

export async function extractInsights(articleTitle: string, articleText: string): Promise<InsightResult> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Analyze this blog post and extract exactly 5 key insights. Also generate a compelling infographic title.

Article Title: ${articleTitle}

Article Text:
${articleText.slice(0, 8000)}

Respond with ONLY valid JSON in this exact format:
{
  "infographicTitle": "A compelling, concise title for the infographic (max 10 words)",
  "insights": [
    {
      "title": "Short insight title (3-6 words)",
      "description": "A clear, concise explanation of this insight in 2-3 sentences. Make it informative and engaging.",
      "imagePrompt": "A detailed, vivid description for generating an illustration. Describe a scene, objects, or metaphor that visually represents this insight. Use descriptive adjectives and specify style as 'modern flat illustration, vibrant colors, clean design'."
    }
  ]
}

Make sure each insight is distinct and captures a different key takeaway from the article. The image prompts should create visually diverse and interesting illustrations.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Extract JSON from response (handle potential markdown code blocks)
  let jsonStr = content.text.trim();
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }

  const result: InsightResult = JSON.parse(jsonStr);

  if (!result.insights || result.insights.length !== 5) {
    throw new Error("Expected exactly 5 insights from Claude");
  }

  return result;
}
