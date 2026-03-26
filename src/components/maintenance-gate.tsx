"use client";

import { useEffect, useState } from "react";
import { publicApi } from "@/lib/api";
import { Wrench } from "lucide-react";

export function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    publicApi
      .getConfig()
      .then((config) => {
        const mode = config?.general?.maintenance_mode;
        setMaintenance(mode === true || mode === "true");
      })
      .catch(() => {
        // If config fails, don't block the site
        setMaintenance(false);
      })
      .finally(() => setChecked(true));
  }, []);

  // Don't block until we've checked
  if (!checked) return <>{children}</>;

  if (maintenance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md space-y-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wrench className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Sitio en Mantenimiento
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Estamos realizando mejoras para brindarte una mejor experiencia.
            Volvemos pronto.
          </p>
          <div className="pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Mientras tanto, contáctanos por:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://wa.me/584120993377"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="https://instagram.com/alfombra2_ve"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
