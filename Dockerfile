FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV MONGODB_URI=mongodb://placeholder:27017/placeholder
ENV NEXTAUTH_SECRET=placeholder-secret-for-build-only-xxxxxxxxx
ENV AUTH_SECRET=placeholder-secret-for-build-only-xxxxxxxxx
ENV NEXTAUTH_URL=http://localhost:3000
ENV AUTH_URL=http://localhost:3000
ENV AUTH_TRUST_HOST=true
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "server.js"]
