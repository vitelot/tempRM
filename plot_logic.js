/**
 * Created by hannes on 27.11.17.
 */


//     random = d3.randomNormal(0, .2),
//     //fill plot with initial values
var n = 40;
var data = d3.range(n).map(function (d) {return 1;});
var x;
var y;
var xaxis;


var line = d3.line()
    .x(function(d, i) { return x(i+time_count); })
    .y(function(d, i) { return y(d); });

var time_count = 0;
//var values = [];
var max_val = 1;
// values = createdummyvalues(100,max_val);



//create div overlay for plot
function Plot() {

  // use leaflet controls to create an empty <div class="plot" id="plotid">
    var plot = L.control({ position: 'bottomright' });

    plot.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'plot');
        this._div.id = "plotid";
        return this._div;
    };
    plot.addTo(mymap);

    var svg_width = 400,
        svg_height = 150,
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = svg_width - margin.left - margin.right,
        height = svg_height - margin.top - margin.bottom;


    // select the div and create an svg canvas inside
    var svg = d3.select("#plotid").append("svg")
                    .attr("width", svg_width)
                    .attr("height", svg_height);


    var g = svg.append("g") // this group will contain the plot
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

    x = d3.scaleLinear()
        .domain([0, n - 1])
        .range([0, width]);

    y = d3.scaleLinear()
        .domain([0.4, 1])
        .range([height, 0]);

    g.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    xaxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + y(0.4) + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y));


    var padding = 80;
    g.selectAll(".xaxis text")  // select all the text elements for the xaxis
        .attr("transform", function(d) {
            return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
        });

    // now add titles to the axes
    g.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-padding/2.5) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("RIL");

    g.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+(padding/3))+")")  // centre below axis
        .text("Day");



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

var update_doctors = false;
var doc_queue = [];
var max_days = 12;

function feedPlot(m)
{
    // works on the plotting_values[] glob var
    // takes x somehow as time...

    //var x = 5;
    //let value = (m.p1*x+m.p2)/(x+m.q1);
    //console.log(value);

    var currentdoc = new doc();
    currentdoc.model = m;
    doc_queue.push(currentdoc);

    expired = true;
    update_doctors = true;
}

function doc() {
    this.model;
    this.expiration = 1;
}

var lambda = 1.005;
var last_val;
var expired = false;


function allDocsExpired()
{
    var expired = true;

    for(var i=0; i<doc_queue.length; i++)
    {
        if(doc_queue[i].expiration <= max_days)
            expired = false;
    }
    return expired;
}


function tick() {

    if(update_doctors)
    {
        var totalfactor = 1;
        for(var i=0; i<doc_queue.length; i++)
        {
            var factor = (doc_queue[i].model.p1 * doc_queue[i].expiration + doc_queue[i].model.p2) / (doc_queue[i].expiration + doc_queue[i].model.q1);
            totalfactor *= factor;

            if(doc_queue[i].expiration <= max_days)
                doc_queue[i].expiration++;
        }
        current_val = totalfactor;

        if(allDocsExpired())
        {
            // console.log("docs expired!");
            if(expired)
            {
                // console.log("init!");
                last_val = current_val;
                expired = false;
            }
            current_val = last_val * lambda;
            last_val = current_val;
        }
        // console.log(current_val);
        if(current_val > 1) current_val = 1;
    }


    // Push a new data point onto the back
    data.push(current_val);

    x.domain([0+time_count, n - 1+time_count]);
    //x.range([0+time_count, 400+time_count]);
    xaxis.call(d3.axisBottom(x));


    // Redraw the line.
    d3.select(this)
        .attr("d", line)
        .attr("transform", null);

    // Slide it to the left.
    d3.active(this)
        .attr("transform", "translate(" + x(0+time_count) + ",0)")
        .transition()
        .on("start", tick);

    // Pop the old data point off the front.
    data.shift();

    time_count++;

  //  values.push();

}

// function createdummyvalues(nvals, mx)
// {
//     var vals = [];
//     var frac = mx / nvals;
//
//     for(var i=0; i<nvals; i++)
//     {
//         vals.push(frac*i);
//     }
//
//     return vals;
// }
