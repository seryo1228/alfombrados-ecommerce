"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import {
  useCurrencyStore,
  formatPrice,
} from "@/components/layout/currency-switcher";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const { currency, exchangeRate } = useCurrencyStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t("empty")}</h1>
        <p className="text-muted-foreground mb-6">{t("emptyHint")}</p>
        <Button asChild>
          <Link href="/products">
            {t("continueShopping")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-4 flex items-center gap-4">
                {/* Image placeholder */}
                <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="h-8 w-8 text-muted-foreground/30" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm text-primary font-medium">
                    {formatPrice(item.priceUsd, currency, exchangeRate)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, Number(e.target.value))
                    }
                    className="w-14 h-8 text-center"
                    min={1}
                    max={item.maxStock}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Line total */}
                <p className="font-bold min-w-[80px] text-right">
                  {formatPrice(
                    item.priceUsd * item.quantity,
                    currency,
                    exchangeRate
                  )}
                </p>

                {/* Remove */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="h-fit sticky top-20">
          <CardHeader>
            <CardTitle>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span className="font-medium">
                {formatPrice(totalPrice(), currency, exchangeRate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("shipping")}</span>
              <span className="text-sm text-muted-foreground">
                {t("shippingCalc")}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-bold text-lg">{t("total")}</span>
              <span className="font-bold text-lg text-primary">
                {formatPrice(totalPrice(), currency, exchangeRate)}
              </span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout">
                {t("checkout")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/products">{t("continueShopping")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
