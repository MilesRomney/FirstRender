var cubes = [];

var isChrome = /chrome/.test( navigator.userAgent.toLowerCase() );

function disableAllCubes(){
  $.each( cubes, function( i, cube ){
    cube.disable();
  });
}

function toggleRender(which) {
  disableAllCubes();
  $('.canvas').hide();
  $('#menu .item').removeClass('selected');
  switch(which) {
    case 'canvas':
      $('#render-canvas').show();
      cubes[0].enable();      
      $('#menu .a-canvas').addClass('selected');
      break;
    case 'webgl':
      $('#render-webgl').show();
      if ( isChrome ) cubes[1].enable();
      $('#menu .a-webgl').addClass('selected');
      break;
    case 'video':
      $('#menu .a-video').addClass('selected');
      $('#render-video').show();
      break;
  }
}

var scale = 50;
var shift = scale * 3 / 2;

var SomaObj = function( isWebGL ){
  var self = this;

  THREE.Object3D.call( this );
  
  this.cube = function( x,y,z,wx,wy,wz ){
    if(isWebGL) {
      var material = new THREE.MeshLambertMaterial( { color: this.color } );
      
      var materials = [];
    
      for ( var i = 0; i < 6; i ++ ) {
        materials.push( new THREE.MeshBasicMaterial( { color: this.color + i*20 } ) );
      }
    } else {
      var material = new THREE.MeshFaceMaterial( { color: this.color } );
      
      var materials = [];
    
      for ( var i = 0; i < 6; i ++ ) {
        color = i < 3 ? this.color : this.highlightColor;
        materials.push( new THREE.MeshBasicMaterial( { color: color } ) );
      }
    }

    var geometry = new THREE.CubeGeometry( scale*(wx||1), scale*(wy||1), scale*(wz||1), null, null, null, materials );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.overdraw = true;
    mesh.position.x = x*scale;
    mesh.position.y = y*scale;
    mesh.position.z = z*scale;
    self.addChild( mesh );
  }
}
SomaObj.prototype = new THREE.Object3D();

var Soma4T = function ( isWebGL ) {
  // Light blue
  this.color = 0x549ed1;
  this.highlightColor = 0x9bd6ff;
  SomaObj.call( this );
  this.cube( 0, 0, 0, 3 );
  this.cube( 0, 0, 1 );
}
Soma4T.prototype = new SomaObj;

var Soma3L = function ( isWebGL ) {
  // Green
  this.color = 0x138500;
  this.highlightColor = 0x3dd623;
  SomaObj.call( this );
  this.cube( 0, 0, 1 );
  this.cube( -.5, 0, 0, 2 );
}
Soma3L.prototype = new SomaObj;

var Soma4S = function ( isWebGL ) {
  // Yellow
  this.color = 0xffaa00;
  this.highlightColor = 0xffd88a;
  SomaObj.call( this );
  this.cube( 0, 0, 0, 2 );
  this.cube( 1, 0, 1, 2 );
}
Soma4S.prototype = new SomaObj;

var Soma4L = function ( isWebGL ) {
  // Red
  this.color = 0xc30000;
  this.highlightColor = 0xfa5353;
  SomaObj.call( this );
  this.cube( 0, 0, 0, 3 );
  this.cube( 1, 0, 1 );
}
Soma4L.prototype = new SomaObj;

var Soma4LS = function ( isWebGL ) {
  // White
  this.color = 0xc8c8c8;
  this.highlightColor = 0xffffff;
  SomaObj.call( this );
  this.cube( 0, 0, 0, 2 );
  this.cube( 0.5, 1, -0.5, 1, 1, 2 );
}
Soma4LS.prototype = new SomaObj;

var Soma4RS = function ( isWebGL ) {
  // Purple/pink
  this.color = 0xb800c3;
  this.highlightColor = 0xef42f9;
  SomaObj.call( this );
  this.cube( 0, 0, 0, 2 );
  this.cube( 0.5, 1, 0.5, 1, 1, 2 );
}
Soma4RS.prototype = new SomaObj;

var Soma4B = function ( isWebGL ) {
  // Dark blue
  this.color = 0x000be7;
  this.highlightColor = 0x3640ff;
  SomaObj.call( this );
  this.cube( 0, -.5, 0, 1, 2 );
  this.cube( 1, 0, 0 );
  this.cube( 0, 0, 1 );
}
Soma4B.prototype = new SomaObj;

var SomaCube = function( el, width, height, isWebGL ){

  this.state = '';
  this.idx = 0;
  this.camera = null;
  this.renderer = null;
  this.scene = null;
  this.isActive = false;
  
  this.renderer = isWebGL ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
  this.renderer.setSize( width, height );
  el.get(0).appendChild( this.renderer.domElement );

  this.camera = new THREE.Camera( 45, width / height, -2000, 1000 );
  this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( -width/2, height/2, height/2, -height/2, -2000, 1000 );
  this.camera.position.x = 200;
  this.camera.position.y = 50;
  this.camera.position.z = 200;

  this.scene = new THREE.Scene();
  
  // Soma pieces
  var soma4B = new Soma4B( isWebGL );
  soma4B.rotation.x = -Math.PI / 180 * 90;
  this.scene.addObject( soma4B );
  
  var soma3L = new Soma3L( isWebGL );
  soma3L.position.y = scale * 1;
  soma3L.position.x = scale * 1;
  soma3L.position.z = scale * 1;
  soma3L.rotation.x = Math.PI / 180 * 90;
  soma3L.rotation.z = Math.PI / 180 * 90;
  this.scene.addObject( soma3L );

  var soma4L = new Soma4L( isWebGL );
  soma4L.position.z = 1 * scale;
  soma4L.position.x = 2 * scale;
  soma4L.rotation.z = -Math.PI / 180 * 90;
  soma4L.rotation.x = -Math.PI / 180 * 90;
  this.scene.addObject( soma4L );
  
  var soma4RS = new Soma4RS( isWebGL );
  soma4RS.position.y = 0;
  soma4RS.position.z = 2 * scale;
  soma4RS.position.x = .5 * scale;
  soma4RS.rotation.y = Math.PI;
  this.scene.addObject( soma4RS );
  
  var soma4S = new Soma4S( isWebGL );
  soma4S.position.y = 1 * scale;
  soma4S.position.x = 2 * scale;
  soma4S.position.z = .5 * scale;
  soma4S.rotation.x = Math.PI / 180 * 90;
  soma4S.rotation.y = Math.PI;
  soma4S.rotation.z = Math.PI / 180 * 90;
  this.scene.addObject( soma4S );
  
  var soma4LS = new Soma4LS( isWebGL );
  soma4LS.position.y = scale * 1.5;
  soma4LS.position.z = scale * 2;
  soma4LS.position.x = scale * 1;
  soma4LS.rotation.z = Math.PI / 180 * 90;
  this.scene.addObject( soma4LS );
  
  var soma4T = new Soma4T( isWebGL );
  soma4T.position.y = scale * 2;
  soma4T.position.x = scale * 1;
  this.scene.addObject( soma4T );

  // Lights

  var sun = new THREE.DirectionalLight( 0xffffff );
  sun.position = this.camera.position.clone();
  this.scene.addLight( sun );
  
  var ambientLight = new THREE.AmbientLight( 0xffffff );
  this.scene.addLight( ambientLight );

  this.soma = [
    {
      o: soma4T,
      dx: 0, dy: 1, dz: -1
    },
    {
      o: soma4LS,
      dx: 0, dy: 1, dz: 1
    },
    {
      o: soma4S,
      dx: 1, dy: 1, dz: 0
    },
    {
      o: soma4RS,
      dx: -1, dy: 1, dz: 0
    },
    {
      o: soma4L,
      dx: 1, dy: 0, dz: 0
    },
    {
      o: soma3L,
      dx: 0, dy: 0, dz: 1
    },
    {
      o: soma4B,
      dx: 0, dy: 0, dz: 0
    }
  ];
  
  for ( var i=0; i<this.soma.length; i++ ){
    this.soma[i].o.position.x = this.soma[i].o.position.x-shift;
    this.soma[i].o.position.z = this.soma[i].o.position.z-shift;
    this.soma[i].o.position.y = this.soma[i].o.position.y-60;
    this.soma[i].o.position.sx = this.soma[i].o.position.x;
    this.soma[i].o.position.sy = this.soma[i].o.position.y;
    this.soma[i].o.position.sz = this.soma[i].o.position.z;
  }

}

SomaCube.prototype.render = function(){
  var me = this;
  var timer = new Date().getTime();

  this.camera.position.x = Math.cos( timer * 0.0001 ) * 200;
  this.camera.position.z = Math.sin( timer * 0.0001 ) * 200;
  
  if ( this.state == 'explode' ){
    var obj = this.soma[this.idx];
    obj.o.position.x = obj.o.position.x + obj.dx;
    obj.o.position.y = obj.o.position.y + obj.dy;
    obj.o.position.z = obj.o.position.z + obj.dz;
    if ( Math.abs(obj.o.position.x) >= 150 || Math.abs(obj.o.position.y) >= 150 || Math.abs(obj.o.position.z) >= 150 ){
      if ( this.idx < this.soma.length-2 ){
        this.idx++;
      } else {
        this.state = '';
        setTimeout( function(){me.build();}, 5000 );
      }
    }
  } else if ( this.state == 'build' ){
    var obj = this.soma[this.idx];
    obj.o.position.x = obj.o.position.x - obj.dx;
    obj.o.position.y = obj.o.position.y - obj.dy;
    obj.o.position.z = obj.o.position.z - obj.dz;
    if ( obj.o.position.x == obj.o.position.sx && obj.o.position.z == obj.o.position.sz && obj.o.position.y == obj.o.position.sy ){
      if ( this.idx > 0 ){
        this.idx--;
      } else {
        this.state = '';
        setTimeout( function(){me.explode();}, 5000 );
      }
    }
  } else if ( this.state == 'pause' ){
    
  }

  if ( this.isActive ) this.renderer.render( this.scene, this.camera );
}

SomaCube.prototype.disable = function(){
  this.isActive = false;
}

SomaCube.prototype.enable = function(){
  this.isActive = true;
}

SomaCube.prototype.explode = function(){
  this.state = 'explode';
}

SomaCube.prototype.build = function(){
  this.state = 'build';
}

function animate(){
  requestAnimationFrame( animate );
  $.each( cubes, function( i, cube ){
    cube.render();
  });
}

function init() {
  cubes.push( new SomaCube( $('#render-canvas'), 500, 500, false ) );
  if ( isChrome ) cubes.push( new SomaCube( $('#render-webgl'), 500, 500, true ) );
  $.each( cubes, function( i, cube ){
    setTimeout( function(){cube.explode();}, 2000 );
  });
  animate();
  cubes[0].isActive = true;
  if ( isChrome ) toggleRender( 'webgl' );
}

flowplayer("player", {
    src: "swf/flowplayer.commercial-3.0.7.swf", 
    wmode:  "transparent"
 }, { 
    key: '#@1790383c99a001dd12a',
    logo: null,
    clip:  { 
        autoPlay: true,
        autoBuffering: true,
        onStart: function(){}
    }
});
