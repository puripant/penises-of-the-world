const width = 850;
const height = 600;
const spacing = 120;
const numPerRow = 7;
const padding = 5;
const max_drawing = 35;

const $countries = $("#countries");

let svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);
let g = svg.append("g");
    
d3.json("all-penises.json", function(err, drawings) {
  let drawings_by_country = d3.nest().key(d => d.countrycode).object(drawings);
  let countries = Object.keys(drawings_by_country);

  countries.forEach(d => {
    $countries.append($("<option>", {
      value: d,
      text: d
    }));
  });
  $countries.dropdown({
    onChange: (value, text, $selectedItem) => {
      let country = $countries.dropdown('get value')[0];
      $('#drawing-num').text(drawings_by_country[country].length);

      svg.selectAll("g").remove();
      draw(svg.append("g"), drawings_by_country[country]);
    }
  });
});

function draw(g, drawings) {
  g.selectAll("g.drawing")
    .data(drawings.slice(0, max_drawing))
    .enter().append("g")
      .classed("drawing", true)
      .attr("transform", function(d, i) {
        let x = (i % numPerRow) * spacing + padding;
        let y = Math.floor(i/numPerRow) * spacing + padding;
        return "translate(" + [x,y] + ") scale(0.4)";
      })
      // .on("click", d => { console.log(d) })
      .selectAll("path.stroke")
      .data(d => d.drawing.map(s => {
          let points = []
          s[0].forEach((x,i) => { points.push({ x: x, y: s[1][i] }) })
          return points;
        })
      )
      .enter().append("path")
        .classed("stroke", true)
        .attr("d", d3.line()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveBasis)
        );
}