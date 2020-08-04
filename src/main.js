const express = require("express");
const {uuid} = require("uuidv4");
const app = express();

app.use(express.json());

// ------------------------------------------------------------------------------
// Base de dados
let baseTransactions = {
    "transactions": [
        {
        "id": "uuid1",
        "title": "Salário",
        "value": 4000,
        "type": "income"
        },
        {
        "id": "uuid2",
        "title": "Freela",
        "value": 2000,
        "type": "income"
        },
        {
        "id": "uuid3",
        "title": "Paga fatura",
        "value": 4000,
        "type": "outcome"
        },
    ],

    "balance": {
    "income": 0,
    "outcome": 0,
    "total": 0
    }
}
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// Middlewares
// ------------------------------------------------------------------------------

function logRequests(request, response, next){

    const {method, url} = request;
    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);
    next();
    console.timeEnd(logLabel);
};
// ------------------------------------------------------------------------------
function findIndexAll(idTra){

    const indexTransaction = baseTransactions.transactions.findIndex((transac) => transac.id == idTra);
    return indexTransaction;
};

function balanceCalculator(allTra){

    allTra.balance.income = 0;
    allTra.balance.outcome = 0;
    allTra.balance.total = 0;

    let allTotal = allTra.transactions.reduce((prevVal, actVal) => {

        if(actVal.type == "income"){
            allTra.balance.income += actVal.value;
            return prevVal + actVal.value
        } else {
            allTra.balance.outcome += actVal.value;
            return prevVal - actVal.value
        }
    }, 0);
    
    allTra.balance.total = allTotal;
};

// ------------------------------------------------------------------------------
// INICIO DAS COMUNICACOES
// ------------------------------------------------------------------------------
//Middleware para log de requisicoes
app.use(logRequests);

// ------------------------------------------------------------------------------
// Verifica as transacoes
app.get("/transactions", (request, response) => {

    const allTransactions = baseTransactions;

    balanceCalculator(allTransactions);

    return response.json(allTransactions);
});

// ------------------------------------------------------------------------------
//Envia nova transacao
app.post("/transactions", (request, response) =>{

    const  {title, value, type} = request.body;
    const newTransaction = {id: uuid(), title, value, type};

    baseTransactions.transactions.push(newTransaction);

    return response.json(baseTransactions.transactions);
})

// ------------------------------------------------------------------------------
//Altera transacao
app.put("/transactions/:id", (request, response) => {

    const {id} = request.params;
    const {title, value, type} = request.body;

    const masterIndex = findIndexAll(id);
    
    const updateTransaction = {
        id, title, value, type,
    };

    baseTransactions.transactions[masterIndex] = updateTransaction;

    return response.json(baseTransactions.transactions);
});

// ------------------------------------------------------------------------------
//Deleta transacao
app.delete("/transactions/:id", (request, response) => {

    const {id} = request.params;
    const masterIndex = findIndexAll(id);
    
    baseTransactions.transactions.splice(masterIndex, 1);

    return response.json(baseTransactions.transactions);
});

// ------------------------------------------------------------------------------



// ------------------------------------------------------------------------------
// Inicia o servico
// ------------------------------------------------------------------------------
const port = 4646;
app.listen(port, () => {
    console.log(`==> SERVER UP! Porta ${port} <==`);
});