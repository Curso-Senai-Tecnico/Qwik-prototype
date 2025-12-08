from django.db import models
from creditcards.models import CardNumberField, CardExpiryField, SecurityCodeField
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# ==========================================
#                usuários
# ==========================================

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser precisa ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser precisa ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)



class Usuario(AbstractUser):
    # o django já cria um id para cada tabela automaticamente
    id = models.AutoField(primary_key=True)
    username = None
    first_name = None
    last_name = None
    nome = models.CharField(max_length=255, null=False)
    email = models.EmailField(null=False, unique=True)
    telefone = models.CharField(max_length=15, null=True, unique=True)
    cidade = models.CharField(max_length=100, null=True)
    estado = models.CharField(max_length=100, null=True)
    bairro = models.CharField(max_length=100, null=True)
    role = models.CharField(
        max_length=20,
        choices=[
            ("candidato", "Candidato"),
            ("recrutador", "Recrutador")
        ],
        default="candidato"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nome", "role"]

    objects = UsuarioManager()

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return self.email

# ==========================================
#                candidatos
# ==========================================


class Candidato(models.Model):
    # Ligação um-para-um com Usuario
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE, primary_key=True)
    data_nascimento = models.DateField()  # Campo para data de nascimento
    cpf = models.CharField(max_length=14, unique=True,null=False)  # Formato: 000.000.000-00
    class generos(models.TextChoices):
        MASCULINO = 'M', 'Masculino'
        FEMININO = 'F', 'Feminino'
        OUTRO = 'OUTRO', "Prefiro não dizer"
    genero = models.CharField(max_length=20, choices=generos.choices, default=generos.OUTRO, null=False)
    class CivilStatus(models.TextChoices):
        SOLTEIRO = 'Solteiro(a)', 'Solteiro(a)'
        CASADO = 'Casado(a)', 'Casado(a)'
        DIVORCIADO = 'Divorciado(a)', 'Divorciado(a)'
        VIUVO = 'Viúvo(a)', 'Viúvo(a)'
    estado_civil = models.CharField(max_length=15, choices=CivilStatus.choices, default=CivilStatus.SOLTEIRO, null=False)

    class Meta:
        db_table = "candidatos"

# ==========================================
#                 perfil
# ==========================================


class Perfil(models.Model):
    candidato = models.OneToOneField('Candidato', on_delete=models.CASCADE, primary_key=True, null=False)
    foto = models.ImageField(upload_to='fotos/', null=True, blank=True)
    nome_perfil = models.CharField(max_length=100, null=True)
    data_nascimento_perfil = models.DateField(null=True)
    curriculo = models.FileField(upload_to='curriculos/', null=True)

    class Meta:
        db_table = 'perfil'

# ==========================================
#                recrutador
# ==========================================


class Recrutador(models.Model):
    # Ligação um-para-um com Usuario
    usuario = models.OneToOneField('Usuario', on_delete=models.CASCADE, primary_key=True)
    cnpj = models.CharField(max_length=18, unique=True)# Formato: 00.000.000/0000-00
    perfil_recrutador = models.CharField(max_length=100, null=False, default='padrao')

    class Meta:
        db_table = 'recrutador'

# ==========================================
#                   tags
# ==========================================


class Tag(models.Model):
    nome = models.CharField(max_length=50, unique=True, null=False)

    class Meta:
        db_table = 'tag'

# ==========================================
#                   vaga
# ==========================================


class Vaga(models.Model):
    recrutador = models.ForeignKey('Recrutador', on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, null=False)
    contrato = models.CharField(max_length=50, null=False)
    cargo = models.CharField(max_length=100, null=False)
    resumo = models.TextField(null=False)
    responsabilidades = models.TextField(null=False)
    requisitos = models.TextField(null=False)
    beneficios = models.TextField(null=False)
    salario = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    quantidade = models.IntegerField(null=False)
    localizacao = models.CharField(max_length=200, null=False)
    data_publicacao = models.DateField(null=False)
    class Vagatacomo(models.TextChoices):
        ATIVA = 'Ativa', 'Ativa'
        EXPIRADA = 'Expirada', 'Expirada'
    status = models.CharField(max_length=10, choices=Vagatacomo.choices, default='Ativa')
    tags = models.ManyToManyField(
        Tag,
        through='VagaTag',
        related_name='vagas'
        )

    class Meta:
        db_table = 'vaga'


class VagaTag(models.Model):
    vaga = models.ForeignKey(Vaga, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = 'VagaTag'
        unique_together = (('vaga', 'tag'),)

class PerfilTag(models.Model):
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)

    class Meta:
        db_table = 'PerfilTag'
        unique_together = (('perfil', 'tag'),)

# ==========================================
#              forma de pagamento
# ==========================================


class FormaPagamento(models.Model):
    recrutador = models.ForeignKey('Recrutador', on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, null=False)
    data_criacao = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=True, verbose_name="Status Ativo")

    class Meta:
        db_table = 'formapagamento'

# ==========================================
#                 pagamento
# ==========================================


class Pagamento(models.Model):
    recrutador = models.ForeignKey('Recrutador', on_delete=models.CASCADE)
    formapagamento = models.ForeignKey('FormaPagamento', on_delete=models.CASCADE)
    tipo_serviço = models.CharField(max_length=50, null=False)
    valor = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    data_pagamento = models.DateTimeField(auto_now_add=True)
    class Pagamentostatus(models.TextChoices):
        ATIVA = 'Ativo', 'Ativo'
        EXPIRADA = 'Expirado', 'Expirado'
    status = models.CharField(max_length=10, choices=Pagamentostatus.choices, default='Ativa')

    class Meta:
        db_table = 'pagamento'

# ==========================================
#                 assinatura
# ==========================================


class Assinatura(models.Model):
    pagamento = models.ForeignKey('Pagamento', on_delete=models.CASCADE)
    tipo = models.CharField(max_length=50, null=False)
    data_inicio = models.DateTimeField(auto_now_add=True, null=False)
    data_vencimento = models.DateField(null=False)
    class Formas(models.TextChoices):
        CARTAO = 'Cartão', 'cartão'
        PIX = 'Pix', 'pix'
    forma_pgt = models.CharField(max_length=6, choices=Formas.choices, null=False)

    class Meta:
        db_table = 'assinatura'

# ==========================================
#                 cartão
# ==========================================


class Cartao(models.Model):
    formapagamento = models.OneToOneField('FormaPagamento', on_delete=models.CASCADE)
    # O CardNumberField inclui validação do Algoritmo de Luhn
    numero_cartao = CardNumberField(null=False)
    nome_titular = models.CharField(max_length=100, null=False)
    validade = CardExpiryField(null=False)
    cvv = SecurityCodeField(null=False)

    class Meta:
        db_table = 'cartao'

# ==========================================
#                   pix
# ==========================================


class Pix(models.Model):
    formapagamento = models.OneToOneField('FormaPagamento', on_delete=models.CASCADE)
    class Tipospix(models.TextChoices):
        EMAIL = 'Email', 'email'
        TELEFONE = 'Telefone', 'telefone'
        CPF = 'CPF', 'cpf'
        ALEATORIA = 'Aleatoria', 'aleatoria'
    tipo_de_chave = models.CharField(max_length=10, choices=Tipospix.choices, null=False)
    chave = models.CharField(max_length=150, null=False)

    class Meta:
        db_table = "pix"

# ==========================================
#               video chamada
# ==========================================

class Videochamada(models.Model):
    candidato = models.ForeignKey('Candidato', on_delete=models.CASCADE)
    recrutador = models.ForeignKey('Recrutador', on_delete=models.CASCADE)
    vaga = models.ForeignKey('Vaga', on_delete=models.CASCADE)
    log = models.CharField(max_length=255)
    record = models.CharField(max_length=255)
    data_realizacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'video_chamada'

# ==========================================
#               chat privado
# ==========================================


class PV(models.Model):
    candidato = models.ForeignKey('Candidato', on_delete=models.CASCADE)
    recrutador = models.ForeignKey('Recrutador', on_delete=models.CASCADE)
    log = models.TextField()
    data = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_pv'