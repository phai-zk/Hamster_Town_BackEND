require("dotenv").config();
const express = require('express');


const app = express();
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

// Setup DB
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {

    if (err) {
        console.error(err);
        return;
    }

    const Account = mongoose.model("accounts");

    let accounts = await Account.find();

    try {
        // const accountsWithoutPlayer = await Account.find({ player: { $exists: false } });
        // accountsWithoutPlayer.forEach(async (account) => {
        //     try {
        //       const result = await Account.updateOne(
        //         { username: account.username },
        //         {
        //           $set: {
        //             player: {
        //               equip: {
        //                 Helmet: { name: "", quantity: 0 },
        //                 Chestplate: { name: "", quantity: 0 },
        //                 Legging: { name: "", quantity: 0 },
        //                 Boot: { name: "", quantity: 0 },
        //                 Hold: { name: "", quantity: 0 },
        //               },
        //               stat: { lv: 1 }
        //             }
        //           }
        //         }
        //       );
      
        //       console.log(`Updated document with _id ${account._id}`);
        //     } catch (error) {
        //       console.error(`Error updating document with _id ${account._id}:`, error);
        //     }
    // })
    } catch (error) {
        console.error(error);
    }
});

//Setup database models
require('./model/Quest')
require('./model/Account');
require('./model/Item');



//setup routes
require('./routes/authenticationRoutes')(app);
require('./routes/itemRoutes')(app);
require('./routes/playerRoutes')(app);
require('./routes/questRoute')(app);

const port = 13756
app.listen(port, () => {
    console.log("Listening on " + port)
})