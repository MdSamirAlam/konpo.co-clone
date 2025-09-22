import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

document.querySelectorAll(".hover-line").forEach((el) => {
  // Ensure the link is a proper positioning context
  el.style.position = "relative";
  el.style.display = "inline-block"; // important

  // Create underline
  const underline = document.createElement("span");
  underline.style.position = "absolute";
  underline.style.left = 0;
  underline.style.bottom = 0;
  underline.style.height = "1px";
  underline.style.backgroundColor = "currentColor";
  underline.style.width = "100%"; // <-- set full width
  underline.style.pointerEvents = "none";
  underline.style.transformOrigin = "left center";
  underline.style.transform = "scaleX(0)"; // animate scale instead of width
  underline.style.willChange = "transform"; // smoother
  el.appendChild(underline);

  // Hover in: grow left → right
  el.addEventListener("mouseenter", () => {
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.4,
      ease: "power2.out",
      transformOrigin: "left center",
    });
  });

  // Hover out: shrink left → right (disappear towards the right)
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

    // Get clean text (strip line breaks/tabs)
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
        // markers: true,
      },
    });
  });
}

splitAndAnimateText(".split-text");

// Select all headings
const headings = document.querySelectorAll(".hover-heading");

headings.forEach((heading) => {
  // Split text of each heading separately
  const line1 = new SplitType(heading.querySelector(".line1"), {
    types: "chars",
  });
  const line2 = new SplitType(heading.querySelector(".line2"), {
    types: "chars",
  });

  // Initial state
  gsap.set(line2.chars, { y: "100%", opacity: 0 });

  // Mouse enter
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

  // Mouse leave
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
    // Start fully hidden from bottom
    gsap.set(image, { clipPath: "inset(0 0 100% 0)" });

    // Animate upwards (top to bottom reveal)
    gsap.to(image, {
      clipPath: "inset(0 0 0% 0)", // fully visible
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
  const magneticDiv = magnetElm.querySelector("div"); // Get the div inside this specific element

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

    // Store initial CSS offset
    const initialX = textContainer.offsetLeft;
    const initialY = textContainer.offsetTop;

    // Define how far the text can move from its initial position
    const maxOffset = 200; // px (adjust as needed)

    dottedBg.addEventListener("mousemove", (e) => {
      const rect = dottedBg.getBoundingClientRect();
      const textRect = textContainer.getBoundingClientRect();

      let x = e.clientX - rect.left - textRect.width / 2;

      // Clamp movement so it stays within [-maxOffset, +maxOffset]
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

// -------------------------
// Para Hover (updated)
// -------------------------
let paraHoverInitialized = false;

function paraScaleWhileHover() {
  if (paraHoverInitialized) return;
  paraHoverInitialized = true;

  const container = document.querySelector(".text-container");
  if (!container) return;

  const paragraphs = container.querySelectorAll(".para");
  if (!paragraphs.length) return;

  // Normalize whitespace and wrap letters (guard to avoid double-wrapping)
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

  // Settings
  const maxScale = 1.45; // adjust to taste
  const minScale = 1.0;
  const radius = 40; // px influence radius
  let mouse = { x: -9999, y: -9999 };
  let running = false;
  let mouseInside = false;

  // rAF loop — only updates transform (scale)
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
        const intensity = 1 - dist / radius; // 0..1
        const scale = minScale + intensity * (maxScale - minScale);
        // use 3D transform to force GPU/compositor rendering — reduces blurriness
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

  // Update mouse coords and start rAF if needed
  container.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (!running) {
      mouseInside = true;
      requestAnimationFrame(tick);
    }
  });

  // Smooth reset on leave using GSAP — only animates scale (no color)
  container.addEventListener("mouseleave", () => {
    mouseInside = false;

    // animate back to scale 1 — no color or shadow changes
    gsap.to(letters, {
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
      stagger: {
        each: 0.004,
        from: "center",
      },
      // GSAP will apply the scale via transform; ensure no leftover inline transform conflicts
      onComplete: () => {
        letters.forEach((l) => (l.style.transform = "")); // optional cleanup
      },
    });
  });
}

// Initialize only after loader signals it's done (keeps modules decoupled)
document.addEventListener("loader:finished", () => {
  // microtask to ensure any final DOM writes are flushed
  setTimeout(() => {
    paraScaleWhileHover();
  }, 0);
});

// Fallback: in case loader never fires the event, init on window load (after fonts/images)
window.addEventListener("load", () => {
  // small delay so loader might still finish if it's running late
  setTimeout(() => {
    paraScaleWhileHover();
  }, 150);
});

// Note: removed the immediate paraScaleWhileHover() call to avoid timing conflicts

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
