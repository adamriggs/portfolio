//basics
var camera, scene, renderer;
var container;
var cameraDistance = 100;
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
	if(animationComplete){
		animating = true;
		animationComplete = false;
		velocity = .01;
	}
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
	
/*
	var loader = new THREE.JSONLoader();
	loader.load("obj/minion/minion.js", buildModel);
	
	var handLoader = new THREE.JSONLoader();
	handLoader.load("obj/hand.js", buildHand);
*/
	
/*
	var geo = new THREE.SphereGeometry(2);
	var mat = new THREE.MeshBasicMaterial({color: 0xa4a4a4, wireframe: true});
	fingertip = new THREE.Mesh(geo,mat);
	scene.add(fingertip);
	fingertip.position.x =50;
*/

}

function initLight() {

}

function animate() {
	//debug("animate()");
	// if (cameraMove) {
	// 	cameraRotate(mouseX, mouseY);
	// }
	
	
/*
	if(animating && modelCollapsed == false){
		collapseModel(velocity);
		velocity *= acceleration;
		particleSystem.geometry.verticesNeedUpdate = true;
	}
	
	if(animating && modelCollapsed){
		raiseModel(velocity);
		velocity *= acceleration;
		particleSystem.geometry.verticesNeedUpdate = true;
	}
	
	frame = leap.frame();
	
	if(frame && frame.fingers && frame.fingers.length>0){
		
		fingertip.position.x = frame.fingers[0].tipPosition[0];
		fingertip.position.y = frame.fingers[0].tipPosition[1]/200;
		fingertip.position.z = frame.fingers[0].tipPosition[2];
	
		//debug(fingertip.position.x +", " +fingertip.position.y +", " + fingertip.position.z);
		//debug(frame.fingers[0].tipPosition.x +", " + frame.fingers[0].tipPosition.y +", " + frame.fingers[0].tipPosition.z);
		//debug(frame.fingers[0].tipPosition);
		
	}
	
	checkCollision();
*/
	
	requestAnimationFrame(animate);
	render();
}

function render() {


	renderer.render(scene, camera);
}

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