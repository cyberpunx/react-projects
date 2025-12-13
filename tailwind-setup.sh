#!/usr/bin/env bash
set -euo pipefail

# Script: tailwind-setup.sh
# Uso: ./tailwind-setup.sh <CarpetaProyecto>
# Requisitos del usuario:
# 1) cd en la carpeta elegida
# 2) npm install tailwindcss @tailwindcss/vite
# 3) Editar vite.config.ts para añadir al inicio:
#      import tailwindcss from '@tailwindcss/vite'
# 4) Añadir tailwindcss() al array de plugins (idempotente)
# 5) Buscar index.css y añadir al inicio: @import "tailwindcss" (sin duplicar)

ROOT_DIR=$(pwd)

err() { echo "[ERROR] $*" >&2; exit 1; }
info() { echo "[INFO] $*"; }

if [[ ${#@} -ne 1 ]]; then
  err "Uso: $0 <nombre_carpeta_proyecto> (por ejemplo: 01-Elevator)"
fi

PROJECT_DIR="$ROOT_DIR/$1"

[[ -d "$PROJECT_DIR" ]] || err "No existe la carpeta: $PROJECT_DIR"

# Verificación mínima de proyecto React+Vite
[[ -f "$PROJECT_DIR/package.json" ]] || err "No se encontró package.json en $PROJECT_DIR"
[[ -f "$PROJECT_DIR/vite.config.ts" ]] || err "No se encontró vite.config.ts en $PROJECT_DIR (se requiere TS)"

info "Entrando a $PROJECT_DIR"
cd "$PROJECT_DIR"

info "Instalando dependencias con npm..."
npm install tailwindcss @tailwindcss/vite

VITE_CONFIG="vite.config.ts"

# 3) Añadir import al inicio si no existe
if ! grep -q "@tailwindcss/vite" "$VITE_CONFIG"; then
  info "Agregando import tailwindcss al inicio de $VITE_CONFIG"
  tmpfile=$(mktemp)
  {
    echo "import tailwindcss from '@tailwindcss/vite'" 
    cat "$VITE_CONFIG"
  } > "$tmpfile"
  mv "$tmpfile" "$VITE_CONFIG"
else
  info "Import de @tailwindcss/vite ya presente — omitido"
fi

# 4) Añadir tailwindcss() al array de plugins si no existe
if ! grep -q "tailwindcss\s*(" "$VITE_CONFIG"; then
  info "Inyectando tailwindcss() en plugins de $VITE_CONFIG"
  awk '
    BEGIN{inPlugins=0; inserted=0}
    function rtrim(s){ sub(/[[:space:]]+$/, "", s); return s }
    {
      line=$0
      # Caso 1: plugins en una sola línea: plugins: [ ... ]
      if (match(line, /plugins[[:space:]]*:[[:space:]]*\[[^\]]*\]/)) {
        before = substr(line, 1, RSTART-1)
        content = substr(line, RSTART, RLENGTH)
        after = substr(line, RSTART+RLENGTH)
        # Extraemos lo que hay entre [ y ]
        inner = content
        sub(/^[^\[]*\[/, "", inner)
        sub(/\][^\]]*$/, "", inner)
        trimmed = inner
        gsub(/^\s+|\s+$/, "", trimmed)
        if (trimmed == "") {
          newInner = "tailwindcss(),"
        } else {
          # Añadimos con coma separadora y dos espacios como en el ejemplo esperado
          newInner = inner
          if (inner ~ /,\s*$/) {
            newInner = inner "  tailwindcss(),"
          } else {
            newInner = rtrim(inner) ",  tailwindcss(),"
          }
        }
        gsub(/\[[^\]]*\]/, "[" newInner "]", content)
        print before content after
        inserted=1
        next
      }

      # Caso 2: plugins multilínea – activar estado hasta cerrar corchete
      if (inPlugins==0 && line ~ /plugins[[:space:]]*:[[:space:]]*\[/) {
        inPlugins=1
        print line
        next
      }
      if (inPlugins==1) {
        # Antes de la línea que cierra el array, insertamos el plugin si no se ha insertado
        if (line ~ /\]/ && inserted==0) {
          # calcular indentación de la línea actual
          match(line, /^[[:space:]]*/)
          indent = substr(line, RSTART, RLENGTH)
          print indent "  tailwindcss(),"
          print line
          inserted=1
          inPlugins=0
          next
        }
        print line
        # Si por alguna razón detectamos cierre sin insertar
        if (line ~ /\]/) { inPlugins=0 }
        next
      }
      print line
    }
    END{
      # Nada que hacer aquí; si no insertamos, el script comprobará luego
    }
  ' "$VITE_CONFIG" > "$VITE_CONFIG.tmp" && mv "$VITE_CONFIG.tmp" "$VITE_CONFIG"

  if grep -q "tailwindcss\s*(" "$VITE_CONFIG"; then
    info "Plugin tailwindcss() agregado correctamente"
  else
    err "No se pudo inyectar tailwindcss() en plugins. Revisa el formato de $VITE_CONFIG"
  fi
else
  info "plugins ya contiene tailwindcss() — omitido"
fi

# 5) Buscar index.css y añadir @import "tailwindcss" al inicio (sin duplicar)
info "Buscando index.css..."

INDEX_CSS=""
if [[ -f src/index.css ]]; then
  INDEX_CSS="src/index.css"
elif [[ -f index.css ]]; then
  INDEX_CSS="index.css"
else
  # Buscar la primera coincidencia, excluyendo node_modules/dist
  # shellcheck disable=SC2010
  INDEX_CSS=$(find . -type f -name "index.css" -not -path "*/node_modules/*" -not -path "*/dist/*" | head -n 1 || true)
fi

if [[ -z "$INDEX_CSS" ]]; then
  err "No se encontró un archivo index.css en el proyecto"
fi

info "Usando $INDEX_CSS"

if grep -q "@import \"tailwindcss\";" "$INDEX_CSS"; then
  info "@import \"tailwindcss\" ya existe — omitido"
else
  info "Añadiendo @import \"tailwindcss\" al inicio de $INDEX_CSS"
  tmpfile=$(mktemp)
  {
    echo "@import \"tailwindcss\";"
    cat "$INDEX_CSS"
  } > "$tmpfile"
  mv "$tmpfile" "$INDEX_CSS"
fi

info "✅ Configuración de Tailwind finalizada en $PROJECT_DIR"
