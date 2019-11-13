const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Criação do objecto Schema para o MongoDB
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Mongo Model - o nome do Model é Event
// O exports faz com que este model seja lido em outro local
module.exports = mongoose.model('Event', eventSchema);