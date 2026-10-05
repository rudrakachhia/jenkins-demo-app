# ---- Test stage: the build fails here if tests fail ----
FROM node:20-alpine AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY app.js ./
COPY __tests__ ./__tests__
RUN npm test

# ---- Production image ----
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js ./
EXPOSE 3000
USER node
CMD ["node", "app.js"]
