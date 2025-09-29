from dataclasses import dataclass
from datetime import datetime

@dataclass
class UserEntity:
    id:int
    nome: str
    telefone: str
    senha: str
    login: str
    cidade: str
    estado: str
    bairro: str
