Proposta de Projeto - DevOps

projeto: Gerenciador de Tarefas e Produtividade

Objetivo do sistema (problema a ser resolvido):
Desorganização pessoal, permitindo o registro, acompanhamento e conclusão de atividades diárias de forma facilitada.

Escopo em visão macro: 
Onde o usuário pode visualizar suas tarefas, adicionar novas demandas, editar os detalhes (título, descrição e prazo), atualizar o status (pendente, em andamento, concluída) e excluir tarefas que já foram finalizadas.

Principais funcionalidades:
1. Cadastro de novas tarefas.
2. Listagem de tarefas agrupadas por status.
3. Atualização de status e edição de informações.
4. Exclusão de tarefas.

CRUD principal:
Gestão de Tarefas (Create, Read, Update, Delete das atividades).

Tecnologias que utilizarei:
- Next.js com TypeScript.
- Java com Spring Boot.
- PostgreSQL.
- Docker, Docker Compose, GitHub (GitFlow), Jenkins e SonarQube.

Justificativa das tecnologias escolhidas:
Além da familiaridade, escolhi o Spring Boot por ser um padrão de mercado extremamente robusto para APIs, e o Next.js com TypeScript para garantir um front-end moderno. Ambas as tecnologias possuem excelente ecossistema para conteinerização com Docker e se integram perfeitamente às análises do SonarQube via Jenkins, o que me facilitará construir e demonstrar uma esteira de CI/CD completa, muito próxima de um cenário real, salvo a ideia do projeto quer é para demonstração de conceitos, não para ser um produto final complexo. O PostgreSQL é uma escolha sólida para o banco de dados, confiável e de fácil uso em projetos desse porte.