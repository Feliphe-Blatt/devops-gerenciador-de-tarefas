# Gerenciador de Tarefas e Produtividade - Linha de Entregas

Este arquivo registra a evolucao do projeto final em entregas validas por CI/CD, para documentar o fluxo ponto a ponto de forma limpa e auditavel. Ele nao substitui o [README principal](README.md), mas complementa a visao de entrega por etapa.

## Visao geral

O projeto foi conduzido como um CRUD simples de tarefas, com front-end, back-end, banco de dados, Docker, Docker Compose, Jenkins e SonarQube. A estrategia foi manter cada marco pequeno, validavel e coerente com o que se espera de uma entrega real de DevOps.

## Sequencia das entregas

### Entrega 1 - Estrutura base e conteinerizacao

Objetivo:
- criar a estrutura inicial do front-end, back-end e banco;
- subir a stack com Docker Compose;
- deixar o ambiente reproduzivel desde o inicio.

Validacao aplicada:
- `docker compose up -d --build` para subir a stack;
- verificacao de containers do banco, backend e frontend;
- leitura inicial do fluxo pelo README.

Resultado esperado:
- ambiente funcional e pronto para evoluir;
- servicos acessiveis em containers;
- base do projeto sem dependencia de execucao manual local.

### Entrega 2 - Proposta e definicao do escopo

Objetivo:
- formalizar o tema da aplicacao;
- delimitar o CRUD principal;
- manter o escopo simples e viavel.

Validacao aplicada:
- consolidacao da proposta em [proposta-inicial.md](proposta-inicial.md);
- alinhamento com os requisitos obrigatorios da disciplina;
- definicao clara de tecnologias e justificativa.

Resultado esperado:
- proposta coerente com a disciplina;
- escopo pequeno, objetivo e executavel.

### Entrega 3 - CRUD e integracao da aplicacao

Objetivo:
- implementar o CRUD de tarefas;
- conectar frontend e backend;
- garantir que a aplicacao refletisse o fluxo principal do sistema.

Validacao aplicada:
- API REST para listagem, criacao, edicao e remocao;
- frontend consumindo a API;
- execucao da stack inteira via compose.

Resultado esperado:
- funcionalidade principal entregue de ponta a ponta;
- base suficiente para testes e cobertura.

### Entrega 4 - CI/CD real com qualidade

Objetivo:
- inserir pipeline real com Jenkins;
- validar backend, frontend e analise de qualidade;
- gerar evidencias de cobertura e artefatos.

Fluxo de pipeline:
1. checkout do repositorio;
2. testes e coverage do backend;
3. testes, coverage e build do frontend;
4. analise no SonarQube;
5. arquivamento de artefatos de cobertura.

Arquivos envolvidos:
- [Jenkinsfile](Jenkinsfile)
- [sonar-project.properties](sonar-project.properties)

Resultado esperado:
- pipeline valida o projeto por partes;
- qualidade entra como criterio de entrega, nao como ajuste final tardio.

### Entrega 5 - QA e cobertura do frontend

Objetivo:
- elevar a cobertura do frontend;
- estabilizar a estrategia de testes;
- evitar dependencia de ajuste manual no fim do projeto.

Validacao aplicada:
- execucao de cobertura do frontend com `npm run test:coverage`;
- reorganizacao da logica em helpers testaveis;
- consolidacao de testes para manter cobertura acima da meta.

Resultado esperado:
- frontend com cobertura real e sustentavel;
- comprovacao objetiva de qualidade antes do fechamento.

## Leitura correta do historico

Este README2 existe para representar o projeto como uma sequencia de entregas validadas, e nao como uma unica conclusao feita no final. Se voce olhar o repositório por este arquivo, a leitura fica:

- primeiro estrutura e containerizacao;
- depois definicao da proposta;
- depois CRUD e integracao;
- depois pipeline e qualidade;
- por fim cobertura e QA.

## Resumo dos pontos que ficam claros aqui

- o projeto nasceu simples de proposito;
- cada etapa tem um criterio de validacao;
- Jenkins e SonarQube nao aparecem como adicao tardia;
- a cobertura do frontend foi tratada como requisito de qualidade, nao como detalhe final.

## Relacao com o README principal

O [README principal](README.md) continua sendo a documentacao de uso do projeto final. O README2 serve como trilha de entrega e de validacao, para deixar explicita a evolucao por marcos.
