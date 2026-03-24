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
import {
  CreditCard,
  MessageCircle,
  User,
  MapPin,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";
import type { ContactChannel } from "@/types";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { currency, exchangeRate } = useCurrencyStore();

  const [paymentMethod, setPaymentMethod] = useState<"online" | "whatsapp">(
    "whatsapp"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
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

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (paymentMethod === "whatsapp") {
        // Build WhatsApp message with order details
        const itemsList = items
          .map(
            (item) =>
              `- ${item.name} x${item.quantity} = ${formatPrice(
                item.priceUsd * item.quantity,
                currency,
                exchangeRate
              )}`
          )
          .join("\n");

        const message = encodeURIComponent(
          `New Order from ${form.name}\n\n` +
            `Items:\n${itemsList}\n\n` +
            `Total: ${formatPrice(totalPrice(), currency, exchangeRate)}\n\n` +
            `Contact: ${form.phone}\n` +
            `Email: ${form.email}\n` +
            `Ship to: ${form.address}, ${form.city}, ${form.state} ${form.zipCode}, ${form.country}`
        );

        window.open(
          `https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}?text=${message}`,
          "_blank"
        );

        clearCart();
        toast.success("Order sent via WhatsApp!");
        router.push("/");
      } else {
        // TODO: Integrate with payment gateway (Stripe)
        // For now, create order in ERP via API
        toast.info("Online payment coming soon. Order sent via WhatsApp instead.");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

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
                  {t("payment.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      paymentMethod === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <MessageCircle className="h-6 w-6 text-green-600 mb-2" />
                    <p className="font-semibold">{t("payment.whatsapp")}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("payment.whatsappHint")}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      paymentMethod === "online"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
                    <p className="font-semibold">{t("payment.online")}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("payment.onlineHint")}
                    </p>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-muted-foreground truncate mr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatPrice(
                        item.priceUsd * item.quantity,
                        currency,
                        exchangeRate
                      )}
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
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : paymentMethod === "whatsapp" ? (
                    <MessageCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <CreditCard className="mr-2 h-4 w-4" />
                  )}
                  {paymentMethod === "whatsapp"
                    ? t("whatsappOrder")
                    : t("place")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
