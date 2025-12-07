# seu_app/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # A URL capturará qualquer nome de sala
    re_path(r'ws/call/(?P<room_name>\w+)/$', consumers.VideoCallConsumer.as_asgi()),
]