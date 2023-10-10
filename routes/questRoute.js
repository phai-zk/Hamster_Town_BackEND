const mongoose = require("mongoose");
const quest = mongoose.model("quests");
const Account = mongoose.model("accounts");
const Item = mongoose.model("items");

module.exports = (app) => {

  app.post("/quest/give", async (req, res) => {
    const { rUsername } = req.body;
    const { rName } = req.body;
    const { rState } = req.body;

    if (!rUsername || !rName || !rState) {
      res.send("Error : Not enough info");
      return;
    }
    // const qDescription = await quest.findOne({qName:rName})
    // const qAccount = await Account.findOne({username:rUsername})

    try {
      const qAccount = await Account.findOne({ username: rUsername });
      await Account.updateOne(
        { username: rUsername },
        {
          $push: {
            quest: {
              rName,
              rState,
              progress: 0,
            },
          },
        },
        { new: true }
      );
      res.send(qAccount);

    } catch (err) {
      // Handle error
      console.error(err);
    }
  });

  app.post("/quest/data", async (req, res) => {
    const {rUsername} = req.body;
    const {rQuestData} = req.body;
    try {
      const qAccount = await Account.findOne({ username: rUsername });
      await Account.updateOne(
        { username: rUsername },
        {
          $push : {
            questData: {
              rQuestData,
            }
          }
        }
      )
    } catch (err) {
      console.error(err);
    }
  });

  app.post("/quest/update", async (req, res) => {
    const { rUsername } = req.body;
    const { rQuestno } = req.body;
    try {
      const qAccount = await Account.findOne({ username: rUsername });
      const objects = "quest." + String(rQuestno) + ".progress";
      let progress = qAccount.quest[rQuestno].progress + 1;
      await qAccount.updateOne(
        { "$set": { [objects]: progress } }
      )
      console.log([objects], progress);
      res.send(qAccount);

    } catch (err) {
      // Handle error
      console.error(err);
    }
  });

  app.get("/quest/Allquest/:username", async (req, res) => {
    var rusername = req.params.username;

    var userAccount = await Account.findOne({ username: rusername });
    if (userAccount) {
      try {
        // Retrieve all items from the database

        // Send a success response with the list of items
        res.json(userAccount.quest);
      } catch (error) {
        // Handle any errors that occur while fetching items
        console.error(error);
        res.status(500).send("Error : Something went wrong while fetching items");
      }
    }
  });

  app.get("/quest/Getquest/:username/:qustname", async (req, res) => {
    var rusername = req.params.username;
    var rquest = req.params.qustname;

    let quest;

    var userAccount = await Account.findOne({ username: rusername });
    if (userAccount) {
      try {
        // Retrieve all items from the database
        for (let i = 0; i < userAccount.quest.length; i++) {
          if (userAccount.quest[i].rName == rquest) {
            quest = userAccount.quest[i];
          }
        }
        res.json(quest);
            // Send a success response with the list of items
      } catch (error) {
        // Handle any errors that occur while fetching items
        console.error(error);
        res.status(500).send("Error : Something went wrong while fetching items");
      }
    }
  });

  app.post("/quest/clearquest", async (req, res) => {
    const { rUsername, rQuestno } = req.body;

    if (!rUsername || rQuestno === undefined) {
      res.send("Error : Not enough info");
      return;
    }

    try {
      const userAccount = await Account.findOne({ username: rUsername });

      if (!userAccount) {
        res.send(`Error : Account not found for username: ${rUsername}`);
        return;
      }

      const questArray = userAccount.quest;

      if (rQuestno >= questArray.length || rQuestno < 0) {
        res.send(`Error : Invalid quest index: ${rQuestno}`);
        return;
      }

      // unset the entire object at the specified index
      questArray[rQuestno] = undefined;

      // remove the undefined elements from the questArray
      const filteredQuestArray = questArray.filter((quest) => quest !== undefined);

      // update the user account with the filtered quest array
      const updateQuery = {
        $set: {
          quest: filteredQuestArray,
        },
      };

      const updateResult = await Account.updateOne(
        { username: rUsername },
        updateQuery
      );

      if (updateResult.nModified === 0) {
        res.send("Error : Failed to update quest");
      } else {
        res.send(updateQuery.$set);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Error : Server error" });
    }
  });

};
