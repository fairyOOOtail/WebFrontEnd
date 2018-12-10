/*
https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3
*/

$(document).ready(function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if(!window.AudioContext) {
        alert('当前浏览器不支持 Web AudioContext API....');
    }
    else {
        var gameStatus = {};
        var musicStatus = {};
        var color = ["green","red","yellow","blue"];
        var audioCtx = new AudioContext();
        var arrFrequency = [329.63,261.63,220,164.81];
        var oscillator,gainNode,errOsc,errGain,index;
        var otherFreq = [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];

        gameStatus.init = function() {
            this.lock = true;
            this.strict = false;
            this.num = 0;
            this.clickArr = [];
            this.randomArr = [];
            this.ifRight = true;
        }

        gameStatus.init();

        musicStatus.init = function() {
            this.start = 0;
            this.direction = 1;
            this.count = 0;
        }

        musicStatus.init();

        if(gameStatus.lock)
            unClickable();
        function createOsc() {
            oscillator = arrFrequency.map(function(freq) {
                var o = audioCtx.createOscillator();
                o.type = "sine";              //声音波形为正弦波
                o.frequency.value = freq;
                return o;
            });
            return oscillator;
        }

        function createGainNode(oscillator) {
            gainNode = oscillator.map(function(o) {
                var g = audioCtx.createGain();
                o.connect(g);                     //音调与音量关联
                g.connect(audioCtx.destination);  //音量与音频设备关联
                return g;
            });
            return gainNode;
        }

        function createErrOsc() {
            var errOsc = audioCtx.createOscillator();
            errOsc.type = "sine";
            errOsc.frequency.value = 110;
            return errOsc;
        }

        function createErrGain(errOsc) {
            var errGain = audioCtx.createGain();
            errOsc.connect(errGain);
            errGain.connect(audioCtx.destination);
            return errGain;
        }

        function errorTone() {
            errOsc = createErrOsc();
            errGain = createErrGain(errOsc);
            errGain.gain.linearRampToValueAtTime(1,audioCtx.currentTime);
            errOsc.start(audioCtx.currentTime);
            errGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
            errOsc.stop(audioCtx.currentTime);
        }

        function playTone(oscillator,gainNode,index) {
            gainNode[index].gain.linearRampToValueAtTime(1,audioCtx.currentTime);
            oscillator[index].start(audioCtx.currentTime);
        }

        function stopTone(oscillator,gainNode,index) {
            gainNode[index].gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime);
            oscillator[index].stop(audioCtx.currentTime);
        }

        function randomColor() {
            var randomIndex = Math.floor(Math.random()*color.length);
            gameStatus.randomArr.push(color[randomIndex]);
        }

        function clickColor(selector) {
            gameStatus.clickArr.push($(selector).attr("id"));
        }

        function checkIfRight() {
            var index = gameStatus.clickArr.length - 1;
            if(gameStatus.clickArr[index] == gameStatus.randomArr[index]) {
                return true;
            }
            else {
                return false;
            }
        }



        function unClickable() {
            $(".block").css("pointer-events","none");
        }

        function clickable() {
            $(".block").css("pointer-events","all");
        }

        function autoClick() {
            unClickable();
            var count = 0;
            var i = 0 ;
            var id;
            var lastID;
            var val;
            var index = 0;
            var intervalID1 = setInterval(function() {
                val = gameStatus.randomArr[i];
                id = "#" + val;
                lastID = id;
                index = $(id).attr("value");
                $(id).css("background-color",changeColor(parseInt(index,10)));
                count++;
                if(count <= gameStatus.randomArr.length) {
                    oscillator = createOsc();
                    gainNode = createGainNode(oscillator);
                    gainNode[index].gain.linearRampToValueAtTime(1,audioCtx.currentTime);
                    oscillator[index].start(audioCtx.currentTime);
                    gainNode[index].gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + timeInterval());
                    oscillator[index].stop(audioCtx.currentTime + timeInterval());
                }

                if(i < gameStatus.randomArr.length - 1) {
                    i = count;
                }

                if(count > gameStatus.randomArr.length){
                    $(id).css("background-color",resetColor(parseInt(index,10)));
                    clickable();
                    gameStatus.clickArr = [];
                    clearInterval(intervalID1);
                }
            },timeInterval()*1000);

            var intervalID2 = setInterval(function() {
                setTimeout(function() {$(id).css("background-color",resetColor(parseInt(index,10)));},timeInterval()*1000/2);
                if(count == gameStatus.randomArr.length) {
                    clearInterval(intervalID2);
                }
            },timeInterval()*1000);

        }

        function changeColor(index) {
            if(index === 0)
                return "rgb(0,255,0)";
            if(index === 1)
                return "rgb(255,0,0)";
            if(index === 2)
                return "rgb(255,255,0)";
            if(index === 3)
                return "rgb(0,0,255)";
        }

        function resetColor(index) {
            if(index === 0)
                return "rgb(0,160,0)";
            if(index === 1)
                return "rgb(160,0,0)";
            if(index === 2)
                return "rgb(160,160,0)";
            if(index === 3)
                return "rgb(0,0,160)";
        }

        function timeInterval() {
            var time = [1.25 , 1.0 , 0.75, 0.5 ];
            if(gameStatus.num <= 5)
                return time[0];
            if(gameStatus.num <= 10)
                return time[1];
            if(gameStatus.num <= 15)
                return time[2];
            if(gameStatus.num <= 20)
                return time[3];
        }

        function displayBoard(check) {
            if(check === true) {
                $(".count").html(gameStatus.num);
                $(".count").css("color","white");
            }
            if(check === false) {
                $(".count").html("!!!");
                $(".count").css("color","red");
            }
        }
        function joke() {
            if(gameStatus.num == 20 || musicStatus.count == 6) {
                $(".simon-game").addClass("animated hinge");
                $("html").css("background-image","url('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1522318321816&di=598180e38b3ad4ff1066334bd47ab9f8&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170626%2F419274e5e71048cba9f321ebb46a8f67_th.png')")
            }
        }
        $(".block").on('mousedown',function() {
            var id = "#" + $(this).attr("id");
            index = $(this).attr("value");
            $(id).css("background-color",changeColor(parseInt(index,10)));
            gameStatus.clickArr.push($(this).attr("id"));
            gameStatus.ifRight = checkIfRight();
            if(gameStatus.ifRight === true) {
                oscillator = createOsc();
                gainNode = createGainNode(oscillator);
                playTone(oscillator,gainNode,index);
            }
            else {
                displayBoard(gameStatus.ifRight);
                errOsc = createErrOsc();
                errGain = createErrGain(errOsc);
                errGain.gain.linearRampToValueAtTime(1,audioCtx.currentTime);
                errOsc.start(audioCtx.currentTime);
            }

        });

        $(".block").on("mouseup",function() {
            var id = "#" + $(this).attr("id");
            index = $(this).attr("value");
            $(id).css("background-color",resetColor(parseInt(index,10)));
            if(gameStatus.ifRight === true) {
                stopTone(oscillator,gainNode,index);
            }
            if(gameStatus.ifRight === true && gameStatus.clickArr.length === gameStatus.randomArr.length) {
                stopTone(oscillator,gainNode,index);
                randomColor();
                autoClick();
                gameStatus.num++;
                displayBoard(gameStatus.ifRight);
            }
            if(gameStatus.strict === true) {
                if(gameStatus.ifRight === false) {
                    errGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime);
                    errOsc.stop(audioCtx.currentTime);
                    gameStatus.init();
                    gameStatus.strict = true;
                    displayBoard(true);
                    randomColor();
                    autoClick();
                }
            }
            else{
                if(gameStatus.ifRight === false) {
                    errGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime);
                    errOsc.stop(audioCtx.currentTime);
                    autoClick();
                    displayBoard(true);
                }
            }
            joke();

            //console.log("r",gameStatus.randomArr);
            //console.log("c",gameStatus.clickArr);
        });

        $(".start-btn").click(function() {
            gameStatus.init();
            displayBoard(true);
            randomColor();
            autoClick();
        });

        $(".strict").click(function() {
            gameStatus.init();
            gameStatus.strict = true;
            displayBoard(true);
            randomColor();
            autoClick();
        });

        $(".reset").click(function() {
            gameStatus.init();
            displayBoard(true);
            musicStatus.init();
        });

        $(".play-btn").click(function() {
            var freq = otherFreq[musicStatus.start];
            if(!freq) {
                musicStatus.direction = -1 * musicStatus.direction;
                musicStatus.start = musicStatus.start + 2 * musicStatus.direction;
                freq = otherFreq[musicStatus.start];
            }
            musicStatus.start = musicStatus.start + musicStatus.direction;
            oscillator = audioCtx.createOscillator();
            gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.type = "trangle";
            oscillator.frequency.value = freq;
            gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
            oscillator.start(audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
            oscillator.stop(audioCtx.currentTime + 1);
            musicStatus.count++;
            joke();
        });

    }


});