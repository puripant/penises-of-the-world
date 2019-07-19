const width = 850;
const height = 600;
const spacing = 120;
const numPerRow = 7;
const padding = 5;

let svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);
let g = svg.append("g");
    
d3.json("all-penises.json", function(err, drawings) {
  console.log(d3.nest().key(d => d.countrycode).rollup(v => v.length).entries(drawings));

  let line =  d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis);
  
  let groups = g.selectAll("g.drawing").data(drawings.filter(d => d.countrycode === "TH"));
  let groupsE = groups.enter().append("g")
    .classed("drawing", true)
    .attr("transform", function(d, i) {
      let x = (i % numPerRow) * spacing + padding;
      let y = Math.floor(i/numPerRow) * spacing + padding;
      return "translate(" + [x,y] + ") scale(0.4)";
    })
    .on("click", d => { console.log(d) })
  let pathsE = groupsE.selectAll("path.stroke")
    .data(d => d.drawing.map(function(s) {
        let points = []
        s[0].forEach((x,i) => { points.push({ x: x, y: s[1][i] }) })
        return points;
      })
    )
    .enter().append("path")
    .classed("stroke", true);
  
  pathsE.attr("d", line);
});