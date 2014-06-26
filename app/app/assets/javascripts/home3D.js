
//************************
//
//	VARIABLES 
//
//************************

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
var mouseX = ($(window).width())/2;
var mouseY = ($(window).height())/2;

var animating = false;
var animationComplete = true;

var mouseOver = true;
var planesScrolling = false;
var planesAdvance = false;
var planesAdvanceIndex = -1;
var planeRate = 0;

var projector;
var mouse_vector;
var mouse;
var ray;
var intersects;

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

var projectPlaneW = 192;
var projectPlaneH = 144;
var projectPlaneArray = [];

var projectArray = [];

var planeZSpacer = 200;

var topScrollArea_top = 0;
var topScrollArea_bottom = ($(window).height()/2)-100;

var bottomScrollArea_top = ($(window).height()/2)+100;
var bottomScrollArea_bottom = $(window).height();

var infoCard;


//************************
//
//	EVENTS
//
//************************

$(window).on("mousemove", function(e) {
	mouseX = e.pageX;
	mouseY = e.pageY;
	
	if(mouseX > 900 && mouseX < 1150 && planesAdvance===false){
		planesScrolling = true;
		if(mouseY > topScrollArea_bottom){
			//console.log("*****TOP AREA");
			planeRate = bottomScrollArea_bottom / (bottomScrollArea_bottom - mouseY);
			planeRate*=-1;
			if(planeRate < -10){planeRate = -10;}
			//console.log("planeRate=="+planeRate);
		}else if(mouseY < bottomScrollArea_top){
			//console.log("*****BOTTOM AREA");
			planeRate = bottomScrollArea_top / mouseY;
			if(planeRate > 10){planeRate = 10;}
			//console.log("planeRate=="+planeRate);
		} else {
			planesScrolling = false;
			planeRate = 0;
		}
	} else {
		planesScrolling = false;
		planeRate = 0;
	}
});

/*
$(window).mouseenter(function(e) {
	//mouseOver = true;
});

$(window).mouseleave(function(e) {
	//mouseOver = false;
});
*/

$(window).on("mouseOver", function(e) {
	mouseOver = true;
});

$(window).on("mouseOut", function(e) {
	mouseOver = false;
});

$(window).on("click", function(e) {
	
});

function onMouseDown(event_info){
	//console.log("onMouseDown()");
	event_info.preventDefault();
	
	var planeClick = false;
	var planeIndex = -1;
	var infoCardClick = false;
	var infoCardControlsAboutClick = false;
	var infoCardControlsPortfolioClick = false;
	
	intersects = [];
	//console.log(intersects.length);
	
	mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;
    
    //this vector caries the mouse click cordinates
    mouse_vector.set( mouse.x, mouse.y, mouse.z );
    
    //the final step of the transformation process, basically this method call
    //creates a point in 3d space where the mouse click occurd
    projector.unprojectVector( mouse_vector, camera );
    
    var direction = mouse_vector.sub( camera.position ).normalize();
    
    //ray = new THREE.Raycaster( camera.position, direction );
    ray.set( camera.position, direction );
    
    //asking the raycaster if the mouse click touched anything
    var len = projectPlaneArray.length;
    var i=0;
    for(i=0; i<len; i++){
    	var touch = ray.intersectObject(projectPlaneArray[i].mesh);
    	if(touch.length > 0){
	    	intersects = touch;
	    	planeClick = true;
	    	planeIndex = i;
	    } 
    }
    
    var infoCardTouch = ray.intersectObject(infoCard.mesh, true);
    if(infoCardTouch.length > 0){
	    intersects = infoCardTouch;
	    infoCardClick = true;
    }
    
    var infoCardControlsAboutTouch = ray.intersectObject(infoCardControls.meshAbout, true);
    if(infoCardControlsAboutTouch.length > 0){
	    intersects = infoCardControlsAboutTouch;
	    infoCardControlsAboutClick = true;
    }
    
    var infoCardControlsPortfolioTouch = ray.intersectObject(infoCardControls.meshPortfolio, true);
    if(infoCardControlsPortfolioTouch.length > 0){
	    intersects = infoCardControlsPortfolioTouch;
	    infoCardControlsPortfolioClick = true;
    }

    
    //the ray will return an array with length of 1 or greater if the mouse click
    //does touch anything
    if( intersects.length>0) {
        //console.log(intersects[0].object.data);
       //console.log( "hit" );
        
    }
    
    if(planeClick){
	    //updateInfoCard(intersects[0].object.data);
	    infoCard.switchProjects(intersects[0].object.data, planeIndex);
	    planesAdvance = true;
	    planesAdvanceIndex = planeIndex;
    }
    
    if(infoCardClick){
	    //console.log("infoCardClick");
	    infoCard.onClick(intersects[0].point);
    }
    
    if(infoCardControlsAboutClick){
	    infoCardControls.onClick('about');
    }
    
    if(infoCardControlsPortfolioClick){
	    infoCardControls.onClick('portfolio');
    }
}


//************************
//
//	INIT
//
//************************

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
	
	projector = new THREE.Projector();
	mouse_vector = new THREE.Vector3();
	mouse = { x: 0, y: 0, z: 1 };
	ray = new THREE.Raycaster(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0));
	intersects = [];
	
	container.appendChild(renderer.domElement);
	
	initImages();
	initEvents();
	initScene();
	initLight();

	animate();
}

function initImages(){
	for(var i = 0; i < projectArray.length; i++){
		projectArray[i].imgObj = new Image();
		projectArray[i].imgObj.src = projectArray[i].img;
		
		/*
var image = new Image();
		image.onload = function(){
			//console.log("image.onload()");
			context.drawImage(image, textX, titleTextY+20, imgW, imgH);
			
		}
		//console.log(data.thumb);
		image.src = data.img;
*/
	}
}

function initEvents(){
	container.addEventListener( 'mousedown', onMouseDown );
	//document.addEventListener( 'mousedown', onDocumentMouseDown, false);
}

function initScene() {
	initBackground();
	initName();
	initPortfolio();
	initInfoCard();
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
	//proportion is 493/99 = 4.979797...
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
	//proportion is 634/153 = 4.2026
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
/*
	projectPlaneW = 192;
	projectPlaneH = 144;
*/
	
	var len = projectArray.length;
	
	for( var i = 0; i< len; i++){
		//var tex = THREE.ImageUtils.loadTexture(projectArray[i].thumb.toString());
	
		var projectPlane = new ProjectPlane(projectArray[i].thumb.toString(), projectArray[i]);
		
		//projectPlane.data=projectArray[i];
		
		projectPlaneArray.push(projectPlane);
		
		scene.add(projectPlane.mesh);
		
		var posObj = positionPlane(i);
		
		projectPlane.mesh.position.x = 300;
		projectPlane.mesh.position.y = posObj.y;
		projectPlane.mesh.position.z = posObj.z + planeZSpacer;
		projectPlane.mesh.rotation.x = posObj.rotation;
		//tracePlanePosData(projectPlane);
	}
}

function initInfoCard(){
	
	infoCard = new InfoCard();
	
	scene.add(infoCard.mesh);
	
	infoCard.mesh.position.x = -100;
	infoCard.mesh.position.y = -50;
	infoCard.mesh.position.z = 100;
	
	infoCardControls = new InfoCardControls();
	
	scene.add(infoCardControls.meshAbout);
	scene.add(infoCardControls.meshPortfolio);
	
	infoCardControls.meshAbout.position.x = -312;
	infoCardControls.meshAbout.position.y = 160;
	infoCardControls.meshAbout.position.z = 100;
	
	infoCardControls.meshPortfolio.position.x = -238;
	infoCardControls.meshPortfolio.position.y = 160;
	infoCardControls.meshPortfolio.position.z = 100;
	
}

function initLight() {
	
}

//************************
//
//	POSITIONING
//
//************************

function positionPlane(pos){

//The equation for the parabola of planes is y^2=-1200x.
	var posObj = {};
	var zCoef = projectPlaneH;
	var a = 100;
	var spacer = 10;
	
	//pos += 1;
	pos2 = (pos+1) * zCoef;
	
	posObj.y =  pos2;
	posObj.z = (posObj.y * posObj.y) / -1200;
	posObj.rotation = pos > 0 ? -posObj.y/600 : 0;
	
	return posObj;
}

function scrollPlanes(){
	//console.log("scrollPlanes()");
	var len = projectPlaneArray.length;
	var i=0;
	var planeZeroTmp = projectPlaneArray[0].mesh.position.y - planeRate;
	var planeLenTmp = projectPlaneArray[len-1].mesh.position.y - planeRate;
	
	if(planeLenTmp<=0 || planeZeroTmp>=projectPlaneH){
		
	} else {
		
		for(i=0; i<len; i++){
			projectPlaneArray[i].mesh.position.y -= planeRate;
			projectPlaneArray[i].mesh.position.z = (projectPlaneArray[i].mesh.position.y * projectPlaneArray[i].mesh.position.y) / -1200;
			projectPlaneArray[i].mesh.position.z = projectPlaneArray[i].mesh.position.z + planeZSpacer;
			projectPlaneArray[i].mesh.rotation.x = -projectPlaneArray[i].mesh.position.y/600;
			if(projectPlaneArray[i].mesh.position.y<0){
				projectPlaneArray[i].mesh.rotation *= -1;
			}
		}
	}
	//console.log("projectPlaneArray[0].position.y=="+projectPlaneArray[0].position.y);
	//console.log("projectPlaneArray[len-1].position.y=="+projectPlaneArray[len-1].position.y);
}

function moveCamera(){
	//move the camera
	camera.position.x = mouseX - ($(window).width())/2;
	camera.position.y = ($(window).height())/2 - mouseY;
	
	//move the shadow
	shadowPlane.position.x = (-camera.position.x*.13) - 200;
	shadowPlane.position.y = (-camera.position.y*.13) + 220;
	
	//aim the camera
	camera.lookAt(scene.position);
}

function tracePlanePosData(projectPlane){
		//console.log("x="+projectPlane.position.x);
		console.log("y="+projectPlane.position.y);
		console.log("z="+projectPlane.position.z);
		console.log("r="+projectPlane.rotation.x);
		console.log("*****");
}

//************************
//
//	ANIMATION
//
//************************

function animate() {
	if(mouseOver){
		
		moveCamera();
		
		requestAnimationFrame(animate);
		render();
		
		if(planesScrolling){
			//planesAdvance = false;
			scrollPlanes();
		}
		
		if(planesAdvance){
			planesScrolling = false;
			//scrollToPlane(planesAdvanceIndex);
			
			if(projectPlaneArray[planesAdvanceIndex].mesh.position.y>0){
				//console.log("y>0");
				planeRate = 10;
			}
			
			if(projectPlaneArray[planesAdvanceIndex].mesh.position.y<0){
				planeRate = -10;
			} 
			
			
			if(projectPlaneArray[planesAdvanceIndex].mesh.position.y < 10 && projectPlaneArray[planesAdvanceIndex].mesh.position.y > -10){
				planesAdvance = false;
			} else {
				scrollPlanes();
			}
		}
	}
}

function render() {
	renderer.render(scene, camera);
}

//************************
//
//	CLASSES AND PROTOTYPES
//
//************************

function ProjectPlane(texPath, data){
	
	this.texPath = texPath;
	this.tex = THREE.ImageUtils.loadTexture(texPath);
	this.data = data;

	this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(projectPlaneW, projectPlaneH), new THREE.MeshBasicMaterial({
		map: this.tex,
		antialiasing:true/*
,
		side: THREE.DoubleSide
*/
	}));
	
	this.mesh.data = data;
	
	this.mesh.callback = function(){console.log("title=="+this.data.titleproj)};
}

function InfoCard(){
	//vars
	var cardW = 500;
	var cardH = 400;
	var titleFont = '18px Helvetica';
	var bodyFont = '14px Helvetica';
	var textX = 20;
	var titleTextY = 20;
	var bodyTextY = 170;
	var planeIndex = -1;
	
	//setup canvas
	var bitmap = document.createElement('canvas');
	bitmap.width = cardW;
	bitmap.height = cardH;
	var context = bitmap.getContext('2d');
	clearCard();
	
	// canvas contents will be used for a texture
	var tex = new THREE.Texture(bitmap);
	
	//create the material for the mesh
	var mat = new THREE.MeshBasicMaterial({
		map: tex,
		antialiasing:true,
		transparent:true
	});
	
	//chreate the mesh and set some properties
	this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(cardW, cardH), mat);
	mat.opacity = .9;
	mat.needsUpdate = true;
	tex.needsUpdate = true;
	
	//clear the card
	function clearCard(){
		context.clearRect(0, 0, cardW, cardH);
		context.globalAlpha = .3;
		context.fillStyle = '#000000';
		context.fillRect(0, 0, cardW, cardH);
		context.globalAlpha = 1;
		
		context.fillStyle = '#ffffff';
		context.font = bodyFont;
		context.textBaseLine = "bottom";
		context.fillText("next >", textX+430, titleTextY);
		context.fillText("< prev", textX+370, titleTextY);
	}
	
	//apply the texture to the material
	function applyTex(){
		tex = new THREE.Texture(bitmap);
		mat.map = tex;
		mat.needsUpdate = true;
		tex.needsUpdate = true;
		//renderer.render(scene, camera);
	}
	
	function setTitle(){
		textX = 20;
		textY = 20;
		context.fillStyle = '#ffffff';
		context.font = titleFont;
		context.textBaseLine = "bottom";
	}
	
	function setBody(){
		textX = 20;
		textY = 70;
		context.fillStyle = '#ffffff';
		context.font = bodyFont;
		context.textBaseLine = "bottom";
	}
	
	//copypasta from http://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
	function getLines(ctx,phrase,maxPxLength,textStyle) {
	    var wa=phrase.split(" "),
	        phraseArray=[],
	        lastPhrase=wa[0],
	        l=maxPxLength,
	        measure=0;
	    ctx.font = textStyle;
	    for (var i=1;i<wa.length;i++) {
	        var w=wa[i];
	        measure=ctx.measureText(lastPhrase+w).width;
	        if (measure<l) {
	            lastPhrase+=(" "+w);
	        }else {
	            phraseArray.push(lastPhrase);
	            lastPhrase=w;
	        }
	        if (i===wa.length-1) {
	            phraseArray.push(lastPhrase);
	            break;
	        }
	    }
	    
	    return phraseArray;
	}
	
	//format the text on for the texture
	this.switchProjects = function(data, index){
		planeIndex = index;
		
		var imgW = cardW - (textX*2);
		var imgH = (((cardW - (textX*2))*155)/662);	//this uses the original dimensions of the image which are 662x155
		
		clearCard();
		
		setTitle();
		context.fillText(data.title, textX, titleTextY);
		
		context.drawImage(data.imgObj, textX, titleTextY+20, imgW, imgH);
		
		setBody();
		var lines = getLines(context, decodeURIComponent(data.description), cardW - (textX*2), bodyFont);
		for(var i = 0; i < lines.length; i++){
			//console.log(i);
			context.fillText(lines[i], textX, bodyTextY + (i*15));
		}
		
		applyTex();
	}
	
	//show the about info 
	this.showAbout = function(){
		//console.log('infoCard.showAbout()');
		clearCard();
		setTitle();
		context.fillText('Experience', textX, textY);
		applyTex();
	}
	
	this.onClick = function(vector){
		//console.log(vector);
		
		//next button
		if(vector.x > 100 && vector.x < 150 && vector.y < 150 && vector.y > 120){
			//next x ranges from 100 to 150
			//next y ranges from 150 to 120
			//console.log('next click');
			
			if(planeIndex+1 < projectArray.length){
				planeIndex++;
			} else {
				planeIndex=0;
			}
			
			this.switchProjects(projectArray[planeIndex], planeIndex);
			planesAdvance = true;
			planesAdvanceIndex = planeIndex;
			//scrollToPlane(planeIndex);
			
			infoCardControls.onClick('portfolio');
		}
		
		//prev button
		if(vector.x > 40 && vector.x < 85 && vector.y < 150 && vector.y > 120){
			//prev x ranges from 40 to 85
			//prev y ranges from 150 to 120
			//console.log('prev click');
			
			if(planeIndex-1 >= 0){
				planeIndex--;
			} else {
				planeIndex = projectArray.length-1;
			}
			
			this.switchProjects(projectArray[planeIndex], planeIndex);
			planesAdvance = true;
			planesAdvanceIndex = planeIndex;
			//scrollToPlane(planeIndex);
			
			infoCardControls.onClick('portfolio');
		}
		
	}
	
	//after all the functions, variables, and states are initialized - put the infoCard in it's initial state
	this.showAbout();
}

function InfoCardControls(){
	//make the mesh, geometry, material, and texture for both buttons
	var btnW = 75;
	var btnH = 20;
	var textX = 15;
	var textY = 15;
	var font = '12px Helvetica'
	
	//setup canvas
	var bmpAbout = document.createElement('canvas');
	bmpAbout.width = btnW;
	bmpAbout.height = btnH;
	var ctxAbout = bmpAbout.getContext('2d');
	
	
	// canvas contents will be used for a texture
	var texAbout = new THREE.Texture(bmpAbout);
	
	//create the material for the mesh
	var matAbout = new THREE.MeshBasicMaterial({
		map: texAbout,
		antialiasing:true,
		transparent:true
	});
	
	//chreate the mesh and set some properties
	this.meshAbout = new THREE.Mesh(new THREE.PlaneGeometry(btnW, btnH), matAbout);
	matAbout.opacity = .9;
	matAbout.needsUpdate = true;
	texAbout.needsUpdate = true;
	
	
	//setup canvas
	var bmpPortfolio = document.createElement('canvas');
	bmpPortfolio.width = btnW;
	bmpPortfolio.height = btnH;
	var ctxPortfolio = bmpPortfolio.getContext('2d');
	
	// canvas contents will be used for a texture
	var texPortfolio = new THREE.Texture(bmpPortfolio);
	
	//create the material for the mesh
	var matPortfolio = new THREE.MeshBasicMaterial({
		map: texPortfolio,
		antialiasing:true,
		transparent:true
	});
	
	//chreate the mesh and set some properties
	this.meshPortfolio = new THREE.Mesh(new THREE.PlaneGeometry(btnW, btnH), matPortfolio);
	matPortfolio.opacity = .9;
	matPortfolio.needsUpdate = true;
	texPortfolio.needsUpdate = true;
	
	function focusBkg(ctx){
		ctx.clearRect(0, 0, btnW, btnH);
		ctx.globalAlpha = .3;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, btnW, btnH);
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#ffffff';
		ctx.font = font;
		
		return ctx;
	}
	
	function blurBkg(ctx){
		ctx.clearRect(0, 0, btnW, btnH);
		ctx.globalAlpha = .5;
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, btnW, btnH);
		ctx.globalAlpha = 1;
		ctx.fillStyle = '#ffffff';
		ctx.font = font;
		
		return ctx;
	}
		
	function focus(ctx, txt, tex, mat, bmp){
		ctx = focusBkg(ctx);
		ctx.fillText(txt, textX, textY);
		applyTex(tex, mat, bmp);
	}
	
	function blur(ctx, txt, tex, mat, bmp){
		ctx = blurBkg(ctx);
		ctx.fillText(txt, textX, textY);
		applyTex(tex, mat, bmp);
	}
	
	function applyTex(tex, mat, bmp){
		tex = new THREE.Texture(bmp);
		mat.map = tex;
		mat.needsUpdate = true;
		tex.needsUpdate = true;	
	}
		
	this.onClick = function(type){
		//console.log('infoCardControls.onClick()');
		if(type==='about'){
			//console.log('about');
			//aboutFocus();
			//portfolioBlur();
			focus(ctxAbout, 'About', texAbout, matAbout, bmpAbout);
			blur(ctxPortfolio, 'Portfolio', texPortfolio, matPortfolio, bmpPortfolio);
			infoCard.showAbout();
		}
		
		if(type==='portfolio'){
			//console.log('portfolio');
			//aboutBlur();
			//portfolioFocus();
			blur(ctxAbout, 'About', texAbout, matAbout, bmpAbout);
			focus(ctxPortfolio, 'Portfolio', texPortfolio, matPortfolio, bmpPortfolio);
			if(planesAdvanceIndex===-1){planesAdvanceIndex=0;}
			infoCard.switchProjects(projectArray[planesAdvanceIndex], planesAdvanceIndex);
			planesAdvance = true;
		}
		
	}
	
	focus(ctxAbout, 'About', texAbout, matAbout, bmpAbout);
	blur(ctxPortfolio, 'Portfolio', texPortfolio, matPortfolio, bmpPortfolio);
	
}

//************************
//
//	MATH
//
//************************

function sinh(x){
    return (Math.exp(x) - Math.exp(-x)) / 2;
}

function asinh(x) {
  return Math.log(x + Math.sqrt(x * x + 1));
}

function degToRad(deg){
	return deg * (Math.PI/180);
}

function radToDeg(rad){
	return rad * (180/Math.PI);
}
