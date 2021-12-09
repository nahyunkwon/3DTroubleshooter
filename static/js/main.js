var boxBorderColor = "springgreen";

function resetToggle() {
// Uncheck auto-crop toggle
let elm = document.getElementById("toggle");
if (elm.checked == true) {
  elm.click();
}
}

// Tab control
function openTab(evt, imgID) {
var i, tabcontent, tablinks;
tabcontent = document.getElementsByClassName("tab-content");
for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
}
tablinks = document.getElementsByClassName("tab-links");
for (i = 0; i < tablinks.length; i++) {
  tablinks[i].className = tablinks[i].className.replace(" active", "");
}
document.getElementById(imgID).style.display = "block";
evt.currentTarget.className += " active";
}
// Tab for solution section
function openTab_sol(evt, imgID) {
var i, tabcontent, tablinks;
tabcontent = document.getElementsByClassName("tab-content-sol");
for (i = 0; i < tabcontent.length; i++) {
  tabcontent[i].style.display = "none";
}
tablinks = document.getElementsByClassName("tab-links-sol");
for (i = 0; i < tablinks.length; i++) {
  tablinks[i].className = tablinks[i].className.replace(" active", "");
}
document.getElementById(imgID).style.display = "block";
evt.currentTarget.className += " active";
}

// Image upload Button control
function showHideDiv(id, set_display = "block") {
let x = document.getElementById(id);
if (x.style.display === set_display) {
  x.style.display = "none";
} else {
  x.style.display = set_display;
}
}

// Default open tab 1
document.getElementById("defaultOpen").click();
document.getElementById("defaultOpen_sol").click();

function addText(inputID) {
document.getElementById("btm-div-sol").style.display = "none";
document.getElementById("btm-div-info").style.display = "flex";
d3.select("#solution-div").selectAll("*").remove();

d3.select("#errText").text(inputID);

d3.select("#errInfo").text(errDB[inputID]);
}

// Default click error info for issue #1
document.getElementById("btn-info-0-0").click();

// Function to compute length of an Object
Object.size = function (obj) {
var size = 0,
  key;
for (key in obj) {
  if (obj.hasOwnProperty(key)) size++;
}
return size;
};

// Display solutions and thumbs up/down
function showSolution(inputID) {
document.getElementById("btm-div-info").style.display = "none";
document.getElementById("btm-div-sol").style.display = "block";
d3.select("#errText-sol").text(inputID);

d3.select("#solution-div").selectAll("*").remove();
}

// Card link to sub cam map
// For mouse over and off

function showHideMap_on(card_id, card_val, file_idx) {
let err_idx = parseInt(card_val.split("-")[0]) - 1;
let map_id = "sub-map-" + err_idx + "-" + file_idx;

let x = document.getElementById(map_id);
x.style.display = "block";
x.style.zIndex = "100";

let y = document.getElementById(card_id);
y.style.borderColor = boxBorderColor;
}

function showHideMap_off(card_id, card_val, file_idx) {
let err_idx = parseInt(card_val.split("-")[0]) - 1;
let map_id = "sub-map-" + err_idx + "-" + file_idx;

let x = document.getElementById(map_id);

let y = document.getElementById(card_id);
if (y.style.borderStyle === "solid") {
  x.style.zIndex = "90";
} else {
  x.style.display = "none";
  x.style.zIndex = "50";
  y.style.borderColor = "white";
}
}

// For click
function showHideMap_click(card_id, card_val, file_idx) {
let err_idx = parseInt(card_val.split("-")[0]) - 1;
let map_id = "sub-map-" + err_idx + "-" + file_idx;

let x = document.getElementById(map_id);

let y = document.getElementById(card_id);
const style_now = y.style.borderStyle;

// Reset other selections
let zz = document.querySelectorAll(".uploaded-img-map-sub-" + file_idx);
let cc = document.querySelectorAll(".card-top-" + file_idx);
for (let z = 0; z < zz.length; ++z) {
  zz[z].style.display = "none";
  zz[z].style.zIndex = "50";
}
for (let c = 0; c < cc.length; ++c) {
  cc[c].style.borderColor = "white";
  cc[c].style.borderStyle = "dotted";
}

if (style_now === "solid") {
  y.style.borderStyle = "dotted";
} else {
  y.style.borderStyle = "solid";
  y.style.borderColor = boxBorderColor;
  x.style.zIndex = "100";
  x.style.display = "block";
}
}

var units = "widgets";
      var node_w = 120;
      var node_h = 20;
      var sankey_w = 1400;
      var sankey_h = 1100;
      var extra_width = 200;
      var extra_height = 50;

      // set the dimensions and margins of the graph
      var margin = { top: 10, right: 10, bottom: 10, left: 10 },
        width = sankey_w - margin.left - margin.right,
        height = sankey_h - margin.top - margin.bottom;

      // format variables
      var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function (d) {
          return "(" + formatNumber(d) + " " + units + ")";
        },
        // color = d3.scaleOrdinal(d3.schemeCategory10);
        // color = d3.scaleOrdinal([`#32a852`]);
        color = d3.scaleOrdinal([`forestgreen`]);

      // append the svg object to the body of the page
      var sanSVG = d3
        .select("#sankey-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right + extra_width)
        .attr("height", height + margin.top + margin.bottom + extra_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set the sankey diagram properties
      var sankey = d3
        .sankey()
        .nodeWidth(node_w)
        .nodePadding(40)
        .size([width, height]);

      var sanPath = sankey.link();

      // load the data from "sankey.js"
      sankey.nodes(sankeyDB.nodes).links(sankeyDB.links).layout(32);

      // add in the links
      var sanLink = sanSVG
        .append("g")
        .selectAll(".san-link")
        .data(sankeyDB.links)
        .enter()
        .append("path")
        .attr("class", "san-link")
        .attr("id", function (d, i) {
          d.id = i;
          return "san-link-" + i;
        })
        // .attr("id", function (d) {
        //   return "san-link-" + d.source.name.replace(/\s+/g, '') + "-" + d.target.name.replace(/\s+/g, '')
        // })
        .attr("d", sanPath)
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        })
        .on("mouseover", function () {
          d3.select("#" + this.id).style("stroke-opacity", 0.5);
        })
        .on("mouseout", function () {
          d3.select("#" + this.id).style("stroke-opacity", 0.2);
        });

      // add the link titles
      sanLink.append("title").text(function (d) {
        return d.source.name + " → " + d.target.name + "\n" + format(d.value);
      });

      // add in the nodes
      var sanNode = sanSVG
        .append("g")
        .selectAll(".san-node")
        .data(sankeyDB.nodes)
        .enter()
        .append("g")
        .attr("class", "san-node")
        .attr("id", function (d) {
          return "san-g-" + d.name.replace(/\s+/g, "");
        })
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
        .call(
          d3
            .drag()
            .subject(function (d) {
              return d;
            })
            .on("start", function () {
              this.parentNode.appendChild(this);
            })
            .on("drag", dragmove)
        )
        .on("mouseover", highlight_node_links)
        .on("mouseout", highlight_node_links);

      // add the rectangles for the nodes
      sanNode
        .append("rect")
        .attr("class", "san-node-rect")
        .attr("height", function (d) {
          // return d.dy;
          return d.dy + 8;
          // return node_h;
        })
        .attr("id", function (d) {
          return "san-node-" + d.name.replace(/\s+/g, "") + "-" + d.node;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return (d.color = color(d.name.replace(/ .*/, "")));
        })
        // .attr("onmouseout", "this.style.fill='forestgreen';")
        // .attr("onmouseover", "this.style.fill='orange';")

        // .on("mouseover", function () {this.style.fill='orange';})

        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
          return d.content + "\n\n" + format(d.value / path_w_size);
        });

      // add in the title for the nodes
      sanNode
        .append("text")
        .attr("class", "node-text")
        .attr("x", 4)
        .attr("y", function (d) {
          // return d.dy / 2;
          // return node_h / 2;
          return 10;
        })
        .attr("dy", ".35em")
        // .attr("text-anchor", "end")
        .attr("transform", null)
        // .style('fill', 'white')
        .text(function (d) {
          return d.name;
          // return d.content;
        })
        // .filter(function (d) {
        //   return d.x < width / 2;
        // })
        // .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
      // .append("tspan")
      // .attr("x", 20)
      // .attr("dx", 10)
      // .attr("dy", 22)
      // .text("line2")

      /////////////////////////////////////////////////

      var sanNodeRects = document.getElementsByClassName("san-node-rect");
      var sanLinkPaths = document.getElementsByClassName("san-link");

      // var sanNodeRects = document.getElementById("san-node-mechanical");
      var nodes_old_h = [];
      for (let j = 0; j < sanNodeRects.length; j++) {
        nodes_old_h.push(sanNodeRects[j].style.height);
      }

      for (let i = 0; i < sanNodeRects.length; i++) {
        sanNodeRects[i].addEventListener("mousedown", function () {
          var panel = this;
          if (panel.style.fill == "orange") {
            panel.style.fill = "forestgreen";

            for (let k = 0; k < sanLinkPaths.length; k++) {
              sanLinkPaths[k].style.stroke = "#000";
            }
          } else {
            for (let j = 0; j < sanNodeRects.length; j++) {
              sanNodeRects[j].style.fill = "forestgreen";
            }
            panel.style.fill = "orange";

            // d3.select("#sankey-content").text(sankeyDB.nodes[this.id.split("-")[3]].content);

            document.getElementById("sankey-content").innerHTML = sankeyDB.nodes[
              this.id.split("-")[3]
            ].content.replace(/(\r\n|\n|\r)/gm, "<br>");

            for (let k = 0; k < sanLinkPaths.length; k++) {
              if (sanLinkPaths[k].style["stroke-opacity"] == "0.5") {
                sanLinkPaths[k].style.stroke = "red";
              } else {
                sanLinkPaths[k].style.stroke = "#000";
              }
            }
          }
        });
      }

      /////////////////////////////////////////////////

      // the function for moving the nodes
      function dragmove(d) {
        d3.select(this).attr(
          "transform",
          "translate(" +
            d.x +
            "," +
            (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
            ")"
        );
        sankey.relayout();
        sanLink.attr("d", sanPath);
      }

      //* Function for hightlighting entire path

      function highlight_node_links(node, i) {
        var remainingNodes = [],
          nextNodes = [];

        var stroke_opacity = 0;

        if (d3.select(this).attr("mouseover") == "0") {
          d3.select(this).attr("mouseover", "1");
          stroke_opacity = 0.2;
        } else {
          d3.select(this).attr("mouseover", "0");
          stroke_opacity = 0.5;
        }

        var traverse = [
          {
            linkType: "sourceLinks",
            nodeType: "target",
          },
          {
            linkType: "targetLinks",
            nodeType: "source",
          },
        ];

        traverse.forEach(function (step) {
          node[step.linkType].forEach(function (link) {
            remainingNodes.push(link[step.nodeType]);
            highlight_link(link.id, stroke_opacity);
          });

          while (remainingNodes.length) {
            nextNodes = [];
            remainingNodes.forEach(function (node) {
              node[step.linkType].forEach(function (link) {
                nextNodes.push(link[step.nodeType]);
                highlight_link(link.id, stroke_opacity);
              });
            });

            remainingNodes = nextNodes;
          }
        });
      }

      function highlight_link(id, opacity) {
        d3.select("#san-link-" + id).style("stroke-opacity", opacity);
      }

// const slider = document.querySelector(".scrolling-wrapper");
      // let mouseDown = false;
      // let startX, scrollLeft;

      // let startDragging = function (e) {
      //   mouseDown = true;
      //   startX = e.pageX - slider.offsetLeft;
      //   scrollLeft = slider.scrollLeft;
      // };
      // let stopDragging = function (event) {
      //   mouseDown = false;
      // };

      // slider.addEventListener("mousemove", (e) => {
      //   e.preventDefault();
      //   if (!mouseDown) {
      //     return;
      //   }
      //   const x = e.pageX - slider.offsetLeft;
      //   const scroll = x - startX;
      //   slider.scrollLeft = scrollLeft - scroll;
      // });

      // // Add the event listeners
      // slider.addEventListener("mousedown", startDragging, false);
      // slider.addEventListener("mouseup", stopDragging, false);
      // slider.addEventListener("mouseleave", stopDragging, false);
      $(function(){
        var requiredCheckboxes = $('.browsers :checkbox[required]');
        requiredCheckboxes.change(function(){
            if(requiredCheckboxes.is(':checked')) {
                requiredCheckboxes.removeAttr('required');
            } else {
                requiredCheckboxes.attr('required', 'required');
            }
        });
    });

function addClass() {
    d3.select(".sub-map-0").node().classList.add("flex_imageselector_on");
  }

  function showHideClass(className, set_display = "block") {
    let x = document.getElementsByClassName(className);
    for (let i = 0; i < x.length; i++)
      if (x[i].style.display === set_display) {
        x[i].style.display = "none";
      } else {
        x[i].style.display = set_display;
      }
  }