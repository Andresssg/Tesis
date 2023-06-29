from datetime import datetime
from datetime import time
import imghdr
import math

from django.db.models import Q
from moviepy.editor import VideoFileClip
import matplotlib.pyplot as plt
import numpy as np
from django.core.files.storage import default_storage

from .serializer import *

import os
import base64
import io

from PIL import Image

import cv2
from ultralytics import YOLO
import supervision as sv

def is_video(file):
    mime_type = file.content_type
    return mime_type.startswith('video/')

def generate_unique_filename(original_name, park_name):
    new_name = park_name.replace(" ", "-")
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename, extension = original_name.rsplit('.', 1)
    return f'{new_name}_{timestamp}.{extension}'

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
        image_format = imghdr.what(None, h=image_buffer.getvalue())
        image_base64 = f"data:{image_format};base64,{encoded_image}"
        cap.release()

        return image_base64
    else:
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
    low_video_path = verify_directory('low')

    new_video_path = create_path(low_video_path, f'low_{video_name}')

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

def save_in_db(save, line_zone_in_count, line_zone_out_count):

    data_request_conteos = {}
    data_request_conteos['ingreso_personas'] = line_zone_in_count
    data_request_conteos['salida_personas'] = line_zone_out_count

    serializer_conteo = ConteosSerializer(data=data_request_conteos)

    if not serializer_conteo.is_valid():
        return ["400", serializer_conteo]
    serializer_conteo.save()

    analysis_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    ultimo_conteo = Conteos.objects.latest('id_conteos')

    data_request_reportes = {}
    data_request_reportes['id_conteo_personas'] = ultimo_conteo.id_conteos
    data_request_reportes['fecha_hora_analisis'] = analysis_date
    data_request_reportes['fecha_grabacion'] = save["record_date"]
    data_request_reportes['parque'] = save["park_name"]
    data_request_reportes['observaciones'] = save["comments"]
    data_request_reportes['duracion'] = get_duration(save["video_name"])
    data_request_reportes['hora_grabacion'] = save["hour_grabation"]
    
    serializer_reportes = ReportesSerializer(data=data_request_reportes)
    if serializer_reportes.is_valid():
        serializer_reportes.save()
        return ["201", serializer_conteo,serializer_reportes]
    return ["400", serializer_reportes]

def verify_directory(directory_name):
    video_path = os.path.join(default_storage.base_location, 'videos', directory_name)
    os.makedirs(video_path, exist_ok=True)
    return video_path

def get_duration(video_name):
    videos_path = verify_directory('')
    video_path = create_path(videos_path,video_name)
    video_clip = VideoFileClip(video_path)
    total_duration = video_clip.duration
    seconds = total_duration % 60
    aux_minutes = math.floor(total_duration / 60 )
    minutes = math.floor(total_duration / 60 ) % 60
    hours = math.floor(aux_minutes / 60)
    duration = f'{f"0{hours}" if hours<10 else hours}:{f"0{minutes}" if minutes<10 else minutes}:{f"0{seconds}" if seconds<10 else seconds}'
    return duration

def create_path(path, file_name):
    file_path = os.path.join(path, file_name)
    return file_path

def create_chart_hour(park_name, record_date):
    grabation_hour = []
    ingresos = []
    salidas = []
    hora = []
    hora_grabacion = record_date[11:13]

    if int(hora_grabacion) < 12 and int(hora_grabacion)>= 6:
        hora = ["06:01:00","12:00:00"]
    elif int(hora_grabacion) > 12 and int(hora_grabacion) < 18:
        hora = ["12:01:00","18:00:00"]
    else:
        hora = ["18:01:00","06:00:00"]

    horaInicio = int(hora[0][0:2])
    minutoInicio = int(hora[0][3:5])

    horaFinal = int(hora[1][0:2])
    minutoFinal = int(hora[1][3:5])

    hora_inicio = time(horaInicio, minutoInicio)
    hora_final = time(horaFinal, minutoFinal)

    if horaInicio== 18:
        parques = Reportes.objects.filter(
                Q(hora_grabacion__gte=hora_inicio) | Q(hora_grabacion__lte=hora_final),
                parque__icontains=park_name,
                )
    else:
        parques = Reportes.objects.filter(
            parque__icontains=park_name,
            hora_grabacion__range=(str(hora_inicio), str(hora_final))
        )

    for reporte in parques:
        hour = reporte.hora_grabacion.hour
        conteo = reporte.id_conteo_personas
        ingresos.append(conteo.ingreso_personas)
        salidas.append(conteo.salida_personas)
        grabation_hour.append(hour)

    data = {}
    data['xlabel'] = "Hora"
    data['ylabel'] = "Cantidad de personas"
    data['title'] = f'Parque {park_name} - Ingresos y salidas, horario: {hora[0]} - {hora[1]}'
    data["data_x"] = grabation_hour
    data["data_bar1"] = ingresos
    data["data_bar2"] = salidas
    
    return paint_chart(data)
        
def create_chart_parkname(park_name):
    reportes_nombre_parque = Reportes.objects.filter(parque=park_name)
    fechas = []
    ingresos = []
    salidas = []

    for reporte in reportes_nombre_parque:
        conteo = reporte.id_conteo_personas
        fecha = f"{reporte.fecha_grabacion}"
        fecha = fecha.replace('+00:00', '')
        fechas.append(fecha)
        ingresos.append(conteo.ingreso_personas)
        salidas.append(conteo.salida_personas)

    data = {}
    data['xlabel'] = "Fecha y hora"
    data['ylabel'] = "Cantidad de personas"
    data['title'] = f'parque {park_name} - Ingresos y Salidas '
    data["data_x"] = fechas
    data["data_bar1"] = ingresos
    data["data_bar2"] = salidas

    return paint_chart(data)

def paint_chart(data):
    fig, ax = plt.subplots()
    bar_width = 0.15
    index = np.arange(len(data["data_x"]))
    ax.bar(index, data["data_bar1"], bar_width, label='Personas que ingresan', color ="green")
    ax.bar(index + bar_width, data["data_bar2"], bar_width, label='Personas que salen', color ="red")

    ax.set_xlabel(data['xlabel'])
    ax.set_ylabel(data['ylabel'])
    ax.set_title(data['title'])

    ax.set_xticks(index + bar_width / 2)
    ax.set_xticklabels(data['data_x'], rotation=45, ha='right')
    ax.legend()
    plt.tight_layout()

    chart_buffer = io.BytesIO()
    plt.savefig(chart_buffer, format='png')
    chart_buffer.seek(0)

    encoded_image = base64.b64encode(chart_buffer.getvalue()).decode('utf-8')
    image_format = imghdr.what(None, h=chart_buffer.getvalue())
    image_base64 = f"data:{image_format};base64,{encoded_image}"
    return image_base64