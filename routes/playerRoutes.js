const mongoose = require("mongoose");
const Account = mongoose.model("accounts");

module.exports = (app) => {
    app.post("/player/:username/equipt/:equiptType", async (req, res) => {
        var rusername = req.params.username;
        var requip = req.params.equiptType;
        const { ritem, rquantity } = req.body;

        if (!rusername || !requip || !ritem || !rquantity) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            let equip = userAccount.player.equip;
            switch (requip) {
                case "Helmet":
                    equip.Helmet.name = ritem;
                    equip.Helmet.quantity = rquantity;
                    break;

                case "Chestplate":
                    equip.Chestplate.name = ritem;
                    equip.Chestplate.quantity = rquantity;
                    break;

                case "Legging":
                    equip.Legging.name = ritem;
                    equip.Legging.quantity = rquantity;
                    break;

                case "Boot":
                    equip.Boot.name = ritem;
                    equip.Boot.quantity = rquantity;
                    break;

                case "Hold":
                    equip.Hold.name = ritem;
                    equip.Hold.quantity = rquantity;
                    break;
            }

            await userAccount.save();
            res.send(userAccount.player.equip); //send u
            return;
        }
    })

    app.post("/player/:username/equipt/:equiptType", async (req, res) => {
        var rusername = req.params.username;
        var requip = req.params.equiptType;
        const { ritem, rquantity } = req.body;

        if (!rusername || !requip || !ritem || !rquantity) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            let equip = userAccount.player.equip;
            switch (requip) {
                case "Helmet":
                    equip.Helmet.name = ritem;
                    equip.Helmet.quantity = rquantity;
                    break;

                case "Chestplate":
                    equip.Chestplate.name = ritem;
                    equip.Chestplate.quantity = rquantity;
                    break;

                case "Legging":
                    equip.Legging.name = ritem;
                    equip.Legging.quantity = rquantity;
                    break;

                case "Boot":
                    equip.Boot.name = ritem;
                    equip.Boot.quantity = rquantity;
                    break;

                case "Hold":
                    equip.Hold.name = ritem;
                    equip.Hold.quantity = rquantity;
                    break;
            }

            await userAccount.save();
            res.send(userAccount.player.equip); //send u
            return;
        }
    })


}