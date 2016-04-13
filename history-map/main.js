//# require=d3,leaflet,es6-promise.min

const HOME_LAT = 35.475846;
const HOME_LNG = 139.628833;

d3.select(root)
  .append('div')
  .attr('id', 'map-container')

d3.select('#map-container')
  .style({
      'height': root.clientHeight + 'px',
      'width': root.clientWidth + 'px'
  })

// しぇあひるずを中心に表示  setView([緯度, 経度], ズーム)
var mapLayer = L.map('map-container').setView([HOME_LAT, HOME_LNG], 15);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
}).addTo(mapLayer);

function update(data) {
    const SPOT_NAME_LABEL = data[0][0];
    const LAT_LABEL = data[0][3];
    const LNG_LABEL = data[0][4];

    var listData = data.toList();

    listData.forEach(function(spot) {
        var marker = L.marker([spot[LAT_LABEL], spot[LNG_LABEL]])
          .addTo(mapLayer)
          .bindPopup(spot[SPOT_NAME_LABEL]);

        marker.on('click', function() {
            d3.select('.leaflet-popup-content').on('click', function() {

                d3.select('.leaflet-control')
                  .style('display', 'none')

                createContents(spot, data, SPOT_NAME_LABEL);
            })
        });
    });
}

function createContents(spot, data, spotName) {
    const ADDRESS_LABEL = data[0][1];
    const DESCRIPTION_LABEL = data[0][2];
    const PICT1_LABEL = data[0][5];
    const PICT2_LABEL = data[0][6];
    const PICT3_LABEL = data[0][7];
    const PICT4_LABEL = data[0][8];

    var modalPadding = root.clientHeight / 20;

    var modalContent = d3.select(root)
      .append('div')
      .attr('id', 'modal-content')
      .style({
          'padding': modalPadding + 'px',
          'width': root.clientWidth - (modalPadding * 2) + 'px',
          'height': root.clientHeight - (modalPadding * 2) + 'px'
      })

    modalContent
      .append('div')
      .attr('id', 'spot')
      .text(spot[spotName])

    modalContent
      .append('div')
      .attr('id', 'description')
      .text(spot[DESCRIPTION_LABEL])

    modalContent
      .append('div')
      .attr('id', 'address')
      .text(spot[ADDRESS_LABEL])
      .style({
          'position': 'absolute',
          'bottom': modalPadding + 'px'
      })

    var pictMargin = 20;
    // var pictContainerWidth = (root.clientWidth - (modalPadding * 2) - pictMargin) * 0.5;
    var pictContainerWidth = root.clientWidth - (modalPadding * 2);
    var pictContainerHeight = root.clientHeight - document.getElementById('spot').clientHeight - document.getElementById('description').clientHeight - document.getElementById('address').clientHeight - 50 - (modalPadding * 2);

    var mainPictBox = modalContent
      .append('div')
      .attr('id', 'main-pict-box')

    var p1 = function() {
        return new Promise(function(resolve) {
            mainPictBox
              .append('img')
              .attr('id', 'picture1')
              .attr('src', spot[PICT1_LABEL])
              .style({
                  'max-width': (pictContainerWidth - pictMargin) / 2 + 'px',
                  'max-height': pictContainerHeight + 'px',
                  'margin-right': pictMargin + 'px',
              })
              .on('click', function() {
                  createPictPreview(spot[PICT1_LABEL]);
              })
              .on('load', function() {
                  if (spot[PICT3_LABEL] !== '' || spot[PICT4_LABEL] !== '') {
                      resolve(getPictSize(this));
                  }
              })
        })
    }

    var p2 = function() {
        return new Promise(function(resolve) {
            mainPictBox
              .append('img')
              .attr('id', 'picture2')
              .attr('src', spot[PICT2_LABEL])
              .style({
                  'max-width': (pictContainerWidth - pictMargin) / 2  + 'px',
                  'max-height': pictContainerHeight + 'px'
              })
              .on('click', function() {
                  createPictPreview(spot[PICT2_LABEL]);
              })
              .on('load', function() {
                  if (spot[PICT3_LABEL] !== '' || spot[PICT4_LABEL] !== '') {
                      resolve(getPictSize(this));
                  }
              })
        })
    }

    var tasks = [ p1(), p2() ];
    Promise.all(tasks).then(function(results) {

        var pictBox = modalContent
          .append('div')
          .attr('id', 'sub-pict-box')

        pictBox
          .append('img')
          .attr('id', 'picture3')
          .attr('src', spot[PICT3_LABEL])
          .style({
              'max-width': (pictContainerWidth - pictMargin) / 2 + 'px',
              'max-height': pictContainerHeight + 'px',
              'margin-right': pictMargin + 'px',
              'margin-top': pictMargin + 'px'
          })
          .on('click', function() {
              createPictPreview(spot[PICT3_LABEL]);
          })

        pictBox
          .append('img')
          .attr('id', 'picture4')
          .attr('src', spot[PICT4_LABEL])
          .style({
              'max-width': (pictContainerWidth - pictMargin) / 2 + 'px',
              'max-height': pictContainerHeight + 'px',
              'margin-top': pictMargin + 'px'
          })
          .on('click', function() {
              createPictPreview(spot[PICT4_LABEL]);
          })

        if (is2PictHeightsMax(results, pictContainerHeight)) {
            d3.select('#main-pict-box')
              .style({
                  'margin-right': '20px',
                  'display': 'inline-block'
              })

            d3.select('#picture1')
              .style('max-width', (pictContainerWidth * 0.75) / 2 - pictMargin + 'px')

            d3.select('#picture2')
              .style('max-width', (pictContainerWidth * 0.75) / 2 - pictMargin + 'px')

            d3.select('#sub-pict-box')
              .style('display', 'inline-block')

            d3.select('#picture3')
              .style({
                  'display': 'block',
                  'max-width': pictContainerWidth * 0.25 + 'px',
                  'max-height': (pictContainerHeight - 20) / 2 + 'px',
                  'margin-top': 0,
                  'margin-right': 0
              })

            d3.select('#picture4')
              .style({
                  'display': 'block',
                  'max-width': pictContainerWidth * 0.25 + 'px',
                  'max-height': (pictContainerHeight - 20) / 2 + 'px',
                  'margin-right': 0
              })

        } else {
            d3.select('#picture1')
              .style('max-height', pictContainerHeight * 0.75 + 'px')

            d3.select('#picture2')
              .style('max-height', pictContainerHeight * 0.75 + 'px')

            d3.select('#picture3')
              .style('max-height', (pictContainerHeight - pictMargin) * 0.25 + 'px')

            d3.select('#picture4')
              .style('max-height', (pictContainerHeight - pictMargin) * 0.25 + 'px')
        }
    })

    modalContent
      .append('div')
      .attr('id', 'close-button')
      .text('×')
      .on('click', function() {
          d3.select('#modal-content')
            .remove()
          d3.select('#modal-overlay')
            .remove()

          d3.select('.leaflet-control')
            .style('display', 'block')
      })

    d3.select(root)
      .append('div')
      .attr('id', 'modal-overlay')
}

var getPictSize = function(self) {
    var pictSize = { };
    pictSize.width = parseInt(d3.select(self).style('width'));
    pictSize.height = parseInt(d3.select(self).style('height'));
    return pictSize;          
}

var is2PictHeightsMax = function(pictArray, pictContainerHeight) {
    return pictArray[0].height == parseInt(pictContainerHeight) 
        && pictArray[1].height == parseInt(pictContainerHeight);
}

function createPictPreview(picture) {
    d3.select(root)
      .append('div')
      .attr('id', 'pict-overlay')

    d3.select(root)
      .append('div')
      .attr('id', 'preview-area')
      .text('click the picture to close')

    d3.select(root)
      .append('img')
      .attr('id', 'pict-preview')
      .attr('src', picture)
      .style({
          'max-width': root.clientWidth - 40 + 'px',
          'max-height': root.clientHeight - 50 + 'px'
      })
      .on('load', function() {
          var width = parseInt(
              d3.select('#pict-preview')
                .style('width')
              )

          var height = parseInt(
              d3.select('#pict-preview')
                .style('height')
              )

          if (width == parseInt(root.clientWidth) - 40) {
              setFullWidthPictPreview(height);

          } else {
              setFullHeightPictPreview(width);
          }
      })
      .on('click', function() {
          removePictPreview();
      })
}

var setFullWidthPictPreview = function(height) {
    d3.select('#preview-area')
      .style({
          'width': root.clientWidth - 40 + 'px',
          'height': height + 30 + 'px',
          'top': (root.clientHeight - height - 20) / 2 + 'px'
      })

    d3.select('#pict-preview')
      .style({
          'top': (root.clientHeight - height) / 2 + 10 + 'px'
      })
}

var setFullHeightPictPreview = function(width) {
    d3.select('#preview-area')
      .style({
          'width': width + 'px',
          'height': root.clientHeight - 20 + 'px',
          'left': (root.clientWidth - width - 20) / 2 + 'px'
      })

    d3.select('#pict-preview')
      .style({
          'left': (root.clientWidth - width) / 2 + 'px'
      })
}

var removePictPreview = function() {
    d3.select('#preview-area')
      .remove()
    d3.select('#pict-preview')
      .remove()
    d3.select('#pict-overlay')
      .remove()
}