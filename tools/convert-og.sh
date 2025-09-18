#!/usr/bin/env bash
# Convert OG SVGs to optimized JPG (1200x630, quality 85) using ImageMagick
# Requirements: ImageMagick installed and available in PATH (convert / magick)
# Usage (from repo root in Git Bash or WSL):
#   bash tools/convert-og.sh [QUALITY]

set -euo pipefail
SRC_DIR="images/og"
OUT_DIR="images/og"
QUALITY=${1:-85}
WIDTH=1200
HEIGHT=630

# Detectar ImageMagick (preferir 'magick' en Windows para evitar conflicto con convert.exe del sistema)
IM_CMD=""
if command -v magick >/dev/null 2>&1; then
  IM_CMD="magick"
elif command -v convert >/dev/null 2>&1; then
  IM_CMD="convert"
else
  echo "ImageMagick no encontrado. Instalalo y asegurate que 'magick' (Windows) o 'convert' esté en PATH." >&2
  exit 1
fi

convert_svg() {
  local svg="$1"
  local base
  base="${svg%.svg}"
  local jpg="${base}.jpg"
  # Rasterizar SVG a 1200x630. Fondo blanco si hay transparencia. Centrar y recortar para mantener 1200x630 exacto.
  # Nota: con 'magick', la forma recomendada es: magick input.svg [ops] output.jpg
  if [ "$IM_CMD" = "magick" ]; then
    magick -density 192 "${svg}" \
      -background white -alpha remove -alpha off \
      -resize ${WIDTH}x${HEIGHT}^ -gravity center -extent ${WIDTH}x${HEIGHT} \
      -quality ${QUALITY} "${jpg}"
  else
    convert -density 192 "${svg}" \
      -background white -alpha remove -alpha off \
      -resize ${WIDTH}x${HEIGHT}^ -gravity center -extent ${WIDTH}x${HEIGHT} \
      -quality ${QUALITY} "${jpg}"
  fi
  echo "Creado: ${jpg}"
}

shopt -s nullglob
count=0
for svg in "${SRC_DIR}"/*.svg; do
  convert_svg "$svg"
  count=$((count+1))
done
shopt -u nullglob

if [ $count -eq 0 ]; then
  echo "No se encontraron SVGs en ${SRC_DIR}." >&2
else
  echo "Listo. ${count} archivo(s) JPG generados en ${OUT_DIR}."
fi