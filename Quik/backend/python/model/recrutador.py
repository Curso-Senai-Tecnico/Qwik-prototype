from user import User

class Recrutador(User):
    def __init__(self, id:int, nome:str, email:str,
                 cnpj:str, **kwargs):
        super().__init__(id, nome, email, **kwargs)
        self.cnpj = cnpj
