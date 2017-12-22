var hamburger = document.querySelector(".hamburger");
var navlist = document.querySelector(".nav-list");
var navlistLink = document.querySelector(".nav-list li a");

// toggle active state and visibility
hamburger.addEventListener("click", function() {
  hamburger.classList.toggle("is-active");
  navlist.classList.toggle("list-out");
  navlist.classList.toggle("list-in");
});

// close menu after selection
navlistLink.addEventListener("click", function() {
  setTimeout(function() {
    hamburger.classList.remove("is-active");
    navlist.classList.add("list-out");
    navlist.classList.remove("list-in");
  }, 500);
});
