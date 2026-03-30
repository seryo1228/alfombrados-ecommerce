"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Upload,
  Calculator,
  Image as ImageIcon,
  MessageCircle,
  Loader2,
  Download,
} from "lucide-react";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";
import { PRICE_PER_M2, MAX_DESIGNS_PER_SESSION, DESIGN_COUNT_COOKIE, WHATSAPP_NUMBER } from "@/lib/constants";
import Cookies from "js-cookie";

export default function DesignerPage() {
  const t = useTranslations("designer");
  const { currency, exchangeRate } = useCurrencyStore();

  // Calculator state
  const [width, setWidth] = useState("100");
  const [height, setHeight] = useState("100");

  // AI Designer state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");

  // Design count from cookie
  const getDesignCount = () => {
    return parseInt(Cookies.get(DESIGN_COUNT_COOKIE) || "0", 10);
  };
  const designsRemaining = MAX_DESIGNS_PER_SESSION - getDesignCount();

  // Calculator logic
  const w = Number(width) || 0;
  const h = Number(height) || 0;
  const areaM2 = (w * h) / 10000;
  const MIN_PRICE = 40;
  const estimatedPrice = Math.max(areaM2 * PRICE_PER_M2, areaM2 > 0 ? MIN_PRICE : 0);

  // Image upload handler
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // AI Design generation with progress steps + real Gemini API
  const [generationError, setGenerationError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (designsRemaining <= 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationError(null);

    // Progress simulation runs alongside the real API call
    const progressSteps = [
      { progress: 15, label: t("ai.steps.analyzing"), delay: 500 },
      { progress: 35, label: t("ai.steps.processing"), delay: 1500 },
      { progress: 60, label: t("ai.steps.generating"), delay: 3000 },
      { progress: 85, label: t("ai.steps.refining"), delay: 6000 },
    ];

    // Start progress animation
    for (const step of progressSteps) {
      setTimeout(() => {
        setGenerationProgress(step.progress);
        setGenerationStep(step.label);
      }, step.delay);
    }

    try {
      // Real API call to Gemini via /api/design
      const response = await fetch("/api/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBase64: uploadedImage || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error generating design");
      }

      // Finish progress
      setGenerationProgress(100);
      setGenerationStep(t("ai.steps.finishing"));
      await new Promise((r) => setTimeout(r, 400));

      if (data.imageUrl) {
        setGeneratedDesign(data.imageUrl);
      } else if (data.placeholder) {
        // API key not configured — show message
        setGenerationError(data.prompt);
      } else {
        setGeneratedDesign(null);
        setGenerationError(data.prompt || "No se generó imagen. Intenta con otra descripción.");
      }

      // Increment cookie count
      const current = getDesignCount();
      Cookies.set(DESIGN_COUNT_COOKIE, String(current + 1), { expires: 30 });
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : "Error al generar el diseño");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStep("");
    }
  };

  // WhatsApp quote
  const sendWhatsAppQuote = () => {
    const message = encodeURIComponent(
      `Me puedo comunicar con un asesor\n\n` +
        `Dimensiones: ${width}cm x ${height}cm (${areaM2.toFixed(2)} m²)\n` +
        `Precio por m²: $200\n` +
        `Precio estimado: ${formatPrice(estimatedPrice, currency, exchangeRate)}\n\n` +
        `${generatedDesign ? "Tengo un diseño generado con IA para compartir." : ""}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`, "_blank");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          AI-Powered
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              {t("calculator.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">{t("calculator.width")}</Label>
                <Input
                  id="width"
                  type="number"
                  min={10}
                  max={500}
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">{t("calculator.height")}</Label>
                <Input
                  id="height"
                  type="number"
                  min={10}
                  max={500}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>

            {/* Price per m2 info */}
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-primary">$200.00 / m²</p>
            </div>

            <Separator />

            {/* Result */}
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">
                {t("calculator.area")}: {areaM2.toFixed(2)} m²
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                {t("calculator.estimate")}
              </p>
              <p className="text-4xl font-bold text-primary">
                {formatPrice(estimatedPrice, currency, exchangeRate)}
              </p>
              {areaM2 > 0 && areaM2 * PRICE_PER_M2 < MIN_PRICE && (
                <p className="text-xs text-amber-600 font-medium mt-1">
                  {t("calculator.minPrice") || "Precio mínimo: $40"}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {t("calculator.priceNote")}
              </p>
            </div>

            {/* CTA */}
            <Button
              className="w-full"
              size="lg"
              onClick={sendWhatsAppQuote}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("calculator.requestQuote")}
            </Button>
          </CardContent>
        </Card>

        {/* AI Design Studio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("ai.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("ai.description")}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Design limit badge */}
            <div className="flex justify-end">
              <Badge variant={designsRemaining > 0 ? "secondary" : "destructive"}>
                {designsRemaining > 0
                  ? t("ai.remaining", { count: designsRemaining })
                  : t("ai.limitReached")}
              </Badge>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>{t("ai.upload")}</Label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary/50 transition-colors">
                {uploadedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={uploadedImage}
                    alt="Uploaded reference"
                    className="max-h-48 object-contain rounded"
                  />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {t("ai.uploadHint")}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label>{t("ai.prompt")}</Label>
              <Textarea
                placeholder={t("ai.prompt")}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            {isGenerating ? (
              <div className="rounded-xl border bg-card p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <Sparkles className="h-3.5 w-3.5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t("ai.generating")}</p>
                    <p className="text-xs text-muted-foreground">{generationStep}</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {generationProgress}% — {t("ai.steps.wait")}
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={designsRemaining <= 0 || !prompt.trim()}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t("ai.generate")}
              </Button>
            )}

            {/* Error message */}
            {generationError && !isGenerating && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                {generationError}
              </div>
            )}

            {/* Generated Design */}
            {generatedDesign && !isGenerating && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("ai.result")}</h3>
                  <div className="rounded-lg overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedDesign}
                      alt="Generated rug design"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = generatedDesign!;
                        a.download = "alfombrados-design.png";
                        a.click();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t("ai.downloadDesign")}
                    </Button>
                    <Button className="flex-1" onClick={sendWhatsAppQuote}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t("ai.requestQuote")}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
