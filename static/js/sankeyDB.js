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
        "Clue4: \nIf you attempt to move the printer faster than the motors can handle, you will typically hear \na clicking sound as the motor fails to achieve the desired position.",
    },
    {
      node: 7,
      name: "clue5",
      content:
        "Clue5: \nWhen this happens, the toolhead does not get to the desired location, which can impact \nthe alignment of all future layers of the print. In other words, layer misalignment is a \nreoccurring problem.",
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
        "Case9: \nJerk/acceleration settings too high. \n\nSolution: \nI find all jerk settings should be 10mm/s and master print speed shouldn't really go over \n40mm/s if you want a quality print on *most* machines. It may also be prudent to check \nand possibly reduce acceleration speeds.",
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
        "Case16: \nCheck your wheels. Every single wheel can be tightened or loosened, and become loose \nover long periods of time and use. \n\nSolution: \nStart with the eccentric nut wheels, tighten them ever so slightly, and then lightly roll the \nwheel with your finger, you should be able to move the bed/x axis with a bit of force but \nnot too much, and you shouldn't have to press the wheel in. The other wheels can be \ntightened by their primary bolt/screw holding the wheel in place, same procedure.",
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
