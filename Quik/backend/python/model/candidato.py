from user import User

class Candidato(User):
    def __init__(self, id:int, nome:str, email:str,
                 cpf:str, data_nascimento: str, **kwargs):
        super().__init__(id, nome, email, **kwargs)
        self.cpf = cpf
        self.data_nascimento = data_nascimento
        