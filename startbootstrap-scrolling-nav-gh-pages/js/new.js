
$(document).ready(function() {
    bars();
 })
function bars() {

    var chart = d3.select("#bars");
    console.log(2324324);
    var margin = {top: 120, right: 50, bottom: 100, left: 50},
        width = +chart.attr("width") - margin.left - margin.right,
        height = +chart.attr("height")- margin.top - margin.bottom;
    var svg = chart.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .range(["#a3403c", "#4e6189"]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(7)
        .innerTickSize(-width)
        .tickFormat(d3.format(".2s"));
    var constant = 50;

     var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //Adds the title
    svg.append("text")
        .attr("x",0-(margin.left)/5)
        .attr("y", 0 - (margin.top/1) )
        .attr("class","mainTitle")
        .text("Figure 2-The goods import price in UK:");

       svg.append("text")
        .attr("x",0-(margin.left)/5)
        .attr("y", 0 - (margin.top/1.5) )
        .attr("class","subTitle")
        .text("From October 2014 to October 2016");

    d3.csv("./data/chart5584518617482706403.csv", function (error, data) {
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
        y.domain([260, d3.max(data, function (d) {
            return d3.max(d.category, function (d) {
                return d.value;
            });
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
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
            .attr("transform", "translate(0,0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(" ‎£ billion");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "state")
            .attr("transform", function (d) {
                var length = +x0(d.date);
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
            })

         .on('mouseover', function (d) {
            d3.select(this)
                .style("opacity", 0.2)
                .style("stroke", "black");

            var info = div
                .style("opacity", 1)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 30) + "px")
                .text("£"+d.value);


            info.append("p").text(d.importPrice);

        })
        .on('mouseout', function (d) {
            d3.select(this)
                .style({'stroke-opacity': 0.5, 'stroke': '#a8a8a8'})
                .style("opacity", 1);

            div
                .style("opacity", 0);
        });


        var legend = svg.selectAll(".legend")
            .data(types.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width)
            .attr("y", -60)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", -50)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

    });
}
