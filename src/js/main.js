const dropDownBtn = document.querySelector(".btn-dropdown");
const closeBtn = document.querySelector(".btn-close");
const dropdown = document.querySelector(".dropdown-wrapper");

window.onload = function () {
  document.body.classList.add("loaded_hiding");
  window.setTimeout(function () {
    document.body.classList.add("loaded");
    document.body.classList.remove("loaded_hiding");
  }, 500);
};

function openNav() {
  dropDownBtn.classList.remove("active");
  closeBtn.classList.add("active");
  dropdown.classList.add("active");
}

function closeNav() {
  dropDownBtn.classList.add("active");
  closeBtn.classList.remove("active");
  dropdown.classList.remove("active");
}
