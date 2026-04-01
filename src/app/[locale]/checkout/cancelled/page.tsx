"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingCart, RefreshCcw } from "lucide-react";

export default function CancelledPage() {
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <div className="container mx-auto px-4 py-24 max-w-lg text-center">
      <div className="rounded-full w-20 h-20 bg-red-500/10 flex items-center justify-center mx-auto mb-6">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold mb-3">
        {isEs ? "Pago cancelado" : "Payment cancelled"}
      </h1>
      <p className="text-muted-foreground mb-10">
        {isEs
          ? "El pago fue cancelado y tu pedido no fue procesado. Tu carrito sigue intacto."
          : "The payment was cancelled and your order was not processed. Your cart is still intact."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" asChild>
          <Link href="/checkout">
            <RefreshCcw className="mr-2 h-5 w-5" />
            {isEs ? "Intentar de nuevo" : "Try again"}
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/cart">
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isEs ? "Ver carrito" : "View cart"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
