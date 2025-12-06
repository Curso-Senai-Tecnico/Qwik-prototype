from django.http import JsonResponse
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from validate_docbr import CPF, CNPJ
from .models import Candidato, Recrutador, Vaga, Perfil, Tag, PerfilTag, VagaTag
from .serializers import (
    UsuarioSerializer,
    CandidatoSerializer, 
    RecrutadorSerializer, 
    CandidatoRegistrationSerializer, 
    RecrutadorRegistrationSerializer,
    VagaSerializer,
    PerfilSerializer,
    TagSerializer
)
from django.conf import settings
from django.views.static import serve
from django.views.decorators.clickjacking import xframe_options_exempt
import mimetypes
import os
from django.http import FileResponse
from django.db import IntegrityError

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
    
    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]

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
                "recrutador": RecrutadorSerializer(recrutador).data if recrutador else None
            })

        return Response({"usuario": UsuarioSerializer(user).data})
    
@xframe_options_exempt
def serve_files(request,path):
    filepath = os.path.join(settings.MEDIA_ROOT, path)
    content_type, _ = mimetypes.guess_type(filepath)
    return FileResponse(open(filepath,"rb"),content_type=content_type)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    
class AddTagPerfilView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, perfil_id):
        tag_id = request.data.get("tag_id")
        if not tag_id:
            return Response({"error": "tag_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            perfil = Perfil.objects.get(candidato_id=perfil_id)
            tag = Tag.objects.get(id=tag_id)
        except (Perfil.DoesNotExist, Tag.DoesNotExist):
            return Response({"error": "Perfil ou Tag não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # ta aqui por causa da modelagem não ter tabela de id
        try:
            PerfilTag.objects.create(perfil=perfil, tag=tag)
        except IntegrityError:
            pass

        tags = list(PerfilTag.objects.filter(perfil=perfil).values_list('tag__nome', flat=True))
        return Response({"tags": tags}, status=status.HTTP_200_OK)

class AddTagVagaView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, vaga_id):
        tag_id = request.data.get("tag_id")
        if not tag_id:
            return Response({"error": "tag_id é obrigatório"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            vaga = Vaga.objects.get(id=vaga_id)
            tag = Tag.objects.get(id=tag_id)
        except (Vaga.DoesNotExist, Tag.DoesNotExist):
            return Response({"error": "Vaga ou Tag não encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Cria a relação se ainda não existir
        try:
            VagaTag.objects.get_or_create(vaga=vaga, tag=tag)
        except IntegrityError:
            pass

        tags = list(VagaTag.objects.filter(vaga=vaga).values_list('tag__nome', flat=True))
        return Response({"tags": tags}, status=status.HTTP_200_OK)