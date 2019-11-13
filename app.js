const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql'); // Pack do express-graphql
const { buildSchema } = require('graphql'); // Schema do GraphQL
const mongoose = require('mongoose'); // Pack para ligação com o mongoDB
const bcrypt = require('bcryptjs'); // Pack para fazer a encriptação das passwords

// Importação do modelo do Event
const Event = require('./models/event');
// Importação do modelo do User
const User = require('./models/user');

const app = express();

// Global Variable
const events = [];

app.use(bodyParser.json());

/*app.get('/', (re, res, next) => {
    res.send('hello world!');
})*/

app.use(
    '/graphql', 
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String
                description: String!
                price: Float!
                date: String!
            }

            type User {
                _id: ID!
                email: String!
                password: String
            }

            input EventInput {
                title: String
                description: String
                price: Float
                date: String
            }

            input UserInput {
                email: String!
                password: String
            }

            type RootQuery {
                events: [Event!]!
            }

            type RootMutation {
                createEvent(eventInput: EventInput): Event
                createUser(userInput: UserInput): User
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                // return events;
                return Event.find()
                    .then( events => {
                        return events.map(event => {
                            return { ...event._doc, _id: event.id }
                        });
                        return events;
                    })
                    .catch( err => {
                        throw err;
                    });
            },
            // CreateEvent e o CreateUser são os -> RESOLVERS
            createEvent: (args) => {                
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price, // o símbolo + converte o que virá no args para um número
                    date: new Date(args.eventInput.date),
                    creator: '5dcc17d7bd92c7375cbe0c72'
                });
                let createdEvent;
                return event
                    .save()
                    .then( result => {
                        createdEvent = { ...result._doc, _id: result._doc_id };
                        // hardcode para testes o ID é de user especifico
                        return User.findById('5dcc17d7bd92c7375cbe0c72');
                        // console.log(result);
                        // return { ...result._doc, _id: result._doc_id.toString() };
                    })
                    .then( user => {
                        if (!user) {
                            throw new Error('User not found.');
                        }
                        user.createdEvents.push(event);
                        return user.save();
                    })
                    .then(result => {
                        return createdEvent;
                    })
                    .catch( err => {
                        console.log(err);
                        throw err;
                    });
                // PUSH event é para o graphql test no browser
                //events.push(event);
                return event;
            },
            createUser: (args) => {
                // verificar se já existe algum user com o email
                // a função findOne faz o filto pelo argumento email para comparar na BD dos users
                return User
                .findOne({email: args.userInput.email})
                .then( user => {
                    if (user) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.userInput.password, 12); // faz a encriptação da pass e o nível é o 12 (safe)
                })
                // retornar dados do utilizar (incluindo a pwd encriptada) quando criado o user para a BD 
                .then( hashedPassword => {
                    const user = new User({
                        email: args.userInput.email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then( result => {
                    return { ...result._doc, password: null,  _id: result._doc_id };
                })
                .catch( err => {
                    throw err;
                }); 
            }

        },
        graphiql: true // opção para aparecer a ferramenta gráfica do GraphQL
}));

// Conexão com o MongoDB
// mongoose.connect("mongodb+srv://<username>:<password>@cluster0-mje7a.mongodb.net/test?retryWrites=true&w=majority");
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-mje7a.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    ).then( () => { // se não houver erros faz start ao server
        app.listen(3000);
    }).catch( err => { // se der erro apresenta no terminal o erro
        console.log(err);
    });

