const mongoose = require("mongoose");
const Account = mongoose.model("accounts");
const quest = mongoose.model("quests");

module.exports = (app) => {
  //login api
  app.post("/account/login", async (req, res) => {
    const { rUsername, rPassword } = req.body; //use 2 data for login rUsername, rPassword
    if (!rUsername || !rPassword) {
      //if 2 data are null end api
      res.send("Error : Invalid credentials");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername }); //find username in Account database
    if (userAccount) {
      //if find user account
      if (rPassword === userAccount.password) {
        //check password
        userAccount.lastAuthentication = Date.now(); //update date
        await userAccount.save();
        // res.send("logged in"); //send user info
        res.send(userAccount); //send user info
        return;
      }
    }

    res.send("Error : Invalid credentials"); //if can't find user
  });

  app.post("/account/state", async (req, res) => {
    const { rUsername, rState } = req.body; //use 2 data for login rUsername, rPassword
    if (!rUsername || !rState) {
      //if 2 data are null end api
      res.send("Error Naja");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername }); //find username in Account database
    if (userAccount) {
      userAccount.state = rState;
      await userAccount.save();
      res.send(userAccount); //send user info
      return;
    }
  })

  // This route is used to create a new account
  app.post("/account/create", async (req, res) => {
    // Extract the email, username, and password from the request body
    const { rEmail, rUsername, rPassword } = req.body;

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(rEmail)) {
      res.send("Error : Invalid email address!");
      return;
    }

    // If any of the required fields are missing, send an error response
    if (!rEmail || !rUsername || !rPassword) {
      res.send("Error : Invalid credentials");
      return;
    }


    // Check if there is already an account with the same username or email
    const userAccount = await Account.findOne({ username: rUsername });
    const emailAccount = await Account.findOne({ email: rEmail });
    console.log(emailAccount);
    console.log(userAccount);
    // If there is already an account with the same email, send an error response
    if (emailAccount) {
      res.send("Error : Email or Username is already taken ");
      return;
    }

    // If there is already an account with the same username, send an error response
    if (userAccount) {
      res.send("Error : Username is already taken");
      return;
    }

    // Create a new account with the given data and default values for other fields
    const newAccount = new Account({
      email: rEmail,
      username: rUsername,
      password: rPassword,
      data: "",
      lastAuthentication: Date.now(),
      fyncid: "Not have data",
      currentScene: "Homebond"
    });

    // Save the new account to the database
    await newAccount.save();

    // Send a success response with the new account object
    res.send(newAccount);
  });

  app.get("/account/getData/:username", async (req, res) => {
    var rusername = req.params.username; // Retrieve the username from the request body
    console.log(rusername);
    // Check if the username is null or undefined

    // Query the database for an Account document that has the specified username
    var userAccount = await Account.findOne({ username: rusername });
    console.log(userAccount);
    res.send(userAccount); // Send the user data as a response
    return;
  });


  app.get("/account/getDataAll", async (req, res) => {
    const allAccount = await Account.find();
    res.send(allAccount);
  });

  app.post("/account/editFyncId", async (req, res) => {
    const { rUsername, rFyncId } = req.body;
    if (!rUsername || !rFyncId) {
      res.send("Error : Not enough info");
      return;
    }

    updateQuery = { $set: { fyncid: rFyncId } };


    const updateResult = await Account.updateOne(
      { username: rUsername },
      updateQuery
    );

    if (updateResult.nModified === 0) {
      res.send("Error : Failed to update item amount");
    } else {
      res.send(updateQuery.$set);
    }

  });


  app.get("/account/getbyfync/:FyncId", async (req, res) => {
    var rFyncId = req.params.FyncId; // Retrieve the username from the request body
    // Check if the username is null or undefined
    // Query the database for an Account document that has the specified username
    var userAccount = await Account.findOne({ fyncid: rFyncId });
    console.log(userAccount.username);
    res.send(userAccount.username); // Send the user data as a response
    return;
  });

  app.post("/account/position/:username", async (req, res) => {
    var rusername = req.params.username; // Retrieve the username from the request body
    const { rScene} = req.body;
    if (!rScene) {
      res.send("Error : Not enough info");
      return;
    }

    var userAccount = await Account.findOne({ username: rusername });
    if (userAccount) {
      userAccount.currentScene = rScene;
      await userAccount.save();
      res.send(userAccount); //send u
      return;
    }

  })

  app.get("/account/getPosition/:username", async (req, res) =>{
    const rUsername =req.params.username;
    if (!rUsername) {
      res.send("Error : Not Found");
    }
    try {
      const userAccount = await Account.findOne({username: rUsername});
      res.send(userAccount.currentScene);
    } catch (err) {
      console.error(err)
    }
  })
  // app.get("/quest/data/:rusername", async (req, res) => {
  //   const rusername = req.params.rusername;
  //   if (!rusername) {
  //     res.send("Error : Not Found");
  //     return;
  //   }
  //   try {
  //     const qAccount = await Account.findOne({ username: rusername });
  //     res.send(qAccount.questData);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

};
