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
    nome varchar(100) not null,
    email varchar(250) unique not null,
    telefone varchar(15) unique,
    login varchar(50) unique not null,
    senha varchar(255) not null,
    cidade varchar(100),
    estado varchar(100),
    bairro varchar(100)
) default charset = utf8mb4;
""")

cursor.execute("""
insert ignore into usuarios (nome, email, telefone, login, senha, cidade, estado, bairro) values
('Carlos Silva', 'carlos.silva@exemplo.com', '(21) 98765-4321', 'carlossilva', 'hashsenha1', 'Rio de Janeiro', 'RJ', 'Tijuca'),
('Mariana Santos', 'mariana.santos@exemplo.com', '(11) 99887-7665', 'marisan', 'hashsenha2', 'São Paulo', 'SP', 'Pinheiros'),
('Ricardo Oliveira', 'ricardo.oliveira@exemplo.com', '(31) 91234-5678', 'ricardoo', 'hashsenha3', 'Belo Horizonte', 'MG', 'Savassi'),
('Ana Paula Lima', 'ana.lima@exemplo.com', '(41) 96543-2109', 'analima', 'hashsenha4', 'Curitiba', 'PR', 'Centro'),
('Felipe Mendes', 'felipe.mendes@exemplo.com', '(51) 97777-8888', 'felipem', 'hashsenha5', 'Porto Alegre', 'RS', 'Moinhos de Vento'),
('Julia Costa', 'julia.costa@exemplo.com', '(81) 95555-4444', 'juliacosta', 'hashsenha6', 'Recife', 'PE', 'Boa Viagem'),
('Pedro Almeida', 'pedro.almeida@exemplo.com', '(71) 93333-2222', 'pedroal', 'hashsenha7', 'Salvador', 'BA', 'Pituba'),
('Larissa Soares', 'larissa.soares@exemplo.com', '(61) 92222-1111', 'larissas', 'hashsenha8', 'Brasília', 'DF', 'Asa Sul'),
('Gustavo Pereira', 'gustavo.pereira@exemplo.com', '(92) 91111-0000', 'gustavop', 'hashsenha9', 'Manaus', 'AM', 'Adrianópolis'),
('Camila Rocha', 'camila.rocha@exemplo.com', '(85) 90000-9999', 'camilar', 'hashsenha10', 'Fortaleza', 'CE', 'Meireles');
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
insert ignore into candidatos (usuario_id, data_nascimento, cpf, genero, estado_civil) values
(1, '1990-05-15', '111.111.111-11', 'M', 'Casado(a)'),
(2, '1995-10-20', '222.222.222-22', 'F', 'Solteiro(a)'),
(4, '1988-03-01', '444.444.444-44', 'F', 'Divorciado(a)'),
(5, '2000-12-12', '555.555.555-55', 'M', 'Solteiro(a)'),
(6, '1992-07-25', '666.666.666-66', 'F', 'Casado(a)'),
(7, '1985-01-01', '777.777.777-77', 'M', 'Viúvo(a)'),
(9, '1998-09-09', '999.999.999-99', 'M', 'Solteiro(a)'),
(10, '1993-04-18', '000.000.000-00', 'F', 'Divorciado(a)'),
(8, '1996-11-30', '888.888.888-88', 'F', 'Solteiro(a)'),
(3, '1980-02-29', '333.333.333-33', 'M', 'Casado(a)');
""")

# ==========================================
#       tabela de perfil + população 
# ==========================================
# ------ ADICIONAR TAGS EM JSON -------
cursor.execute("""
create table if not exists perfil (
    usuario_id int primary key,
    foto varchar(255) not null,
    nome_perfil varchar(100) not null,
    data_nascimento_perfil date not null,
    curriculo varchar(255),
    tags json,
    foreign key (usuario_id) references usuarios(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert ignore into perfil (usuario_id, foto, nome_perfil, data_nascimento_perfil, curriculo) values
(1, 'QWIK/Qwik-prototype/database/fotos/foto1.jpg', 'Carlos S. Dev', '1990-05-15', 'QWIK/Qwik-prototype/database/curículos/currículo Bárbara C. Almeida .pdf'),
(2, 'QWIK/Qwik-prototype/database/fotos/foto2.jpg', 'Mariana Designer', '1995-10-20', 'QWIK/Qwik-prototype/database/curículos/Currículo de João Gabriel.pdf'),
(3, 'QWIK/Qwik-prototype/database/fotos/foto3.jpg', 'Ricardo Recruta', '1980-02-29', 'QWIK/Qwik-prototype/database/curículos/Currículo D'or.pdf'),
(4, 'QWIK/Qwik-prototype/database/fotos/foto4.jpg', 'Ana Marketing', '1988-03-01', 'QWIK/Qwik-prototype/database/curículos/Currículo Guilherme Galvão Leal18.docx.pdf'),
(5, 'QWIK/Qwik-prototype/database/fotos/foto5.jpg', 'Felipe Eng', '2000-12-12', 'QWIK/Qwik-prototype/database/curículos/Currículo Jamilly Lima Sousa.2.pdf'),
(6, 'QWIK/Qwik-prototype/database/fotos/foto6.jpg', 'Julia Analista', '1992-07-25', 'QWIK/Qwik-prototype/database/curículos/Curriculo João Francisco.pdf'),
(7, 'QWIK/Qwik-prototype/database/fotos/foto7.jpg', 'Pedro Gerente', '1985-01-01', 'QWIK/Qwik-prototype/database/curículos/Curriculo matheus.pdf'),
(8, 'QWIK/Qwik-prototype/database/fotos/foto8.jpg', 'Larissa Estagiaria', '1996-11-30', 'QWIK/Qwik-prototype/database/curículos/Curriculo Myllena Gomes.2024.pdf'),
(9, 'QWIK/Qwik-prototype/database/fotos/foto9.jpg', 'Gustavo Vendas', '1998-09-09', 'QWIK/Qwik-prototype/database/curículos/Currículo Phelipe (2).pdf'),
(10, 'QWIK/Qwik-prototype/database/fotos/foto10.jpg', 'Camila Contadora', '1993-04-18', 'QWIK/Qwik-prototype/database/curículos/Curriculo_Ruan_Veiga_Melengati.pdf');
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
insert ignore into recrutador (usuario_id, cnpj, perfil_recrutador) values
(3, '00.111.222/0001-33', 'Recursos Humanos'),
(7, '11.222.333/0001-44', 'Tech Recruiter'),
(6, '22.333.444/0001-55', 'Generalista'),
(1, '33.444.555/0001-66', 'Especialista em Vendas'),
(2, '44.555.666/0001-77', 'Recrutador Júnior'),
(4, '55.666.777/0001-88', 'Recrutador Sênior'),
(5, '66.777.888/0001-99', 'Analista de RH'),
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
    tags varchar(255), 
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert ignore into vaga (recrutador_id, tipo, contrato, cargo, resumo, responsabilidades, requisitos, beneficios, salario, quantidade, localizacao, data_publicacao, status, tags) values
(3, 'CLT', 'Integral', 'Desenvolvedor Frontend', 'Desenvolvimento de interfaces web.', 'Implementar funcionalidades, garantir usabilidade.', 'HTML, CSS, JavaScript, React', 'Vale Transporte, Vale Refeição, Plano de Saúde', 5000.00, 2, 'São Paulo - SP', '2025-10-20', 'Ativa', 'Frontend, React, Web'),
(7, 'PJ', 'Integral', 'Analista de Dados', 'Análise de dados e criação de relatórios.', 'Coletar, limpar e analisar dados.', 'SQL, Python, Power BI', 'Bônus por performance, Flexibilidade de Horário', 6500.00, 1, 'Remoto', '2025-10-21', 'Ativa', 'Dados, SQL, Python'),
(6, 'Estágio', 'Parcial', 'Assistente Administrativo', 'Suporte a tarefas administrativas.', 'Organização de documentos, atendimento telefônico.', 'Pacote Office, Boa comunicação', 'Bolsa Auxílio, Recesso Remunerado', 1500.00, 3, 'Rio de Janeiro - RJ', '2025-10-22', 'Ativa', 'Administrativo, Office'),
(1, 'CLT', 'Integral', 'Gerente de Vendas', 'Gestão de equipe e metas de vendas.', 'Liderar equipe, planejar estratégias.', 'Experiência em liderança, Negociação', 'Comissão, Carro da empresa, Plano Odontológico', 10000.00, 1, 'Belo Horizonte - MG', '2025-10-15', 'Expirada', 'Vendas, Liderança'),
(2, 'PJ', 'Híbrido', 'Designer UX/UI', 'Criação de protótipos e interfaces.', 'Pesquisar usuários, desenhar wireframes.', 'Figma, Adobe XD, Pesquisa UX', 'Auxílio Home Office, Cursos e Certificações', 4500.00, 1, 'Curitiba - PR', '2025-10-23', 'Ativa', 'Design, UX, UI, Figma'),
(4, 'CLT', 'Integral', 'Engenheiro de Software Backend', 'Desenvolvimento e manutenção de APIs.', 'Programar em Java/Spring, testar código.', 'Java, Spring Boot, Microserviços', 'Participação nos Lucros, Seguro de Vida', 8000.00, 2, 'Porto Alegre - RS', '2025-10-24', 'Ativa', 'Backend, Java, Spring'),
(5, 'CLT', 'Integral', 'Analista de Marketing Digital', 'Gestão de campanhas e redes sociais.', 'Criar conteúdo, analisar métricas.', 'Google Ads, Facebook Ads, SEO', 'Vale Cultura, Day Off Aniversário', 4000.00, 1, 'Recife - PE', '2025-10-25', 'Ativa', 'Marketing, Digital, SEO'),
(8, 'PJ', 'Remoto', 'Consultor Financeiro', 'Consultoria e planejamento financeiro para clientes.', 'Elaborar orçamentos, analisar investimentos.', 'Experiência em finanças, Certificações', 'Flexibilidade de Horário, Autonomia', 7500.00, 1, 'Remoto', '2025-10-10', 'Expirada', 'Finanças, Consultoria'),
(9, 'CLT', 'Integral', 'Técnico de Suporte TI', 'Suporte técnico a usuários e sistemas.', 'Resolver problemas de hardware e software.', 'Redes, Windows Server, Linux', 'Plano de Carreira, Vale Alimentação', 3000.00, 3, 'Brasília - DF', '2025-10-26', 'Ativa', 'TI, Suporte, Redes'),
(10, 'Estágio', 'Parcial', 'Desenvolvedor Mobile Android', 'Desenvolvimento de funcionalidades em apps Android.', 'Codificar em Kotlin, testar o app.', 'Kotlin, Android Studio, APIs REST', 'Bolsa Auxílio, Mentoria', 1800.00, 1, 'Fortaleza - CE', '2025-10-27', 'Ativa', 'Mobile, Android, Kotlin');
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
insert ignore into formapagamento (recrutador_id, tipo, status) values
(3, 'Cartão', 'Ativo'),
(7, 'Pix', 'Ativo'),
(6, 'Cartão', 'Ativo'),
(1, 'Pix', 'Inativo'),
(2, 'Cartão', 'Ativo'),
(4, 'Pix', 'Ativo'),
(5, 'Cartão', 'Inativo'),
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
    tipo_serviço varchar(50) not null,
    valor decimal(10,2) not null,
    data_pagamento datetime default current_timestamp,
    status varchar(10) not null check (status in ('Ativo', 'Expirado')) default 'Ativo',
    foreign key (recrutador_id) references recrutador(usuario_id) on delete cascade,
    foreign key (formapagamento_id) references formapagamento(id) on delete cascade
) default charset = utf8mb4;
""")

cursor.execute("""
insert ignore into pagamento (recrutador_id, formapagamento_id, tipo_serviço, valor, status) values
(3, 1, 'Plano Mensal', 199.90, 'Ativo'),
(7, 2, 'Destaque Vaga', 49.90, 'Ativo'),
(6, 3, 'Plano Anual', 1999.00, 'Ativo'),
(1, 4, 'Plano Mensal', 199.90, 'Ativo'),
(2, 5, 'Destaque Vaga', 49.90, 'Ativo'),
(4, 6, 'Plano Mensal', 199.90, 'Ativo'),
(5, 7, 'Plano Anual', 1999.00, 'Ativo'),
(8, 8, 'Destaque Vaga', 49.90, 'Ativo'),
(9, 9, 'Plano Mensal', 199.90, 'Ativo'),
(10, 10, 'Plano Anual', 1999.00, 'Expirado');
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
insert ignore into assinatura (pagamento_id, tipo, data_inicio, data_vencimento, forma_pgt) values
(1, 'Básico', '2025-10-01 10:00:00', '2025-11-01', 'Cartão'),
(3, 'Premium', '2025-09-15 15:30:00', '2026-09-15', 'Cartão'),
(4, 'Básico', '2025-10-25 08:00:00', '2025-11-25', 'Pix'),
(6, 'Básico', '2025-10-05 14:00:00', '2025-11-05', 'Pix'),
(7, 'Premium', '2025-09-01 11:00:00', '2026-09-01', 'Cartão'),
(9, 'Básico', '2025-10-10 09:00:00', '2025-11-10', 'Cartão'),
(10, 'Premium', '2024-10-01 12:00:00', '2025-10-01', 'Pix'),
(5, 'Básico', '2025-10-28 16:00:00', '2025-11-28', 'Cartão'),
(8, 'Premium', '2025-10-07 13:00:00', '2026-10-07', 'Pix'),
(2, 'Básico', '2025-10-29 17:00:00', '2025-11-29', 'Pix');
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
insert ignore into cartao (formapagamento_id, numero_cartao, nome_titular, validade, cvv) values
(1, '1234567890123456', 'RICARDO OLIVEIRA', '12/2028', '123'),
(3, '9876543210987654', 'JULIA COSTA', '05/2027', '456'),
(5, '1111222233334444', 'MARIANA SANTOS', '01/2026', '789'),
(7, '5555666677778888', 'FELIPE MENDES', '10/2029', '012'),
(9, '9999000011112222', 'GUSTAVO PEREIRA', '03/2025', '345'),
(2, '1357924680135790', 'PEDRO ALMEIDA', '07/2030', '678'),
(4, '0246813579024681', 'CARLOS SILVA', '09/2026', '901'),
(6, '1470369258147036', 'ANA PAULA LIMA', '11/2025', '234'),
(8, '2581470369258147', 'LARISSA SOARES', '04/2027', '567'),
(10, '3692581470369258', 'CAMILA ROCHA', '06/2028', '890');
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
insert ignore into pix (formapagamento_id, tipo_de_chave, chave) values
(2, 'EMAIL', 'pedro.almeida@exemplo.com'),
(4, 'TELEFONE', '(21) 98765-4321'),
(6, 'CPF', '55.666.777/0001-88'),
(8, 'ALEATORIA', 'a1b2c3d4e5f6g7h8i9j0'),
(10, 'EMAIL', 'camila.rocha@exemplo.com'),
(1, 'TELEFONE', '(31) 91234-5678'),
(3, 'CPF', '22.333.444/0001-55'),
(5, 'ALEATORIA', 'z9y8x7w6v5u4t3s2r1q0'),
(7, 'EMAIL', 'felipe.mendes@exemplo.com'),
(9, 'TELEFONE', '(92) 91111-0000');
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

cursor.execute("""
insert ignore into video_chamada (candidato_id, recrutador_id, vaga_id, log, record, data_realizacao) values
(1, 3, 1, 'Log da chamada 1', 'link/gravacao1', '2025-10-30 10:00:00'),
(2, 7, 2, 'Log da chamada 2', 'link/gravacao2', '2025-10-30 14:30:00'),
(4, 6, 3, 'Log da chamada 3', null, '2025-10-31 09:00:00'),
(5, 4, 6, 'Log da chamada 4', 'link/gravacao4', '2025-10-31 11:30:00'),
(6, 1, 4, 'Log da chamada 5', null, '2025-11-01 15:00:00'),
(7, 2, 5, 'Log da chamada 6', 'link/gravacao6', '2025-11-04 10:00:00'),
(9, 5, 7, 'Log da chamada 7', null, '2025-11-04 13:00:00'),
(10, 8, 8, 'Log da chamada 8', 'link/gravacao8', '2025-11-05 09:30:00'),
(8, 9, 9, 'Log da chamada 9', null, '2025-11-05 14:00:00'),
(3, 10, 10, 'Log da chamada 10', 'link/gravacao10', '2025-11-06 16:00:00');
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

cursor.execute("""
insert ignore into chat_pv (candidato_id, recrutador_id, log, data) values
(1, 3, 'Início da conversa com Carlos.', '2025-10-28 10:00:00'),
(2, 7, 'Mariana enviou o portfólio.', '2025-10-28 11:30:00'),
(4, 6, 'Dúvidas sobre a vaga 3 esclarecidas.', '2025-10-29 14:00:00'),
(5, 4, 'Felipe perguntou sobre a tecnologia.', '2025-10-29 16:30:00'),
(6, 1, 'Agendamento de entrevista com Julia.', '2025-10-30 09:00:00'),
(7, 2, 'Pedro confirmou o horário.', '2025-10-30 11:00:00'),
(9, 5, 'Gustavo solicitou feedback.', '2025-10-31 15:00:00'),
(10, 8, 'Camila questionou o salário.', '2025-11-01 08:00:00'),
(8, 9, 'Larissa enviou CV atualizado.', '2025-11-04 14:00:00'),
(3, 10, 'Ricardo recebeu a proposta.', '2025-11-05 10:30:00');
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