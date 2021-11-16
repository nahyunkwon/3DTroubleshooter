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


var terms_data;

$.ajax({
    'async': false,
    'global': false,
    'url': "../static/3d_info/3D_technical_terms.json",
    'dataType': "json",
    'success': function (data) {
        terms_data = data;
    }
});

String.prototype.replaceAll = function(strReplace, strWith) {
    // See http://stackoverflow.com/a/3561711/556609
    var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var reg = new RegExp(esc, 'ig');
    return this.replace(reg, strWith);
};

function capitalize(s)
{
    return s && s[0].toUpperCase() + s.slice(1);
}

function termToPopover(term, description, image_filename, synonyms, related_terms){
  var replace_text = "<div class=\"popover__wrapper\"><a href=\"\" class=\"popover__title\">"+term+"</a><span class=\"popover__content\"><p class=\"popover__message\">"+ capitalize(term);

  if(image_filename !== ""){

    replace_text += "</p><img src=\"../static/3d_info/desc_images/"+ image_filename+"\" style=\"width:300px\">";
  }

  replace_text += "<p class=\"popover__message\">" + description +"</p>";

  //if(target_terms.length > 1){
    //var synonyms_list = target_terms.splice(target_terms.indexOf(target_terms[j]), 1);
    //replace_text += "<p class=\"popover__message\" style=\"color:dodgerblue\">Synonym: " + synonyms_list.toString() + "</p>";
  //}

  if(synonyms.length !== 1){
    replace_text += "<p class=\"popover__message\" style=\"color:dodgerblue\">Synonym: " + synonyms.join(', ') +"</p>";
  }

  if(related_terms !== ""){
    replace_text += "<p class=\"popover__message\" style=\"color:dodgerblue\">Related term: " + related_terms +"</p>";
  }

  replace_text += "</div></span>";

  return replace_text;
}

/* create solution cards */
function createCard(title, content, filter) {
  var card = document.createElement("div");
  //button.type = "button";
  //console.log(filter);
  card.className = "filterDiv " + filter + ' show';

  var target_terms;

  for(var i=0; i<terms_data.length; i++){

    target_terms = [terms_data[i]['term']];

    if(terms_data[i]['synonyms'].length !== 0){
      target_terms = target_terms.concat(terms_data[i]['synonyms'].split(", "));
    }

    //console.log(target_terms);
    for(var j=0; j<target_terms.length; j++) {
      if (title.includes(target_terms[j])) {
        //target_terms_in_title.push(target_terms[j]);
        title = title.replace(target_terms[j], "placeholder" + target_terms[j]);
      }
      if (title.includes(capitalize(target_terms[j]))){
        title = title.replace(capitalize(target_terms[j]), "placeholder" + capitalize(target_terms[j]));
      }

      if (content.includes(target_terms[j])) {
        //target_terms_in_content.push(target_terms[j]);
        content = content.replace(target_terms[j], "placeholder" + target_terms[j]);
      }
      if (content.includes(capitalize(target_terms[j]))){
        content = content.replace(capitalize(target_terms[j]), "placeholder" + capitalize(target_terms[j]));
      }
    }

  }


  for(i=0; i<terms_data.length; i++){

    target_terms = [terms_data[i]['term']];

    if(terms_data[i]['synonyms'].length !== 0){
      target_terms = target_terms.concat(terms_data[i]['synonyms'].split(", "));
    }

    var description = terms_data[i]['description'];
    var image_filename = terms_data[i]['image_filename'];
    var related_terms = terms_data[i]['related_terms'];
    var synonyms;

    for(j=0; j<target_terms.length; j++){

      title = title.replace("placeholder"+target_terms[j],
          termToPopover(target_terms[j], description, image_filename, target_terms, related_terms));
      title = title.replace("placeholder"+capitalize(target_terms[j]),
          termToPopover(capitalize(target_terms[j]), description, image_filename, target_terms, related_terms));

      content = content.replace("placeholder"+target_terms[j],
          termToPopover(target_terms[j], description, image_filename, target_terms, related_terms));
      content = content.replace("placeholder"+capitalize(target_terms[j]),
          termToPopover(capitalize(target_terms[j]), description, image_filename, target_terms, related_terms));

    }

  }


  card.innerHTML = '<div class="card-title">' + capitalize(title) + '</div>' + capitalize(content);

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
    //'url': "../static/json/test_case.json",
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