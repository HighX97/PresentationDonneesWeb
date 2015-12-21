
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