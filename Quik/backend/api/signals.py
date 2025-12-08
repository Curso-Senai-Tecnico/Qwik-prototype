from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Candidato, Perfil

@receiver(post_save, sender=Candidato)
def criar_perfil_para_candidato(sender, instance, created, **kwargs):
    if created:
        nome_usuario = instance.usuario.nome
        Perfil.objects.create(candidato=instance, nome_perfil=nome_usuario)
