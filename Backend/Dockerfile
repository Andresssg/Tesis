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

# Copia el archivo .env
COPY ./.env ./.env

# Copia el archivo de configuración de Gunicorn
COPY ./conf/gunicorn_config.py ./gunicorn_config.py

# Copia el archivo requirements.txt
COPY ./requirements.txt ./requirements.txt

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

#RUN python manage.py makemigrations

#RUN python manage.py migrate

RUN pip install gunicorn

# Copia todo el contenido de la carpeta Backend a /backend
COPY . .

# Ejecuta el servidor de Django con Gunicorn y el archivo de configuración
CMD ["gunicorn", "-c", "./gunicorn_config.py", "tesis_project.wsgi:application"]