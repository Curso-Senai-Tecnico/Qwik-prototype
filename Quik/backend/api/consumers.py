import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from asgiref.sync import sync_to_async

class VideoCallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'video_{self.room_name}'

        # 1. Verifica quantos usuários já estão na sala
        users_in_room = await self.get_users_in_room(self.room_name)
        
        if len(users_in_room) >= 2:
            # Sala cheia! Rejeita a conexão.
            print("Sala cheia, rejeitando conexão.")
            await self.close()
            return

        # 2. Entra no grupo do Channels
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # 3. Adiciona o usuário atual à lista no Cache
        await self.add_user_to_room(self.room_name, self.channel_name)

        # 4. Avisa a todos que alguém entrou (incluindo quantos estão agora)
        # Isso é útil para o Frontend habilitar o botão de ligar ou ligar automaticamente
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'status': 'joined',
                'user_count': len(users_in_room) + 1
            }
        )

    async def disconnect(self, close_code):
        # Remove do grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        # Remove do Cache
        await self.remove_user_from_room(self.room_name, self.channel_name)
        
        # Avisa que alguém saiu
        new_count = len(await self.get_users_in_room(self.room_name))
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'status': 'left',
                'user_count': new_count
            }
        )

    async def receive(self, text_data):
        # (O código de receive continua igual ao anterior)
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'signal_message',
                'payload': data,
                'sender_channel_name': self.channel_name 
            }
        )

    # --- Handlers de Mensagens ---

    async def signal_message(self, event):
        # (Igual ao anterior)
        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps(event['payload']))

    async def user_status(self, event):
        # Envia notificação de entrada/saída para o Frontend
        await self.send(text_data=json.dumps({
            'type': 'user_update',
            'status': event['status'],
            'count': event['user_count']
        }))

    # --- Métodos Auxiliares com Redis (Cache) ---
    
    @sync_to_async
    def get_users_in_room(self, room):
        # Retorna uma lista de channel_names ou lista vazia
        return cache.get(f'room_{room}_users') or []

    @sync_to_async
    def add_user_to_room(self, room, channel_name):
        users = cache.get(f'room_{room}_users') or []
        users.append(channel_name)
        # Salva por 1 hora (timeout) para evitar lixo se o server cair
        cache.set(f'room_{room}_users', users, timeout=3600)

    @sync_to_async
    def remove_user_from_room(self, room, channel_name):
        users = cache.get(f'room_{room}_users') or []
        if channel_name in users:
            users.remove(channel_name)
            cache.set(f'room_{room}_users', users, timeout=3600)