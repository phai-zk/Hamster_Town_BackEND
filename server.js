require("dotenv").config();
const express = require('express');


const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

// Setup DB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect(process.env.mongoURI, { useNewUrlParser: trueuseNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    if (err) {
        console.error(err);
        return;
    }

    const db = client.db(dbName);
    const collection = db.collection('your_collection_name');

    try {
        const result = await collection.updateMany(
            { player: { $exists: false } },
            { $set: { player: { equip: {}, stat: { lv: 0 } } } }
        );

        console.log(`${result.modifiedCount} documents updated`);
    } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
});

//Setup database models
require('./model/Quest')
require('./model/Account');
require('./model/Item');



//setup routes
require('./routes/authenticationRoutes')(app);
require('./routes/itemRoutes')(app);
require('./routes/questRoute')(app);

const port = 13756
app.listen(port, () => {
    console.log("Listening on " + port)
})