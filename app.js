const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql'); // Pack do express-graphql
const mongoose = require('mongoose'); // Pack para ligação com o mongoDB

const graphQlSchema = require('./graphql/schema/index'); // chamada ao ficheiro do index do schema
const graphQlResolvers = require('./graphql/resolvers/index'); // chamada ao ficheiro do index do schema
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

// middleware para permitir que kker acesso localmente é permitido
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS'); // Grant acess a todos os clientes localmente
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });


/*app.get('/', (re, res, next) => {
    res.send('hello world!');
})*/

app.use(isAuth);

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true // opção para aparecer a ferramenta gráfica do GraphQL
}));

// Conexão com o MongoDB
// mongoose.connect("mongodb+srv://<username>:<password>@cluster0-mje7a.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-mje7a.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then( () => { // se não houver erros faz start ao server
        app.listen(8000);
    }).catch( err => { // se der erro apresenta no terminal o erro
        console.log(err);
    });

