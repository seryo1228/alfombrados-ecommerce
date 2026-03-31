"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { publicApi } from "@/lib/api";
import type { Currency } from "@/types";

interface CurrencyState {
  currency: Currency;
  exchangeRate: number;
  rateLoaded: boolean;
  setCurrency: (c: Currency) => void;
  setExchangeRate: (rate: number) => void;
  setRateLoaded: (v: boolean) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      exchangeRate: 1,
      rateLoaded: false,
      setCurrency: (currency) => set({ currency }),
      setExchangeRate: (exchangeRate) => set({ exchangeRate }),
      setRateLoaded: (rateLoaded) => set({ rateLoaded }),
    }),
    { name: "alf-currency" }
  )
);

export function CurrencySwitcher() {
  const { currency, setCurrency, rateLoaded, setExchangeRate, setRateLoaded } =
    useCurrencyStore();

  // Fetch EUR exchange rate from ERP (BCV scraper)
  useEffect(() => {
    if (rateLoaded) return;
    publicApi
      .getExchangeRate()
      .then((rate) => {
        // Use EUR rate from BCV (primary), fall back to USD rate
        const eurRate = Number(rate.vesPerEur);
        const usdRate = Number(rate.vesPerUsd);
        if (eurRate > 0) {
          setExchangeRate(eurRate);
          setRateLoaded(true);
        } else if (usdRate > 0) {
          setExchangeRate(usdRate);
          setRateLoaded(true);
        }
      })
      .catch(() => {
        // Silently fail — keep last known rate or default
      });
  }, [rateLoaded, setExchangeRate, setRateLoaded]);

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
  priceUsd: number | string,
  currency: Currency,
  exchangeRate: number
): string {
  const price = typeof priceUsd === "string" ? parseFloat(priceUsd) : priceUsd;
  if (isNaN(price)) return "$0";
  if (currency === "VES") {
    const ves = price * exchangeRate;
    return `Bs. ${ves.toLocaleString("es-VE", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `$${price.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
