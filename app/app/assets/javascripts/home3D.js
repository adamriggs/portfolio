//basics
var camera, scene, renderer;
var container;
var cameraDistance = 1000;
var cameraSpeed = .01;
var cameraHorzAngle = Math.PI / 2;
var cameraVertAngle = Math.PI / 2;

var directionalLight, hemisphereLight;
var pointLights = [];
var pointLightAngle = Math.PI / 2;

var cameraMove = true;
var mouseX, mouseY;

var animating = false;
var animationComplete = true;

//specifics
var texture, material, mesh;
var planeGeo=[], planeMat=[], planeMesh=[];
var backgroundPlane;
var namePlane;

//parameters
var backgroundPlaneW = 750;
var backgroundPlaneH = 750;

var namePlaneW = 200;
var namePlaneH = 40;



$(window).mousemove(function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
})

$(window).mouseenter(function(e) {
	//cameraMove = true;
})

$(window).mouseleave(function(e) {
	//cameraMove = false;
})

$(window).click(function(e) {
	//if (cameraMove) cameraMove = false;
	//else cameraMove = true;
/*
	if(animationComplete){
		animating = true;
		animationComplete = false;
		velocity = .01;
	}
*/
})


function init() {
	//debug("init()");
	container = document.createElement('div');
	document.body.appendChild(container);
	
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = cameraDistance;
	camera.position.y = 0;

	scene = new THREE.Scene();
	camera.lookAt(scene.position);

	renderer = new THREE.WebGLRenderer({
		antialias: false
	});
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	initScene();
	initLight();

	animate();
}

function initScene() {
	initBackground();
	initName();
	
}

function initBackground(){
	var backgroundPlaneTexture = THREE.ImageUtils.loadTexture("backgroundPlane.jpg");
	backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(backgroundPlaneW, backgroundPlaneH), new THREE.MeshBasicMaterial({
		map: backgroundPlaneTexture
	}));
	scene.add(backgroundPlane);
}

function initName(){
	var namePlaneTexture = THREE.ImageUtils.loadTexture("name-white.png");
	namePlane = new THREE.Mesh(new THREE.PlaneGeometry(namePlaneW, namePlaneH), new THREE.MeshBasicMaterial({
		map: namePlaneTexture,
		transparent: true
	}));
	scene.add(namePlane);
	namePlane.position.z = 100;
	namePlane.position.x = -200;
	namePlane.position.y = 200;
}

function initLight() {
	
}

function moveCamera(){
	camera.position.x = ($(window).width())/2 - mouseX;
	camera.position.y = ($(window).height())/2 - mouseY;
	
	camera.lookAt(scene.position);
}

function animate() {
	//debug("animate()");
	// if (cameraMove) {
	// 	cameraRotate(mouseX, mouseY);
	// }
	
	moveCamera();
	
	requestAnimationFrame(animate);
	render();
}

function render() {


	renderer.render(scene, camera);
}

/*
//this makes calls the animation loop
(function() {

	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];

	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {

		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];

	}

	if (window.requestAnimationFrame === undefined) {

		window.requestAnimationFrame = function(callback) {

			var currTime = Date.now(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;

		};

	}

	window.cancelAnimationFrame = window.cancelAnimationFrame ||
	function(id) {
		window.clearTimeout(id)
	};

}());
*/