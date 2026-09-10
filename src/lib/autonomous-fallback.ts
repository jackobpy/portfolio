/** Lightweight top-down simulation for browsers without WebGL. */
export function mountFallback(host: HTMLElement) {
  host.classList.add("fallback-active");
  const svg = host.querySelector("svg")!;
  const route = svg.querySelector<SVGPathElement>("[data-route]")!;
  const car = svg.querySelector<SVGGElement>("[data-car]")!;
  const length = route.getTotalLength();
  const toggle = document.getElementById("scene-toggle")! as HTMLButtonElement;
  const status = document.getElementById("scene-status")!;
  const mode = document.getElementById("scene-mode")!;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let progress = 0.35,
    frame = 0,
    last = 0,
    paused = motion.matches;
  const text = (id: string, value: string) => {
    document.getElementById(id)!.textContent = value;
  };
  const draw = () => {
    const at = progress * length;
    const p = route.getPointAtLength(at);
    const next = route.getPointAtLength(Math.min(length, at + 2));
    const previous = route.getPointAtLength(Math.max(0, at - 2));
    const angle = Math.atan2(next.y - previous.y, next.x - previous.x);
    car.setAttribute(
      "transform",
      `translate(${p.x} ${p.y}) rotate(${(angle * 180) / Math.PI})`,
    );
    text("scene-sensor-left", "1.35 m");
    text("scene-sensor-right", "1.35 m");
    text("scene-speed", "2.6 m/s");
    const beforeAngle = Math.atan2(p.y - previous.y, p.x - previous.x);
    text(
      "scene-steering",
      `${((((angle - beforeAngle) * 180) / Math.PI) * 8).toFixed(1)}°`,
    );
  };
  const animate = (time: number) => {
    if (last)
      progress = (progress + Math.min((time - last) / 1000, 0.05) * 0.035) % 1;
    last = time;
    draw();
    frame = requestAnimationFrame(animate);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    last = 0;
    toggle.hidden = false;
    toggle.textContent = paused ? "Resume motion" : "Pause motion";
    toggle.setAttribute("aria-pressed", String(paused));
    status.textContent = paused
      ? "2D simulation paused"
      : "2D lane-following simulation";
    mode.textContent = paused ? "PAUSED" : "SIM";
    if (!paused && !document.hidden) frame = requestAnimationFrame(animate);
  };
  const onToggle = () => {
    paused = !paused;
    sync();
  };
  const onMotion = () => {
    paused = motion.matches;
    sync();
  };
  toggle.addEventListener("click", onToggle);
  motion.addEventListener("change", onMotion);
  document.addEventListener("visibilitychange", sync);
  for (const id of ["scene-sensor-left-bar", "scene-sensor-right-bar"]) {
    document.getElementById(id)!.style.transform = "scaleX(0.5)";
  }
  draw();
  sync();
  const cleanup = () => {
    host.classList.remove("fallback-active");
    cancelAnimationFrame(frame);
    toggle.removeEventListener("click", onToggle);
    motion.removeEventListener("change", onMotion);
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("pagehide", cleanup);
  };
  window.addEventListener("pagehide", cleanup);
  return cleanup;
}
