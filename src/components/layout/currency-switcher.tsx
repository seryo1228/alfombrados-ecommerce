"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import type { Currency } from "@/types";

interface CurrencyState {
  currency: Currency;
  exchangeRate: number;
  setCurrency: (c: Currency) => void;
  setExchangeRate: (rate: number) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      exchangeRate: 1,
      setCurrency: (currency) => set({ currency }),
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
    }),
    { name: "alf-currency" }
  )
);

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrencyStore();

  const toggle = () => setCurrency(currency === "USD" ? "VES" : "USD");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="gap-1 text-xs font-medium"
    >
      <DollarSign className="h-4 w-4" />
      {currency}
    </Button>
  );
}

export function formatPrice(
  priceUsd: number,
  currency: Currency,
  exchangeRate: number
): string {
  if (currency === "VES") {
    const ves = priceUsd * exchangeRate;
    return `Bs. ${ves.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${priceUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
