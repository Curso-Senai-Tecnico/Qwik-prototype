FROM node:20-alpine AS builder

WORKDIR /react-vite-app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM docker.io/library/nginx:alpine

COPY --from=builder /react-vite-app/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]