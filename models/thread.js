const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    text: { type: String },
    created_on: { type: Date, default: Date.now },
    delete_password: { type: String },
    reported: { type: Boolean, default: false }
});

const ThreadSchema = new Schema({
    board: { type: String, required: true },
    text: { type: String, required: true },
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    delete_password: { type: String, required: true },
    replies: [ReplySchema]
});

module.exports = mongoose.model('Thread', ThreadSchema);
