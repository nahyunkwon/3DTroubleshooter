// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var modalBtns = document.getElementsByClassName("modal-btn")[0];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// var request = new XMLHttpRequest();
// request.open("GET", "./json/project-detail.json", false);
// request.send(null)
// var projects = JSON.parse(request.responseText);
console.log(case_data);
// When the user clicks the button, open the modal
// for(var i=0; i<btns.length; i++){
//   btns[i].onclick = function() {
//   modal.style.display = "block";

//   for(var j=0;j<projects.length;j++){
//     if(this.id == projects[j]['id']){
//         var current = projects[j];
//     }
//   }

modalBtns.onclick = function () {
  modal.style.display = "block";
};

document.getElementsByClassName("modal-body")[0].innerHTML =
  "<h4>" + "Title" + "</h4>" + "<hr>" + "<h5>Placeholder</h5>";

//document.getElementsByClassName("modal-body")[0].innerHTML = projects[0]['title'];
//  console.log(i);

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
