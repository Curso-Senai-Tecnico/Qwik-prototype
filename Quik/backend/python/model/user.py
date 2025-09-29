class User:
    def __init__(self, id: int, nome: str, email: str, **kwargs):
        self.id = id
        self.nome = nome
        self.email = email

        for key, value in kwargs.items():
            setattr(self, key, value)
    
