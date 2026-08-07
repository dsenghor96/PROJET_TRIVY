FROM node:20-alpine

# Patch des librairies de base de l'OS Alpine (OpenSSL / libcrypto)
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Mise a jour de npm et installation des dependances de production
COPY package*.json ./
RUN npm install -g npm@latest && npm ci --only=production && rm -rf /root/.npm

COPY . .

# Securite : utilisateur non-root
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "index.js"]

