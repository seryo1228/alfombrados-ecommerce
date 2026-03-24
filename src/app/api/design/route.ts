import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

// System prompt for rug design generation
const RUG_DESIGN_PROMPT = `You are an expert tufted rug designer. Generate a high-quality rug design based on the user's input.
The design should:
- Be suitable for tufting (clear lines, distinct color areas)
- Have a top-down view as if looking at the rug from above
- Include a clean border/edge
- Use vibrant but harmonious colors
- Be practical to manufacture with a tufting gun
- Show the design on a flat surface with clean background

If the user provides an image, transform it into a tufted rug design maintaining the essence of the original but adapted for tufting.
If the user provides text, create a rug design based on their description.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, prompt } = body;

    if (!imageBase64 && !prompt) {
      return NextResponse.json(
        { error: "Provide an image or prompt" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      // Return placeholder when no API key configured
      return NextResponse.json({
        imageUrl: null,
        prompt: "AI design generation not configured. Set GEMINI_API_KEY to enable.",
        placeholder: true,
      });
    }

    // Build Gemini API request
    const parts: Array<Record<string, unknown>> = [
      { text: RUG_DESIGN_PROMPT },
    ];

    if (prompt) {
      parts.push({ text: `User request: ${prompt}` });
    }

    if (imageBase64) {
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
      parts.push({
        text: "Transform this image into a tufted rug design. Keep the main elements but adapt them for tufting manufacturing.",
      });
    }

    const geminiResponse = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Design generation failed" },
        { status: 500 }
      );
    }

    const result = await geminiResponse.json();

    // Extract generated image from response
    const candidates = result.candidates?.[0]?.content?.parts || [];
    let generatedImageUrl = null;
    let responseText = "";

    for (const part of candidates) {
      if (part.inlineData) {
        generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
      if (part.text) {
        responseText = part.text;
      }
    }

    return NextResponse.json({
      imageUrl: generatedImageUrl,
      prompt: responseText || prompt,
    });
  } catch (error) {
    console.error("Design API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
