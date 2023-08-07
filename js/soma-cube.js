import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js';
    
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.jsdelivr.net/npm/three@0.114/examples/jsm/loaders/RGBELoader.js';

var container, controls;
var camera, scene, renderer, mixer, clock , model;

init();
animate();

function init() {

  container = document.getElementById( 'interactive-soma-cube' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
  camera.position.z = 10;
      camera.position.x = 10;
      camera.position.y = 5;

  scene = new THREE.Scene();
  
  clock = new THREE.Clock();

  new RGBELoader()
    .setDataType( THREE.UnsignedByteType )
    .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
    .load( 'royal_esplanade_1k.hdr', function ( texture ) {

      var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();

      // model

  
      var loader = new GLTFLoader();
      loader.load( '\soma-cube4.glb', function ( gltf ) {
        model = gltf.scene;
        model.position.setY(0);
        model.position.setX(-1);
        model.position.setZ(-0);
        model.rotation.x = Math.PI / 2;
        model.scale.set(0.5, 0.5, 0.5);

        scene.add(model );

        mixer = new THREE.AnimationMixer( gltf.scene );
        
        gltf.animations.forEach( ( clip ) => {
          
            mixer.clipAction( clip ).play();
          
        } );

      } );

    } );

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( (window.innerWidth * 0.6), (window.innerHeight * 0.6) );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );

  var pmremGenerator = new THREE.PMREMGenerator( renderer );
  pmremGenerator.compileEquirectangularShader();

  controls = new OrbitControls( camera, renderer.domElement );
  controls.minDistance = 2;
  controls.maxDistance = 10
  controls.target.set( 0, 0, - 0.2 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {
  
  requestAnimationFrame( animate );
  
  var delta = clock.getDelta();
  
  if ( mixer ) mixer.update( delta );

  renderer.render( scene, camera );

}
