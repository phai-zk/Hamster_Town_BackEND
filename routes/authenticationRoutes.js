const mongoose = require("mongoose");
const Account = mongoose.model("accounts");
const quest = mongoose.model("quests");

module.exports = (app) => {

  app.post("/account/login", async (req, res) => {

    const { rUsername, rPassword } = req.body;
    if (!rUsername || !rPassword) {
      res.send("Error : Invalid credentials");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });
    if (userAccount) {
      if (rPassword === userAccount.password) {
        userAccount.lastAuthentication = Date.now();
        await userAccount.save();
        res.send(userAccount);
        return;
      }
    }

    res.send("Error : Invalid credentials");
  });

  app.post("/account/create", async (req, res) => {

    const { rEmail, rUsername, rPassword } = req.body;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(rEmail)) {
      res.send("Error : Invalid email address!");
      return;
    }

    if (!rEmail || !rUsername || !rPassword) {
      res.send("Error : Invalid credentials");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });
    const emailAccount = await Account.findOne({ email: rEmail });

    if (emailAccount) {
      res.send("Error : Email or Username is already taken ");
      return;
    }

    if (userAccount) {
      res.send("Error : Username is already taken");
      return;
    }

    const newAccount = new Account({
      email: rEmail,
      username: rUsername,
      password: rPassword,
      data: "",
      lastAuthentication: Date.now(),
      fyncid: "Not have data",
      currentScene: "Homebond"
    });

    await newAccount.save();
    console.log(newAccount);
    res.send(newAccount);
  });

  app.get("/account/getUserData/:username", async (req, res) => {
    var rusername = req.params.username;
    var userAccount = await Account.findOne({ username: rusername });
    res.send(userAccount);
    return;
  });

  app.post("/account/gameData", async (req, res) => {
    const { rUsername, rData } = req.body;

    if (!rUsername || !rData) {
      res.send("Error: Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rUsername });
      
      if (userAccount) {
        userAccount.data = rData;
        await userAccount.save(); // Fix the typo here

        res.send(userAccount.data);
      } else {
        res.send("Error: Not found username");
      }
    } catch (error) {
      res.send("Error: " + error);
    }
});

  app.get("/account/getData/:username", async (req, res) => {
    
    var rusername = req.params.username;
    if(!rusername)
    {
      res.send("Error : Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rusername });
      res.send(userAccount.data);

    } catch (error) {
      res.send("Error : " + error);
    }

  });

  app.get("/account/getScene/:username", async (req,res)=>{

    var rusername = req.params.username;
    if(!rusername)
    {
      res.send("Error : Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rusername });
      res.send(userAccount.currentScene);

    } catch (error) {
      res.send("Error : " + error);
    }

  });

};
