import mysql.connector

conexao = mysql.connector.connect(host = 'db',
                                  user = 'root',
                                  port = 3306,
                                  password = 'admin',
                                  database = 'qwik')

cursor = conexao.cursor()

cursor.execute("USE qwik;")

cursor.execute("""
INSERT INTO Usuario (nome, email, telefone, login, senha, cidade, estado, bairro) VALUES
    ('João Silva', 'joao.silva@email.com', '(11) 99999-1234', 'joaosilva', '$2a$10$rQdS3Vv7yDkQ9kQ8Q8Q8Qu', 'São Paulo', 'SP', 'Centro'),
    ('Maria Santos', 'maria.santos@email.com', '(21) 98888-5678', 'mariasantos', '$2a$10$rQdS3Vv7yDkQ9kQ8Q8Q8Qu', 'Rio de Janeiro', 'RJ', 'Copacabana'),
    ('Pedro Oliveira', 'pedro.oliveira@email.com', '(31) 97777-9012', 'pedroliveira', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Belo Horizonte', 'MG', 'Savassi'),
    ('Ana Costa', 'ana.costa@email.com', '(41) 96666-3456', 'anacosta', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Curitiba', 'PR', 'Batel'),
    ('Carlos Pereira', 'carlos.pereira@email.com', '(51) 95555-7890', 'carlospereira', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Porto Alegre', 'RS', 'Moinhos de Vento'),
    ('Juliana Lima', 'juliana.lima@email.com', '(61) 94444-1234', 'julianalima', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Brasília', 'DF', 'Asa Sul'),
    ('Fernando Souza', 'fernando.souza@email.com', '(71) 93333-5678', 'fernandosouza', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Salvador', 'BA', 'Barra'),
    ('Amanda Rocha', 'amanda.rocha@email.com', '(81) 92222-9012', 'amandarocha', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Recife', 'PE', 'Boa Viagem'),
    ('Ricardo Alves', 'ricardo.alves@email.com', '(48) 91111-3456', 'ricardoalves', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Florianópolis', 'SC', 'Centro'),
    ('Patrícia Martins', 'patricia.martins@email.com', '(27) 90000-7890', 'patriciamartins', '$2a$10$N9qo8uLOickgx2ZMRZoMye', 'Vitória', 'ES', 'Praia do Canto');
    """)

cursor.execute("""
INSERT INTO Candidato (id, data_nascimento, cpf, genero, estado_civil) VALUES
    (1, ano mes dia, '123.456.789-00', 'Masculino', 'Solteiro'),
    (2, 1968-12-05, '234.567.890-11', 'Feminino', 'Casado'),
    (3, 25, '345.678.901-22', 'Masculino', 'Solteiro'),
    (4, 29, '456.789.012-33', 'Feminino', 'Divorciado'),
    (5, 42, '567.890.123-44', 'Masculino', 'Casado'),
    (6, 31, '678.901.234-55', 'Feminino', 'Solteiro'),
    (7, 26, '789.012.345-66', 'Masculino', 'União Estável'),
    (8, 38, '890.123.456-77', 'Feminino', 'Casado'),
    (9, 45, '901.234.567-88', 'Masculino', 'Viúvo'),
    (10, 27, '012.345.678-99', 'Feminino', 'Solteiro');
    """)

cursor.execute("""
INSERT INTO Perfil (id_candidato, foto, nome_perfil, idade_perfil, curriculo) VALUES
(1, 'foto_joao.jpg', 'João Dev', '28', 'curriculo_joao.pdf'),
(2, 'foto_maria.jpg', 'Maria Analista', '34', 'curriculo_maria.pdf'),
(3, 'foto_pedro.jpg', 'Pedro Tech', '25', 'curriculo_pedro.pdf'),
(4, 'foto_ana.jpg', 'Ana Designer', '29', 'curriculo_ana.pdf'),
(5, 'foto_carlos.jpg', 'Carlos Manager', '42', 'curriculo_carlos.pdf'),
(6, 'foto_juliana.jpg', 'Juliana RH', '31', 'curriculo_juliana.pdf'),
(7, 'foto_fernando.jpg', 'Fernando Dev', '26', 'curriculo_fernando.pdf'),
(8, 'foto_amanda.jpg', 'Amanda Marketing', '38', 'curriculo_amanda.pdf'),
(9, 'foto_ricardo.jpg', 'Ricardo CEO', '45', 'curriculo_ricardo.pdf'),
(10, 'foto_patricia.jpg', 'Patricia Sales', '27', 'curriculo_patricia.pdf');
""")

cursor.execute("""
INSERT INTO Recrutador (id, cnpj, identidade_recrutador) VALUES
(11, '12.345.678/0001-90', 'Tech Solutions Ltda'),
(12, '23.456.789/0001-01', 'RH Innovate SA'),
(13, '34.567.890/0001-12', 'Digital Talent EIRELI'),
(14, '45.678.901/0001-23', 'Future Careers Ltda'),
(15, '56.789.012/0001-34', 'Star Recruiting SA');
""")

cursor.execute("""
INSERT INTO Vaga (id_recrutador, tipo, contrato, cargo, resumo, responsabilidades, requisitos, beneficios, salario, quantidade, localizacao, data_publicacao, status, tags) VALUES
(11, 'Remoto', 'CLT', 'Desenvolvedor Full Stack', 'Vaga para desenvolvedor full stack júnior', 'Desenvolvimento de aplicações web, manutenção de sistemas', 'JavaScript, React, Node.js, SQL', 'Vale alimentação, plano de saúde', 4500.00, 2, 'São Paulo', '2024-01-15 10:00:00', 'Ativa', 'tech,programação'),
(12, 'Híbrido', 'PJ', 'Analista de RH', 'Analista para recrutamento e seleção', 'Recrutamento, entrevistas, onboarding', 'Experiência em RH, comunicação', 'Vale transporte, bonus', 3500.00, 1, 'Rio de Janeiro', '2024-01-16 14:30:00', 'Ativa', 'rh,gestão'),
(13, 'Presencial', 'CLT', 'Designer UX/UI', 'Designer para produtos digitais', 'Criação de interfaces, prototipagem', 'Figma, Adobe XD, Photoshop', 'Plano dental, gympass', 4200.00, 3, 'Belo Horizonte', '2024-01-17 09:15:00', 'Ativa', 'design,ux'),
(14, 'Remoto', 'PJ', 'Gerente de Projetos', 'Gerência de projetos tech', 'Gestão de equipes, planejamento', 'PMP, Scrum, Agile', 'VR, VT, seguro vida', 8500.00, 1, 'Curitiba', '2024-01-18 11:45:00', 'Ativa', 'gestão,projetos'),
(15, 'Híbrido', 'CLT', 'Vendedor Externo', 'Vendas B2B', 'Prospecção, fechamento vendas', 'Experiência em vendas, CNH B', 'Comissão, carro empresa', 2800.00, 5, 'Porto Alegre', '2024-01-19 16:20:00', 'Ativa', 'vendas,comercial');
""")

cursor.execute("""
INSERT INTO FormaPagamento (id_recrutador, tipo, data_criacao, status) VALUES
(11, 'cartao', '2024-01-01', 1),
(12, 'pix', '2024-01-02', 1),
(13, 'cartao', '2024-01-03', 1),
(14, 'pix', '2024-01-04', 1),
(15, 'cartao', '2024-01-05', 1);
""")

cursor.execute("""
INSERT INTO Pagamento (id_recrutador, id_pagamento, tipo_servico, valor, data_pagamento, status) VALUES
(11, 1, 'Assinatura Mensal', 199.90, '2024-01-10 10:00:00', 'Aprovado'),
(12, 2, 'Assinatura Anual', 1999.90, '2024-01-11 11:30:00', 'Aprovado'),
(13, 3, 'Assinatura Mensal', 199.90, '2024-01-12 14:15:00', 'Aprovado'),
(14, 4, 'Assinatura Trimestral', 499.90, '2024-01-13 16:45:00', 'Aprovado'),
(15, 5, 'Assinatura Mensal', 199.90, '2024-01-14 09:20:00', 'Aprovado');
""")

cursor.execute("""
INSERT INTO Assinatura (id, tipo, data_inicio, vencimento, forma_pgt, id_pagamento) VALUES
(1, 'Mensal', '2024-01-10', '2024-02-10', 'cartao', 1),
(2, 'Anual', '2024-01-11', '2025-01-11', 'pix', 2),
(3, 'Mensal', '2024-01-12', '2024-02-12', 'cartao', 3),
(4, 'Trimestral', '2024-01-13', '2024-04-13', 'pix', 4),
(5, 'Mensal', '2024-01-14', '2024-02-14', 'cartao', 5);
""")

cursor.execute("""
INSERT INTO Cartao (id, numero_cartao, nome_titular, validade, cvv) VALUES
(1, '1234567812345678', 'TECH SOLUTIONS LTDA', '2026-12-01', 123),
(3, '2345678923456789', 'DIGITAL TALENT EIRELI', '2027-06-01', 456),
(5, '3456789034567890', 'STAR RECRUITING SA', '2028-03-01', 789);
""")

cursor.execute("""
INSERT INTO Pix (id, chave, tipo_chave) VALUES
(2, 'rh.innovate@email.com', 'email'),
(4, 'future.careers@email.com', 'email');
""")

cursor.execute("""
INSERT INTO Videochamada (id_candidato, id_recrutador, id_vaga, log, record, data) VALUES
(1, 11, 1, 'Entrevista técnica realizada', 'gravacao_entrevista_1.mp4', '2024-01-20 10:00:00'),
(2, 12, 2, 'Entrevista comportamental', 'gravacao_entrevista_2.mp4', '2024-01-21 14:30:00'),
(3, 13, 3, 'Teste de habilidades', 'gravacao_entrevista_3.mp4', '2024-01-22 16:00:00'),
(4, 14, 4, 'Entrevista final', 'gravacao_entrevista_4.mp4', '2024-01-23 11:15:00'),
(5, 15, 5, 'Dinâmica em grupo', 'gravacao_entrevista_5.mp4', '2024-01-24 09:45:00');
""")

cursor.execute("""
INSERT INTO PV (id_candidato, id_recrutador, log, data) VALUES
(1, 11, 'Candidato interessado na vaga, aguardando retorno', '2024-01-25 08:30:00'),
(2, 12, 'Conversa sobre benefícios e horários', '2024-01-25 10:15:00'),
(3, 13, 'Discussão sobre salário e expectativas', '2024-01-25 13:45:00'),
(4, 14, 'Negociação de contratação', '2024-01-25 15:20:00'),
(5, 15, 'Feedback do processo seletivo', '2024-01-25 17:00:00');
""")

def tchau_db():
    conexao.commit()
    conexao.close()
    return print("Finalizando conexão....")

tchau_db()