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

    app.post("/player/:username/unEquipt/:equiptType", async (req, res) => {
        var rusername = req.params.username;
        var requip = req.params.equiptType;

        if (!rusername || !requip) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            let equip = userAccount.player.equip;
            switch (requip) {
                case "Helmet":
                    equip.Helmet.name = "";
                    equip.Helmet.quantity = 0;
                    break;

                case "Chestplate":
                    equip.Chestplate.name = "";
                    equip.Chestplate.quantity = 0;
                    break;

                case "Legging":
                    equip.Legging.name = "";
                    equip.Legging.quantity = 0;
                    break;

                case "Boot":
                    equip.Boot.name = "";
                    equip.Boot.quantity = 0;
                    break;

                case "Hold":
                    equip.Hold.name = "";
                    equip.Hold.quantity = 0;
                    break;
            }

            await userAccount.save();
            res.send(userAccount.player.equip); //send u
            return;
        }
    })

    app.get("/player/:username/equip", async (req, res) => {
        var rusername = req.params.username;

        if (!rusername) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            res.send(userAccount.player.equip)
            return;
        }
        res.send("Error : Not found")
    })

    app.post("/player/:username/stat", async (req, res) => {
        var rusername = req.params.username;
        const { rstat } = req.body
        if (!rusername || !rstat) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            userAccount.player.stat.lv = rstat;
            res.send(userAccount.player.stat)
            return;
        }
        res.send("Error : Not found")
    })

    app.get("/player/:username/GetStat", async (req, res) => {
        var rusername = req.params.username;

        if (!rusername) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            res.send(userAccount.player.stat)
            return;
        }
        res.send("Error : Not found")
    })

    app.post("/player/:username/currency", async (req, res) => {
        var rusername = req.params.username;
        const { rCurrency } = req.body;
        if (!rusername, !rCurrency) {
            res.send("Error : Invalid");
            return;
        }
        const userAccount = await Account.findOne({username: rusername})
        if (userAccount) {
            userAccount.rareEarth = rCurrency;
            userAccount.save();
            res.send(userAccount.rareEarth);
            return;
        }
        res.send("Error : Not found");
    })

    app.get("/player/:username/GetCurrency", async (req, res) => {
        var rusername = req.params.username;
        if (!rusername) {
            //if 2 data are null end api
            res.send("Error : Invalid credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount) {
            res.send(userAccount.player.rareEarth)
            return;
        }
        res.send("Error : Not found")
    })
}