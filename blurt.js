// check input fields for functions, etc

// comments - why and how

// global variables
var qSemaphore = false;
var numberOfTeams;
var teamNames = [];
var numberOfRounds;
var currentRound = 0;
var roundMin = 1;
var roundMax = 30;
var StatementArray = [];
var ConstraintArray = [];
var team1points = 0; //need to start at 0 or it's NaN, or undefined
var team2points = 0;
var team3points = 0;
var team4points = 0;

function teamFields (count) {
    // this shows the number of fields selected by the radio button
    // to enter a team name
    switch(count) {
        case "3":
            $("#team3div").show();
            $("#team4div").hide();
            break;
        case "4":
            $("#team3div").show();
            $("#team4div").show();
            break;
        default:
            $("#team3div").hide();
            $("#team4div").hide();
            break;
    }
}

// these Msg functions can be called to set/clear an error message
// the id of the error span is the id of the checked field + "Error"
function errMsg (inputID , msg) {
    document.getElementById(inputID + "Error").style.color = "red";
    document.getElementById(inputID + "Error").innerHTML = msg;
}

function clearMsg (inputID, msg) {
    document.getElementById(inputID + "Error").style.color = "initial";
    document.getElementById(inputID + "Error").innerHTML = msg;
}

function checkTeamName (teamNameID) {
    // team name must exist and can be anything the keyboard can type
    let teamNameRegEx = /\S/; // used to check for empty field
    let teamNameValue = document.getElementById(teamNameID).value; 
    let result = teamNameRegEx.test(teamNameValue);
    if (result == false) {
        // show error message next to input field
        errMsg(teamNameID, "field required");
        return false;
    }
    else {
        clearMsg(teamNameID, "Original!");
        // msg ideas; could check the message against a variable ("boring if still Team 1", etc)
        return true;
    }
}

function checkRoundCount (count) {
    // verify round count is between global min and max
    if ((count < roundMin) || (count > roundMax)) {
        errMsg("roundCount", "Please enter a number between " + roundMin + " and " + roundMax + ".");
        return false;
    }
    else {
        clearMsg("roundCount", "Nice number!");
        // msg ideas: if greater than 20, "are you bored?"
        return true;
    }
    document.getElementById("testPromises").innerHTML = "Statements: " + window.StatementArray[0];
    
}


$(document).ready(function(){
    // hide the run game div
    $(".run_game").hide();

    // initialize data
    function fetchStatements() {
            return fetch('statements.txt').then(
                function(response) {
                    response.text().then(
                        function(textString) {
                            window.StatementArray = textString.split(/\r|\n/);
                            StatementArray.pop();                            
                        }
                    )
                }
            )
    }
    
    function fetchConstraints() {
        return fetch('constraints.txt').then(
            function(response) {
                response.text().then(
                    function(textString) {
                        window.ConstraintArray = textString.split(/\r|\n/);
                        ConstraintArray.pop();
                    }
                )
            }
        )
    }
    let promiseStatements = fetchStatements();
    let promiseConstraints = fetchConstraints();

    // always start with 2 team fields showing; hides team name 3 and 4 fields
    teamFields("2");

    // setting up change callback function specific to radio button (team_count)
    $("input[name='team_count']").change(function(){ 
        numberOfTeams = document.querySelector('input[name="team_count"]:checked').value;
        teamFields(numberOfTeams);
    });

    // check input field when it changes
    $("input[class='teamName']").change(function(event){ 
        checkTeamName(event.target.id); //event.target.id is the field that triggered the event
        // https://stackoverflow.com/questions/48239/getting-the-id-of-the-element-that-fired-an-event
    });

    document.getElementById("roundCountError").innerHTML = roundMin + " - " + roundMax;

    // check rounds, input needs to be 1-30
    $("input[name='roundCount']").change(function(){
        checkRoundCount(document.getElementById("roundCount").value);
    });

    // check game before running it
    $("div[name=checkGame]").click(function(){
        // assign radio button value to numberofTeams
        numberOfTeams = document.querySelector('input[name="team_count"]:checked').value;

        // checking if team Names are valid (returns true or false)         
        // if true, get team name input and push to global array
        let teamNameResult = true; // assume team names are good
        teamNames = [];
        for (let i = 1; i <= Number(numberOfTeams); i++) {
            let teamName = "teamName" + String(i); // id of team name fields
            let teamNameValue = document.getElementById(teamName).value;
                teamNames.push(teamNameValue);
            if (!checkTeamName(teamName)) {
                // got a bad team name, set variable so it won't continue
                teamNameResult = false; 
            }
            
        }
        // assign number of rounds to global
        numberOfRounds = document.getElementById("roundCount").value;

        // checking if round count is valid (returns true or false)
        let roundCountResult = checkRoundCount(numberOfRounds);        
        
        // if team names and round count are valid, start the game
        if (teamNameResult && roundCountResult) {
            //start game
            clearMsg("checkGame", "");
            runGame();

        } else {
            // think mobile, put error at top and by the start game button
            errMsg("checkGame", "fix errors above");
        }
    })

    // listener for tapForRound
    $("div[id='tapForRound']").click(function(){
        $(".showStatAndCons").show();
        updateGameStatus(); 

        // hide this element if it's the last round
        if (currentRound >= numberOfRounds) {
            $("#tapForRound").hide(); // hides the clickable div
            $("#lastRound").show();
        }
    });

    // add/subtract - listen to scoreSigns class
    $("span[class='scoreSigns']").click(function(event){
        //document.getElementById("team2score").innerHTML = event.target.id // show what's being clicked for testing...
        eventID = event.target.id;
        updateGameScore(eventID);
    })

    // listener for weDone
    $("div[id='weDone']").click(function(){
        // hide game screen
        $(".run_game").hide();                
        // show set up div
        $(".setup_game").show();
    });


}); // end of ready function

function teamScoreFields (count) {
    // why and how - need to show only team scores of present teams, hide others

    document.getElementById("team1").innerHTML = teamNames[0];
    document.getElementById("team2").innerHTML = teamNames[1];
    $("#team3ScoreDiv").hide();
    $("#team4ScoreDiv").hide();

    if (count > 2) {
        $("#team3ScoreDiv").show();    
        document.getElementById("team3").innerHTML = teamNames[2];        
    }
    if (count > 3) {
        $("#team4ScoreDiv").show();
        document.getElementById("team4").innerHTML = teamNames[3];
    }
}

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
  }
// https://www.w3docs.com/snippets/javascript/how-to-randomize-shuffle-a-javascript-array.html

function runGame() {
    
    $(".setup_game").hide();
    $(".showStatAndCons").hide();
    $("#lastRound").hide();

    document.getElementById("tapForRound").innerHTML = "Tap here for the first round.";
    document.getElementById("constraint").innerHTML = "&nbsp;"; // &nbsp; is a no break space
    document.getElementById("statement").innerHTML = "&nbsp;";
    $("#tapForRound").show();    
    $("#roundUpdater").show(); // shows current round div
    currentRound = 0;
    team1points = 0;
    team2points = 0;
    team3points = 0;
    team4points = 0;
    displayGameScore();

    teamScoreFields(numberOfTeams);

    // build randomized arrays for the current game (statement and constraint)
    shuffleArray(StatementArray);
    shuffleArray(ConstraintArray);
    
    $(".run_game").show();    
}


function updateGameStatus(){
    // display constraint and statement
    document.getElementById("tapForRound").innerHTML = "Tap here for the next round.";
    document.getElementById("constraint").innerHTML = ConstraintArray[currentRound];
    document.getElementById("statement").innerHTML = StatementArray[currentRound];
    
    // add one to current round
    currentRound += 1; // add one here cuz array is 0 relative, humans usually start with 1
    document.getElementById("roundUpdater").innerHTML = "Round: " + currentRound + " of " + numberOfRounds;
}

function updateGameScore(eventID){
    // slice the part of the id needed? or case statement?
    // put scores in an array, and update the needed array item?
    switch(eventID) {
        case 'addTeam1':
            team1points += 1;
            break;
        case 'subTeam1':
            team1points -= 1;
            break;
        case 'addTeam2':
            team2points += 1;
            break;
        case 'subTeam2':
            team2points -= 1;
            break;
        case 'addTeam3':
            team3points += 1;
            break;
        case 'subTeam3':
            team3points -= 1;
            break;
        case 'addTeam4':
            team4points += 1;
            break;
        case 'subTeam4':
            team4points -= 1;
            break;
        default:
            errMsg("score", "Contact the developer!");
            break;
    }
    displayGameScore();
}

function displayGameScore() {
    document.getElementById("team1score").innerHTML = "Score: " + team1points;
    document.getElementById("team2score").innerHTML = "Score: " + team2points;
    if (numberOfTeams > 2) {
        document.getElementById("team3score").innerHTML = "Score: " + team3points;
    }
    if (numberOfTeams > 3) {
        document.getElementById("team4score").innerHTML = "Score: " + team4points;
    }
}