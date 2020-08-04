# Pair Programming!

Eduardo Bisinella: https://github.com/dudubisinella/transactions-api-
Emanuel Barcelos:

------------------------------------------------------------------------

# Tarefas iniciais

[x] Criar a sala no meet,

[x] Criar um repositório no GitHub com o nome transactions-api (convidar os integrantes do grupo para contribuir no repositório)

[x] Começar como piloto, nas duplas, podem decidir.

[x] Criar a sessão do live share e começa o código, inicializa o repositório Git e dá o primeiro commit e push para o repositório remoto criado no GitHubO primeiro da dupla cria a sala no meet,

[x] O segundo cria um repositório no GitHub com o nome transactions-api (não esqueça de convidar os integrantes do seu grupo para contribuir no repositório).

------------------------------------------------------------------------

# Exercício

## 01

POST /transactions: A rota deve receber [title], [value] e [type] dentro do corpo
da requisição, sendo type o tipo da transação, que deve ser income para
entradas (depósitos) e outcome para saídas (retiradas). Ao cadastrar uma
nova transação, ela deve ser armazenada dentro de um objeto com o
seguinte formato:

{
"id": "uuid",
"title": "Salário",
"value": 3000,
"type": "income"
}

## 02

GET /transactions: Essa rota deve retornar uma listagem com todas as
transações que você cadastrou até o momento, junto com o valor de soma de
entradas, retiradas e total de crédito. Essa rota deve retornar um objeto com
o formato a seguir:

{arr[]}

## 03

PUT/DELETE /transactions: Devem editar ou deletar transações

## 04

Middlewares:
○ Validar se o uid enviado como parâmetro de rota é válido (nas rotas
que o recebem);

○ Validar se o uid enviado como parâmetro existe dentro da aplicação
    ■ Dica: Dentro do middleware você pode armazenar informações
    dentro do objeto request, exemplo:
    request.transactionIndex = transactionIndex;
    ■ Deste modo, o valor de request.transactionIndex fica
    disponível para utilização dentro das rotas que passarem por
    esse middleware.

○ Log de todas as requisições com o tipo e url acessada;