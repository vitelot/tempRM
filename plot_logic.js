/**
 * Created by hannes on 27.11.17.
 */


var n = 40,
    random = d3.randomNormal(0, .2),
    data = d3.range(n).map(function (d) {return 0;});
var width;
var height;
var svg;
var margin;
var g;
var x;
var y;


var line = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });

var time_count = 0;
var values = [];
var max_val = 1;
values = createdummyvalues(100,max_val);


function initstandaloneplot()
{


 svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 initplot();
}

function initleafletplot()
{

    svg = d3.select(mymap.getPanes().overlayPane).append("svg"),
        margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = +400 - margin.left - margin.right,
        height = +150 - margin.top - margin.bottom,
        g = svg.append("g").attr("class", "leaflet-zoom-hide");
        //svg.append("")

    initplot();
}

function initplot()
{


    x = d3.scaleLinear()
        .domain([0, n - 1])
        .range([0, width]);

    y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    g.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));

    g.append("g")
        .attr("clip-path", "url(#clip)")
        .append("path")
        .datum(data)
        .attr("class", "line")
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .on("start", tick);


}


function createdummyvalues(nvals, mx)
{
    var vals = [];
    var frac = mx / nvals;

    for(var i=0; i<nvals; i++)
    {
        vals.push(frac*i);
    }

    return vals;
}






function tick() {

    // Push a new data point onto the back.
    data.push(values[time_count]);

    // Redraw the line.
    d3.select(this)
        .attr("d", line)
        .attr("transform", null);

    // Slide it to the left.
    d3.active(this)
        .attr("transform", "translate(" + x(-1) + ",0)")
        .transition()
        .on("start", tick);

    // Pop the old data point off the front.
    data.shift();

    time_count++;

}
