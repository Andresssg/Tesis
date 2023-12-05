# Dockerfile para el backend Django
FROM python:3.9
ENV PYTHONUNBUFFERED=1

WORKDIR /backend

# Instala las dependencias de OpenCV
RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Actualiza pip y luego instala algunas dependencias de Python
RUN pip install --upgrade pip && \
    pip install numpy==1.22.4 && \
    pip install opencv-python==4.7.0.72

# Copia el archivo requirements.txt
COPY ./requirements.txt ./requirements.txt

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Instala Gunicorn
RUN pip install gunicorn

RUN pip install mysql-connector-python

RUN apt-get update && apt-get install -y gettext-base

# Copia el archivo de configuración de Gunicorn
COPY ./conf/gunicorn_config.py ./gunicorn_config_template.py

# Copia todo el contenido de la carpeta Backend a /backend
COPY . .

# Copia el archivo .env
COPY .env .env