FROM node:lts-alpine3.23 AS builder
WORKDIR /app/
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN  npm run build

FROM node:18-alpine
WORKDIR /app/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json


CMD ["npm", "run", "start:prod"]