/**
 * Created by Administrator on 1/2/2017.
 */
$(document).ready(function () {
    consumptions();
})

function consumptions() {

// add the graph canvas to the body of the webpage
    var chart = d3.select("#consumption");
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
        xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);

// setup y
    var yValue = function (d) {
            return d.HHFCE;
        }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function (d) {
            return yScale(yValue(d));
        }, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left").innerTickSize(-width).outerTickSize(0).tickPadding(10).ticks(5);

    var zValue = function (d) {
        return d.date;
    }

// add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

// load data
    d3.csv("./data/consumer.csv", function (error, data) {

        // change string (from CSV) into number format
        data.forEach(function (d) {
            d.CPI = +d.CPI;
            d.HHFCE = +d.HHFCE;
            d.date = +d.date;
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
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom - 10) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("CPI year-on-year (%)");

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
            .text("HHFCE year-on-year (%)");

        //Adds the title
        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 2))
            .attr("class", "mainTitle")
            .style("font-weight", "bold")
            .style("font-size", "30px")
            .text("Relationship between CPI and HHFCE:");

        //Adds the subtitle
        svg.append("text")
            .attr("x", 0 - (margin.left) / 5)
            .attr("y", 0 - (margin.top / 3))
            .attr("class", "subTitle")
            .text("Quarter 1 2014 to Quarter 3 2016");

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
                tooltip.html("<br/> (" + xValue(d)
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