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

//Jimmy: Add events using the keyboard
function onKeyDown3D( event )
{
    switch(event.keyCode){
        case '89': // y
            alert("Test press key Y :)");
            break;
    }
}