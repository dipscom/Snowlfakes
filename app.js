var app = (function () {
  console.log('[app] init');


  var canvas = document.querySelector('canvas')


  var scene = new THREE.Scene(),
      renderer = new THREE.WebGLRenderer({canvas:canvas}),
      camera = new THREE.PerspectiveCamera(50, canvas.width/canvas.height, 1, 1000), // canvas.width and canvas.height are being defined in the html
      clock = new THREE.Clock(),
      tick = 0


  renderer.setPixelRatio(window.devicePixelRatio)


  camera.position.y = 10
  camera.position.z = 50
  camera.lookAt(new THREE.Vector3())


  var gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080)
      scene.add(gridHelper)


  // GPU particle system plugin by Charlie Hoey http://charliehoey.com
  var particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 3000
  })

  scene.add(particleSystem)

  var options = {
    position: new THREE.Vector3(0, 75, 0),
    positionRandomness: 75,
    velocity: new THREE.Vector3(0, -10, 0),
    velocityRandomness: .5,
    color: 0xffffff,
    colorRandomness: 0,
    turbulence: 0.025,
    lifetime: 20,
    size: 10,
    sizeRandomness: 1
  }

  var spawnerOptions = {
    spawnRate: 300,
    horizontalSpeed: 2.5,
    verticalSpeed: 1.33,
    timeScale: 1
  }


  TweenMax.to([camera.position], 3, {
    z:'-=50',
    ease:Power2.easeInOut,
    repeat:-1,
    repeatDelay:1,
    yoyo:true,
    onUpdate:render
  })


  function render() {

    var delta = clock.getDelta() * spawnerOptions.timeScale

    tick += delta

    if(tick < 0) tick = 0

    if(delta > 0) {
      for (var i = 0; i < spawnerOptions.spawnRate * delta; i++) {
        particleSystem.spawnParticle(options)
      }
    }

    particleSystem.update(tick)

    renderer.render(scene, camera)

  }

})()
