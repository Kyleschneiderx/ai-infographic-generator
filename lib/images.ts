const KIE_API_BASE = "https://api.kie.ai/api/v1";

interface KieCreateTaskResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
  };
}

interface KieRecordInfoResponse {
  code: number;
  msg: string;
  data: {
    taskId: string;
    model: string;
    state: string;
    resultJson: string;
    failMsg: string;
    progress: number;
  };
}

async function kieRequest(endpoint: string, body?: object): Promise<Response> {
  const apiKey = process.env.KIE_API_KEY;
  if (!apiKey) throw new Error("KIE_API_KEY is not set");

  return fetch(`${KIE_API_BASE}${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });
}

function extractUrlFromResult(resultJson: string): string {
  console.log("[Kie.ai] Raw resultJson:", resultJson);

  const parsed = JSON.parse(resultJson);

  // Could be a direct URL string
  if (typeof parsed === "string") return parsed;

  // Could be an array of URLs
  if (Array.isArray(parsed)) {
    if (typeof parsed[0] === "string") return parsed[0];
    // Array of objects with url/imageUrl field
    if (parsed[0]?.url) return parsed[0].url;
    if (parsed[0]?.imageUrl) return parsed[0].imageUrl;
    if (parsed[0]?.image_url) return parsed[0].image_url;
    if (parsed[0]?.output) return parsed[0].output;
  }

  // Could be an object with a url/images/output field
  if (parsed?.url) return parsed.url;
  if (parsed?.imageUrl) return parsed.imageUrl;
  if (parsed?.image_url) return parsed.image_url;
  if (parsed?.output) {
    if (typeof parsed.output === "string") return parsed.output;
    if (Array.isArray(parsed.output) && parsed.output[0]) return parsed.output[0];
  }
  if (parsed?.images) {
    if (typeof parsed.images === "string") return parsed.images;
    if (Array.isArray(parsed.images) && parsed.images[0]) return parsed.images[0];
  }
  if (parsed?.resultUrls) {
    if (Array.isArray(parsed.resultUrls) && parsed.resultUrls[0]) return parsed.resultUrls[0];
  }
  if (parsed?.data) {
    if (typeof parsed.data === "string") return parsed.data;
    if (parsed.data?.url) return parsed.data.url;
  }

  throw new Error(`Could not extract image URL from resultJson: ${resultJson}`);
}

async function generateImage(prompt: string): Promise<string> {
  console.log("[Kie.ai] Creating task for prompt:", prompt.slice(0, 80) + "...");

  const genResponse = await kieRequest("/jobs/createTask", {
    model: "nano-banana-2",
    input: {
      prompt,
      aspect_ratio: "3:2",
      resolution: "1K",
      output_format: "png",
    },
  });

  if (!genResponse.ok) {
    const errorText = await genResponse.text();
    throw new Error(`Kie.ai generation failed: ${genResponse.status} ${errorText}`);
  }

  const genData: KieCreateTaskResponse = await genResponse.json();
  console.log("[Kie.ai] createTask response:", JSON.stringify(genData));

  if (genData.code !== 200) {
    throw new Error(`Kie.ai generation error: ${genData.msg}`);
  }

  const taskId = genData.data.taskId;

  // Poll for completion
  const maxAttempts = 60;
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const statusResponse = await kieRequest(`/jobs/recordInfo?taskId=${taskId}`);
    if (!statusResponse.ok) {
      console.log(`[Kie.ai] Poll ${i} - status response not ok: ${statusResponse.status}`);
      continue;
    }

    const statusData: KieRecordInfoResponse = await statusResponse.json();
    const { state, resultJson, failMsg, progress } = statusData.data;
    console.log(`[Kie.ai] Poll ${i} - state: ${state}, progress: ${progress}`);

    if (state === "success" && resultJson) {
      const imageUrl = extractUrlFromResult(resultJson);
      console.log("[Kie.ai] Got image URL:", imageUrl);
      return imageUrl;
    }

    if (state === "fail") {
      throw new Error(`Image generation failed for task ${taskId}: ${failMsg}`);
    }
  }

  throw new Error(`Image generation timed out for task ${taskId}`);
}

/** Download an image URL and return it as a base64 data URI */
async function toDataUri(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.status} ${url}`);
  const contentType = res.headers.get("content-type") || "image/png";
  const buffer = Buffer.from(await res.arrayBuffer());
  return `data:${contentType};base64,${buffer.toString("base64")}`;
}

export async function generateImages(prompts: string[]): Promise<string[]> {
  const urls = await Promise.all(prompts.map((prompt) => generateImage(prompt)));

  // Convert all URLs to base64 data URIs so Puppeteer can render them
  console.log("[Kie.ai] Converting image URLs to base64 data URIs...");
  const dataUris = await Promise.all(urls.map((url) => toDataUri(url)));
  console.log("[Kie.ai] All images converted to data URIs");

  return dataUris;
}
