var scene = {};

function draw3d()
{
    init3D();
    animate();
}
var largueurScene = jQuery("#div_content_3d").width();
var hauteurScene = jQuery("#div_content_3d").height();


function init3D()
{
    
    scene = new THREE.Scene();
    //Création des caméras et sélection d'une caméra
    // Ajout des murs, des marqueurs, du mobilier

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( largueurScene, hauteurScene );
    renderer.setClearColor(0xFFFFFF, 1.0);

    document.addEventListener('keydown', onKeyDown3D, false);
    document.body.appendChild(renderer.domElement);
    /*
    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
                renderer.setClearColor( 0x777777 );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.autoClear = true;
    */

}

function animate()
{
    requestAnimationFrame(animate);
    render3D();
}

function render3D()
{
    //Caméra horizontale
    cameraH = new THREE.PerspectiveCamera(75, largueurScene / hauteurScene, 1, 10000);
    cameraH.position.z = 1000; // recul arbitraire 
    //Caméra verticale
    cameraV = new THREE.PerspectiveCamera(75, largueurScene, hauteurScene, 1, 10000)
    cameraV.position.y = 1000;
    cameraV.rotation.x = -90 * Math.PI / 180;
    
    //camera = cameraH;
    camera = cameraV;

    renderer.render(scene, camera);
}

function addWall()
{
	/*
	var longueur = Math.sqrt( ((x2 - x1) * pasLargueur) * ((x2 - x1) * pasLargueur) 
		+ ((y2 - y1) * pasLargueur) * ((y2 - y1) * pasLargueur)
	);
	*/
	var longueur = 10;
	var hauteur = 15;
	var largueur = 7;

	geometry = new THREE.CubeGeometry( longueur, hauteur, largueur );


	// instantiate a loader
	var texture = new THREE.TextureLoader();
	// load a resource
	texture.load(
		// resource URL
		'assets/texture.jpg',
		// Function when resource is loaded
		function ( texture ) {
			// do something with the texture
			var material = new THREE.MeshBasicMaterial( {
				map: texture
			 } );
		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		}
	);
	var divisions = Math.round(longueur / 100);

	//var texture = new THREE.ImageUtils.loadTexture('assets/texture.png');
	//texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	//texture.repeat.set( divisions, 1);
	material = new THREE.MeshBasicMaterial( { map: texture } );
	var material = new THREE.MeshBasicMaterial( {
		map: texture
	 } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

//Jimmy: Add events using the keyboard
function onKeyDown3D( event )
{
    switch(event.keyCode){
        case '89': // y
            alert("Test press key Y :)");
            break;
    }
}