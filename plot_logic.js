/**
 * Created by hannes on 27.11.17.
 */


var n = 40,
    random = d3.randomNormal(0, .2),
    //fill plot with initial values
    data = d3.range(n).map(function (d) {return 1;});
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



//create div overlay for plot
function setupPlot() {
    let plot = L.control({ position: 'bottomright' });

    plot.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'plot'); // create a div with a class "plot"
        this._div.id = "plotid";
        return this._div;
    };
    plot.addTo(mymap);
}

function initPlotAsChild()
{
    let newSvg = d3.select("#plotid").append("svg")
                    .attr("width", 400)
                    .attr("height", 150);

    initstandaloneplot();

}

function initstandaloneplot()
{


 svg = d3.select("#plotid svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 initplot();
}


function initleafletplot()
{

    let svg =
      // d3.select(mymap.getPanes().overlayPane).append("svg"),
      d3.select("#plotid").append("svg"),
        margin = {top: 20, right: 20, bottom: 20, left: 40},
        width = +400 - margin.left - margin.right,
        height = +150 - margin.top - margin.bottom,
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    initplot();
}

function initplot()
{


    x = d3.scaleLinear()
        .domain([0, n - 1])
        .range([0, width]);

    y = d3.scaleLinear()
        .domain([0.6, 1])
        .range([height, 0]);

    g.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + y(0.6) + ")")
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


function feedPlot(m)
{
    // works on the plotting_values[] glob var
    // takes x somehow as time...

    //var x = 5;
    //let value = (m.p1*x+m.p2)/(x+m.q1);
    //console.log(value);

    if(update_doctors == false)
    {
        current_doc = m;
        time_count = 1;
        update_doctors = true;
    }
    else console.warn("current simulation still running!");

}

var update_doctors = false;
var current_doc;
var max_days = 12;
var current_scale = 1;

function tick() {

    if(update_doctors)
    {
        if(time_count <= max_days)
        {
            var factor = (current_doc.p1 * time_count + current_doc.p2) / (time_count + current_doc.q1);
            // var diff = current_val - factor;
            var scaled = current_scale * factor;
            current_val = scaled;
            if(current_val > 1) current_val = 1;
        }
        else
        {
            update_doctors = false;
            current_scale = current_val;
        }
    }

    // Push a new data point onto the back
    data.push(current_val);

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
    values.push();

}
