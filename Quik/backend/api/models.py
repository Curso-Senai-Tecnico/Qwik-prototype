from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario (models.Model):
    #o django já cria um id para cada tabela automaticamente
    nome = models.CharField(max_length=100, null=False)
    email = models.CharField(max_length=250, null=False)
    telefone = models.CharField(max_length=15, null=True)
    login = models.CharField(max_length=50, null=False)
    senha = models.CharField(max_length=255, null=False)
    cidade = models.CharField(max_length=100, null=True)
    estado = models.CharField(max_length=100, null=True)
    bairro = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = "usuarios"
    

class Candidato(models.Model):
    data_nascimento = models.DateField() # Campo para data de nascimento
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True) # Ligação um-para-um com User
    cpf = models.CharField(max_length=14, unique=True, null=False)# Formato: 000.000.000-00
    class generos(models.TextChoices):
        MASCULINO = 'M', '  Masculino'
        FEMININO = 'F', 'Feminino'
        OUTRO = 'OUTRO', "Prefiro não dizer"
    genero = models.CharField(max_length=20, choices=generos.choices,null=False)
    class CivilStatus(models.TextChoices):
        SOLTEIRO = 'Solteiro(a)', 'Solteiro(a)'
        CASADO = 'Casado(a)', 'Casado(a)'
        DIVORCIADO = 'Divorciado(a)', 'Divorciado(a)'
        VIUVO = 'Viúvo(a)', 'Viúvo(a)'
    estado_civil = models.CharField(max_length=15, choices=CivilStatus.choices, null=False)
    
    class Meta:
        db_table = "canditados"


class Perfil(models.Model):
    
    foto = models.CharField(max_length=255, null=False)
    nome_perfil = models.CharField(max_length=100, null=False)
    data_nascimento_perfil = models.DateField(null=False)
    curriculo = models.CharField(max_length=255, null=True)
    class Meta:
        db_table = 'perfil'


class Recrutador(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True) # Ligação um-para-um com User
    cnpj = models.CharField(max_length=18, unique=True) # Formato: 00.000.000/0000-00

    def __str__(self):
        return self.user.username
