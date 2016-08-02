if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, controls, scene, renderer;
var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), INTERSECTED;
var WIDTH = window.innerWidth , HEIGHT = window.innerHeight

window.onload = function() {
loadData(function() {
init();
animate();
populateUserFields();
});
}


function loadData(_callback) {
	// Load Data (hopefully) before the rest of the place loads.
	var xmlhttp = new XMLHttpRequest();
	var url = "js/atsdata.json";

	xmlhttp.onreadystatechange = function() {
	    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
	        jsonEmpire = JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['empires'];
					jsonGate =  JSON.parse(xmlhttp.responseText)['ATS_Navcomp_DB']['gates'];
	        _callback();

	    }
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

}

function reset_view() {
	camera.position.set(-9300,50,550);
	controls.target.x = scene.getObjectByName("Federation").position.x;
	controls.target.y = scene.getObjectByName("Federation").position.y;
	controls.target.z = scene.getObjectByName("Federation").position.z;
  camera.updateProjectionMatrix();
	render();
}

function init() {
				scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
				container = document.createElement( 'div' );
				document.body.appendChild( container );


        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1e7);

        controls = new THREE.OrbitControls( camera, renderer.domElement );
				controls.enableDamping = true;
				controls.dampingFactor = 0.25;
				controls.enableZoom = true;
  		  controls.addEventListener( 'change', render );
				document.addEventListener( 'mousedown', onCanvasClick, false );



var Text2D = THREE_Text.Text2D;
var SpriteText2D = THREE_Text.SpriteText2D;
var textAlign = THREE_Text.textAlign
var b_geometry, b_material, b_mesh, p_geometry, p_material, p_mesh, s_geometry, s_material, s_mesh, l_text;




for (var key in jsonEmpire) {
  area=jsonEmpire[key];

  for (var key2 in area['borders']) {
			var border = area['borders'][key2];

		  b_geometry = new THREE.SphereGeometry( border.radius, 10, 10 );
		  b_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: true} );
			b_mesh = new THREE.Mesh( b_geometry, b_material );b_mesh
		  b_mesh.position.x = border.x;
		  b_mesh.position.y = border.y;
		  b_mesh.position.z = border.z;
		  b_mesh.name = escapeHTML(border.name);
			scene.add( b_mesh );
			if (border.radius > 10) {
				l_text = new Text2D(border.name, { align: textAlign.center,  font: '25px Arial', fillStyle: '#777' , antialias: false });
				l_text.material.alphaTest = 0.5;
				l_text.position.set(border.x,border.y,border.z);
				l_text.scale.set(0.75,0.75,0.75);
				scene.add(l_text);
			}
	}



  // Planet Generation
  for (var key in area["planets"]) {
    var planet = area.planets[key];
    p_geometry= new THREE.SphereGeometry( 1, 10, 10 );
    p_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    p_mesh =  new THREE.Mesh( p_geometry, p_material );
    p_mesh.position.x=planet.x;
    p_mesh.position.y=planet.y;
    p_mesh.position.z=planet.z;
    p_mesh.name = escapeHTML(planet.name);
		scene.add( p_mesh );
    l_text = new Text2D(escapeHTML(planet.name), { align: textAlign.right,  font: '12px Arial', fillStyle: '#FFF' , antialias: false });
    l_text.material.alphaTest = 0.0;
    l_text.position.set(planet.x,planet.y,planet.z);
    l_text.scale.set(0.25,0.25,0.25);
    scene.add(l_text);
  }

  // Base Generation
  for (var key in area["stations"]) {
    var base = area.stations[key];
    s_geometry = new THREE.CylinderGeometry( 0.1, 0.5*3, 0.5*3, 4 );
    s_material = new THREE.MeshBasicMaterial( { color: area.color, wireframe: false} );
    s_mesh = new THREE.Mesh( s_geometry, s_material );
    s_mesh.position.x=base.x;
    s_mesh.position.y=base.y;
    s_mesh.position.z=base.z;
		s_mesh.name = escapeHTML(base.name);
    scene.add( s_mesh );
  	l_text = new Text2D(escapeHTML(base.name), { align: textAlign.left,  font: '12px Arial', fillStyle: '#ABABAB' , antialias: false });
    l_text.material.alphaTest = 0.0;
    l_text.position.set(base.x,base.y+3,base.z);
		l_text.scale.set(0.20,0.20,0.20);
    scene.add(l_text);
  }

}
    // Set view and camera to point to initial location
		reset_view();

}

window.onresize = function() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );


				render();

}
function onCanvasClick( event ) {

				//event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

							raycaster.setFromCamera( mouse, camera );
							var intersects = raycaster.intersectObjects( scene.children );

							if ( intersects.length > 0 ) {
								if ( INTERSECTED != intersects[ 0 ].object ) {

									INTERSECTED = intersects[ 0 ].object;
									// console.log( INTERSECTED.name );
									if (lastInputBox) {
										document.getElementById(lastInputBox).value = INTERSECTED.name;
									}

								}

							} else {

								INTERSECTED = null;

							}

			}

function animate() {
				var delta = clock.getDelta();
	        requestAnimationFrame( animate );
	        scene.updateMatrixWorld()
					controls.update(delta);
	        render();
}


function render () {
		//requestAnimationFrame( render );
    renderer.render( scene, camera );

}


function listobjects(type) {
	var objects = {};

	for (var key in jsonEmpire) {
		area=jsonEmpire[key];
		for (var key2 in area[type]) {
			object = area[type][key2];
			objectname = object.name;
			objects[object.name] = object;

		}
	}
	return objects;
}

function zoomfocus(name) {


			var zoomto = grabPositionByName(name);
			if (zoomto != null) {
					controls.target.x = zoomto.x;
				  controls.target.y = zoomto.y;
				  controls.target.z = zoomto.z;
					var focus = new THREE.Vector3( zoomto.x, zoomto.y, zoomto.z );
					var vantage = new THREE.Vector3( 5, 60 , 150 );
					focus.add(vantage);
					camera.position.set(focus.x,focus.y,focus.z);
					camera.updateProjectionMatrix();
					render();


			}



}


function drawline(origin,dest) {
		var direction = dest.clone().sub(origin);
		var length = origin.distanceTo(dest);
	  var arrowHelper = new THREE.ArrowHelper(direction.normalize(),origin,length,0xffffff,10,5);
		arrowHelper.name = "arrow";
		arrowHelper.cone.material.transparent = true;
		arrowHelper.cone.material.opacity = 0.25;
		arrowHelper.line.material.linewidth = 2;
		scene.add( arrowHelper );

		animate();

}

function removeEntity(object) {
		var selectedObject;
		while ( selectedObject = scene.getObjectByName(object) ) {
    scene.remove( selectedObject );
	}

    animate();
}

// Calculates SU/s with given warp factor
function calcSUpS(warpfactor) {
	// 14.0*29.979246*1298.737508 = 257494817.55 SU/s
	// Velocity = WF^3.333333*lightspeed*cochranes
	// 3087467836.3256578445 = 1 Parsec
	var cochranes = 1298.737508; // Average cochranes
	var lightspeed = 29.979246; // Lightspeed constant
	var exponent = 3.333333;

	var sus =  Math.pow(warpfactor,exponent) * lightspeed * cochranes ;
	return sus;
}

function su2pc ( su ) {
	return su / 3087467836.3256578445;
}

// Calculates ETA for given distance and velocity.
// Velocity should be supplied as an array of speed and unit
function calcETA(velocity,distance) {
			var speed = velocity.speed;
			var unit = velocity.unit;
			var seconds;
			switch (unit) {
					case 'SU/s':
						seconds = new Decimal(  distance / su2pc(speed)  );
						break;
					case 'PC/s':
						seconds = new Decimal( distance /  speed  );
						break;
					case 'WF':
						seconds = distance / su2pc(calcSUpS(speed));
						break;
					default:
						throw "Invalid unit of speed."
			}

			return seconds;

}

// Calculate the distance between two named points ( Stations or Bases )
function calcDist(pointa, pointb) {
		var obj_A = scene.getObjectByName(pointa);
		var obj_B = scene.getObjectByName(pointb);

		var distance =  obj_A.position.distanceTo(obj_B.position);
		return distance;
}

function grabPositionByName(name) { return scene.getObjectByName(name).position;  }


function calcEndpointByHeading(heading,startvec = new THREE.Vector3(0,0,0)) {
		// heading.x = azimuth
		// heading.y = inclination
		// heading.z = radius (distance)
		var calcvec = new THREE.Vector3();
		calcvec.x = Math.cos(heading.x / 180 * Math.PI ) * Math.cos(heading.y / 180 * Math.PI ) * heading.z;
		calcvec.x = Number(calcvec.x.toFixed(6));
		if (Math.sign(calcvec.x) == -1 && calcvec.x == 0) { calcvec.x=0; }   // A dirty hack to fix negative zero situations.
		calcvec.y = Math.sin(heading.x / 180 * Math.PI ) * Math.cos(heading.y / 180 *  Math.PI ) * heading.z;
		calcvec.y = Number(calcvec.y.toFixed(6));
		if (Math.sign(calcvec.y) == -1 && calcvec.y == 0) { calcvec.y=0; }   // A dirty hack to fix negative zero situations.
		calcvec.z = Math.sin(heading.y / 180 * Math.PI) * heading.z;
		calcvec.z = Number(calcvec.z.toFixed(6));
		if (Math.sign(calcvec.z) == -1 && calcvec.z == 0) { calcvec.z=0; }   // A dirty hack to fix negative zero situations.
		var finalvec = new THREE.Vector3();
		calcvec.add(startvec);
		return calcvec;
}

function calcBestRoute(pointa,pointb) {
	var route = [{}];
	delete route['0']; // WTF? We shouldn't need to do this. I hate JS....

	// Calculate direct route.
	route['Direct'] =  { 'stops': [{'name':pointb, 'gate': false}], 'distance': calcDist(pointa, pointb)};

	// Find route via stargate.
	var distance_a = {};
	var distance_b = {};
	var near_a,near_b;
	// Find gate closest to point a
	jsonGate.forEach(function(name) { distance_a[name.name] = calcDist(pointa,name.name);});
	var dist_a_sorted = Object.keys(distance_a).sort(function(a,b) {return distance_a[a]-distance_a[b]});
	var near_a = dist_a_sorted[0];


	// Dump out right now if A->nearest gate > direct. Save the compute cycles.
	if(distance_a[near_a] > route['Direct'].distance || near_a == pointb) {
		return route['Direct'];
	}

	// Find gate closest to point b
	jsonGate.forEach(function(name) { distance_b[name.name] = calcDist(pointb,name.name) ;});
	var dist_b_sorted = Object.keys(distance_b).sort(function(a,b) {return distance_b[a]-distance_b[b]});
	var near_b = dist_b_sorted[0];

	// Dump out right now if B->nearest gate > direct or the same fucking gate. Save the compute cycles.
	if(distance_b[near_b] > route['Direct'].distance || near_a == near_b) {
					return route['Direct'];
	}
	// Assemble the gate travel plan. With our powers unite, we are shitty code!
	gate_distance = distance_a[near_a] + distance_b[near_b];
	route['Gate'] = {'stops': [{'name':near_a, 'gate':true} ,{'name': near_b, 'gate': true},{'name': pointb, 'gate':false}], 'distance':gate_distance}

	// Sort all routes by distance traveled. Index of zero should be the fastest, in theory any way
	var route_keys_sorted = Object.keys(route).sort(function(a,b) {return route[a].distance-route[b].distance});

	return route[route_keys_sorted[0]];
}


function predictDestination(loc,heading,frame) {
		removeEntity('arrow');
		if(frame != "Galactic") {
			var objFrame = grabPositionByName(frame);
		} else {
				var objFrame = new THREE.Vector3(0,0,0);
		}

		console.log(frame)
		var adjLoc = loc.clone();
		adjLoc = adjLoc.add(objFrame);
		var headingvec = new THREE.Vector3(heading.x, heading.y, 300);
		var farpoint = calcEndpointByHeading(headingvec,adjLoc);
		drawline(adjLoc,farpoint);
		var directionvector = farpoint.sub(adjLoc);
		var ray = new THREE.Raycaster(adjLoc, directionvector.clone().normalize());
		scene.updateMatrixWorld();
		var intersects = ray.intersectObjects(scene.children,false);
		var correctedintersections=[];
		if (intersects[0]) {
				intersects.forEach(function(obj) {
					if (obj.object.geometry.boundingSphere.radius != 'undefined' &&  obj.object.geometry.boundingSphere.radius < 2) {
							correctedintersections.push(obj.object.name);
					}
				});
				return correctedintersections[0];
			}
			return "Unable to predict"

}
