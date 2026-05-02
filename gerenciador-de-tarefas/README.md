# Gerenciador de Tarefas e Produtividade

## Descrição do projeto
Aplicação web simples para registrar, acompanhar e concluir atividades do dia a dia. O projeto foi desenhado para aplicar de forma prática versionamento de código, conteinerização, orquestração, automação de pipeline e análise de qualidade em um fluxo DevOps enxuto.

## Tema da aplicação
O tema escolhido é um gerenciador de tarefas e produtividade. O sistema permite organizar atividades em uma lista única, acompanhar o status de cada item e manter uma visão clara do que precisa ser feito, do que está em andamento e do que já foi concluído.

## Objetivo da aplicação
O objetivo do sistema é centralizar tarefas pessoais ou acadêmicas em uma interface simples, reduzindo a dispersão entre anotações soltas e facilitando o acompanhamento do progresso.

## Escopo em visão macro
O sistema permite cadastrar, listar, editar, alterar status e excluir tarefas. A proposta foi mantida deliberadamente simples para valorizar a aplicação dos conceitos de DevOps exigidos na disciplina, sem ampliar o escopo para recursos desnecessários como autenticação, perfis ou permissões.

## Principais funcionalidades
- Criar tarefas com título, descrição e status.
- Listar as tarefas cadastradas em uma interface web.
- Editar tarefas existentes.
- Alterar o status das tarefas entre pendente, em andamento e concluída.
- Excluir tarefas quando não forem mais necessárias.

## CRUD principal
O CRUD principal do projeto é o gerenciamento de tarefas.

- Create: criação de novas tarefas.
- Read: listagem das tarefas cadastradas.
- Update: edição dos dados e do status de uma tarefa.
- Delete: remoção de tarefas do sistema.

## Tecnologias utilizadas
- Front-end: Next.js com TypeScript.
- Back-end: Java com Spring Boot.
- Banco de dados: PostgreSQL.
- Infraestrutura: Docker e Docker Compose.
- Qualidade e CI/CD: GitHub, Jenkins e SonarQube.

## Justificativa das tecnologias
- Next.js foi escolhido para entregar uma interface moderna, responsiva e com boa experiência de desenvolvimento.
- TypeScript reduz erros de integração e melhora a previsibilidade do código do frontend.
- Spring Boot simplifica a criação da API e da camada de negócio no backend.
- PostgreSQL oferece persistência relacional estável e adequada para um CRUD estruturado.
- Docker e Docker Compose tornam o ambiente reproduzível e facilitam a execução da stack completa.
- Jenkins e SonarQube sustentam o fluxo de integração contínua e a validação de qualidade exigidos pela disciplina.

## Fluxo Git
- `main`: branch de entrega consolidada.
- `develop`: branch de integração e validação entre etapas.
- `feature/*`: branches temporárias por workplan ou funcionalidade.

Regra de uso:
1. cada workplan é executado em uma branch `feature/*` própria;
2. ao fechar o workplan, o commit fica na branch da feature;
3. a feature é mesclada em `develop` para validação;
4. quando a fase estiver consolidada, `develop` é mesclada em `main`.

## CI/CD inicial
- `Jenkinsfile`: pipeline base com etapas de checkout, backend, frontend e SonarQube.
- `sonar-project.properties`: configuração inicial de análise para backend e frontend.
- A análise de qualidade deve bloquear o fluxo antes do merge em `develop` quando houver falha.

## API e integração
- `GET /api/tasks`: lista as tarefas cadastradas.
- `POST /api/tasks`: cria uma nova tarefa.
- `PUT /api/tasks/{id}`: atualiza uma tarefa existente.
- `DELETE /api/tasks/{id}`: remove uma tarefa.
- O frontend consome a API via `NEXT_PUBLIC_API_URL`, que no compose aponta para `http://localhost:8080`.

## Estrutura do projeto
- `/frontend` - interface Next.js.
- `/backend` - API Spring Boot.
- `/docker-compose.yml` - orquestração dos serviços.
- `/Jenkinsfile` - pipeline inicial de integração contínua.
- `/sonar-project.properties` - configuração inicial do SonarQube.

## Como executar
1. Instale Docker e Docker Compose.
2. Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Para parar:

```bash
docker compose down
```

## Comandos principais
- `docker compose up -d --build` para subir a stack completa.
- `docker compose down` para derrubar os containers.
- `docker compose logs -f` para acompanhar os logs.
- `cd frontend && npm run build` para validar o frontend localmente.
- `cd backend && mvn test` para executar os testes do backend quando disponíveis.

## Proposta inicial
Consulte também [proposta-inicial.md](proposta-inicial.md) para a versão consolidada da proposta do projeto.

## Integrantes da equipe
- Aceve - desenvolvimento individual.
