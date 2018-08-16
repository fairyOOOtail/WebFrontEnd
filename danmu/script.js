$(document).ready(function(){
    //特效
    $("#me").addClass('animated rollIn');
    //$(".dm_screen").addClass("animated infinite pulse");
    $(".s_text").addClass('animated infinite rubberBand');
    $(".s_sub").addClass('animated infinite pulse');
    $(".s_del").addClass('animated infinite pulse');
    $(".s_del_normal").addClass('animated infinite pulse');

    //创建Sync实例
    var config = {
        syncURL: "https://wd3315540768cplmnp.wilddogio.com"
    };
    wilddog.initializeApp(config);
    var postRef ;
    var tempRef ;
    var ref = wilddog.sync().ref();
    var arr = [];
    var arr_content = "";
    var index = 0 ;
    var temp_index;
    var display = [];
    var newDm ;
    var afterDel = "";
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

    $(".s_sub").click(function() {
        var text = $(".s_text").val();
        var postRef = ref.child("message");
        var tempRef = ref.child("temp_message");
        postRef.push(text);  //数据传入数据库
        tempRef.push(text);
        console.log(arr);
        //未知BUG:push({"dm-content":text)} 不行
        //display.push(arr_content);
        //console.log(newDm);
        $(".s_text").val('');
        //$("#pic").addClass("animated bounce");
    });

    //清空数组和屏幕
    $(".s_del_normal").click(function(){
        wilddog.sync().ref('temp_message').remove(); //清楚temp_message节点
        arr = [];
        $(".dm_show").empty();
    });

    $(".s_del").click(function(){
        wilddog.sync().ref('temp_message').remove(); //清楚temp_message节点
        arr = [];
        $(".dm_show").empty();
        $(".dm").addClass('animated hinge');
        afterDel = $("<h1 class=\" text-center text-primary \" id=\"me\">暴力不？<br></h1>");
        $("#qiang").append(afterDel);
        $("#qiang").addClass("animated zoomInLeft");
    });

    //响应键盘事件
    $(".s_text").keypress(function(event) {
        if (event.keyCode == "13"){
            $(".s_sub").trigger('click');
        }
    });

    //事件监听是指通过事件触发的方式来获取云端变化的数据。通过监听云端事件，本地获取并处理数据，保持和数据实时同步。

    //监听数据并传回数组
    //从数据库到当前网页
    wilddog.sync().ref('temp_message').on('child_added',
        function(snapshot){
            newDm = snapshot.val();
            arr.push(newDm);
            index = arr.length - 1;
            arr_content = arr[index];
            //display.push(arr_content);
            //var textObj = $("<div class=\"dm_message\"></div>");
            //var textObj = $(".dm_message");
            //textObj.text(newDm);
            //$(".dm_show").append(textObj);
            //moveObj(textObj);
        });

    //获取匹配元素在当前视口的相对偏移
    var topMin = $('.dm_screen').offset().top;
    var topMax = topMin + $('.dm_screen').height();
    var _top = topMin ;
    var width = $('.dm_screen').offset().left + $('.dm_screen').width();

    //动画效果
    var moveObj = function(obj){
        var _width = width + obj.width();
        _top = _top + 50 ;
        if (_top > (topMax - 50)) {
            _top = topMin;
        }
        obj.css({
            left: _width,
            top: _top
        });
        var time = 20000 + 5000*Math.random();
        //obj.addClass("animated rollIn");

        obj.animate({
            left:"-" + _width + "px"
        }, time, function(){
            obj.remove();
            //obj.addClass("animated rollOut");
            //obj.remove();
            //$(".d_m").addClass("animated hinge");
        });
        //obj.remove();
        //$(".d_m").addClass("animated zoomOutLeft");
    };
    //display.push(arr_content);
    //多线程显示
    var getRun = function() {
        //$("#pic").addClass('animated infinite pulse');
        if (arr.length > 0) {
            var n = Math.floor(Math.random() * arr.length) ;
            var runObj = $("<div>" + arr[n] + "</div>");
            $(".dm_show").append(runObj);

            moveObj(runObj);
        }
        setTimeout(getRun, 3000);
    };

    jQuery.fx.interval = 50; //动画帧数
    getRun();
});