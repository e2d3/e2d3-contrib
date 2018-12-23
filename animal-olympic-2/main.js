//# require=d3
// 定数
var YOU = {
    name: "you",
    image: "you@2x.png",
    record: 16,
    top: 4
};

var CHILD = {
    name: "child",
    image: "child@2x.png",
    record: 17,
    top: 81
};

var BOLT = {
    name: "bolt",
    image: "bolt@2x.png",
    record: 9.58,
    top: 151
};

var CHEETAH = {
    name: "cheetah",
    image: "cheetah@2x.png",
    record: 3,
    top: 222
}

var TYPHOON = {
    name: "typhoon",
    image: "typhoon@2x.png",
    record: 4,
    top: 293
}

var CAR = {
    name: "car",
    image: "car@2x.png",
    record: 7.2,
    top: 363
}

var HORSE = {
    name: "horse",
    image: "horse@2x.png",
    record: 7.5,
    top: 434
}

var IMAGE_DIR = baseUrl + '/animal_icons/';

var ANIMALS = [YOU, CHILD, BOLT, CHEETAH, TYPHOON, CAR, HORSE];
var HEIGHT = 544;
var ICON_HEIGHT = 90;
var ICON_WIDTH = 90;
var ICON_START_X = 0;
var START_DELAY = 1000;
var ICON_NUM = 7;
var SPEED_COEFFICIENT = 200;

function update() {
}

var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 0
};

d3.select(root).selectAll('*').remove();

var width = root.clientWidth - margin.left - margin.right;
var height = root.clientHeight - margin.top - margin.bottom;

var drawArea = d3.select(root)
    .append('img')
    .attr({
        width: width,
        height: height,
        src: baseUrl + '/riku.png',
    })
    .style({
        position: 'absolute',
        top: margin.top,
        left: margin.left
    });

// 追加したトラック画像の要素を取得
// var riku = document.getElementById('riku');
// svgの追加
var svg = drawArea.append('svg')
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0);

// アイコンセット
ANIMALS.forEach(function(animal, i){
    var x = ICON_START_X;
    svg.append('image')
        .attr("id", animal.name)
        .attr("xlink:href", IMAGE_DIR + animal.image)
        .attr("class", "animals")
        .attr("x", x)
        .attr("y", animal.top)
        .attr("width", ICON_WIDTH)
        .attr("height", ICON_HEIGHT)
});
// スタートボタンにイベントを登録
d3.select('#startButton').on('click', function(){ start();});

// function animation() {
//     var drawArea = d3.select('root');
//     // 追加したトラック画像の要素を取得
//     var riku = document.getElementById('riku');

//     // svgの追加
//     var svg = drawArea.append('svg')
//         .attr("width", 900)
//         .attr("height", HEIGHT)
//         .style("position", "absolute")
//         .style("top", 0)
//         .style("left", 0);
//     var startDelay = START_DELAY;
//     var height = svg.attr('height');
//     var xMax = svg.attr('width');
//     ANIMALS.forEach(function(animal, i){
//         var y = i * (height / ICON_NUM);
//         var x = ICON_START_X;
//         svg.append('image')
//             .attr("id", animal.name)
//             .attr("xlink:href", IMAGE_DIR + animal.image)
//             .attr("class", "animals")
//             .attr("x", x)
//             .attr("y", animal.top)
//             .attr("width", ICON_WIDTH)
//             .attr("height", ICON_HEIGHT)
//             .transition()
//             .delay(startDelay)
//             .duration(animal['record'] * SPEED_COEFFICIENT)
//             .ease(d3.easeLinear)
//             .attr('x', xMax - ICON_WIDTH)
//             .attr('stroke', 'none')
//             .attr('display', 'inherited');
//     });
// }

// function start() {
//     var element = document.getElementById('ownRecord');
//     var ownRecord = null;
//     if (element != null) {
//         ownRecord = element.value;
//     }
//     if (ownRecord != null && ownRecord != '') {
//         ANIMALS[0]['record'] = parseInt(ownRecord);
//     }
//     // すべての要素を削除
//     d3.select('root').select('svg').remove();
//     // アニメーション
//     animation();
// }

