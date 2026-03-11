window.addEventListener('DOMContentLoaded', () => {
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('eva-canvas');

  // ── Scene & Camera ────────────────────────────────────────
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 3, 16);
  camera.lookAt(1, 3, 0);

  // ── Renderer ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ── Materials ─────────────────────────────────────────────
  const mPurple  = new THREE.MeshStandardMaterial({ color: 0x3D1B6E, roughness: 0.45, metalness: 0.55 });
  const mDPurple = new THREE.MeshStandardMaterial({ color: 0x160830, roughness: 0.60, metalness: 0.30 });
  const mGreen   = new THREE.MeshStandardMaterial({ color: 0x1A4A1A, roughness: 0.50, metalness: 0.45 });
  const mMGreen  = new THREE.MeshStandardMaterial({ color: 0x2A6A2A, roughness: 0.40, metalness: 0.50 });
  const mEye     = new THREE.MeshStandardMaterial({ color: 0xFFE000, emissive: new THREE.Color(0xFFE000), emissiveIntensity: 1.2, roughness: 0.10, metalness: 0.80 });
  const mHorn    = new THREE.MeshStandardMaterial({ color: 0xFFD600, emissive: new THREE.Color(0xFF8C00), emissiveIntensity: 0.4, roughness: 0.20, metalness: 0.70 });
  const mBlack   = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.90, metalness: 0.10 });
  const mATField = new THREE.MeshBasicMaterial({ color: 0xFFD600, transparent: true, opacity: 0.22, wireframe: true });

  // ── Geometry helpers ──────────────────────────────────────
  function B(w, h, d, m, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    return mesh;
  }
  function Cy(rT, rB, h, s, m, x, y, z) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rT, rB, h, s), m);
    mesh.position.set(x || 0, y || 0, z || 0);
    mesh.castShadow = true;
    return mesh;
  }

  // ── Eva-01 ────────────────────────────────────────────────
  const eva = new THREE.Group();

  // Head
  const headG = new THREE.Group();
  headG.add(
    B(1.5,  1.7,  1.3,  mPurple,   0,      0,     0),   // skull
    B(1.2,  1.0,  0.1,  mDPurple,  0,     -0.10,  0.67),// face plate
    B(1.3,  0.14, 0.2,  mGreen,    0,      0.28,  0.62),// brow ridge
    B(0.38, 0.20, 0.08, mEye,     -0.26,   0.08,  0.71),// left eye
    B(0.38, 0.20, 0.08, mEye,      0.26,   0.08,  0.71),// right eye
    B(0.18, 1.2,  1.1,  mGreen,   -0.83,   0,     0),   // left side
    B(0.18, 1.2,  1.1,  mGreen,    0.83,   0,     0),   // right side
    B(0.22, 0.8,  0.18, mHorn,     0,      1.05,  0.1), // horn body
    Cy(0,   0.11, 0.45, 4, mHorn,  0,      1.67,  0.1), // horn tip
    B(1.1,  0.28, 0.85, mBlack,    0,     -0.95,  0)    // chin
  );
  headG.position.set(0, 5.2, 0);
  eva.add(headG);

  // Neck
  eva.add(Cy(0.32, 0.38, 0.55, 8, mDPurple, 0, 4.68, 0));

  // Torso
  const torsoG = new THREE.Group();
  torsoG.add(
    B(2.5,  2.3,  1.5,  mGreen,    0,     0,     0),   // body
    B(1.05, 1.3,  0.22, mPurple,  -0.50,  0.3,   0.84),// chest L
    B(1.05, 1.3,  0.22, mPurple,   0.50,  0.3,   0.84),// chest R
    B(0.12, 1.5,  0.28, mDPurple,  0,     0.2,   0.82),// center line
    B(1.9,  0.18, 0.18, mMGreen,   0,    -0.28,  0.84),// rib 1
    B(1.9,  0.18, 0.18, mMGreen,   0,    -0.60,  0.84),// rib 2
    B(1.9,  0.18, 0.18, mMGreen,   0,    -0.92,  0.84),// rib 3
    B(1.9,  0.18, 0.18, mMGreen,   0,    -1.24,  0.84) // rib 4
  );
  torsoG.position.set(0, 3.1, 0);
  eva.add(torsoG);

  // Left Pauldron — larger, Eva-01 signature
  const lPaul = new THREE.Group();
  lPaul.add(
    B(1.35, 2.0,  1.1,  mPurple,   0,     0,    0),
    B(1.0,  0.22, 0.9,  mGreen,    0,     1.0,  0),
    B(0.18, 1.8,  0.9,  mDPurple,  0.62,  0,    0),
    B(0.08, 1.6,  0.12, mMGreen,  -0.50,  0,    0.58)
  );
  lPaul.position.set(-2.2, 4.3, 0);
  eva.add(lPaul);

  // Right Pauldron
  const rPaul = new THREE.Group();
  rPaul.add(
    B(1.2,  1.8,  1.0,  mPurple,   0,     0,    0),
    B(0.9,  0.22, 0.85, mGreen,    0,     0.9,  0),
    B(0.18, 1.6,  0.85, mDPurple, -0.58,  0,    0),
    B(0.08, 1.4,  0.12, mMGreen,   0.45,  0,    0.55)
  );
  rPaul.position.set(2.2, 4.1, 0);
  eva.add(rPaul);

  // Left Arm
  const lArm = new THREE.Group();
  lArm.add(
    Cy(0.38, 0.42, 1.3, 8, mPurple,  0,  0,     0),
    B(0.78,  1.1,  0.78,   mGreen,   0, -1.25,  0),
    B(0.65,  0.2,  0.85,   mPurple,  0, -0.85,  0.04),
    B(0.65,  0.5,  0.55,   mDPurple, 0, -1.90,  0.06)
  );
  lArm.position.set(-1.85, 3.35, 0);
  eva.add(lArm);

  // Right Arm
  const rArm = new THREE.Group();
  rArm.add(
    Cy(0.38, 0.42, 1.3, 8, mPurple,  0,  0,     0),
    B(0.78,  1.1,  0.78,   mGreen,   0, -1.25,  0),
    B(0.65,  0.2,  0.85,   mPurple,  0, -0.85,  0.04),
    B(0.65,  0.5,  0.55,   mDPurple, 0, -1.90,  0.06)
  );
  rArm.position.set(1.85, 3.35, 0);
  eva.add(rArm);

  // Waist
  eva.add(
    B(2.1,  0.65, 1.25, mDPurple,  0,    1.88, 0),
    B(0.45, 0.8,  0.7,  mPurple,  -1.1,  1.70, 0),
    B(0.45, 0.8,  0.7,  mPurple,   1.1,  1.70, 0)
  );

  // Left Leg
  const lLeg = new THREE.Group();
  lLeg.add(
    B(1.0,  1.5,  1.0,  mPurple,   0,  0,    0),
    B(0.88, 1.5,  1.05, mGreen,    0, -1.70, 0.08),
    B(0.7,  0.35, 0.55, mPurple,   0, -0.92, 0.55),
    B(0.92, 0.32, 1.45, mDPurple,  0, -2.60, 0.22)
  );
  lLeg.position.set(-0.72, 0.75, 0);
  eva.add(lLeg);

  // Right Leg
  const rLeg = new THREE.Group();
  rLeg.add(
    B(1.0,  1.5,  1.0,  mPurple,   0,  0,    0),
    B(0.88, 1.5,  1.05, mGreen,    0, -1.70, 0.08),
    B(0.7,  0.35, 0.55, mPurple,   0, -0.92, 0.55),
    B(0.92, 0.32, 1.45, mDPurple,  0, -2.60, 0.22)
  );
  rLeg.position.set(0.72, 0.75, 0);
  eva.add(rLeg);

  eva.position.set(3.5, 0.5, 0);
  scene.add(eva);

  // ── AT Field (rotating wireframe torus) ───────────────────
  const atField = new THREE.Mesh(
    new THREE.TorusGeometry(4.5, 0.06, 8, 64),
    mATField
  );
  atField.position.set(3.5, 2.0, -0.5);
  atField.rotation.x = Math.PI * 0.08;
  scene.add(atField);

  // ── Ground glow disc ──────────────────────────────────────
  const groundDisc = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 48),
    new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
  );
  groundDisc.rotation.x = -Math.PI / 2;
  groundDisc.position.set(3.5, -1.4, 0);
  scene.add(groundDisc);

  // ── Lighting ──────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x1a083a, 0.9));

  const keyLight = new THREE.DirectionalLight(0x9370DB, 1.5);
  keyLight.position.set(-8, 12, 8);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x4CAF50, 2.2, 25);
  fillLight.position.set(9, 4, 5);
  scene.add(fillLight);

  const eyeLight = new THREE.PointLight(0xFFD600, 3.5, 8);
  eyeLight.position.set(3.5, 6.5, 3.5);
  scene.add(eyeLight);

  const rimLight = new THREE.PointLight(0x00E5FF, 1.2, 20);
  rimLight.position.set(3.5, -1.0, 4.5);
  scene.add(rimLight);

  // ── Particles ─────────────────────────────────────────────
  const N    = 300;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(N * 3);
  const pVel = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 36;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    pVel[i]         = 0.003 + Math.random() * 0.005;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ color: 0x64ffda, size: 0.065, transparent: true, opacity: 0.75 })
  );
  scene.add(particles);

  // ── Mouse tracking ────────────────────────────────────────
  const mouse = { nx: 0, ny: 0 };   // normalised -1..1
  const headTarget = { x: 0, y: 0 };// smoothed target rotations
  window.addEventListener('mousemove', e => {
    mouse.nx =  (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.ny = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation loop ────────────────────────────────────────
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    // Eva idle float & sway
    eva.rotation.y  = Math.sin(t * 0.25) * 0.12 - 0.08;
    eva.position.y  = 0.5 + Math.sin(t * 0.5) * 0.1;

    // Arm sway
    lArm.rotation.z =  0.08 + Math.sin(t * 0.4) * 0.04;
    rArm.rotation.z = -0.08 - Math.sin(t * 0.4) * 0.04;

    // Head follows mouse — clamp range, lerp for smoothness
    headTarget.y += (mouse.nx *  0.45 - headTarget.y) * 0.06;
    headTarget.x += (mouse.ny * -0.25 - headTarget.x) * 0.06;
    headG.rotation.y = headTarget.y;
    headG.rotation.x = headTarget.x;

    // Eye glow pulse
    mEye.emissiveIntensity = 0.9 + Math.sin(t * 2.5) * 0.4;
    eyeLight.intensity     = 3.0 + Math.sin(t * 2.5) * 1.2;

    // AT Field spin & fade
    atField.rotation.z    += 0.003;
    mATField.opacity       = 0.18 + Math.sin(t * 1.5) * 0.08;

    // Particle drift upward
    const pp = pGeo.attributes.position.array;
    for (let i = 0; i < N; i++) {
      pp[i * 3 + 1] += pVel[i];
      if (pp[i * 3 + 1] > 13) pp[i * 3 + 1] = -13;
    }
    pGeo.attributes.position.needsUpdate = true;

    // HUD sync rate fluctuation
    const syncEl = document.getElementById('sync-rate');
    if (syncEl) syncEl.textContent = (87 + Math.sin(t * 0.7) * 2.4).toFixed(1);

    renderer.render(scene, camera);
  }

  // ── Resize ────────────────────────────────────────────────
  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', resize);
  resize();
  animate();
});
