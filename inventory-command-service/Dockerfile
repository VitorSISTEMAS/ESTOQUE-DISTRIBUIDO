FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json tsconfig*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
EXPOSE 3001
CMD ["npm", "start"]
