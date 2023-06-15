from django.db import models
from django.utils import timezone
import pytz

# Create your models here.
class Conteos(models.Model):
    id_conteos = models.AutoField(primary_key = True)
    ingreso_personas = models.IntegerField()
    salida_personas = models.IntegerField()
    
    def __str__(self):
        return self.id_conteos
    
class Reportes(models.Model):
    id_reportes = models.AutoField(primary_key = True)
    id_conteo_personas = models.ForeignKey(Conteos , on_delete=models.CASCADE)
    fecha_hora_analisis = models.DateTimeField(default=timezone.now)
    fecha_hora_grabacion = models.DateTimeField(default=timezone.now)
    parque = models.CharField(max_length = 100)
    observaciones = models.TextField()
    duracion = models.TextField()

    def save(self, *args, **kwargs):
        tz = pytz.timezone('America/Bogota')
        self.fecha_hora_analisis = self.fecha_hora_analisis.astimezone(tz)
        self.fecha_hora_grabacion = self.fecha_hora_grabacion.astimezone(tz)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.id_reportes