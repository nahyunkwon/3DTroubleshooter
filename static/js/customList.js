/* search & filter function for dropdown menu */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  //div = document.getElementById("myDropdown");
  a = document.getElementsByClassName("btnList");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText || a[i].text;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

/* filter solution cards for the selected button */
filterSelection("all");

function filterSelection(c) {
  var x, i, j, labels;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") {
    c = "";
    for (i = 0; i < x.length; i++) {
      w3RemoveClass(x[i], "show");
      if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
    }
    return;
  } else if (c.split(" ").length > 1) {
    var cArray = c.split(", ");

    for (j = 0; j < cArray.length; j++) {
      for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "show");
        labels = x[i].className.split("filterDiv ");

        if (cArray.includes(x[i].className.split("filterDiv")[1].trim())) {
          w3AddClass(x[i], "show");
        }
      }
    }

    return;
  }

  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    labels = x[i].className.split("filterDiv ");

    if (x[i].className.split("filterDiv")[1].trim() === c) {
      w3AddClass(x[i], "show");
    }
  }
}

function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

/* create solution cards */
function createButton(content, c) {
  var button = document.createElement("button");
  //button.type = "button";
  button.className = "btnList";
  button.innerHTML = content + " (" + c.split(", ").length.toString() + ")";
  //button.value = c;
  button.onclick = function () {
    filterSelection(c);
    diffFilter();
  };

  var selectPanel = document.getElementById("myBtnContainer");
  selectPanel.appendChild(button);
}

var terms_data;

$.ajax({
  async: false,
  global: false,
  url: "../static/3d_info/3D_technical_terms.json",
  dataType: "json",
  success: function (data) {
    terms_data = data;
  },
});

String.prototype.replaceAll = function (strReplace, strWith) {
  // See http://stackoverflow.com/a/3561711/556609
  var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  var reg = new RegExp(esc, "ig");
  return this.replace(reg, strWith);
};

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

function termToPopover(
  term,
  description,
  image_filename,
  synonyms,
  related_terms,
  desc_src
) {
  var disableClass = "";
  if (desc_src == "") {
    //disableClass = "disable-click";
  }
  var replace_text =
    '<div class="popover__wrapper">' +
    '<a target="_blank" style="color: #0363b3" ' +
    'class="popover__title ' +
    disableClass +
    '" href="' +
    desc_src +
    '">' +
    term +
    "</a>" +
    '</a><span class="popover__content"><p class="popover__message pop-term">' +
    capitalize(term) +
    '</p><div class="popover-flex">';

  if (image_filename !== "") {
    replace_text +=
      '<div class="popover-flex-2"><img src="../static/3d_info/desc_images/' +
      image_filename +
      '"></div>';
  }

  // replace_text +=
  //   '<div class="popover-flex-1"><p class="popover__message">' +
  //   description +
  //   "</p>";

  if (description !== "") {
    replace_text +=
      '<div class="popover-flex-1"><p class="popover__message">' +
      description +
      "</p>";
  } else {
    replace_text += "<div>";
  }

  //if(target_terms.length > 1){
  //var synonyms_list = target_terms.splice(target_terms.indexOf(target_terms[j]), 1);
  //replace_text += "<p class=\"popover__message\" style=\"color:dodgerblue\">Synonym: " + synonyms_list.toString() + "</p>";
  //}

  if (synonyms.length !== 1) {
    replace_text +=
      '<p class="popover__message related-terms">Synonym: ' +
      synonyms.join(", ") +
      "</p>";
  }

  if (related_terms !== "") {
    replace_text +=
      '<p class="popover__message related-terms">Related term: ' +
      related_terms +
      "</p>";
  }

  replace_text += "</div></div></span></div>";

  return replace_text;
}

/* create solution cards */
function createCard(
  title,
  content,
  filter,
  diffLevel_n,
  priority,
  tutorial_webdoc,
  tutorial_video
) {
  var card = document.createElement("div");
  //button.type = "button";
  // console.log(filter);
  card.className = "filterDiv " + filter + " show"; // + " diff-" + rndDiff;

  if (diffLevel_n == "0") {
    card.style = "background-color:#b3e6cc";
  } else if (diffLevel_n == "1") {
    card.style = "background-color:#F2F972";
  } else if (diffLevel_n == "2") {
    card.style = "background-color:#FA8585";
  }
  card.setAttribute("name", "diff-" + diffLevel_n);
  card.setAttribute("value", "diff-show");

  var target_terms;

  for (var i = 0; i < terms_data.length; i++) {
    target_terms = [terms_data[i]["term"]];

    if (terms_data[i]["synonyms"].length !== 0) {
      target_terms = target_terms.concat(terms_data[i]["synonyms"].split(", "));
    }

    //console.log(target_terms);
    for (var j = 0; j < target_terms.length; j++) {
      if (title.includes(target_terms[j])) {
        //target_terms_in_title.push(target_terms[j]);
        title = title.replace(target_terms[j], "placeholder" + target_terms[j]);
      } else if (title.includes(capitalize(target_terms[j]))) {
        title = title.replace(
          capitalize(target_terms[j]),
          "placeholder" + capitalize(target_terms[j])
        );
      } else if (content.includes(target_terms[j])) {
        //target_terms_in_content.push(target_terms[j]);
        content = content.replace(
          target_terms[j],
          "placeholder" + target_terms[j]
        );
      } else if (content.includes(capitalize(target_terms[j]))) {
        content = content.replace(
          capitalize(target_terms[j]),
          "placeholder" + capitalize(target_terms[j])
        );
      }
    }
  }

  for (i = 0; i < terms_data.length; i++) {
    target_terms = [terms_data[i]["term"]];

    if (terms_data[i]["synonyms"].length !== 0) {
      target_terms = target_terms.concat(terms_data[i]["synonyms"].split(", "));
    }

    var description = terms_data[i]["description"];
    var image_filename = terms_data[i]["image_filename"];
    var related_terms = terms_data[i]["related_terms"];
    var desc_src = terms_data[i]["desc_src"];
    var synonyms;

    for (j = 0; j < target_terms.length; j++) {
      title = title.replace(
        "placeholder" + target_terms[j],
        termToPopover(
          target_terms[j],
          description,
          image_filename,
          target_terms,
          related_terms,
          desc_src
        )
      );
      title = title.replace(
        "placeholder" + capitalize(target_terms[j]),
        termToPopover(
          capitalize(target_terms[j]),
          description,
          image_filename,
          target_terms,
          related_terms,
          desc_src
        )
      );

      content = content.replace(
        "placeholder" + target_terms[j],
        termToPopover(
          target_terms[j],
          description,
          image_filename,
          target_terms,
          related_terms,
          desc_src
        )
      );
      content = content.replace(
        "placeholder" + capitalize(target_terms[j]),
        termToPopover(
          capitalize(target_terms[j]),
          description,
          image_filename,
          target_terms,
          related_terms,
          desc_src
        )
      );
    }
  }

  title = title.replace('placeholder', '');
  content = content.replace('placeholder', '');

  if (priority == "0") {
    card.innerHTML =
      '<img src="../static/images/common_black.png" style="width:80px"><div class="card-title">' +
      capitalize(title) +
      //" -------- Diff level: " +
      //diffLevel_n +
      "</div>" +
      capitalize(content);
  } else {
    card.innerHTML =
      '<div class="card-title">' +
      capitalize(title) +
      //" -------- Diff level: " +
      //diffLevel_n +
      "</div>" +
      capitalize(content);
  }

  if (tutorial_webdoc != "") {
    //card.innerHTML += '<br> <button class="modal-btn" name="'+tutorial_webdoc+'|'+tutorial_video+'">View Tutorial</button>';

    card.innerHTML +=
      '<br><a href="' +
      tutorial_webdoc +
      '" style="color:dodgerblue;padding-top:7px" target="_blank">View Detail</a>';
  }
  if (tutorial_video != "") {
    card.innerHTML +=
      '<br><a href="' +
      tutorial_video +
      '" style="color:dodgerblue;padding-top:7px" target="_blank">View Video</a>';
  }

  // *** card.innerHTML =
  //   '<div class="customList-title">' + title + "</div>" + content;
  // '<p style="font-weight: bold; margin: 6px">' + title + "</p>" + content;

  var selectPanel = document.getElementById("solution_placeholder");
  selectPanel.appendChild(card);
}

/* create clue buttons and solution cards from json file for the given failure type name*/
var failure_type = "warping";

function loadSolutions(failure_type, priority) {
  var case_data = [];
  var clue_data = [];

  $.ajax({
    async: false,
    global: false,
    url: "../static/json/" + failure_type + "_case.json",
    //'url': "../static/json/test_case.json",
    dataType: "json",
    success: function (data) {
      case_data = data;
    },
  });

  $.ajax({
    async: false,
    global: false,
    url: "../static/json/" + failure_type + "_clue.json",
    dataType: "json",
    success: function (data) {
      clue_data = data;
    },
  });

  $("#myBtnContainer").empty();
  $("#solution_placeholder").empty();

  var featured_cases = [];

  for (k = 0; k < case_data.length; k++) {
    var sol_temp = "";
    //if (case_data[k]["solution"] != "") {
    sol_temp = '<div class="horiz-line"></div>' + case_data[k]["solution"];
    //}

    if (priority === case_data[k]["priority"]) {
      createCard(
        case_data[k]["case_content"],
        sol_temp,
        case_data[k]["case_id"],
        case_data[k]["difficulty_level"],
        case_data[k]["priority"],
        case_data[k]["tutorial_webdoc"],
        case_data[k]["tutorial_video"]
      );

      featured_cases.push(case_data[k]["case_id"]);
    }
  }

  /* All solutions button */
  var button = document.createElement("button");
  button.className = "btnList activeList";
  var count_all = case_data.length;
  button.innerHTML =
    "Select no clue and show every solution (" +
    featured_cases.length.toString() +
    ")";
  button.onclick = function () {
    filterSelection("all");
    diffFilter();
  };

  var selectPanel = document.getElementById("myBtnContainer");
  selectPanel.appendChild(button);

  /* buttons for clues */
  for (var k = 0; k < clue_data.length; k++) {
    var related_case = clue_data[k]["related_case"].split(", ");
    var target_case = [];

    for (var r = 0; r < related_case.length; r++) {
      if (featured_cases.includes(related_case[r])) {
        target_case.push(related_case[r]);
      }
    }

    if (target_case.length !== 0) {
      createButton(clue_data[k]["clue"], target_case.join(", "));
    }
  }

  /* create clue buttons and solution cards from json file */

  // createButton("testcontent", "a");
  // createCard("testtitle", "testcontent", "c");

  // Add activeList class to the current button (highlight it)
  var btnContainer = document.getElementById("myBtnContainer");
  var btns = btnContainer.getElementsByClassName("btnList");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("activeList");
      current[0].className = current[0].className.replace(" activeList", "");
      this.className += " activeList";
    });
  }
}

//// * Difficulty level checkbox
function diffFilter() {
  var selectLevel = document.querySelectorAll(
    ".diff-checkbox input[type='checkbox']"
  );
  var filters = {
    diffLevel: getClassOfCheckedCheckboxes(selectLevel),
  };

  filterResults(filters);
}

function getClassOfCheckedCheckboxes(checkboxes) {
  var classes = [];

  if (checkboxes && checkboxes.length > 0) {
    for (var i = 0; i < checkboxes.length; i++) {
      var cb = checkboxes[i];

      if (cb.checked) {
        classes.push(cb.getAttribute("rel"));
      }
    }
  }

  return classes;
}

function filterResults(filters) {
  var rElems = document.querySelectorAll(".filterDiv");
  var hiddenElems = [];

  if (!rElems || rElems.length <= 0) {
    return;
  }

  for (var i = 0; i < rElems.length; i++) {
    var el = rElems[i];

    if (filters.diffLevel.length > 0) {
      var isHidden = true;

      for (var j = 0; j < filters.diffLevel.length; j++) {
        var filter = filters.diffLevel[j];

        if (el.getAttribute("name") == filter) {
          isHidden = false;
          break;
        }
        // if (el.classList.contains(filter)) {
        //   isHidden = false;
        //   break;
        // }
      }

      if (isHidden) {
        hiddenElems.push(el);
      }
    }
  }

  for (var i = 0; i < rElems.length; i++) {
    rElems[i].setAttribute("value", "diff-show");
    // rElems[i].style.display = "block";
    // rElems[i].classList.add("diff-show");
    // rElems[i].classList.toggle("diff-show");
    // rElems[i].classList.toggle("diff-hide");
    // rElems[i].classList.toggle("show");
  }

  if (hiddenElems.length <= 0) {
    return;
  }

  for (var i = 0; i < hiddenElems.length; i++) {
    hiddenElems[i].setAttribute("value", "diff-hide");
    // hiddenElems[i].style.display = "none";
    // hiddenElems[i].classList.add("diff-hide");
    // hiddenElems[i].classList.toggle("diff-show");
    // hiddenElems[i].classList.toggle("diff-hide");
    // hiddenElems[i].classList.toggle("show");
  }
}
