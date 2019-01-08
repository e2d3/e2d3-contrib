//# require=d3

// アイコンの情報
var YOU = {
    name: "you",
    image: "you@2x.png",
    top: 0
};
var CHILD = {
    name: "child",
    image: "child@2x.png",
    top: 81
};
var BOLT = {
    name: "bolt",
    image: "bolt@2x.png",
    top: 151
};
var CHEETAH = {
    name: "cheetah",
    image: "cheetah@2x.png",
    top: 222
}
var TYPHOON = {
    name: "typhoon",
    image: "typhoon@2x.png",
    top: 293
}
var CAR = {
    name: "car",
    image: "car@2x.png",
    top: 363
}
var HORSE = {
    name: "horse",
    image: "horse@2x.png",
    top: 434
}

// アイコン画像へのパス
var IMAGE_DIR = baseUrl + '/animal_icons/';

// アイコン情報を管理するリスト
var ANIMALS = [YOU, CHILD, BOLT, CHEETAH, TYPHOON, CAR, HORSE];

// トラックの縦幅
var HEIGHT = 560;
// アイコンの縦幅
var ICON_HEIGHT = 80;
// アイコンの横幅
var ICON_WIDTH = 80;
// アイコンのスタート位置（x軸）
var ICON_START_X = 0;
// スタートボタンを押してからのタイムラグ
var START_DELAY = 1000;
// アイコンのスピードに掛け合わせる係数
var SPEED_COEFFICIENT = 200;
// 全体のマージン
var MARGIN = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 0
};
// スタートボタンのTOP
var BUTTON_HEIGHT = 600;
// データの中で記録部分のキー
var RECORD_KEY = '記録(100m)';

// データ更新
function update(data) {
    var data = data.toList();
    // data と ANIMALS は同じ長さであるはず
    ANIMALS.forEach(function(animal, index){
        animal.record = data[index][RECORD_KEY];
    });
}

// アイコンやボタンを表示するための関数
function init() {
    // 一応すべて消す
    d3.select(root).selectAll('*').remove();

    // 横幅を合わせる
    var width = root.clientWidth - MARGIN.left - MARGIN.right;

    // 背景トラック画像の表示
    d3.select(root)
        .append('img')
        .attr({
            width: width,
            height: HEIGHT,
            src: baseUrl + '/riku.png',
        })
        .style({
            position: 'absolute',
            top: MARGIN.top,
            left: MARGIN.left
        });

    // svgの追加
    var svg = d3.select(root).append('svg')
        .attr("width", width)
        .attr("height", 700)
        .style("position", "absolute")
        .style("top", MARGIN.top)
        .style("left", MARGIN.left);

    // アイコンセットを表示
    ANIMALS.forEach(function(animal){
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

    // スタート用のボタンを用意
    createButton();
}

// アニメーション部分
function animation() {
    // 横幅を合わせる
    var width = root.clientWidth - MARGIN.left - MARGIN.right;

    // svgの追加
    var svg = d3.select(root).append('svg')
        .attr("width", width)
        .attr("height", 700)
        .style("position", "absolute")
        .style("top", MARGIN.top)
        .style("left", MARGIN.left);

    ANIMALS.forEach(function(animal){
        var x = ICON_START_X;
        svg.append('image')
            .attr("id", animal.name)
            .attr("xlink:href", IMAGE_DIR + animal.image)
            .attr("class", "animals")
            .attr("x", x)
            .attr("y", animal.top)
            .attr("width", ICON_WIDTH)
            .attr("height", ICON_HEIGHT)
            .transition()
            .delay(START_DELAY)
            .duration(animal['record'] * SPEED_COEFFICIENT)
            .ease("linear")
            .attr('x', width - ICON_WIDTH)
            .attr('stroke', 'none')
            .attr('display', 'inherited');
    });

    createButton();
}

// ボタンを描画
function createButton() {
    d3.select(root).select('svg').append('text')
        .text('START')
        .attr('id', 'button')
        .attr("y", BUTTON_HEIGHT)
        .on('click', function(){
            start();
        });
}

// ボタンを押したときのコールバック関数
function start() {
    d3.select(root).select('svg').remove();
    animation();
}

init();
