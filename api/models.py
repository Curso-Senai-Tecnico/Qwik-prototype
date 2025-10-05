from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # AbstractUser já inclui username, email, e outros campos.
    # Adicionamos apenas os campos personalizados.
    cidade = models.CharField(max_length=100, blank=True)
    estado = models.CharField(max_length=100, blank=True)
    telefone = models.CharField(max_length=15, blank=True)
    bairro = models.CharField(max_length=100, blank=True) # Corrigido de 'bairrpo'

    # O __str__ agora funcionará, pois AbstractUser tem o campo 'username'
    def __str__(self):
        return self.username
    
class Candidato(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cpf = models.CharField(max_length=14, unique=True) # Formato: 000.000.000-00
    data_nascimento = models.DateField()

    def __str__(self):
        return self.user.username
    
class Recrutador(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cnpj = models.CharField(max_length=18, unique=True) # Formato: 00.000.000/0000-00

    def __str__(self):
        return self.user.username
