/**
 * [getFilterData Method to obtain a Associative Array from a Json]
 * @param  {[type]} jsonData   [description]
 * @param  {[type]} arrFilters [description]
 * @return {[type]}            [description]
 * @author Jimmmy - Loic
 */
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
 * @author Jimmmy
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

/**
 * [addColorToQuartier Method to add the Html to a Quarter - SportStatistics]
 * @param {[type]} row      [description]
 * @param {[type]} columKey [description]
 */
function addColorToQuartier(row, columKey)
{
    row[columKey] = "<div style='width: 15px; height:15px; float: left; background-color: " + row['color'] + ";'></div> " + row[columKey];
    return row;
}

/**
 * [prepareDisplayData Method to filter the data]
 * @param  {[type]} response_data [description]
 * @return {[type]}               [description]
 * @author Jimmmy
 */
function prepareDisplayData(response_data, notInclude1DKeys){
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
 * @author Jimmmy
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
 * @author Jimmmy
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
/**
 * [enconde2DToPercentageCoords Method to encode the coordones to percentage]
 * @param  {[type]} px_coord     [description]
 * @param  {[type]} max_px_coord [description]
 * @return {[type]}              [description]
 * @author Jimmmy
 */
function enconde2DToPercentageCoords (px_coord, max_px_coord)
{
    return px_coord / max_px_coord;
}

/**
 * [decode2DToPercentageCoordsTo2D Method to encode the coordones 2D from a percentage]
 * @param  {[type]} per_coord    [description]
 * @param  {[type]} max_px_coord [description]
 * @return {[type]}              [description]
 * @author Jimmmy
 */
function decode2DToPercentageCoordsTo2D(per_coord, max_px_coord)
{
    return per_coord * max_px_coord;
}

/**
 * [decode2DToPercentageCoordsTo3D Method to encode the coordones 3D from a percentage]
 * @param  {[type]} per_coord    [description]
 * @param  {[type]} max_px_coord [description]
 * @return {[type]}              [description]
 * @author Jimmmy
 */
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

/**
 * [updateLegend Method to update the legend in SportStatistics]
 * Jimmy: colors -> http://www.color-hex.com/random.php
 * @param  {[type]} $rootScope [description]
 * @return {[type]}            [description]
 * @author Jimmmy
 */
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

/**
 * [getSvg2D Method to obtaid the Svg Objet in 2D]
 * @return {[type]} [description]
 * @author Jimmmy
 */
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

/**
 * [updateStatistics2D Method to Update the Statistics]
 * @param  {[type]} $rootScope [description]
 * @return {[type]}            [description]
 * @author Jimmmy
 */
function updateStatistics2D($rootScope)
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    updateLegend($rootScope);

    
    var div = d3.select("#tooltip");
    /*
     */

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
        .attr("r", function (d) { return (30 + d.percentage * 0.25); })//Jimmy: circle's proportion
        .attr("cursor", 'pointer')//Jimmy: Cursor
        .attr("data-toggle", 'tooltip')//tooltip
        .attr("titre", function (d) { return 'nameQuarter: ', d.nameQuarter + ', nameSubQuarter: ', d.nameSubQuarter; })//tooltip
        .on("click", function(d){
            console.log(' Info ', d);
            alert('' +  d.nameQuarter + ' - ' + d.nameSubQuarter + ' - ' + d.percentage);
        })
        .on("mouseover", function(d) {      
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',3)
                .attr("r", (30 + d.percentage * 0.25) * 1.5 );
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html('' +  d.nameQuarter + ' - ' + d.nameSubQuarter + ' - <b>' + d.percentage + "%</b>")  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',0)
                .attr('stroke-width',0)
                .attr("r", (30 + d.percentage * 0.25) );
        })
        /*
        
        .on("mouseover", function(d){
            console.log('nameQuarter: ', d.nameQuarter + ', nameSubQuarter: ', d.nameSubQuarter);
            
        })
        .on("mouseenter", function(d){
            
        })
        .on("mouseleave", function(d){
            
        })
         */
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

    //jQuery('[data-toggle="tooltip"]').tooltip();
}


function updateSportSites2D($rootScope)
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    
    var arrTypes = {
        'circles': []
    };
    for (var row in $rootScope.data2D){
       switch($rootScope.data2D[row]){
            case 'Salles de sports':
                break;
       } 
    }
    
    var div = d3.select("#tooltip");
    /*
     */

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
        .attr("r", 30)//Jimmy: circle's proportion
        .attr("cursor", 'pointer')//Jimmy: Cursor
        .attr("data-toggle", 'tooltip')//tooltip
        .attr("titre", function (d) { return 'nameQuarter: ', d.nameQuarter + ', nameSubQuarter: ', d.nameSubQuarter; })//tooltip
        .on("click", function(d){
            //displayScoccerField();
            document.location.href = "#/3D"; 
        })
        /*
        
        .on("mouseover", function(d) {      
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',3)
                .attr("r", 10);
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html('' +  d.nameQuarter + ' - ' + d.nameSubQuarter + ' - <b>' + d.percentage + "%</b>")  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
            d3.select(this)
                .transition()
                .duration(200)
                .attr('stroke-width',0)
                .attr('stroke-width',0)
                .attr("r", 10);
        })
         */
        
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
        .text( function (d) { return " text "; })
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-weight", "bold")
        .attr("font-size", "10px")
        .attr("fill", "white")

    //jQuery('[data-toggle="tooltip"]').tooltip();
}


/**
 * [onWindowResize3D Method to controle the resize in 3D]
 * @return {[type]} [description]
 * @author Jimmmy
 */
function onWindowResize3D() {
    camera.aspect = document.getElementById('div_content_3d').innerWidth / document.getElementById('div_content_3d').innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( document.getElementById('div_content_3d').innerWidth, document.getElementById('div_content_3d').innerHeight );
}

/**
 * [animate Method to animate the 3D]
 * @return {[type]} [description]
 * @author Jimmmy
 */
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    controls
    //stats.update();
}

/**
 * [removeEntity3DByName Method to remove a 3D objet by name]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 * @author Jimmmy
 */
function removeEntity3DByName(name, animate3D) {
    var animate3D = (animate3D == undefined)? false : animate3D;
    var selectedObject = scene.getObjectByName(name);
    scene.remove( selectedObject );
    if(animate3D){
        animate();
    }
}

/**
 * [removeAll3DColumns Method to remove the 3D Columns]
 * @return {[type]} [description]
 * @author Jimmmy
 */
function removeAll3DColumns(){
    for ( i in COLUMN_LIST ){
        removeEntity3DByName(COLUMN_LIST[i], false);
    }
}



function closeSoccerField(){
    var div = d3.select("#tooltip_3d");
    d3.select("#container_iframe_3d").html('') 
    div.style("opacity", 0);
}

function displayScoccerField(){
    //alert("asas");
    var div = d3.select("#tooltip_3d");
    //d3.select("#container_iframe_3d").html('<iframe src="3D/soccer_field/soccer_field.html" style="width: 100%; height:100%; "></iframe>') 
    div.transition()        
        .duration(200)      
        .style("opacity", 1);
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