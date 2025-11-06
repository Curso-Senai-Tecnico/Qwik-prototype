import mysql.connector #seleciona a biblioteca
import os
import time

# ==============================================================================
# 				                  CONHEXÃO
# ==============================================================================

#criei um objeto que vai fazer a conexão com o Mysql
for i in range(20): ## retry adaptado para o docker
    try:
        conexao = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            port=int(os.getenv("MYSQL_PORT", 3306)),
            user="root",
            password=os.getenv("MYSQL_ROOT_PASSWORD")
        )
        #Boolean que vai informar se conseguiu fazer a conexão, usando o ".is_connected" que verifica se a conexão foi realizada
        if conexao.is_connected(): 
            print("Conexão efetuada!")
            break
    except:
        print("Aguardando o MySQL iniciar...")
        time.sleep(3)
else:
    print("Não foi possível conectar ao MySQL.")
    exit(1)



# objeto que vai receber a conexao + função de executar comandos SQL
cursor = conexao.cursor()



# ==============================================================================
# 				            CRIAÇÃO DO DB E DAS TABELAS
# ==============================================================================

#cria o banco de dados
cursor.execute("""CREATE DATABASE IF NOT EXISTS QWIK;""")

#usa o banco de dados
cursor.execute("""USE QWIK;""")

#tabelas:
cursor.execute("""
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,   -- chave primária com auto incremento
    nome VARCHAR(100) NOT NULL,          -- nome do usuário (obrigatório)
    email VARCHAR(250) UNIQUE NOT NULL,   -- email do usuário único e obrigatório
    telefone VARCHAR(15),                -- telefone (opcional)
    login VARCHAR(50) UNIQUE NOT NULL,   -- login único (não pode repetir)
    senha VARCHAR(100) NOT NULL,         -- senha (armazenar hash, não senha em texto puro)
    cidade VARCHAR(100),                 -- cidade do usuário
    estado VARCHAR(50),                  -- estado
    bairro VARCHAR(100)                  -- bairro
);
""")

cursor.execute("""
CREATE TABLE Candidato (
    id INT PRIMARY KEY,                    -- chave primária
    data_nascimento DATE NOT Null,
    cpf VARCHAR(14) UNIQUE,                -- CPF único
    genero ENUM("Masculino", "Feminino", "Prefiro nao dizer"),
    estado_civil VARCHAR(20),
    FOREIGN KEY (id) REFERENCES Usuario(id) -- relação 1:1 com Usuario
);
""")

cursor.execute("""
CREATE TABLE Perfil (
    id_candidato INT PRIMARY KEY,           -- chave primária (mesmo id do candidato)
    foto VARCHAR(255),
    nome_perfil VARCHAR(100),
    data_nascimento_perfil VARCHAR(10),
    curriculo VARCHAR(255),                 -- link ou caminho do currículo
    FOREIGN KEY (id_candidato) REFERENCES Candidato(id)
);
""")

cursor.execute("""
CREATE TABLE Recrutador (
    id INT PRIMARY KEY,                     
    cnpj VARCHAR(18) UNIQUE,                -- CNPJ único
    perfil_recrutador VARCHAR(100),
    FOREIGN KEY (id) REFERENCES Usuario(id) -- cada recrutador é também um usuário
);
""")

cursor.execute("""
CREATE TABLE Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_recrutador INT NOT NULL,
    tipo VARCHAR(50),
    contrato VARCHAR(50),
    cargo VARCHAR(100),
    resumo TEXT,
    responsabilidades TEXT,
    requisitos TEXT,
    beneficios TEXT,
    salario DECIMAL(10,2),
    quantidade INT,
    localizacao VARCHAR(100),
    data_publicacao DATETIME,
    status ENUM("Ativo", "Expirada"),
    tags VARCHAR(255),
    FOREIGN KEY (id_recrutador) REFERENCES Recrutador(id)
);
""")

cursor.execute("""
CREATE TABLE FormaPagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_recrutador INT NOT NULL,
    tipo VARCHAR(50),                       -- ex: 'cartao', 'pix'
    data_criacao DATE,
    status TINYINT(1),                      -- booleano (0 = inativo, 1 = ativo)
    FOREIGN KEY (id_recrutador) REFERENCES Recrutador(id)
);
""")

cursor.execute("""
CREATE TABLE Pagamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_recrutador INT NOT NULL,
    id_pagamento INT,                        -- forma de pagamento usada
    tipo_servico VARCHAR(50),
    valor DECIMAL(10,2),
    data_pagamento DATETIME,
    status VARCHAR(20),
    FOREIGN KEY (id_recrutador) REFERENCES Recrutador(id),
    FOREIGN KEY (id_pagamento) REFERENCES FormaPagamento(id)
);
""")

cursor.execute("""
CREATE TABLE Assinatura (
    id INT PRIMARY KEY,
    tipo VARCHAR(50),                        -- ex: mensal, anual
    data_inicio DATE,
    vencimento DATE,
    forma_pgt ENUM("Pix", "Cartao"),
    id_pagamento INT NOT NULL,
    FOREIGN KEY (id_pagamento) REFERENCES Pagamento(id)
);
""")

cursor.execute("""
CREATE TABLE Cartao (
    id INT PRIMARY KEY,                       -- mesmo id da FormaPagamento
    numero_cartao VARCHAR(20),
    nome_titular VARCHAR(100),
    validade DATE,
    cvv INT,
    FOREIGN KEY (id) REFERENCES FormaPagamento(id)
);
""")

cursor.execute("""
CREATE TABLE Pix (
    id INT PRIMARY KEY,                       -- mesmo id da FormaPagamento
    chave VARCHAR(100),
    tipo_chave VARCHAR(50),                   -- CPF, CNPJ, telefone, e-mail
    FOREIGN KEY (id) REFERENCES FormaPagamento(id)
);
""")

cursor.execute("""
CREATE TABLE Videochamada (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_recrutador INT NOT NULL,
    id_vaga INT NOT NULL,
    log VARCHAR(255),                         -- log da chamada
    record VARCHAR(255),                      -- gravação
    data DATETIME,
    FOREIGN KEY (id_candidato) REFERENCES Candidato(id),
    FOREIGN KEY (id_recrutador) REFERENCES Recrutador(id),
    FOREIGN KEY (id_vaga) REFERENCES Vaga(id)
);
""")

cursor.execute("""
CREATE TABLE PV (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_candidato INT NOT NULL,
    id_recrutador INT NOT NULL,
    log TEXT,                                -- histórico da conversa
    data DATETIME,
    FOREIGN KEY (id_candidato) REFERENCES Candidato(id),
    FOREIGN KEY (id_recrutador) REFERENCES Recrutador(id)
);
""")

# ==============================================================================
# 				           ENCERRAMENTO DA CONEXÃO
# ==============================================================================


def tchau_db():
    conexao.commit() #atualiza o banco de dados
    cursor.close() #fecha o cursor e finda a possibilidade de executar comandos SQL no código
    conexao.close() #encerra a conexão
    return print("Finalizando conexão....")

tchau_db()