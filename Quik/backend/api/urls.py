from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token # Importe esta view
from .views import CandidatoViewSet, RecrutadorViewSet

# Cria um router e registra nossos viewsets com ele.
router = DefaultRouter()
router.register(r'candidatos', CandidatoViewSet, basename='candidato')
router.register(r'recrutadores', RecrutadorViewSet, basename='recrutador')

# As URLs da API são agora determinadas automaticamente pelo router.
urlpatterns = [
    path('', include(router.urls)),
    path('login/', obtain_auth_token, name='api-token-auth'), # Adicione esta linha para o login
]