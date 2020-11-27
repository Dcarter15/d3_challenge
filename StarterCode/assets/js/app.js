var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var Group = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(incomedata) {
    incomedata.forEach(function(data) {
            data.age = +data.age
            data.income = +data.income
            data.state = data.state
            data.abbr = data.abbr
            });

    // Create Scale Function
        var xLinearScale = d3.scaleLinear()
            .domain([30, d3.max(incomedata, d => d.age)])
            .range([1, width]);
    
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(incomedata, d => d.income)])
            .range([height, 0]);

    // Create Axis Function
        var xaxis = d3.axisBottom(xLinearScale);
        var yaxis = d3.axisLeft(yLinearScale);
        Group.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xaxis);
        Group.append("g")
            .call(yaxis);

    // Create Circles for scatterplot
        var circles = Group.selectAll("circle")
            .data(incomedata)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.income))
            .attr("r", "20")
            .attr("fill", "purple")
            .style("text-anchor", "middle")
            .attr("opacity", ".5");
        
        var circles = Group.selectAll()
            .data(incomedata)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.age))
            .attr("y", d => yLinearScale(d.income))
            .style("font-size", "12px")
            .style("text-anchor", "middle")
            .style('fill', 'white')
            .text(d => (d.abbr));

    // Initialize Tooltip
    var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);

    circles.on("mouseover", d => {
        toolTip.style("display", "block")
            .html(`<strong>${dateFormatter(d.age)}<strong><hr>${d.income} medal(s) won`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
        })
        .on("mouseout", () => toolTip.style("display", "none"));

    // Create Labels for Axes 
    Group.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 10)
    .attr("x", 0 - (height / 1.2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-family", "helvetica")
    .attr("font-size", "30px")
    .style('stroke', 'white')
    .text("Income");
    

Group.append("text")
    .attr("transform", `translate(${width / 2.3}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .attr("font-family", "helvetica")
    .attr("font-size", "30px")
    .style('stroke', 'white')
    .text("Age");

    }).catch(function(error) {
            console.log(error);
    });