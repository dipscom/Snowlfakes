(function () {


  var target = document.querySelector( 'body' )



  window.addEventListener('resize', resize)


  var scene = new THREE.Scene(),
      renderer = new THREE.WebGLRenderer({canvas:canvas}),
      camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 150)





  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )





  camera.position.y = 10
  camera.position.z = 50
  camera.lookAt(new THREE.Vector3())





  var gridHelper = new THREE.GridHelper(400, 40, 0x0000ff, 0x808080)

  scene.add(gridHelper)





  var volumetricSnow = new THREE.VolumetricSnow({
    volume:{
      w:50,
      h:1,
      d:25
    }
  })

  volumetricSnow.position.y = 30
  
  // Helper to visualise where the snowflakes are being created
  // volumetricSnow.addHelper()

  scene.add( volumetricSnow )





  // One can resposition and resize the area of the emmiter
  // just note that all particles will move with the volume area of the emitter
  // setTimeout(function () {
  //   volumetricSnow.resize({
  //     w:1,
  //     h:1,
  //     d:1
  //   })
  //
  //   // volumetricSnow.position.x = -15
  //   // volumetricSnow.position.z = -150
  //
  // }, 3000)



  function resize() {

    console.log('resize');

    camera.aspect = window.innerWidth /window.innerHeight
    camera.updateProjectionMatrix()


    renderer.setSize( window.innerWidth, window.innerHeight )

  }





  function render() {

    volumetricSnow.update()


    renderer.render(scene, camera)

    requestAnimationFrame(render)

  }




  // Kick off
  render();



})();
