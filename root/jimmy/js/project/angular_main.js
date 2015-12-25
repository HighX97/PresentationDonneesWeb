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
    /*
    $rootScope.sendFilterForm = function(form){
        //console.log(this.formData);//Serialize Angular
        console.log( jQuery("#form_filter_1D").serialize() );//Serialize Angular
        //$scope.people = Restangular.all('data.json/:user').post($scope.user);
        // REST ANGULAR
    } 
    */
    //$http.get('http://localhost:8888/getJsonData').then(function(response){
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

//: Jimmy: colors -> http://www.color-hex.com/random.php
var jsonCircles = [
    {   "activity": "run",  "practiceDate": ("2014-04-30T14:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Boutonnet", "nameSubQuarter": "Montpellier Centre", "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.46056810727991854,   "yAxis": 0.37543859649122807,   "color": "#291e9e"  },
    {   "activity": "soccer",   "practiceDate": ("2010-05-30T15:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Aiguelongues",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.3663325183074875,    "yAxis": 0.24385964912280703,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-06-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Halles de la paillade", "nameSubQuarter": "Mosson", "nameCity": "Montpellier",  "genre": "F",   "xAxis": 0.12573101454808897,   "yAxis": 0.3192982456140351,    "color": "#855d6d"  },
    {   "activity": "swimming", "practiceDate": ("2011-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Tonnelles", "nameSubQuarter": "Les Cevennes",   "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.33124479900924186,   "yAxis": 0.43082706766917295,   "color": "#d5df64"  },
    {   "activity": "basket-ball",  "practiceDate": ("2011-04-25T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Les Beaux Arts",    "nameSubQuarter": "Montpellier Centre", "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.4154553253250313,    "yAxis": 0.48370927318295737,   "color": "#291e9e"  },
    {   "activity": "run",  "practiceDate": ("2014-04-30T14:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Aiguelongues",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.3663325183074875,    "yAxis": 0.24385964912280703,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2014-04-30T14:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Place Carnot",  "nameSubQuarter": "Pres d'Arenes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5688387839716479,    "yAxis": 0.6348370927318295,    "color": "#a0187b"  },
    {   "activity": "run",  "practiceDate": ("2014-04-30T14:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Celleneuve",    "nameSubQuarter": "Mosson", "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.15981622758067043,   "yAxis": 0.4546365914786967,    "color": "#855d6d"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Hotel de departement",  "nameSubQuarter": "Les Cevennes",   "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.27811196692904133,   "yAxis": 0.3506265664160401,    "color": "#d5df64"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Boutonnet", "nameSubQuarter": "Montpellier Centre", "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.46056810727991854,   "yAxis": 0.37543859649122807,   "color": "#291e9e"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "basket-ball",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Aiguelongues",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.3663325183074875,    "yAxis": 0.24385964912280703,   "color": "#de6154"  },
    {   "activity": "basket-ball",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Hotel de departement",  "nameSubQuarter": "Les Cevennes",   "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.27811196692904133,   "yAxis": 0.3506265664160401,    "color": "#d5df64"  },
    {   "activity": "basket-ball",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "basket-ball",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "basket-ball",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "run",  "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "swimming", "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "taekwondo",    "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  },
    {   "activity": "soccer",   "practiceDate": ("2010-04-30T00:00:00.000Z"),    "radius": 20, "nbHour": 1,    "nameQuarter": "Saint Lazare",  "nameSubQuarter": "Hopitaux Facultes",  "nameCity": "Montpellier",  "genre": "M",   "xAxis": 0.5648287589089912,    "yAxis": 0.22180451127819548,   "color": "#de6154"  }
];



function updateLegend($rootScope)
{
    var resultHtml = "";
    var arrControlDuplicates = [];
    var columToDisplay = 'nameQuarter'; //'nameSubQuarter', 'nameSubQuarter'
    var legend2DData = [];
    for (i in $rootScope.data2D){
        if( arrControlDuplicates.indexOf($rootScope.data2D[i][columToDisplay]) == -1 ){
            arrControlDuplicates.push($rootScope.data2D[i][columToDisplay]);
            legend2DData.push($rootScope.data2D[i]);
            
            //Jquery
            //tmpRow = addColorToQuartier($rootScope.data2D[i], columToDisplay);
            //resultHtml += "<div> " + tmpRow[columToDisplay] + " - " + tmpRow['nbHoursQ'] + " - " + tmpRow['percentageQ'] + " %</div>"
        }
    }
    //Angular 
    $rootScope.legend2DData = legend2DData;
    //Jquery
    //jQuery('#legend2D').html(resultHtml);
}

function updateStatistics2D($rootScope)
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    updateLegend($rootScope);

    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();

    var svg = getSvg2D();
    
    var circles = svg.selectAll("circle")
        .data($rootScope.data2D)
        .enter()
        .append("circle");
    
    var circleAttributes = circles
        .attr("cx", function (d) { return decode2DToPercentageCoordsTo2D(d.xAxis, width); })
        .attr("cy", function (d) { return decode2DToPercentageCoordsTo2D(d.yAxis, height); })
        .attr("r", function (d) { return (15 + d.percentage * 0.25); })//Jimmy: circle's proportion
        .attr("cursor", 'pointer')//Jimmy: Cursor
        .on("click", function(d){
            console.log(' Info ', d);
        })
        .on("mouseover", function(d){
            console.log('nameQuarter: ', d.nameQuarter + ', nameSubQuarter: ', d.nameSubQuarter);
            
        })
        .on("mouseenter", function(d){
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',3)
                .attr("r", (15 + d.percentage * 0.25) * 1.5 );
            
        })
        .on("mouseleave", function(d){
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',0)
                .attr('stroke-width',0)
                .attr("r", (15 + d.percentage * 0.25) );
            
        })
        .style("fill", function(d) { return d.color; });
    
    //Add the SVG Text Element to the svgContainer
    var text = svg.selectAll("text")
        .data($rootScope.data2D)
        .enter()
        .append("text");
        
    //Add SVG Text Element Attributes
    var textLabels = text
        .attr("x", function(d) { return decode2DToPercentageCoordsTo2D(d.xAxis, width); })
        .attr("y", function(d) { return decode2DToPercentageCoordsTo2D(d.yAxis, height); })
        .text( function (d) { return "" + d.percentage +"%"; })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "10px")
        .attr("fill", "white")

    
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

            $rootScope.data3D = $rootScope.data2D;
        });
    }
    /* EVENTS 3D */
    angular.element(document).ready(function () {
        $rootScope.sendFilterForm();//Jimmy: Call sendFilterForm() when document it's ready to always update the information
    });
});

//all_filters
/*

function addEventFilters(){
    jQuery('#form_filters select')
      .change(function () {
        var str = "";
        jQuery( "select option:selected" ).each(function() {
            str += jQuery( this ).text() + " ";
        });
        console.log(str);
    })
    .change();
}
 */


// ******** EVENTS **********
/*


 */

    /*
app.directive( 'displaySecondDimenstion', function( $parse ) {
    console.log('display-second-dimenstion');
    return {
    
        restrict: 'A',
        link: function ($scope, elem, attrs){
            elem.ready(function(){
                $scope.$apply(function(){
                    console.log('asas');
                });
            });
        }
    }
});
     */




app.directive('displayThirdDimension', function(){
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
            coords3d = decode2DToPercentageCoordsTo3D( data3D[i]['xAxis'], width3D, data3D[i]['yAxis'], height3D);
            console.log(coords3d);

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
    clock = new THREE.Clock();
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