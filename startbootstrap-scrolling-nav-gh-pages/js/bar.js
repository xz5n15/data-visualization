/**
 * Created by Administrator on 1/2/2017.
 */
$(document).ready(function () {
    d3.csv("./data/import.csv", function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            data.forEach(function (d) {
                d.importPrice = parseFloat(d.Imports);
            });
            dataset = data;
            barChart(dataset);
        }
    });
})

var dataset;

//Define bar chart function
function barChart(dataset) {

    //Set width and height as fixed variables
    var padding = 25;

    //To format axis as a percent
    var formatPercent = d3.format("%1");


    //
    //Define key function
    var key = function (d) {
        return d.time;
    };


    //Define tooltip for hover-over info windows
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Create svg element
    var chart = d3.select("#bar");
    var margin = {top: 120, right: 50, bottom: 100, left: 50},//改图的大小
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height") - margin.top - margin.bottom,
        svg = chart.append("g").attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

      //Scale function for axes and radius
    var yScale = d3.scale.linear()
        .domain([86, d3.max(dataset, function (d) {
            return d.importPrice;
        })])
        .range([height, 0]);

    var xScale = d3.scale.ordinal()
        .domain(dataset.map(function (d) {
            return d.time;
        }))
        .rangeRoundBands([0, width], .5);

    //Create y axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    //Adds the title
    svg.append("text")
        .attr("x",0-(margin.left)/5)
        .attr("y", 0 - (margin.top / 2))
        .attr("class","mainTitle")
        .text("Figure 2-The goods import price in UK:");

       svg.append("text")
        .attr("x",0-(margin.left)/5)
        .attr("y", 0 - (margin.top / 3))
        .attr("class","subTitle")
        .text("From October 2014 to October 2016");

    //Create barchart
    svg.selectAll("rect")
        .data(dataset, key)
        .enter()
        .append("rect")
        .attr("class", "negative")
        .attr({
            x: function (d) {
                return xScale(d.time);
            },
            y: function (d) {
                return yScale(d.importPrice);
            },
            width: xScale.rangeBand(),
            height: function (d) {
                return height - yScale(d.importPrice);
            }
        })

        .on('mouseover', function (d) {
            d3.select(this)
                .style("opacity", 0.8)
                .style("fill", "#a3403c");

            var info = div
                .style("opacity", 1)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
                .text(d.time);


            info.append("p").text(d.importPrice);

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style({'stroke-opacity': 0.5, 'stroke': '#a8a8a8'})
                .style("opacity", 1)
                .style("fill","steelblue");

            div
                .style("opacity", 0);
        });


    //Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .append("text")
        // .attr("transform", "rotate(-90)")
            .attr("y", -20)
            .attr("x", 240)
            .attr("dy", "2.5em")
            .attr("dx", ".90em")
            .style("text-anchor", "end")
            .text("Non Seasonally Adjusted, 2013 = 100");
    svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Year");
    svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("Import price");


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0,280)")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-60)")
        .attr("dx", "-1em")
        .attr("dy", ".20em")
        .style("text-anchor", "end")
        .style("font-size", "10px")
        .style("font-weight", "bold");


};

//Load data and call bar chart function
