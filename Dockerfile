FROM node:20-alpine AS builder

# Instalar dependencias necesarias para Prisma en Alpine Linux
RUN apk add --no-cache openssl openssl-dev

WORKDIR /app
COPY package*.json . 
RUN npm ci

COPY . . 
# Regenerar el cliente Prisma con los binaryTargets correctos
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

FROM node:20-alpine

# Instalar OpenSSL en la imagen final también
RUN apk add --no-cache openssl

WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
# Importante: copiar también la carpeta .prisma generada
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma/
COPY ./prisma/ ./prisma
COPY package.json .

EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]