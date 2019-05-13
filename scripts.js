// Search on enter key event
function search_visibility(e) {
  if (
    e.keyCode == 27 &&
    (document.getElementById("search").style.display != "" ||
      document.getElementById("search").style.display != "none")
  ) {
    document.getElementById("search").style.display = "";
  }
  if (document.getElementById("search").style.display != "flex") {
    document.getElementById("search").style.display = "flex";
    document.getElementById("search-field").select();
  }
}

function search(e) {
  if (e.keyCode == 13) {
    var val = document.getElementById("search-field").value;
    // window.open("https://google.com/search?q=" + val);
    window.location = `https://google.com/search?q=${val}`;
  }
}
