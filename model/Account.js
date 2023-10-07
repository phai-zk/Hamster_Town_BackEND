const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    email: String,
    username: String,
    password: String,
    iog: Array,
    item: Object,
    fyncid: String,
    quest: [{}],
    lastposition: {
        currentScene: String, x: Number, y: Number, z: Number
    },
    weeklyQuest: Array,
    finishedQ: Object,
    lastAuthentication: { type: Date, default: Date.now }
});

mongoose.model('accounts', accountSchema);