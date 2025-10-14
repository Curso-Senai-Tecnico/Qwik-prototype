from django.http import JsonResponse
from rest_framework import viewsets
from validate_docbr import CPF
from .models import Candidato, Recrutador
from .serializers import (
    CandidatoSerializer, 
    RecrutadorSerializer, 
    CandidatoRegistrationSerializer, 
    RecrutadorRegistrationSerializer
)


def VerificarCpfView(request):
    cpf_recebido = request.GET.get('cpf', None)
    if cpf_recebido is None:
        return JsonResponse({'error': 'CPF não fornecido'}, status=400)
    
    cpf_validator = CPF()
    is_valid = cpf_validator.validate(cpf_recebido)
    return JsonResponse({'cpf': cpf_recebido, 'is_valid': is_valid})

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
