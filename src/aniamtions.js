import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

document.querySelectorAll(".hover-line").forEach((el) => {
  el.style.position = "relative";
  el.style.display = "inline-block";

  const underline = document.createElement("span");
  underline.style.position = "absolute";
  underline.style.left = 0;
  underline.style.bottom = 0;
  underline.style.height = "1px";
  underline.style.backgroundColor = "currentColor";
  underline.style.width = "100%";
  underline.style.pointerEvents = "none";
  underline.style.transformOrigin = "left center";
  underline.style.transform = "scaleX(0)";
  underline.style.willChange = "transform";
  el.appendChild(underline);

  el.addEventListener("mouseenter", () => {
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
      transformOrigin: "left center",
    });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(underline, {
      scaleX: 0,
      duration: 0.4,
      ease: "power2.in",
      transformOrigin: "right center",
    });
  });
});

gsap.registerPlugin(ScrollTrigger);

function splitAndAnimateText(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    if (el.dataset.split === "1") return;
    el.dataset.split = "1";

    el.style.display = "block";
    el.style.whiteSpace = "normal";

    const text = el.textContent.replace(/\s+/g, " ").trim();
    el.textContent = "";

    const frag = document.createDocumentFragment();

    for (const ch of text) {
      const wrapper = document.createElement("span");
      wrapper.style.display = "inline-block";
      wrapper.style.overflow = "hidden";
      wrapper.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.textContent = ch === " " ? "\u00A0" : ch;

      wrapper.appendChild(inner);
      frag.appendChild(wrapper);
    }

    el.appendChild(frag);

    const targets = el.querySelectorAll("span > span");

    gsap.from(targets, {
      yPercent: 80,
      duration: 0.6,
      ease: "power4.out",
      stagger: 0.015,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none none",
      },
    });
  });
}

splitAndAnimateText(".split-text");

const headings = document.querySelectorAll(".hover-heading");

headings.forEach((heading) => {
  const line1 = new SplitType(heading.querySelector(".line1"), {
    types: "chars",
  });
  const line2 = new SplitType(heading.querySelector(".line2"), {
    types: "chars",
  });

  gsap.set(line2.chars, { y: "100%", opacity: 0 });

  heading.addEventListener("mouseenter", () => {
    gsap.to(line1.chars, {
      y: "-100%",
      stagger: 0.03,
      duration: 0.4,
      ease: "power4.out",
    });
    gsap.to(line2.chars, {
      y: "0%",
      opacity: 1,
      stagger: 0.03,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  heading.addEventListener("mouseleave", () => {
    gsap.to(line1.chars, {
      y: "0%",
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut",
    });
    gsap.to(line2.chars, {
      y: "100%",
      opacity: 0,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut",
    });
  });
});

function yImageScale() {
  const images = document.querySelectorAll(".service-img");

  images.forEach((image) => {
    gsap.set(image, { clipPath: "inset(0 0 100% 0)" });

    gsap.to(image, {
      clipPath: "inset(0 0 0% 0)",
      duration: 0.8,
      ease: "expo.inOut",
      scrollTrigger: {
        trigger: image,
        start: "top 80%",
      },
    });
  });
}
yImageScale();

document.querySelectorAll(".tagline span").forEach((elm) => {
  gsap.from(elm, {
    y: 40,
    duration: 0.8,
    ease: "power4.out",
    scrollTrigger: {
      trigger: elm,
      start: "top 75%",
    },
  });
});

const magneticElements = document.querySelectorAll(".magnetic-hover");

magneticElements.forEach((magnetElm) => {
  const magneticDiv = magnetElm.querySelector("div");

  magnetElm.addEventListener("mousemove", (e) => {
    const rect = magnetElm.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(magneticDiv, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  magnetElm.addEventListener("mouseleave", () => {
    gsap.to(magneticDiv, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  });
});

function dottedBgMouseFollower() {
  const dottedBgs = document.querySelectorAll(".dotted-bg");

  dottedBgs.forEach((dottedBg) => {
    const textContainer = dottedBg.querySelector(".text-of-dotted-bg");
    if (!textContainer) return;

    const initialX = textContainer.offsetLeft;
    const initialY = textContainer.offsetTop;

    const maxOffset = 200;

    dottedBg.addEventListener("mousemove", (e) => {
      const rect = dottedBg.getBoundingClientRect();
      const textRect = textContainer.getBoundingClientRect();

      let x = e.clientX - rect.left - textRect.width / 2;

      const relativeX = Math.max(-maxOffset, Math.min(maxOffset, x - initialX));

      gsap.to(textContainer, {
        x: relativeX,
        duration: 1.2,
        ease: "power1.out",
      });
    });

    dottedBg.addEventListener("mouseleave", () => {
      gsap.killTweensOf(textContainer);

      gsap.to(textContainer, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  });
}
dottedBgMouseFollower();

let paraHoverInitialized = false;

function paraScaleWhileHover() {
  if (paraHoverInitialized) return;
  paraHoverInitialized = true;

  const container = document.querySelector(".text-container");
  if (!container) return;

  const paragraphs = container.querySelectorAll(".para");
  if (!paragraphs.length) return;

  paragraphs.forEach((p) => {
    if (p.dataset.paraSplit === "1") return;
    p.dataset.paraSplit = "1";

    const normalized = p.textContent.replace(/\s+/g, " ").trim();
    const words = normalized.split(" ");
    p.innerHTML = words
      .map(
        (word) =>
          `<span class="word">${[...word]
            .map((char) => `<span class="letter">${char}</span>`)
            .join("")}</span>`
      )
      .join(" ");
  });

  const letters = Array.from(container.querySelectorAll(".letter"));
  if (!letters.length) return;

  const maxScale = 1.45;
  const minScale = 1.0;
  const radius = 40;
  let mouse = { x: -9999, y: -9999 };
  let running = false;
  let mouseInside = false;

  function tick() {
    running = true;

    for (let i = 0; i < letters.length; i++) {
      const letter = letters[i];
      const rect = letter.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && mouseInside) {
        const intensity = 1 - dist / radius;
        const scale = minScale + intensity * (maxScale - minScale);
        letter.style.transform = `translateZ(0) scale3d(${scale}, ${scale}, 1)`;
      } else {
        letter.style.transform = "scale(1)";
      }
    }

    if (mouseInside) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  }

  container.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!running) {
      mouseInside = true;
      requestAnimationFrame(tick);
    }
  });

  container.addEventListener("mouseleave", () => {
    mouseInside = false;

    gsap.to(letters, {
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
      stagger: {
        each: 0.004,
        from: "center",
      },
      onComplete: () => {
        letters.forEach((l) => (l.style.transform = ""));
      },
    });
  });
}

document.addEventListener("loader:finished", () => {
  setTimeout(() => {
    paraScaleWhileHover();
  }, 0);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    paraScaleWhileHover();
  }, 150);
});

function workImageScale() {
  const images = document.querySelectorAll(".work-image");

  images.forEach((image) => {
    gsap.to(image, {
      transform: "scale(1)",
      duration: 0.8,
      ease: "power4.out",
      scrollTrigger: {
        trigger: image,
        start: "top 80%",
      },
    });
  });
}
workImageScale();
