from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token # Importe esta view
from .views import CandidatoViewSet, RecrutadorViewSet, VagaViewSet, PerfilViewSet,TagViewSet, MeView, serve_files, AddTagVagaView, AddTagPerfilView

# Cria um router e registra nossos viewsets com ele.
router = DefaultRouter()
router.register(r'candidatos', CandidatoViewSet, basename='candidato')
router.register(r'recrutadores', RecrutadorViewSet, basename='recrutador')
router.register(r'vagas', VagaViewSet, basename='vaga') 
router.register(r'perfis', PerfilViewSet, basename='perfil')
router.register(r'tags', TagViewSet, basename='tag')
# As URLs da API são agora determinadas automaticamente pelo router.
urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='api-token-auth'), # Adicione esta linha para o login
    path('me/',MeView.as_view(), name='me'),
    path('file/<path:path>', serve_files, name='serve_files'),
    path('perfis/<int:perfil_id>/add_tag/', AddTagPerfilView.as_view(), name='perfil-add-tag'),
    path('vagas/<int:vaga_id>/add_tag/', AddTagVagaView.as_view(), name='vaga-add-tag'),
]