from rest_framework import viewsets

from .models import Candidato, Recrutador
from .serializers import (
    CandidatoSerializer, 
    RecrutadorSerializer, 
    CandidatoRegistrationSerializer, 
    RecrutadorRegistrationSerializer
)


class CandidatoViewSet(viewsets.ModelViewSet):
    
    #viewset para CRUD completo de Candidatos
    queryset = Candidato.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return CandidatoRegistrationSerializer
        return CandidatoSerializer


class RecrutadorViewSet(viewsets.ModelViewSet):
   
   #Viewset para CRUD completo de Recrutadores
    queryset = Recrutador.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return RecrutadorRegistrationSerializer
        return RecrutadorSerializer
