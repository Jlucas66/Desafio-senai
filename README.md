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

### Testes automatizados do backend (na pasta `backend/`)

```bash
mvn test
```

Os testes da API sobem um PostgreSQL 16 descartável pelo Testcontainers, separado do banco da seção 2; é preciso apenas que o Docker esteja rodando. O comando termina sozinho.

### Testes manuais pelo Postman (opcional)

A coleção `docs/postman/passe-backend.postman_collection.json` tem as requisições de jogadores, clubes, compra, venda e histórico, cada uma com a resposta esperada. Com o banco recém-criado e o backend no ar, importe-a no Postman e rode-a inteira, em ordem, pelo Collection Runner.

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

| Biblioteca | Camada | Motivo |
| --- | --- | --- |
| Testcontainers (PostgreSQL) | Backend (testes) | Roda os testes da API contra o mesmo PostgreSQL 16 da aplicação, num contêiner descartável, sem tocar no banco de desenvolvimento. |

TODO: demais bibliotecas do backend e do frontend, com o motivo de cada uma.

## 6. Decisões e premissas

- **PostgreSQL 16 em imagem Debian (`postgres:16`), não Alpine:** a comparação de nomes com acentos (RN10) depende do `lower()` tratar caracteres acentuados corretamente.
- **Unicidade do nome do clube (RN10) garantida no banco:** índice único sobre `lower(nome)`, que ignora maiúsculas e minúsculas e mantém os acentos ("Águias FC" e "Aguias FC" são diferentes; "águias fc" é duplicado).
- **Datas como `TIMESTAMPTZ`:** o enunciado lista `TIMESTAMP`; o tipo com fuso evita ambiguidade no instante gravado. A API sempre recebe e devolve no horário de Brasília (`-03:00`).
- **Regras que dependem de contagem** (máximo de 20 clubes, 12 jogadores por clube, 5 titulares) são validadas no backend, dentro da mesma transação da operação; o banco garante as demais com `CHECK`, `UNIQUE` e chaves estrangeiras.
- **No máximo um contrato `ATIVO` por jogador:** índice único parcial em `contratos (jogador_id) WHERE situacao = 'ATIVO'`.
- **Spring Boot 3.5.16:** o enunciado exige Spring Boot 3; a 3.5.16 é a última versão da linha 3.

- **Backend em camadas** (`model` → `repository` → `service` → `controller`): as entidades JPA só guardam dados; os repositórios acessam o banco; os services aplicam as regras de negócio e as transações; os controllers só recebem a requisição, validam a entrada pelos DTOs (`dto`, com as anotações de `validation`) e chamam o service.
- **Cálculos do jogador em classes próprias** (`service/calculo`): overall, valor base e valor de mercado ficam cada um num único lugar, sem Spring nem banco, e são testados com as tabelas do enunciado.
- **Valores em moedas com `BigDecimal`**, arredondados uma única vez no resultado final com `RoundingMode.HALF_UP` (meio para longe do zero).
- **Leitura estrita do JSON (V2 e V5):** número em texto (`"15"`), número com parte fracionária em campo inteiro (`50.5`), número no lugar de texto e número no lugar de valor de lista são recusados com 400; `50.0` é aceito como 50.
- **Id da URL validado pela própria rota** (`[1-9][0-9]*`): `01`, `0`, `-1` e `abc` não casam com nenhuma rota e respondem 404, em qualquer método.
- **Listagem de jogadores filtrada, ordenada e paginada na aplicação:** o valor de mercado não é gravado e a ordem alfabética do enunciado (sem acentos, pela ordem Unicode) não coincide com a do PostgreSQL, então a API carrega os jogadores ativos, calcula os valores e aplica busca, filtros, ordenação e paginação em Java. Para o tamanho da liga (até 20 clubes de 12 jogadores, mais os livres), o custo é pequeno.
- **Jogador excluído** é filtrado em todas as consultas (`excluido_em IS NULL`) e responde 404 como um id inexistente.
- **Datas (RN01):** a entrada é conferida por expressão regular e lida com `ResolverStyle.STRICT`, que recusa datas inexistentes (`2027-02-30`, `24:00`) em vez de ajustá-las; toda data da resposta é convertida para `-03:00` e formatada com segundos. O "agora" vem de um `Clock` de Brasília injetado, que os testes substituem por um relógio ajustável.
- **Fim da fidelidade no passado ou além de 1.095 dias responde 400**, como na tabela "Limites de cada campo" (que não marca esse limite com 409); a conferência usa o mesmo instante gravado na compra.
- **Compra e venda bloqueiam a linha do clube** (`SELECT ... FOR UPDATE`) durante a operação, para que duas operações simultâneas não leiam o mesmo caixa ou a mesma contagem de elenco. Se uma restrição do banco for violada mesmo assim (por exemplo, dois contratos `ATIVO` para o mesmo jogador), a API responde 409 e a transação é desfeita.
- **Contrato com multa vira `RESCINDIDO`, sem multa vira `ENCERRADO`** (RN15, item 4); como o percentual mínimo é 5% e o valor de mercado mínimo é 1,00, só há multa quando ainda faltam dias de fidelidade.
- **Clubes ordenados na aplicação**, pelo mesmo motivo da listagem de jogadores: o patrimônio depende do valor de mercado, que não é gravado.
- **Exportação CSV** com `Content-Type: text/csv;charset=UTF-8` e `Content-Disposition: attachment`, para o navegador baixar o arquivo com nome.

TODO: novas decisões a cada capítulo.

## 7. Funcionalidades não implementadas

TODO (ao final: listar o que faltou ou escrever "Nenhuma").

## 8. Uso de inteligência artificial

TODO: revisar e completar ao final.

- **Ferramenta:** Claude (Anthropic).
- **Onde:** planejamento da arquitetura e do cronograma; modelagem do banco e migration `V1__criar_tabelas.sql`; configuração do Docker Compose; módulos de jogadores, clubes, mercado (compra e venda) e histórico do backend (cálculos, validações, endpoints, testes automatizados e coleção do Postman), com o Claude Code.
- **Como e por quê:** usei o assistente como guia passo a passo, pedindo explicações dos conceitos (volumes do Docker, Flyway, constraints) antes de aplicar cada etapa.
- **O que aceitei, alterei ou descartei:** TODO.