import * as THREE from 'three';

// --- Scene Setup --- //
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x030305, 0.02); // Dark fog for depth

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: false // Disable antialias for performance
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap at 1.5x for performance

// --- "The Architect's Void" Objects --- //

// 1. Moving Grid Floor (Optimized)
const gridHelper = new THREE.GridHelper(200, 40, 0x00f3ff, 0x111111); // Fewer divisions
gridHelper.position.y = -10;
scene.add(gridHelper);

// 2. Central Complex Shape (Optimized Torus)
const torusGeometry = new THREE.TorusKnotGeometry(4, 1.0, 100, 16); // Lower poly count (100, 16 vs 128, 32)
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x00f3ff,
  wireframe: true,
  transparent: true,
  opacity: 0.1
});
const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torusKnot);

// 3. Inner Glowing Core (Optimized)
const coreGeometry = new THREE.IcosahedronGeometry(2, 1); // Lower detail (1 vs 2)
const coreMaterial = new THREE.MeshBasicMaterial({
  color: 0xff00ff,
  wireframe: true,
  transparent: true,
  opacity: 0.3
});
const core = new THREE.Mesh(coreGeometry, coreMaterial);
scene.add(core);

// 4. Floating Data Blocks (Cubes) - Reduced Count
const particleCount = 50; // Reduced from 100
const particles = new THREE.Group();
const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.15 });

const dummy = new THREE.Object3D(); // For re-use if we went instanced, but group is fine for 50

for (let i = 0; i < particleCount; i++) {
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  // Random position in a sphere around center
  const r = 15 + Math.random() * 20;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI; // Full sphere

  mesh.position.x = r * Math.sin(phi) * Math.cos(theta);
  mesh.position.y = r * Math.sin(phi) * Math.sin(theta);
  mesh.position.z = r * Math.cos(phi);

  // Store random rotation speed
  mesh.userData = {
    rotSpeed: {
      x: Math.random() * 0.02,
      y: Math.random() * 0.02
    },
    drift: Math.random() * 0.02
  };

  particles.add(mesh);
}
scene.add(particles);

// --- Lighting (Subtle) --- //
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// --- Interaction --- //
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop --- //
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  targetX = mouseX * 0.0005;
  targetY = mouseY * 0.0005;

  // Main Object Rotation
  torusKnot.rotation.y += 0.005;
  torusKnot.rotation.x += 0.002;

  // Parallax Core
  core.rotation.y -= 0.01;
  core.rotation.z += 0.005;

  // Camera Parallax (Smooth)
  camera.rotation.y += 0.05 * (- targetX - camera.rotation.y);
  camera.rotation.x += 0.05 * (- targetY - camera.rotation.x);

  // Floating Particles
  particles.rotation.y = elapsedTime * 0.05;
  particles.children.forEach(p => {
    p.rotation.x += p.userData.rotSpeed.x;
    p.rotation.y += p.userData.rotSpeed.y;
  });

  // Pulse effect
  const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.05;
  torusKnot.scale.set(scale, scale, scale);

  // Infinite Grid Scroll Effect (Simulated)
  gridHelper.position.z = (elapsedTime * 2) % 10;

  renderer.render(scene, camera);
}

animate();

// --- 3D Card Tilt Effect --- //
const cards = document.querySelectorAll('.project-card, .skill-item');

cards.forEach(card => {
  // 1. Mouse Enter: Clear transition to remove jitter/lag during movement
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });

  // 2. Mouse Move: Calculate 3D tilt
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Slightly reduced tilt amount for smoother feel
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  // 3. Mouse Leave: Add smooth transition for "slow realignment"
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'; // Smooth ease-out
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// --- Mobile Navigation Logic --- //
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li');

hamburger.addEventListener('click', () => {
  // Toggle Nav
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');

  // Animate Links
  links.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = '';
    } else {
      link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
    }
  });
});

// Close menu when clicking a link
links.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');

    links.forEach(l => {
      l.style.animation = '';
    });
  });
});

// Add keyframe for link fade in programmatically or ensuring it's in CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes navLinkFade {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);
