from django.db import models

# ==========================================
#                usuários
# ==========================================

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
    
# ==========================================
#                candidatos
# ==========================================

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

# ==========================================
#                 perfil
# ==========================================

class Perfil(models.Model):
    Usuario =  Usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True)
    foto = models.CharField(max_length=255, null=False)
    nome_perfil = models.CharField(max_length=100, null=False)
    data_nascimento_perfil = models.DateField(null=False)
    curriculo = models.CharField(max_length=255, null=True)
    class Meta:
        db_table = 'perfil'

# ==========================================
#                recrutador
# ==========================================

class Recrutador(models.Model):
    Usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True) # Ligação um-para-um com Usuario
    cnpj = models.CharField(max_length=18, unique=True) # Formato: 00.000.000/0000-00
    perfi_recrutador = models.CharField(max_length=100, null=False)

    class Meta:
        db_table = 'recrutador'

# ==========================================
#                   vaga
# ==========================================

class Vaga(models.Model):
    Recrutador = models.OneToOneField(Recrutador, on_delete=models.CASCADE, primary_key=True)
