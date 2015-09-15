//# require=d3,jquery,jThirdPost
$('<div id="jThirdControl"></div>')
    .append($('<span>jThirdKey:</span>'))
    .append($('<input type="text" id="jThirdKey" value="34TnCw">'))
    .append($('<button type="button" id="startjThird">start jThird!!</button>'))
    .appendTo($(root));
$(document).on('click', '#startjThird', function() {
    startjThird();
});

function startjThird() {
    jThirdKey = $('#jThirdKey').val();
    $("#jThirdControl").remove();
    if (jT == null) {
        $(root)
            .append('<div style="padding-top: 56.25%; margin: 0; position: relative;"><iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" allowfullscreen allowtransparency="true" frameborder="0" src="https://jthird.net/?v=' + jThirdKey + '&header=true&switches=false&autoplay=true"></iframe></div>');
        jT = new jThirdPost();
    }
    postMessageTojThird(d);
}
var jThirdKey;
var jT;
var d;

function update(data) {
    data.splice(0, 1);
    data.forEach(function(dd) {
        toInt(dd);
    });
    d = data;
    postMessageTojThird(d);
}

function toInt(dd) {
    for (var i = 0; i < 3; i++) {
        dd[i] = parseInt(dd[i], 10);
    };
}
//post message to jThird
//jThirdが読み込まれてからpostしないとダメなのでIntervalで投げる
//(4500ms待てば動いているので、現状１度実行した後にclearIngervalで止めている。)
//(※状況によっては動かないソース。。。)
function postMessageTojThird(data) {
    if (jT == null) {
        return;
    }
    var t = setInterval(function() {
        jT.jThird().postMessage(data);
        clearInterval(t);
    }, 4500);
}
