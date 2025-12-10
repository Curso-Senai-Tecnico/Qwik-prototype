USE railway;

-- ==========================================
-- Tabela usuarios
-- ==========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    telefone VARCHAR(15) UNIQUE,
    role VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    cidade VARCHAR(100),
    estado VARCHAR(100),
    bairro VARCHAR(100),
    is_superuser BOOLEAN NOT NULL DEFAULT 0,
    is_staff BOOLEAN NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    last_login DATETIME NULL,
    date_joined DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) DEFAULT CHARSET=utf8mb4;

INSERT INTO usuarios (nome, email, telefone, role, password, cidade, estado, bairro) VALUES
('Carlos Silva', 'carlos.silva@exemplo.com', '(21) 98765-4321', 'candidato', 'pbkdf2_sha256$1000000$CqnFR2GKno1DENy4UcJf0x$H3IfArKXQCcTFYQX0T3yKrSs/plbbBuv9/3KBEjOB5o=', 'Rio de Janeiro', 'RJ', 'Tijuca'), 
('Mariana Santos', 'mariana.santos@exemplo.com', '(11) 99887-7665', 'candidato', 'pbkdf2_sha256$1000000$Fr5lj4yleI9x9XPcJ3D6z7$j6Xt6z9I3pHCUe6K5s8CeZiJHbJ1xucHmCyRUeTZYN8=', 'São Paulo', 'SP', 'Pinheiros'),
('Ricardo Oliveira', 'ricardo.oliveira@exemplo.com', '(31) 91234-5678', 'candidato', 'pbkdf2_sha256$1000000$UsdLVsm6QhXgheCls4HZ1z$c1U94xssfqLJBbFne9ZOQvqQBU/+dlx5zaUnpmUqF6Y=', 'Belo Horizonte', 'MG', 'Savassi'),
('Ana Paula Lima', 'ana.lima@exemplo.com', '(41) 96543-2109', 'candidato', 'pbkdf2_sha256$1000000$KgujLbdvitbwz0i1bUjiwb$hJPWeYZDgFHJQ1LPoW4eMa5XbTbGbq83dA+rn0Gq8RI=', 'Curitiba', 'PR', 'Centro'),
('Felipe Mendes', 'felipe.mendes@exemplo.com', '(51) 97777-8888', 'candidato', 'pbkdf2_sha256$1000000$uu8yQsrEHdkdFcC5GdgZVf$kqlCkbgeYZIfXrFrKTlyjPOCaApMFc9i7SwiLHUvcyY=', 'Porto Alegre', 'RS', 'Moinhos de Vento'),
('Julia Costa', 'julia.costa@exemplo.com', '(81) 95555-4444', 'recrutador', 'pbkdf2_sha256$1000000$1KY1it6d9UvwHIO6Hx9eB7$rTjB07CSolyDjjHqbMr/VATx8/g+/7OEspwUVxDwbNU=', 'Recife', 'PE', 'Boa Viagem'),
('Pedro Almeida', 'pedro.almeida@exemplo.com', '(71) 93333-2222', 'recrutador', 'pbkdf2_sha256$1000000$jQmdF3JMCz2GghKGNEeLxo$E3wYSHguCY0neWztf5h3/UNe+GJ1wAtHFF+9RV0EedU=', 'Salvador', 'BA', 'Pituba'),
('Larissa Soares', 'larissa.soares@exemplo.com', '(61) 92222-1111', 'recrutador', 'pbkdf2_sha256$1000000$hdO2CyVZRwg2SARktruf8k$GZXOK6hCUhC9x6PJMFDPGB/2mLQpHdoeCY+WOqPq4bM=', 'Brasília', 'DF', 'Asa Sul'),
('Gustavo Pereira', 'gustavo.pereira@exemplo.com', '(92) 91111-0000', 'recrutador', 'pbkdf2_sha256$1000000$pDw9EUtQWGMA42GWjvJJMA$eWDvzlr0gVEhGmkXwDpwn0EcIKkUT6yBLhS1mjcTLjI=', 'Manaus', 'AM', 'Adrianópolis'),
('Camila Rocha', 'camila.rocha@exemplo.com', '(85) 90000-9999', 'recrutador', 'pbkdf2_sha256$1000000$8nPo2hJWqnCYaaXKNdX81o$viKrUpxBib9cMNPa8go0ZXz0C7WizTeMtgLp24pR254=', 'Fortaleza', 'CE', 'Meireles');

-- ==========================================
-- Tabela candidatos
-- ==========================================
CREATE TABLE IF NOT EXISTS candidatos (
    usuario_id INT PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('M', 'F', 'OUTRO')),
    estado_civil VARCHAR(15) NOT NULL CHECK (estado_civil IN ('Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO candidatos (usuario_id, data_nascimento, cpf, genero, estado_civil) VALUES
(1, '1990-05-15', '111.111.111-11', 'M', 'Casado(a)'),
(2, '1995-10-20', '222.222.222-22', 'F', 'Solteiro(a)'),
(4, '1988-03-01', '444.444.444-44', 'F', 'Divorciado(a)'),
(5, '2000-12-12', '555.555.555-55', 'M', 'Solteiro(a)'),
(3, '1980-02-29', '333.333.333-33', 'M', 'Casado(a)');

-- ==========================================
-- Tabela tag
-- ==========================================
CREATE TABLE IF NOT EXISTS tag(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE
);

INSERT INTO tag(nome) VALUES
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

-- ==========================================
-- Tabela perfil
-- ==========================================
CREATE TABLE IF NOT EXISTS perfil (
    candidato_id INT PRIMARY KEY,
    foto VARCHAR(255),
    nome_perfil VARCHAR(100),
    data_nascimento_perfil DATE,
    curriculo VARCHAR(255),
    FOREIGN KEY (candidato_id) REFERENCES candidatos(usuario_id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO perfil (candidato_id, foto, nome_perfil, data_nascimento_perfil, curriculo) VALUES
(1, 'fotos/foto1.jpg', 'Carlos S. Dev', '1990-05-15', 'curriculos/curriculo_alexandre.pdf'),
(2, 'fotos/foto2.jpg', 'Mariana Designer', '1995-10-20', 'curriculos/curriculo_barbara.pdf'),
(3, 'fotos/foto3.jpg', 'Ricardo Recruta', '1980-02-29', 'curriculos/curriculo_francisco.pdf'),
(4, 'fotos/foto4.jpg', 'Ana Marketing', '1988-03-01', 'curriculos/curriculo_gabriel.pdf'),
(5, 'fotos/foto5.jpg', 'Felipe Eng', '2000-12-12', 'curriculos/curriculo_guilherme.pdf');

-- ==========================================
-- Tabela recrutador
-- ==========================================
CREATE TABLE IF NOT EXISTS recrutador (
    usuario_id INT PRIMARY KEY,
    cnpj VARCHAR(18) UNIQUE,
    perfil_recrutador VARCHAR(100) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO recrutador (usuario_id, cnpj, perfil_recrutador) VALUES
(7, '11.222.333/0001-44', 'Tech Recruiter'),
(6, '22.333.444/0001-55', 'Generalista'),
(8, '77.888.999/0001-00', 'Diretor de RH'),
(9, '88.999.000/0001-11', 'Consultor de Talentos'),
(10, '99.000.111/0001-22', 'Gerente de Contratação');

-- ==========================================
-- Tabela vaga
-- ==========================================
CREATE TABLE IF NOT EXISTS vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recrutador_id INT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    contrato VARCHAR(50) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    resumo TEXT NOT NULL,
    responsabilidades TEXT NOT NULL,
    requisitos TEXT NOT NULL,
    beneficios TEXT NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    localizacao VARCHAR(200) NOT NULL,
    data_publicacao DATE NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('Ativa', 'Expirada')) DEFAULT 'Ativa',
    FOREIGN KEY (recrutador_id) REFERENCES recrutador(usuario_id) ON DELETE CASCADE
) DEFAULT CHARSET=utf8mb4;

INSERT INTO vaga (recrutador_id, tipo, contrato, cargo, resumo, responsabilidades, requisitos, beneficios, salario, quantidade, localizacao, data_publicacao, status) VALUES
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

-- ==========================================
-- VagaTag
-- ==========================================
CREATE TABLE IF NOT EXISTS VagaTag(
    vaga_id INT,
    tag_id INT,
    PRIMARY KEY (vaga_id, tag_id),
    FOREIGN KEY (vaga_id) REFERENCES vaga(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

INSERT INTO VagaTag (vaga_id, tag_id) VALUES
(1, 3), (1, 7), (1, 1), (1, 9), (1, 5),
(2, 2), (2, 6), (2, 8), (2, 4), (2, 10),
(3, 1), (3, 4), (3, 6), (3, 7), (3, 9),
(4, 5), (4, 2), (4, 8), (4, 10), (4, 3),
(5, 6), (5, 1), (5, 7), (5, 9), (5, 4),
(6, 2), (6, 5), (6, 8), (6, 10), (6, 3),
(7, 1), (7, 6), (7, 9), (7, 4), (7, 7),
(8, 2), (8, 5), (8, 10), (8, 3), (8, 8),
(9, 4), (9, 1), (9, 6), (9, 7), (9, 9),
(10, 2), (10, 3), (10, 5), (10, 8), (10, 10);

-- ==========================================
-- PerfilTag
-- ==========================================
CREATE TABLE IF NOT EXISTS PerfilTag(
    perfil_id INT,
    tag_id INT,
    PRIMARY KEY (perfil_id, tag_id),
    FOREIGN KEY (perfil_id) REFERENCES perfil(candidato_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE
);

INSERT INTO PerfilTag (perfil_id, tag_id) VALUES
(1, 2), (1, 5), (1, 7), (1, 9), (1, 10),
(2, 1), (2, 3), (2, 4), (2, 6), (2, 8),
(3, 2), (3, 4), (3, 6), (3, 7), (3, 9),
(4, 1), (4, 3), (4, 5), (4, 8), (4, 10),
(5, 2), (5, 4), (5, 6), (5, 7), (5, 9);
