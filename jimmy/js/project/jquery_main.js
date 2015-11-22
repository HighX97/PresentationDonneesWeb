function draw2d(){
    var svg = d3.select("#div_content_2d")//Selector div to render
        .append("svg")//add Svg
        .attr("width", 600)//Define size
        .attr("height", 400)
    ;

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


jQuery( document ).ready(function( $ ) {
    //console.log(jQuery("body"));
 	//draw2d();
});