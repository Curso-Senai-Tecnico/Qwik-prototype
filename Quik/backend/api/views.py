from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from validate_docbr import CPF, CNPJ
from .models import Candidato, Recrutador, Vaga, Perfil
from .serializers import (
    UsuarioSerializer,
    CandidatoSerializer, 
    RecrutadorSerializer, 
    CandidatoRegistrationSerializer, 
    RecrutadorRegistrationSerializer,
    VagaSerializer,
    PerfilSerializer
)

def VerficarCnpjView(request):                                           # Define a view para verificar CNPJ
    cnpj_recebido = request.GET.get('cnpj', None)                        # Obtém o CNPJ da requisição GET
    if cnpj_recebido is None:                                            # Verifica se o CNPJ foi fornecido
        return JsonResponse({'error': 'CNPJ não fornecido'}, status=400) # Retorna erro se não foi fornecido


    cnpj_validator = CNPJ()                                              # Cria uma instância do validador de CNPJ
    is_valid = cnpj_validator.validate(cnpj_recebido)                    # Valida o CNPJ recebido
    return JsonResponse({'cnpj': cnpj_recebido, 'is_valid': is_valid})   # Retorna a resposta JSON com o resultado da validação

def VerificarCpfView(request):
    cpf_recebido = request.GET.get('cpf', None)                          # Obtém o CPF da requisição GET
    if cpf_recebido is None:                                             # Verifica se o CPF foi fornecido
        return JsonResponse({'error': 'CPF não fornecido'}, status=400)  # Retorna erro se não foi fornecido
    
    cpf_validator = CPF()                                                # Cria uma instância do validador de CPF
    is_valid = cpf_validator.validate(cpf_recebido)                      # Valida o CPF recebido
    return JsonResponse({'cpf': cpf_recebido, 'is_valid': is_valid})     # Retorna a resposta JSON com o resultado da validação

class CandidatoViewSet(viewsets.ModelViewSet): 
    
                             #viewset para CRUD completo de Candidatos
    queryset = Candidato.objects.all()

    def get_serializer_class(self):                                      # Define o serializer a ser usado com base na ação
        if self.action == 'create':                                      # Se a ação for 'create', usa o serializer de registro
            return CandidatoRegistrationSerializer                       # Retorna o serializer de registro de candidato
        return CandidatoSerializer                                       # Caso contrário, retorna o serializer padrão de candidato


class RecrutadorViewSet(viewsets.ModelViewSet):
   
                             #Viewset para CRUD completo de Recrutadores
    queryset = Recrutador.objects.all()

    def get_serializer_class(self):                                      # Define o serializer a ser usado com base na ação
        if self.action == 'create':
            return RecrutadorRegistrationSerializer                      # Retorna o serializer de registro de recrutador
        return RecrutadorSerializer                                      # Caso contrário, retorna o serializer padrão de recrutador


class VagaViewSet(viewsets.ModelViewSet):
    
                             #Viewset para CRUD completo de Vagas
    queryset = Vaga.objects.all()
    serializer_class =  VagaSerializer # Usa o serializer de recrutador para as vagas

    def get_serializer_class(self):                                      # Define o serializer a ser usado com base na ação
        if self.action == 'create':
            return VagaSerializer                                       # Retorna o serializer de vaga para criação
        
        return VagaSerializer
        
                                           # Retorna o serializer padrão de vaga

class PerfilViewSet(viewsets.ModelViewSet):
     
                             #Viewset para CRUD completo de Perfis
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer                                  # Usa o serializer de perfil

    def get_serializer_class(self):                                      # Define o serializer a ser usado com base na ação
        if self.action == 'create':
            return PerfilSerializer                                     # Retorna o serializer de perfil para criação
        
        return PerfilSerializer 
        
                                 # Retorna o serializer padrão de perfil

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        

        if user.role  == 'candidato':
            candidato = Candidato.objects.filter(usuario=user).first()
            perfil = Perfil.objects.filter(candidato=candidato).first()
            return Response({
                "usuario": UsuarioSerializer(user).data,
                "candidato": CandidatoSerializer(candidato).data if candidato else None,
                "perfil": PerfilSerializer(perfil).data if perfil else None
            })
        
        elif user.role == 'recrutador':
            recrutador = Recrutador.objects.filter(usuario=user).first()
            return Response({
                "usuario": UsuarioSerializer(user).data,
                "recrutador": RecrutadorSerializer(recrutador).data if recrutador else None,
                "perfil": PerfilSerializer(perfil).data if perfil else None
            })

        return Response({"usuario": UsuarioSerializer(user).data})