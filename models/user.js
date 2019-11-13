const mongoose = require('mongoose'); // Pack para ligação com o mongoDB

// Schema
const Schema = mongoose.Schema;

// Objecto de utilizadores
const userSchema = new Schema ({
    // como está SEM [] quer dizer que um User só pode ter um email
    email: {
        type: String,
        required: true
    },
    // como está SEM [] quer dizer que um User só pode ter uma password
    password: {
        type: String,
        required: true
    },
    // como está COM [] quer dizer que será um array de vários eventos
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

// Mongo Model - o nome do Model é User
// O exports faz com que este model seja lido em outro local
module.exports = mongoose.model('User', userSchema);