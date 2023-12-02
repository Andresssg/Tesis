# Dockerfile para el frontend React
FROM node:18 AS build

WORKDIR /frontend

# Copia todo el contenido de la carpeta Frontend a /frontend
COPY Frontend/ .

RUN npm install
RUN npm run build

FROM nginx:1.18.0-alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /frontend/dist /usr/share/nginx/html