var banner = document.getElementById("banner");
banner.style.height = document.documentElement.clientHeight + "px";
$(document).ready(function(){
    //$("#banner").css('height',$(window).height());
    function showSideBar(){
        $(".mask").fadeIn("slow");
        $("#sidebar").animate({right: 0},'slow');
    }

    function hideSideBar(){
        $(".mask").fadeOut("slow");
        $("#sidebar").animate({right: -$('#sidebar').width()},'slow');
    }


    $(window).on('scroll',function(){
        if($(window).scrollTop() > $(window).height())
            $("#returnTop").fadeIn();
            //$("#returnTop").css("display","block");
        else
            $("#returnTop").fadeOut();
            //$("#returnTop").css("display","none");
        if($(window).scrollTop() > 0)
            $(".more").fadeOut();
        else
            $(".more").fadeIn();
    });


    function returnTop() {
        $('html').animate({scrollTop: 0},"slow");
    }
    $("#sidebar_trigger").on('click',showSideBar);
    $("#hideSideBar").on('click',hideSideBar);
    $(".mask").on('click',hideSideBar);
    $("#returnTop").on('click',returnTop);
});