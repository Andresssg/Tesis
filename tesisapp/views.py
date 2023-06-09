from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from datetime import datetime

@api_view(['POST'])
def video_upload_view(request):
    park_name = request.data.get('parkname')
    print(park_name)
    if 'video' not in request.FILES or not park_name:
        return Response({'error': 'No se proporcionaron los datos completos'}, status=400)

    file_obj = request.FILES['video']
    file_name = generate_unique_filename(file_obj.name)

    # Obtener el nombre del parque desde la solicitud

    # Validar si el archivo es un video
    if not is_video(file_obj):
        return Response({'error': 'El archivo no es un video válido.'}, status=400)

    file_path = default_storage.save(f'videos/{file_name}', file_obj)

    # Puedes realizar otras acciones con el archivo si es necesario,
    # como guardar información en una base de datos o procesar el video.

    return Response({'file_path': file_path, 'park_name': park_name})


def is_video(file):
    mime_type = file.content_type
    return mime_type.startswith('video/')

def generate_unique_filename(original_name):
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    filename, extension = original_name.rsplit('.', 1)
    return f'{filename}_{timestamp}.{extension}'