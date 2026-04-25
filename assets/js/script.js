'use strict';

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) { elem.classList.toggle("active"); }



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when click on any navbar link
 */

for (let i = 0; i < navbarLinks.length; i++) { navElemArr.push(navbarLinks[i]); }

/**
 * addd event on all elements for toggling navbar
 */

for (let i = 0; i < navElemArr.length; i++) {
  if (navElemArr[i]) {
    navElemArr[i].addEventListener("click", function () {
      if (navbar) elemToggleFunc(navbar);
      if (overlay) elemToggleFunc(overlay);
    });
  }
}



/**
 * header active state
 */

const header = document.querySelector("[data-header]");

if (header) {
  window.addEventListener("scroll", function () {
    window.scrollY >= 400 ? header.classList.add("active")
      : header.classList.remove("active");
  }); 
} 

let currentSlide = 0;

function moveSlider(direction) {
  const wrapper = document.querySelector('.slider-wrapper');
  const slides = document.querySelectorAll('.slider-wrapper img');
  const totalSlides = slides.length;

  if (totalSlides === 0) return; 

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  const offset = -currentSlide * 100;
  wrapper.style.transform = `translateX(${offset}%)`;
}