# Etapa 1: build do React
FROM node:20-alpine AS builder

WORKDIR /react-vite-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Etapa 2: servir a build com "serve"
FROM node:20-alpine

WORKDIR /app

# Instala o pacote serve globalmente
RUN npm install -g serve

# Copia a build
COPY --from=builder /react-vite-app/dist ./dist

# Porta que o Railway vai expor
EXPOSE $PORT

# Comando para rodar o servidor
CMD ["sh", "-c", "serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
