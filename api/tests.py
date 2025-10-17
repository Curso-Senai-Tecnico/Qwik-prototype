from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import User, Candidato, Recrutador

CPF_VALIDO = "123.456.789-09"                   # CPF válido para testes
CNPJ_VALIDO = "12.345.678/0001-95"              # CNPJ válido para testes

CPF_INVALIDO = "123.456.789-00"                 # CPF inválido para testes
CNPJ_INVALIDO = "12.345.678/0001-00"            # CNPJ inválido para testes

SENHA_VALIDA = "SenhaForte123!"                 # Senha válida para testes
SENHA_INVALIDA = "123"                          # Senha inválida para testes (muito curta)

EMAIL_VALIDO = "Usuario@email.com"              # Email válido para testes
EMAIL_INVALIDO = "Usuarioemail.com"             # Email inválido para testes (sem @)
# Create your tests here.



class CreateUserViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('candidato-list')  # URL para criar usuário
        self.valid_payload = {'user': {
            'username': 'Usuario',
            'email': EMAIL_VALIDO,
            'firt_name': 'Nome',
            'last_name': 'Sobrenome',
            'cidade': 'Cidade',
            'estado': 'Estado',
            'telefone': '123456789',
            'bairro': 'Bairro',
            'password': SENHA_VALIDA,
        }, 
        'cpf': CPF_VALIDO,
        'data_nascimento': '1990-01-01',
            
            }
        self.invalid_payload = {'user': {
            'username': 'Usuario',
            'email': EMAIL_INVALIDO,
            'firt_name': 'Nome',
            'last_name': 'Sobrenome',
            'cidade': 'Cidade',
            'estado': 'Estado',
            'telefone': '123456789',
            'bairro': 'Bairro',
            'password': SENHA_INVALIDA,
        }, 
        'cpf': CPF_INVALIDO,
        'data_nascimento': '1990-01-01',
        }

    def test_create_user_valid(self):
        # Testa a criação de usuário com dados válidos
        response = self.client.post(self.url, self.valid_payload, format='json')
        # Verifica se a resposta é 201 Created
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Verifica se o usuário foi criado no banco de dados
        self.assertEqual(User.objects.count(), 1)
        # Verifica se o email do usuário criado é o esperado
        self.assertEqual(User.objects.get().email, EMAIL_VALIDO)

    def test_create_user_invalid(self):
        # Testa a criação de usuário com dados inválidos
        response = self.client.post(self.url, self.invalid_payload, format='json')
        # Verifica se a resposta é 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verifica se nenhum usuário foi criado no banco de dados
        self.assertEqual(User.objects.count(), 0)
        self.assertIn('email', response.data)  # Verifica se o erro de email está na resposta
        self.assertIn('cpf', response.data)    # Verifica se o erro de CPF está na resposta
        self.assertIn('senha', response.data)  # Verifica se o erro de senha está na resposta
        self.assertEqual(response.data['email'][0], 'Enter a valid email address.')
        self.assertEqual(response.data['cpf'][0], 'CPF inválido.')
        self.assertEqual(response.data['senha'][0], 'Senha muito fraca. Deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, dígitos e caracteres especiais.')

    def test_not_create_with_data_gap(self):
        # Testa a criação de usuarios com dados faltando
        incomplete_payload = {
            'email': EMAIL_VALIDO,
            'cpf': CPF_VALIDO,
            'senha': SENHA_VALIDA,
        }
        response = self.client.post(self.url, incomplete_payload, format='json')
        # Verifica se a resposta é 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verifica se nenhum usuário foi criado no banco de dados
        self.assertEqual(User.objects.count(), 0)
        self.assertIn('nome', response.data)  # Verifica se o erro de nome está na resposta
        self.assertEqual(response.data['nome'][0], 'This field is required.')

    def test_not_create_duplicate_cpf(self):
        # Testa a criação de usuários com CPF duplicado
        self.client.post(self.url, self.valid_payload, format='json')  # Cria o primeiro usuário
        self.assertEqual(User.objects.count(), 1)

        duplicate_cpf_payload = {
            'nome': 'OutroUsuario',
            'email': 'Outroususario@email.com',
            'cpf': CPF_VALIDO,  # Mesmo CPF do primeiro usuário
        }

        response = self.client.post(self.url, duplicate_cpf_payload, format='json')
        # Verifica se a resposta é 400 Bad Request
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Verifica se ainda há apenas um usuário no banco de dados
        self.assertEqual(User.objects.count(), 1)
        self.assertIn('cpf', response.data)  # Verifica se o erro de CPF está na resposta
        self.assertEqual(response.data['cpf'][0], 'CPF já cadastrado.')