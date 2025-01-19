# Use uma imagem base para o build do Angular
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildProduct
RUN npm run build --prod

# Use uma imagem base para o servidor
FROM nginx:alpine
COPY --from=build /app/dist/cloudonix-store/browser /usr/share/nginx/html
#COPY --from=build /app/dist/product/browser /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expor a porta 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
