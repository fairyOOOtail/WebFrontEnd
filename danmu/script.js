$(document).ready(function () {

    //创建Sync实例
    var config = {
        syncURL: "https://wd3315540768cplmnp.wilddogio.com"
    };
    wilddog.initializeApp(config);
    var ref = wilddog.sync().ref();
    //保存历史纪录
    var postRef = ref.child("history");
    //测试节点
    var tempRef = ref.child("current_message");
    var arr = [];
    var newDm;
    var loadEnd = false;
    var text = "";

    //等待数据加载完毕
    setTimeout(() => {
        loadEnd = true;
    },1500)


    //show picture
    $(".dm_screen_bottom .img_list img").click(function() {
       showPic($(this));
    });

    $(".s_sub").click(function () {
        text = $(".s_text").val();
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

    //清屏
    $(".s_del_normal").click(function () {
        $(".dm_message").empty();
    });

    $(".s_text").keypress(function (event) {
        if (event.keyCode == "13") {
            $(".s_sub").trigger('click');
        }
    });


    //监听数据并传回数组
    wilddog.sync().ref('current_message').on('child_added',
        function (snapshot) {
            newDm = snapshot.val();
            arr.push(newDm);

            // 即时显示
            //数据加载完毕...
            //开始即时监听
            if (loadEnd) {
                setTimeout(() => {
                    index = arr.length - 1;
                    newInput = arr[index].content;
                    //显示最新输入
                    showDanmu(newInput);
                }, 100);
            }
            showHistory(newDm.content, newDm.time,newDm.date);

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
        });


    }

    function showDanmu(content) {
        var runObj = $("<p>" + content + "</p>");
        $(".dm_message").append(runObj);
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
        $(".bg").css("background-position","center");
    }

    function filter(input) {
        //null
        if(input === "") {
            return false;
        }
        //xss
        // var script = /<.*>.*<\/.*>/g;
        // var p1 = /<\w*/g;
        if(input.match(/</g) || input.match(/>/g)){
            // input.replace(/</g,"lt").replace(/>/g,"gt");
            return false;
        }
        return true;
    }

    //动画帧数
    jQuery.fx.interval = 15;

});