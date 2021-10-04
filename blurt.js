// check input fields for functions, etc

// global variables
var qSemaphore = false;
var numberOfTeams;
var teamNames = [];
var numberOfRounds;
var roundMin = 1;
var roundMax = 30;
var StatementArray = [];
var ConstraintArray = [];

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
    document.getElementById(inputID + "Error").style.color = "";
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

    // start game
    $("div[name=startGame]").click(function(){
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

        // checking if round count is valid (returns true or false)
        let roundCountResult = checkRoundCount(document.getElementById("roundCount").value);
        
        // assign number of rounds to global
        numberOfRounds = document.getElementById("roundCount").value;
        
        // if team names and round count are valid, start the game
        if (teamNameResult && roundCountResult) {
            //start game
            clearMsg("startGame", "");
            runGame();

        } else {
            // think mobile, put error at top and by the start game button
            errMsg(startGame, "fix errors above");
        }
    })
});

function teamScoreFields (count) {
    // why and how - need to show only team scores of present teams, hide others

    document.getElementById("team1").innerHTML = teamNames[0];
    document.getElementById("team2").innerHTML = teamNames[1];
    $("#team3score").hide();
    $("#team4score").hide();

    if (count > 2) {
        $("#team3score").show();    
        document.getElementById("team3").innerHTML = teamNames[2];        
    }
    if (count > 3) {
        $("#team4score").show();
        document.getElementById("team4").innerHTML = teamNames[3];
    }
}


function runGame() {
    $(".setup_game").hide();

    // turn on key stroke event listeners
    $(document).on('keypress', function(e){
        gameKeys(e.key);
    });
    
    $(".run_game").show();

    teamScoreFields(numberOfTeams);   
}

function updateGameStatus(currentRound){
    

}

function gameKeys(key) {
    
    switch (key) {
        case ' ': //space bar
            // advance the game, show next statement and constraint
            break;
        case 'q':
            // check if it's running (false means not running)
            if (qSemaphore != true) {
                // say that it's running
                qSemaphore = true;
                // turn off key listeners
                $(document).off('keypress', function(e){});
                // hid game screen
                $(".run_game").hide();                
                // show set up div
                $(".setup_game").show();
                qSemaphore = false;
            }            
            break;
        case '1':
            // add point to team 1
            break;
        case '2':
            //add point to team 2
            break;
        case '3':
            // add point to team 3
            break;
        case '4':
            // add point to team 4
            break;
        case '-':
            // ask which team to take a point away from
            break;
        default:
            //something
            break;
            
    }
}

