# Passe: mercado de jogadores

Aplicação fullstack do estudo de caso do processo seletivo para Desenvolvedor Fullstack I do Instituto SENAI de Inovação (Sistema FIEPE). Simula o mercado de jogadores de uma liga de futebol fictícia: jogadores, clubes, compra e venda com contrato de fidelidade, histórico de transações, escalação, partidas e classificação.

| Camada | Tecnologia |
| --- | --- |
| Frontend | React com Next.js (JavaScript) |
| Backend | Java 21 com Spring Boot 3.5 (Maven) |
| Banco de dados | PostgreSQL 16 (Docker) |

## 1. Pré-requisitos

| Ferramenta | Versão |
| --- | --- |
| Ubuntu | 24.04 |
| Docker com Docker Compose (plugin v2) | 24 ou superior |
| Java (JDK) | 21 |
| Maven | 3.6.3 ou superior |
| Node.js com npm | 22 LTS |
| Git | qualquer |

O PostgreSQL não precisa ser instalado: ele roda em contêiner, iniciado pelos comandos abaixo.

## 2. Banco de dados

O banco roda no Docker. As tabelas são criadas pelas migrations do Flyway (`backend/src/main/resources/db/migration`), aplicadas automaticamente quando o backend inicia. O banco criado começa vazio, sem jogadores, clubes, transações nem partidas.

### Criar o banco (na raiz do repositório)

```bash
cp .env.example .env
docker compose up -d db
```

Aguarde o contêiner ficar saudável (coluna STATUS com `healthy`):

```bash
docker compose ps
```

As tabelas são criadas na primeira inicialização do backend (seção 3).

### Recriar o banco do zero (na raiz do repositório)

Apaga o contêiner e o volume com todos os dados e cria o banco vazio de novo:

```bash
docker compose down -v
docker compose up -d db
```

Em seguida, inicie o backend (seção 3): o Flyway recria todas as tabelas.

## 3. Como executar

TODO: comandos do backend e do frontend (Capítulos 3, 10 e 15).

- Origem da API: `http://localhost:8080` (o script acrescenta `/api/v1`)
- URL do frontend: `http://localhost:3000`

## 4. Variáveis de ambiente

Todas as variáveis ficam no `.env.example` da raiz. Copie para `.env` antes de executar.

### Raiz (`.env`, usado pelo Docker Compose)

| Variável | Padrão | Descrição |
| --- | --- | --- |
| `POSTGRES_DB` | `passe` | Nome do banco |
| `POSTGRES_USER` | `passe` | Usuário do banco |
| `POSTGRES_PASSWORD` | `passe` | Senha do banco |
| `POSTGRES_PORT` | `5432` | Porta do banco exposta no host |

TODO: variáveis do backend e do frontend (Capítulos 3 e 10).

## 5. Estrutura de pastas e bibliotecas

```
.
├── backend/              API REST (Spring Boot)
│   └── src/main/resources/db/migration/   migrations do Flyway
├── frontend/             interface (Next.js)
├── docs/                 enunciado e material do processo seletivo
├── docker-compose.yml    banco de dados (e, ao final, API e interface)
└── .env.example          variáveis do Docker Compose
```

TODO: tabela de bibliotecas do backend e do frontend, com o motivo de cada uma.

## 6. Decisões e premissas

- **PostgreSQL 16 em imagem Debian (`postgres:16`), não Alpine:** a comparação de nomes com acentos (RN10) depende do `lower()` tratar caracteres acentuados corretamente.
- **Unicidade do nome do clube (RN10) garantida no banco:** índice único sobre `lower(nome)`, que ignora maiúsculas e minúsculas e mantém os acentos ("Águias FC" e "Aguias FC" são diferentes; "águias fc" é duplicado).
- **Datas como `TIMESTAMPTZ`:** o enunciado lista `TIMESTAMP`; o tipo com fuso evita ambiguidade no instante gravado. A API sempre recebe e devolve no horário de Brasília (`-03:00`).
- **Regras que dependem de contagem** (máximo de 20 clubes, 12 jogadores por clube, 5 titulares) são validadas no backend, dentro da mesma transação da operação; o banco garante as demais com `CHECK`, `UNIQUE` e chaves estrangeiras.
- **No máximo um contrato `ATIVO` por jogador:** índice único parcial em `contratos (jogador_id) WHERE situacao = 'ATIVO'`.
- **Spring Boot 3.5.16:** o enunciado exige Spring Boot 3; a 3.5.16 é a última versão da linha 3.

TODO: novas decisões a cada capítulo.

## 7. Funcionalidades não implementadas

TODO (ao final: listar o que faltou ou escrever "Nenhuma").

## 8. Uso de inteligência artificial

TODO: revisar e completar ao final.

- **Ferramenta:** Claude (Anthropic).
- **Onde:** planejamento da arquitetura e do cronograma; modelagem do banco e migration `V1__criar_tabelas.sql`; configuração do Docker Compose.
- **Como e por quê:** usei o assistente como guia passo a passo, pedindo explicações dos conceitos (volumes do Docker, Flyway, constraints) antes de aplicar cada etapa.
- **O que aceitei, alterei ou descartei:** TODO.