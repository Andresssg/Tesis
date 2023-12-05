# Dockerfile para el frontend React
FROM node:18 AS build

WORKDIR /frontend

# Copia todo el contenido de la carpeta Frontend a /frontend
COPY Frontend/ .

COPY .env .env

RUN npm install
RUN npm run build

FROM nginx:latest

COPY ./nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=build /frontend/dist /usr/share/nginx/html