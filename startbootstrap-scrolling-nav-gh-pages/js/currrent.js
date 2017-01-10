/**
 * Created by Administrator on 1/1/2017.
 */
$(document).ready(function () {
    current();
})

function current() {

// Parse the date / time
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    var formatTime = d3.time.format("%d/%m/%Y");
    var bisectDate = d3.bisector(function (d) {
        return d.date;
    }).left;


// Define the line
    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.rate);
        });

// Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// Adds the svg canvas
    var chart = d3.select("#currency"),
        margin = {top: 120, right: 50, bottom: 50, left: 50},//改图的大小
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom;
    var svg = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Set the ranges
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);


// Define the axes
    var xAxis = d3.svg.axis().scale(x)
        .ticks(5).orient("bottom");

    var yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(5).innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

// Get the data
    d3.csv("./data/currency.csv", function (error, data) {
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.rate = +d.rate;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([1.2, d3.max(data, function (d) {
            return d.rate;
        })]);//改纵坐标范围

        //Adds the title
        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 2))
            .attr("class", "mainTitle")
            .text("Figure 1-British Pound to US Dollar exchange rate history:");

        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 3))
            .attr("class", "subTitle")
            .text("From 01/01/2014 to 31/10/2016");

        // Add the valueline path.
        var line1 = svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data.filter(function (d) {
                return d.date <= parseDate('24/06/2016');
            })))
            .style("stroke", "#FF8800")
            .style("stroke-width", 2)
            .style("fill", "none");

        // Add the valueline path.
        svg.append("path")
            .attr("class", "line1")
            .attr("d", valueline(data.filter(function (d) {
                return d.date >= parseDate('24/06/2016');
            })))
            .style("stroke", "red")
            .style("stroke-width", 2)
            .style("fill", "none");

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // text label for the x axis
        svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Year");

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // Add the text label for the Y axis
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Exchange rate");

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5)
            .style("stroke", "blue");

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () {
                focus.style("display", null);
            })
            .on("mouseout", function () {
                focus.style("display", "none");
                div.transition().duration(500).style("opacity", 0);
            })
            .on("mousemove", mousemove);

        function mousemove(d) {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.rate) + ")");
            div.transition()
                .duration(200)
                .style("opacity", .9);
            //有问题
            div.html("Date:" + formatTime(d.date) + "<br/>" + "rate:" + d.rate)
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        }

        //Add the vertical line
        svg.append("line")
            .attr("x1", x(parseDate('23/06/2016')))
            .attr("y1", y(1.2))
            .attr("x2", x(parseDate('23/06/2016')))
            .attr("y2", y(1.7))
            .style("stroke-width", 1.9)
            .style("stroke", "blue")
            .style("fill", "none");

        // Add the text label for the vertical line
        svg.append("text")
            .attr("y", y(1.2))
            .attr("x", x(parseDate('23/06/2016')))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "15px")
            .style("font-weight", "bold")
            .text("EU referendum");
    });
}
