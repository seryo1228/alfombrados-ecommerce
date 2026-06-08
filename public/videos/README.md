# Videos del Taller

El componente `<WorkshopVideos />` del landing acepta **4 tipos de fuente** mezcladas en la misma lista. Edita `WORKSHOP_VIDEOS` en `src/app/[locale]/page.tsx`:

```ts
const WORKSHOP_VIDEOS: VideoSource[] = [
  // 1) Archivo local (mejor calidad, más rápido)
  { src: "/videos/workshop-1.mp4" },

  // 2) YouTube Short (recomendado para "pegar y olvidar")
  { src: "https://www.youtube.com/shorts/dQw4w9WgXcQ" },

  // 3) Instagram Reel (trae chrome de IG)
  { src: "https://www.instagram.com/reel/SHORTCODE/" },

  // 4) TikTok (trae chrome de TikTok)
  { src: "https://www.tiktok.com/@alfombra2_ve/video/7123456789012345678" },
];
```

---

## Ranking de opciones (de mejor a peor)

| Opción | Carga rápido | Sin marca de plataforma | Esfuerzo |
|---|---|---|---|
| **Local MP4** | ✅ Más rápido | ✅ Sin chrome | Descarga + sube los archivos |
| **YouTube Shorts** | ✅ Rápido | ✅ Modesto (con `modestbranding`) | Subir a YouTube + pegar URL |
| **Instagram Reel** | ⚠️ Lento | ❌ Trae caption, link IG | Pegar URL |
| **TikTok** | ⚠️ Lento | ❌ Trae botones TikTok | Pegar URL |

**Recomendación práctica:** Sube los videos a YouTube como Shorts (mismos videos que ya están en IG/TikTok). Es la mejor combinación de "fácil de configurar" + "carga rápido" + "sin estética de plataforma externa".

---

## Si eliges Local MP4

1. Descarga los videos (sin marca de agua):
   - Instagram: https://snapinsta.app/ o https://igram.io/
   - TikTok: https://snaptik.app/ (recomendado, sin watermark) o https://ssstik.io/
2. Comprime a 720p/1080p, H.264, idealmente < 8MB cada uno. Herramientas:
   - https://www.freeconvert.com/video-compressor
   - HandBrake (desktop): https://handbrake.fr/
3. Coloca los archivos en esta carpeta (`public/videos/`).
4. (Opcional) Genera un poster JPG con el mismo nombre: `workshop-1.jpg` (frame estática que se muestra mientras carga).
5. Edita `WORKSHOP_VIDEOS` con las rutas: `{ src: "/videos/workshop-1.mp4", poster: "/videos/workshop-1.jpg" }`.

## Si eliges YouTube Shorts

1. Sube cada video a YouTube como un **Short** (videos verticales bajo 60s aparecen automáticamente como Short).
2. Copia la URL pública del Short (`https://www.youtube.com/shorts/VIDEO_ID`).
3. Pégala en `WORKSHOP_VIDEOS`. Listo.

El componente detecta automáticamente que es YouTube y aplica:
- `autoplay=1&mute=1` (necesario por políticas del navegador)
- `loop=1` (el video se repite indefinidamente)
- `controls=0&modestbranding=1&rel=0` (sin controles, sin sugerencias al final, sin logo grande)

## Si eliges Instagram Reel o TikTok

Solo pega la URL del Reel/video. El componente extrae el ID y arma el iframe oficial automáticamente.

**Advertencia:** estos embeds traen la UI de la plataforma (caption, botones, "Ver en Instagram/TikTok"). No se integra al diseño del sitio. Útil como fallback rápido, no como solución final.

---

## Comportamiento del player

- **Local MP4**: auto-play silenciado, click para pausa/reanuda, controles de volumen y play visibles. Pasa al siguiente video cuando termina uno.
- **YouTube Shorts**: auto-play silenciado, loop infinito por video. Auto-rota cada ~25 segundos al siguiente.
- **Instagram/TikTok**: trae los controles propios del embed. Auto-rota cada ~25 segundos.
- **Indicadores de puntos** abajo (si hay más de un video) para saltar manualmente.
- **Si la lista está vacía**: muestra empty state con CTA a Instagram.

---

## Tips

- Aspect ratio del frame: 4:3 (horizontal). Los videos verticales (9:16, típicos de Reels/Shorts/TikToks) se ven con bordes laterales negros en el caso del iframe, o con `object-cover` en el caso local.
- Mantén cada video bajo 15 segundos para mejor engagement.
- Si tu video tiene texto importante, asegúrate de que esté en el centro del frame.
