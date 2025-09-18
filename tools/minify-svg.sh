#!/usr/bin/env bash
# Minify all SVGs under images/og using svgo when available; fallback to copying.
# Usage: bash tools/minify-svg.sh
set -euo pipefail
DIR="images/og"
if command -v svgo >/dev/null 2>&1; then
  svgo --version
  svgo -f "$DIR" --config='{"plugins":[{"name":"removeViewBox","active":false},{"name":"removeDimensions","active":false}]}'
  echo "SVGs minificados en $DIR"
else
  echo "svgo no está instalado. Saltando minificado (fallback)." >&2
fi