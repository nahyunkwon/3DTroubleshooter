// Ref: https://bl.ocks.org/d3noob/5ba21a90a721cb19a47ff14c9513e43a

// Data
var path_w_size = 3; //5 // reversed factor (also is the unit)

var sankeyDB = {
  nodes: [
    { node: 0, name: "layer shifting", content: "Layer shifting" },
    { node: 1, name: "mechanical", content: "Mechanical" },
    { node: 2, name: "software", content: "Software" },
    {
      node: 3,
      name: "clue1",
      content:
        "Clue1: \nJudging by the fact that the skip appears to be in both the x and y axis.",
    },
    { node: 4, name: "clue2", content: "Clue2: \nA grinding noise." },
    {
      node: 5,
      name: "clue3",
      content: "Clue3: \nThe bed or extruder not moving during that event.",
    },
    {
      node: 6,
      name: "clue4",
      content:
        "Clue4: \nIf you attempt to move the printer faster than the motors can handle, you will \ntypically hear a clicking sound as the motor fails to achieve the desired position.",
    },
    {
      node: 7,
      name: "clue5",
      content:
        "Clue5: \nWhen this happens, the toolhead does not get to the desired location, which can \nimpact the alignment of all future layers of the print. In other words, layer misalignment \nis a reoccurring problem.",
    },
    {
      node: 8,
      name: "case1",
      content:
        "Case1: \nToolhead is moving too fast -> slow down. \n\nSolution: \nI find all jerk settings should be 10mm/s and master print speed shouldn't really go over \n40mm/s if you want a quality print on *most* machines. It may also be prudent to check and \npossibly reduce acceleration speeds.",
    },
    {
      node: 9,
      name: "case2",
      content:
        "Case2: \nBelt too loose/tight. \n\nSolution: \nCheck your x and y axis belts. When perfectly tensioned, they twang somewhat like a guitar \nstring. If under tensioned, you'll get lines like these. If over tensioned, you could have some \ndefects in prints but the danger is mostly to the motor and belt itself. There are videos you \ncan watch for this, as well as belt tensioners you can print.",
    },
    {
      node: 10,
      name: "case3",
      content:
        "Case3: \nSet-screw too loose, not tightened / pulley loose. \n\nSolution: \nNA.",
    },
    {
      node: 11,
      name: "case4",
      content:
        "Case4: \nNot enough electrical current getting to the motors. \n\nSolution: \nNA.",
    },
    {
      node: 12,
      name: "case5",
      content:
        "Case5: \nSwap x&y motors (electrical or software). \n\nSolution: \nNA.",
    },
    {
      node: 13,
      name: "case6",
      content:
        "Case6: \nCleaning issue - very sticky bearings/ rails / belts. \n\nSolution: \nNA.",
    },
    {
      node: 14,
      name: "case7",
      content: "Case7: \nTemperature - motors too hot. \n\nSolution: \nNA.",
    },
    {
      node: 15,
      name: "case8",
      content: "Case8: \nYour cables got caught. \n\nSolution: \nNA.",
    },
    {
      node: 16,
      name: "case9",
      content:
        "Case9: \nJerk/acceleration settings too high. \n\nSolution: \nI find all jerk settings should be 10mm/s and master print speed shouldn't really go over 40mm/s \nif you want a quality print on *most* machines. It may also be prudent to check and possibly \nreduce acceleration speeds.",
    },
    {
      node: 17,
      name: "case10",
      content:
        "Case10: \nThe sprockets are slipping on the motor shafts. \n\nSolution: \nNA.",
    },
    {
      node: 18,
      name: "case11",
      content: "Case11: \nBed is not secured properly. \n\nSolution: \nNA.",
    },
    {
      node: 19,
      name: "case12",
      content:
        "Case12: \nGCode or firmware issues. \n\nSolution: \nTry re slicing, using another slicer, or making sure your firmware is tip top.",
    },
    {
      node: 20,
      name: "case13",
      content:
        'Case13: \nI had the same issue while running Cura. It was because I had a setting called "Use Adaptive layers". \n\nSolution: \nAfter I disabled that feature, my prints have been coming out just fine.',
    },
    {
      node: 21,
      name: "case14",
      content:
        "Case14: \nDisable z hop if it's on, may solve inconsistent layer lines. \n\nSolution: \nDisable z hop.",
    },
    {
      node: 22,
      name: "case15",
      content:
        "Case15: \nCheck your z screw(s) to see if they're lubricated properly, they may need re-lubing. \n\nSolution: \nNA.",
    },
    {
      node: 23,
      name: "case16",
      content:
        "Case16: \nCheck your wheels. Every single wheel can be tightened or loosened, and become loose over \nlong periods of time and use. \n\nSolution: \nStart with the eccentric nut wheels, tighten them ever so slightly, and then lightly roll \nthe wheel with your finger, you should be able to move the bed/x axis with a bit of force \nbut not too much, and you shouldn't have to press the wheel in. The other wheels can be \ntightened by their primary bolt/screw holding the wheel in place, same procedure.",
    },
    {
      node: 24,
      name: "case17",
      content:
        "Case17: \nCheck the belts and make sure they aren’t missing any teeth or have any wear that would cause it to skip. \n\nSolution: \nNA.",
    },
  ],
  ////* nodes without contents
  // nodes: [
  //   { node: 0, name: "layer shifting" },
  //   { node: 1, name: "mechanical" },
  //   { node: 2, name: "software" },
  //   { node: 3, name: "clue1" },
  //   { node: 4, name: "clue2" },
  //   { node: 5, name: "clue3" },
  //   { node: 6, name: "clue4" },
  //   { node: 7, name: "clue5" },
  //   { node: 8, name: "case1" },
  //   { node: 9, name: "case2" },
  //   { node: 10, name: "case3" },
  //   { node: 11, name: "case4" },
  //   { node: 12, name: "case5" },
  //   { node: 13, name: "case6" },
  //   { node: 14, name: "case7" },
  //   { node: 15, name: "case8" },
  //   { node: 16, name: "case9" },
  //   { node: 17, name: "case10" },
  //   { node: 18, name: "case11" },
  //   { node: 19, name: "case12" },
  //   { node: 20, name: "case13" },
  //   { node: 21, name: "case14" },
  //   { node: 22, name: "case15" },
  //   { node: 23, name: "case16" },
  //   { node: 24, name: "case17" },
  // ],

  links: [
    ////* root to clues
    { source: 0, target: 1, value: 1 },
    { source: 0, target: 2, value: 1 },
    { source: 1, target: 4, value: 1 },
    { source: 1, target: 5, value: 1 },
    { source: 1, target: 7, value: 1 },
    { source: 2, target: 3, value: 1 },
    { source: 2, target: 6, value: 1 },
    ////* clues to cases
    { source: 3, target: 16, value: 1 },
    { source: 4, target: 9, value: 1 },
    { source: 4, target: 10, value: 1 },
    { source: 5, target: 9, value: 1 },
    { source: 5, target: 10, value: 1 },
    { source: 6, target: 8, value: 1 },
    { source: 7, target: 10, value: 1 },
    ////* root to cases
    { source: 1, target: 11, value: 1 },
    { source: 1, target: 12, value: 1 },
    { source: 1, target: 13, value: 1 },
    { source: 1, target: 14, value: 1 },
    { source: 1, target: 15, value: 1 },

    { source: 2, target: 17, value: 1 },
    { source: 1, target: 18, value: 1 },
    { source: 2, target: 19, value: 1 },
    { source: 2, target: 20, value: 1 },
    { source: 2, target: 21, value: 1 },
    { source: 1, target: 22, value: 1 },
    { source: 1, target: 23, value: 1 },
    { source: 1, target: 24, value: 1 },
    // { source: 3, target: 9, value: 1 },
    // { source: 3, target: 10, value: 1 },
    // { source: 4, target: 10, value: 1 },
    // { source: 4, target: 11, value: 1 },
    // { source: 5, target: 9, value: 1 },
    // { source: 6, target: 11, value: 1 },
    // { source: 7, target: 11, value: 1 },
  ],
};

// //* Ex-1
// var sankeyDB = {
//   nodes: [
//     { node: 0, name: "mechanical" },
//     { node: 1, name: "software" },
//     { node: 2, name: "case1" },
//     { node: 3, name: "case2" },
//     { node: 4, name: "case3" },
//     { node: 5, name: "case4" },
//     { node: 6, name: "case5" },
//     { node: 7, name: "case6" },
//     { node: 8, name: "clue1" },
//     { node: 9, name: "clue2" },
//     { node: 10, name: "clue3" },
//     { node: 11, name: "clue4" },
//   ],
//   links: [
//     { source: 0, target: 2, value: 1 },
//     { source: 0, target: 3, value: 1 },
//     { source: 0, target: 4, value: 1 },
//     { source: 0, target: 5, value: 1 },
//     { source: 1, target: 6, value: 1 },
//     { source: 1, target: 7, value: 1 },
//     { source: 2, target: 8, value: 1 },
//     { source: 3, target: 9, value: 1 },
//     { source: 3, target: 10, value: 1 },
//     { source: 4, target: 10, value: 1 },
//     { source: 4, target: 11, value: 1 },
//     { source: 5, target: 9, value: 1 },
//     { source: 6, target: 11, value: 1 },
//     { source: 7, target: 11, value: 1 },
//   ],
// };

// //* Ex as React
// var sankeyDB = {
//   nodes: [
//     { node: 0, name: "node0" },
//     { node: 1, name: "node1" },
//     { node: 2, name: "node2" },
//     { node: 3, name: "node3" },
//     { node: 4, name: "node4" },
//     { node: 5, name: "node5" },
//     { node: 6, name: "node6" },
//   ],
//   links: [
//     { source: 0, target: 1, value: 1 },
//     { source: 0, target: 2, value: 1 },
//     { source: 0, target: 3, value: 1 },
//     { source: 1, target: 4, value: 1 },
//     { source: 1, target: 5, value: 1 },
//     { source: 2, target: 4, value: 1 },
//     { source: 3, target: 5, value: 1 },
//     { source: 3, target: 6, value: 1 },
//   ],
// };

// var sankeyDB = {
//   nodes: [
//     { node: 0, name: "node0" },
//     { node: 1, name: "node1" },
//     { node: 2, name: "node2" },
//     { node: 3, name: "node3" },
//     { node: 4, name: "node4" },
//   ],
//   links: [
//     { source: 0, target: 2, value: 2 },
//     { source: 1, target: 2, value: 2 },
//     { source: 1, target: 3, value: 2 },
//     { source: 0, target: 4, value: 2 },
//     { source: 2, target: 3, value: 2 },
//     { source: 2, target: 4, value: 2 },
//     { source: 3, target: 4, value: 4 },
//   ],
// };

d3.sankey = function () {
  var sankey = {},
    nodeWidth = 24,
    nodePadding = 8,
    size = [1, 1],
    nodes = [],
    links = [];

  sankey.nodeWidth = function (_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodePadding = function (_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function (_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };

  sankey.links = function (_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };

  sankey.size = function (_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function (iterations) {
    computeNodeLinks();
    computeNodeValues();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    return sankey;
  };

  sankey.relayout = function () {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = function () {
    var curvature = 0.5;

    function link(d) {
      var x0 = d.source.x + d.source.dx,
        x1 = d.target.x,
        xi = d3.interpolateNumber(x0, x1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature),
        y0 = d.source.y + d.sy + d.dy / 2,
        y1 = d.target.y + d.ty + d.dy / 2;
      return (
        "M" +
        x0 +
        "," +
        y0 +
        "C" +
        x2 +
        "," +
        y0 +
        " " +
        x3 +
        "," +
        y1 +
        " " +
        x1 +
        "," +
        y1
      );
    }

    link.curvature = function (_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function (node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function (link) {
      var source = link.source,
        target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach(function (node) {
      node.value = Math.max(
        // d3.sum(node.sourceLinks, value),  // original path width
        // d3.sum(node.targetLinks, value)
        d3.sum(node.sourceLinks, value) * path_w_size,
        d3.sum(node.targetLinks, value) * path_w_size
      );
    });
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    var remainingNodes = nodes,
      nextNodes,
      x = 0;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function (node) {
        node.x = x;
        node.dx = nodeWidth;
        node.sourceLinks.forEach(function (link) {
          if (nextNodes.indexOf(link.target) < 0) {
            nextNodes.push(link.target);
          }
        });
      });
      remainingNodes = nextNodes;
      ++x;
    }

    //
    moveSinksRight(x);
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
  }

  function moveSourcesRight() {
    nodes.forEach(function (node) {
      if (!node.targetLinks.length) {
        node.x =
          d3.min(node.sourceLinks, function (d) {
            return d.target.x;
          }) - 1;
      }
    });
  }

  function moveSinksRight(x) {
    nodes.forEach(function (node) {
      if (!node.sourceLinks.length) {
        node.x = x - 1;
      }
    });
  }

  function scaleNodeBreadths(kx) {
    nodes.forEach(function (node) {
      node.x *= kx;
    });
  }

  function computeNodeDepths(iterations) {
    var nodesByBreadth = d3
      .nest()
      .key(function (d) {
        return d.x;
      })
      .sortKeys(d3.ascending)
      .entries(nodes)
      .map(function (d) {
        return d.values;
      });

    //
    initializeNodeDepth();
    resolveCollisions();
    for (var alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft((alpha *= 0.99));
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function (nodes) {
        return (
          (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value)
        );
      });

      nodesByBreadth.forEach(function (nodes) {
        nodes.forEach(function (node, i) {
          node.y = i;
          node.dy = node.value * ky;
        });
      });

      links.forEach(function (link) {
        link.dy = link.value * ky;
      });
    }

    function relaxLeftToRight(alpha) {
      nodesByBreadth.forEach(function (nodes, breadth) {
        nodes.forEach(function (node) {
          if (node.targetLinks.length) {
            var y =
              d3.sum(node.targetLinks, weightedSource) /
              d3.sum(node.targetLinks, value);
            node.y += (y - center(node)) * alpha;
          }
        });
      });

      function weightedSource(link) {
        return center(link.source) * link.value;
      }
    }

    function relaxRightToLeft(alpha) {
      nodesByBreadth
        .slice()
        .reverse()
        .forEach(function (nodes) {
          nodes.forEach(function (node) {
            if (node.sourceLinks.length) {
              var y =
                d3.sum(node.sourceLinks, weightedTarget) /
                d3.sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

      function weightedTarget(link) {
        return center(link.target) * link.value;
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach(function (nodes) {
        var node,
          dy,
          y0 = 0,
          n = nodes.length,
          i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y0 - node.y;
          if (dy > 0) node.y += dy;
          y0 = node.y + node.dy + nodePadding;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1];
        if (dy > 0) {
          y0 = node.y -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y + node.dy + nodePadding - y0;
            if (dy > 0) node.y -= dy;
            y0 = node.y;
          }
        }
      });
    }

    function ascendingDepth(a, b) {
      return a.y - b.y;
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function (node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function (node) {
      var sy = 0,
        ty = 0;
      node.sourceLinks.forEach(function (link) {
        link.sy = sy;
        sy += link.dy;
      });
      node.targetLinks.forEach(function (link) {
        link.ty = ty;
        ty += link.dy;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function center(node) {
    return node.y + node.dy / 2;
  }

  function value(link) {
    return link.value;
  }

  return sankey;
};
