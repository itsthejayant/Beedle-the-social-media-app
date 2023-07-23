const mongoose = require('mongoose');
const { Schema } = mongoose;

const userschema= new Schema({
    username: String,
    password: String,
    chatpersons: [String],
    post_id:[{
        type: Schema.Types.ObjectId,
        ref: 'Posts'
    }]
});

module.exports = mongoose.model('Users',userschema);