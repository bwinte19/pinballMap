const teamID = 29;
let season = 2021;
const winColor = 'rgb(228, 255, 225)';
const loseColor = 'rgb(255, 211, 211)';

async function getScores() {
  let url = "https://www.balldontlie.io/api/v1/games?per_page=100&seasons[]=" + season + "&team_ids[]=" + teamID;
  try {
    let response = await fetch(url);
    let json = await response.json();
    let data = json.data;
    data.sort((a, b)=> (a.date < b.date) ? 1 : -1)
    data = data.filter(game => game.status === "Final");
    //console.log(data);
    return data;
  }
  catch (error) {
    console.log(error);
    return undefined;
  }
  
}


async function fillScores() {
  let data = await getScores();
  console.log(data)
  document.getElementById('season').innerText = season + " Season";
  let winTotal = 0
  let lossTotal = 0
  let results = "";
  data.forEach(game => {
    let jazzAreHome = game.home_team.abbreviation === 'UTA';
    let homeWon = game.home_team_score > game.visitor_team_score;
    let resultColor = '';
    resultColor = (jazzAreHome ^ homeWon) ? loseColor : winColor;
    if (resultColor === winColor) {winTotal++;}
    else {lossTotal++;}
    let resultStyle = "style='background-color:" + resultColor + ";'"; 
    //date
    results += "<div class='game'" + resultStyle + "><p class='date'>";
    results += moment(game.date, 'YYYY-MM-DD').format('MMMM Do YYYY');
    //team names
    results += "<div class='container'><div class='row'><div class='col'><h3>";
    results += game.visitor_team.abbreviation;
    results += "</h3></div><div class='col'><h3 class='winlose'>at</h3></div>";
    results += "<div class='col'><h3>" + game.home_team.abbreviation + "</h3></div></div>";
    //scores
    results += "<div class='row'><div class='col score'>";
    results += game.visitor_team_score;
    results += "</div><div class='col winlose'></div><div class='col score'>";
    results += game.home_team_score;
    results += '</div></div></div></div>';
    
  });
  document.getElementById('results').innerHTML = results;
  document.getElementById('record').innerText = 'Record: ' + winTotal + "-" + lossTotal;
}

fillScores();

function updateSeason() {
  season = document.getElementById('selectSeason').value;
  console.log("getting " + season + " season");
  fillScores();
}