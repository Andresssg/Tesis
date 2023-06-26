from django.contrib import admin
from django.urls import path
from tesisapp.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('upload/', video_upload_view, name='upload_video'),
    path('detect/', detect_people, name='detect_people'),
    path('download', download_video, name='download_video'),
]