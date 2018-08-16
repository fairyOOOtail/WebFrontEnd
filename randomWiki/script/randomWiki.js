$(document).ready(function() {
    var search;
    var url;
    setTimeout(()=>{
        $(".box").css("opacity",1);

    },500);


    $("#search").on('click',function() {
        removeAnimate();

        loading();


        $(".display").html("");
        search = $("input").val();
        url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + search + "&namespace=0&format=json";

        connect(url);
    });

    $("#delete").on('click',function() {
        $("input").val("");
        removeAnimate();

        $(".display").html("");
    });

    $("input").keypress(function(event) {
        if (event.keyCode == "13"){
            $(".tips").html("<div class=\"sorry\"><i class=\"fa fa-spinner fa-spin\"></i>loading,please wait a moment...</div>");
            $("#search").trigger('click');
            removeAnimate();
        }

    });

    function connect(url){
        if(search)
            $.ajax({
                url:url,
                data:{},
                jsonp:"callback",
                dataType:'jsonp',
                type:'get',
                headers:{'User-Agent' : 'Kyr1e/1.0'},
                success:function(data){
                    getData(data);
                    //alert(JSON.stringify(data));
                },
                error:function(errorThorwn){
                    //alert(JSON.stringify(errorThorwn));
                }
            });
        else {
            $(".tips").html("<div class=\"sorry\">please input the wiki you want to check...</div>");
            $(".sorry").css("opacity",1);
        }
    }

    function getData(data) {
        var title = data[1];
        var content = data[2];
        var ref = data[3];
        if(data[1].length) {
            display(search,title,content,ref,data[1].length);
	    loadingEnd();
            animate();

        }
        else{
            $(".tips").html("<div class=\"sorry\">there is no wiki named \""+ search + "\"</div>");
            $(".sorry").css("opacity",1);
        }
        if(content == "")
            content = ".........";

        // console.log(content);
        /*for (var x in json){
          content = json[x];
        }*/
        //content = content.revisions["0"]["*"];
        //content = content.replace(/\n/g,"");
        //test(JSON.stringify(content));

    }

    function display(search,title,content,ref,len) {
        var strong = "<strong id=\"strong\">" + search + "</strong>";
        var r = new RegExp(search,"g");

        for(var i = 0; i < len ; i++ ) {
            $(".display").append("<div class=\"result\" id=\"r"+ i +"\"></div>");
            $("#r"+i).append("<span id=\"title\">" + "<a target=\"_blank\" href = '" + ref[i] + "'>" + title[i].replace(r,strong) + "</a></span><br>");
            if(content[i] == ""){
                $("#r"+i).append("<span id=\"content\">...........</span><br>");
            }
            else {
                $("#r"+i).append("<span id=\"content\">" + content[i].replace(r,strong) + "</span><br>");
            }
            $("#r"+i).append("<span><a id=\"ref\" target=\"_blank\" href='" + ref[i] + "'>"+ref[i]+"</a></span><br>");

    }
        //$(".test").html();
    }
    function animate() {
        $(".display").css("opacity",1);
    }
    function removeAnimate(){
        $(".display").css("opacity",0);
    }
    function loading(){
        $(".tips").html("<div class=\"sorry\"><i class=\"fa fa-spinner fa-spin\"></i>  loading,please wait a moment...</div>");
        $(".sorry").css("opacity",1);


    }
    function loadingEnd(){
        $(".sorry").css("opacity",0);
        $(".tips").html("");
    }


});
