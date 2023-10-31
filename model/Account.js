const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    email: String,
    username: String,
    password: String,
    data: Object,
    fyncid: String,
    currentScene: String,
    lastAuthentication: { type: Date, default: Date.now }
});

mongoose.model('accounts', accountSchema);