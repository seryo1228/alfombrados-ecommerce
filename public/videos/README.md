# Videos del Taller

Esta carpeta sirve videos para la sección "Más que Alfombras, un Proyecto Social" del landing.

## Cómo agregar videos desde Instagram

1. **Descarga los videos de Instagram** (usa cualquier descargador de Reels/posts; los videos son tuyos).
2. **Conviértelos a MP4** si no lo están ya (la mayoría ya vienen en MP4).
3. **Comprímelos** a 720p o 1080p, H.264, idealmente bajo 8MB cada uno. Puedes usar:
   - https://www.freeconvert.com/video-compressor
   - HandBrake (desktop): https://handbrake.fr/
4. **Coloca los archivos aquí**, por ejemplo:
   - `public/videos/workshop-1.mp4`
   - `public/videos/workshop-2.mp4`
   - `public/videos/workshop-3.mp4`
5. **(Opcional) Genera un poster JPG** para cada video. Es una imagen estática que se muestra mientras carga:
   - `public/videos/workshop-1.jpg`
   - `public/videos/workshop-2.jpg`
6. **Edita la lista** en `src/app/[locale]/page.tsx` — busca la constante `WORKSHOP_VIDEOS` y descomenta las líneas:

```ts
const WORKSHOP_VIDEOS: { src: string; poster?: string }[] = [
  { src: "/videos/workshop-1.mp4", poster: "/videos/workshop-1.jpg" },
  { src: "/videos/workshop-2.mp4", poster: "/videos/workshop-2.jpg" },
  { src: "/videos/workshop-3.mp4", poster: "/videos/workshop-3.jpg" },
];
```

7. Hace `git add public/videos/ src/app/[locale]/page.tsx`, commit y push.

## Comportamiento

- **Auto-play silenciado** (necesario por políticas del navegador).
- **Click sobre el video** = pausa/reanuda.
- **Botón de volumen** en la esquina = activar/desactivar sonido.
- **Auto-rotación**: cuando termina un video, pasa al siguiente.
- **Indicadores** debajo del video para saltar entre clips.
- **Fallback**: si no hay videos cargados, muestra una empty state con link a Instagram.

## Tips

- Aspect ratio del frame: 4:3 (horizontal). Los videos verticales (9:16, típicos de Reels) se recortarán al centro. Si quieres preservar el aspect ratio vertical original, pega los videos con bordes laterales del color de marca.
- Mantén cada video bajo 15 segundos para mejor engagement.
- Si tu video tiene texto/subtítulos importantes, asegúrate de que quede en el centro del frame (porque se aplica `object-cover`).
