var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

// Personal Page of player
router.get("/playerFullDetails/:playerID", async (req, res, next) => {
  try {
    const player_details = await players_utils.getPlayerFullInfo(req.params.playerID);
    res.send(player_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
