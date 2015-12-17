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

function removeNotIncludeFilerKeys(filtersData, notIncludeFilerKeys)
{
    console.log("filtersData:");
    console.log(filtersData);
    console.log("filtersData:");
    console.log(notIncludeFilerKeys);
    for(var key in notIncludeFilerKeys){
        if(){
            
        }
    }

    return filtersData;
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