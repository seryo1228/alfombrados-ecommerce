"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, User, MapPin, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useCurrencyStore, formatPrice } from "@/components/layout/currency-switcher";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { publicApi } from "@/lib/api";
import { toast } from "sonner";
import type { ContactChannel } from "@/types";

type PayMethod = "whatsapp" | "stripe" | "binance";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function BinanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6359-4.6595zm4.6366-4.6366L24 12l-2.7175 2.7185-2.7185-2.7185zm-9.272 0l2.7175 2.7164-2.7175 2.7185L9.2785 12zm-9.2723 0L5.4316 12l-2.7176 2.7185L0 12zm6.5534-6.5517L12 2.7185l5.4488 5.4483-2.7156 2.7174-2.7332-2.7174-2.7183 2.7174-2.7188-2.7174z"/>
    </svg>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { currency, exchangeRate } = useCurrencyStore();

  const [paymentMethod, setPaymentMethod] = useState<PayMethod>("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    channel: "website" as ContactChannel,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const orderBase = () => ({
    customer: {
      name: form.name,
      email: form.email,
      phone: form.phone,
      contactChannel: form.channel,
    },
    shipping: {
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
      country: form.country,
    },
    items: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    currency: currency as "USD" | "VES",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (paymentMethod === "whatsapp") {
        const result = await publicApi.submitOrder({
          ...orderBase(),
          paymentMethod: "whatsapp",
        });
        clearCart();
        toast.success(`Orden #${result.orderNumber} creada!`);
        const itemsList = items
          .map((item) => `- ${item.name} x${item.quantity} = ${formatPrice(item.priceUsd * item.quantity, currency, exchangeRate)}`)
          .join("\n");
        const message = encodeURIComponent(
          `Orden #${result.orderNumber}\n\n${itemsList}\n\nTotal: ${formatPrice(result.totalUsd, currency, exchangeRate)}\n\nContacto: ${form.phone}`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`, "_blank");
        router.push("/checkout/success?order=" + result.orderNumber);

      } else if (paymentMethod === "stripe") {
        const result = await publicApi.createStripeCheckout(orderBase());
        clearCart();
        window.location.href = result.sessionUrl;

      } else if (paymentMethod === "binance") {
        const result = await publicApi.createBinanceCheckout(orderBase());
        clearCart();
        window.location.href = result.checkoutUrl;
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Error al procesar la orden";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const payOptions: { id: PayMethod; label: string; hint: string; icon: React.ReactNode; accent: string }[] = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      hint: "Coordina el pago directamente por WhatsApp",
      icon: <WhatsAppIcon className="h-6 w-6" />,
      accent: "#25D366",
    },
    {
      id: "stripe",
      label: "Tarjeta de crédito/débito",
      hint: "Visa, Mastercard, Amex — pago seguro con Stripe",
      icon: <CreditCard className="h-6 w-6" />,
      accent: "#635BFF",
    },
    {
      id: "binance",
      label: "Binance Pay",
      hint: "USDT, BNB, ETH — pago en crypto",
      icon: <BinanceIcon className="h-6 w-6" />,
      accent: "#F0B90B",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  {t("contact.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("contact.name")}</Label>
                  <Input
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("contact.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("contact.phone")}</Label>
                    <Input
                      id="phone"
                      required
                      value={form.phone}
                      onChange={(e) => updateForm("phone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  {t("shipping.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">{t("shipping.address")}</Label>
                  <Input
                    id="address"
                    required
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("shipping.city")}</Label>
                    <Input
                      id="city"
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t("shipping.state")}</Label>
                    <Input
                      id="state"
                      required
                      value={form.state}
                      onChange={(e) => updateForm("state", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t("shipping.zip")}</Label>
                    <Input
                      id="zip"
                      required
                      value={form.zipCode}
                      onChange={(e) => updateForm("zipCode", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t("shipping.country")}</Label>
                    <Select
                      value={form.country}
                      onValueChange={(v) => updateForm("country", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="VE">Venezuela</SelectItem>
                        <SelectItem value="CO">Colombia</SelectItem>
                        <SelectItem value="MX">Mexico</SelectItem>
                        <SelectItem value="ES">España</SelectItem>
                        <SelectItem value="AR">Argentina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  {t("payment.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {payOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${
                        paymentMethod === opt.id
                          ? "border-[--accent] bg-[--accent]/5 shadow-sm"
                          : "border-border hover:border-[--accent]/40"
                      }`}
                      style={{ "--accent": opt.accent } as React.CSSProperties}
                    >
                      <div
                        className="shrink-0 p-2 rounded-lg"
                        style={{
                          background: paymentMethod === opt.id ? opt.accent + "20" : "#f3f4f6",
                          color: opt.accent,
                        }}
                      >
                        {opt.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.hint}</p>
                      </div>
                      {paymentMethod === opt.id && (
                        <div
                          className="ml-auto w-4 h-4 rounded-full border-4 shrink-0"
                          style={{ borderColor: opt.accent }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(item.priceUsd * item.quantity, currency, exchangeRate)}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(totalPrice(), currency, exchangeRate)}
                  </span>
                </div>

                {/* Pago con logos */}
                <div className="pt-2 flex flex-wrap gap-1.5 justify-center opacity-60">
                  {paymentMethod === "stripe" && (
                    <span className="text-xs border rounded px-2 py-0.5">Visa</span>
                  )}
                  {paymentMethod === "stripe" && (
                    <span className="text-xs border rounded px-2 py-0.5">Mastercard</span>
                  )}
                  {paymentMethod === "stripe" && (
                    <span className="text-xs border rounded px-2 py-0.5">Amex</span>
                  )}
                  {paymentMethod === "binance" && (
                    <span className="text-xs border rounded px-2 py-0.5">USDT</span>
                  )}
                  {paymentMethod === "binance" && (
                    <span className="text-xs border rounded px-2 py-0.5">BNB</span>
                  )}
                  {paymentMethod === "binance" && (
                    <span className="text-xs border rounded px-2 py-0.5">ETH</span>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-white"
                  size="lg"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor:
                      paymentMethod === "whatsapp" ? "#25D366"
                      : paymentMethod === "binance"  ? "#F0B90B"
                      : "#635BFF",
                  }}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : paymentMethod === "whatsapp" ? (
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                  ) : paymentMethod === "binance" ? (
                    <BinanceIcon className="mr-2 h-4 w-4" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {paymentMethod === "whatsapp"
                    ? "Confirmar y contactar por WhatsApp"
                    : paymentMethod === "stripe"
                    ? "Pagar con tarjeta"
                    : "Pagar con Binance Pay"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  {paymentMethod === "stripe" && "🔒 Pago seguro con Stripe"}
                  {paymentMethod === "binance" && "🔐 Pago seguro con Binance Pay"}
                  {paymentMethod === "whatsapp" && "Nuestro equipo te contactará para coordinar el pago"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
