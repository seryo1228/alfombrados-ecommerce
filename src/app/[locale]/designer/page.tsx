"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { DesignComplexity } from "@/types";

export default function DesignerPage() {
  const t = useTranslations("designer");
  const { currency, exchangeRate } = useCurrencyStore();

  // Calculator state
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [complexity, setComplexity] = useState<DesignComplexity>("moderate");

  // AI Designer state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [generatedDesign, setGeneratedDesign] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Design count from cookie
  const getDesignCount = () => {
    return parseInt(Cookies.get(DESIGN_COUNT_COOKIE) || "0", 10);
  };
  const designsRemaining = MAX_DESIGNS_PER_SESSION - getDesignCount();

  // Calculator logic
  const areaM2 = (width * height) / 10000;
  const pricePerM2 = PRICE_PER_M2[complexity];
  const estimatedPrice = areaM2 * pricePerM2;

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

  // AI Design generation
  const handleGenerate = async () => {
    if (designsRemaining <= 0) return;

    setIsGenerating(true);
    try {
      // TODO: Call actual Gemini API via /api/design
      // For now, simulate the design generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Increment cookie count
      const current = getDesignCount();
      Cookies.set(DESIGN_COUNT_COOKIE, String(current + 1), { expires: 30 });

      // Simulated result
      setGeneratedDesign("/placeholder-design.png");
    } catch {
      // Error handling
    } finally {
      setIsGenerating(false);
    }
  };

  // WhatsApp quote
  const sendWhatsAppQuote = () => {
    const message = encodeURIComponent(
      `Hi! I'd like to request a quote for a custom rug:\n\n` +
        `Dimensions: ${width}cm x ${height}cm (${areaM2.toFixed(2)} m²)\n` +
        `Design Complexity: ${complexity}\n` +
        `Estimated Price: ${formatPrice(estimatedPrice, currency, exchangeRate)}\n\n` +
        `${generatedDesign ? "I have an AI-generated design to share." : ""}`
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
                  onChange={(e) => setWidth(Number(e.target.value))}
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
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Design Complexity */}
            <div className="space-y-2">
              <Label>{t("calculator.design")}</Label>
              <Select
                value={complexity}
                onValueChange={(v) => setComplexity(v as DesignComplexity)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">{t("calculator.simple")} — ${PRICE_PER_M2.simple}/m²</SelectItem>
                  <SelectItem value="moderate">{t("calculator.moderate")} — ${PRICE_PER_M2.moderate}/m²</SelectItem>
                  <SelectItem value="complex">{t("calculator.complex")} — ${PRICE_PER_M2.complex}/m²</SelectItem>
                  <SelectItem value="premium">{t("calculator.premium")} — ${PRICE_PER_M2.premium}/m²</SelectItem>
                </SelectContent>
              </Select>
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
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                designsRemaining <= 0 ||
                (!uploadedImage && !prompt)
              }
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t("ai.generating")}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {t("ai.generate")}
                </>
              )}
            </Button>

            {/* Generated Design */}
            {generatedDesign && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold">{t("ai.result")}</h3>
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                    {/* When connected to Gemini, display the actual generated image */}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
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
