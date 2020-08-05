const express = require("express");
const {uuid, isUuid} = require("uuidv4");
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

function validateTransactionId(request, response, next){
    
    const {id} = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: `Param sent is not a valid UUID`});
    };
    next();
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

    let allIncome = allTra.transactions.reduce((prevVal, actVal) => actVal.type == "income" ? prevVal + actVal.value : prevVal , 0);
    let allOutcome = allTra.transactions.reduce((prevVal, actVal) => actVal.type == "outcome" ? prevVal + actVal.value : prevVal , 0);
    let allTotal = allTra.transactions.reduce((prevVal, actVal) => actVal.type == "income" ? (prevVal + actVal.value) : (prevVal - actVal.value) , 0);
   
    allTra.balance.income = allIncome;
    allTra.balance.outcome = allOutcome;
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
app.put("/transactions/:id", validateTransactionId, (request, response) => {

    const {id} = request.params;
    const {title, value, type} = request.body;

    const masterIndex = findIndexAll(id);

    if(masterIndex < 0){
        return response.status(400).json({"error delete":"Projeto nao encontrado!"});
    };
    
    const updateTransaction = {
        id, title, value, type,
    };

    baseTransactions.transactions[masterIndex] = updateTransaction;

    return response.json(baseTransactions.transactions);
});

// ------------------------------------------------------------------------------
//Deleta transacao
app.delete("/transactions/:id", validateTransactionId, (request, response) => {

    const {id} = request.params;
    const masterIndex = findIndexAll(id);

    if(masterIndex < 0){
        return response.status(400).json({"error delete":"Projeto nao encontrado!"});
    };
    
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