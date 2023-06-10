from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from datetime import datetime

import cv2
import base64
import io
from PIL import Image

import os
import cv2
from ultralytics import YOLO
import supervision as sv

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

    return Response({'park_name': park_name, 'file_name':file_name,'first_frame': first_frame})

@api_view(['POST'])
def detect_people(request):
    video_name = request.data.get('videoname')
    start_point = request.data.get('start')
    end_point = request.data.get('end')
    if not start_point or not end_point or not video_name:
        return Response({'error': 'No se proporcionaron los datos completos'}, status=400)
    if not len(start_point)==2 or not len(end_point)==2:
        return Response({'error': 'No se proporcionaron los puntos completos'}, status=400)
    
    low_fps_video_path = create_path(verify_directory('low'),f'low_{video_name}')
    dir_path_out = verify_directory('out')
    video_path_out = create_path(dir_path_out, f'out_{video_name}')

    cap = cv2.VideoCapture(low_fps_video_path)
    total_frame = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    ret, frame = cap.read()
    H, W, _ = frame.shape
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_path_out, fourcc, int(cap.get(cv2.CAP_PROP_FPS)), (W, H))

    box_annotator = sv.BoxAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5
    )
    START = sv.Point(start_point[0], start_point[1])
    END = sv.Point(end_point[0], end_point[1])
    
    #Se definen los estilos de la linea y se colocan los puntos inicial y final
    line_zone = sv.LineZone(start=START, end=END)

    line_zone_annotator = sv.LineZoneAnnotator(
        thickness=2,
        text_thickness=1,
        text_scale=0.5,
    )

    frame_count = 0
    last_printed = -1

    #Se importa el modelo 
    model = YOLO("yolov8n.pt")

    #Se itera cada frame del video
    for result in model.track(source=low_fps_video_path, stream=True, verbose=False, classes=0):
        percentage = round(frame_count / total_frame * 100)
        if percentage % 1 == 0 and percentage != last_printed:
            print(f"{percentage}%")
            last_printed = percentage

        #Se obtiene el frame
        frame = result.orig_img
        #Se obtienen las coordenadas y toda la informacion asociada a la deteccion
        detections = sv.Detections.from_yolov8(result)
        
        if result.boxes.id is not None:
            detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)

        labels = [
            f"{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
            for _, confidence, class_id, tracker_id
            in detections
        ]

        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
        
        line_zone.trigger(detections=detections)
        line_zone_annotator.annotate(frame=frame, line_counter=line_zone)

        out.write(frame)

        frame_count += 1
        
    print("In: ", line_zone.in_count)
    print("Out: ",line_zone.out_count)

    out.release()
    cap.release()

    return Response({'video_name':video_name, 'start_point':start_point, 'end_point':end_point})

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

        cap.release()

        return encoded_image
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

def verify_directory(directory_name):
    video_path = os.path.join(default_storage.base_location, 'videos', directory_name)
    os.makedirs(video_path, exist_ok=True)
    return video_path

def create_path(path, file_name):
    file_path = os.path.join(path, file_name)
    return file_path
