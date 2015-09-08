/*# config = {
  shim: {
	  'jThree': { deps: ['jquery-with-global'] },
		'jThree.Trackball': { deps: ['jThree'] },
		'jThree.MMD': { deps: ['jThree'] }
	}
} */
//# require=jThree.Trackball,jThree.MMD

jThree.goml('index.goml', function(j3) {
	j3.MMD.play(true);
	j3.Trackball();

	reload();
});

function update(data) {
  var list = data.transpose().toList({header: ['name', 'value'], typed: true});

  jThree('scene .value').remove();

  list.forEach(function (d, i) {
	  var newmesh = jThree('<mesh class="value" geo="#geo1" mtl="#mtl1"></mesh>');
		newmesh.attr('id', d.name);
	  newmesh.css('positionX', i * 2 + 4);
	  newmesh.css('positionY', d.value);
	  jThree('scene').append(newmesh);
	});
}
