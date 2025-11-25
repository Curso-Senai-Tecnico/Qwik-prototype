import mysql.connector #seleciona a biblioteca
import os
import time

# ==============================================================================
# 				                  CONEXÃO
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

#cria o banco de dados e adiciona os comando de UTF8, que permitem abranger mais caracteres
cursor.execute("""
               create database if not exists qwik
               default character set utf8mb4
               default collate utf8mb4_general_ci;
""")


#usa o banco de dados
cursor.execute("""use qwik;""")

#tabelas:

# ==========================================
#      tabela de usuários + população 
# ==========================================

cursor.execute("""
create table if not exists usuarios (
    id int auto_increment primary key,
    nome varchar(255) not null,
    email varchar(250) unique not null,
    telefone varchar(15) unique,
    role varchar(20) not null,
    password varchar(255) not null,
    cidade varchar(100),
    estado varchar(100),
    bairro varchar(100),
    is_superuser boolean not null default 0,
    is_staff boolean not null default 0,
    is_active boolean not null default 1,
    last_login datetime null,
    date_joined datetime not null default current_timestamp
) default charset = utf8mb4;
""")
cursor.execute("""
insert  into usuarios (nome, email, telefone, role, password, cidade, estado, bairro) values
('Carlos Silva', 'carlos.silva@exemplo.com', '(21) 98765-4321', 'candidato', 'hashsenha1', 'Rio de Janeiro', 'RJ', 'Tijuca'),
('Mariana Santos', 'mariana.santos@exemplo.com', '(11) 99887-7665', 'candidato', 'hashsenha2', 'São Paulo', 'SP', 'Pinheiros'),
('Ricardo Oliveira', 'ricardo.oliveira@exemplo.com', '(31) 91234-5678', 'candidato', 'hashsenha3', 'Belo Horizonte', 'MG', 'Savassi'),
('Ana Paula Lima', 'ana.lima@exemplo.com', '(41) 96543-2109', 'candidato', 'hashsenha4', 'Curitiba', 'PR', 'Centro'),
('Felipe Mendes', 'felipe.mendes@exemplo.com', '(51) 97777-8888', 'candidato', 'hashsenha5', 'Porto Alegre', 'RS', 'Moinhos de Vento'),
('Julia Costa', 'julia.costa@exemplo.com', '(81) 95555-4444', 'recrutador', 'hashsenha6', 'Recife', 'PE', 'Boa Viagem'),
('Pedro Almeida', 'pedro.almeida@exemplo.com', '(71) 93333-2222', 'recrutador', 'hashsenha7', 'Salvador', 'BA', 'Pituba'),
('Larissa Soares', 'larissa.soares@exemplo.com', '(61) 92222-1111', 'recrutador', 'hashsenha8', 'Brasília', 'DF', 'Asa Sul'),
('Gustavo Pereira', 'gustavo.pereira@exemplo.com', '(92) 91111-0000', 'recrutador', 'hashsenha9', 'Manaus', 'AM', 'Adrianópolis'),
('Camila Rocha', 'camila.rocha@exemplo.com', '(85) 90000-9999', 'recrutador', 'hashsenha10', 'Fortaleza', 'CE', 'Meireles');
""")

# ==========================================
#     tabela de candidatos + população 
# ==========================================

cursor.execute("""
create table if not exists candidatos (
    usuario_id int primary key,
    data_nascimento date not null,
    cpf varchar(14) unique not null,
    genero varchar(20) not null check (genero in ('M', 'F', 'OUTRO')),
    estado_civil varchar(15) not null check (estado_civil in ('Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)')),
    foreign key (usuario_id) references usuarios(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into candidatos (usuario_id, data_nascimento, cpf, genero, estado_civil) values
(1, '1990-05-15', '111.111.111-11', 'M', 'Casado(a)'),
(2, '1995-10-20', '222.222.222-22', 'F', 'Solteiro(a)'),
(4, '1988-03-01', '444.444.444-44', 'F', 'Divorciado(a)'),
(5, '2000-12-12', '555.555.555-55', 'M', 'Solteiro(a)'),
(3, '1980-02-29', '333.333.333-33', 'M', 'Casado(a)');
""")

cursor.execute("""
create table if not exists tag(
id int auto_increment primary key,
nome varchar(50) unique
);
""")

cursor.execute("""
insert  into tag(nome) values
('HTML'),
('CSS'),
('Javascript'),
('Java'),
('Python'),
('Desenvolvimento de Sistemas'),
('Análise de Dados'),
('Ciência de Dados'),
('Frontend'),
('Backend');
""")

# ==========================================
#       tabela de perfil + população 
# ==========================================
# ------ ADICIONAR TAGS EM JSON -------
cursor.execute("""
create table if not exists perfil (
    candidato_id int primary key,
    foto varchar(255) not null,
    nome_perfil varchar(100) not null,
    data_nascimento_perfil date not null,
    curriculo varchar(255),
    foreign key (candidato_id) references candidatos(usuario_id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into perfil (candidato_id, foto, nome_perfil, data_nascimento_perfil, curriculo) values
(1, 'database/fotos/foto1.jpg', 'Carlos S. Dev', '1990-05-15', 'database/curriculos/curriculo_alexandre.pdf'),
(2, 'database/fotos/foto2.jpg', 'Mariana Designer', '1995-10-20', 'database/curriculos/curriculo_barbara.pdf'),
(3, 'database/fotos/foto3.jpg', 'Ricardo Recruta', '1980-02-29', 'database/curriculos/curriculo_francisco.pdf'),
(4, 'database/fotos/foto4.jpg', 'Ana Marketing', '1988-03-01', 'database/curriculos/curriculo_gabriel.pdf'),
(5, 'database/fotos/foto5.jpg', 'Felipe Eng', '2000-12-12', 'database/curriculos/curriculo_guilherme.pdf');
""")


# ==========================================
#     tabela de recrutador + população 
# ==========================================

cursor.execute("""
create table if not exists recrutador (
    usuario_id int primary key,
    cnpj varchar(18) unique,
    perfil_recrutador varchar(100) not null,
    foreign key (usuario_id) references usuarios(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into recrutador (usuario_id, cnpj, perfil_recrutador) values
(7, '11.222.333/0001-44', 'Tech Recruiter'),
(6, '22.333.444/0001-55', 'Generalista'),
(8, '77.888.999/0001-00', 'Diretor de RH'),
(9, '88.999.000/0001-11', 'Consultor de Talentos'),
(10, '99.000.111/0001-22', 'Gerente de Contratação');
""")



# ==========================================
#        tabela de vagas + população 
# ==========================================

cursor.execute("""
create table if not exists vaga (
    id int auto_increment primary key,
    recrutador_id int not null,
    tipo varchar(50) not null,
    contrato varchar(50) not null,
    cargo varchar(100) not null,
    resumo text not null,
    responsabilidades text not null,
    requisitos text not null,
    beneficios text not null,
    salario decimal(10,2) not null,
    quantidade int not null,
    localizacao varchar(200) not null,
    data_publicacao date not null,
    status varchar(10) not null check (status in ('Ativa', 'Expirada')) default 'Ativa',
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into vaga (recrutador_id, tipo, contrato, cargo, resumo, responsabilidades, requisitos, beneficios, salario, quantidade, localizacao, data_publicacao, status) values
(7, 'CLT', 'Integral', 'Desenvolvedor Frontend', 'Desenvolvimento de interfaces web.', 'Implementar funcionalidades, garantir usabilidade.', 'HTML, CSS, JavaScript, React', 'Vale Transporte, Vale Refeição, Plano de Saúde', 5000.00, 2, 'São Paulo - SP', '2025-10-20', 'Ativa'),
(7, 'PJ', 'Integral', 'Analista de Dados', 'Análise de dados e criação de relatórios.', 'Coletar, limpar e analisar dados.', 'SQL, Python, Power BI', 'Bônus por performance, Flexibilidade de Horário', 6500.00, 1, 'Remoto', '2025-10-21', 'Ativa'),
(6, 'Estágio', 'Parcial', 'Assistente Administrativo', 'Suporte a tarefas administrativas.', 'Organização de documentos, atendimento telefônico.', 'Pacote Office, Boa comunicação', 'Bolsa Auxílio, Recesso Remunerado', 1500.00, 3, 'Rio de Janeiro - RJ', '2025-10-22', 'Ativa'),
(6, 'CLT', 'Integral', 'Gerente de Vendas', 'Gestão de equipe e metas de vendas.', 'Liderar equipe, planejar estratégias.', 'Experiência em liderança, Negociação', 'Comissão, Carro da empresa, Plano Odontológico', 10000.00, 1, 'Belo Horizonte - MG', '2025-10-15', 'Expirada'),
(8, 'PJ', 'Híbrido', 'Designer UX/UI', 'Criação de protótipos e interfaces.', 'Pesquisar usuários, desenhar wireframes.', 'Figma, Adobe XD, Pesquisa UX', 'Auxílio Home Office, Cursos e Certificações', 4500.00, 1, 'Curitiba - PR', '2025-10-23', 'Ativa'),
(9, 'CLT', 'Integral', 'Engenheiro de Software Backend', 'Desenvolvimento e manutenção de APIs.', 'Programar em Java/Spring, testar código.', 'Java, Spring Boot, Microserviços', 'Participação nos Lucros, Seguro de Vida', 8000.00, 2, 'Porto Alegre - RS', '2025-10-24', 'Ativa'),
(10, 'CLT', 'Integral', 'Analista de Marketing Digital', 'Gestão de campanhas e redes sociais.', 'Criar conteúdo, analisar métricas.', 'Google Ads, Facebook Ads, SEO', 'Vale Cultura, Day Off Aniversário', 4000.00, 1, 'Recife - PE', '2025-10-25', 'Ativa'),
(8, 'PJ', 'Remoto', 'Consultor Financeiro', 'Consultoria e planejamento financeiro para clientes.', 'Elaborar orçamentos, analisar investimentos.', 'Experiência em finanças, Certificações', 'Flexibilidade de Horário, Autonomia', 7500.00, 1, 'Remoto', '2025-10-10', 'Expirada'),
(9, 'CLT', 'Integral', 'Técnico de Suporte TI', 'Suporte técnico a usuários e sistemas.', 'Resolver problemas de hardware e software.', 'Redes, Windows Server, Linux', 'Plano de Carreira, Vale Alimentação', 3000.00, 3, 'Brasília - DF', '2025-10-26', 'Ativa'),
(10, 'Estágio', 'Parcial', 'Desenvolvedor Mobile Android', 'Desenvolvimento de funcionalidades em apps Android.', 'Codificar em Kotlin, testar o app.', 'Kotlin, Android Studio, APIs REST', 'Bolsa Auxílio, Mentoria', 1800.00, 1, 'Fortaleza - CE', '2025-10-27', 'Ativa');
""")

cursor.execute("""
create table if not exists VagaTag(
vaga_id int,
tag_id int,
primary key (vaga_id, tag_id),
foreign key (vaga_id) references vaga(id) on delete cascade,
foreign key (tag_id) references tag(id) on delete cascade);
""")

cursor.execute("""
INSERT  INTO VagaTag (vaga_id, tag_id) VALUES
-- Vaga 1
(1, 3), (1, 7), (1, 1), (1, 9), (1, 5),
-- Vaga 2
(2, 2), (2, 6), (2, 8), (2, 4), (2, 10),
-- Vaga 3
(3, 1), (3, 4), (3, 6), (3, 7), (3, 9),
-- Vaga 4
(4, 5), (4, 2), (4, 8), (4, 10), (4, 3),
-- Vaga 5
(5, 6), (5, 1), (5, 7), (5, 9), (5, 4),
-- Vaga 6
(6, 2), (6, 5), (6, 8), (6, 10), (6, 3),
-- Vaga 7
(7, 1), (7, 6), (7, 9), (7, 4), (7, 7),
-- Vaga 8
(8, 2), (8, 5), (8, 10), (8, 3), (8, 8),
-- Vaga 9
(9, 4), (9, 1), (9, 6), (9, 7), (9, 9),
-- Vaga 10
(10, 2), (10, 3), (10, 5), (10, 8), (10, 10);
""")
cursor.execute("""
create table if not exists PerfilTag(
perfil_id int,
tag_id int,
primary key (perfil_id, tag_id),
foreign key (perfil_id) references perfil(candidato_id) on delete cascade,
foreign key (tag_id) references tag(id) on delete cascade);
""")

cursor.execute("""
INSERT INTO PerfilTag (perfil_id, tag_id) VALUES

(1, 2), (1, 5), (1, 7), (1, 9), (1, 10),
(2, 1), (2, 3), (2, 4), (2, 6), (2, 8),
(3, 2), (3, 4), (3, 6), (3, 7), (3, 9),
(4, 1), (4, 3), (4, 5), (4, 8), (4, 10),
(5, 2), (5, 4), (5, 6), (5, 7), (5, 9);
""")
# ==========================================
#  tabela de forma de pagamento + população 
# ==========================================

cursor.execute("""
create table if not exists formapagamento (
    id int auto_increment primary key,
    recrutador_id int not null,
    tipo varchar(50) not null,
    data_criacao datetime default current_timestamp,
    status varchar(10) not null check (status in ('Ativo', 'Inativo')) default 'Ativo',
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into formapagamento (recrutador_id, tipo, status) values
(7, 'Pix', 'Ativo'),
(6, 'Cartão', 'Ativo'),
(8, 'Pix', 'Ativo'),
(9, 'Cartão', 'Ativo'),
(10, 'Pix', 'Ativo');
""")

# ==========================================
#  tabela de pagamento + população 
# ==========================================

cursor.execute("""
create table if not exists pagamento (
    id int auto_increment primary key,
    recrutador_id int not null,
    formapagamento_id int not null,
    tipo_servico varchar(50) not null,
    valor decimal(10,2) not null,
    data_pagamento datetime default current_timestamp,
    status varchar(10) not null check (status in ('Ativo', 'Expirado')) default 'Ativo',
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade,
    foreign key (formapagamento_id) references formapagamento(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into pagamento (recrutador_id, formapagamento_id, tipo_servico, valor, status) values
(7, 1, 'Destaque Vaga', 49.90, 'Ativo'),
(6, 2, 'Plano Anual', 1999.00, 'Ativo'),
(8, 3, 'Destaque Vaga', 49.90, 'Ativo'),
(9, 4, 'Plano Mensal', 199.90, 'Ativo'),
(10, 5, 'Plano Anual', 1999.00, 'Expirado');
""")

# ==========================================
#  tabela de assinatura + população 
# ==========================================

cursor.execute("""
create table if not exists assinatura (
    id int auto_increment primary key,
    pagamento_id int not null,
    tipo varchar(50) not null,
    data_inicio datetime default current_timestamp not null,
    data_vencimento date not null,
    forma_pgt varchar(6) not null check (forma_pgt in ('Cartão', 'Pix')),
    foreign key (pagamento_id) references pagamento(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into assinatura (pagamento_id, tipo, data_inicio, data_vencimento, forma_pgt) values
(1, 'Básico', '2025-10-05 14:00:00', '2025-11-05', 'Pix'),
(2, 'Premium', '2025-09-01 11:00:00', '2026-09-01', 'Cartão'),
(3, 'Básico', '2025-10-10 09:00:00', '2025-11-10', 'Cartão'),
(4, 'Premium', '2024-10-01 12:00:00', '2025-10-01', 'Pix'),
(5, 'Premium', '2025-10-07 13:00:00', '2026-10-07', 'Pix');
""")

# ==========================================
#  tabela de cartao + população 
# ==========================================

cursor.execute("""
create table if not exists cartao (
    formapagamento_id int primary key,
    numero_cartao varchar(20) not null,
    nome_titular varchar(100) not null,
    validade char(7) not null,
    cvv char(4) not null,
    foreign key (formapagamento_id) references formapagamento(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into cartao (formapagamento_id, numero_cartao, nome_titular, validade, cvv) values
(2, '9999000011112222', 'GUSTAVO PEREIRA', '03/2025', '345'),
(4, '2581470369258147', 'LARISSA SOARES', '04/2027', '567');
""")

# ==========================================
#  tabela de pix + população 
# ==========================================

cursor.execute("""
create table if not exists pix (
    formapagamento_id int primary key,
    tipo_de_chave varchar(10) not null check (tipo_de_chave in ('EMAIL', 'TELEFONE', 'CPF', 'ALEATORIA')),
    chave varchar(150) not null,
    foreign key (formapagamento_id) references formapagamento(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert  into pix (formapagamento_id, tipo_de_chave, chave) values
(1, 'CPF', '55.666.777/0001-88'),
(3, 'ALEATORIA', 'a1b2c3d4e5f6g7h8i9j0'),
(5, 'EMAIL', 'camila.rocha@exemplo.com');
""")

# ==========================================
#  tabela de vídeo chamada + população       #PROVÁVEL ALTERAÇÃO
# ==========================================

cursor.execute("""
create table if not exists video_chamada (
    id int auto_increment primary key,
    candidato_id int not null,
    recrutador_id int not null,
    vaga_id int not null,
    log varchar(255),
    record varchar(255),
    data_realizacao datetime default current_timestamp,
    foreign key (candidato_id) references candidatos(usuario_id) on delete cascade,
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade,
    foreign key (vaga_id) references vaga(id) on delete cascade
) default charset = utf8mb4;
""")

# ==========================================
#  tabela de pv + população 
# ==========================================

cursor.execute("""
create table if not exists chat_pv (
    id int auto_increment primary key,
    candidato_id int not null,
    recrutador_id int not null,
    log text,
    data datetime default current_timestamp,
    foreign key (candidato_id) references candidatos(usuario_id) on delete cascade,
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade
) default charset = utf8mb4;
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