const mongoose = require('mongoose');
const {Schema} = mongoose;

const postschema = new Schema({
    creator: String,
    title : String,
    description: String,
    imageurl: String,
    user_id :{
        type: Schema.Types.ObjectId,
        ref :'Users'
    },
    // comments: [String],
    likecount : Number
});

module.exports = mongoose.model('Posts',postschema);