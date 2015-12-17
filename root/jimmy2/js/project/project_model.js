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