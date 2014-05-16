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

var mouseOver = true;

//specifics
var backgroundPlane;
var namePlane;
var shadowPlane;

//parameters
var backgroundPlaneW;
var backgroundPlaneH;

var namePlaneW;
var namePlaneH;

var shadowPlaneW;
var shadowPlaneH;

var projectPlaneW;
var projectPlaneH;
var projectPlaneArray = [];

var projectArray = [];



$(window).mousemove(function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	
	//mouseOver = true;
});

/*
$(window).mouseenter(function(e) {
	//mouseOver = true;
});

$(window).mouseleave(function(e) {
	//mouseOver = false;
});
*/

$(window).mouseOver(function(e) {
	mouseOver = true;
});

$(window).mouseOut(function(e) {
	mouseOver = false;
});

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
});


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
	initPortfolio();
	
}

function initBackground(){
	//propertion is 1024x800
	backgroundPlaneW = 1024;
	backgroundPlaneH = 800;
	
	var backgroundPlaneTexture = THREE.ImageUtils.loadTexture("backgroundPlane.jpg");
	
	backgroundPlane = new THREE.Mesh(new THREE.PlaneGeometry(backgroundPlaneW, backgroundPlaneH), new THREE.MeshBasicMaterial({
		map: backgroundPlaneTexture
	}));
	
	scene.add(backgroundPlane);
}

function initName(){

	//name
	//proportion is 493/99
	namePlaneW = 300;
	namePlaneH = 60;
	
	var namePlaneTexture = THREE.ImageUtils.loadTexture("name-white.png");
	
	namePlane = new THREE.Mesh(new THREE.PlaneGeometry(namePlaneW, namePlaneH), new THREE.MeshBasicMaterial({
		map: namePlaneTexture,
		transparent: true
	}));
	
	scene.add(namePlane);
	
	namePlane.position.z = 100;
	namePlane.position.x = -200;
	namePlane.position.y = 200;
	
	//shadow
	//proportion is 634/153
	shadowPlaneW = 500;
	shadowPlaneH = 121;
	
	var shadowPlaneTexture = THREE.ImageUtils.loadTexture("name-shadow.png");
	
	shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(shadowPlaneW, shadowPlaneH), new THREE.MeshBasicMaterial({
		map: shadowPlaneTexture,
		transparent: true
	}));
	
	scene.add(shadowPlane);
	
	shadowPlane.position.z = 10;
	shadowPlane.position.x = -200;
	shadowPlane.position.y = 200;
}

function initPortfolio(){
	projectPlaneW = 192;
	projectPlaneH = 144;
	
	var len = projectArray.length;
	
	for( var i = 0; i< len; i++){
		var tex = THREE.ImageUtils.loadTexture(projectArray[i].thumb.toString());
	
		var projectPlane = new THREE.Mesh(new THREE.PlaneGeometry(projectPlaneW, projectPlaneH), new THREE.MeshBasicMaterial({
			map: tex
		}));
		
		projectPlaneArray.push(projectPlane);
		
		scene.add(projectPlane);
	}
}

function initLight() {
	
}

function moveCamera(){
	//move the camera
	camera.position.x = ($(window).width())/2 - mouseX;
	camera.position.y = ($(window).height())/2 - mouseY;
	
	//move the shadow
	shadowPlane.position.x = (-camera.position.x*.13) - 200;
	shadowPlane.position.y = (-camera.position.y*.13) + 220;
	
	//aim the camera
	camera.lookAt(scene.position);
}

function animate() {
	if(mouseOver){
		
		moveCamera();
		
		requestAnimationFrame(animate);
		render();
	}
}

function render() {
	renderer.render(scene, camera);
}