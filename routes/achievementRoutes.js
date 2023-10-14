const mongoose = require("mongoose");
const Account = mongoose.model("accounts");

module.exports = (app) => {

    app.post("/achievement/give", async (req, res) => {
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
                achievement: {
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
  
    app.post("/achievement/data", async (req, res) => {
      const { rUsername } = req.body;
      const { rName } = req.body
      const { rAchievementData } = req.body;
      if (!rUsername || !rName || !rQuestData) {
        res.send("Error : Not Found")
        return;
      }
      try {
  
        const qAccount = await Account.findOne({ username: rUsername });
        const AddData = Account.updateOne(
          { username: rUsername },
          {
            $push: {
                achievementData: {
                rName,
                rAchievementData,
              }
            }
          })
  
        const existingQuestData = qAccount.questData.find((data) => data.rName === rName);
  
        if (existingAchievementData) {
          // Update existing achievement data
          const updatedData = await Account.updateOne(
            { username: rUsername, "questData.rName": rName },
            {
              $set: {
                "achievementData.$.rAchievementData": rAchievementData
              }
            }
          );
          res.send("Update successfully")
          return;
        }
  
        await AddData;
        res.send("successfully")
      } catch (err) {
        console.error(err);
        res.send("Error : Invalid")
      }
  
  
    });
  
    app.get("/achievement/data/:rusername/:achievementName", async (req, res) => {
      const rusername = req.params.rusername;
      const rachievement = req.params.questName;
      if (!rusername || !rachievement) {
        res.send("Error : Not Found");
        return;
      }
      try {
        const qAccount = await Account.findOne({ username: rusername });
        if (qAccount.achievementData) {
  
          qAccount.achievementData.forEach(data => {
  
            if (data.rName == rachievement) {
              res.send(data);
              return;
            }
          });
        }
        res.send("Error : Not Have Quest")
      } catch (err) {
        console.error(err);
      }
    });
  
    app.get("/achievement/data/:rusername", async (req, res) => {
      const rusername = req.params.rusername;
      if (!rusername) {
        res.send("Error : Not Found");
        return;
      }
      try {
        const qAccount = await Account.findOne({ username: rusername });
        res.send(qAccount.achievementData);
      } catch (err) {
        console.error(err);
      }
    });
  
    app.post("/achievement/data/clear/:rusername", async (req, res) => {
      const rusername = req.params.rusername;
      if (!rusername) {
        req.send("Error : Not Found")
      }
      const qAccount = await Account.findOne({ username: rusername });
      if (qAccount.achievementData) {
        await Account.updateOne(
          { username: rusername },
          {
            $set: {
                achievementData: []
            }
          })
        res.send("successfully")
        return;
      }
      res.send("Error : Not Found")
    });
  
    app.post("/achievement/update", async (req, res) => {
      const { rUsername } = req.body;
      const { rAchievementno } = req.body;
      try {
        const qAccount = await Account.findOne({ username: rUsername });
        const objects = "achievement." + String(rAchievementno) + ".progress";
        let progress = qAccount.achievement[rAchievementno].progress + 1;
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
  
    app.get("/achievement/Allquest/:username", async (req, res) => {
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
  
    app.get("/achievement/getAchievement/:username/:achievementName", async (req, res) => {
      var rusername = req.params.username;
      var rachievement = req.params.achievementName;
  
      let achievement;
  
      var userAccount = await Account.findOne({ username: rusername });
      if (userAccount) {
        try {
          // Retrieve all items from the database
          for (let i = 0; i < userAccount.quest.length; i++) {
            if (userAccount.achievement[i].rName == rachievement) {
                achievement = userAccount.achievement[i];
            }
          }
          res.json(achievement);
          // Send a success response with the list of items
        } catch (error) {
          // Handle any errors that occur while fetching items
          console.error(error);
          res.status(500).send("Error : Something went wrong while fetching items");
        }
      }
    });
  
    app.post("/achievement/clearAchievement", async (req, res) => {
      const { rUsername, rAchievementno } = req.body;
  
      if (!rUsername || rAchievementno === undefined) {
        res.send("Error : Not enough info");
        return;
      }
  
      try {
        const userAccount = await Account.findOne({ username: rUsername });
  
        if (!userAccount) {
          res.send(`Error : Account not found for username: ${rUsername}`);
          return;
        }
  
        const achievementArray = userAccount.achievement;
  
        if (rAchievementno >= achievementArray.length || rAchievementno < 0) {
          res.send(`Error : Invalid quest index: ${achievementArray}`);
          return;
        }
  
        // unset the entire object at the specified index
        achievementArray[rAchievementno] = undefined;
  
        // remove the undefined elements from the questArray
        const filteredAchievementArray = achievementArray.filter((achievement) => achievement !== undefined);
  
        // update the user account with the filtered quest array
        const updateQuery = {
          $set: {
            achievement: filteredAchievementArray,
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