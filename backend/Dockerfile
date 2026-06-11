FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY dist ./dist

RUN npm ci --only=production
RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "sleep 5 && npx prisma migrate deploy && node dist/server.js"]