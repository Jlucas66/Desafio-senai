# Passe: mercado de jogadores

Este é o meu projeto para o estudo de caso do processo seletivo de Desenvolvedor Fullstack I do Instituto SENAI de Inovação (Sistema FIEPE). A ideia é simular o mercado de jogadores de uma liga de futebol fictícia: cadastrar jogadores e clubes, comprar e vender com contrato de fidelidade, guardar o histórico das transações, montar a escalação, jogar partidas e acompanhar a classificação.

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

Não é preciso instalar o PostgreSQL: ele sobe num contêiner, com os comandos da seção 2.

## 2. Banco de dados

O banco roda no Docker e as tabelas são criadas pelas migrations do Flyway (`backend/src/main/resources/db/migration`), que rodam sozinhas quando o backend inicia. O banco nasce vazio: sem jogadores, clubes, transações nem partidas.

### Criar o banco (na raiz do repositório)

```bash
cp .env.example .env
docker compose up -d db
```

Espere o contêiner ficar saudável (a coluna STATUS mostra `healthy`):

```bash
docker compose ps
```

As tabelas aparecem na primeira vez que o backend sobe (seção 3).

### Recriar o banco do zero (na raiz do repositório)

Estes comandos apagam o contêiner e o volume, com todos os dados, e criam o banco vazio de novo:

```bash
docker compose down -v
docker compose up -d db
```

Depois é só subir o backend outra vez (seção 3), que o Flyway recria as tabelas.

## 3. Como executar

### Backend (na pasta `backend`, com o banco da seção 2 no ar)

```bash
cd backend
mvn spring-boot:run
```

Quando aparecer `Started PasseApplication`, a API está no ar.

- **Origem da API:** `http://localhost:8080` (o script da banca acrescenta `/api/v1`)
- **Documentação interativa (Swagger):** `http://localhost:8080/api/v1/docs`
- **URL do frontend:** `http://localhost:3000`

Cada requisição gera uma linha no log do terminal do backend, com data e hora, método, caminho, status e o tempo de resposta. Por exemplo:

```text
2026-11-02T10:15:00.123-03:00  INFO ... RegistroDeRequisicoesFilter : GET /api/v1/players?search=lua 200 (7 ms)
```

### Frontend (em outro terminal, na pasta `frontend`, com a API no ar)

```bash
cd frontend
npm ci
npm run build
npm start
```

A interface abre em `http://localhost:3000`. Para desenvolver, troque os dois últimos comandos por `npm run dev`, que recarrega a tela a cada alteração. O arquivo de trava (`package-lock.json`) está versionado, então o `npm ci` instala exatamente as mesmas versões.

### Tudo pelo Docker (na raiz do repositório)

Se preferir não instalar Java e Maven, um único comando constrói a imagem da API e sobe o banco e a API juntos:

```bash
cp .env.example .env
docker compose up -d --build
```

A API fica na mesma origem, `http://localhost:8080`. Os logs de cada requisição aparecem em `docker compose logs -f api`. Use um caminho ou o outro: se a API já estiver rodando pelo Docker, o `mvn spring-boot:run` não consegue usar a porta 8080. Para parar tudo, use `docker compose down`, ou `docker compose down -v` para apagar também os dados. O serviço do frontend entra no mesmo `docker-compose.yml` quando a interface estiver pronta.

### Testes automatizados do backend (na pasta `backend`)

```bash
mvn test
```

O comando termina sozinho, sem modo de observação. Os testes da API sobem um PostgreSQL 16 descartável pelo Testcontainers, separado do banco da seção 2; só é preciso o Docker rodando. São mais de 280 testes. Os cálculos (valor de mercado, overall, valor base, taxa, multa, comissão e placar) são testados com as tabelas de exemplo do enunciado, e o cenário completo do Meia Lua (cadastro, compra, consulta do clube, venda, histórico e CSV) é conferido valor por valor.

### Lint e formatação do backend (na pasta `backend`)

```bash
mvn checkstyle:check
mvn spotless:check
```

O primeiro roda o Checkstyle, com as regras do arquivo `backend/checkstyle.xml`. O segundo só **verifica** se o código está formatado (Palantir Java Format e ordem dos imports) e não altera nenhum arquivo. Para formatar de verdade durante o desenvolvimento, uso `mvn spotless:apply`.

### Testes manuais pelo Postman (opcional)

Deixei em `docs/postman/passe-backend.postman_collection.json` uma coleção com 133 requisições, cada uma com a resposta esperada. Ela cobre todos os endpoints, do cadastro de jogadores até a classificação. Com o banco recém-criado e o backend no ar, importe a coleção no Postman e rode a coleção inteira, em ordem, pelo Collection Runner. As datas de fidelidade são calculadas na hora, por um script da própria coleção. Para rodar de novo, recrie o banco antes, porque os nomes de clube não podem se repetir.

## 4. Variáveis de ambiente

Todas as variáveis estão no `.env.example` da raiz. É só copiar para `.env`, como na seção 2. Os valores padrão já funcionam sem mudar nada.

| Variável | Padrão | Quem usa | Para que serve |
| --- | --- | --- | --- |
| `POSTGRES_DB` | `passe` | Docker Compose | Nome do banco |
| `POSTGRES_USER` | `passe` | Docker Compose | Usuário do banco |
| `POSTGRES_PASSWORD` | `passe` | Docker Compose | Senha do banco |
| `POSTGRES_PORT` | `5432` | Docker Compose | Porta do banco no host |
| `DB_URL` | `jdbc:postgresql://localhost:5432/passe` | Backend | Endereço JDBC do banco |
| `DB_USER` | `passe` | Backend | Usuário do banco |
| `DB_PASSWORD` | `passe` | Backend | Senha do banco |
| `SERVER_PORT` | `8080` | Backend | Porta da API |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` | Backend | Origens do frontend aceitas pelo CORS (várias, separadas por vírgula) |

No frontend, a única variável fica em `frontend/.env.example`:

| Variável | Padrão | Para que serve |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api/v1` | Endereço da API, já com o `/api/v1` |

Ela já tem o valor padrão no código, então só é preciso copiar o arquivo (`cp .env.example .env.local`, na pasta `frontend`) se a API estiver em outro endereço. Como começa com `NEXT_PUBLIC_`, o valor entra no build: mudou, rode `npm run build` de novo.

O Spring não lê o `.env` sozinho: quando o backend roda pelo Maven, ele usa os valores padrão acima, que são os mesmos do `.env.example`. Se mudar algum valor, exporte as variáveis antes de subir a API (`set -a; . ../.env; set +a`, na pasta `backend`). No Docker Compose, a API recebe as variáveis do banco já apontando para o contêiner `db`.

## 5. Estrutura de pastas e bibliotecas

```
.
├── backend/                    API REST (Spring Boot)
│   ├── src/main/java/br/com/passe/
│   │   ├── controller/         recebe as requisições e chama os services
│   │   ├── service/            regras de negócio e transações
│   │   │   └── calculo/        cálculos puros (valor de mercado, multa, partida...)
│   │   ├── repository/         acesso ao banco (Spring Data JPA)
│   │   ├── model/              entidades JPA e enums
│   │   ├── dto/                formatos de entrada e saída da API
│   │   ├── validation/         validações próprias (nome, sigla, data)
│   │   ├── config/             Jackson, relógio de Brasília, CORS e Swagger
│   │   └── common/             erros, leitura de parâmetros, textos, moedas e datas
│   ├── src/main/resources/db/migration/   migrations do Flyway
│   ├── src/test/               testes unitários e da API
│   ├── checkstyle.xml          regras de lint
│   └── Dockerfile              imagem da API
├── frontend/                   interface (Next.js)
│   └── src/
│       ├── app/                páginas (jogadores, clubes, página do clube...)
│       ├── components/         componentes de tela e componentes compartilhados (ui/)
│       ├── services/           única camada que chama a API
│       ├── hooks/              carregamento das listas, envio das ações e formulários
│       ├── contexts/           avisos de sucesso e de erro
│       └── lib/                formatação de moeda e data, validação e listas do domínio
├── docs/                       enunciado, barema e coleção do Postman
├── docker-compose.yml          banco e API (e, depois, a interface)
└── .env.example                variáveis de ambiente
```

### Bibliotecas do backend

| Biblioteca | Por que usei |
| --- | --- |
| Spring Boot Web | API REST, com o Jackson para o JSON e o Tomcat embutido |
| Spring Data JPA (Hibernate) | Acesso ao banco pelas entidades, sem SQL escrito à mão no dia a dia |
| Spring Boot Validation (Hibernate Validator) | Validação declarativa do corpo das requisições nos DTOs, com anotações próprias para nome, sigla e data |
| Flyway (com o módulo do PostgreSQL) | Cria e versiona as tabelas por migrations, o que deixa o banco reproduzível |
| Driver JDBC do PostgreSQL | Conexão com o banco |
| Lombok | Gera getters, setters e construtores das entidades e dos services, para o código ficar mais limpo |
| springdoc-openapi | Documentação interativa (Swagger) gerada a partir dos controllers |
| Spring Boot Test (JUnit 5, MockMvc, AssertJ) | Testes unitários dos cálculos e testes da API |
| Testcontainers (PostgreSQL) | Roda os testes da API contra o mesmo PostgreSQL 16 da aplicação, num contêiner descartável, sem mexer no banco de desenvolvimento |
| Spotless com Palantir Java Format (plugin do Maven) | Formatação padronizada do código, com um comando que só verifica |
| Checkstyle (plugin do Maven) | Lint: nomes fora do padrão, imports sem uso, blocos sem chaves e outras regras do `checkstyle.xml` |

### Bibliotecas do frontend

| Biblioteca | Por que usei |
| --- | --- |
| Next.js 15 (App Router) com React 19 | Base da interface, com as rotas de cada tela por pasta |
| Tailwind CSS 4 | Estilo direto nos componentes, com as cores do mockup definidas uma vez no tema |
| lucide-react | Ícones de traço fino, no mesmo estilo do mockup |
| ESLint (configuração do Next) | Aponta erros comuns de React e de hooks enquanto desenvolvo |

As chamadas à API usam o `fetch` do próprio navegador, sem biblioteca extra.

## 6. Decisões e premissas

Algumas coisas o enunciado deixa em aberto, e outras pedem uma escolha de implementação. Estas foram as minhas.

**Banco de dados**

- **PostgreSQL 16 em imagem Debian (`postgres:16`), não Alpine**, porque a comparação de nomes com acento (RN10) depende de o `lower()` tratar bem caracteres acentuados.
- **Nome do clube único direto no banco**, com um índice único sobre `lower(nome)`. Ele ignora maiúsculas e minúsculas e mantém os acentos: "Águias FC" e "Aguias FC" são diferentes, e "águias fc" é duplicado.
- **Datas como `TIMESTAMPTZ`.** O enunciado fala em `TIMESTAMP`, mas o tipo com fuso evita ambiguidade no instante gravado. A API sempre recebe e devolve no horário de Brasília (`-03:00`).
- **Regras que dependem de contagem** (no máximo 20 clubes, 12 jogadores por clube, 5 titulares) são conferidas no backend, dentro da mesma transação da operação. As outras ficam com o banco, por `CHECK`, `UNIQUE` e chaves estrangeiras.
- **No máximo um contrato `ATIVO` por jogador**, garantido por um índice único parcial em `contratos (jogador_id) WHERE situacao = 'ATIVO'`.

**Organização do código**

- **Spring Boot 3.5.16**, a última versão da linha 3, porque o enunciado pede Spring Boot 3.
- **Backend em camadas** (`model` → `repository` → `service` → `controller`). As entidades só guardam dados, os repositórios falam com o banco, os services têm as regras e as transações, e os controllers só recebem a requisição, validam a entrada pelos DTOs e chamam o service.
- **Cada cálculo mora num lugar só**, em `service/calculo`: overall, valor base, valor de mercado, taxa, multa (dias restantes e percentual), comissão e placar da partida. Nenhum deles depende de Spring ou de banco, o que facilita testar com as tabelas do enunciado.
- **Dinheiro com `BigDecimal`**, arredondado uma única vez no resultado final, com `RoundingMode.HALF_UP` (meio para longe do zero).

**Validação e formato da API**

- **Leitura estrita do JSON (V2 e V5).** Número em texto (`"15"`), fração em campo inteiro (`50.5`), número no lugar de texto e número no lugar de um valor de lista são recusados com 400. Já `50.0` é aceito como 50.
- **O id da URL é validado pela própria rota** (`[1-9][0-9]*`): `01`, `0`, `-1` e `abc` não casam com nenhuma rota e dão 404, em qualquer método.
- **Datas (RN01).** A entrada passa por uma expressão regular e é lida no modo estrito do Java, que recusa datas inexistentes (`2027-02-30`, `24:00`) em vez de "corrigir". Toda data da resposta sai em `-03:00`, com segundos. O "agora" vem de um relógio de Brasília injetado, que nos testes é trocado por um relógio que o próprio teste ajusta.
- **Fidelidade no passado ou com mais de 1.095 dias dá 400**, como na tabela "Limites de cada campo", que não marca esse limite com 409. A conferência usa o mesmo instante gravado na compra.
- **Jogador excluído some de todas as consultas** (`excluido_em IS NULL`) e responde 404, como um id que não existe. Nas transações e nas partidas antigas ele continua com o nome gravado na época.

**Listagens**

- **Listagem de jogadores e de clubes filtrada e ordenada na aplicação.** O valor de mercado (e, com ele, o patrimônio) não é gravado, e a ordem alfabética do enunciado (sem acentos, pela ordem Unicode) é diferente da do PostgreSQL. Por isso a API carrega os registros, calcula os valores e faz busca, filtros, ordenação e paginação em Java. Para o tamanho da liga, o custo é pequeno.

**Mercado**

- **Compra, venda e escalação travam a linha do clube** (`SELECT ... FOR UPDATE`) durante a operação, para que duas operações ao mesmo tempo não leiam o mesmo caixa ou o mesmo elenco. Se mesmo assim alguma restrição do banco for violada (por exemplo, dois contratos `ATIVO` para o mesmo jogador), a API responde 409 e desfaz tudo.
- **Contrato com multa vira `RESCINDIDO`, sem multa vira `ENCERRADO`** (RN15, item 4). Como o percentual mínimo é 5% e o valor de mercado mínimo é 1,00, só existe multa quando ainda faltam dias de fidelidade.
- **Exportação CSV** com `Content-Type: text/csv;charset=UTF-8` e `Content-Disposition: attachment`, para o navegador baixar o arquivo já com nome. Os erros da exportação continuam em JSON.

**Liga**

- **Escalação.** A nova escalação apaga a anterior e grava os 5 titulares na mesma transação. Quando um titular é vendido ou fica DOENTE, ele sai da escalação na mesma transação da venda ou da troca de condição; a formação continua gravada, e `complete` passa a `false` até o clube escalar de novo.
- **Partida.** A partida guarda as formações e os 6 duelos com nome, posição, condição e valores do momento, então editar ou vender um jogador depois não muda partidas passadas. O resultado (`MANDANTE`, `VISITANTE` ou `EMPATE`) é calculado a partir dos gols e não vira coluna.
- **`GET /matches` não traz o campo `duels`**, que só aparece no `POST /matches` e no `GET /matches/{id}`, como o enunciado descreve.
- **Classificação** calculada a cada consulta, com todos os clubes. Depois de pontos, saldo, gols marcados e nome, o último desempate é o id, como nas outras ordenações por nome.

**Diferenciais**

- **Swagger em `/api/v1/docs`**, gerado pelo springdoc. Os filtros da listagem aparecem um a um na documentação, com os valores aceitos.
- **Log de requisições**: um filtro registra uma linha por requisição, pelo Logback que já vem com o Spring Boot. Silenciei o aviso padrão do Spring para caminhos inexistentes, para que cada requisição gere só a sua linha.
- **A imagem Docker da API compila sem rodar os testes** (`-DskipTests`), porque os testes precisam do próprio Docker (Testcontainers). Eles rodam fora, com `mvn test`. O contêiner usa o fuso `America/Sao_Paulo`, para o log mostrar o horário de Brasília.

**Frontend**

- **O navegador chama a API direto**, no endereço de `NEXT_PUBLIC_API_URL`. O CORS do backend já libera a origem do frontend, então não precisei de proxy nem de rotas de API no Next.js.
- **Toda chamada à API fica em `src/services`.** Os componentes nunca usam `fetch`: recebem os dados por hooks (`useCarregamento` para as listas e `useAcao` para as ações).
- **Cada ação é enviada uma única vez.** O `useAcao` ignora novos cliques enquanto o pedido está em andamento e desabilita o botão; assim, um clique duplo não cria dois registros.
- **Nada do que a API calcula é recalculado na tela.** Depois de cada ação, a lista é buscada de novo na API. As mensagens de sucesso mostram os valores devolvidos por ela (por exemplo, o overall e o valor base do jogador recém-cadastrado).
- **Os formulários validam só o que é de um campo** (obrigatórios, tamanho dos textos e faixas numéricas), com a mensagem embaixo do campo. Regras que cruzam campos ou dependem do banco ficam com a API, e a tela mostra o `message` que ela devolve.
- **Recusas que a tela consegue prever são evitadas na própria tela:**
  - "Só livres" desabilita o filtro por clube;
  - quem está DOENTE não tem a opção APTO na troca de condição;
  - jogador com clube não pode mudar de posição na edição.
- **Datas digitadas são do horário de Brasília**: o campo de data e hora recebe o valor e a tela acrescenta `-03:00` antes de enviar. As datas que vêm da API (já em `-03:00`) só são reorganizadas para `dd/mm/aaaa hh:mm`, sem conversão de fuso.

## 7. Funcionalidades não implementadas

No backend, nenhuma: todos os endpoints e regras do enunciado estão implementados e testados. No frontend, já estão prontas as telas de jogadores, de clubes e a página do clube com o elenco; compra, venda, histórico, escalação, partidas e classificação estão em desenvolvimento.

## 8. Uso de inteligência artificial

- **Ferramenta:** Claude Code (Claude, da Anthropic).
- **Onde:**
  - planejamento da arquitetura e da ordem das etapas;
  - modelagem do banco e migration `V1__criar_tabelas.sql`;
  - Docker Compose e `Dockerfile` da API;
  - todos os módulos do backend (jogadores, clubes, compra e venda, histórico e CSV, escalação, partidas e classificação), com os cálculos, as validações e os endpoints;
  - testes automatizados e coleção do Postman;
  - configuração do Swagger, do log, do Checkstyle e do Spotless;
  - frontend: estrutura do projeto Next.js, componentes compartilhados e telas;
  - revisão do texto deste README.
- **Como e por quê:** usei o assistente como um par de programação. Dividi o backend em etapas e pedi uma de cada vez; ao fim de cada uma, pedi a explicação do código, apontando em que parte do enunciado cada regra é pedida, para entender o que estava sendo feito e conseguir explicar depois. Antes de cada commit, conferi o resultado pelos testes automatizados e rodando a coleção no Postman.
- **O que aceitei, alterei ou descartei:** a primeira versão do módulo de jogadores veio organizada por funcionalidade, com as regras dentro das entidades; pedi para refazer na arquitetura em camadas, com as regras nos services, e o resto do projeto seguiu esse padrão. Aceitei os cálculos depois de conferi-los com as tabelas de exemplo do enunciado, que viraram testes. As mensagens de commit e a divisão dos commits são minhas.
