var express = require("express");
var router = express.Router();
const search_utils = require("./utils/search_utils");

// Search Team, Player and Coach by name
router.get("/:name", async (req, res, next) => {
  try {
    let teamName = req.query.teamName;
    let position = req.query.position;
    
    const results = await search_utils.searchForPlayerFilterBy(req.params.name, teamName, position);
    
    if (req.session.userID != null) {
      req.session.query = {"path": "search/" + req.params.name,
                           "teamName": teamName,
                           "position": position};
      req.session.lastSearchQuery = results;
    }

    if(results.players.length == 0 && results.teams.length == 0 && results.coaches.length == 0)
      res.sendStatus(204);

    else
      res.send(results);
  } 
  catch (error) {
    next(error);
  }
});

// Search Team, Player and Coach by name and SORT by playerName | teamName
router.get("/:name/sort/:sortParmeter", async (req, res, next) => {
  try {
    const results = await search_utils.searchForPlayerSortBy(req.params.name, req.params.sortParmeter);

    if (req.session.userID != null) {
      req.session.query = "/" + req.params.name + "/sort/" + req.params.sortParmeter;
      req.session.lastSearchQuery = results;
    }

    if(results.players.length == 0 && results.teams.length == 0 && results.coaches.length == 0)
      res.sendStatus(204);

    else
      res.send(results);
  } 
  catch (error) {
    next(error);
  }
});

// Search Team, Player and Coach by name and SORT (playerName | teamName) & FILTER (playerName | teamName)
router.get("/:name/sort&filter/:sortParmeter", async (req, res, next) => {
  try {
    let teamName = req.query.teamName;
    let position = req.query.position;

    const results = await search_utils.searchForPlayerSortByFilterBy(req.params.name, req.params.sortParmeter, teamName, position);

    if (req.session.userID != null) {
      req.session.query = {"path": "search/" + req.params.name,
                           "teamName": teamName,
                           "position": position};
      req.session.lastSearchQuery = results;
    }

    if(results.players.length == 0 && results.teams.length == 0 && results.coaches.length == 0)
      res.sendStatus(204);

    else
      res.send(results);
  } 
  catch (error) {
    next(error);
  }
});

module.exports = router;
