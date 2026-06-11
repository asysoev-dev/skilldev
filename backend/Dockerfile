FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY dist ./dist

RUN npm ci --only=production

RUN npx prisma generate

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]