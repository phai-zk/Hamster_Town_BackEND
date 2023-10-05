const mongoose = require("mongoose");
const Item = mongoose.model('items');
const Account = mongoose.model("accounts");

module.exports = (app) => {

  app.post("/item/give", async (req, res) => {
    const { rUsername, rItemName } = req.body;

    if (!rUsername || !rItemName) {
      res.send("Error : Not enough info");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });
    let itemAmount = 0;
    if (userAccount.item.hasOwnProperty(rItemName)) {
      itemAmount = parseInt(userAccount.item[rItemName]);
      console.log(parseInt(userAccount.item[rItemName]));
    } else {
      itemAmount = 0;
    }
    const Names = "item." + rItemName;

    const updateQuery = {
      $set: { [Names]: itemAmount + 1 },
    };

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

  // This route allows clients to retrieve user data based on a provided username
  app.post("/item/sentGift", async (req, res) => {
    try {
      // Extract the required fields from the request body
      const { rSentedPerson, rRecievePerson, rGift } = req.body;

      // Check if all the required fields are present
      if (!rSentedPerson || !rRecievePerson || !rGift) {
        // Send a "Not enough info" response to the client and return from the function
        res.send("Error : Not enough info");
        return;
      }

      // Look up the sender and receiver accounts in the database
      const sentedAccount = await Account.findOne({ username: rSentedPerson });
      const receivedAccount = await Account.findOne({ username: rRecievePerson });

      if (!sentedAccount || !receivedAccount) {
        // Send an error response if either the sender or receiver account is not found
        res.send("Error : Sender or receiver account not found");
        return;
      }

      // Check if the sender has the gift in their item object
      if (!sentedAccount.item || !sentedAccount.item[rGift]) {
        // Send an error response if the gift is not found in the sender's item object
        res.send("Error : Gift not found in sender's item object");
        return;
      }

      // Initialize the receiver's pending object if it doesn't exist
      if (!receivedAccount.pending) {
        receivedAccount.pending = {};
      }

      receivedAccount.pending = { ...receivedAccount.pending, [rSentedPerson]: rGift };

      await sentedAccount.save();
      // Remove the gift from the sender's item object

      itemAmount = parseInt(sentedAccount.item[rGift]);
      console.log(parseInt(sentedAccount.item[rGift]));

      const Names = "item." + rGift;

      if (itemAmount > 1) {
        updateQuery = { $set: { [Names]: itemAmount - 1 } };
      }
      else if (itemAmount == 1) {
        updateQuery = { $unset: { [Names]: itemAmount } };
      }

      const updateResult = await Account.updateOne(
        { username: sentedAccount },
        updateQuery
      );
      // Save the updated sender and receiver accounts



      // Send a success response to the client
      res.send("Gift sent successfully");
    } catch (err) {
      // Handle any errors that occur during the process
      console.error(err);
      res.status(500).send("Error : Internal server error");
    }
  });

  // Handle POST requests to '/account/recievegift'
  app.post("/item/receiveGift", async (req, res) => {
    const { rReceivePerson, rSentedPerson } = req.body;

    if (!rReceivePerson || !rSentedPerson) {
      res.send("Error : Not enough info");
      return;
    }

    try {
      const receivedAccount = await Account.findOne({ username: rReceivePerson });

      if (!receivedAccount.pending || !receivedAccount.pending[rSentedPerson]) {
        res.send("Error : Gift not found in receiver's pending gifts");
        return;
      }

      await receivedAccount.updateOne({
        $unset: { [`pending.${rSentedPerson}`]: 1 },
      });

      console.log(receivedAccount);
      res.send(receivedAccount);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error : Internal server error.");
    }
  });

  app.post("/item/use", async (req, res) => {
    const { rUsername, rItemName } = req.body;

    if (!rUsername || !rItemName) {
      res.send("Error : Not enough info");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });

    if (userAccount.item.hasOwnProperty(rItemName)) {
      itemAmount = parseInt(userAccount.item[rItemName]);
      console.log(parseInt(userAccount.item[rItemName]));
    } else {
    }
    const Names = "item." + rItemName;

    if (itemAmount > 1) {
      updateQuery = { $set: { [Names]: itemAmount - 1 } };
    }
    else if (itemAmount == 1) {
      updateQuery = { $unset: { [Names]: itemAmount } };
    }

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

  app.post("/item/deleteMultiple", async (req, res) => {
    const { rUsername, rItemName, rNumber } = req.body;

    if (!rUsername || !rItemName || !rNumber) {
      res.send("Error : Not enough info");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });

    if (userAccount.item.hasOwnProperty(rItemName)) {
      itemAmount = parseInt(userAccount.item[rItemName]);
      console.log(parseInt(userAccount.item[rItemName]));
    } else {
    }
    const Names = "item." + rItemName;

    if (itemAmount > 1) {
      updateQuery = { $set: { [Names]: itemAmount - rNumber } };
    }
    else if (itemAmount == 1) {
      updateQuery = { $unset: { [Names]: itemAmount } };
    }
    else if (itemAmount == 0) {
      updateQuery = { $unset: { [Names]: itemAmount } };
    }

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

  app.post("/item/addMultiple", async (req, res) => {
    const { rUsername, rItemName, rNumber } = req.body;

    if (!rUsername || !rItemName || !rNumber) {
      res.send("Error : Not enough info");
      return;
    }

    const userAccount = await Account.findOne({ username: rUsername });

    if (!userAccount) {
      res.send("Error : User not found");
      return;
    }

    let itemAmount = 0;
    if (userAccount.item && userAccount.item.hasOwnProperty(rItemName)) {
      itemAmount = parseInt(userAccount.item[rItemName]);
    }

    const updatedItemAmount = itemAmount + parseInt(rNumber);

    const updateQuery = {
      $set: { [`item.${rItemName}`]: updatedItemAmount },
    };

    const updateResult = await Account.updateOne({ username: rUsername }, updateQuery);

    if (updateResult.nModified === 0) {
      res.send("Error : Failed to update item amount");
    } else {
      res.send(updateQuery.$set);
    }
  });

  app.get('/item/checkAmount/:username/:itemname', async function (req, res) {
    var rusername = req.params.username; // Retrieve the username from the request body
    var ritemname = req.params.itemname;
    console.log(ritemname);

    try {
      var userAccount = await Account.findOne({ username: rusername });
      if (userAccount) {
        let itemNo = userAccount.item[ritemname];
        res.send(itemNo.toString()); // Send the item number data as a response
      } else {
        res.status(404).send({ message: 'Error : User not found' }); // Send error message if user not found
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error : Server error' }); // Send error message if there's a server error
    }
  });

  app.get('/item/checkAmount/:username', async function (req, res) {
    var rusername = req.params.username;

    try {
      var userAccount = await Account.findOne({ username: rusername });
      if (userAccount) {
        let itemNo = userAccount.item;
        res.send(itemNo); // Send the item number data as a response
      } else {
        res.status(404).send({ message: 'Error : User not found' }); // Send error message if user not found
      }
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: 'Error : Server error' }); // Send error message if there's a server error
    }
  });

};

