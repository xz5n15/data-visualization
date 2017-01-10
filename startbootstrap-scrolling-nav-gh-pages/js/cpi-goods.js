
  // <script data-require="d3@3.5.3" data-semver="3.5.3" src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.js"></script>
    var margin = {
        top: 20,
        right: 80,
        bottom: 50, //was 30
        left: 50
      },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m").parse;
    var formatTime = d3.time.format("%Y%m");

    var x = d3.time.scale().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

    var line = d3.svg.line()
      .x(function(d) {return x(d.date);})
      .y(function(d) {return y(d.price);});

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.tsv("data.tsv", function(error, data) {
      if (error) throw error;
      data.forEach(function (d) {
          d.date = parseDate(d.date);
      });

      color.domain(d3.keys(data[0]).filter(function (key) {
          return key !== "date";
      }));

      var models = color.domain().map(function (name) {
          return {
              name: name,
              values: data.map(function (d) {
                  return {
                      date: d.date,
                      price: +d[name]
                  };
              })
          };
      });

      x.domain(d3.extent(data, function (d) {return d.date;}));

      y.domain([
          d3.min(models, function (c) {return d3.min(c.values, function (v) {return v.price;})*1.05;}),
          d3.max(models, function (c) {return d3.max(c.values, function (v) {return v.price;}) * 1.05;})
      ]);

      var legend = svg.selectAll('g')
          .data(models)
          .enter()
          .append('g')
          .attr('class', 'legend');

      legend.append('rect')     //the position/size of the legend
          .attr('x', function (d, i) {
              if (i === 0) return 600;
              else if (i === 1) return 450;
              else if (i === 2) return 345;
              else if (i === 3) return 290;
              else;
          })
          .attr('y', 5)
          .attr('width', 9)
          .attr('height', 9)
          .style('fill', function (d) {return color(d.name);});

      legend.append('text')       //the text of the legend
          .attr('x', function (d, i) {
              if (i === 0) return 615;
              else if (i === 1) return 465;
              else if (i === 2) return 360;
              else if (i === 3) return 305;
              else;
          })
          .attr('y', 13)
          .text(function (d) {return d.name;});

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left+20)//6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("CPI %");

      var mode = svg.selectAll(".mode")
          .data(models)
          .enter().append("g")
          .attr("class", "mode");

      mode.append("path")
          .attr("class", "line")
          .attr("d", function (d) {return line(d.values);})
          .style("stroke", function (d) {return color(d.name);});

      var mouseG = svg.append("g")
          .attr("class", "mouse-over-effects");

      var lines = document.getElementsByClassName('line');

      var mousePerLine = mouseG.selectAll('.mouse-per-line')
          .data(models)
          .enter()
          .append("g")
          .attr("class", "mouse-per-line");

      mousePerLine.append("text")
          .attr("transform", "translate(12,0)");

      mode.append("g").selectAll("circle")
          .data(function(d) {return d.values})
          .enter()
          .append("circle")
          .attr("r", 3.3)
          .attr("cx", function (dd) {return x(dd.date)})
          .attr("cy", function (dd) {return y(dd.price)})
          .attr("fill", function (d) {return color(this.parentNode.__data__.name)})
          .attr("stroke", function (d) {return color(this.parentNode.__data__.name)})
          .style("stroke-width", "0px")
          .on('mouseout', function () { // on mouse out hide line, circles and text
              //d3.select(".mouse-line").style("opacity", "0");
              // d3.selectAll(".mouse-per-line circle").style("opacity", "0");
              d3.selectAll(".mouse-per-line text").style("opacity", "0");
          })
          .on('mouseover', function () {// on mouse in show line, circles and text
             // d3.select(".mouse-line").style("opacity", "1");
             // d3.selectAll(".mouse-per-line circle").style("opacity", "1");
              d3.selectAll(".mouse-per-line text").style("opacity", "1");
          })
          .on('mousemove', function () {
              // mouse moving over canvas
              var mouse = d3.mouse(this);
//              d3.select(".mouse-line")
//                  .attr("d", function () {
//                      var d = "M" + mouse[0] + "," + height;
//                      d += " " + mouse[0] + "," + 0;
//                      return d;
//                  });

              d3.selectAll(".mouse-per-line")
                  .attr("transform", function (d, i) {
                      //console.log(width/mouse[0])
                      var xDate = x.invert(mouse[0]),
                          bisect = d3.bisector(function (d) {return d.date;}).right;
                      idx = bisect(d.values, xDate);

                      var beginning = 0,
                          end = lines[i].getTotalLength(),
                          target = null;

                      while (true) {
                          target = Math.floor((beginning + end) / 2);
                          pos = lines[i].getPointAtLength(target);
                          if ((target === end || target === beginning) && pos.x !== mouse[0]) {break;}
                          if (pos.x > mouse[0]) end = target;
                          else if (pos.x < mouse[0]) beginning = target;
                          else break;
                      }

                      d3.select(this).select('text')
                          .style("opacity", 1)
                          .html(function (d) {return "CPI " + y.invert(pos.y).toFixed(1) + "%";});

                      return "translate(" + mouse[0] + "," + pos.y + ")";
                  });
          });
  });
