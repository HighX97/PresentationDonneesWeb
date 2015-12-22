
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
    //console.log("notIncludeFilerKeys:"); // ["_id", "x1", "y1"]
    //console.log(notIncludeFilerKeys);
    for(var key in notIncludeFilerKeys){
        if( filtersData[notIncludeFilerKeys[key]] != undefined ){
            delete filtersData[notIncludeFilerKeys[key]];
        }
    }
    //console.log("filtersData:");
    //console.log(filtersData);
    return filtersData;
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



jQuery( document ).ready(function( $ ) {
    //Jimmy: Form filters event onChange
    
    //console.log(jQuery("body"));
 	//draw2d();
});