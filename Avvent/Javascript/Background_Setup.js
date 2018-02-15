
const totalDots = 9;

//The Notice
var dot0 = {x:6, y:1, z:4};
var geo0, mat0, mesh0;

//pNous
var dot1 = {x:0, y:0, z:0};
var geo1, mat1, mesh1;

//All Updates
var dot2 = {x:2, y:-6, z:2};
var geo2, mat2, mesh2;

//Login From
var dot3 = {x:-1, y:-1, z:1};
var geo3, mat3, mesh3;

//Register Form
var dot4 = {x:3, y:7, z:3};
var geo4, mat4, mesh4;

//Post Update
var dot5 = {x:-8, y:-1, z:-3};
var geo5, mat5, mesh5;

//About us
var dot6 = {x:-4, y:7, z:4};
var geo6, mat6, mesh6;

//
var dot7 = {x:-3, y:-1, z:-4};
var geo7, mat7, mesh7;

//Recruitment
var dot8 = {x:-3, y:-2, z:-2};
var geo8, mat8, mesh8;

//Site showcase
var dot9 = {x:3, y:6, z:-2};
var geo9, mat9, mesh9;


//The position in front of the camera
var dotCameraFront = {x:0, y:0, z:25};
var geoCameraFront, matCameraFront, meshCameraFront;

//Start up variables
var camera, renderer, scene, controls, loader, brainMat;



window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
//initialize the engine
$(document).ready(function init() {

	//testing
	loader = new THREE.OBJLoader();

	brainMat = new THREE.MeshBasicMaterial({ color:0xffffff, wireframe: true});

	//Create the scene
	scene = new THREE.Scene();

	loader.load('../Avvent/obj/low-poly-brain.obj', function (object) {
		object.traverse( function ( child ) {
			if (child instanceof THREE.Mesh) {
				child.material = brainMat;
			}
		});

		object.scale.set(150,150,150);
		scene.add(object);
	});

	//Spawn in the dots

	for (var i = 0; i <= totalDots; i++) {
		window['geo' + i]= new THREE.SphereGeometry((Math.random()* 0.1)+ 0.2,20,20);
		window['mat' + i] = new THREE.MeshBasicMaterial({ color:0xffffff, wireframe: false});
		window['mesh' + i] = new THREE.Mesh(window['geo' + i], window['mat' + i]);
		scene.add(window['mesh' + i]);
		window['mesh' + i].position.set(window['dot' + i].x, window['dot' + i].y, window['dot' + i].z);
	}

	//Spawn in position in front of the camera
	geoCameraFront = new THREE.SphereGeometry(0.01,10,10);
	matCameraFront = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true});
	meshCameraFront = new THREE.Mesh(geoCameraFront, matCameraFront);
	meshCameraFront.position.set(dotCameraFront.x, dotCameraFront.y, -5);
	meshCameraFront.visible = false;


	//The camera of the scene
	camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 2, 1000);
	camera.position.z = 30;
	scene.add(camera);
	camera.add(meshCameraFront);

	//Rendering for the camera
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x2c3e50);

	var theDiv = document.getElementById("3D_Space");
	theDiv.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	
	generateParticles(80);
	animate();
	setTimeout(startPageAt, 500);
});

//Update the engine
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	controls.update();
}


//Make the dot move to infront of the camera
function GoToCenter(Ox, Oy, Oz, numDot) {
	//referencing back to the mesh var
	var objectMesh = window['mesh' + numDot];

	//From where the dot while begin
	var objectPos = {x: Ox, y:Oy, z:Oz};
	var objectScale = {x:1, y:1, z:1};

	//Get the world position of the point in front of the camera
	var vector = new THREE.Vector3();
	var vectorS = new THREE.Vector3(4,4,4);
	vector.setFromMatrixPosition( meshCameraFront.matrixWorld );

	//Tweening to that point and calling an update
	TweenLite.to(objectPos, 0.45, {x: vector.x, y:vector.y, z:vector.z, onUpdate: MoveCenter, onUpdateParams:[objectMesh, objectPos, numDot]});
	TweenLite.to(objectScale, 0.45, {ease: Bounce.easeIn, x: vectorS.x, y:vectorS.y, z:vectorS.z, onUpdate: ScaleCenter, onUpdateParams:[objectMesh, objectScale, numDot]});

	controls.autoRotate = false;
	controls.enabled = false;
	controls.enableDamping = false;
}


//The update that sets the dot's position in front of the camera
function MoveCenter(objectMesh, objectPos, numDot) {
	objectMesh.position.set(objectPos.x, objectPos.y, objectPos.z);
}
function ScaleCenter(objectMesh, objectScale, numDot) {
	objectMesh.scale.set(objectScale.x, objectScale.y, objectScale.z);
}


//Moving from the camera to the dot's original position
function GoToOrigin(Ox, Oy, Oz, numDot) {
	//referencing back to the mesh var
	var objectMesh = window['mesh' + numDot];

	var objectScale = {x:4, y:4, z:4};

	//Getting the current position of the dot then moving it to origin
	var objectPos = {x: objectMesh.position.x, y:objectMesh.position.y, z:objectMesh.position.z};
	setTimeout( function(e) {
		TweenLite.to(objectPos, 0.5, {x: Ox, y:Oy, z:Oz, onUpdate: MoveOrigin, onUpdateParams:[objectMesh, objectPos, numDot]});
		TweenLite.to(objectScale, 0.5, {x:1, y:1, z:1, onUpdate: ScaleOrigin, onUpdateParams:[objectMesh, objectScale, numDot]});
	}, 450 )


	controls.autoRotate = true;
	controls.enabled = true;
	controls.enableDamping = true;
}

//The update that sets the dot's position at it's origin
function MoveOrigin(objectMesh, objectPos, numDot) {
	objectMesh.position.set(objectPos.x, objectPos.y, objectPos.z);
}
function ScaleOrigin(objectMesh, objectScale, numDot) {
	objectMesh.scale.set(objectScale.x, objectScale.y, objectScale.z);
}

function generateParticles(count) {
	var particles, pMaterial,
		p, pX, pY, pZ,
		particle,
		particleSystem,
		range;

	particles = new THREE.Geometry();
	pMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		size: 0.02 + Math.random() * 0.08
	});
	range = 40;

	for (p = 0; p < count; p++) {
		pX = Math.random() * range - range / 2;
		pY = Math.random() * range - range / 2;
		pZ = Math.random() * range - range / 2;
		particle = new THREE.Vector3(pX, pY, pZ);

		particles.vertices.push(particle);
	}

	particleSystem = new THREE.Points(particles, pMaterial);
	scene.add(particleSystem);

	return particleSystem;

	} 

/*Start everything*/