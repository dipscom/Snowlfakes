'use strict';

THREE.VolumetricSnow = function ( options ) {

  THREE.Object3D.apply( this, arguments )

  options = options || {}



  // TODO: Add an emitter rate
  // options.rate = options.rate || 100 // NOTE no influence at the moment
  this.totalParticles = 0
  this.maxParticles = options.maxParticles || 600
  // TODO: Change age to be in seconds but still only count down in frames
  this.maxAge = options.maxAge || 600 // in ticks / frames
  this.volume = options.volume || { w:15, h:15, d:15 }
  this.sprite = options.sprite || './textures/particle2.png'



  const s_map = new THREE.TextureLoader().load( this.sprite )
  // TODO: Add a toggle to use either a sprite or mesh
  // NOTE: Sprites do not show through other meshes, even transparent ones
  // this.s_mat = new THREE.SpriteMaterial( { map:s_map, color:0xffffff, transparent:true })
  this.s_mat = new THREE.MeshBasicMaterial( { map:s_map, color:0xffffff, transparent:true })

  this.s_geo = new THREE.CircleBufferGeometry( 0.2, 3 )



  this.random = function (min, max) {
    // return a number between two boundaries
    return Math.random() * ( max - min ) + min;
  }



  // TODO: Rename this to refer to the volume of the emitter
  this.randomVec3 = function (min, max) {
    // TODO: return a Vector3 out from the precalculated list
    // console.log('>>>', this.volume);
    return new THREE.Vector3( this.random(-this.volume.w*0.5,this.volume.w*0.5), this.random(-this.volume.h*0.5,this.volume.h*0.5), this.random(-this.volume.d*0.5,this.volume.d*0.5) )
  }



  // TODO: Separate newParticle contents from the emitter
  this.newParticle = function () {

    // TODO: Rename this to relate to the volume of the emitter
    const vec3 = this.randomVec3()

    // TODO: Add a toggle to use either a sprite or mesh
    // NOTE: Sprites do not show through other meshes, even transparent ones
    // const sprite = new THREE.Sprite( this.s_mat )
    const sprite = new THREE.Mesh( this.s_geo, this.s_mat )
    sprite.position.set( vec3.x, vec3.y, vec3.z )


    sprite.userData.acceleration = {
      x:0,
      y:0,
      z:0
    }

    // TODO try to have less calls to the random method. Maybe precalculate them and store
    sprite.userData.velocity = {
      x:this.random(-0.1,0.1),
      y:this.random(-0.01,-0.1),
      z:0
    }
    sprite.userData.age = 0
    // we're counting age on frame ticks
    sprite.userData.maxAge = this.maxAge // If maxAge is greater than maxParticles, we get a gap



    sprite.userData.reset = function () {

      // TODO: Rename this to relate to the volume of the emitter
      const _v3 = sprite.parent.randomVec3()
      // console.log('reset', sprite.userData);
      sprite.position.set( _v3.x, _v3.y, _v3.z )
      sprite.userData.age = 0;

      sprite.userData.velocity = {
        x:sprite.parent.random(-0.1,0.1),
        y:sprite.parent.random(-0.01,-0.1),
        z:0
      }

    }


    sprite.userData.tick = function ( time ) {
      // console.log('tick', this);
      sprite.userData.age++


      sprite.userData.acceleration.y = sprite.parent.random(-0.001, 0.001)
      // TODO: Change x movement to use sin/cos
      sprite.userData.acceleration.x = sprite.parent.random(-0.01, 0.01)


      sprite.userData.velocity.y = sprite.userData.velocity.y + sprite.userData.acceleration.y

      sprite.userData.velocity.x = sprite.userData.velocity.x + sprite.userData.acceleration.x


      sprite.position.y = sprite.position.y + sprite.userData.velocity.y
      sprite.position.x = sprite.position.x + sprite.userData.velocity.x


      if(sprite.userData.age >= sprite.userData.maxAge) {
        // console.log('Die!', sprite.parent);
        // sprite.parent.remove( sprite )
        sprite.userData.reset()

      }
    }

    // console.log(sprite);

    // TODO: Toggle to lock/unlock the particles relative to the emitter
    this.add( sprite )

  }





  this.update = function () {

    // TODO: Enable emitter rate per frame
    if(this.totalParticles <= this.maxParticles) {
      // console.log('[VolumetricSnow] update', this.totalParticles, this.maxParticles);
      this.newParticle()
      this.totalParticles++;
    }


    this.children.forEach(function (child) {
      if(child.userData.tick) {
        child.userData.tick()
      }
    })

  }





  this.resize = function (newVolume) {
    // NOTE: si there a better way to calculate this
    if(this.visualVolume) {
      this.visualVolume.scale.x = newVolume.w / this.volume.w
      this.visualVolume.scale.y = newVolume.h / this.volume.h
      this.visualVolume.scale.z = newVolume.d / this.volume.d
    }


    this.volume = newVolume

  }




  // Create a visual helper
  this.addHelper = function (color) {

    const _color = color || 0xFF00FF

    const v_geo = new THREE.BoxBufferGeometry( this.volume.w, this.volume.h, this.volume.d )
    const v_mat = new THREE.MeshBasicMaterial( {color:_color, wireframe:true} )


    this.visualVolume = new THREE.Mesh( v_geo, v_mat )

    this.add( this.visualVolume )

  }

}



// Define the prototype and constructor to be THREE's prototype and constructor
THREE.VolumetricSnow.prototype = Object.create( THREE.Object3D.prototype )
THREE.VolumetricSnow.prototype.constructor = THREE.VolumetricSnow
