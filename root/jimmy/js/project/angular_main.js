//http://arian-celina.com/implementing-rest-services-in-angularjs-using-restangular/
//https://docs.angularjs.org/guide/forms
//https://docs.angularjs.org/api/ng/directive/ngSubmit

/*****CONFIG*****/
var VERSION_TO_USE = "SportStatistics"; //SportStatistics,SportSites
var CONFIG_VERSION = {
    'NAME_APP': {
        'SportStatistics': "Sport Statistics",
        'SportSites': "Sport Sites"
    }
    ,'COLLABORATORS': {
        'SportStatistics': {
            'name1': 'Jimmy Munoz',
            'email1': 'jimmy.munoz-avendano@etu.umontpellier.fr',
            'name2': 'Redoine El Ouasti',
            'email2': 'redoine.el-ouasti@etu.umontpellier.fr',
        },
        'SportSites': {
            'name1': 'Loïc Ortolé',
            'email1': '@etu.umontpellier.fr',
            'name2': 'Mariam',
            'email2': '@etu.umontpellier.fr',
        }
    }
    ,'TITRE_APP': {
        'SportStatistics': "Projet de Présentation de Données Web - MUNOZ Jimmy EL OUASTI Redoine",
        'SportSites': "Projet de Présentation de Données Web - Mariam Loïc"
    }
    ,'TEMPLATE': {
        'SportStatistics': "bootstrap-lumen.min.css",
        'SportSites': "bootstrap-slate.min.css"
        /*
        bootstrap-cerulean.min.css
        bootstrap-darkly.min.css
        bootstrap-cyborg.min.css
        bootstrap-simplex.min.css
        bootstrap-slate.min.css
        bootstrap-spacelab.min.css
        bootstrap-united.min.css
         */
    }
    ,'IMAGE_APP': {
        'SportStatistics': "img/logo.png",
        'SportSites': "img/logo-2.png"
    }
    ,'enableFiltersLeft': {
        'SportStatistics': 1,
        'SportSites': 0
    }
    ,'enableMenu3D': {
        'SportStatistics': 1,
        'SportSites': 0
    }
    ,'CONTROLLER_ULRS': {
        'SportStatistics': {
            'filters': 'http://localhost:8888/getFiltersDataSportStatistics',
            '1D': 'http://localhost:8888/getSportStatisticsData1D',
            '2D': 'http://localhost:8888/getSportStatisticsData2D',
            '3D': 'http://localhost:8888/getSportStatisticsData2D'
        },
        'SportSites': {
            'filters': 'http://localhost:8888/getFiltersDataSportSites',
            '1D': 'http://localhost:8888/getFiltersDataSportSites',
            '2D': 'http://localhost:8888/getFiltersDataSportSites',
            '3D': 'http://localhost:8888/getFiltersDataSportSites'
        }
    }
    ,'3D': {
        'SportStatistics': {
            'OrbitControls' : false,
            'enebleSky' : false
        },
        'SportSites': {}
    }
    ,'NOT_INCLUDE_FILTER_KEYS': {
        'SportStatistics': ['_id', 'xAxis', 'yAxis', 'color', 'nameCity', 'practiceDate', 'percentage', 'nbHour', 'nbHoursQ', 'percentageQ'],
        'SportSites': ['_id', 'xAxis', 'yAxis', 'color']
    }
    ,'NOT_INCLUDE_1D_KEYS': {
        'SportStatistics': ['_id', 'xAxis', 'yAxis', 'color', 'nameCity', 'nbHoursQ', 'percentageQ'],
        'SportSites': ['_id', 'xAxis', 'yAxis', 'color']
    }
};
var ARR_CONTROLLER_ULRS = CONFIG_VERSION['CONTROLLER_ULRS'][VERSION_TO_USE];
var app = angular.module('app', ['ngRoute']);//Creation del modulo y los modulos requeridos para la aplicaicón
/*MENUS*/
var listMenuPaths = {//Pending selectedAction
    "Home" : "#/"
    ,"1D" : "#/1D"
    ,"2D" : "#/2D"
    ,"3D" : "#/3D"
};

//Jimmy: Var with the json Keys that we can not show. -->getFilterData(jsonData, arrFilters, NOT_INCLUDE_FILTER_KEYS)
var NOT_INCLUDE_FILTER_KEYS = CONFIG_VERSION['NOT_INCLUDE_FILTER_KEYS'][VERSION_TO_USE];
var NOT_INCLUDE_1D_KEYS = CONFIG_VERSION['NOT_INCLUDE_1D_KEYS'][VERSION_TO_USE];
/*3D*/
var SCREEN_WIDTH = jQuery("#div_content_3d").width();
var SCREEN_HEIGHT = jQuery("#div_content_3d").width();
var width3D = (1000) * (2);// width 2D
var height3D = (910) * (2);// height 2D
/*****END CONFIG*****/


//Cette fonction serait appelée au démarrage de l'application 
/**
 * [Default configuration]
 * @param  {[type]} $rootScope      [description]
 * @param  {[type]} $location       [description]
 * @param  {[type]} $routeParams){                  $rootScope.project_name [description]
 * @return {[type]}                 [description]
 * @author Jimmy
 */
app.run(function($rootScope, $location, $routeParams){ 
    $rootScope.project_name = CONFIG_VERSION['NAME_APP'][VERSION_TO_USE];
    $rootScope.project_image = CONFIG_VERSION['IMAGE_APP'][VERSION_TO_USE];
    $rootScope.html_titre = CONFIG_VERSION['TITRE_APP'][VERSION_TO_USE];
    $rootScope.css_template = CONFIG_VERSION['TEMPLATE'][VERSION_TO_USE];
    $rootScope.collaborators = CONFIG_VERSION['COLLABORATORS'][VERSION_TO_USE];
    $rootScope.enableFiltersLeft = CONFIG_VERSION['enableFiltersLeft'][VERSION_TO_USE];
    $rootScope.enableMenu3D = CONFIG_VERSION['enableMenu3D'][VERSION_TO_USE];
    $rootScope.selectedAction = "Home";
});

app.controller('SportStatisticsControllerHome', function($scope, $http){});

/**
 * [1D Controller]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @return {[type]}               [description]
 * @author Jimmy
 */
app.controller('SportStatisticsController1D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "1D";
    $rootScope.formAction = "1D";
    console.log("Dans SportStatisticsController1D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, NOT_INCLUDE_FILTER_KEYS);
            $rootScope.filtersData = filtersData;
        });
    }
    /* EVENTS 1D */
    angular.element(document).ready(function () {
        $rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
        //datatable
        
    });
});



app.controller('SportSitesController1D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "1D";
    $rootScope.formAction = "1D";
    console.log("Dans SportSitesController1D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, NOT_INCLUDE_FILTER_KEYS);
            $rootScope.filtersData = filtersData;
        });
    }
    /* EVENTS 1D */
    angular.element(document).ready(function () {
        //$rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
        
        
    });
});

/**
 * [FilterController]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @return {[type]}               [description]
 * @author Jimmy
 */
app.controller('SportStatisticsfilterController', function($scope, $http, $rootScope){
    console.log("Dans filterController");
    $rootScope.sendFilterForm = function(){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        var formData = jQuery("#form_filters").serialize();
        formData = formData.replace(/[^&]+=\.?(?:&|$)/g, '');//Remove empty values
        var formAction = $scope.formAction;//1D, 2D, 3D

        $http.get(ARR_CONTROLLER_ULRS[formAction] + '?' + formData ).then(function(response){
            //https://api.jquery.com/jquery.extend/
            //Clone object http://heyjavascript.com/4-creative-ways-to-clone-objects/
            $rootScope.data2D = jQuery.extend(true, [], response.data);
            $rootScope.filtered = formData;
            resultData = prepareDisplayData(response.data, NOT_INCLUDE_1D_KEYS);
            $rootScope.titres = resultData['titres'];
            $rootScope.practice = resultData['data'];
            switch(formAction){
                case '2D':
                case '3D':
                case '1D':
                default:
                    break;
            }
            if( VERSION_TO_USE == "SportSites" ){ //SportStatistics ){
                updateSportSites2D($rootScope);
            }
            else{
                updateStatistics2D($rootScope);
            }
        });
    } 

    $rootScope.resetForm = function ()
    {
        jQuery("#form_filters")[0].reset();
        $rootScope.sendFilterForm()
    }
    /* EVENTS FILTER FORM  -> Directives filterReady, clearFilters*/
});

app.controller('SportSitesFilterController', function($scope, $http, $rootScope){
    console.log("Dans SportSitesFilterController");
    $rootScope.sendFilterForm = function(){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        var formData = jQuery("#form_filters").serialize();
        var formAction = $scope.formAction;//1D, 2D, 3D

        $http.get(ARR_CONTROLLER_ULRS[formAction] + '?' + formData ).then(function(response){
            //https://api.jquery.com/jquery.extend/
            //Clone object http://heyjavascript.com/4-creative-ways-to-clone-objects/
            $rootScope.data2D = jQuery.extend(true, [], response.data);
            console.log($rootScope.data2D);
            switch(formAction){
                case '2D':
                case '3D':
                case '1D':
                default:
                    break;
            }
            //if( VERSION_TO_USE = "SportSites"; //SportStatistics ){
                //updateStatistics2D($rootScope);
            //}
        });
    } 

    $rootScope.resetForm = function ()
    {
        jQuery("#form_filters")[0].reset();
        $rootScope.sendFilterForm()
    }
    /* EVENTS FILTER FORM  -> Directives filterReady, clearFilters*/
});

/**
 * [Jimmy: Angular Event onChange to send the filters]
 * @return {[type]}        [description]
 * @author Jimmy
 */
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

/**
 * [Jimmy: Angular Event onChange to send the filters]
 * @return {[type]}        [description]
 * @author Jimmy
 */
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

app.directive( 'sendFilters', function( $parse ) {
   return {
       restrict: 'A',
       link: function( $scope, elem, attrs ) {    
            elem.click(function(){
                $scope.resetForm();
            })
        }
    }
});

/**
 * [2D Controller]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @return {[type]}               [description]
 * @author Jimmy
 */
app.controller('SportStatisticsController2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    $rootScope.formAction = "2D";
    console.log("Dans SportStatisticsController2D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, NOT_INCLUDE_FILTER_KEYS);
            $rootScope.filtersData = filtersData;
        });
    }
     /* EVENTS 2D */
    angular.element(document).ready(function () {
        $scope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
        //D3 Event Click
        /*
        
        d3.select("#div_content_2d")
            .on('click', function(){
                var mouseCoords = d3.mouse(this);
                console.log(mouseCoords);
            });
         */
    });
});

app.controller('SportSitesController2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    $rootScope.formAction = "2D";
    console.log("Dans SportSitesController2D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS['filters']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, NOT_INCLUDE_FILTER_KEYS);
            $rootScope.filtersData = filtersData;
        });
    }
     /* EVENTS 2D */
    angular.element(document).ready(function () {
        //D3 Event Click
        
        d3.select("#div_content_2d")
            .on('click', function(){
                var mouseCoords = d3.mouse(this);
                console.log(mouseCoords);
            });
    });
});


/**
 * [displayThirdDimension Method to update the 3D SportStatistics]
 * @param  {[type]} scope [description]
 * @param  {[type]} scene [description]
 * @return {[type]}       [description]
 * @author Jimmmy
 */
function displayThirdDimension(scope, scene){
    scope.$watch('data2D', function (data2D) {
        //width = 1000; //id ->div_content_2d.width
        //height = 910; //id ->div_content_2d.heith
        //Jimmy: For to create the graphs
        removeAll3DColumns();
        COLUMN_LIST = [];
        for ( i in data2D ){
            var columnName = "column_" + i;
            coords3d = decode2DToPercentageCoordsTo3D( data2D[i]['xAxis'], width3D, data2D[i]['yAxis'], height3D);
            
            var planeMat = new THREE.MeshLambertMaterial({color: data2D[i]['color'] }); // color — Line color in hexadecimal. Default is 0xffffff.
            materialColum = new THREE.MeshBasicMaterial({map: planeMat});

            geometry = new THREE.CubeGeometry( (100 + (50 * data2D[i]['percentage']/100) ), (data2D[i]['percentage'] * 10 ), (100 + (50 * data2D[i]['percentage']/100) ) );
            mesh = new THREE.Mesh( geometry, planeMat );
            mesh.position.x = coords3d['x'];
            mesh.position.y = coords3d['y'];
            mesh.position.z = coords3d['z'];
            
            COLUMN_LIST.push(columnName);
            mesh.name = columnName;
            scene.add( mesh );
        }
        animate();
    });
}

/**
 * [3D Controller]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @return {[type]}               [description]
 * @author Jimmy
 */
app.controller('SportStatisticsController3D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "3D";
    $rootScope.formAction = "3D";
    console.log("Dans SportStatisticsController3D");
    if( $rootScope.filtersData == undefined ){
        $http.get(ARR_CONTROLLER_ULRS['1D']).then(function(response){
            var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
            filtersData = excludeFilerKeys(filtersData, NOT_INCLUDE_FILTER_KEYS);
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


/**
 * [3D Controller]
 * @param  {[type]} $scope        [description]
 * @param  {[type]} $http         [description]
 * @return {[type]}               [description]
 * @author Loïc
 */
app.controller('SportSitesController3D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "3D";
    $rootScope.formAction = "3D";
    console.log("Dans SportStatisticsController3D");
    if( $rootScope.filtersData == undefined ){
        
    }
    /* EVENTS 3D */
    angular.element(document).ready(function () {

    });
});

var container, stats;
var camera, scene, renderer;
var COLUMN_LIST = [];

/**
 * [Directive displayThirdDimension]
 * @return {[type]}     [description]
 * @author Jimmy
 */
var controls;
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

        if( CONFIG_VERSION['3D'][VERSION_TO_USE]['OrbitControls'] ){ //enable controls
            controls = new THREE.OrbitControls( camera );
            //controls.maxPolarAngle = 0.8 * Math.PI / 2;
            controls.enableZoom = false;
        }

        if( true ){
            controls = new THREE.FlyControls( camera );

            controls.movementSpeed = 1000;
            controls.domElement = container;
            controls.rollSpeed = Math.PI / 24;
            controls.autoForward = false;
            controls.dragToLook = false;
  
        }

        // LIGHTS
        var light = new THREE.DirectionalLight( 0xaabbff, 0.3 );
        light.position.x = 500;
        light.position.y = 250;
        light.position.z = 800;
        scene.add( light );


        if( CONFIG_VERSION['3D'][VERSION_TO_USE]['enebleSky'] ){ //Jimmy: enable/disable SKY
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

/**
 * [Application Config]
 * @param  {[type]} $routeProvider                  
 * @return {[type]}                   [description]
 * @author Jimmy
 */
app.config(function ($routeProvider){
    //SportStatistics,SportSites
    console.log("app config " + VERSION_TO_USE);
    $routeProvider
        .when('/1D', {
            controller: VERSION_TO_USE + 'Controller1D',
            //controller: 'SportStatisticsController1D',
            templateUrl: 'templates/' + VERSION_TO_USE + '/1D.html'
        })
        .when('/2D', {
            controller: VERSION_TO_USE + 'Controller2D',
            //controller: 'SportStatisticsController2D',
            templateUrl: 'templates/' + VERSION_TO_USE + '/2D.html'
        })
        .when('/3D', {
            controller: VERSION_TO_USE + 'Controller3D',
            //controller: 'SportStatisticsController3D',
            templateUrl: 'templates/' + VERSION_TO_USE + '/3D.html'
        })
        .when('/map', {
            controller: VERSION_TO_USE + 'ControllerHome',
            //controller: 'SportStatisticsControllerHome',
            templateUrl: 'templates/' + VERSION_TO_USE + '/map.html'
        })
        .when('/', {//otherwhise
            controller: VERSION_TO_USE + 'ControllerHome',
            //controller: 'SportStatisticsControllerHome',//Definición del controlador
            templateUrl: 'templates/' + VERSION_TO_USE + '/home.html'//Template or templateUrl
        });
});