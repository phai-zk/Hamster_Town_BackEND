const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    email: String,
    username: String,
    password: String,
    tag: Array,
    item: Object,
    pending: Object,
    fyncid: String,
    quest: Array,
    state: Number,
    weeklyQuest: Array,
    finishedQ: Object,
    lastAuthentication: {type: Date, default: Date.now}
});

mongoose.model('accounts', accountSchema);