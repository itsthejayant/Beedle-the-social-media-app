const mongoose = require('mongoose');
const {Schema} = mongoose;

const messagesschema = new Schema({
    senusername: String,
    message: String,
    recusername: String,
});

module.exports = mongoose.model('Messages', messagesschema);
