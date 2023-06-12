from rest_framework import serializers
from .models import Conteos
from .models import Reportes

class ConteosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conteos
        fields = "__all__"

class ReportesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reportes
        fields = "__all__"