/**
 * Created by Administrator on 1/1/2017.
 */
$(document).ready(function () {
    scatter();
})
function scatter() {
    // Set the dimensions of the canvas / graph

    var parseDate = d3.time.format("%y-%b").parse;
    var formatTime = d3.time.format("%y-%b");
    var zValue = function (d) {
        return d.date;
    }

// add the graph canvas to the body of the webpage
    var chart = d3.select("#scatter");
    var margin = {top: 120, right: 50, bottom: 50, left: 50},//改图的大小
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom,
        svg = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // setup x
    var xValue = function (d) {
            return d.CPI;
        }, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function (d) {
            return xScale(xValue(d));
        }, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
    var yValue = function (d) {
            return d.importPrice;
        }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function (d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(-width).outerTickSize(0).tickPadding(10).ticks(5);


// add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// load data
    d3.csv("./data/trade.csv", function (error, data) {

        // change string (from CSV) into number format
        data.forEach(function (d) {
            d.CPI = +d.CPI;
            d.importPrice = +d.importPrice;
            d.date = parseDate(d.date);
        });

        // don't want dots overlapping axis, so add in buffer to data domain
        xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
        yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

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
            .text("CPI(%)");

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
            .text("Import price");

        //Adds the title
        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 2))
            .attr("class", "mainTitle")
            .text("Figure 3-Scatter plot for import price and CPI:");

        //Adds the subtitle
        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 3))
            .attr("class", "subTitle")
            .text("From May 2014 to October 2016");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 5.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(formatTime(zValue(d)) + "<br/> (" + xValue(d)
                    + ", " + yValue(d) + ")")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                d3.select(this).attr('r', 8);
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).attr('r', 5.5);
            });

    });
}