# CTPAA 2027 · Lector digital

Versión ebook (HTML5) de los **Criterios Técnicos para la Programación Anual de Actividades y Servicios de Prestaciones Sociales Institucionales 2027** — Unidad de Prestaciones Sociales · Coordinación de Bienestar Social · IMSS.

## Funciones
- Tres modos de lectura: **Continua** (desplazamiento vertical), **Página** y **Libro** (doble página, con la portada a la derecha como un libro impreso).
- **Cambio de página animado**: en los modos Página y Libro la hoja se curva en 3D al avanzar o retroceder (flechas, teclado, clic sobre la mitad de la página o deslizar). Los saltos largos usan una transición breve. Se desactiva si el sistema pide reducir el movimiento.
- Índice navegable, miniaturas de las 98 páginas y **búsqueda de texto** (por clave, actividad o concepto; ignora acentos).
- El índice impreso (página 3) es clicable.
- Barra de avance segmentada por capítulo y área (Promoción de la Salud, Desarrollo Cultural, Cultura Física y Deporte, Capacitación).
- Enlaces directos a cualquier página: `…/index.html#p=44`.
- Recuerda la última página leída y el modo elegido.
- Teclado: ← → (cambiar página), Inicio/Fin, `/` (buscar), Ctrl + / Ctrl − (zoom). Gestos de deslizar en móvil.
- Botón **Descargar PDF** (documento original, 36 MB).
- Modo oscuro automático, diseño responsivo, texto accesible para lectores de pantalla.

## Estructura
```
index.html            Lector
assets/app.css        Estilos (paleta institucional, Noto Sans)
assets/app.js         Lógica del lector (sin dependencias)
assets/text.js        Texto por página (búsqueda y accesibilidad)
assets/favicon.svg
pages/p001…p098.webp  Páginas en alta resolución
thumbs/t001…t098.webp Miniaturas
pdf/CTPAA_2027.pdf    Documento original para descarga
.nojekyll
```

## Publicar en GitHub Pages
1. Crea un repositorio nuevo (p. ej. `ctpaa-2027`) y sube **todo el contenido de esta carpeta** a la raíz (incluido `.nojekyll`).
   - Desde la web: *Add file → Upload files* y arrastra las carpetas.
   - Desde terminal:
     ```bash
     git init && git add . && git commit -m "CTPAA 2027 ebook"
     git branch -M main
     git remote add origin https://github.com/USUARIO/ctpaa-2027.git
     git push -u origin main
     ```
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, rama `main`, carpeta `/ (root)` → *Save*.
3. En uno o dos minutos el ebook estará en `https://USUARIO.github.io/ctpaa-2027/`.

> El PDF pesa 36 MB, dentro del límite de 100 MB por archivo de GitHub.

## Actualizar el documento
Si cambia el PDF, regenera páginas y texto:
```bash
pdftoppm -r 190 -png CTPAA_2027.pdf tmp/p
# convertir a WebP (calidad 82) → pages/pNNN.webp y miniaturas 220 px → thumbs/tNNN.webp
# extraer texto por página con pdftotext → assets/text.js
```
Ajusta las páginas del índice en `TOC`, `SEGMENTS` y `HOTSPOTS` e incrementa `V` (versión de imágenes) dentro de `assets/app.js`, para que los navegadores no muestren páginas anteriores en caché.
