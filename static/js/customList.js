/* search & filter function for dropdown menu */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByClassName("btn");
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
  }
  else if (c.split(" ").length > 1) {
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
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
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
  button.className = "btn";
  button.innerHTML = content;
  //button.value = c;
  button.onclick = function() {

    filterSelection(c);

  }

  var selectPanel = document.getElementById('myBtnContainer');
  selectPanel.appendChild(button);
}



/* create solution cards */
function createCard(title, content, filter) {
  var card = document.createElement("div");
  //button.type = "button";
  //console.log(filter);
  card.className = "filterDiv " + filter + ' show';
  card.innerHTML = '<p style="font-weight: bold; margin: 6px">' + title + '</p>' + content;

  var selectPanel = document.getElementById('solution_placeholder');
  selectPanel.appendChild(card);
}



/* create clue buttons and solution cards from json file */

var case_data;
var clue_data;
var failure_type = 'layer_shifting';

$.ajax({
    'async': false,
    'global': false,
    'url': "../static/json/" + failure_type + "_case.json",
    'dataType': "json",
    'success': function (data) {
        case_data = data;
    }
});

$.ajax({
    'async': false,
    'global': false,
    'url': "../static/json/" + failure_type + "_clue.json",
    'dataType': "json",
    'success': function (data) {
        clue_data = data;
    }
});

for(var k=0;k<clue_data.length;k++){

  createButton(clue_data[k]['clue'],  clue_data[k]['related_case']);

}

for(k=0;k<case_data.length;k++){

  createCard(case_data[k]['case_content'], case_data[k]['solution'], case_data[k]['case_id']);

}


// Add active class to the current button (highlight it)
var btnContainer = document.getElementById("myBtnContainer");
var btns = btnContainer.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function(){
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}