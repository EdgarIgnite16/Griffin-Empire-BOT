const { Schema, model } = require('mongoose');

let GE = new Schema({
    Content: String
});

module.exports = model('testingschema1912323131', GE);