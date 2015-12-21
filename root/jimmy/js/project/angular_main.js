//http://arian-celina.com/implementing-rest-services-in-angularjs-using-restangular/
//https://docs.angularjs.org/guide/forms
//https://docs.angularjs.org/api/ng/directive/ngSubmit

/*****CONFIG*****/
var VERSION_TO_USE = "jimmy"; //jimmy,loic
var ARR_CONTROLLER_ULRS = {
    'jimmy': {
        '1D': 'http://localhost:8888/getDataMongoDb',
        '2D': 'http://localhost:8888/getDataMongoDb',
        '3D': 'http://localhost:8888/getDataMongoDb'
    },
    'loic': {
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
var notIncludeFilerKeys = ['_id', 'x1', 'y1'];
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
    console.log("Dans controller1D");
    /*
    $scope.sendFilterForm = function(form){
        //console.log(this.formData);//Serialize Angular
        console.log( jQuery("#form_filter_1D").serialize() );//Serialize Angular
        //$scope.people = Restangular.all('data.json/:user').post($scope.user);
        // REST ANGULAR
    } 
    */
    //$http.get('http://localhost:8888/getJsonData').then(function(response){
    $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D']).then(function(response){
        var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
        filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
        $rootScope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;
    });
});



app.controller('filterController', function($scope, $http, $rootScope){
    console.log("Dans filterController");
    $scope.sendFilterForm = function(){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        var formData = jQuery("#form_filters").serialize();
        $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D'] + '?' + formData ).then(function(response){
        //$http.get('http://localhost:8888/getJsonData?' + formData ).then(function(response){
            $rootScope.filtered = formData;
            response.data = ( response.data[0] !== undefined )? response.data[0]: response.data;//Jimmy: filter to use only a object
            $rootScope.city = response.data.city;
            $rootScope.practice = response.data.practice;
        });
    } 
});

/*2D*/

function enconde2DToPercentageCoords (px_coord, max_px_coord)
{
    return px_coord / max_px_coord;
}

function decode2DToPercentageCoordsTo2D(per_coord, max_px_coord)
{
    return per_coord * max_px_coord;
}

function decode2DToPercentageCoordsTo3D(per_coord_x, new_px_coord_x, per_coord_y, new_px_coord_y)
{
    var result = { x: 0, y: 0, z: 0};
    var half_new_px_coord_x = new_px_coord_x / 2;
    var half_per_coord_y = new_px_coord_y / 2;
    result['x'] = ( (( per_coord_x * 2 ) - 1 ) * half_new_px_coord_x); //Jimmy: Important -1
    result['z'] = ( (1- ( per_coord_y * 2 ) ) * half_per_coord_y); //Jimmy: Important 1 -
    result['y'] = 0 //Jimmy: y = 0;  y -> z
    result['angle'] = Math.atan(result['x'] / result['y']); //Jimmy: x = 0;  x -> z
    //https://en.wikipedia.org/wiki/Spherical_coordinate_system
    //r={\sqrt {x^{2}+y^{2}+z^{2}}} - > \varphi =\operatorname {arctan} \left({\frac {y}{x}}\right)
    return result;
}


function updateStatistics2D()
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();

    d3.select("#div_content_2d")
        .on('click', function(){
            var mouseCoords = d3.mouse(this);
            //alert("x_axis: " +  mouseCoords);
            //console.log(' {"x_axis": ' +  mouseCoords[0] + ', "y_axis": ' + mouseCoords[1] + ', "radius": 20, "color" : "red" }');
            console.log(' {"x_axis": ' +  enconde2DToPercentageCoords(mouseCoords[0], width) + ', "y_axis": ' + enconde2DToPercentageCoords(mouseCoords[1], width) + ', "radius": 20, "color" : "red" }');
        });

    var svg = getSvg2D();
    //: Jimmy: colors -> http://www.color-hex.com/random.php
    var jsonCircles = [
        { "x_axis": 0.115, "y_axis": 0.197802197802198, "radius": 20, "color" : "#de6154", "id" : 01, "value" : 4, "text": "quartier_name_01"},
        { "x_axis": 0.115, "y_axis": 0.351648351648352, "radius": 20, "color" : "#059788", "id" : 02, "value" : 4, "text": "quartier_name_02"},
        { "x_axis": 0.148, "y_axis": 0.450549450549451, "radius": 20, "color" : "#0085c1", "id" : 03, "value" : 4, "text": "quartier_name_03"},
        { "x_axis": 0.17, "y_axis": 0.582417582417582, "radius": 20, "color" : "#8ee35e", "id" : 04, "value" : 4, "text": "quartier_name_04"},
        { "x_axis": 0.332, "y_axis": 0.225274725274725, "radius": 20, "color" : "#a7aebd", "id" : 05, "value" : 4, "text": "quartier_name_05"},
        { "x_axis": 0.273, "y_axis": 0.352747252747253, "radius": 20, "color" : "#577355", "id" : 06, "value" : 4, "text": "quartier_name_06"},
        { "x_axis": 0.345, "y_axis": 0.112087912087912, "radius": 20, "color" : "#97e007", "id" : 07, "value" : 4, "text": "quartier_name_07"},
        { "x_axis": 0.33, "y_axis": 0.43956043956044, "radius": 20, "color" : "#855d6d", "id" : 08, "value" : 4, "text": "quartier_name_08"},
        { "x_axis": 0.3, "y_axis": 0.538461538461538, "radius": 20, "color" : "#22b23d", "id" : 09, "value" : 4, "text": "quartier_name_09"},
        { "x_axis": 0.29, "y_axis": 0.681318681318681, "radius": 20, "color" : "#efa199", "id" : 10, "value" : 4, "text": "quartier_name_10"},
        { "x_axis": 0.38, "y_axis": 0.615384615384615, "radius": 20, "color" : "#dd91a6", "id" : 11, "value" : 4, "text": "quartier_name_11"},
        { "x_axis": 0.425, "y_axis": 0.781318681318681, "radius": 20, "color" : "#a0187b", "id" : 12, "value" : 4, "text": "quartier_name_12"},
        { "x_axis": 0.666, "y_axis": 0.434065934065934, "radius": 20, "color" : "#53b310", "id" : 13, "value" : 4, "text": "quartier_name_13"},
        { "x_axis": 0.57, "y_axis": 0.647252747252747, "radius": 20, "color" : "#c2cea1", "id" : 14, "value" : 4, "text": "quartier_name_14"},
        { "x_axis": 0.46, "y_axis": 0.381318681318681, "radius": 20, "color" : "#e378da", "id" : 15, "value" : 4, "text": "quartier_name_15"},
        { "x_axis": 0.895, "y_axis": 0.406593406593407, "radius": 20, "color" : "#67cfaa", "id" : 16, "value" : 4, "text": "quartier_name_16"},
        { "x_axis": 0.768, "y_axis": 0.447252747252747, "radius": 20, "color" : "#9078c9", "id" : 17, "value" : 4, "text": "quartier_name_17"},
        { "x_axis": 0.81, "y_axis": 0.598901098901099, "radius": 20, "color" : "#f01bfd", "id" : 18, "value" : 4, "text": "quartier_name_18"},
        { "x_axis": 0.646, "y_axis": 0.658241758241758, "radius": 20, "color" : "#3e36e1", "id" : 19, "value" : 4, "text": "quartier_name_19"},
        { "x_axis": 0.531, "y_axis": 0.707692307692308, "radius": 20, "color" : "#a13a56", "id" : 20, "value" : 4, "text": "quartier_name_20"},
        { "x_axis": 0.562, "y_axis": 0.553846153846154, "radius": 20, "color" : "#d5df64", "id" : 21, "value" : 4, "text": "quartier_name_21"},
        { "x_axis": 0.545, "y_axis": 0.498901098901099, "radius": 20, "color" : "#5aa576", "id" : 22, "value" : 4, "text": "quartier_name_22"},
        { "x_axis": 0.616, "y_axis": 0.502197802197802, "radius": 20, "color" : "#291e9e", "id" : 23, "value" : 4, "text": "quartier_name_23"},
        { "x_axis": 0.579, "y_axis": 0.393406593406593, "radius": 20, "color" : "#2ba56c", "id" : 24, "value" : 4, "text": "quartier_name_24"},
        { "x_axis": 0.492, "y_axis": 0.469230769230769, "radius": 20, "color" : "#b230c5", "id" : 25, "value" : 4, "text": "quartier_name_25"},
        { "x_axis": 0.493, "y_axis": 0.568131868131868, "radius": 20, "color" : "#888879", "id" : 26, "value" : 4, "text": "quartier_name_26"},
        { "x_axis": 0.423, "y_axis": 0.545054945054945, "radius": 20, "color" : "#f24992", "id" : 27, "value" : 4, "text": "quartier_name_27"},
        { "x_axis": 0.421, "y_axis": 0.473626373626374, "radius": 20, "color" : "#c8f347", "id" : 28, "value" : 4, "text": "quartier_name_28"},
        { "x_axis": 0.555, "y_axis": 0.268131868131868, "radius": 20, "color" : "#9d953a", "id" : 29, "value" : 4, "text": "quartier_name_29"}
        
    ];
    
    
    var circles = svg.selectAll("circle")
        .data(jsonCircles)
        .enter()
        .append("circle")
    ;
    
    var nodes = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(jsonCircles)
        .enter()
        // Add one g element for each data node here.
        .append("g")
        // Position the g element like the circle element used to be.
        .attr("transform", function(d, i) {
            return "translate(" + d.x_axis + "," + d.y_axis + ")";
        });
    ;

    
    // Add a text element to the previously added g element.
    nodes.append("text")
         .attr("text-anchor", "middle")
         .text(function(d) {
           //return "" + d.x_axis + "," + d.y_axis + "";
           //return "" + d.text + ":\n " + d.value + "";
           return "" + d.id + ": " + d.value + "%";
    });


    var circleAttributes = circles
        .attr("cx", function (d) { return decode2DToPercentageCoordsTo2D(d.x_axis, width); })
        .attr("cy", function (d) { return decode2DToPercentageCoordsTo2D(d.y_axis, height); })
        .attr("r", function (d) { return d.radius; })
        .style("fill", function(d) { return d.color; });
}

function getSvg2D()
{
    var svg = d3.select("#div_content_2d svg");
    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();
    //console.log(svg);
    //if( svg == undefined ){
        svg = d3.select("#div_content_2d")//Selector div to render
            .append("svg")//add Svg
            .attr("width", width)//Define size
            .attr("height", height)
        ;
    //}
    return svg;
}


app.controller('controller2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    console.log("Dans controller2D");
    $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D']).then(function(response){
        var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
        filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
        $scope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;
        updateStatistics2D();
    });
});


app.controller('controller3D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "3D";
    console.log("Dans controller3D");
    $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D']).then(function(response){
        var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
        filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
        $scope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;

        $rootScope.data3D = [
            { "x_axis": 0.115, "y_axis": 0.197802197802198, "radius": 20, "color" : "#de6154", "id" : 01, "value" : 4, "text": "quartier_name_01"},
            { "x_axis": 0.115, "y_axis": 0.351648351648352, "radius": 20, "color" : "#059788", "id" : 02, "value" : 4, "text": "quartier_name_02"},
            { "x_axis": 0.148, "y_axis": 0.450549450549451, "radius": 20, "color" : "#0085c1", "id" : 03, "value" : 4, "text": "quartier_name_03"},
            { "x_axis": 0.17, "y_axis": 0.582417582417582, "radius": 20, "color" : "#8ee35e", "id" : 04, "value" : 4, "text": "quartier_name_04"},
            { "x_axis": 0.332, "y_axis": 0.225274725274725, "radius": 20, "color" : "#a7aebd", "id" : 05, "value" : 4, "text": "quartier_name_05"},
            { "x_axis": 0.273, "y_axis": 0.352747252747253, "radius": 20, "color" : "#577355", "id" : 06, "value" : 4, "text": "quartier_name_06"},
            { "x_axis": 0.345, "y_axis": 0.112087912087912, "radius": 20, "color" : "#97e007", "id" : 07, "value" : 4, "text": "quartier_name_07"},
            { "x_axis": 0.33, "y_axis": 0.43956043956044, "radius": 20, "color" : "#855d6d", "id" : 08, "value" : 4, "text": "quartier_name_08"},
            { "x_axis": 0.3, "y_axis": 0.538461538461538, "radius": 20, "color" : "#22b23d", "id" : 09, "value" : 4, "text": "quartier_name_09"},
            { "x_axis": 0.29, "y_axis": 0.681318681318681, "radius": 20, "color" : "#efa199", "id" : 10, "value" : 4, "text": "quartier_name_10"},
            { "x_axis": 0.38, "y_axis": 0.615384615384615, "radius": 20, "color" : "#dd91a6", "id" : 11, "value" : 4, "text": "quartier_name_11"},
            { "x_axis": 0.425, "y_axis": 0.781318681318681, "radius": 20, "color" : "#a0187b", "id" : 12, "value" : 4, "text": "quartier_name_12"},
            { "x_axis": 0.666, "y_axis": 0.434065934065934, "radius": 20, "color" : "#53b310", "id" : 13, "value" : 4, "text": "quartier_name_13"},
            { "x_axis": 0.57, "y_axis": 0.647252747252747, "radius": 20, "color" : "#c2cea1", "id" : 14, "value" : 4, "text": "quartier_name_14"},
            { "x_axis": 0.46, "y_axis": 0.381318681318681, "radius": 20, "color" : "#e378da", "id" : 15, "value" : 4, "text": "quartier_name_15"},
            { "x_axis": 0.895, "y_axis": 0.406593406593407, "radius": 20, "color" : "#67cfaa", "id" : 16, "value" : 4, "text": "quartier_name_16"},
            { "x_axis": 0.768, "y_axis": 0.447252747252747, "radius": 20, "color" : "#9078c9", "id" : 17, "value" : 4, "text": "quartier_name_17"},
            { "x_axis": 0.81, "y_axis": 0.598901098901099, "radius": 20, "color" : "#f01bfd", "id" : 18, "value" : 4, "text": "quartier_name_18"},
            { "x_axis": 0.646, "y_axis": 0.658241758241758, "radius": 20, "color" : "#3e36e1", "id" : 19, "value" : 4, "text": "quartier_name_19"},
            { "x_axis": 0.531, "y_axis": 0.707692307692308, "radius": 20, "color" : "#a13a56", "id" : 20, "value" : 4, "text": "quartier_name_20"},
            { "x_axis": 0.562, "y_axis": 0.553846153846154, "radius": 20, "color" : "#d5df64", "id" : 21, "value" : 4, "text": "quartier_name_21"},
            { "x_axis": 0.545, "y_axis": 0.498901098901099, "radius": 20, "color" : "#5aa576", "id" : 22, "value" : 4, "text": "quartier_name_22"},
            { "x_axis": 0.616, "y_axis": 0.502197802197802, "radius": 20, "color" : "#291e9e", "id" : 23, "value" : 4, "text": "quartier_name_23"},
            { "x_axis": 0.579, "y_axis": 0.393406593406593, "radius": 20, "color" : "#2ba56c", "id" : 24, "value" : 4, "text": "quartier_name_24"},
            { "x_axis": 0.492, "y_axis": 0.469230769230769, "radius": 20, "color" : "#b230c5", "id" : 25, "value" : 4, "text": "quartier_name_25"},
            { "x_axis": 0.493, "y_axis": 0.568131868131868, "radius": 20, "color" : "#888879", "id" : 26, "value" : 4, "text": "quartier_name_26"},
            { "x_axis": 0.423, "y_axis": 0.545054945054945, "radius": 20, "color" : "#f24992", "id" : 27, "value" : 4, "text": "quartier_name_27"},
            { "x_axis": 0.421, "y_axis": 0.473626373626374, "radius": 20, "color" : "#c8f347", "id" : 28, "value" : 4, "text": "quartier_name_28"},
            { "x_axis": 0.555, "y_axis": 0.268131868131868, "radius": 20, "color" : "#9d953a", "id" : 29, "value" : 4, "text": "quartier_name_29"}
            
        ];
    });
});



app.directive('displayThirdDimension-', function(){
    init3D();
    animate3D();
    return {
        restrict: 'A',
        link: function (scope, element) {
            displayThirdDimension(scope)
        }
    }
});
/*
 */

function displayThirdDimension(scope){
    scope.$watch('data3D', function (data3D) {
        console.log(data3D);
        //width = 1000; //id ->div_content_2d.width
        //height = 910; //id ->div_content_2d.heith
        //Jimmy: For to create the graphs
        for ( i in data3D ){
            coords3d = decode2DToPercentageCoordsTo3D( data3D[i]['x_axis'], width3D, data3D[i]['y_axis'], height3D);
            console.log(coords3d);

            //var planeMat = new THREE.MeshLambertMaterial({color: 0x666699}); // color — Line color in hexadecimal. Default is 0xffffff.
            var planeMat = new THREE.MeshLambertMaterial({color: data3D[i]['color'] }); // color — Line color in hexadecimal. Default is 0xffffff.
            materialColum = new THREE.MeshBasicMaterial({map: planeMat});

            geometry = new THREE.CubeGeometry( 20, 500, 20 );
            mesh = new THREE.Mesh( geometry, planeMat );
            mesh.position.x = coords3d['x'];
            mesh.position.y = coords3d['y'];
            mesh.position.z = coords3d['z'];
            scene.add( mesh );
        }
    });
}


function init3D() {
    var clock = new THREE.Clock();
    container = document.createElement( 'div' );
    document.getElementById( 'div_content_3d' ).appendChild( container );
    // CAMERA
    /*
    PerspectiveCamera( fov, aspect, near, far )

    fov — Camera frustum vertical field of view.
    aspect — Camera frustum aspect ratio.
    near — Camera frustum near plane.
    far — Camera frustum far plane.
     */
    camera = new THREE.PerspectiveCamera( 80, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
    camera.position.set( 0, 1000, 300 );
    //Jimmy: position to have space to rotate

    // SCENE
    scene = new THREE.Scene();
    
    // CONTROLS
    controls = new THREE.OrbitControls( camera );
    controls.maxPolarAngle = 0.8 * Math.PI / 2;
    controls.enableZoom = false;

    // LIGHTS
    var light = new THREE.DirectionalLight( 0xaabbff, 0.3 );
    light.position.x = 500;
    light.position.y = 250;
    light.position.z = 800;
    scene.add( light );

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

    //Jimmy: Add Map Texture
    var texLoader = new THREE.TextureLoader();
    var textureMap = texLoader.load("img/Montpellier_OSM_map_with_divisions.png");

    /*
    Jimmy: Deprecated
    var textureMap = THREE.ImageUtils.loadTexture('img/Montpellier_OSM_map_with_divisions.png')
     */
    material = new THREE.MeshBasicMaterial({map: textureMap});


    if( true ){ //Jimmy: enable/disable SKY
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
    stats = new Stats();
    container.appendChild( stats.domElement );


    //Jimmy: Default plane
    geometry = new THREE.CubeGeometry( width3D, 1, height3D );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    /*
    
    var columnTexture = THREE.ImageUtils.loadTexture('rocks.jpg');
    columnTexture.wrapS = columnTexture.wrapT = THREE.RepeatWrapping;
    columnTexture.repeat.set( 10, 1);
     */
    
    var planeMat = new THREE.MeshLambertMaterial({color: 0x666699}); // color — Line color in hexadecimal. Default is 0xffffff.
    materialColum = new THREE.MeshBasicMaterial({map: planeMat});

    geometry = new THREE.CubeGeometry( 20, 500, 20 );
    mesh = new THREE.Mesh( geometry, planeMat );
    mesh.position.x = 0;
    mesh.position.y = 100;
    mesh.position.z = 150;
    //scene.add( mesh );

    var planeMat2 = new THREE.MeshLambertMaterial({color: 0x0085c1}); // color — Line color in hexadecimal. Default is 0xffffff.
    materialColum = new THREE.MeshBasicMaterial({map: planeMat2});

    geometry = new THREE.CubeGeometry( 20, 500, 20 );
    mesh2 = new THREE.Mesh( geometry, planeMat2 );
    mesh2.position.x = 0;
    mesh2.position.y = 200;
    mesh2.position.z = -100;
    //scene.add( mesh2 );
        
    document.getElementById( 'div_content_3d' ).addEventListener( 'resize', onWindowResize3D, false );

}

function onWindowResize3D() {
    camera.aspect = document.getElementById( 'div_content_3d' ).innerWidth / document.getElementById( 'div_content_3d' ).innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( document.getElementById( 'div_content_3d' ).innerWidth, document.getElementById( 'div_content_3d' ).innerHeight );
}

//

function animate3D() {
    requestAnimationFrame( animate3D );
    renderer.render( scene, camera );
    stats.update();
}





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