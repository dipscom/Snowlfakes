window.addEventListener('resize', resize);





var target = document.querySelector('body');





var renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);





var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

camera.position.y = 10;
camera.position.z = 50;
camera.lookAt(new THREE.Vector3());




var controls = new THREE.OrbitControls(camera, renderer.domElement);





var scene = new THREE.Scene();




var gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080);

scene.add(gridHelper);



var initialVolume = {
  w: 16,
  h: 3,
  d: 16
}

var volumetricParticles = new THREE.VolumetricParticles({
  volume: initialVolume,
  // maxParticles:150,
  // maxAge: 1,
  // rate: 1
});

volumetricParticles.position.y = 18;

// Helper to visualise where the snowflakes are being created
volumetricParticles.addHelper(0x00FF00); // the color argument is optional. Only takes hexadecimal numbers

scene.add(volumetricParticles);



// One can resposition and resize the area of the emmiter
// just note that all particles will move with the volume area of the emitter
// setInterval(function () {
//   console.log("interval");
//   volumetricParticles.resize({
//     w:1,
//     h:1,
//     d:1
//   });
// }, 3000);



function resize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}





function render() {

  requestAnimationFrame(render);

  volumetricParticles.update();

  renderer.render(scene, camera);

}





function onInputChange(e) {

  // Only run if we have a valid updated value
  if (!this.value) return;

  var newVolume = {
    w: initialVolume.w,
    h: initialVolume.h,
    d: initialVolume.d
  }

  inputs.forEach(function(input) {

    var value = Number(input.value);

    // only run if the current input has a value
    if (!value || value <= 0) return;

    switch (input.name) {
      case "height":
        newVolume.h = value;
        break;
      case "width":
        newVolume.w = value;
        break;
      case "depth":
        newVolume.d = value;
        break;
      default:
    }
  });

  volumetricParticles.resize(newVolume);
}





var inputs = document.querySelectorAll('input');

inputs.forEach(function(input) {
  input.addEventListener('blur', onInputChange);
});


// Kick off
render();