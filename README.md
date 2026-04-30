# Ecossistema Codex Beevent

Este repositório concentra o ecossistema operacional do Codex para o contexto Beevent: onboarding, manuais, regras operacionais, skills, configuração, estado operacional e memória de sprint.

## O que este repositório é

- a base reutilizável do ecossistema
- a documentação oficial do uso do Codex neste contexto
- a casa das `instructions/`, `skills/`, `scripts/`, `config/`, `state/` e `sprints/`

## O que este repositório não é

- ele não substitui os repositórios de produto
- ele não embute os repositórios de produto
- os repositórios novos ficam fisicamente em `beevent-platform/backend/`, `beevent-platform/backoffice/` e `beevent-platform/web/`; os nomes `beevent-backend`, `beevent-backoffice` e `beevent-web` são aliases lógicos de stack
- os repositórios legados (`backoffice/`, `beevent-back/`, `beevent-front/`) continuam como pastas irmãs no mesmo workspace quando forem usados

## Estrutura principal

```text
ecossistema-codex-beevent/
|-- README.md
|-- AGENTS.md
|-- docs/
|-- instructions/
|-- skills/
|-- scripts/
|-- config/
|-- state/
|-- sprints/
|-- tmp/
`-- legacy/
```

## Documentos oficiais

- guia do ecossistema: `docs/guia-ecossistema.md`
- guia de skills: `docs/guia-skills.md`
- guia de eficiencia de tokens: `docs/guia-eficiencia-tokens.md`
- configuração de ambiente: `docs/configuracao-ambiente.md`
- instalação e bootstrap: `docs/instalacao-e-bootstrap.md`
- índice da documentação: `docs/README.md`
- apresentação oficial do ecossistema: `https://www.figma.com/deck/QmZJuRYNLhNZuUZnZgFY75/Feliphe-Blatt---Apresenta%C3%A7%C3%A3o-Ecossistema-Codex-Beevent?node-id=2-42&t=xFCRfSMyXxYYcQwp-1`
- PDF oficial do ecossistema: `docs/pdf/GUIA-ECOSSISTEMA-CODEX-BEEVENT.pdf`
- PDF oficial de skills: `docs/pdf/GUIA-SKILLS-CODEX-BEEVENT.pdf`

## Ordem de leitura recomendada

1. `README.md`
2. `AGENTS.md`
3. `instructions/workflow.md`
4. `instructions/workflow-checklist.md`
5. módulos em `instructions/workflow/`
6. `docs/guia-ecossistema.md`
7. `docs/guia-skills.md`
8. `docs/guia-eficiencia-tokens.md`
9. instruções de stack relevantes
10. skills necessárias

## Repositórios Suportados

- Novo Beevent:
  - `beevent-backend`: alias lógico para `beevent-platform/backend`, backend Go
  - `beevent-backoffice`: alias lógico para `beevent-platform/backoffice`, frontend administrativo Next.js/React/TypeScript
  - `beevent-web`: alias lógico para `beevent-platform/web`, frontend público Next.js/React/TypeScript
- Legado:
  - `backoffice`
  - `beevent-back`
  - `beevent-front`

A stack deve ser escolhida pelo repositório realmente afetado pela task. Não migre uma task para os repositórios novos quando o escopo continuar no legado.

## Regra operacional de entrada

Antes de qualquer implementação técnica, o fluxo padrão é:

1. analisar a task
2. atualizar o repositório afetado antes de criar branch; para `beevent-platform`, usar `git pull --ff-only --recurse-submodules origin main`
3. apresentar o workplan antes de codar, mesmo se o pedido já autorizar executar
4. explicitar repositório, módulos e arquivos prováveis
5. oferecer abordagens quando houver decisão relevante
6. executar por partes pequenas e verificáveis

## Configuração rápida

- exemplos de variáveis: `config/env/.env.example`
- exemplos de paths locais: `config/paths/`
- detalhes completos: `docs/configuracao-ambiente.md`

## Scripts úteis

- abrir task no padrão novo: `scripts/bootstrap-task.ps1`
- preparar branches em submodules de produto: `scripts/prepare-product-task-repos.ps1`
- finalizar commit/push/PR por repo/submodule: `scripts/finish-product-task-repos.ps1`
- gerar handoff diario com commit/PR/branch por repo/submodule: `scripts/generate-product-handoff-report.ps1`
- atualizar repositórios do workspace: `scripts/update-repos.ps1`
- validar estrutura do ecossistema: `scripts/lint-ecosystem.ps1`

## Regra de ouro

`README.md` orienta a entrada. `docs/` explica. `instructions/` manda. `skills/` especializa. `state/` guarda o estado operacional. `tmp/` guarda apenas temporários.
