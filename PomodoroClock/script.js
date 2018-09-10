var workMin = 25;
var breakMin = 5;
var workSec = 1500;
var breakSec = 300;
var start = false;
var displayMin,displaySec;
var intervalID;
var workOrbreak = true;
var number = 0;

$(document).ready(function() {
    $("#workIncrease").click(function() {
        if(start == false) {
            workMin += 1;
            workSec = workMin * 60;
            $("#workTime").html(workMin);
            $(".time").html(workMin + ":00");
        }
    });

    $("#workDecrease").click(function() {
        if(start == false && workMin > 1) {
            workMin -= 1;
            workSec = workMin * 60;
            $("#workTime").html(workMin);
            $(".time").html(workMin + ":00");
        }
    });

    $("#breakIncrease").click(function() {
        if(start == false) {
            breakMin += 1;
            breakSec = breakMin * 60;
            $("#breakTime").html(breakMin);
        }
    });

    $("#breakDecrease").click(function() {
        if(start == false && breakMin > 1) {
            breakMin -= 1;
            breakSec = breakMin * 60;
            $("#breakTime").html(breakMin);
        }
    });

    $("#start").click(function() {
        start = true;
        display();
    });

    $("#stop").click(function() {
        start = false;
        stopClock();
    });

    $("#reset").click(function() {
        stopClock();
        $("#workTime").html("25");
        $("#breakTime").html("5");
        $(".time").html("25:00");
        workMin = 25;
        breakMin = 5;
        workSec = 1500;
        breakSec = 300;
        start = false;
        number = 0;
    });

    function display() {
        intervalID = window.setInterval(startClock,1000);
    }

    function stopClock() {
        clearInterval(intervalID);
    }

    function startClock() {
        if(workOrbreak == true) {
            startWork();
        }
        else {
            startBreak();
        }
    }

    function startWork(){
        displayMin = Math.floor(workSec/60);
        displaySec = workSec%60;
        if(displaySec < 10) {
            $(".time").html(displayMin + ":0" + displaySec);
        }
        else {
            $(".time").html(displayMin + ":" + displaySec);
        }
        $(".status").html("工作");
        workSec -= 1;
        if(workSec < 0) {
            workOrbreak = false;
            workSec = workMin * 60;
            number += 1;
            $(".number").html(number);
            $(".tomato").addClass("animated bounce");
        }
    }

    function startBreak() {
        displayMin = Math.floor(breakSec/60);
        displaySec = breakSec%60;
        if(displaySec < 10) {
            $(".time").html(displayMin + ":0" + displaySec);
        }
        else {
            $(".time").html(displayMin + ":" + displaySec);
        }
        $(".status").html("休息");
        breakSec -= 1;
        if(breakSec < 0) {
            workOrbreak = true;
            breakSec = breakMin * 60;
            $(".tomato").removeClass("animated bounce");
        }
    }
});