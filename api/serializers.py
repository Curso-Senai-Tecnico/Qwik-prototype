from rest_framework import serializers                                   # Importa serializers do Django REST Framework
from .models import User, Candidato, Recrutador                          # Importa os modelos necessários
from django.db import transaction                                        # Importa transaction para operações atômicas
from validate_docbr import CPF, CNPJ                                     # Importa validadores de CPF e CNPJ

                                #Serializador para usuario em geral
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'cidade', 'estado', 'telefone', 'bairro', 'password']

    
                                #Serializador para candidato (GET)
class CandidatoSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Candidato
        fields = ['user', 'cpf', 'data_nascimento']

        def validate_cpf(self, value):                             # Validação personalizada para CPF
            cpf_validator = CPF()                                  # Cria uma instância do validador de CPF
            if not cpf_validator.validate(value):
                raise serializers.ValidationError("CPF inválido.") # Levanta erro se o CPF for inválido
            return value                                           # Retorna o valor se for válido

                                #Serializador para recrutador (GET)
class RecrutadorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Recrutador
        fields = ['user', 'cnpj']

        def validate_cnpj(self, value):                             # Validação personalizada para CNPJ
            cnpj_validator = CNPJ()                                 # Cria uma instância do validador de CNPJ
            if not cnpj_validator.validate(value):
                raise serializers.ValidationError("CNPJ inválido.") # Levanta erro se o CNPJ for inválido
            return value                                            # Retorna o valor se for válido

                                #Serializador para registro de candidato (POST)
class CandidatoRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Candidato
        fields = ['user', 'cpf', 'data_nascimento']

                                
    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        candidato = Candidato.objects.create(user=user, **validated_data)
        return candidato

                                #Serializador para registro de recrutador (POST)
class RecrutadorRegistrationSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Recrutador
        fields = ['user', 'cnpj']
    

    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        recrutador = Recrutador.objects.create(user=user, **validated_data)
        return recrutador
    
    """   Pra lembrar: 
            @transaction.atomic é um decorador do Django
            que garante que todas as operações de banco
            de dados dentro do método sejam tratadas como
            uma única transação.
            Se qualquer operação falhar, todas as mudanças 
            feitas no banco de dados
            dentro desse bloco serão revertidas, mantendo a 
            integridade dos dados.
            Isso é especialmente útil ao criar usuários e 
            perfis relacionados, onde você quer garantir que
            ambos sejam criados com sucesso ou nenhum deles seja criado.    
    """