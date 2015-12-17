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
    });
});



// Directive contenant le code D3.js
app.directive('sportsStatistics', function() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var width = 450;
            var height = 400;
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
                
                var svg = d3.select("body").append("svg")
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