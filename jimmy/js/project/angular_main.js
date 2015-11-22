
var app = angular.module('app', ['ngRoute']);//Creation del modulo y los modulos requeridos para la aplicaicón

var listMenuPaths = {//Pending selectedAction
    "Home" : "#/"
    ,"1D" : "#/1D"
    ,"2D" : "#/2D"
    ,"3D" : "#/3D"
};

//Cette fonction serait appelée au démarrage de l'application :
app.run(function($rootScope, $location, $routeParams){ 
    $rootScope.selectedAction = "Home";
});


app.controller('controleur', function($scope, $http){});

app.controller('controller1D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "1D";
    console.log("Dans controller1D");
    $http.get('http://localhost:8888/getJsonData').then(function(response){
        //Affichage de contrôle
        var allData = response.data;
        /*
        var sportsData = [];
        for (i in allData.city.test_data){
            sportsData.push(allData.city.test_data[i]);
        }
        */
        $scope.test_data = allData.root.city.test_data;
    });
});

app.controller('controller2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    console.log("Dans controller2D");
    $http.get('http://localhost:8888/getJsonData').then(function(response){

    });
});

app.controller('controller3D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "3D";
    console.log("Dans controller3D");
    $http.get('http://localhost:8888/getJsonData').then(function(response){
        
    });
});

    /*
    */
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
        .when('/', {//otherwhise
            controller: 'controleur',//Definición del controlador
            templateUrl: 'templates/home.html'//Template or templateUrl
        });

});