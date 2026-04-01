"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <div className="container mx-auto px-4 py-24 max-w-lg text-center">
      <div className="rounded-full w-20 h-20 bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>
      <h1 className="text-3xl font-bold mb-3">
        {isEs ? "¡Pago exitoso!" : "Payment successful!"}
      </h1>
      {orderNumber && (
        <p className="text-muted-foreground mb-2">
          {isEs ? "Número de pedido" : "Order number"}:{" "}
          <span className="font-mono font-bold text-foreground">{orderNumber}</span>
        </p>
      )}
      <p className="text-muted-foreground mb-10">
        {isEs
          ? "Tu pedido ha sido confirmado. Nuestro equipo lo procesará pronto y te contactará con los detalles de envío."
          : "Your order has been confirmed. Our team will process it shortly and contact you with shipping details."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" asChild>
          <Link href="/products">
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isEs ? "Seguir comprando" : "Continue shopping"}
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/">
            {isEs ? "Ir al inicio" : "Go home"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
