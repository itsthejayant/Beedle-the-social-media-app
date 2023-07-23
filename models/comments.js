const mongoose = require('mongoose');
const {Schema} = mongoose;

const commentschema = new Schema({
    username: String,
    message: String,
    replies: [String],
    post_id: {
        type: Schema.Types.ObjectId,
        ref :'Posts'
    }
});

module.exports = mongoose.model('Comments',commentschema);
