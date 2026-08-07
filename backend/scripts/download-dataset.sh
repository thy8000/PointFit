#!/bin/bash
# Baixa o Exercise Dataset (JSON + imagens WebP) para o backend
set -euo pipefail

DATASET_URL="${DATASET_URL:-https://exercise-dataset.com/exercises.json}"
REPO_ZIP="https://github.com/sergei-argutin/exercise-dataset/archive/refs/heads/main.zip"
TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📥 Baixando exercise-dataset (JSON)..."
curl -L --fail "$DATASET_URL" -o "$TARGET_DIR/src/modules/exercises/data/exercises.json"

echo "📥 Baixando imagens do dataset (ZIP)..."
curl -L --fail "$REPO_ZIP" -o /tmp/exercise-dataset.zip

echo "🗜️ Extraindo apenas images/flat..."
rm -rf /tmp/exercise-dataset-main
unzip -q /tmp/exercise-dataset.zip -d /tmp
mkdir -p "$TARGET_DIR/src/modules/exercises/data/images"
cp -r /tmp/exercise-dataset-main/images/flat/. "$TARGET_DIR/src/modules/exercises/data/images/"

rm -rf /tmp/exercise-dataset.zip /tmp/exercise-dataset-main
echo "✅ Download concluído!"
