const { Schema, model } = require('mongoose');

let GE = new Schema({
    battleID: String,
    startTime: String,
    endTime: String,
    playerJoin: Object,
});

module.exports = model('history_battle', GE);