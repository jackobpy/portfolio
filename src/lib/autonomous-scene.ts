import * as THREE from "three";
export function mountScene(host: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0xfafbf9, 1);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xfafbf9);
  const camera = new THREE.OrthographicCamera(-9, 9, 6, -6, 0.1, 100);
  camera.position.set(11, 12, 14);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x83968a, 2.8));
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(4, 10, 6);
  scene.add(sun);
  const material = (color: number) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 });
  const gray = material(0xc4cec7),
    dark = material(0x33443d),
    white = material(0xe3e8e2),
    accent = material(0x176b61);
  const box = (
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    return mesh;
  };
  const grid = new THREE.GridHelper(26, 26, 0xdce3dd, 0xe5eae5);
  grid.position.y = -0.07;
  scene.add(grid);
  scene.add(box(5.5, 0.06, 30, material(0xe9ede7), 0, -0.02, 0));
  for (const x of [-2.55, 2.55]) {
    const points = [
      new THREE.Vector3(x, 0.03, -15),
      new THREE.Vector3(x, 0.03, 15),
    ];
    scene.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0xb9c6bc }),
      ),
    );
  }
  const dashes = new THREE.Group();
  for (let z = -18; z < 18; z += 2.2)
    dashes.add(box(0.045, 0.01, 0.95, white, 0, 0.05, z));
  scene.add(dashes);
  const car = new THREE.Group();
  car.position.set(1.25, 0.08, 1.3);
  car.add(box(1.25, 0.43, 2.5, gray, 0, 0.48, 0));
  car.add(box(1.04, 0.43, 1.25, dark, 0, 0.88, 0.04));
  car.add(box(1.05, 0.07, 1.27, white, 0, 1.13, 0.04));
  car.add(box(1.18, 0.12, 0.48, white, 0, 0.72, -0.93));
  car.add(box(1.18, 0.12, 0.37, white, 0, 0.72, 1.03));
  for (const x of [-0.63, 0.63])
    for (const z of [-0.78, 0.8]) {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.27, 0.16, 12),
        dark,
      );
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, 0.28, z);
      car.add(wheel);
    }
  const sensor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.17, 0.12, 12),
    accent,
  );
  sensor.position.set(0, 1.22, 0.04);
  car.add(sensor);
  for (const x of [-0.42, 0.42])
    car.add(box(0.25, 0.08, 0.03, material(0xe5eee0), x, 0.61, -1.27));
  scene.add(car);
  const route = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.25, 0.07, 2),
    new THREE.Vector3(1.25, 0.07, -2),
    new THREE.Vector3(0.8, 0.07, -5),
    new THREE.Vector3(-1.25, 0.07, -8),
    new THREE.Vector3(-1.25, 0.07, -14),
  ]);
  scene.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(route.getPoints(80)),
      new THREE.LineBasicMaterial({ color: 0x176b61 }),
    ),
  );
  for (let t = 0.2; t < 1; t += 0.16) {
    const p = route.getPoint(t);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), accent);
    dot.position.copy(p);
    scene.add(dot);
  }
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(2.2, 2.215, 70),
    new THREE.MeshBasicMaterial({
      color: 0x176b61,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
    }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(1.25, 0.065, 1.3);
  scene.add(ring);
  const points = new THREE.BufferGeometry();
  const coords = [];
  for (let i = 0; i < 65; i++) {
    const a = i * 2.399;
    const r = 2.7 + (i % 8) * 0.24;
    coords.push(
      1.25 + Math.cos(a) * r,
      0.1 + (i % 5) * 0.12,
      1.3 + Math.sin(a) * r,
    );
  }
  points.setAttribute("position", new THREE.Float32BufferAttribute(coords, 3));
  scene.add(
    new THREE.Points(
      points,
      new THREE.PointsMaterial({ color: 0x6a9884, size: 0.04 }),
    ),
  );
  // Sparse roadside blocks are context, not imported models.
  for (const [x, z, w, h, d] of [
    [-4, -6, 1, 1.7, 1.8],
    [4, -7, 1.4, 0.75, 1.3],
    [-4, 5, 1.2, 0.5, 2.4],
  ])
    scene.add(box(w, h, d, material(0xe0e5dd), x, h / 2, z));
  let frame = 0,
    visible = true,
    paused = false,
    disposed = false;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const toggle = document.getElementById(
    "scene-toggle",
  ) as HTMLButtonElement | null;
  const render = () => renderer.render(scene, camera);
  const animate = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden || paused || motion.matches)
      return;
    dashes.position.z = (time * 0.00022) % 2.2;
    car.position.y = 0.08 + Math.sin(time * 0.0006) * 0.013;
    render();
    frame = requestAnimationFrame(animate);
  };
  const sync = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    render();
    if (visible && !document.hidden && !paused && !motion.matches)
      frame = requestAnimationFrame(animate);
    if (toggle) toggle.hidden = motion.matches;
  };
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h);
    camera.left = (-6.4 * w) / h;
    camera.right = (6.4 * w) / h;
    camera.top = 6.4;
    camera.bottom = -6.4;
    camera.updateProjectionMatrix();
    render();
  };
  const onToggle = () => {
    paused = !paused;
    if (toggle) {
      toggle.textContent = paused ? "Resume motion" : "Pause motion";
      toggle.setAttribute("aria-pressed", String(paused));
    }
    sync();
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(host);
  const resizer = new ResizeObserver(resize);
  resizer.observe(host);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  toggle?.addEventListener("click", onToggle);
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizer.disconnect();
    motion.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
    toggle?.removeEventListener("click", onToggle);
    scene.traverse((obj) => {
      if (
        obj instanceof THREE.Mesh ||
        obj instanceof THREE.Line ||
        obj instanceof THREE.Points
      ) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material)
          ? obj.material
          : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
  renderer.domElement.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      cleanup();
      if (toggle) toggle.hidden = true;
    },
    { once: true },
  );
  window.addEventListener("pagehide", cleanup, { once: true });
  resize();
  sync();
}
