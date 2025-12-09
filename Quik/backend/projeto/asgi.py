import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import api.routing as routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'projeto.settings')

# Inicializa o Django HTTP
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # Requisições HTTP
    "http": django_asgi_app,

    # Requisições WebSocket 
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})