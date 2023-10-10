const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
    email: String,
    username: String,
    password: String,
    iog: Array,
    item: Object,
    player:{
        equip:{
            Helmet:{name:String, quantity:Number},
            Chestplate:{name:String, quantity:Number},
            Legging:{name:String, quantity:Number},
            Boot:{name:String, quantity:Number},
            Hold:{name:String, quantity:Number},
        },
        stat:
        {
            lv:Number
        }
    },
    rareEarth: Number,
    fyncid: String,
    quest: [{}],
    questData: String,
    lastposition: {
        currentScene: String, x: Number, y: Number, z: Number
    },
    weeklyQuest: Array,
    finishedQ: Object,
    lastAuthentication: { type: Date, default: Date.now }
});

mongoose.model('accounts', accountSchema);