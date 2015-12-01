function getSvg2D()
{
    var svg = d3.select("#div_content_2d svg");
    //console.log(svg);
    //if( svg == undefined ){
        svg = d3.select("#div_content_2d")//Selector div to render
            .append("svg")//add Svg
            .attr("width", 600)//Define size
            .attr("height", 400)
        ;
    //}
    return svg;
}

function draw2d()
{
    var svg = getSvg2D();

    var lignes = [10, 20, 30];
    
    svg.selectAll("line") // get all the lines
        .data(lignes)
        .enter()//To enter in each element
        .append("line")
        .attr("x1", 20)// x1 -->initial pos
        .attr("y1", 15)// y1 -->final pos
        .attr("x2", 100 - 10)// x1 -->end pos
        .attr("y2", function(d) { return d*20; } )// y2 --> coor with a callback function
        .style("stroke", "black");
    ;
}

function draw3d()
{
    var svg = getSvg2D();

    var lignes = [10, 20, 30];
    
    svg.selectAll("line") // get all the lines
        .data(lignes)
        .enter()//To enter in each element
        .append("line")
        .attr("x1", 20)// x1 -->initial pos
        .attr("y1", 15)// y1 -->final pos
        .attr("x2", 100 - 10)// x1 -->end pos
        .attr("y2", function(d) { return d*20; } )// y2 --> coor with a callback function
        .style("stroke", "black");
    ;
}



function  drawCartesianPlane(obj)
{
    var svg = getSvg2D();

    var width = jQuery(obj).width();
    var height = jQuery(obj).height();

    var lignes = [
        { // y
            x1: (width / 2),
            y1: 0,
            x2: (width / 2),
            y2: (height)
        },
        {//x
            x1: 0,
            y1: (height / 2),
            x2: width,
            y2: (height / 2)
        }
    ];
    

    svg.selectAll("line") // get all the lines
        .data(lignes)
        .enter()//To enter in each element
        .append("line")
        .attr("x1", function(d) { return d.x1; } )// x1 -->initial pos
        .attr("y1", function(d) { return d.y1; })// y1 -->final pos
        .attr("x2", function(d) { return d.x2; }  )// x1 -->end pos
        .attr("y2", function(d) { return d.y2; } )// y2 --> coor with a callback function
        .style("stroke", "black");
    ;

    //jQuery(obj).get();
}

function getFilterData(testJson, arrFilters)
{
    var arrFilters = (arrFilters == undefined)? []: arrFilters;
    for (i in testJson){
        if( typeof(testJson[i]) == "object" ){
            if ( Array.isArray(testJson[i]) && typeof(testJson[i][0]) != "object"){
                if( arrFilters[i] == undefined ){
                    arrFilters[i] = [];
                }
                for (j in testJson[i]){
                    if( arrFilters[i].indexOf(testJson[i][j]) == -1 ){
                        arrFilters[i].push(testJson[i][j]);
                    }
                }
            }
            else{
                getFilterData(testJson[i], arrFilters);
            }

        }
        else{
            if( typeof(i) === "string"  && (typeof testJson[i] !== 'function') ) {
                if( arrFilters[i] == undefined ){
                    arrFilters[i] = [];
                }
                if( typeof(testJson[i]) == 'string' ){
                    testJson[i] = testJson[i].trim();
                }
                if( arrFilters[i].indexOf(testJson[i]) == -1 ){
                    arrFilters[i].push(testJson[i]);
                }
            }
        }
        
    }
    return arrFilters;
}

function toObject(arr) {
    var rv = {};
    for (var i in arr){
        rv[i] = arr[i];
    }
    return rv;
}


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



//all_filters


jQuery( document ).ready(function( $ ) {
    

    

    //console.log(jQuery("body"));
 	//draw2d();
});