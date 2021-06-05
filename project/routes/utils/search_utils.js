
const axios = require("axios");
const players_utils = require("./players_utils");
const teams_utils = require("./teams_utils");

const api_domain = process.env.api_domain; 
const LEAGUE_ID = process.env.league_ID;

var CURRENT_SEASON = null;
const getLeagueSeason = async() => {
    let league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`, {
      params: {
        api_token: process.env.api_token,
      },
    });
    
    CURRENT_SEASON = league.data.data.current_season_id;
  }
  
  getLeagueSeason();

// Search all players that contains the name and SORT
async function searchForPlayerSortBy(search_params, sortBy) {
  const player_info = await axios.get(`${api_domain}/players/search/${search_params}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  
  let players_array = [];
  player_info.data.data.map((element) => players_array.push(element.player_id));

  let players_return = await players_utils.getPlayersInfo(players_array);
  if (sortBy == 'playerName')
    players_return = players_return.sort((a, b) => (a.fullname < b.fullname) ? 1 : -1);

  else if (sortBy == 'teamName')
    players_return = players_return.sort((a, b) => (a.team < b.team) ? 1 : -1);
  
  else
    throw { status: 400, message: "SortBy " + sortBy + " is not exists!" };

  let teams_return = await searchForTeamSortBy(search_params, sortBy);

  let coaches = await searchForCoach(search_params, null);
  return {
    players: players_return,
    teams: teams_return,
    coaches: coaches,
  }
}

// Search all teams that contains the name and SORT
async function searchForTeamSortBy(search_params, sortBy) {
  const team_info = await axios.get(`${api_domain}/teams/search/${search_params}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  
  let teams_array = [];
  team_info.data.data.map((element) => teams_array.push(element.id));

  let teams =  await teams_utils.getTeamForSearch(teams_array);

  if (sortBy == 'teamName')
    teams = teams.sort((a, b) => (a.name < b.name) ? 1 : -1);
  
  else if (sortBy != 'playerName') {
    if(sortBy != 'teamName')
      throw { status: 400, message: "SortBy " + sortBy + " is not exists!" };
  }

  return teams;
}

// Search all teams that contains the name
async function searchForTeam(search_params) {
  const team_info = await axios.get(`${api_domain}/teams/search/${search_params}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  
  let teams_array = [];
  team_info.data.data.map((element) => teams_array.push(element.id));

  let teams =  await teams_utils.getTeamForSearch(teams_array);
  return teams;
}

// Search all coachs that contains the name
async function searchForCoach(search_params, teamName = "") {
  let teams_array = await axios.get(`${api_domain}/teams/season/${CURRENT_SEASON}`, {
    params: {
      api_token: process.env.api_token,
      include: "coach",
    },
  });
  
  teams_array = teams_array.data.data;
  let coaches = [];

  for (let i = 0; i < teams_array.length; i++){
    let coach = teams_array[i].coach.data;
    if (coach.fullname != null && coach.fullname.includes(search_params)){
      coach.team_name = teams_array[i].name;
      coaches.push(coach);
    }
  }

  if (teamName != null && teamName != "")
    coaches = coaches.filter(coach => coach.team_name == teamName);

  let data = await Promise.all(coaches.map(async (coach) => {
    return {
      firsName: coach.firstname,
      lastName: coach.lastname,
      team_name: coach.team_name,
      image: coach.image_path
    };
  }));
  return data;
}

// Search all players that contains the name and FILTER
async function searchForPlayerFilterBy(search_params, teamName, position) {
  const player_info = await axios.get(`${api_domain}/players/search/${search_params}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  
  let players_array = [];
  player_info.data.data.map((element) => players_array.push(element.player_id));

  let players_return = await players_utils.getPlayersInfo(players_array);
  if (position != null)
    players_return = players_return.filter(player => player.position == position);

  if (teamName != null)
    players_return = players_return.filter(player => player.team == teamName);

  let teams_return = await searchForTeam(search_params);
  
  let coaches = await searchForCoach(search_params);
  return {
    players: players_return,
    teams: teams_return,
    coaches: coaches,
  }

}

// Search all players that contains the name and SORT & FILTER
async function searchForPlayerSortByFilterBy(search_params, sortBy, teamName, position) {
  const player_info = await axios.get(`${api_domain}/players/search/${search_params}`, {
    params: {
      api_token: process.env.api_token,
    },
  });
  
  let players_array = [];
  player_info.data.data.map((element) => players_array.push(element.player_id));

  let players_return = await players_utils.getPlayersInfo(players_array);
  if (position != null)
    players_return = players_return.filter(player => player.position == position);

  if (teamName != null)
    players_return = players_return.filter(player => player.team == teamName);

  if (sortBy == 'playerName')
    players_return = players_return.sort((a, b) => (a.fullname < b.fullname) ? 1 : -1);

  else if (sortBy == 'teamName')
    players_return = players_return.sort((a, b) => (a.team < b.team) ? 1 : -1);  

  else
    throw { status: 400, message: "SortBy " + sortBy + " is not exists!" };  

  let teams_return = await searchForTeamSortBy(search_params, sortBy);
  
  let coaches = await searchForCoach(search_params, teamName);
  return {
    players: players_return,
    teams: teams_return,
    coaches: coaches,
  }
}

// exports.searchForPlayer = searchForPlayer;  
exports.searchForPlayerFilterBy = searchForPlayerFilterBy;
exports.searchForPlayerSortBy = searchForPlayerSortBy;
exports.searchForPlayerSortByFilterBy = searchForPlayerSortByFilterBy;
exports.searchForTeam = searchForTeam;
exports.searchForCoach = searchForCoach;