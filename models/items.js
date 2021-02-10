const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    desc: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Item', ItemSchema);