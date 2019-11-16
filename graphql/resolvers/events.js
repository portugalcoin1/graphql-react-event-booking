const Event = require('../../models/event'); // Importação do modelo do event
const { transformEvent } = require('./merge');

module.exports = {
    // return events;
    // retorna toda a informação de uma relação
        events: async () => {
          try{
            const events = await Event.find()
            return events.map(event => {
              return transformEvent(event);
            })
          } catch (err) {
            throw err;
          };
        },
        createEvent: async args => {                
          const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price, // o símbolo + converte o que virá no args para um número
            date: new Date(args.eventInput.date),
            creator: '5dcc17d7bd92c7375cbe0c72'
          });
          let createdEvent;
          try {
            const result = await event
            .save()
              createdEvent = transformEvent(result);
              // hardcode para testes o ID é de user especifico
              const creator = await User.findById('5dcc17d7bd92c7375cbe0c72');
              if (!creator) {
                throw new Error('User not found.');
              }
              creator.createdEvents.push(event);
              await creator.save();
              return createdEvent;
          } catch (err) {    
            console.log(err);
            throw err;
          }
          // PUSH event é para o graphql test no browser
          // events.push(event);
          return event;
        }
    }