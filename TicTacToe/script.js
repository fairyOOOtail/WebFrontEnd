var numberOfPlayers = 2;
var currentPlayer = 0;
var move = 0;
var point1 = 0;
var point2 = 0;
var winners = [];
var player1Selections = [];
var player2Selections = [];
var gameRound = 0;
var ifComputer = false;
var gridPos = [1,2,3,4,5,6,7,8,9];
var computerMove = 0;
var ifRecurse = false;
var recurse = 0;


$(document).ready(function() {
    loadAnswers();
    $(".one-play").click(function() {
        onePlayCountAnimate();
        ifComputer = true;
    });

    $(".two-play").click(function() {
        twoPlayCountAnimate();
        ifComputer = false;
    });

    $(".playerFirst").click(function() {
        selectWhoFirst();
    });

    $(".computerFirst").click(function() {
        selectWhoFirst();
    });

    $(".mode1").click(function() {
        mode1ChoiceAnimate();
    });

    $(".mode2").click(function() {
        mode2ChoiceAnimate();
    });

    $(".round").click(function() {
        if(ifComputer) {
            onePlayerGame(this);
        }
        else {
            twoPlayerGame(this);
        }
    });

    $(".reset").click(function() {
        resetAnimate();
        resetCanvas();
        point1 = 0;
        point2 = 0;
        $("#score1").html(point1);
        $("#score2").html(point2);
    });

    function onePlayerGame(selector) {
        var ifClick = checkIfClick(selector);
        if(ifClick && currentPlayer == 0) {
            $(selector).html("X");
            player1Selections.push(parseInt($(selector).attr("value")));
            player1Selections.sort(function(a, b) {return a - b;});
            move++;
            computerMove = simpleAI();
            var moveID = "#r" + computerMove;
            var ifPlayer1Win = checkWinner(player1Selections,player2Selections,0);
            if(ifPlayer1Win) {
                $(moveID).html("");
                $(".result").html(whoWin(ifPlayer1Win,0) + " win!!! : )");
                winAnimate();
                resetCanvas();
                $("#score1").html(point1);
                $("#score2").html(point2);
            }
            if(player1Selections !== [] && player1Selections.length < 5 && !ifPlayer1Win) {
                $(moveID).html("O");
                move++;
                player2Selections.push(parseInt($(moveID).attr("value")));
                player2Selections.sort(function(a, b) {return a - b;});
            }

            var ifPlayer2Win = checkWinner(player1Selections,player2Selections,1);
            if(ifPlayer2Win) {
                $(moveID).html("");
                $(".result").html(whoWin(ifPlayer2Win,1) + " win!!! : )");
                winAnimate();
                resetCanvas();
                $("#score1").html(point1);
                $("#score2").html(point2);
            }

            if(move == 9) {
                $(".result").html("Draw....... : (");
                winAnimate();
                resetCanvas();
            }
        }
    }

    function twoPlayerGame(selector){
        var ifClick = checkIfClick(selector);
        if(ifClick) {
            if(currentPlayer === 0) {
                $(selector).html("X");
                player1Selections.push(parseInt($(selector).attr("value")));
                player1Selections.sort(function(a, b) {return a - b;});
            }
            else {
                $(selector).html("O");
                player2Selections.push(parseInt($(selector).attr("value")));
                player2Selections.sort(function(a, b) {return a - b;});
            }
            move++;
            var ifWin = checkWinner(player1Selections,player2Selections,currentPlayer);
            if(!ifWin) {
                if(currentPlayer === 0) {
                    currentPlayer = 1;
                }
                else {
                    currentPlayer = 0;
                }
            }
            if(ifWin) {
                $(".result").html(whoWin(ifWin,currentPlayer) + " win!!! : )");
                winAnimate();
                resetCanvas();
                $("#score1").html(point1);
                $("#score2").html(point2);
            }
            if(move == 9) {
                $(".result").html("Draw....... : (");
                winAnimate();
                resetCanvas();
            }
        }
    }

    function loadAnswers() {
        winners.push([1,2,3]);
        winners.push([4,5,6]);
        winners.push([7,8,9]);
        winners.push([1,4,7]);
        winners.push([2,5,8]);
        winners.push([3,6,9]);
        winners.push([1,5,9]);
        winners.push([3,5,7]);
    }

    function checkWinner(select1,select2,currentPlayer) {
        var win = false;
        var playerSelections = [];
        if(currentPlayer === 0) {
            playerSelections = select1;
        }
        else {
            playerSelections = select2;
        }
        if(playerSelections.length >= 3) {

            for(var i = 0;i < winners.length;i++) {
                var winType = winners[i];
                var winFound = true;
                for(var j = 0;j < winType.length;j++) {
                    var found = false;
                    for(var k = 0;k < playerSelections.length;k++) {
                        if(winType[j] == playerSelections[k]) {
                            found = true;
                            //break;
                        }
                    }
                    if(found === false) {
                        winFound = false;
                        break;
                    }
                }

                if(winFound === true) {
                    win = true;
                    break;
                }
            }
        }
        return win;
    }

    function whoWin(ifWin,currentPlayer) {
        if(ifWin) {
            if(currentPlayer === 0) {
                point1++;
                return "Player 1";
            }
            else {
                point2++;
                return "Player 2";
            }
        }
    }

    function checkIfClick(selector) {
        var checkArray = player1Selections.concat(player2Selections);
        for(var i = 0; i < checkArray.length;i++) {
            if($(selector).attr("value") == checkArray[i]) {
                return false;
            }
        }
        return true;
    }

    function resetCanvas() {
        $(".round").html("");
        move = 0;
        currentPlayer = 0;
        player1Selections = [];
        player2Selections = [];
    }


    /*-----------stupid AI----------------*/
    function simpleAI(){
        var selections = player1Selections.concat(player2Selections);
        var availableSelections = [];
        for(var i = 0; i < gridPos.length; i++) {
            if(selections.includes(gridPos[i]) === false)
                availableSelections.push(gridPos[i]);
        }
        var randomMove = function(arr) {
            var index = Math.floor(Math.random()*(arr.length));
            return arr[index];
        }
        return randomMove(availableSelections);
    }



    /*--------AI------------*/
    /*X:AI             O:Me*/


    function minimaxValue(player1Move,player2Move,whoPlay) {
        var temp1Selections = [].concat(player1Move);
        var temp2Selections = [].concat(player2Move);
        var tempCurrentPlayer = whoPlay;

        if(checkWinner(temp1Selections,temp2Selections,tempCurrentPlayer) === true || temp1Selections.length + temp2Selections.length === 9) {
            move = 0;
            return gameScore(temp1Selections,temp2Selections,tempCurrentPlayer);
        }
        else {
            //lert(move++)
            var bestScore;
            var bestMove;
            move++;


            var selections = temp1Selections.concat(temp2Selections);
            var availableSelections = [];
            for(var i = 0; i < gridPos.length; i++) {
                if(selections.includes(gridPos[i]) === false)
                    availableSelections.push(gridPos[i]);
            }

            /*
            console.log("move : ",move);
            console.log("avail :",availableSelections);
            */

            for(var j = 0; j < availableSelections.length; j++){

                if(checkWinner(temp1Selections,temp2Selections,tempCurrentPlayer) === false && recurse !== 0) {
                    if(tempCurrentPlayer === 0)
                        tempCurrentPlayer = 1;
                    else
                        tempCurrentPlayer = 0;
                }

                if(tempCurrentPlayer === 0) {
                    temp1Selections.push(availableSelections[j]);

                }

                else {
                    temp2Selections.push(availableSelections[j]);

                }
                /*
                 console.log("temp1Selections: ",temp1Selections);
                 console.log("temp2Selections: ",temp2Selections);
                 console.log("tempCurrentPlayer: ",tempCurrentPlayer);
                 console.log("ifWin: ",checkWinner(temp1Selections,temp2Selections,tempCurrentPlayer));
                */

                recurse++;

                var thisScore = minimaxValue(temp1Selections,temp2Selections,tempCurrentPlayer);

                if(tempCurrentPlayer === 0) {
                    bestScore = -1000;

                }
                else {
                    bestScore = 1000;

                }

                if(tempCurrentPlayer === 0){
                    if(thisScore > bestScore) {
                        bestScore = thisScore;  //X : MAX
                        bestMove = availableSelections[j];
                    }
                }
                else {
                    if(thisScore < bestScore) {
                        bestScore = thisScore;  //O : MIN
                        bestMove = availableSelections[j];
                    }

                }
                /*
                console.log("thisScore: ",thisScore);
                console.log('bestScore : ',bestScore);
                console.log('bestMove :',bestMove);
                */
                if(tempCurrentPlayer === 1) {
                    temp2Selections.pop();
                    tempCurrentPlayer = 0;
                }
                else {
                    temp1Selections.pop();
                    tempCurrentPlayer = 1;
                }

            }
        }
        if(typeof bestMove !== "undefined")
            computerMove = bestMove;
    }

    function minimaxMove(temp1,temp2,pos,currentPlayer) {
        if(currentPlayer === 0) {
            temp1.push(pos);
            temp1.sort(function(a,b) {return a-b;});
            currentPlayer = 1;
        }
        else {
            temp2.push(pos);
            temp2.sort(function(a,b) {return a-b;});
            currentPlayer = 0;
        }

    }


    function gameScore(play1,play2,currentPlayer){
        if(whoWin(checkWinner(play1,play2,currentPlayer),currentPlayer) == "Player 1") {
            return 10 - player1Selections.length;
        }
        if(whoWin(checkWinner(play1,play2,currentPlayer),currentPlayer) == "Player 2") {
            return player2Selections.length - 10;
        }
        if(play1.length + play2.length == 9) {
            return 0;
        }
    }




    /*-------Animate-------*/
    function onePlayCountAnimate() {
        $(".game-choice").addClass("animated fadeOutRight");
        $(".whoFirst").show();
    }

    function selectWhoFirst() {
        $(".whoFirst").hide();
        $(".game-mode").removeClass("animated fadeOutRight");
        $(".game-mode").css("display","block");
        $(".game-mode").addClass("animated fadeInLeft");
    }

    function twoPlayCountAnimate() {
        $(".game-choice").addClass("animated fadeOutRight");
        $(".game-mode").removeClass("animated fadeOutRight");
        $(".game-mode").css("display","block");
        $(".game-mode").addClass("animated fadeInLeft");
    }

    function mode1ChoiceAnimate() {
        $(".game-mode").addClass("animated fadeOutRight");
        $(".player-score").css("display","block");
        $(".canvas").css("display","block");
        $(".reset").css("display","block");
        $(".player-score").removeClass("animated fadeOutUp");
        $(".canvas").removeClass("animated flipOutY");
        $(".reset").removeClass("animated fadeOutDown");
        $(".player-score").addClass("animated fadeInDown");
        $(".canvas").addClass("animated flipInY");
        $(".reset").addClass("animated fadeInUp");
    }

    function mode2ChoiceAnimate() {
        $(".game-mode").hide();
        $(".game-choice").removeClass("animated fadeOutRight");
        $(".game-choice").addClass("animated fadeInRight");
    }

    function resetAnimate() {
        $(".player-score").addClass("animated fadeOutUp");
        $(".canvas").addClass("animated flipOutY");
        $(".reset").addClass("animated fadeOutDown");
        $(".game-choice").removeClass("animated fadeOutRight");
        $(".game-choice").addClass("animated fadeInLeft");
    }

    function winAnimate(){
        $(".canvas").removeClass("animated flipInY");
        $(".canvas").css("display","none")
        $(".result").css("display","");
        $(".result").addClass("animated zoomIn");
        setTimeout(function() {
            $(".result").addClass("animated zoomIn");
            $(".result").css("display","none");
            $(".canvas").css("display","block");
            $(".canvas").addClass("animated flipInX");
        },1000);
        $(".canvas").removeClass("animated flipInX");
    }

});