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


function updateStatistics()
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();

    d3.select("#div_content_2d")
        .on('click', function(){
            var mouseCoords = d3.mouse(this);
            //alert("x_axis: " +  mouseCoords);
            //console.log(' {"x_axis": ' +  mouseCoords[0] + ', "y_axis": ' + mouseCoords[1] + ', "radius": 20, "color" : "red" }');
            console.log(' {"x_axis": ' +  enconde2DToPercentageCoords(mouseCoords[0], width) + ', "y_axis": ' + enconde2DToPercentageCoords(mouseCoords[1], width) + ', "radius": 20, "color" : "red" }');
        });

    var svg = getSvg2D();
    //: Jimmy: colors -> http://www.color-hex.com/random.php
    var jsonCircles = [
        { "x_axis": 0.115, "y_axis": 0.197802197802198, "radius": 20, "color" : "#de6154", "id" : 01, "value" : 4, "text": "quartier_name_01"},
        { "x_axis": 0.115, "y_axis": 0.351648351648352, "radius": 20, "color" : "#059788", "id" : 02, "value" : 4, "text": "quartier_name_02"},
        { "x_axis": 0.148, "y_axis": 0.450549450549451, "radius": 20, "color" : "#0085c1", "id" : 03, "value" : 4, "text": "quartier_name_03"},
        { "x_axis": 0.17, "y_axis": 0.582417582417582, "radius": 20, "color" : "#8ee35e", "id" : 04, "value" : 4, "text": "quartier_name_04"},
        { "x_axis": 0.332, "y_axis": 0.225274725274725, "radius": 20, "color" : "#a7aebd", "id" : 05, "value" : 4, "text": "quartier_name_05"},
        { "x_axis": 0.273, "y_axis": 0.352747252747253, "radius": 20, "color" : "#577355", "id" : 06, "value" : 4, "text": "quartier_name_06"},
        { "x_axis": 0.345, "y_axis": 0.112087912087912, "radius": 20, "color" : "#97e007", "id" : 07, "value" : 4, "text": "quartier_name_07"},
        { "x_axis": 0.33, "y_axis": 0.43956043956044, "radius": 20, "color" : "#855d6d", "id" : 08, "value" : 4, "text": "quartier_name_08"},
        { "x_axis": 0.3, "y_axis": 0.538461538461538, "radius": 20, "color" : "#22b23d", "id" : 09, "value" : 4, "text": "quartier_name_09"},
        { "x_axis": 0.29, "y_axis": 0.681318681318681, "radius": 20, "color" : "#efa199", "id" : 10, "value" : 4, "text": "quartier_name_10"},
        { "x_axis": 0.38, "y_axis": 0.615384615384615, "radius": 20, "color" : "#dd91a6", "id" : 11, "value" : 4, "text": "quartier_name_11"},
        { "x_axis": 0.425, "y_axis": 0.781318681318681, "radius": 20, "color" : "#a0187b", "id" : 12, "value" : 4, "text": "quartier_name_12"},
        { "x_axis": 0.666, "y_axis": 0.434065934065934, "radius": 20, "color" : "#53b310", "id" : 13, "value" : 4, "text": "quartier_name_13"},
        { "x_axis": 0.57, "y_axis": 0.647252747252747, "radius": 20, "color" : "#c2cea1", "id" : 14, "value" : 4, "text": "quartier_name_14"},
        { "x_axis": 0.46, "y_axis": 0.381318681318681, "radius": 20, "color" : "#e378da", "id" : 15, "value" : 4, "text": "quartier_name_15"},
        { "x_axis": 0.895, "y_axis": 0.406593406593407, "radius": 20, "color" : "#67cfaa", "id" : 16, "value" : 4, "text": "quartier_name_16"},
        { "x_axis": 0.768, "y_axis": 0.447252747252747, "radius": 20, "color" : "#9078c9", "id" : 17, "value" : 4, "text": "quartier_name_17"},
        { "x_axis": 0.81, "y_axis": 0.598901098901099, "radius": 20, "color" : "#f01bfd", "id" : 18, "value" : 4, "text": "quartier_name_18"},
        { "x_axis": 0.646, "y_axis": 0.658241758241758, "radius": 20, "color" : "#3e36e1", "id" : 19, "value" : 4, "text": "quartier_name_19"},
        { "x_axis": 0.531, "y_axis": 0.707692307692308, "radius": 20, "color" : "#a13a56", "id" : 20, "value" : 4, "text": "quartier_name_20"},
        { "x_axis": 0.562, "y_axis": 0.553846153846154, "radius": 20, "color" : "#d5df64", "id" : 21, "value" : 4, "text": "quartier_name_21"},
        { "x_axis": 0.545, "y_axis": 0.498901098901099, "radius": 20, "color" : "#5aa576", "id" : 22, "value" : 4, "text": "quartier_name_22"},
        { "x_axis": 0.616, "y_axis": 0.502197802197802, "radius": 20, "color" : "#291e9e", "id" : 23, "value" : 4, "text": "quartier_name_23"},
        { "x_axis": 0.579, "y_axis": 0.393406593406593, "radius": 20, "color" : "#2ba56c", "id" : 24, "value" : 4, "text": "quartier_name_24"},
        { "x_axis": 0.492, "y_axis": 0.469230769230769, "radius": 20, "color" : "#b230c5", "id" : 25, "value" : 4, "text": "quartier_name_25"},
        { "x_axis": 0.493, "y_axis": 0.568131868131868, "radius": 20, "color" : "#888879", "id" : 26, "value" : 4, "text": "quartier_name_26"},
        { "x_axis": 0.423, "y_axis": 0.545054945054945, "radius": 20, "color" : "#f24992", "id" : 27, "value" : 4, "text": "quartier_name_27"},
        { "x_axis": 0.421, "y_axis": 0.473626373626374, "radius": 20, "color" : "#c8f347", "id" : 28, "value" : 4, "text": "quartier_name_28"},
        { "x_axis": 0.555, "y_axis": 0.268131868131868, "radius": 20, "color" : "#9d953a", "id" : 29, "value" : 4, "text": "quartier_name_29"}
        
    ];
    
    
    var circles = svg.selectAll("circle")
        .data(jsonCircles)
        .enter()
        .append("circle")
    ;
    
    var nodes = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(jsonCircles)
        .enter()
        // Add one g element for each data node here.
        .append("g")
        // Position the g element like the circle element used to be.
        .attr("transform", function(d, i) {
            return "translate(" + d.x_axis + "," + d.y_axis + ")";
        });
    ;

    
    // Add a text element to the previously added g element.
    nodes.append("text")
         .attr("text-anchor", "middle")
         .text(function(d) {
           //return "" + d.x_axis + "," + d.y_axis + "";
           //return "" + d.text + ":\n " + d.value + "";
           return "" + d.id + ": " + d.value + "%";
    });


    var circleAttributes = circles
        .attr("cx", function (d) { return decode2DToPercentageCoordsTo2D(d.x_axis, width); })
        .attr("cy", function (d) { return decode2DToPercentageCoordsTo2D(d.y_axis, height); })
        .attr("r", function (d) { return d.radius; })
        .style("fill", function(d) { return d.color; });
}
//updateStatistics();

function createWall()
{
    var murs = new Array();
    //Création d'un segment de droite ici invisible
    svg.append("line").attr({
        id: "mur_temporaire",
        x1: 0, x2: 0,
        x1: 0, y2: 0,
        class: 'mur'
    });
    //Récuperation des coordonnées du poirn (cercle ?) le plus proche
    x1 = Math.floor(1 / pas);
    y1 = i % pas;
}

function testEvents()
{
    jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    var nbPas = 20;
    var pas = 5;
    var zones = new Array();
    for( var i = 0; i < nbPas; i++ ){
        for( var j = 0; j < nbPas; j++ ){
            object = { 'id': 'c' + i + '' + j, 'x' : pas+1*pas, 'y': pas+j*pas };
            zones.push(object);
        }
    }
    window.svg = d3.select("#div_content_2d")
        .append("svg")
        .attr("width", pas*(nbPas+2) + "px")
        .attr("height", pas*(nbPas+2) + "px");

    svg.selectAll()
        .data(zones)
        .enter()
        .append("circle")
        .attr({
            id: function (c){ return c.id },
            class: 'point',
            r: pas/4,
            cx: function (c){ return c.x },
            cy: function (c){ return c.y }
        })
        .on("click", function(c){ alert("click point") } )
        .on("contextmenu", function(c){ console.log("contextmenu point" + c.id) } )
        .on("mouseover", function(c){ console.log("contextmenu point" + c.id ) } )
        .on("mouseout", function(c){ console.log("contextmenu point" + c.id) } )
        ;

    d3.select("#div_content_2d")
        .on('click', function(){
            var mouseCoords = d3.mouse(this);
            alert("mouseCoords" +  mouseCoords);
            //console.log(mouseCoords);
        })

    var murs = new Array();
    //Création d'un segment de droite ici invisible
    svg.append("line").attr({
        id: "mur_temporaire",
        x1: 0, x2: 0,
        x1: 0, y2: 0,
        class: 'mur'
    });
    //Récuperation des coordonnées du poirn (cercle ?) le plus proche
    x1 = Math.floor(1 / pas);
    y1 = i % pas;
}



function  drawCartesianPlane(obj)
{
    //jQuery("#div_content_2d").html("");//Jimmy: Pending change to manage with the object
    var svg = getSvg2D();

    var width = jQuery("#div_content_2d").width();
    var height = jQuery("#div_content_2d").height();

    console.log(width);
    console.log(height);

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

    //jQuery("#div_content_2d").get();
}