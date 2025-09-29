from  .auth_validator import AuthValidator
 
class AuthService:
    # Serviço de autenticação que utiliza AuthValidator para validar dados.
    
    def register(self, nome: str, email: str, senha: str) -> bool:
        """
        Registra um novo usuário após validar os dados.
        Retorna True se o registro for bem-sucedido, caso contrário False.
        """
        if self.validate_user_data(nome, email, senha):
            # Lógica de registro do usuário (e.g., salvar no banco de dados)
            return True
        return False
    
    def login(self, email: str, senha: str) -> bool:
        """
        Faz login do usuário após validar os dados.
        Retorna True se o login for bem-sucedido, caso contrário False.
        """
        if AuthValidator.verify_email(email) and AuthValidator.verify_senha(senha):
            # Lógica de autenticação do usuário (e.g., verificar credenciais no banco de dados)
            return True
        return False

