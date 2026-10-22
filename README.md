# redtapestudio.dev

Web de Red Tape Studios. GitHub Pages la construye con Jekyll: no hace falta compilar nada a mano.

## Estructura

| Ruta | Qué es |
|---|---|
| `_layouts/default.html` | Plantilla común: `<head>`, cabecera, pie y scripts. |
| `_includes/header.html`, `_includes/footer.html` | Cabecera (menú y botón ES/EN) y pie. |
| `_includes/icons/` | Iconos SVG (LinkedIn, X, Instagram, GitHub). |
| `_includes/notes/` | Avisos que una página puede poner sobre el pie (`footer_note`). |
| `_data/nav.yml` | Entradas del menú, con su texto en español e inglés. |
| `_data/social.yml` | Perfiles del estudio que salen en el pie. |
| `assets/css/site.css` | Estilos compartidos: colores, cabecera, botones, tarjetas, pie. |
| `assets/js/site.js` | Idioma, animación al hacer scroll, ampliar capturas y cabecera sobre fondo oscuro. |
| `index.html` + `assets/css/home.css` + `assets/js/home.js` | Portada del estudio. |
| `sale-a-devolver/` | Página del juego, con su `style.css` y sus imágenes. |

## Idiomas

Cada texto va dos veces, una con `lang="es"` y otra con `lang="en"`; solo se ve el idioma activo.
El idioma se elige con el botón ES/EN y se recuerda; la primera vez se toma el del navegador.

```html
<h2><span lang="es">Nuestros juegos</span><span lang="en">Our games</span></h2>
```

## Añadir una página (por ejemplo, otro juego)

1. Crea `nombre-del-juego/index.html` con esta cabecera:

   ```yaml
   ---
   layout: default
   title_es: Nombre | Red Tape Studios
   title_en: Name | Red Tape Studios
   description: Una frase para buscadores y redes.
   og_image: /nombre-del-juego/img/captura.webp
   styles:
     - /nombre-del-juego/style.css
   footer_note: fiction   # opcional: aviso de _includes/notes/fiction.html
   ---
   ```

2. Escribe el contenido con las clases compartidas (`section`, `section-title`, `card`, `grid`,
   `btn`, `reveal`…). Para ampliar una captura al pulsarla, usa `<button data-lightbox><img …></button>`.
3. Pon sus estilos propios en `nombre-del-juego/style.css`.
4. Enlázala desde la portada (`index.html`, sección «Nuestros juegos»).

## Probar en local

```bash
gem install jekyll
jekyll serve        # http://localhost:4000
```

La intro de la portada mueve el vídeo con el scroll; necesita un servidor que admita peticiones
por rangos (Jekyll y GitHub Pages sí). Los vídeos de `assets/video/` tienen un fotograma clave en
cada fotograma para que ir hacia atrás sea suave; si cambias la animación, vuelve a codificarlos así:

```bash
ffmpeg -i original.mp4 -an -vf "crop=760:720:260:0" -c:v libx264 -crf 28 -g 1 -pix_fmt yuv420p -movflags +faststart assets/video/logo-reveal.mp4
ffmpeg -i assets/video/logo-reveal.mp4 -an -c:v libvpx-vp9 -b:v 0 -crf 32 -g 1 assets/video/logo-reveal.webm
```
