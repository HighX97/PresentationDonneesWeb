//http://arian-celina.com/implementing-rest-services-in-angularjs-using-restangular/
//https://docs.angularjs.org/guide/forms
//https://docs.angularjs.org/api/ng/directive/ngSubmit

/*****CONFIG*****/
var VERSION_TO_USE = "jimmy"; //jimmy,loic
var ARR_CONTROLLER_ULRS = {
    'jimmy': {
        'filters': 'http://localhost:8888/getDataMongoDb',
        '1D': 'http://localhost:8888/getGroupedData',
        '2D': 'http://localhost:8888/getGroupedData2D',
        '3D': 'http://localhost:8888/getGroupedData2D'
    },
    'loic': {
        'filters': 'http://localhost:8888/getDataFromMongoLoic',
        '1D': 'http://localhost:8888/getDataFromMongoLoic',
        '2D': 'http://localhost:8888/getDataFromMongoLoic',
        '3D': 'http://localhost:8888/getDataFromMongoLoic'
    }
};
var app = angular.module('app', ['ngRoute']);//Creation del modulo y los modulos requeridos para la aplicaicón
/*MENUS*/
var listMenuPaths = {//Pending selectedAction
    "Home" : "#/"
    ,"1D" : "#/1D"
    ,"2D" : "#/2D"
    ,"3D" : "#/3D"
};

//Jimmy: Var with the json Keys that we can not show. -->getFilterData(jsonData, arrFilters, notIncludeFilerKeys)
var notIncludeFilerKeys = ['_id', 'xAxis', 'yAxis', 'color', 'nameCity', 'practiceDate', 'percentage', 'nbHour', 'nbHoursQ', 'percentageQ'];
var notInclude1DKeys = ['_id', 'xAxis', 'yAxis', 'color', 'nameCity', 'nbHoursQ', 'percentageQ'];
/*3D*/
var SCREEN_WIDTH = jQuery("#div_content_3d").width();
var SCREEN_HEIGHT = jQuery("#div_content_3d").width();
var width3D = (1000) * (2);// width 2D
var height3D = (910) * (2);// height 2D

var container, stats;
var camera, scene, renderer;

var clock;


//Cette fonction serait appelée au démarrage de l'application 
app.run(function($rootScope, $location, $routeParams){ 
    $rootScope.selectedAction = "Home";
});

app.controller('controleur', function($scope, $http){});

app.controller('controller1D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "1D";
    $rootScope.formAction = "1D";
    console.log("Dans controller1D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
            $rootScope.filtersData = filtersData;
            //$rootScope.city = response.data.city;
            //$rootScope.practice = response.data.practice;
        });
    }
    /*
    $scope.getContent = function(obj){
         return obj.value + " " + obj.text;
     }
     */
    /* EVENTS 1D */
    angular.element(document).ready(function () {
        $rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
        //datatable
        
    });
});

app.controller('filterController', function($scope, $http, $rootScope){
    console.log("Dans filterController");
    $rootScope.sendFilterForm = function(){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        var formData = jQuery("#form_filters").serialize();
        var formAction = $scope.formAction;//1D, 2D, 3D

        $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE][formAction] + '?' + formData ).then(function(response){
            //$scope.city = resultData['data'][0].nameCity;
            
            //https://api.jquery.com/jquery.extend/
            //Clone object http://heyjavascript.com/4-creative-ways-to-clone-objects/
            $rootScope.data2D = jQuery.extend(true, [], response.data);
            $rootScope.filtered = formData;
            resultData = prepareDisplayData(response.data);
            $rootScope.titres = resultData['titres'];
            $rootScope.practice = resultData['data'];
            switch(formAction){
                case '2D':
                case '3D':
                case '1D':
                default:
                    break;
            }
            updateStatistics2D($rootScope);
        });
    } 

    $rootScope.resetForm = function ()
    {
        jQuery("#form_filters")[0].reset();
        $rootScope.sendFilterForm()
    }
    /* EVENTS FILTER FORM  -> Directives filterReady, clearFilters*/
});

//Jimmy: Angular Event onChange to send the filters 
app.directive( 'filterReady', function( $parse ) {
   return {
       restrict: 'A',
       link: function( $scope, elem, attrs ) {    
            elem.change(function(){
                $scope.$apply(function(){
                    $scope.sendFilterForm();
                })
            });
        }
    }
});

//Jimmy: Angular Event onChange to send the filters 
app.directive( 'clearFilters', function( $parse ) {
   return {
       restrict: 'A',
       link: function( $scope, elem, attrs ) {    
            elem.click(function(){
                $scope.resetForm();
            })
        }
    }
});

app.controller('controller2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    $rootScope.formAction = "2D";
    $rootScope.legend2DData = [];

    console.log("Dans controller2D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
            $rootScope.filtersData = filtersData;
            //$rootScope.city = response.data.city;
            //$rootScope.practice = response.data.practice;
        });
    }
     /* EVENTS 2D */
    angular.element(document).ready(function () {
        $rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
        //D3 Event Click
        d3.select("#div_content_2d")
            .on('click', function(){
                var mouseCoords = d3.mouse(this);
                console.log(' {"xAxis": ' +  enconde2DToPercentageCoords(mouseCoords[0], jQuery("#div_content_2d").width()) + ', "yAxis": ' + enconde2DToPercentageCoords(mouseCoords[1], jQuery("#div_content_2d").height()) + ', "radius": 20, "color" : "red" }');
            });
    });
});


app.controller('controller3D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "3D";
    $rootScope.formAction = "3D";
    console.log("Dans controller3D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
            $rootScope.filtersData = filtersData;
            $rootScope.city = response.data.city;
            $rootScope.practice = response.data.practice;

            $rootScope.data2D = $rootScope.data2D;
        });
    }
    /* EVENTS 3D */
    angular.element(document).ready(function () {
        $rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
    });
});

var container, stats;
var camera, scene, renderer;
var COLUMN_LIST = [];

app.directive('displayThirdDimension', function(){
    //jQuery("#div_content_3d").html("");
    var SCREEN_WIDTH = jQuery("#div_content_3d").width();
    var SCREEN_HEIGHT = jQuery("#div_content_3d").width();

    var clock = new THREE.Clock();
    var started3D = false;

    function init() {
        started3D = true;
        container = document.getElementById('div_content_3d')
        
        // CAMERA
        /*
        PerspectiveCamera( fov, aspect, near, far )

        fov — Camera frustum vertical field of view.
        aspect — Camera frustum aspect ratio.
        near — Camera frustum near plane.
        far — Camera frustum far plane.
         */
        camera = new THREE.PerspectiveCamera( 90, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        //camera.position.set( 0, 600, 300 );
        camera.position.y = 1000;
        camera.rotation.x = -90 * Math.PI / 180;
        //Jimmy: position to have space to rotate

        // SCENE
        scene = new THREE.Scene();
        
        // CONTROLS
        /**/

        if( false ){ //enable controls
            controls = new THREE.OrbitControls( camera );
            //controls.maxPolarAngle = 0.8 * Math.PI / 2;
            controls.enableZoom = false;
        }

        // LIGHTS
        var light = new THREE.DirectionalLight( 0xaabbff, 0.3 );
        light.position.x = 500;
        light.position.y = 250;
        light.position.z = 800;
        scene.add( light );


        if( false ){ //Jimmy: enable/disable SKY
            // SKYDOME
            var vertexShader = document.getElementById( 'vertexShader' ).textContent;
            var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
            var uniforms = {
                topColor:    { type: "c", value: new THREE.Color( 0x0077ff ) },
                bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
                offset:      { type: "f", value: 400 },
                exponent:    { type: "f", value: 0.6 }
            };
            uniforms.topColor.value.copy( light.color );

            var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
            var skyMat = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.BackSide
            } );

            var sky = new THREE.Mesh( skyGeo, skyMat );
            scene.add( sky );
        }

        // RENDERER
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        container.appendChild( renderer.domElement );

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        // STATS
        //stats = new Stats();
        //container.appendChild( stats.domElement );


        //Jimmy: Default plane
        //Jimmy: Add Map Texture
        var texLoader = new THREE.TextureLoader();
        var textureMap = texLoader.load("img/Montpellier_map_with_divisions.png");

        /*
        Jimmy: Deprecated
        var textureMap = THREE.ImageUtils.loadTexture('img/Montpellier_OSM_map_with_divisions.png')
         */
        material = new THREE.MeshBasicMaterial({map: textureMap});
        geometry = new THREE.CubeGeometry( width3D, 1, height3D );
        mesh = new THREE.Mesh( geometry, material );
        mesh.name = "map_montpellier"
        scene.add( mesh );

        document.getElementById('div_content_3d').addEventListener( 'resize', onWindowResize3D, false );
    }

    if(! started3D ){   
        init();
    }
    return {
        restrict: 'A',
        link: function (scope, element) {
            animate();
            displayThirdDimension(scope, scene)
        }
    }
});

app.config(function ($routeProvider){
    console.log("app config");
    $routeProvider
        .when('/1D', {
            controller: 'controller1D',
            templateUrl: 'templates/1D.html'
        })
        .when('/2D', {
            controller: 'controller2D',
            templateUrl: 'templates/2D.html'
        })
        .when('/3D', {
            controller: 'controller3D',
            templateUrl: 'templates/3D.html'
        })
        .when('/map', {
            controller: 'controller1D',
            templateUrl: 'templates/map.html'
        })
        .when('/', {//otherwhise
            controller: 'controleur',//Definición del controlador
            templateUrl: 'templates/home.html'//Template or templateUrl
        });
});