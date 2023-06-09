from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from datetime import datetime

import cv2
import base64
import io
from PIL import Image

from django.conf import settings
import os

@api_view(['POST'])
def video_upload_view(request):
    park_name = request.data.get('parkname')
    if 'video' not in request.FILES or not park_name:
        return Response({'error': 'No se proporcionaron los datos completos'}, status=400)

    file_obj = request.FILES['video']
    file_name = generate_unique_filename(file_obj.name, park_name)

    # Validar si el archivo es un video
    if not is_video(file_obj):
        return Response({'error': 'El archivo no es un video válido.'}, status=400)

    file_path = default_storage.save(f'videos/{file_name}', file_obj)
    low_fps_video = reduce_fps(file_path, file_name, 8)
    first_frame = extract_first_frame(file_path)

    # Puedes realizar otras acciones con el archivo si es necesario,
    # como guardar información en una base de datos o procesar el video.

    return Response({'file_path': file_path, 'park_name': park_name, 'file_name':file_name,'first_frame': first_frame})


def is_video(file):
    mime_type = file.content_type
    return mime_type.startswith('video/')

def generate_unique_filename(original_name, park_name):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename, extension = original_name.rsplit('.', 1)
    return f'{park_name}_{timestamp}.{extension}'

def extract_first_frame(video_path):
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()

    # Verifica si se pudo leer el frame correctamente
    if ret:
        # Convierte el frame a formato de imagen PIL
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(frame_rgb)

        # Crea un objeto BytesIO para almacenar la imagen en memoria
        image_buffer = io.BytesIO()

        # Guarda la imagen en el objeto BytesIO en formato JPEG
        image_pil.save(image_buffer, format='JPEG')

        # Codifica la imagen en base64
        encoded_image = base64.b64encode(image_buffer.getvalue()).decode('utf-8')

        # Cierra el video
        cap.release()

        # Devuelve la imagen codificada en base64
        return encoded_image
    else:
        # No se pudo leer el primer frame, maneja el caso de error
        cap.release()
        raise ValueError("No se pudo leer el primer frame del video.")

def reduce_fps(original_video_path, video_name, num_fps):
    video = cv2.VideoCapture(original_video_path)

    # Obtiene el FPS actual del video
    fps = video.get(cv2.CAP_PROP_FPS)

    # Obtiene las dimensiones del video
    ancho = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    alto = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Obtiene la ruta completa de la carpeta "low"
    low_video_path = os.path.join(default_storage.base_location, 'videos', 'low')

    # Crea la carpeta "low" si no existe
    os.makedirs(low_video_path, exist_ok=True)

    new_video_path = f'{low_video_path}/low_{video_name}'

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(new_video_path, fourcc, num_fps, (ancho, alto))


    # Calcula la relación para reducir los FPS
    relacion_fps = int(fps / num_fps)

    # Inicializa contador de frames
    contador_frames = 0

    while True:
        # Lee un frame del video
        ret, frame = video.read()

        if not ret:
            break

        if contador_frames % relacion_fps == 0:
            out.write(frame)

        contador_frames += 1

    # Libera los recursos
    video.release()
    out.release()