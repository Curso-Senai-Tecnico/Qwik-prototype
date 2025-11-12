from rest_framework import serializers                                   # Importa serializers do Django REST Framework
from .models import Usuario, Candidato, Perfil, Recrutador, Vaga, FormaPagamento, Pagamento, Assinatura, Cartao, Pix, Videochamada, PV,                        # Importa os modelos necessários
from django.db import transaction                                        # Importa transaction para operações atômicas
from validate_docbr import CPF, CNPJ                                     # Importa validadores de CPF e CNPJ

# ==========================================
#         serializer de usuario
# ==========================================

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'telefone', 'login',
                    'senha', 'cidade', 'estado', 'bairro']
    
# ==========================================
#         serializer de candidato
# ==========================================

class CandidatoSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()
    class Meta:
        model = Candidato
        fields = ['user', 'data_nascimento', 'cpf',
                  'genero', 'estado_civil']

        def validate_cpf(self, value):                             # Validação personalizada para CPF
            cpf_validator = CPF()                                  # Cria uma instância do validador de CPF
            if not cpf_validator.validate(value):
                raise serializers.ValidationError("CPF inválido.") # Levanta erro se o CPF for inválido
            return value                                           # Retorna o valor se for válido

# ==========================================
#         serializer de perfil
# ==========================================

class PerfilSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()
    class Meta:
        model = Perfil
        fields = ['user', 'foto', 'nome_perfil',
                  'data_nascimento', 'curriculo']

# ==========================================
#         serializer de recrutador
# ==========================================

class RecrutadorSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()

    class Meta:
        model = Recrutador
        fields = ['user', 'cnpj', 'perfil_recutador']

        def validate_cnpj(self, value):                             # Validação personalizada para CNPJ
            cnpj_validator = CNPJ()                                 # Cria uma instância do validador de CNPJ
            if not cnpj_validator.validate(value):
                raise serializers.ValidationError("CNPJ inválido.") # Levanta erro se o CNPJ for inválido
            return value                                            # Retorna o valor se for válido

# ==========================================
#         serializer de vaga
# ==========================================


# ==========================================
#         serializer de serializer
# ==========================================

# ==========================================
#         serializer de serializer
# ==========================================

# ==========================================
#         serializer de serializer
# ==========================================

# ==========================================
#         serializer de serializer
# ==========================================

# ==========================================
#         serializer de serializer
# ==========================================


#Serializador para registro de candidato (POST)
class CandidatoRegistrationSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()

    class Meta:
        model = Candidato
        fields = ['user', 'cpf', 'data_nascimento']

                                
    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = Usuario.objects.create_user(**user_data)
        candidato = Candidato.objects.create(user=user, **validated_data)
        return candidato

                                #Serializador para registro de recrutador (POST)
class RecrutadorRegistrationSerializer(serializers.ModelSerializer):
    user = UsuarioSerializer()

    class Meta:
        model = Recrutador
        fields = ['user', 'cnpj']
    

    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = Usuario.objects.create_user(**user_data)
        recrutador = Recrutador.objects.create(user=user, **validated_data)
        return recrutador
    
    """   Pra lembrar: 
            @transaction.atomic é um decorador do Django
            que garante que todas as operações de banco
            de dados dentro do método, sejam tratadas como
            uma única transação.
            Se qualquer operação falhar, todas as mudanças 
            feitas no banco de dados
            dentro desse bloco serão revertidas, mantendo a 
            integridade dos dados.
            Isso é especialmente útil ao criar usuários e 
            perfis relacionados, onde você quer garantir que
            ambos sejam criados com sucesso ou nenhum deles seja criado.    
    """