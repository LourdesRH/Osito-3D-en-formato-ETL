import * as THREE from '../src/three.module.js';  //importamos las paqueterias que estan en el src
import Stats from '../src/stats.module.js'; //importamos las paqueterias que estan en el src
import { STLLoader } from '../src/STLLoader.js'; //importamos las paqueterias que estan en el src

let container, stats;
let camera, cameraTarget, scene, renderer;
    init();
    animate();

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	//cercania de la camara, 35 es cerca pero se mira bien
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 15 );
	camera.position.set( 3, 0.15, 3);
	cameraTarget = new THREE.Vector3( 0, - 0.25, 0 );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x72455b ); //color de la pared de enfrente
	scene.fog = new THREE.Fog( 0x72455b, 8, 15 ); //color de la sombra entre la pared y el piso

	// Ground
	const plane = new THREE.Mesh(
		new THREE.PlaneGeometry( 40, 40 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010 } )
	);
	plane.rotation.x = - Math.PI / 2;
	plane.position.y =  - 0.6; //posision de las figuras con el suelo
	scene.add( plane );
	plane.receiveShadow = true;

	
	// figura del circulito
	const loader = new STLLoader();
	loader.load( '../model/panda_t.stl', function ( geometry ) {		
		const material = new THREE.MeshPhongMaterial( 
			//color verdecito 
			{ color: 0x484030, specular: 0x111111, shininess: 200 } );
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( 0, - 0.25, 0.6 );
		mesh.rotation.set( 4.7, 0 ,-2 ); //rotar osito
		mesh.scale.set( 0.03, 0.03, 0.03 ); //hacer mas chiquito el osito para que se aprecie

		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add( mesh );
	} );
	

// Lights
scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
addShadowedLight( 0.5, 1, - 1, 0xffaa00, 1 );
// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	container.appendChild( renderer.domElement );
	// stats
	stats = new Stats();
	container.appendChild( stats.dom );
	//
	window.addEventListener( 'resize', onWindowResize );
}
function addShadowedLight( x, y, z, color, intensity ) {
	const directionalLight = new THREE.DirectionalLight( color, intensity );
	directionalLight.position.set( x, y, z );
	scene.add( directionalLight );
	directionalLight.castShadow = true;
	const d = 1;
	directionalLight.shadow.camera.left = - d;
	directionalLight.shadow.camera.right = d;
	directionalLight.shadow.camera.top = d;
	directionalLight.shadow.camera.bottom = - d;
	directionalLight.shadow.camera.near = 1;
	directionalLight.shadow.camera.far = 4;
	directionalLight.shadow.bias = - 0.002;
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	render();
	stats.update();
}
function render() {
	const timer = Date.now() * 0.0005; //velocidad de las vueltas
	camera.position.x = Math.cos( timer ) * 3;
	camera.position.z = Math.sin( timer ) * 3;
	camera.lookAt( cameraTarget );
	renderer.render( scene, camera );
}