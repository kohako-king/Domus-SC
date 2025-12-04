// ART.js (mantido)
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const indicatorsContainer = document.querySelector(".indicators");

let currentIndex = 0;

slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.addEventListener("click", () => showSlide(index));
  indicatorsContainer.appendChild(dot);
});

const indicators = document.querySelectorAll(".indicators div");
if (indicators[0]) indicators[0].classList.add("active");

function showSlide(index) {
  if (!slides.length) return;
  slides[currentIndex].classList.remove("active");
  indicators[currentIndex].classList.remove("active");
  currentIndex = (index + slides.length) % slides.length;
  slides[currentIndex].classList.add("active");
  indicators[currentIndex].classList.add("active");
}

if (prevBtn)
  prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
if (nextBtn)
  nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

setInterval(() => {
  showSlide(currentIndex + 1);
}, 5000);
