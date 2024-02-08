
# CESP

Este repositorio contiene los archivos del proyecto de grado, además de una descripción de como realizar el despliegue de la aplicación.




## ⚙️ Variables de entorno.

Para que el proyecto pueda usarse, es necesario definir las siguientes variables de entorno dentro de la carpeta raiz, Frontend y Backend en un archivo llamado .env

`ENVIRONMENT`-> **Variable para definir si el entorno es de _development_ o _production_**

`BACKEND_PORT`-> **# Puerto del backend**

`FRONTEND_PORT`-> **# Puerto del frontend**

`VOLUME_BACKEND_SOURCE`-> **Caperta en la máquina local donde se guardan los videos**

`VOLUME_BACKEND_TARGET='/backend/videos'`-> **Carpeta videos contenedor (default)**

`NGINX_UPSTREAM='backend'`-> **Nombre servicio docker(No editar)**

`NETWORK_BACKEND=$NGINX_UPSTREAM:$BACKEND_PORT`-> **Red contenedores docker(No editar)**

`VITE_ENVIRONMENT=$ENVIRONMENT`-> **Entorno de VITE(No editar)**

`VITE_BASE_URL_DEV=http://localhost:$FRONTEND_PORT/api`-> **URL de desarrollo(No editar)**

`VITE_BASE_URL_PROD=http://localhost:$FRONTEND_PORT/api`-> **URL de producción(No editar)**

`SECRET_KEY`-> **Key de django**

`GUNICORN_COMMAND='gunicorn'`-> **Comando de inicio(No editar)**

`GUNICORN_PYTHONPATH='/backend/tesis_project'`-> **Ubicación del proyecto django dentro del contenedor(No editar)**

`GUNICORN_BIND_IP='0.0.0.0'`-> **IP expuesta gunicorn(No editar)**

`GUNICORN_TIMEOUT='1000'`-> **Tiempo de espera(No editar)**

`DATABASE_HOST`-> **Host de la base de datos**

`DATABASE_DEFAULT_NAME`-> **Nombre DB principal**

`DATABASE_SECOND_NAME`-> **Nombre DB parques**

`DATABASE_USER`-> **Usuario DB**

`DATABASE_PASSWORD`-> **Contaseña DB**

`DATABASE_ROOT_PASSWORD`-> **Contraseña root DB**

`DATABASE_PORT`-> **Puerto DB**

`CERTIFICATE_NAME`-> **Ruta del certificado(depende de la configuración de la DB)**

`VOLUME_DATABASE_TESIS`-> **Caperta en la máquina local donde se guardan los archivos de la DB**

`Nota: Si se cambian los nombres de las bases de datos, se debe modificar el archivo ./Database/init.sql y colocar los mismos nombres ahí.`
## 🐋 Depliegue con docker

Para desplegar el proyecto en contenedores de docker es necesario contar con docker instalado en la máquina.

Se tienen dos archivos docker compose:
- **docker-compose.yml**: Archivo de configuración para usar la CPU para realizar el procesamiento.

- **docker-compose-gpu.yml**: Archivo de configuración para usar la GPU para realizar el procesamiento.

Se debe ejecutar el comando 
```bash 
docker compose -f ruta/al/archivo.yml up -d
```
Luego en la consola se puede el estado de los contenedores.

## 🚀 Depliegue en development (local)

Para desplegar el proyecto para desarrollo es necesario tener instalado `MySQL`, `python`, `Nodejs`.

### 🗄️ Database
Se debe contar con MySQL server instalado o en su defecto una base de datos en la nube. y crear las respectivas tablas

### 🛠️ Backend
Se debe contar con un entorno virtual de python ya sea `Anaconda`, `Miniconda`, `VENV`, entre otros. Ubicarse en la carpeta del backend y ejecutar el comando a continuacion para instalar las dependencias.

```bash
pip install --no-cache-dir numpy
pip install --no-cache-dir -r requirements.txt
```

Para realizar las migraciones y creacion de tablas en las bases de datos, se debe ejecutar los siguientes comandos.
```bash
python manage.py makemigrations

python manage.py migrate

python manage.py migrate --database=nombre_db_default

python manage.py migrate --database=nombre_db_secundaria

```

Luego se debe ejecutar el siguiente comando para iniciar el servidor de `DJANGO` y tener disponible el backend.

```bash
python manage.py runserver
```

### 🌐 Frontend
Inicialmente hay que estar ubicado en la ruta de la carpeta frontend. Luego para instalar las dependencias es necesario ejecutar el comando acontinuación.

```bash
npm install
```
Despues se debe ejecutar el comando a continuación, esto levanta el entorno de desarrollo para el frontend con react. Al visitar la url `http://localhost:puerto` se podrá visualizar la aplicación en ejecución.
```bash
npm run dev
```
## 📗 API Reference

#### Obtener lista de parques

Este endpoint es el que envía la lista de parques directamente al cliente, para tener disponible esta información en el frontend. Este es la simulación de una conexión a una aplicación externa mediante una API

```http
  GET /api/getparks
```

#### Subir Video

Este endpoint cumple dos funciones, la primera es realizar la subida, es decir recibe un archivo de video para alojarlo en el servidor, además del nombre del parque que será analizado. Su segunda función es llevar a cabo la conversión del video a 8 FPS. Por último, da como respuesta el primer fotograma al cliente

```http
  POST /api/upload/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `parkname`      | `string` | **Required**. Nombre del parque que se está analizando |
| `video`      | `file` | **Required**. Archivo de video para analizar |

#### Analizar video

Este se encarga de analizar el video subido anteriormente en el servidor, es decir que este endpoint hace uso del módulo de conteo de personas creado anteriormente. Teniendo en cuenta lo anterior, se reciben siete datos, el nombre del parque, el nombre del video, fecha de grabación del video, observaciones o comentarios, modelo seleccionado, punto inicial y punto final.

Después de recibir esos datos, se usa el modelo seleccionado (Coco dataset o VisDrone) y también se ubica la línea con respecto a la información del punto inicial y el punto final para analizar el video proporcionado de 8 FPS, obteniendo así el número de personas que entran y salen del parque, luego esos datos son guardados en la DB, junto con la fecha y hora de grabación, fecha y hora de análisis, observaciones, nombre del parque y duración del video.

```http
  POST /api/detect/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `video_name`      | `string` | **Required**. Nombre del video. |
| `start`      | `array` | **Required**. Coordenads del punto inicial de la linea |
| `end`      | `array` | **Required**. Coordenadas del punto final de la linea |
| `park_name`      | `string` | **Required**. Nombre del parque |
| `record_date`      | `datetime` | **Required**. Fecha de grabación del video |
| `comments`      | `string` | **Required**. Observaciones acerca del video |
| `model`      | `string` | **Required**. Nombre del modelo a usar **(COCO, VisDrone)** |
| `partial`      | `boolean` | **Required**. Determina si la linea es parcial o no |

#### Descargar video analizado

Este endpoint envía el video analizado al cliente para almacenarlo de forma local y de esta manera poder visualizar las detecciones y el conteo de personas hecho por la IA.

```http
  GET /api/download?
```

| Parameter | Type     | Description                       | Ejemplo                       |
| :-------- | :------- | :-------------------------------- | :-------------------------------- |
| `video_name`      | `string` | **Required**. Nombre del video a descargar | video_20230512113356.mp4 |



## 🙏 Acknowledgements
<div>
  <a href="https://github.com/ultralytics/ultralytics" target="_blank" rel="noreferrer"><img src="https://assets-global.website-files.com/646dd1f1a3703e451ba81ecc/64777c3e071ec953437e6950_logo.svg" width="250" height="80" alt="Ultralytics" /></a>
  <a href="https://github.com/roboflow/supervision" target="_blank" rel="noreferrer"><img src="https://media.roboflow.com/open-source/supervision/rf-supervision-banner.png?updatedAt=1678995927529" width="350" height="80" alt="Supervision Roboflow" /></a>
</div>
