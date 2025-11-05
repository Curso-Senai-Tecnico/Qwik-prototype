class Validador:
    def validador_login_vazio(self, login):
        if " " in login:
            return False
        return True
    def validador_senha_vazia(self, senha):
        if " " in senha:
            return False
        return True
    def validador_email_vazio(self, email):
        if " " in email:
            return False
        return True
    def validador_cpf_vazio(self, cpf):
        if " " in cpf:
            return False
        return True
    def validador_cnpj_vazio(self, cnpj):
        if " " in cnpj:
            return False
        return True
    def validador_nome_vazio(self, nome):
        if " " in nome:
            return False
        return True
    def validador_telefone_vazio(self, telefone):
        if " " in telefone:
            return False
        return True
    def validador_bairro_vazio(self, bairro):
        if " " in bairro:
            return False
        return True
    def validador_cidade_vazio(self, cidade):
        if " " in cidade:
            return False
        return True
    def validador_estado_vazio(self, estado):
        if " " in estado:
            return False
        return True
    def validador_data_nascimento_vazia(self, data_nascimento):
        if " " in data_nascimento:
            return False
        return True
    def validador_senha_forte(self, senha):
        if len(senha) < 8:
            return False
        has_upper = any(c.isupper() for c in senha)
        has_lower = any(c.islower() for c in senha)
        has_digit = any(c.isdigit() for c in senha)
        has_special = any(not c.isalnum() for c in senha)
        if has_upper and has_lower and has_digit and has_special:
            return True
        return False
    
class Verificadores:
        def verificar_email_unico(self, email, User):
            if User.objects.filter(email=email).exists():
                return False
            return True
        def verificar_cpf_unico(self, cpf, Candidato):
            if Candidato.objects.filter(cpf=cpf).exists():
                return False
            return True
        def verificar_cnpj_unico(self, cnpj, Recrutador):
            if Recrutador.objects.filter(cnpj=cnpj).exists():
                return False
            return True
        