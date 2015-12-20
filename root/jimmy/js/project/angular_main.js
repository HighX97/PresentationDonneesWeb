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
        $scope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;
    });
});



app.controller('filterController', function($scope, $http, $rootScope){
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

app.controller('controller2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    console.log("Dans controller2D");
    $http.get(ARR_CONTROLLER_ULRS[VERSION_TO_USE]['1D']).then(function(response){
        var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
        filtersData = excludeFilerKeys(filtersData, notIncludeFilerKeys);
        $scope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;
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

var width3D = (1000) * (2);
var height3D = (910) * (2);

app.directive('displayThirdDimension', function(){
    var SCREEN_WIDTH = jQuery("#div_content_3d").width();
    var SCREEN_HEIGHT = jQuery("#div_content_3d").width();

    var container, stats;
    var camera, scene, renderer;

    var clock = new THREE.Clock();

    init();
    animate();

   

    function init() {
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
        var textureMap = THREE.ImageUtils.loadTexture('img/Montpellier_OSM_map_with_divisions.png')
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
            
        document.getElementById( 'div_content_3d' ).addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {
        camera.aspect = document.getElementById( 'div_content_3d' ).innerWidth / document.getElementById( 'div_content_3d' ).innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( document.getElementById( 'div_content_3d' ).innerWidth, document.getElementById( 'div_content_3d' ).innerHeight );
    }

    //

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
        stats.update();
    }

    return {
        restrict: 'A',
        link: function (scope, element) {
            
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
    }
});

// Directive contenant le code D3.js
app.directive('sportsStatistics', function() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var width = jQuery("#div_content_3d").width();
            var height = jQuery("#div_content_3d").width();
            var color = d3.scale.category20();
            
            // On récupère les données présentent dans scope.grapheDatas
            // Le $watch a pour but de mettre à jour le graphe dès que les
            // données présentent dans $scope.grapheDatas changent.
            // Ex : suppression ou ajout de noeuds
            scope.$watch('grapheDatas', function (grapheDatas) {
                var force = d3.layout.force()
                    .charge(-120)
                    .linkDistance(30)
                    .size([width, height])
                    .nodes(grapheDatas.nodes)
                    .links(grapheDatas.links)
                    .start();
                
                var svg = d3.select("#div_content_3d").append("svg")
                    .attr("width", width)
                    .attr("height", height);
                
                var link = svg.selectAll(".link")
                    .data(grapheDatas.links)
                    .enter().append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return Math.sqrt(d.value); });
                
                var node = svg.selectAll(".node")
                    .data(grapheDatas.nodes)
                    .enter().append("circle")
                    .attr("class", "node")
                    .attr("r", 5)
                    .style("fill", function(d) { return color(d.group); })
                    .call(force.drag);
                
                node.append("title")
                    .text(function(d) { return d.name; });
                
                force.on("tick", function() {
                    link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                    
                    node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
                });
            });
        }
    }
});

// Controller qui sert à récupérer les données provenant d'un webservice
// Dans notre exemple, les données sont initialisées en dur dans le controller
app.controller('AppCtrl', function ($scope) {
    // Variable grapheDatas ajoutée au scope. C'est cette variable qui est
    // récupérée dans la directive pour générer le graphe
    //
    // Données anonymisées
    $scope.grapheDatas = {
        "nodes":[
            {"name":"Myriel","group":1},
            {"name":"Napoleon","group":1},
            {"name":"Mlle.Baptistine","group":1},
            {"name":"Mme.Magloire","group":1},
            {"name":"CountessdeLo","group":1},
            {"name":"Geborand","group":1},
            {"name":"Champtercier","group":1},
            {"name":"Cravatte","group":1},
            {"name":"Count","group":1},
            {"name":"OldMan","group":1},
            {"name":"Labarre","group":2},
            {"name":"Valjean","group":2},
            {"name":"Marguerite","group":3},
            {"name":"Mme.deR","group":2},
            {"name":"Isabeau","group":2},
            {"name":"Gervais","group":2},
            {"name":"Tholomyes","group":3},
            {"name":"Listolier","group":3},
            {"name":"Fameuil","group":3},
            {"name":"Blacheville","group":3},
            {"name":"Favourite","group":3},
            {"name":"Dahlia","group":3},
            {"name":"Zephine","group":3},
            {"name":"Fantine","group":3},
            {"name":"Mme.Thenardier","group":4},
            {"name":"Thenardier","group":4},
            {"name":"Cosette","group":5},
            {"name":"Javert","group":4},
            {"name":"Fauchelevent","group":0},
            {"name":"Bamatabois","group":2},
            {"name":"Perpetue","group":3},
            {"name":"Simplice","group":2},
            {"name":"Scaufflaire","group":2},
            {"name":"Woman1","group":2},
            {"name":"Judge","group":2},
            {"name":"Champmathieu","group":2},
            {"name":"Brevet","group":2},
            {"name":"Chenildieu","group":2},
            {"name":"Cochepaille","group":2},
            {"name":"Pontmercy","group":4},
            {"name":"Boulatruelle","group":6},
            {"name":"Eponine","group":4},
            {"name":"Anzelma","group":4},
            {"name":"Woman2","group":5},
            {"name":"MotherInnocent","group":0},
            {"name":"Gribier","group":0},
            {"name":"Jondrette","group":7},
            {"name":"Mme.Burgon","group":7},
            {"name":"Gavroche","group":8},
            {"name":"Gillenormand","group":5},
            {"name":"Magnon","group":5},
            {"name":"Mlle.Gillenormand","group":5},
            {"name":"Mme.Pontmercy","group":5},
            {"name":"Mlle.Vaubois","group":5},
            {"name":"Lt.Gillenormand","group":5},
            {"name":"Marius","group":8},
            {"name":"BaronessT","group":5},
            {"name":"Mabeuf","group":8},
            {"name":"Enjolras","group":8},
            {"name":"Combeferre","group":8},
            {"name":"Prouvaire","group":8},
            {"name":"Feuilly","group":8},
            {"name":"Courfeyrac","group":8},
            {"name":"Bahorel","group":8},
            {"name":"Bossuet","group":8},
            {"name":"Joly","group":8},
            {"name":"Grantaire","group":8},
            {"name":"MotherPlutarch","group":9},
            {"name":"Gueulemer","group":4},
            {"name":"Babet","group":4},
            {"name":"Claquesous","group":4},
            {"name":"Montparnasse","group":4},
            {"name":"Toussaint","group":5},
            {"name":"Child1","group":10},
            {"name":"Child2","group":10},
            {"name":"Brujon","group":4},
            {"name":"Mme.Hucheloup","group":8}
        ],
        "links":[
            {"source":1,"target":0,"value":1},
            {"source":2,"target":0,"value":8},
            {"source":3,"target":0,"value":10},
            {"source":3,"target":2,"value":6},
            {"source":4,"target":0,"value":1},
            {"source":5,"target":0,"value":1},
            {"source":6,"target":0,"value":1},
            {"source":7,"target":0,"value":1},
            {"source":8,"target":0,"value":2},
            {"source":9,"target":0,"value":1},
            {"source":11,"target":10,"value":1},
            {"source":11,"target":3,"value":3},
            {"source":11,"target":2,"value":3},
            {"source":11,"target":0,"value":5},
            {"source":12,"target":11,"value":1},
            {"source":13,"target":11,"value":1},
            {"source":14,"target":11,"value":1},
            {"source":15,"target":11,"value":1},
            {"source":17,"target":16,"value":4},
            {"source":18,"target":16,"value":4},
            {"source":18,"target":17,"value":4},
            {"source":19,"target":16,"value":4},
            {"source":19,"target":17,"value":4},
            {"source":19,"target":18,"value":4},
            {"source":20,"target":16,"value":3},
            {"source":20,"target":17,"value":3},
            {"source":20,"target":18,"value":3},
            {"source":20,"target":19,"value":4},
            {"source":21,"target":16,"value":3},
            {"source":21,"target":17,"value":3},
            {"source":21,"target":18,"value":3},
            {"source":21,"target":19,"value":3},
            {"source":21,"target":20,"value":5},
            {"source":22,"target":16,"value":3},
            {"source":22,"target":17,"value":3},
            {"source":22,"target":18,"value":3},
            {"source":22,"target":19,"value":3},
            {"source":22,"target":20,"value":4},
            {"source":22,"target":21,"value":4},
            {"source":23,"target":16,"value":3},
            {"source":23,"target":17,"value":3},
            {"source":23,"target":18,"value":3},
            {"source":23,"target":19,"value":3},
            {"source":23,"target":20,"value":4},
            {"source":23,"target":21,"value":4},
            {"source":23,"target":22,"value":4},
            {"source":23,"target":12,"value":2},
            {"source":23,"target":11,"value":9},
            {"source":24,"target":23,"value":2},
            {"source":24,"target":11,"value":7},
            {"source":25,"target":24,"value":13},
            {"source":25,"target":23,"value":1},
            {"source":25,"target":11,"value":12},
            {"source":26,"target":24,"value":4},
            {"source":26,"target":11,"value":31},
            {"source":26,"target":16,"value":1},
            {"source":26,"target":25,"value":1},
            {"source":27,"target":11,"value":17},
            {"source":27,"target":23,"value":5},
            {"source":27,"target":25,"value":5},
            {"source":27,"target":24,"value":1},
            {"source":27,"target":26,"value":1},
            {"source":28,"target":11,"value":8},
            {"source":28,"target":27,"value":1},
            {"source":29,"target":23,"value":1},
            {"source":29,"target":27,"value":1},
            {"source":29,"target":11,"value":2},
            {"source":30,"target":23,"value":1},
            {"source":31,"target":30,"value":2},
            {"source":31,"target":11,"value":3},
            {"source":31,"target":23,"value":2},
            {"source":31,"target":27,"value":1},
            {"source":32,"target":11,"value":1},
            {"source":33,"target":11,"value":2},
            {"source":33,"target":27,"value":1},
            {"source":34,"target":11,"value":3},
            {"source":34,"target":29,"value":2},
            {"source":35,"target":11,"value":3},
            {"source":35,"target":34,"value":3},
            {"source":35,"target":29,"value":2},
            {"source":36,"target":34,"value":2},
            {"source":36,"target":35,"value":2},
            {"source":36,"target":11,"value":2},
            {"source":36,"target":29,"value":1},
            {"source":37,"target":34,"value":2},
            {"source":37,"target":35,"value":2},
            {"source":37,"target":36,"value":2},
            {"source":37,"target":11,"value":2},
            {"source":37,"target":29,"value":1},
            {"source":38,"target":34,"value":2},
            {"source":38,"target":35,"value":2},
            {"source":38,"target":36,"value":2},
            {"source":38,"target":37,"value":2},
            {"source":38,"target":11,"value":2},
            {"source":38,"target":29,"value":1},
            {"source":39,"target":25,"value":1},
            {"source":40,"target":25,"value":1},
            {"source":41,"target":24,"value":2},
            {"source":41,"target":25,"value":3},
            {"source":42,"target":41,"value":2},
            {"source":42,"target":25,"value":2},
            {"source":42,"target":24,"value":1},
            {"source":43,"target":11,"value":3},
            {"source":43,"target":26,"value":1},
            {"source":43,"target":27,"value":1},
            {"source":44,"target":28,"value":3},
            {"source":44,"target":11,"value":1},
            {"source":45,"target":28,"value":2},
            {"source":47,"target":46,"value":1},
            {"source":48,"target":47,"value":2},
            {"source":48,"target":25,"value":1},
            {"source":48,"target":27,"value":1},
            {"source":48,"target":11,"value":1},
            {"source":49,"target":26,"value":3},
            {"source":49,"target":11,"value":2},
            {"source":50,"target":49,"value":1},
            {"source":50,"target":24,"value":1},
            {"source":51,"target":49,"value":9},
            {"source":51,"target":26,"value":2},
            {"source":51,"target":11,"value":2},
            {"source":52,"target":51,"value":1},
            {"source":52,"target":39,"value":1},
            {"source":53,"target":51,"value":1},
            {"source":54,"target":51,"value":2},
            {"source":54,"target":49,"value":1},
            {"source":54,"target":26,"value":1},
            {"source":55,"target":51,"value":6},
            {"source":55,"target":49,"value":12},
            {"source":55,"target":39,"value":1},
            {"source":55,"target":54,"value":1},
            {"source":55,"target":26,"value":21},
            {"source":55,"target":11,"value":19},
            {"source":55,"target":16,"value":1},
            {"source":55,"target":25,"value":2},
            {"source":55,"target":41,"value":5},
            {"source":55,"target":48,"value":4},
            {"source":56,"target":49,"value":1},
            {"source":56,"target":55,"value":1},
            {"source":57,"target":55,"value":1},
            {"source":57,"target":41,"value":1},
            {"source":57,"target":48,"value":1},
            {"source":58,"target":55,"value":7},
            {"source":58,"target":48,"value":7},
            {"source":58,"target":27,"value":6},
            {"source":58,"target":57,"value":1},
            {"source":58,"target":11,"value":4},
            {"source":59,"target":58,"value":15},
            {"source":59,"target":55,"value":5},
            {"source":59,"target":48,"value":6},
            {"source":59,"target":57,"value":2},
            {"source":60,"target":48,"value":1},
            {"source":60,"target":58,"value":4},
            {"source":60,"target":59,"value":2},
            {"source":61,"target":48,"value":2},
            {"source":61,"target":58,"value":6},
            {"source":61,"target":60,"value":2},
            {"source":61,"target":59,"value":5},
            {"source":61,"target":57,"value":1},
            {"source":61,"target":55,"value":1},
            {"source":62,"target":55,"value":9},
            {"source":62,"target":58,"value":17},
            {"source":62,"target":59,"value":13},
            {"source":62,"target":48,"value":7},
            {"source":62,"target":57,"value":2},
            {"source":62,"target":41,"value":1},
            {"source":62,"target":61,"value":6},
            {"source":62,"target":60,"value":3},
            {"source":63,"target":59,"value":5},
            {"source":63,"target":48,"value":5},
            {"source":63,"target":62,"value":6},
            {"source":63,"target":57,"value":2},
            {"source":63,"target":58,"value":4},
            {"source":63,"target":61,"value":3},
            {"source":63,"target":60,"value":2},
            {"source":63,"target":55,"value":1},
            {"source":64,"target":55,"value":5},
            {"source":64,"target":62,"value":12},
            {"source":64,"target":48,"value":5},
            {"source":64,"target":63,"value":4},
            {"source":64,"target":58,"value":10},
            {"source":64,"target":61,"value":6},
            {"source":64,"target":60,"value":2},
            {"source":64,"target":59,"value":9},
            {"source":64,"target":57,"value":1},
            {"source":64,"target":11,"value":1},
            {"source":65,"target":63,"value":5},
            {"source":65,"target":64,"value":7},
            {"source":65,"target":48,"value":3},
            {"source":65,"target":62,"value":5},
            {"source":65,"target":58,"value":5},
            {"source":65,"target":61,"value":5},
            {"source":65,"target":60,"value":2},
            {"source":65,"target":59,"value":5},
            {"source":65,"target":57,"value":1},
            {"source":65,"target":55,"value":2},
            {"source":66,"target":64,"value":3},
            {"source":66,"target":58,"value":3},
            {"source":66,"target":59,"value":1},
            {"source":66,"target":62,"value":2},
            {"source":66,"target":65,"value":2},
            {"source":66,"target":48,"value":1},
            {"source":66,"target":63,"value":1},
            {"source":66,"target":61,"value":1},
            {"source":66,"target":60,"value":1},
            {"source":67,"target":57,"value":3},
            {"source":68,"target":25,"value":5},
            {"source":68,"target":11,"value":1},
            {"source":68,"target":24,"value":1},
            {"source":68,"target":27,"value":1},
            {"source":68,"target":48,"value":1},
            {"source":68,"target":41,"value":1},
            {"source":69,"target":25,"value":6},
            {"source":69,"target":68,"value":6},
            {"source":69,"target":11,"value":1},
            {"source":69,"target":24,"value":1},
            {"source":69,"target":27,"value":2},
            {"source":69,"target":48,"value":1},
            {"source":69,"target":41,"value":1},
            {"source":70,"target":25,"value":4},
            {"source":70,"target":69,"value":4},
            {"source":70,"target":68,"value":4},
            {"source":70,"target":11,"value":1},
            {"source":70,"target":24,"value":1},
            {"source":70,"target":27,"value":1},
            {"source":70,"target":41,"value":1},
            {"source":70,"target":58,"value":1},
            {"source":71,"target":27,"value":1},
            {"source":71,"target":69,"value":2},
            {"source":71,"target":68,"value":2},
            {"source":71,"target":70,"value":2},
            {"source":71,"target":11,"value":1},
            {"source":71,"target":48,"value":1},
            {"source":71,"target":41,"value":1},
            {"source":71,"target":25,"value":1},
            {"source":72,"target":26,"value":2},
            {"source":72,"target":27,"value":1},
            {"source":72,"target":11,"value":1},
            {"source":73,"target":48,"value":2},
            {"source":74,"target":48,"value":2},
            {"source":74,"target":73,"value":3},
            {"source":75,"target":69,"value":3},
            {"source":75,"target":68,"value":3},
            {"source":75,"target":25,"value":3},
            {"source":75,"target":48,"value":1},
            {"source":75,"target":41,"value":1},
            {"source":75,"target":70,"value":1},
            {"source":75,"target":71,"value":1},
            {"source":76,"target":64,"value":1},
            {"source":76,"target":65,"value":1},
            {"source":76,"target":66,"value":1},
            {"source":76,"target":63,"value":1},
            {"source":76,"target":62,"value":1},
            {"source":76,"target":48,"value":1},
            {"source":76,"target":58,"value":1}
        ]
    };
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