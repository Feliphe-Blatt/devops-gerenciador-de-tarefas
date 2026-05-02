# Gerenciador de Tarefas e Produtividade

## Descricao e objetivo
Aplicacao web simples para registrar, acompanhar e concluir atividades do dia a dia. Este projeto faz parte da disciplina de DevOps e tem foco em conteinerizacao, orquestracao e qualidade.

## Tecnologias
- Front-end: Next.js com TypeScript
- Back-end: Java com Spring Boot
- Banco de dados: PostgreSQL
- Infraestrutura: Docker e Docker Compose
- Qualidade e CI/CD: GitHub, Jenkins e SonarQube

## Fluxo Git
- `main`: branch de entrega consolidada.
- `develop`: branch de integracao e validacao entre etapas.
- `feature/*`: branches temporarias por workplan ou funcionalidade.

Regra de uso:
1. cada workplan e executado em uma branch `feature/*` propria;
2. ao fechar o workplan, o commit fica na branch da feature;
3. a feature e mesclada em `develop` para validacao;
4. quando a fase estiver consolidada, `develop` e mesclada em `main`.

## CI/CD inicial
- `Jenkinsfile`: pipeline base com etapas de checkout, backend, frontend e SonarQube.
- `sonar-project.properties`: configuracao inicial de analise para backend e frontend.
- A analise de qualidade deve bloquear o fluxo antes do merge em `develop` quando houver falha.

## Estrutura do projeto
- /frontend - Interface (Next.js)
- /backend - API (Spring Boot)
- /docker-compose.yml - Orquestracao dos servicos

## Como executar
1. Instale Docker e Docker Compose.
2. Na raiz do projeto, execute:

```bash
docker-compose up -d --build
```

Para parar:

```bash
docker-compose down
```

## Integrante
- Seu Nome (desenvolvimento individual)
