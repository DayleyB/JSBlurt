// check input fields for functions, etc
var numberOfTeams;
var teamNames = [];
var numberOfRounds;
var roundMin = 1;
var roundMax = 30;
var StatementArray = [];
var ConstraintArray = [];

function teamFields (count) {
    // change to what it should be, don't assume some aren't there
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

function errMsg (inputID , msg) {
    document.getElementById(inputID + "Error").style.color = "red";
    document.getElementById(inputID + "Error").innerHTML = msg;
}

function clearMsg (inputID, msg) {
    document.getElementById(inputID + "Error").style.color = "";
    document.getElementById(inputID + "Error").innerHTML = msg;
}

function checkTeamName (count) {
    let teamNameRegEx = /\S/;
    for (let i = 1; i <= Number(count); i++) {
        let teamName = "teamName" + String(i);
        let teamNameValue = document.getElementById(teamName).value;
        let result = teamNameRegEx.test(teamNameValue);
        if (result == false) {
            // show error message next to input field
            errMsg(teamName, "field required");
            return false;
        }
        else {
            clearMsg(teamName, "Original!");
            // msg ideas; could check the message against a variable ("boring if still Team 1", etc)
            return true;
        }
    }
}

function checkRoundCount (count) {    
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


    teamFields("2");
    //change function specific to radio button (team_count)
    $("input[name='team_count']").change(function(){ 
        teamFields(document.querySelector('input[name="team_count"]:checked').value);
    });

    // check fields, team names are required
    $("input[type=text]").change(function(){
        checkTeamName(document.querySelector('input[name="team_count"]:checked').value);        
    });

    document.getElementById("roundCountError").innerHTML = roundMin + " - " + roundMax;

    // check rounds, input needs to be 1-30
    $("input[type=text]").change(function(){
        checkRoundCount(document.getElementById("roundCount").value);
    });

    // start game
    $("div[name=startGame]").click(function(){
        // assign radio button value to numberofTeams
        numberOfTeams = document.querySelector('input[name="team_count"]:checked').value;

        // checking if team Names are valid (returns true or false)
        let teamNameResult = checkTeamName(document.querySelector('input[name="team_count"]:checked').value);
        
        // getting team name input and pushing to global array
        for (let i = 1; i <= Number(numberOfTeams); i++) {
            let teamName = "teamName" + String(i);
            let teamNameValue = document.getElementById(teamName).value;
            teamNames.push(teamNameValue);
        }

        // checking if round count is valid (returns true or false)
        let roundCountResult = checkRoundCount(document.getElementById("roundCount").value);
        
        // assign number of rounds to global
        numberOfRounds = document.getElementById("roundCount").value;
        
        // if team names and round count are valid, start the game
        if (teamNameResult && roundCountResult) {
            //start game
            clearMsg("startGame", "starting");
            runGame();

        } else {
            // think mobile, put error at top and by the start game button
            errMsg(startGame, "fix errors above");
        }
    })
});

function runGame() {
    $(".setup_game").hide();
    $(".run_game").show();
    document.getElementById("gameTitle").innerHTML = "Rounds: " + numberOfRounds + " Teams:" + numberOfTeams + " Team Names: " + teamNames +
        "<br>" + StatementArray + "<br>" + ConstraintArray; 

}

