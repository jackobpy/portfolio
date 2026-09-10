import * as THREE from "three";

/** Closed-loop lane following: the sensor geometry and controller use the same
 * centreline, which keeps the visual explanation honest and easy to tune. */
export function mountScene(host: HTMLElement, onContextLost?: () => void) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive autonomous vehicle scene. Click a traffic light to change its state.",
  );
  renderer.domElement.style.cursor = "pointer";
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-9, 9, 6, -6, 0.1, 100);
  camera.position.set(11, 12, 14);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x83968a, 2.8));
  const sun = new THREE.DirectionalLight(0xffffff, 3);
  sun.position.set(4, 10, 6);
  scene.add(sun);
  const mat = (color: number) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05 });
  const dark = mat(0x33443d),
    body = mat(0xc4cec7),
    white = mat(0xe3e8e2),
    accent = mat(0x176b61);
  const box = (
    w: number,
    h: number,
    d: number,
    material: THREE.Material,
    x = 0,
    y = 0,
    z = 0,
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    return mesh;
  };
  const car = new THREE.Group();
  car.position.set(0, 0.08, 1.3);
  car.add(
    box(1.25, 0.43, 2.5, body, 0, 0.48, 0),
    box(1.04, 0.43, 1.25, dark, 0, 0.88, 0.04),
    box(1.05, 0.07, 1.27, white, 0, 1.13, 0.04),
    box(1.18, 0.12, 0.48, white, 0, 0.72, -0.93),
    box(1.18, 0.12, 0.37, white, 0, 0.72, 1.03),
  );
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
  // A mint lidar/radar sweep rotates above the roof sensor.
  const radar = new THREE.Group();
  const radarRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.34, 0.018, 6, 24),
    new THREE.MeshBasicMaterial({
      color: 0x9cebc9,
      transparent: true,
      opacity: 0.9,
    }),
  );
  radarRing.rotation.x = Math.PI / 2;
  const radarSweep = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.95, 0, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: 0x9cebc9,
      transparent: true,
      opacity: 0.85,
    }),
  );
  radar.add(radarRing, radarSweep);
  radar.position.set(0, 1.34, 0.04);
  car.add(radar);
  scene.add(car);

  const roadGroup = new THREE.Group();
  scene.add(roadGroup);
  const grid = new THREE.GridHelper(26, 26, 0xdce3dd, 0xe5eae5);
  grid.position.y = -0.07;
  scene.add(grid);
  const laneCenter = (ahead: number, travel: number) =>
    1.62 * Math.sin((travel + ahead) * 0.2) +
    0.66 * Math.sin((travel + ahead) * 0.47) +
    0.22 * Math.sin((travel + ahead) * 0.82);
  const laneSlope = (ahead: number, travel: number) =>
    1.62 * 0.2 * Math.cos((travel + ahead) * 0.2) +
    0.66 * 0.47 * Math.cos((travel + ahead) * 0.47) +
    0.22 * 0.82 * Math.cos((travel + ahead) * 0.82);
  const lineObject = (color: number) => {
    const object = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color }),
    );
    roadGroup.add(object);
    return object;
  };
  const leftEdge = lineObject(0xb9c6bc),
    rightEdge = lineObject(0xb9c6bc),
    laneMark = lineObject(0xc5d0c8),
    planned = lineObject(0x176b61);
  const pointsOn = (offset: number, travel: number, count = 61) =>
    Array.from({ length: count }, (_, i) => {
      const ahead = (i / (count - 1)) * 30 - 12;
      return new THREE.Vector3(
        laneCenter(ahead, travel) + offset,
        0.04,
        car.position.z - ahead,
      );
    });
  const dashes = new THREE.Group();
  for (let z = -18; z < 18; z += 2.2)
    dashes.add(box(0.045, 0.01, 0.95, white, 0, 0.05, z));
  scene.add(dashes);
  const sensorBeams = new THREE.Group();
  scene.add(sensorBeams);
  const beam = (color: number) => {
    const object = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.72 }),
    );
    sensorBeams.add(object);
    return object;
  };
  const leftBeam = beam(0x6a9884),
    rightBeam = beam(0x6a9884),
    centreBeam = beam(0x176b61);
  const perception = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: 0x6a9884, size: 0.055 }),
  );
  scene.add(perception);
  const traffic = new THREE.Group();
  scene.add(traffic);
  const signals: {
    root: THREE.Group;
    red: THREE.Mesh;
    yellow: THREE.Mesh;
    green: THREE.Mesh;
    redGlow: THREE.PointLight;
    yellowGlow: THREE.PointLight;
    greenGlow: THREE.PointLight;
    manualState: "red" | "green" | null;
    yellowUntil: number;
    forcedRedUntil: number;
    at: number;
  }[] = [];
  for (const at of [18, 56]) {
    const root = new THREE.Group();
    root.add(
      box(0.08, 2.9, 0.08, dark),
      box(0.75, 1.55, 0.25, dark, 0, 1.55, 0),
    );
    const red = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x9b3d37 }),
    );
    // The camera is on the positive-Z side, so bulbs sit on the front of the
    // housing instead of being hidden behind the dark rectangle.
    red.position.set(0, 2.05, 0.18);
    const yellow = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x806f3d }),
    );
    yellow.position.set(0, 1.55, 0.18);
    const green = new THREE.Mesh(
      new THREE.SphereGeometry(0.19, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x42785d }),
    );
    green.position.set(0, 1.05, 0.18);
    const redGlow = new THREE.PointLight(0xff5548, 0, 3);
    const yellowGlow = new THREE.PointLight(0xf2bd52, 0, 3);
    const greenGlow = new THREE.PointLight(0x63d49a, 0, 3);
    redGlow.position.copy(red.position);
    yellowGlow.position.copy(yellow.position);
    greenGlow.position.copy(green.position);
    root.add(red, yellow, green, redGlow, yellowGlow, greenGlow);
    traffic.add(root);
    signals.push({
      root,
      red,
      yellow,
      green,
      redGlow,
      yellowGlow,
      greenGlow,
      manualState: null,
      yellowUntil: -1,
      forcedRedUntil: -1,
      at,
    });
  }

  let travel = 0,
    lateral = 0,
    lateralVelocity = 0,
    heading = 0,
    signalTime = 0,
    speed = 2.6,
    steeringAngle = 0,
    lastTime: number | undefined;
  let frame = 0,
    visible = true,
    paused = false,
    disposed = false;
  const cruiseSpeed = 2.6;
  const deceleration = 5;
  const stopLine = 2.55;
  const getSignalState = (signal: (typeof signals)[number]) => {
    if (signal.yellowUntil > signalTime) return "yellow" as const;
    if (signal.forcedRedUntil > signalTime) return "red" as const;
    if (signal.manualState) return signal.manualState;
    return (signalTime + signal.at * 0.08) % 16 < 5
      ? ("red" as const)
      : ("green" as const);
  };
  const distanceAhead = (at: number) => {
    let distance = at - travel;
    while (distance < -14) distance += 74;
    return distance;
  };
  const motion = matchMedia("(prefers-reduced-motion: reduce)"),
    toggle = document.getElementById(
      "scene-toggle",
    ) as HTMLButtonElement | null;
  const telemetry = {
    left: document.getElementById("scene-sensor-left"),
    right: document.getElementById("scene-sensor-right"),
    leftBar: document.getElementById("scene-sensor-left-bar"),
    rightBar: document.getElementById("scene-sensor-right-bar"),
    speed: document.getElementById("scene-speed"),
    steering: document.getElementById("scene-steering"),
  };
  const updateGeometry = () => {
    leftEdge.geometry.setFromPoints(pointsOn(-1.35, travel));
    rightEdge.geometry.setFromPoints(pointsOn(1.35, travel));
    laneMark.geometry.setFromPoints(pointsOn(0, travel));
    const plan = Array.from({ length: 31 }, (_, i) => {
      const ahead = i * 0.6;
      return new THREE.Vector3(
        laneCenter(ahead, travel),
        0.065,
        car.position.z - ahead,
      );
    });
    planned.geometry.setFromPoints(plan);
    dashes.position.x = laneCenter(0, travel);
    dashes.position.z = travel % 2.2;
    grid.position.z = travel % 1;
    car.position.x = lateral;
    car.rotation.y = heading;
    radar.rotation.y = travel * 2.8;
    const ahead = 1.35,
      centre = laneCenter(ahead, travel),
      left = centre - 1.35,
      right = centre + 1.35;
    const laneAtCar = laneCenter(0, travel);
    const leftSensor = THREE.MathUtils.clamp(
      lateral - (laneAtCar - 1.35),
      0,
      2.7,
    );
    const rightSensor = THREE.MathUtils.clamp(
      laneAtCar + 1.35 - lateral,
      0,
      2.7,
    );
    if (telemetry.left)
      telemetry.left.textContent = `${leftSensor.toFixed(2)} m`;
    if (telemetry.right)
      telemetry.right.textContent = `${rightSensor.toFixed(2)} m`;
    if (telemetry.leftBar)
      telemetry.leftBar.style.transform = `scaleX(${leftSensor / 2.7})`;
    if (telemetry.rightBar)
      telemetry.rightBar.style.transform = `scaleX(${rightSensor / 2.7})`;
    if (telemetry.speed)
      telemetry.speed.textContent = `${speed.toFixed(1)} m/s`;
    if (telemetry.steering)
      telemetry.steering.textContent = `${steeringAngle >= 0 ? "+" : ""}${steeringAngle.toFixed(1)}°`;
    leftBeam.geometry.setFromPoints([
      new THREE.Vector3(lateral, 0.12, car.position.z - 0.15),
      new THREE.Vector3(left, 0.05, car.position.z - ahead),
    ]);
    rightBeam.geometry.setFromPoints([
      new THREE.Vector3(lateral, 0.12, car.position.z - 0.15),
      new THREE.Vector3(right, 0.05, car.position.z - ahead),
    ]);
    centreBeam.geometry.setFromPoints([
      new THREE.Vector3(lateral, 0.13, car.position.z - 0.15),
      new THREE.Vector3(centre, 0.07, car.position.z - ahead),
    ]);
    const sensorPositions: number[] = [];
    for (let i = 0; i < 25; i++) {
      const sample = i * 0.32,
        c = laneCenter(sample, travel);
      sensorPositions.push(
        c - 1.35,
        0.09,
        car.position.z - sample,
        c + 1.35,
        0.09,
        car.position.z - sample,
      );
    }
    perception.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(sensorPositions, 3),
    );
    signals.forEach((signal) => {
      let signalAhead = signal.at - travel;
      while (signalAhead < -14) signalAhead += 74;
      const state = getSignalState(signal);
      signal.root.position.set(
        laneCenter(signalAhead, travel) + 1.7,
        0,
        car.position.z - signalAhead,
      );
      (signal.red.material as THREE.MeshBasicMaterial).color.set(
        state === "red" ? 0xff5548 : 0x263c34,
      );
      (signal.yellow.material as THREE.MeshBasicMaterial).color.set(
        state === "yellow" ? 0xf2bd52 : 0x4a4430,
      );
      (signal.green.material as THREE.MeshBasicMaterial).color.set(
        state === "green" ? 0x63d49a : 0x263c34,
      );
      signal.redGlow.intensity = state === "red" ? 2.2 : 0;
      signal.yellowGlow.intensity = state === "yellow" ? 2.2 : 0;
      signal.greenGlow.intensity = state === "green" ? 2.2 : 0;
    });
  };
  const render = () => renderer.render(scene, camera);
  const animate = (time: number) => {
    frame = 0;
    if (disposed || !visible || document.hidden || paused || motion.matches)
      return;
    const dt =
      lastTime === undefined ? 0 : Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;
    signalTime += dt;
    const ahead = 1.35,
      target = laneCenter(ahead, travel),
      targetHeading = Math.atan(-laneSlope(ahead, travel));
    const lateralError = target - lateral;
    const headingError = Math.atan2(
      Math.sin(targetHeading - heading),
      Math.cos(targetHeading - heading),
    );
    const steer = THREE.MathUtils.clamp(
      1.35 * lateralError + 0.9 * headingError,
      -0.7,
      0.7,
    );
    steeringAngle = steer * 32;
    lateralVelocity += (steer - lateralVelocity) * Math.min(1, dt * 5);
    lateral += lateralVelocity * dt * 1.7;
    heading += (targetHeading - heading) * Math.min(1, dt * 4);
    const blockingSignal = signals.find((signal) => {
      const d = distanceAhead(signal.at);
      const state = getSignalState(signal);
      const stoppingDistance = (speed * speed) / (2 * deceleration) + 0.35;
      const canStop = d - stopLine > stoppingDistance;
      const mustStop = state === "red" || (state === "yellow" && canStop);
      return d > 0 && d < 13 && mustStop;
    });
    if (blockingSignal) {
      const d = distanceAhead(blockingSignal.at);
      const distanceToStop = Math.max(0, d - stopLine);
      const brakingDistance = (speed * speed) / (2 * deceleration) + 0.35;
      if (distanceToStop > brakingDistance) {
        speed = Math.min(cruiseSpeed, speed + 3 * dt);
        travel += speed * dt;
      } else {
        speed = Math.max(0, speed - deceleration * dt);
        travel += Math.min(speed * dt, distanceToStop);
      }
      if (distanceToStop <= 0.001) speed = 0;
    } else {
      speed = Math.min(cruiseSpeed, speed + 3 * dt);
      travel += speed * dt;
    }
    updateGeometry();
    render();
    frame = requestAnimationFrame(animate);
  };
  const sync = () => {
    if (disposed) return;
    lastTime = undefined;
    cancelAnimationFrame(frame);
    frame = 0;
    updateGeometry();
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
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const onSignalClick = (event: PointerEvent) => {
    const bounds = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(traffic.children, true)[0];
    if (!hit) return;
    let owner: THREE.Object3D | null = hit.object;
    while (owner && owner.parent !== traffic) owner = owner.parent;
    const signal = signals.find((candidate) => candidate.root === owner);
    if (!signal) return;
    const state = getSignalState(signal);
    if (state === "green") {
      // A manual green-to-yellow transition gives the car three seconds to
      // clear the junction. Repeated clicks extend both yellow and red.
      signal.yellowUntil = signalTime + 3;
      signal.forcedRedUntil = signalTime + 7;
      signal.manualState = null;
    } else if (state === "yellow") {
      signal.yellowUntil += 3;
      signal.forcedRedUntil += 3;
    } else {
      signal.manualState = "green";
      signal.yellowUntil = -1;
      signal.forcedRedUntil = -1;
    }
    updateGeometry();
    render();
  };
  renderer.domElement.addEventListener("pointerdown", onSignalClick);
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
    renderer.domElement.removeEventListener("pointerdown", onSignalClick);
    scene.traverse((object) => {
      if (
        object instanceof THREE.Mesh ||
        object instanceof THREE.Line ||
        object instanceof THREE.Points
      ) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materials.forEach((material) => material.dispose());
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
      onContextLost?.();
    },
    { once: true },
  );
  window.addEventListener("pagehide", cleanup, { once: true });
  resize();
  sync();
}
