
var data = data;

//翻转
function turnPage(elem) {
    var c_name = elem.className;
    //获取当前点击图片序号
    var n = elem.id.split('-')[1];

    //排序及显示中心图片
    if( !/photo-center/.test(c_name) ) {
        var selector = document.getElementById("photo-"+n);
        selector.style = "";
        return sortPhotos(n);
    }

    if( /photo-front/.test( c_name ) ) {
        c_name = c_name.replace(/photo-front/,'photo-back');
        getElem('.btn-current')[0].style['transform'] = "rotateY(180deg)";
    }
    else {
        c_name = c_name.replace(/photo-back/,'photo-front');
        getElem('.btn-current')[0].style['transform'] = "rotateY(0deg)";
    }

    elem.className = c_name;
    return elem;
}

//获取选择器
function getElem(selector) {
    var elem = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';
    return document[elem](selector.substr(1));
}

//添加图片
function addPhotos() {
    var template = getElem('#wrap').innerHTML;
    var html = [];
    var nav = [];
    for(var i = 0;i < data.length;i++) {
        var newHtml = template.replace('{{index}}',i).replace('{{date}}',data[i].date).replace('{{img}}',data[i].img).replace('{{title}}',data[i].title);
        html.push(newHtml);
        var id = "id = \"nav-" + i + "\" ";
        var className="class = \'btn\' ";
        var onclick = "onclick = 'turnPage(getElem(\"#photo-" + i + "\"));'";
        nav.push("<span " + id + className + onclick +  "></span>");
    }
    html.push('<div class="nav">' + nav.join('') + '</div>');
    getElem('#wrap').innerHTML = html.join("");

    //randomPhotos();
}

//随机中心图片
function randomPhotos(){
    var max = data.length;
    var min = 0;
    var randomNum = Math.floor(Math.random()*(max - min));
    return randomNum;
}
//randomPhotos();

//随机距离 {left : {x : [min,max],y:[min,max},right : {}}
function randomDis(){
    var distance = { left : {x : [], y : []}, right : {x : [], y:[]}};
    var wrap_len = {
        width : getElem('#wrap').clientWidth,
        height : getElem('#wrap').clientHeight
    }
    var photo_len = {
        width : getElem('.photo')[0].clientWidth,
        height : getElem('.photo')[0].clientHeight
    }
    distance.left.x = [ 0, wrap_len.width/2 - photo_len.width/2];
    distance.left.y = [ -photo_len.width/2, wrap_len.height - photo_len.width];
    distance.right.x = [ wrap_len.width/2 + photo_len.width/2 , wrap_len.width - photo_len.width];
    distance.right.y = [ -photo_len.width/2, wrap_len.height - photo_len.width];
    //console.log(distance);
    return distance;
}
//randomDis();

//排序图片
function sortPhotos(index){

    //清除已有中心图片
    var _photo_center = getElem('.photo-center');
    if(_photo_center[0]) {
        //清除背面中心图片
        if (/photo-back/.test(_photo_center[0].className)) {
            _photo_center[0].className = _photo_center[0].className.replace(/photo-back/, 'photo-front');
        }
        _photo_center[0].className = _photo_center[0].className.replace(/\sphoto-center/, ' ');
    }
    var photoArr = [];
    var _photo = getElem('.photo');
    for(var i = 0; i < _photo.length; i++){
        photoArr.push(_photo[i]);
        _photo[i].style['transform'] = 'scale(1.2) translate(-50%,-50%)';
    }

    //添加中心图片
    var photo_center = getElem('#photo-'+index);
    photo_center.className += ' photo-center';
    photo_center = photoArr.splice(index,1)[0];

    //左右分区
    var photo_left = photoArr.splice(0,Math.floor(photoArr.length/2 + 1));
    var photo_right = photoArr;

    for(i in photo_left){
        var photoClass = photo_left[i];
        var dis = randomDis();
        photoClass.style.left = Math.random()*(dis.left.x[1] - dis.left.x[0]) + dis.left.x[0] + 'px';
        photoClass.style.top = Math.random()*(dis.left.y[1] - dis.left.y[0]) + dis.left.y[0] + 'px';
        photoClass.style['transform'] = 'rotate(' + (Math.random()*(150 + 150) - 150) + 'deg)' + 'scale(1)';
    }

    for(i in photo_right){
        var photoClass = photo_right[i];
        var dis = randomDis();
        photoClass.style.left = Math.random()*(dis.right.x[1] - dis.right.x[0]) + dis.right.x[0] + 'px';
        photoClass.style.top = Math.random()*(dis.right.y[1] - dis.right.y[0]) + dis.right.y[0] + 'px';
        photoClass.style['transform'] = 'rotate(' + (Math.random()*(150 + 150) - 150) + 'deg)' + 'scale(1)';

    }


    //中心海报控制按钮
    var navs_current = getElem(".btn-current")[0];
    //清除中心按钮样式
    if(navs_current) {
        navs_current.className = navs_current.className.replace(/btn-current/, '');
        navs_current.style["transform"] = "";
    }
    getElem('#nav-' + index).className += ' btn-current';
}

addPhotos();
var index = randomPhotos();
sortPhotos(index);