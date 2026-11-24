const particleCanvas = document.querySelector(".particle-background");
const particleContext = particleCanvas?.getContext("2d");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let particles = [];
let animationFrame = 0;
let canvasWidth = 0;
let canvasHeight = 0;

function drawParticles(animate) {
  if (!particleContext) return;

  particleContext.clearRect(0, 0, canvasWidth, canvasHeight);
  const connectionDistance = Math.min(175, Math.max(115, canvasWidth * 0.14));

  for (let index = 0; index < particles.length; index += 1) {
    const particle = particles[index];

    if (animate) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x <= 0 || particle.x >= canvasWidth) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= canvasHeight) particle.vy *= -1;
      particle.x = Math.max(0, Math.min(canvasWidth, particle.x));
      particle.y = Math.max(0, Math.min(canvasHeight, particle.y));
    }

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const distance = Math.hypot(particle.x - next.x, particle.y - next.y);
      if (distance > connectionDistance) continue;

      particleContext.beginPath();
      particleContext.moveTo(particle.x, particle.y);
      particleContext.lineTo(next.x, next.y);
      particleContext.strokeStyle = `rgba(157, 111, 255, ${(1 - distance / connectionDistance) * 0.21})`;
      particleContext.lineWidth = 0.7;
      particleContext.stroke();
    }

    particleContext.beginPath();
    particleContext.arc(particle.x, particle.y, 1.3, 0, Math.PI * 2);
    particleContext.fillStyle = "rgba(201, 155, 255, 0.62)";
    particleContext.fill();
  }

  if (animate && !document.hidden) {
    animationFrame = window.requestAnimationFrame(() => drawParticles(true));
  }
}

function resizeParticleCanvas() {
  if (!particleCanvas || !particleContext) return;

  window.cancelAnimationFrame(animationFrame);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  particleCanvas.width = Math.round(canvasWidth * pixelRatio);
  particleCanvas.height = Math.round(canvasHeight * pixelRatio);
  particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  let seed = 24591;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const count = Math.min(88, Math.max(28, Math.round((canvasWidth * canvasHeight) / 24000)));

  particles = Array.from({ length: count }, () => ({
    x: random() * canvasWidth,
    y: random() * canvasHeight,
    vx: (random() - 0.5) * 0.22,
    vy: (random() - 0.5) * 0.22,
  }));
  drawParticles(!prefersReducedMotion);
}

if (particleCanvas && particleContext) {
  window.addEventListener("resize", resizeParticleCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => {
    window.cancelAnimationFrame(animationFrame);
    if (!document.hidden) drawParticles(!prefersReducedMotion);
  });
  resizeParticleCanvas();
}

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");

function setMenuOpen(isOpen) {
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  navigation.classList.toggle("is-open", isOpen);
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
