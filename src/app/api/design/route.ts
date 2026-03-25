import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

// System prompt for rug design generation — optimized for tufting artisans
const RUG_DESIGN_PROMPT = `You are an expert hand-tufted rug designer specializing in artisan tufting production.

CRITICAL STYLE REQUIREMENTS — Every design MUST follow these rules:
1. ILLUSTRATED STYLE: Generate a flat, illustrated design — NOT photorealistic. Think bold graphic illustration, like a vector art poster or screen-print.
2. TUFTING-FRIENDLY: The design must be easily reproducible by hand with a tufting gun on a tufting frame. This means:
   - CLEAR, WELL-DEFINED AREAS of solid color separated by distinct outlines/boundaries
   - NO fine gradients, NO photorealistic shading, NO blending between colors
   - Each color zone must be large enough to tuft (minimum ~2cm areas at real scale)
   - Strong black or dark outlines separating color regions (like a coloring book)
3. SOLID COLORS: Each color in the design should be a single flat tone — no gradients within a color zone.
4. TOP-DOWN VIEW: Always show the rug as seen from directly above, flat on a clean white background.
5. CLEAN BORDER: Include a well-defined rectangular or organic rug border/edge.
6. BOLD & SIMPLE: Favor bold shapes, geometric patterns, abstract art, cartoon-style illustrations, or stylized nature motifs. Avoid tiny details that cannot be tufted.

Think of the output as a "tufting pattern template" that an artisan can directly project onto their frame and follow with a tufting gun.

If the user provides an image: Transform it into an illustrated tufting-friendly design. Simplify the image dramatically — reduce to flat color zones with clear boundaries, remove all gradients and fine details, keep only the essential shapes.
If the user provides text: Create an original illustrated rug design based on their description, following all the rules above.`;

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
        text: "Transform this image into an ILLUSTRATED tufting pattern. Simplify it dramatically: reduce to flat solid color zones with bold outlines, remove all gradients and fine details, keep only essential shapes. The result must look like a bold graphic illustration that an artisan can easily reproduce with a tufting gun.",
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
