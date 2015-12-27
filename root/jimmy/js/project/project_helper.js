
function getFilterData(jsonData, arrFilters)
{
    var arrFilters = (arrFilters == undefined)? []: arrFilters;
    for (i in jsonData){
        if( typeof(jsonData[i]) == "object" ){
            if ( Array.isArray(jsonData[i]) && typeof(jsonData[i][0]) != "object"){
                if( arrFilters[i] == undefined ){
                    arrFilters[i] = [];
                }
                for (j in jsonData[i]){
                    if( arrFilters[i].indexOf(jsonData[i][j]) == -1 ){
                        arrFilters[i].push(jsonData[i][j]);
                    }
                }
            }
            else{
                getFilterData(jsonData[i], arrFilters);
            }

        }
        else{
            if( typeof(i) === "string"  && (typeof jsonData[i] !== 'function') ) {
                if( arrFilters[i] == undefined ){
                    arrFilters[i] = [];
                }
                if( typeof(jsonData[i]) == 'string' ){
                    jsonData[i] = jsonData[i].trim();
                }
                if( arrFilters[i].indexOf(jsonData[i]) == -1 ){
                    arrFilters[i].push(jsonData[i]);
                }
            }
        }
        
    }
    return arrFilters;
}

/**
 * Methode to exclude the information not necesary in the filters 
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function excludeFilerKeys(filtersData, notIncludeFilerKeys)
{
    for(var key in notIncludeFilerKeys){
        if( filtersData[notIncludeFilerKeys[key]] != undefined ){
            delete filtersData[notIncludeFilerKeys[key]];
        }
    }
    return filtersData;
}

function addColorToQuartier(row, columKey)
{
    row[columKey] = "<div style='width: 15px; height:15px; float: left; background-color: " + row['color'] + ";'></div> " + row[columKey];
    return row;
}

/**
 * [prepareDisplayData Method to filter the data]
 * @param  {[type]} response_data [description]
 * @return {[type]}               [description]
 */
function prepareDisplayData(response_data){
    var resultData = {'titres': [], 'data': [ { } ] };
    if( response_data.length > 0 ){
        response_data[0] = ( response_data[0] == undefined )? response_data: response_data[0];//Jimmy: filter to use only a object
        for(var row in response_data){
            //response_data[row] = addColorToQuartier(response_data[row], 'nameQuarter');
            for(var key in notInclude1DKeys){
                if( response_data[row][notInclude1DKeys[key]] != undefined ){
                    delete response_data[row][notInclude1DKeys[key]];
                }
            }
        }
        for (var i in response_data[0]){
            resultData['titres'].push(i); 
        }
        resultData['data'] = response_data;
    }
    return resultData;
}

/**
 * Method to convert a array in object
 * @param  {[type]}
 * @return {[type]}
 */
function toObject(arr) {
    var rv = {};
    for (var i in arr){
        rv[i] = arr[i];
    }
    return rv;
}

/**
 * Method to create the filters
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function createAllFilters(testJson, idFilters)
{
    var strFilters = "";
    var arrFilters = getFilterData(testJson);
    var arrIds = [];
    for( i in arrFilters ){
        var idSelect = "filter_select_" + i;
        var oneFilter = "<div class='col-md-1' style='width: auto;'> " + i + ": <br>";
        oneFilter += " <select multiple='multiple' id='" + idSelect + "'>";
        arrIds.push(idSelect);
        //oneFilter += "<option value=''>Not Specified</option>";
        oneFilter += "";
        for( j in arrFilters[i] ){
            oneFilter += "<option value='" + arrFilters[i][j]  + "'>" + arrFilters[i][j] + "</option>";
        }
        oneFilter += "  </select>\n";
        oneFilter += "</div>\n";
        strFilters += oneFilter;
    }
    //console.log(strFilters);
    document.getElementById(idFilters).innerHTML = strFilters;
    for( i in arrIds ){
        //jQuery('#' + arrIds[i]).multiSelect();
    }
}

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
    result['x'] = 1 * ( (( per_coord_x * 2 ) - 1 ) * half_new_px_coord_x); //Jimmy: Important -1
    result['z'] = -1 * ( (1- ( per_coord_y * 2 ) ) * half_per_coord_y); //Jimmy: Important 1 -
    result['y'] = 0 //Jimmy: y = 0;  y -> z
    result['angle'] = Math.atan(result['x'] / result['y']); //Jimmy: x = 0;  x -> z
    //https://en.wikipedia.org/wiki/Spherical_coordinate_system
    //r={\sqrt {x^{2}+y^{2}+z^{2}}} - > \varphi =\operatorname {arctan} \left({\frac {y}{x}}\right)
    return result;
}

//: Jimmy: colors -> http://www.color-hex.com/random.php
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

function getSvg2D()
{
    var svg = d3.select("#div_content_2d svg");
    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();
    //if( svg == undefined ){
        svg = d3.select("#div_content_2d")//Selector div to render
            .append("svg")//add Svg
            .attr("width", width)//Define size
            .attr("height", height)
        ;
    //}
    return svg;
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
            alert('' +  d.nameQuarter + ' - ' + d.nameSubQuarter + ' - ' + d.percentage);
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

function removeEntity3DByName(name) {
    var selectedObject = scene.getObjectByName(name);
    scene.remove( selectedObject );
    animate();
}

function onWindowResize3D() {
    camera.aspect = document.getElementById('div_content_3d').innerWidth / document.getElementById('div_content_3d').innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( document.getElementById('div_content_3d').innerWidth, document.getElementById('div_content_3d').innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    //stats.update();
}

function removeEntity3DByName(name, animate3D) {
    var animate3D = (animate3D == undefined)? false : animate3D;
    var selectedObject = scene.getObjectByName(name);
    scene.remove( selectedObject );
    if(animate3D){
        animate();
    }
}

function removeAll3DColumns(){
    for ( i in COLUMN_LIST ){
        removeEntity3DByName(COLUMN_LIST[i], false);
    }
}

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

            geometry = new THREE.CubeGeometry( (50 + (30 * data2D[i]['percentage']/100) ), (data2D[i]['percentage'] * 9 ), (50 + (30 * data2D[i]['percentage']/100) ) );
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

jQuery( document ).ready(function( $ ) {
    //jQuery('#table_data_1d').html("");
    /*
    
    //datatable
    jQuery('.datatable').dataTable({
      "paging": false,  
    });
     */
    //Jimmy: Form filters event onChange
    
    //console.log(jQuery("body"));
 	//draw2d();
});