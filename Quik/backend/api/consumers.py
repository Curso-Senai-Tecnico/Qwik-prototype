import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Pega o nome da sala da url
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'video_call_{self.room_name}'

        #Entra na sala
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()
        retorno_conexão = (f"Conectado à sala {self.room_name}")
    
    async def disconnect(self, close_code):
        # Sai da sala
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        retorno_desconexão = (f"Desconectado da sala {self.room_name}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        # Envia a mensagem para o grupo da sala
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'video_call_message',
                'payload': data
                'sender_channel': self.channel_name
            }
        )
    async def signal_message(self, event):
        payload = event['payload']
        sender_channel = event['sender_channel']

        # Evita enviar a mensagem de volta para o remetente original
        if self.channel_name != sender_channel:
            await self.send(text_data=json.dumps(payload))