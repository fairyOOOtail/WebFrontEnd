$(document).ready(function () {

    //创建Sync实例
    var config = {
        syncURL: "https://wd3315540768cplmnp.wilddogio.com"
    };
    wilddog.initializeApp(config);
    var postRef;
    var tempRef;
    var ref = wilddog.sync().ref();
    var arr = [];
    var newInput = "";
    var temp_len = 0;
    var display = [];
    var newDm;
    var afterDel = "";
    var currentId = 1;
    var currentArr = [];
    var showIndex = 0;
    var ifInput = false;
    var text = "";
    //实时通讯
    //var anotherConfig = {
    //syncURL:"https://wd4082669985mvciky.wilddogio.com"
    //};
    //var anotherApp = wilddog.initializeApp(anotherConfig);

    //json树 : {
    //  "message":{
    //    "base64decode1":{
    //      "content":"666"}}}

    //响应按键点击事件
    //获取文本框数据并上传
    //从当前网页到数据库

    //循环弹幕显示
    // setInterval(() => {
    //     if(ifInput === false){
    //         if(arr.length > 0) {
    //             showDanmu(arr[showIndex]);
    //         }
    //         if(showIndex === arr.length - 1){
    //             showIndex = 0;
    //         }
    //         else {
    //             showIndex++;
    //         }
    //     }
    // },3000);

    //检测是否有其他用户此时输入
    // setInterval(() => {
    // },3000);

    //show picture
    $(".dm_screen_bottom .img_list img").click(function() {
       showPic($(this));
    });
    $(".s_sub").click(function () {
        text = $(".s_text").val();
        temp_len = arr.length;
        ifInput = true;
        var postRef = ref.child("history");
        var tempRef = ref.child("current_message");
        if(filter(text)){
            postRef.push(text);
            tempRef.push({
                content: text,
                time: getTime(),
                date: new Date().toLocaleDateString()
            });


            $(".s_text").val('');
        }

    });

    //清空数组和屏幕
    $(".s_del_normal").click(function () {
        //清楚temp_message节点
        arr = [];
        $(".dm_show").empty();
    });

    $(".s_del").click(function () {
        arr = [];
        $(".dm_show").empty();
        afterDel = $("<h1 class=\" text-center text-primary \" id=\"me\">暴力不？<br></h1>");
        $("#qiang").append(afterDel);
    });

    //响应键盘事件
    $(".s_text").keypress(function (event) {
        if (event.keyCode == "13") {
            $(".s_sub").trigger('click');
        }
    });

    //事件监听是指通过事件触发的方式来获取云端变化的数据。通过监听云端事件，本地获取并处理数据，保持和数据实时同步。

    //监听数据并传回数组
    //从数据库到当前网页
    wilddog.sync().ref('current_message').on('child_added',
        function (snapshot) {
            newDm = snapshot.val();
            arr.push(newDm);
            // 即时显示
            if (ifInput) {
                setTimeout(() => {
                    index = arr.length - 1;
                    newInput = arr[index].content;
                    showDanmu(newInput);
                }, 500);
            }
            showHistory(newDm.content, newDm.time,newDm.date);
            //console.log(newDm);


            //display.push(arr_content);
            //var textObj = $("<div class=\"dm_message\"></div>");
            //var textObj = $(".dm_message");
            //textObj.text(newDm);
            //$(".dm_show").append(textObj);
            //moveObj(textObj);
        });

    //获取匹配元素在当前视口的相对偏移
    var topMin = 0;
    var topMax = $('.dm_show').height() / 2;
    var _top = topMin;
    //动画效果
    function moveObj(obj) {


        if (_top > topMax) {
            _top = topMin;
        }

        obj.css({
            left: $('.dm_show').width() ,
            top: _top
        });
        _top = _top + 40;
        var time = 10000;

        obj.animate({
            //move left
            left: -obj.width()
        }, time, function () {
            obj.remove();
            //obj.remove();
        });
        //obj.remove();


    };
    //display.push(arr_content);
    //多线程显示
    // var showRun = function (index) {
    //     for (var i = index; i < arr.length; i++) {
    //         currentArr.push(arr[i]);
    //         showDanmu(arr[i], i);
    //     }
    //     console.log(currentArr);
    //     //setTimeout(showRun, 3000);
    // };

    function showDanmu(content) {
        var runObj = $("<p class=\'dm_message\'>" + content + "</p>");
        $(".dm_show").append(runObj);
        moveObj(runObj);

    }

    function showHistory (content, time,date) {
        var _content = "<li title=\"" + content + "\">" + content + "</li>";
        var _floor = "<li>" + "匿名" + "</li>";
        var _time = "<li title='" + date + "'>" + time + "</li>";
        $(".send_floor").append(_floor);
        $(".send_content").append(_content);
        $(".send_time").append(_time);
    }
    function getTime() {
        var date = new Date();
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return hour + ":" + minute + ":" + second;
    }
    function showPic(img) {
        var src = img.attr('src');
        $(".bg").css("background","url("+src+")");
        $(".bg").css("background-size","cover");

    }
    function filter(input) {
        //null
        if(input === "") {
            return false;
        }
        // var script = /<.*>.*<\/.*>/g;
        // var p1 = /<\w*/g;
        if(input.match(/</g) || input.match(/>/g)){
            // input.replace(/</g,"lt").replace(/>/g,"gt");
            return false;
        }
        //xss
        return true;
    }
    jQuery.fx.interval = 15; //动画帧数

    // setInterval(() => {
    //     var date = new Date();
    //     //10分钟清除一次当前聊天数据
    //     if (date.getMinutes() % 10 === 0 && date.getSeconds() === 0) {
    //         //清除current_message节点
    //         wilddog.sync().ref('current_message').remove();
    //         arr = [];
    //     }
    // }, 100);
    //设置100ms减少误差
});