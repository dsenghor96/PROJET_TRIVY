#!/bin/bash
set -euo pipefail

# ==============================================================================
# fix-npm-vulns.sh — Corrige les 3 vulnerabilites HIGH trouvees par
# trivy fs sur api/ et ux_react/ (voir scan du 2026-07-24)
# ==============================================================================

PROJECT_DIR="/mnt/c/Users/DIEY-NA/desktop/PROJET_TRIVY"

echo ">>> Correction backend (api/) : multer CVE-2026-5079"
cd "${PROJECT_DIR}/api"
npm install multer@2.2.0

echo ""
echo ">>> Correction frontend (ux_react/) : axios GHSA-gcfj-64vw-6mp9, form-data CVE-2026-12143"
cd "${PROJECT_DIR}/ux_react"
npm install axios@1.18.0 form-data@4.0.6

echo ""
echo ">>> Termine. Verification recommandee :"
echo "    cd ${PROJECT_DIR} && docker run --rm -v ${PROJECT_DIR}:/scan -v trivy-cache:/root/.cache/trivy aquasec/trivy fs --severity HIGH,CRITICAL --skip-db-update /scan"
