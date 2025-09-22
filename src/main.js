import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(Flip, SplitText);

// Function to disable scrolling
const disableScroll = () => {
  // Store current scroll position
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Add CSS to prevent scrolling
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollTop}px`;
  document.body.style.left = `-${scrollLeft}px`;
  document.body.style.width = "100%";
  document.body.style.height = "100%";

  // Prevent scroll events
  window.addEventListener("wheel", preventDefault, { passive: false });
  window.addEventListener("touchmove", preventDefault, { passive: false });
  window.addEventListener("keydown", preventDefaultForScrollKeys, {
    passive: false,
  });
};

// Function to enable scrolling
const enableScroll = () => {
  // Get the stored scroll position
  const scrollTop = parseInt(document.body.style.top || "0") * -1;
  const scrollLeft = parseInt(document.body.style.left || "0") * -1;

  // Remove CSS that prevents scrolling
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.width = "";
  document.body.style.height = "";

  // Restore scroll position
  window.scrollTo(scrollLeft, scrollTop);

  // Remove scroll event listeners
  window.removeEventListener("wheel", preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("keydown", preventDefaultForScrollKeys);
};

// Prevent default function for events
const preventDefault = (e) => {
  e.preventDefault();
};

// Keys that can cause scrolling
const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

// Prevent default for specific keys
const preventDefaultForScrollKeys = (e) => {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
};

const setupTextSplit = () => {
  const textElements = document.querySelectorAll(
    ".hero h1, .hero h2, .hero p, .hero a"
  );

  textElements.forEach((element) => {
    SplitText.create(element, {
      type: "lines",
      linesClass: "line",
    });

    const lines = element.querySelectorAll(".line");
    lines.forEach((line) => {
      const textContent = line.textContent;
      line.innerHTML = `<span>${textContent}</span>`;
    });
  });
};

const createCounterDigits = () => {
  // Counter 1: Create digits normally without special offset
  const counter1 = document.querySelector(".counter-1");
  const num0 = document.createElement("div");
  num0.className = "num";
  num0.textContent = "0";
  counter1.appendChild(num0);

  const num1 = document.createElement("div");
  num1.className = "num"; // Remove numoffset1 class
  num1.textContent = "1";
  counter1.appendChild(num1);

  // Counter 2: Create digits 0-9 with conditional offset class
  const counter2 = document.querySelector(".counter-2");
  for (let i = 0; i < 10; i++) {
    const numDiv = document.createElement("div");
    numDiv.className = i === 1 ? "num numoffset2" : "num";
    numDiv.textContent = i;
    counter2.appendChild(numDiv);
  }
  // Add final 0 for the "100"
  const finalTens = document.createElement("div");
  finalTens.className = "num";
  finalTens.textContent = "0";
  counter2.appendChild(finalTens);

  // Counter 3: Create digits 0-9 (ones place)
  const counter3 = document.querySelector(".counter-3");
  for (let i = 0; i < 10; i++) {
    const numDiv = document.createElement("div");
    numDiv.className = "num";
    numDiv.textContent = i;
    counter3.appendChild(numDiv);
  }

  // Final counter: Create final digit with "0" for "100"
  const finalNum = document.createElement("div");
  finalNum.className = "num";
  finalNum.textContent = "0";
  counter3.appendChild(finalNum);
};

const animateCounter = (counter, duration, delay = 0) => {
  const numHeight = counter.querySelector(".num").clientHeight;
  const totalDistance =
    (counter.querySelectorAll(".num").length - 1) * numHeight;

  gsap.to(counter, {
    y: -totalDistance,
    duration: duration,
    delay: delay,
    ease: "power2.inOut",
  });
};

function animateImages() {
  const images = document.querySelectorAll(".img");

  images.forEach((img) => {
    img.classList.remove("animate-out");
  });

  const state = Flip.getState(images);

  images.forEach((img) => img.classList.add("animate-out"));

  const mainTimeline = gsap.timeline();

  mainTimeline.add(
    Flip.from(state, {
      duration: 1,
      stagger: 0.1,
      ease: "power3.inOut",
    })
  );

  images.forEach((image, idx) => {
    const scaleTimeline = gsap.timeline();

    scaleTimeline
      .to(image, { scale: 2.5, duration: 0.45, ease: "power3.in" }, 0.025)
      .to(image, { scale: 1, duration: 0.45, ease: "power3.out" }, 0.5);

    mainTimeline.add(scaleTimeline, idx * 0.1);
  });

  return mainTimeline;
}

document.addEventListener("DOMContentLoaded", async () => {
  // Disable scrolling immediately
  disableScroll();

  // ✅ Wait for fonts to be ready
  if ("fonts" in document && document.fonts?.ready) {
    try {
      await document.fonts.ready; // resolves when all in-use fonts are loaded
    } catch (_) {}
  } else {
    // Fallback for older browsers
    await new Promise((r) =>
      window.addEventListener("load", r, { once: true })
    );
  }

  // Now it’s safe to split text
  setupTextSplit();

  // The rest of your init exactly as before
  createCounterDigits();

  animateCounter(document.querySelector(".counter-3"), 2.5);
  animateCounter(document.querySelector(".counter-2"), 3);
  animateCounter(document.querySelector(".counter-1"), 2, 1.5);

  const tl = gsap.timeline();
  gsap.set(".img", { scale: 0 });

  tl.to(
    ".hero-bg",
    { scaleY: "100%", duration: 2.5, ease: "expo.inOut", delay: 0.25 },
    "a"
  );
  tl.to(
    ".img",
    { scale: 1, duration: 1.5, stagger: 0.125, delay: 1, ease: "power3.out" },
    "a"
  );

  tl.to(".counter", {
    opacity: 0,
    duration: 0.3,
    ease: "power3.out",
    delay: 0.3,
    onStart: () => {
      animateImages();
    },
  });

  tl.to(".sidebar .divider", {
    scaleY: "100%",
    duration: 1,
    ease: "power4.inOut",
    delay: 1.25,
  });

  tl.to(
    [
      "nav .divider",
      ".site-info .divider",
      ".site-info-copy .divider",
      ".footer-divider",
    ],
    { scaleX: "100%", duration: 1, stagger: 0.4, ease: "power3.inOut" },
    "s"
  );

  tl.to(".logo", { scale: 1, duration: 1, ease: "power4.inOut" }, "s");

  tl.to(
    [".logo-name a span", ".nav-items a span"],
    { y: "0%", duration: 1, stagger: 0.1, delay: 0.7, ease: "power4.out" },
    "s"
  );

  tl.to(
    [".header span", ".site-info span", ".hero-footer span"],
    {
      y: "0%",
      duration: 1,
      stagger: 0.1,
      delay: 1.2,
      ease: "power4.out",
      onComplete: () => {
        enableScroll();

        // notify other modules that loader is finished and DOM is stable
        document.dispatchEvent(
          new CustomEvent("loader:finished", { detail: { time: Date.now() } })
        );
      },
    },
    "s"
  );

  tl.to(
    ".image-1",
    { left: "10%", scaleX: 1.1, duration: 0.8, ease: "expo.out" },
    "f"
  );
  tl.to(
    ".image-2",
    { left: "42%", scaleX: 1.1, duration: 0.8, ease: "expo.out" },
    "f"
  );
});
