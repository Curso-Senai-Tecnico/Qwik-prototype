class Val:
    def verificar_doc(self, value):
        if len(value) == 11: 
            return "cpf"
        elif len(value) == 14:
            return "cnpj"

    def verificar_senha(self, senha):
        if len(senha) < 8:
            return False
        
        has_upper = any(c.isupper() for c in senha)                     # Verifica se há letra maiúscula
        has_lower = any(c.islower() for c in senha)                     # Verifica se há letra minúscula
        has_digit = any(c.isdigit() for c in senha)                     # Verifica se há dígito
        has_special = any(not c.isalnum() for c in senha)               # Verifica se há caractere especial
        return all(has_upper, has_lower, has_digit, has_special)        # Retorna True se todos os critérios forem atendidos