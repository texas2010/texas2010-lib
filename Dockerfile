FROM node:22

WORKDIR /apps/backend-project/
RUN npm install --global fastify-cli
RUN fastify generate . --esm --lang=typescript --integrate
RUN npm install

WORKDIR /apps/frontend-project/
RUN npm create vite@latest . -- --template react-ts
RUN npm install

WORKDIR /apps/base

COPY package.json package-lock.json ./
RUN npm ci

COPY vitest.config.ts tsconfig.* ./
COPY src/ ./src/
COPY integration/ ./integration/

CMD ["npm","run","test:integration:watch"]