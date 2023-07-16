from rest_framework import serializers
from .models import *

class ParksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parks
        fields = "__all__"

class ConteosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteos
        fields = "__all__"

class ReportesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reportes
        fields = "__all__"