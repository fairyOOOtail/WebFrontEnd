/*
var canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext("2d");
if(context){
        context.beginPath();

        context.moveTo(100,100);
        context.lineTo(555,555);
        context.lineTo(100,555);
        context.lineTo(100,100);
        context.lineWidth = 5;
        context.strokeStyle = "#005588";
        context.stroke();
        context.fill();
        context.fillStyle = "rgb(66,66,66)";
        context.closePath();

        context.arc(222,222,100,0,1.5*Math.PI,false);
        context.stroke();
}

else {
    alert("当前浏览器不支持该网页...");
}
*/
var WINDOW_WIDTH;
var WINDOW_HEIGHT;
var RADIUS;
var lastHours = 99;
var lastMinutes = 99;
var lastSeconds = 99;
var topPosition;
var leftPosition;
var balls = [];
var delay = 100;
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"];


window.onload = function () {
    WINDOW_HEIGHT = document.body.clientHeight;
    WINDOW_WIDTH = document.body.clientWidth;
    leftPosition = Math.round(WINDOW_WIDTH / 10);
    topPosition = Math.round(WINDOW_HEIGHT / 5);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    setInterval(function () {
        document.getElementById("canvas").onmouseover = function (location) {
            test(location);
        };
        setTimeout(function () {
            document.getElementById("canvas").onmouseover = null;
        }, 100);
    }, 1000);
    setInterval(function () {
            render(context);
            update();
            //console.log(balls.length);
        }
        , delay);
}

function test(location) {
    /*console.log("offset",location.offsetX);
    console.log("client",location.clientX);
    console.log("layer",location.layerX);
    console.log("page",location.pageX);
    console.log("screen",location.screenX);
    console.log("x",location.x);*/
}

function update() {

    var top = topPosition;
    var left = leftPosition;
    var date = new Date();
    var currentHours = date.getHours();
    var currentMinutes = date.getMinutes();
    var currentSeconds = date.getSeconds();

    //alert(1);
    //检测时间变化
    if (currentHours > lastHours) {
        if (parseInt(currentHours / 10) !== parseInt(lastHours / 10)) {
            addBall(top, left, parseInt(currentHours / 10));
        }
        if (currentHours % 10 !== lastHours % 10) {
            addBall(top, left + 15 * (RADIUS + 1), parseInt(currentHours % 10));
        }

    }
    if (currentMinutes > lastMinutes) {
        if (parseInt(currentMinutes / 10) !== parseInt(lastMinutes / 10)) {
            addBall(top, left + 39 * (RADIUS + 1), parseInt(currentMinutes / 10));
        }
        if (currentMinutes % 10 !== lastMinutes % 10) {
            addBall(top, left + 54 * (RADIUS + 1), parseInt(currentMinutes % 10));
        }
    }

    if (currentSeconds > lastSeconds) {
        if (parseInt(currentSeconds / 10) !== parseInt(lastSeconds / 10)) {
            //console.log("十位");
            addBall(top, left + 78 * (RADIUS + 1), parseInt(currentSeconds / 10));
        }
        if (currentSeconds % 10 !== lastSeconds % 10) {
            //console.log("个位");
            addBall(top, left + 93 * (RADIUS + 1), parseInt(currentSeconds % 10));
        }
    }
    lastHours = currentHours;
    lastMinutes = currentMinutes;
    lastSeconds = currentSeconds;

    updateBalls();
    //console.log(balls.length);
    //balls = [];
}

function render(context) {
    context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = 0 + minutes;
    }
    var seconds = date.getSeconds();
    if (seconds < 10) {
        seconds = 0 + seconds;
    }
    //console.log(hours,minutes,seconds);
    var top = topPosition;
    var left = leftPosition;
    //时分秒绘制
    renderDigit(top, left, parseInt(hours / 10), context);
    renderDigit(top, left + 15 * (RADIUS + 1), parseInt(hours % 10), context);
    renderDigit(top, left + 30 * (RADIUS + 1), 10, context);
    renderDigit(top, left + 39 * (RADIUS + 1), parseInt(minutes / 10), context);
    renderDigit(top, left + 54 * (RADIUS + 1), parseInt(minutes % 10), context);
    renderDigit(top, left + 69 * (RADIUS + 1), 10, context);
    renderDigit(top, left + 78 * (RADIUS + 1), parseInt(seconds / 10), context);
    renderDigit(top, left + 93 * (RADIUS + 1), parseInt(seconds % 10), context);

    //碰撞小球绘制
    for (var i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color;
        context.beginPath();
        context.arc(balls[i].x, balls[i].y, Math.ceil(RADIUS * Math.random() + 1), 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }
    //balls = [];


}

function renderDigit(y, x, num, context) {
    //数字圆形绘制
    context.fillStyle = "rgb(0,102,153)";
    //i为行,j为列
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j]) {
                context.beginPath();
                context.arc(x + (j + 1) * 2 * (RADIUS + 1), y + (i + 1) * 2 * (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                context.closePath();
                context.fill();

            }
        }
    }
}

function addBall(y, x, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 0) {
                //单个小球运动参数
                var ballData = {
                    x: x + (j + 1) * 2 * (RADIUS + 1),
                    y: y + (i + 1) * 2 * (RADIUS + 1),
                    g: 5.6 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 100)) * Math.ceil(10 * Math.random() + 2),
                    vy: -5 - 3 * Math.random(),
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(ballData);
            }
        }
    }
}

function updateBalls() {
    var mouseX;
    var mouseY;
    /*
    document.getElementById("canvas").onmouseover = function(location) {
        console.log("offset",location.offsetX);
        console.log("client",location.clientX);
        console.log("layer",location.layerX);
        console.log("page",location.pageX);
        console.log("screen",location.screenX);
        console.log("x",location.x);
    }
    */

    for (var i = 0; i < balls.length; i++) {
        //自由落体
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        //碰撞检测
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.6;
            balls[i].vx = balls[i].vx * 1.1;
        }


    }
    //去除多余数据
    var newIndex = 0;
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].x + RADIUS > 0 && balls[i].x < WINDOW_WIDTH) {
            balls[newIndex++] = balls[i];
        }
    }
    if (newIndex < balls.length - 1) {
        balls.splice(newIndex + 1, balls.length - 1 - newIndex);
    }
    //console.log("a"+newIndex);
}