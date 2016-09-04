/*# config = {
  shim: {
    'jThree': { deps: ['jquery-with-global'] },
    'jThree.Trackball': { deps: ['jThree'] },
    'jThree.MMD': { deps: ['jThree'] }
  }
} */
//# require=jThree.Trackball,jThree.MMD

'use strict';

jThree.goml('index.goml', function(j3) {
  j3.MMD.play(true);
  j3.Trackball();

  reload();
});

function update(data) {
  var list = data.transpose().toList({header: ['name', 'value'], typed: true});

  jThree('scene mmd').remove();

  list.forEach(function (d, i) {
    var mmd = jThree('<mmd id="" model="#miku" motion="#run" style=""></mmd>');
    mmd.css('positionX', i * 2);
    mmd.css('positionY', d.value);
    mmd.css('scale', '0.2 0.2 0.2');
    jThree('scene').append(mmd);
  });
}
