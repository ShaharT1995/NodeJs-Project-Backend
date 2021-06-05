var express = require("express");
var router = express.Router();
const teams_utils = require("./utils/teams_utils");

// Personal Page of team
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  try {
    const team_details = await teams_utils.getTeamFullInfo(req.params.teamId);
    res.send(team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
