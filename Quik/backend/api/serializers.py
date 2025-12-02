from rest_framework import serializers                                   # Importa serializers do Django REST Framework
from .models import Usuario, Candidato, Perfil, Recrutador, Vaga, FormaPagamento, Pagamento, Assinatura, Cartao, Pix, Videochamada, PV, Tag                     # Importa os modelos necessários
from django.db import transaction                                        # Importa transaction para operações atômicas
from validate_docbr import CPF, CNPJ                                     # Importa validadores de CPF e CNPJ

# ==========================================
#         serializer de usuario
# ==========================================

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'telefone',
                    'password', 'cidade', 'estado', 'bairro', 'role']
        extra_kwargs = {'password': {'write_only': True}}
    
# ==========================================
#         serializer de candidato
# ==========================================

class CandidatoSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()
    class Meta:
        model = Candidato
        fields = ['usuario', 'data_nascimento', 'cpf',
                  'genero', 'estado_civil']

    def validate_cpf(self, value):
        cpf_validator = CPF()
        if not cpf_validator.validate(value):
            raise serializers.ValidationError("CPF inválido.")
        return value
    
    def update(self, instance, validated_data):
        usuario_data = validated_data.pop('usuario', None)
        if usuario_data:
            usuario_instance = instance.usuario
            if isinstance(usuario_data, dict):
                for attr, value in usuario_data.items():
                    setattr(usuario_instance, attr, value)
            else:
                usuario_instance = usuario_data
            usuario_instance.save()
            
        for attr,value in validated_data.items():
            setattr(instance,attr,value)
        instance.save()
        return instance


# ==========================================
#         serializer de perfil
# ==========================================

class PerfilSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    class Meta:
        model = Perfil
        fields = ['candidato', 'foto', 'nome_perfil',
                  'data_nascimento_perfil', 'curriculo', 'tags']
    def get_tags(self, obj):
        from .models import PerfilTag, Tag
        tag_ids = PerfilTag.objects.filter(perfil_id=obj.candidato_id).values_list("tag_id", flat=True)
        tags = Tag.objects.filter(id__in=tag_ids).values_list("nome", flat=True)
        return list(tags)
    
# ==========================================
#         serializer de recrutador
# ==========================================

class RecrutadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recrutador
        fields = ['usuario', 'cnpj', 'perfil_recutador']

        def validate_cnpj(self, value):                             # Validação personalizada para CNPJ
            cnpj_validator = CNPJ()                                 # Cria uma instância do validador de CNPJ
            if not cnpj_validator.validate(value):
                raise serializers.ValidationError("CNPJ inválido.") # Levanta erro se o CNPJ for inválido
            return value                                            # Retorna o valor se for válido

# ==========================================
#            serializer de tags
# ==========================================

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'nome']

# ==========================================
#           serializer de vaga
# ==========================================

class VagaSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True) # o django vai usar o serializers da tag para formatar as tags 

    # quando há uma requisição de POST ou PUT, o sistema espera uma resposta em strings
    tags_nomes = serializers.ListField(child=serializers.CharField(max_length=50), # garante que cada item da lista seja uma string
                                       write_only=True, # ele diz para o django que esse campo serve apenas para a escrita/entrada dos dados
                                       required=True) # ele obriga o cliente fornecer um dado, ou seja, precisa ter pelo menos uma tag  
    
# ========== SERIALIZAÇÃO DOS CAMPOS ==========
    class Meta:
        model = Vaga
        fields = ['recrutador', 'tipo', 'contato', 'cargo', 'resumo',
                    'responsabilidades', 'requisitos', 'beneficios', 'salario',
                        'quantidade', 'localizacao', 'data_publicacao', 'status', 'tags', 'tags_nomes']

# ========== ENTRADA DAS TAGS ==========
    # salva e conecta as tags no serializer. Ele vai pegar as tags que já existem no db, se não houver nenhuma, ele vai criar uma
    def _handle_tags(self, vaga, nome_tags):
        tags_a_conectar = [] #as tags virão dentro dessa lista
        
        for nome in nome_tags: # for para procurar as tags
            tag_objeto, criado = Tag.objects.get_or_create(nome=nome.strip()) # o get_or_create vai, ou buscar a tag se ela já exixtir ou ele vai criá-la, junto com o 'strip', para não deixar nenhum espaço acidental
            tags_a_conectar.append(tag_objeto) # coleta as tags resgatadas pelo loop

        vaga.tags.set(tags_a_conectar) # usa a ferramenta muitos para muitos do django para se conectar as tags com a(s) vaga(s)

# ========== JUNÇÃO DA VAGA COM AS TAGS ==========
    def create(self, validated_data):
        nome_tags = validated_data.pop('tags_nomes', []) # separa as tags do resto dos dados, se não encontrar, coloca uma lista vazia para não querbrar o código  

        # junta os dados de tags e de vaga, usando o 'transaction.atomic', que se algum valor der errado, irá ser deletado em dormato "cascade"
        with transaction.atomic(): 
            vaga = Vaga.objects.create(**validated_data)
            self._handle_tags(vaga, nome_tags) # referencia a criação/resgate de tags
            return vaga

# ========== ATUALIZAR AS TAGS ==========
    # aqui, o update recebe dois argumentos principais, o instance e o validated_data
    # instance = estabelece que a Vaga (que já existe no DB) q vai ser o serializer modificado
    # validated_data = são os dados vindos do cliente, e os que ser~]ao atualizados
    def update(self, instance, validate_data ):
        nomes_tags = validate_data.pop('tags_nomes', None) # extrai a lista de tags dos outros dados. é acompanhado do "none" que significa que, se não vier nenhum dado, nada será modificado
        for attr, value in validate_data.items():
            setattr(instance, attr, value) # pega os dados que o cliente incluiu
        instance.save() #salva a Vaga

        if nomes_tags is not None: # se os dados que o clinete colocou não for vazio, vai ser chamado a 'entrada das tags'
            self._handle_tags(instance, nomes_tags)
        return instance

# ==========================================
#     serializer de forma de pagamento
# ==========================================

class FormaPagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormaPagamento
        
        fields = ['recrutador', 'tipo', 'data_criacao', 'status']

# ==========================================
#         serializer de pagamento
# ==========================================

class PagamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagamento
        fields = ['recrutador', 'forma_pagamento', 'tipo_serviço',
                   'valor', 'data_pagamento',  'status']

# ==========================================
#         serializer de assinatura
# ==========================================

class AssinaturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assinatura
        fields = ['pagamento', 'tipo', 'data_inicio', 'data_vencimento', 'forma_pgt']

# ==========================================
#           serializer de cartao
# ==========================================

class CartaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cartao
        fields = ['formapagamento', 'numero_cartao', 'nome_titular', 'validade', 'cvv']

# ==========================================
#            serializer de pix
# ==========================================

class PixSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pix
        fields = ['formapagamento', 'tipo_de_chave', 'chave']

# ==========================================
#        serializer de video chamada
# ==========================================

class VideoChamadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Videochamada
        fields = ['candidato', 'recrutador', 'vaga',
                   'log', 'record', 'data_realizacao']

# ==========================================
#        serializer de chat privado
# ==========================================

class PVSerializer(serializers.ModelSerializer):
    class Meta:
        model = PV
        fields = ['candidato', 'recrutador', 'log', 'data']

#Serializador para registro do perfil (POST)
class PerfilRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perfil
        fields = ['usuario', 'foto', 'nome_perfil',
                  'data_nascimento', 'curriculo']
    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        perfil = Perfil.objects.create(**validated_data)
        return perfil

#Serializador para registro de vaga (POST)
class VagaRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaga
        fields = ['recrutador', 'tipo', 'contato', 'cargo', 'resumo',
                    'responsabilidades', 'requisitos', 'beneficios', 'salario',
                        'quantidade', 'localizacao', 'data_publicacao', 'status', 'tags']
    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        vaga = Vaga.objects.create(**validated_data)
        return vaga


#Serializador para registro de candidato (POST)
class CandidatoRegistrationSerializer(serializers.ModelSerializer):
    usuario = UsuarioSerializer()
    

    class Meta:
        model = Candidato
        fields = ['usuario', 'cpf', 'data_nascimento']

                                
    @transaction.atomic                                                  #transaction.atomic garante que a criação do usuário seja atômicas
    def create(self, validated_data):
        user_data = validated_data.pop('usuario')
        usuario = Usuario.objects.create_user(**user_data)
        candidato = Candidato.objects.create(usuario=usuario, **validated_data)
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