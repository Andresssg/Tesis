import logging
import torch
from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage

import json
import mimetypes
from .utils import *

from .serializer import *
from .models import *
from .available_models import MODELS
from fixed_bugs.PartialLines import LineZoneFixed

@api_view(['GET'])
def get_park_list(request):
    parks = Parks.objects.using('parks').all()
    serializer = ParksSerializer(parks, many=True)
    return Response({'length':len(serializer.data), 'parks': serializer.data}, status=200)

@api_view(['POST'])
def video_upload_view(request):
    park_name = request.data.get('parkname')
    if 'video' not in request.FILES or not park_name:
        return Response({'error': 'No se proporcionaron los datos completos'}, status=400)

    file_obj = request.FILES['video']
    video_name = generate_unique_filename(file_obj.name, park_name)

    # Validar si el archivo es un video
    if not is_video(file_obj):
        return Response({'error': 'El archivo no es un video válido.'}, status=400)
    
    #Validar la duracion del video
    max_length = 1200 #20 mins
    length = int(request.data.get('duration'))
    if length > max_length:
        max_length_in_mins = round(max_length / 60, 2)
        return Response({'error': f'El video supera el limite de {max_length_in_mins} mins.'}, status=400)

    file_path = default_storage.save(f'videos/{video_name}', file_obj)
    low_fps_video = reduce_fps(file_path, video_name, 8)
    first_frame = extract_first_frame(file_path)

    return Response({'park_name': park_name, 'video_name':video_name,'first_frame': first_frame })

@api_view(['GET'])
def download_video(request):
    video_name = request.GET.get('video_name')
    if not video_name:
        return Response({'error': 'No se proporcionó el nombre del video.'})
    
    out_video_name = f"out_{video_name}"

    dir_path = verify_directory('out')
    video_path = create_path(dir_path,out_video_name)

    mime_type, _ = mimetypes.guess_type(video_path)

    try:
        #Abre el video en modo lectura y en binario 'rb'->'readbinary'
        with open(video_path, 'rb') as video_file:
            video_file = open(video_path, 'rb')
            response = FileResponse(video_file, content_type=mime_type)
            response['Content-Disposition'] = f'attachment; filename="{video_name}"'
            return response
    except FileNotFoundError:
        return Response({'error':'El video no existe'},status=404)

@api_view(['POST'])
def detect_people(request):
    video_name = request.data.get('video_name')
    start_point = request.data.get('start')
    end_point = request.data.get('end')
    park_name = f"{request.data.get('park_name')}".upper()
    record_date = request.data.get('record_date')
    comments = request.data.get('comments')
    selected_model = request.data.get('model')
    is_partial = request.data.get('partial')

    if not start_point or not end_point or not video_name or not park_name or not record_date or not comments or not selected_model:
        return Response({'error': 'No se proporcionaron los datos completos'}, status=400)
    if not len(start_point)==2 or not len(end_point)==2:
        return Response({'error': 'No se proporcionaron los puntos completos'}, status=400)
    try:
        low_fps_video_path = create_path(verify_directory('low'),f'low_{video_name}')
        dir_path_out = verify_directory('out')
        video_path_out = create_path(dir_path_out, f'out_{video_name}')

        cap = cv2.VideoCapture(low_fps_video_path)
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        ret, frame = cap.read()
        H, W, _ = frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(video_path_out, fourcc, fps, (W, H))

        box_annotator = sv.BoxAnnotator(
            thickness=1,
            text_thickness=1,
            text_scale=0.5
        )
        START = sv.Point(start_point[0], start_point[1])
        END = sv.Point(end_point[0], end_point[1])

        #Se selecciona entre las lineas si es parcial o no
        if is_partial:
            line_zone = LineZoneFixed(start=START, end=END)
        else:
            line_zone = sv.LineZone(start=START, end=END)

        #Se definen los estilos de la linea
        line_zone_annotator = sv.LineZoneAnnotator(
            thickness=2,
            text_thickness=1,
            text_scale=0.5,
        )

        #Se importa el modelo 
        new_model = MODELS['COCO'] if MODELS.get(selected_model) == None else MODELS[selected_model]
        model = YOLO(new_model)

        #Verificar si usar la CPU o GPU
        device = None
        if torch.cuda.is_available():
            default_device_id = torch.cuda.current_device()
            device=default_device_id
            print(f"ID de la GPU predeterminada: {default_device_id}")
        else:
            device='cpu'
            print('Usando CPU. CUDA no disponible.')

        #Se itera cada frame del video
        for result in model.track(source=low_fps_video_path, stream=True, verbose=False, classes=0, devices=device):

            #Se obtiene el frame
            frame = result.orig_img
            #Se obtienen las coordenadas y toda la informacion asociada a la deteccion
            detections = sv.Detections.from_yolov8(result)

            if result.boxes.id is not None:
                detections.tracker_id = result.boxes.id.cpu().numpy().astype(int)

            labels = [
                f"{model.model.names[class_id]} {tracker_id}"
                for _, confidence, class_id, tracker_id
                in detections
            ]

            frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)

            line_zone.trigger(detections=detections)
            line_zone_annotator.annotate(frame=frame, line_counter=line_zone)

            out.write(frame)

        print("In: ", line_zone.in_count)
        print("Out: ",line_zone.out_count)

        out.release()
        cap.release()

        save = {
            'video_name': video_name,
            'park_name': park_name,
            'record_date': record_date,
            'comments' : comments,
            'hour_grabation': record_date[11:19]
        }
        respuesta = save_in_db(save, line_zone.in_count, line_zone.out_count)

        if respuesta[0] == "400":
            return Response(respuesta[1].errors, status=400)
        chart = create_chart_parkname(park_name)
        chart_hour = create_chart_hour(park_name, record_date)

        charts = [chart, chart_hour]
        return Response({'conteo':respuesta[1].data,'reportes':respuesta[2].data,'charts':charts}, status=201)
    except Exception as e:
        logging.error(e)
        return Response({'error':'Se ha generado un error al analizar el video.'}, status=500)