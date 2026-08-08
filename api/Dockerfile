# ---- Stage 1 : Dependencies ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ---- Stage 2 : Minimal Secure Runtime ----
FROM node:22-alpine

# Patch des librairies OS Alpine (OpenSSL / libcrypto)
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copie des dependances de production et du code
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Suppression du binaire npm en runtime pour eliminer toute surface d'attaque et failles npm
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /root/.npm

# Securite : utilisateur non-root
USER node

EXPOSE 3000

CMD ["node", "index.js"]


