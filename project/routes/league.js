const e = require("express");
var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const users_utils = require("./utils/users_utils");

router.get("/HomePage", async (req, res, next) => {
  try {
    let return_dict = {};

    // Left Column
    const left_column = await league_utils.getLeagueDetails();
    return_dict.left_column = left_column;

    // Right Column
    if (req.session && req.session.userID) {
      users_utils.getAllUsers()
        .then((users) => {
          if (users.find((x) => x.userID === req.session.userID)) {
            req.userID = req.session.userID;
          }
        })
    }
    if (req.userID != null) {
      let right_column = await league_utils.futureFavoritesGames(req.session.userID);
      return_dict.right_column = right_column;
    }
    else
      return_dict.right_column = {};
    
    res.send(return_dict);
  } 
  catch (error) {
    next(error);
  }
});

// Get league page
router.get("/LeaguePage", async (req, res, next) => {
  try {
    const games = await league_utils.getLeaguePage();
    res.send(games);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
