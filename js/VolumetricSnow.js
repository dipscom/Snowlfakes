'use strict';

THREE.VolumetricParticles = function ( options ) {

  THREE.Object3D.apply( this, arguments );

  options = options || {};


  this.clock = new THREE.Clock(); // NOTE: no influence at the moment
  this.second = 0; // NOTE: no influence at the moment


  this.rate = options.rate || 1;
  this.worldParticles = new THREE.Group();
  this.totalParticles = 0;
  this.maxParticles = options.maxParticles || 500;
  // TODO: Change age to be in seconds but still only count down in frames
  this.maxAge = options.maxAge || 6;
  this.volume = options.volume || { w:1, h:1, d:1 };
  this.sprite = options.sprite || './textures/particle2.png';



  const s_map = new THREE.TextureLoader().load( this.sprite );
  // NOTE: Sprites seem not show through other meshes, even transparent ones
  this.s_mat = new THREE.SpriteMaterial( { map:s_map, color:0xffffff, transparent:true });



  this.random = function ( min, max ) {
    // return a number between two boundaries
    return Math.random() * ( max - min ) + min;
  }



  this.getPointWithinVolume = function () {

    // TODO: maybe return a Vector3 out from the precalculated list
    // console.log('>>>', this.volume);
    return new THREE.Vector3(
      this.random( -this.volume.w * 0.5, this.volume.w * 0.5 ),
      this.random( -this.volume.h * 0.5, this.volume.h * 0.5 ),
      this.random( -this.volume.d * 0.5, this.volume.d * 0.5 )
    );

  }

  // console.log(this.parent, this);

  // TODO: Separate newParticle contents from the emitter
  // this.newParticle = function () {
  //
  //   this.totalParticles++;
  //
  //   if( this.totalParticles >= this.maxParticles ) {
  //     console.log('enough particles', this);
  //     const that = this;
  //     clearInterval( this.interval );
  //   }
  //
  //   // TODO: Rename this to relate to the volume of the emitter
  //   // const vec3 = this.randomVec3()
  //
  //   // TODO: Add a toggle to use either a sprite or mesh
  //   // NOTE: Sprites do not show through other meshes, even transparent ones
  //   // const sprite = new THREE.Sprite( this.s_mat )
  //   const sprite = new THREE.Mesh( this.s_geo, this.s_mat );
  //   sprite.position.set( vec3.x, vec3.y, vec3.z );
  //
  //
  //   sprite.userData.acceleration = {
  //     x:0,
  //     y:0,
  //     z:0
  //   };
  //
  //   // TODO try to have less calls to the random method. Maybe precalculate them and store
  //   sprite.userData.velocity = {
  //     x:this.random( -0.1, 0.1 ),
  //     y:this.random( -0.01, -0.1 ),
  //     z:0
  //   }
  //   sprite.userData.age = 0
  //   // we're counting age on frame ticks
  //   sprite.userData.maxAge = this.maxAge // If maxAge is greater than maxParticles, we get a gap
  //
  //
  //   // NOTE: Don't automatically recycle the particle, just kill it
  //   sprite.userData.reset = function () {
  //
  //     // TODO: Rename this to relate to the volume of the emitter
  //     const _v3 = sprite.parent.randomVec3();
  //     // console.log('reset', sprite.userData);
  //     sprite.position.set( _v3.x, _v3.y, _v3.z );
  //     sprite.userData.age = 0;
  //
  //     sprite.userData.velocity = {
  //       x:sprite.parent.random( -0.1, 0.1 ),
  //       y:sprite.parent.random( -0.01, -0.1 ),
  //       z:0
  //     };
  //
  //   }
  //
  //
  //   sprite.userData.tick = function ( time ) {
  //     // console.log('tick', this);
  //     sprite.userData.age++
  //
  //
  //     sprite.userData.acceleration.y = sprite.parent.random( -0.001, 0.001 );
  //     // TODO: Change x movement to use sin/cos
  //     sprite.userData.acceleration.x = sprite.parent.random( -0.01, 0.01 );
  //
  //
  //     sprite.userData.velocity.y = sprite.userData.velocity.y + sprite.userData.acceleration.y;
  //     sprite.userData.velocity.x = sprite.userData.velocity.x + sprite.userData.acceleration.x;
  //
  //
  //     sprite.position.y = sprite.position.y + sprite.userData.velocity.y;
  //     sprite.position.x = sprite.position.x + sprite.userData.velocity.x;
  //
  //
  //     if( sprite.userData.age >= sprite.userData.maxAge ) {
  //       // console.log('Die!', sprite.parent);
  //       // sprite.parent.remove( sprite )
  //       sprite.userData.reset();
  //
  //     }
  //   }
  //
  //   // console.log(sprite);
  //
  //   // TODO: Toggle to lock/unlock the particles relative to the emitter
  //   this.add( sprite )
  //
  // },




  this.spawn = function () {

    for (var i = 0; i < this.rate; i++) {

      if( this.totalParticles < this.maxParticles ) {

        const p = new THREE.VolumetricParticle(
          {
            material: this.s_mat,
            volume: this.volume,
            position: this.getPointWithinVolume(),
            age: this.maxAge
          }
        );

        this.add( p );

        ++this.totalParticles;

      } else {

        break;

      }

    }

  },



  this.dispose = function ( particle ) {

    this.remove( particle );

    --this.totalParticles;

  },




  this.update = function () {

    this.spawn();

    this.children.forEach( child => {

      if( child.update ) {

        child.update(
          new THREE.Vector3(
            this.random( -0.005, 0.005 ),
            this.random( -0.0015, 0.001),
            this.random( -0.005, 0.005 )
          )
        );

      };

    });

  }



  this.resize = function ( newVolume ) {

    this.volume = newVolume;

    if( this.visualVolume ) {

      this.remove( this.visualVolume );

      this.addHelper( this.helperColor );

    }

  }



  // Create a visual helper
  this.addHelper = function ( color ) {

    this.helperColor = color || 0xFF00FF;

    const v_geo = new THREE.BoxBufferGeometry( this.volume.w, this.volume.h, this.volume.d );
    const v_mat = new THREE.MeshBasicMaterial( { color:this.helperColor, wireframe:true } );

    this.visualVolume = new THREE.Mesh( v_geo, v_mat );

    this.add( this.visualVolume );

  }

}


// Define the prototype and constructor to be THREE's prototype and constructor
THREE.VolumetricParticles.prototype = Object.create( THREE.Object3D.prototype );
THREE.VolumetricParticles.prototype.constructor = THREE.VolumetricParticles;






THREE.VolumetricParticle = function ( options ) {

  THREE.Object3D.apply( this, arguments );

  if(!options) {
    console.error("Please provide a set of options");
    return;
  }

  this.add( new THREE.Sprite( options.material ) );

  // console.log('volumetricParticles', options.pos || new THREE.Vector3());
  this.position.set( options.position.x, options.position.y, options.position.z );
  this.velocity = options.vel || new THREE.Vector3();
  this.acceleration = options.acc || new THREE.Vector3(0, -0.0025, 0);
  this.age = ( options.age || 3 ) * 60; // expected fps is 60


  this.update = function ( vector3 ) {

    if( this.age === 0 ) {

      this.die();

      return;

    }

    if( vector3 ) {
      this.acceleration = vector3;
    }

    this.velocity.add( this.acceleration );
    this.position.add( this.velocity );

    this.age--;
  }



  this.die = function () {

    this.parent.dispose( this );

  }

  return this;

}


THREE.VolumetricParticle.prototype = Object.create( THREE.Object3D.prototype )
THREE.VolumetricParticle.prototype.constructor = THREE.VolumetricParticle
