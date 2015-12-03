
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
    /*
    $scope.sendFilterForm = function(form){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        //console.log(this.formData);//Serialize Angular
        console.log( jQuery("#form_filter_1D").serialize() );//Serialize Angular
        //$scope.people = Restangular.all('data.json/:user').post($scope.user);
        // REST ANGULAR
        //http://arian-celina.com/implementing-rest-services-in-angularjs-using-restangular/
    } 
    */

    //$http.get('http://localhost:8888/getJsonData').then(function(response){
    $http.get('http://localhost:8888/getDataMongoDb').then(function(response){
        //createAllFilters(allData, "filters_content");//Jquery Id
        var filtersData = toObject(getFilterData(response.data));//Jimmy: toObject used to Cast a Array to a Object
        //console.log("   Filters:");
        //console.log($scope.filtersData);
        
        $scope.filtersData = filtersData;
        $rootScope.city = response.data.city;
        $rootScope.practice = response.data.practice;
    });
});

//https://docs.angularjs.org/guide/forms
app.controller('filterController', function($scope, $http, $rootScope){
//app.controller('filterController', ['$scope', function($scope){
    $scope.sendFilterForm = function(){//https://docs.angularjs.org/api/ng/directive/ngSubmit
        //console.log(this.formData);//Serialize Angular
        var formData = jQuery("#form_filter_1D").serialize();
        
        //console.log( formData );//Serialize Angular
        //$scope.people = Restangular.all('data.json/:user').post($scope.user);
        // REST ANGULAR
        //http://arian-celina.com/implementing-rest-services-in-angularjs-using-restangular/

        //https://docs.angularjs.org/api/ng/service/$http
        //$http.post('http://localhost:8888/getJsonData', jQuery("#form_filter_1D").serializeArray() ).then(function(response){
        $http.get('http://localhost:8888/getJsonData?' + formData ).then(function(response){
            $rootScope.filtered = formData;
            $rootScope.city = response.data.city;
            $rootScope.practice = response.data.practice;
            //console.log("   practice:");
            //console.log($rootScope.practice);
        });
    }  
//}]);
});

app.controller('controller2D', function($scope, $http, $rootScope){
    $rootScope.selectedAction = "2D";
    console.log("Dans controller2D");
    $http.get('http://localhost:8888/filter1D').then(function(response){
        //Affichage de contrôle
        createAllFilters(response.data);
        console.log(response.data);
        $scope.city = response.data.city;
        $scope.practice = response.data.practice;
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