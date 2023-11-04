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
        await await Account.updateOne(
          { username: rUsername },
          {
            $set: {
              lastAuthentication: Date.now()
            }
          }
        );
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
  
    const defaultData = {
      lastUpdated: Date.now(),
      rareEarth: 100,
      months: 0.0,
      days: 0.0,
      hours: 0.0,
      mins: 0.0,
      seconds: 0.0,
      timeseconds: 0.0,
      percentage: 0.0,
      playerPosition: {
        keys: [],
        values: [],
      },
      questdata: {
        keys: [],
        values: [],
      },
      achievementdata: {
        keys: [],
        values: [],
      },
      eqm: {
        keys: [],
        values: [],
      },
      inventorydata: {
        keys: [],
        values: [],
      },
      itemCollected: {
        keys: [],
        values: [],
      },
      timelinedata: {
        keys: [],
        values: [],
      },
      setting: {
        sfx: {},
        bgm: {},
      },
      dialogdata: "",
      layerPlayer: "",
      layerShadow: "",
    };
  
    const newAccountData = {
      email: rEmail,
      username: rUsername,
      password: rPassword,
      data: defaultData,
      lastAuthentication: Date.now(),
      fyncid: "Not have data",
      currentScene: "Homebond",
    };
  
    try {
      const newAccount = await Account.create(newAccountData);
  
      const responseObject = {
        message: "Account created successfully",
        user: newAccount,
      };
  
      console.log(responseObject);
      res.send(responseObject.user);
    } catch (error) {
      res.send("Error: " + error);
    }
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
        const dataObject = JSON.parse(rData); // Parse the JSON data
        userAccount.data = dataObject; // Set the parsed data to the 'data' field
        const Update = await Account.updateOne(
          { username: rUsername },
          {
            $set: {
              data: dataObject
            }
          },
        )

        res.send(Update);
      } else {
        res.send("Error: Not found username");
      }
    } catch (error) {
      res.send("Error: " + error);
    }
  });

  app.post("/account/scene", async (req, res) => {
    const { rUsername, rCurrentScene } = req.body;

    if (!rUsername || !rCurrentScene) {
      res.send("Error: Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rUsername });

      if (userAccount) {
        const Update = await Account.updateOne(
          { username: rUsername },
          {
            $set: {
              currentScene: rCurrentScene
            }
          },
        ); // Fix the typo here
        
        res.send(userAccount.currentScene);
      } else {
        res.send("Error: Not found username");
      }
    } catch (error) {
      res.send("Error: " + error);
    }
  });

  app.get("/account/getData/:username", async (req, res) => {
    var rusername = req.params.username;
    if (!rusername) {
      res.send("Error: Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rusername });
      const jsonData = JSON.stringify(userAccount.data);

      res.send(jsonData);
    } catch (error) {
      res.send("Error: " + error);
    }
  });

  app.get("/account/getScene/:username", async (req, res) => {

    var rusername = req.params.username;
    if (!rusername) {
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

  app.post("/account/clearData", async (req, res) => {
    const { rUsername } = req.body;

    if (!rUsername) {
      res.send("Error: Username is required to clear data");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rUsername });

      if (userAccount) {
        await userAccount.Account.updateOne(
          { username: account.username },
          {
            $set: {
              data: {}
            }
          },
        ); 

        res.send("Data cleared successfully");
      } else {
        res.send("Error: User not found");
      }
    } catch (error) {
      res.send("Error: " + error);
    }
  });

};
