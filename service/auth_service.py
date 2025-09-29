import string
import re # Importando a biblioteca de Expressões Regulares (Regex)

class AuthValidator:
    """
    Uma classe utilitária para validar dados de autenticação como nome, e-mail e senha.
    Todos os métodos são estáticos, pois não dependem de estado interno.
    """

    @staticmethod
    def verify_nome(nome: str) -> bool:
        """
        Verifica se o nome é válido.
        - Deve ser uma string.
        - Deve ter entre 4 e 19 caracteres.
        - Não pode conter caracteres de pontuação.
        """
        if not isinstance(nome, str):
            return False

        # Verifica se o nome não tem pontuação
        has_punctuation = any(char in string.punctuation for char in nome)
        
        # Retorna o resultado de todas as condições juntas. Mais limpo e direto.
        return (4 <= len(nome) < 20) and not has_punctuation

    @staticmethod
    def verify_email(email: str) -> bool:
        """
        Verifica se o formato do e-mail é válido usando Regex.
        - Deve ser uma string.
        - Deve ter um formato de e-mail reconhecível.
        """
        if not isinstance(email, str):
            return False
            
        # Este padrão verifica a estrutura básica de "algo@algo.algo"
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        return re.match(email_regex, email) is not None

    @staticmethod
    def verify_senha(senha: str) -> bool:
        """
        Verifica a força da senha.
        - Deve ser uma string.
        - Comprimento entre 8 e 20 caracteres.
        - Pelo menos uma letra maiúscula.
        - Pelo menos uma letra minúscula.
        - Pelo menos um número.
        - Pelo menos um caractere especial (pontuação).
        """
        if not isinstance(senha, str):
            return False
            
        if not (8 <= len(senha) <= 20):
            return False

        # Criamos uma lista de todas as verificações que precisamos
        checks = [
            any(c.isupper() for c in senha),      # Tem maiúscula?
            any(c.islower() for c in senha),      # Tem minúscula?
            any(c.isdigit() for c in senha),      # Tem número?
            any(c in string.punctuation for c in senha) # Tem caractere especial?
        ]
        
        # A função all() retorna True apenas se TODOS os itens da lista forem True.
        return all(checks)

class AuthService:
    """
    Serviço de autenticação que utiliza AuthValidator para validar dados.
    """

    @staticmethod
    def validate_user_data(nome: str, email: str, senha: str) -> bool:
        """
        Valida os dados do usuário (nome, e-mail e senha).
        Retorna True se todos os dados forem válidos, caso contrário False.
        """
        return (AuthValidator.verify_nome(nome) and
                AuthValidator.verify_email(email) and
                AuthValidator.verify_senha(senha))