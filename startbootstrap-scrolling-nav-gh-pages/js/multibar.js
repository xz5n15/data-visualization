/**
 * Created by Administrator on 1/7/2017.
 */
$(document).ready(function() {
    multi_bar();
 })
function multi_bar() {
    var chart = d3.select("#household");
    console.log(2324324);
    var margin = {top: 120, right: 50, bottom: 100, left: 50},
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height")- margin.top - margin.bottom;
    var svg = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#6495ed", "#3cb371", "#a9a9a9"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(20)
        .tickFormat(d3.format(".2s"));
    var constant = 50;
    d3.csv("./data/household.csv", function (error, data) {
        if (error) throw error;

        var types = d3.keys(data[0]).filter(function (key) {
            return (key !== "date");
        });

        data.forEach(function (d) {
            d.category = types.map(function (name) {
                //console.log(+d[name]);
                return {name: name, value: +d[name]};
            });
        });
        //console.log(data);
        x0.domain(data.map(function (d) {
            return d.date;
        }));
        x1.domain(types).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function (d) {
            return d3.max(d.category, function (d) {
                return d.value;
            });
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+constant+"," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-80)")
            .attr("dx", "-1em")
            .attr("dy", ".20em")
            .style("text-anchor", "end")
            .style("font-size", "10px")
            .style("font-weight", "bold");

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+constant+",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Waterfootprint");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "state")
            .attr("transform", function (d) {
                var length = +x0(d.date) + constant;
                return "translate("+length+",0)";
            });

        state.selectAll("rect")
            .data(function (d) {
                return d.category;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.name);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .style("fill", function (d) {
                return color(d.name);
            });

        var legend = svg.selectAll(".legend")
            .data(types.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

    });
}
