import * as THREE from 'three';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8; // Position camera to see the plane

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Global variables for mouse interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let current_intersected_object = null; // To track if mouse is over our scratch card
let is_mouse_down = false; // To track if mouse button is held down

// --- Image URLs (Replace with your actual images!) ---
const REVEALED_IMAGE_URL = 'http://localhost:4290/library/assets/jhana-of-god-scratch/tile-fish.png'; // Example revealed image (dog)
const SCRATCH_IMAGE_URL = 'http://localhost:4290/library/assets/jhana-of-god-scratch/mystery.png'; // Example scratchable image (mountain)

// Dimensions for our planes (world units)
const PLANE_WIDTH = 1.5
const PLANE_HEIGHT = 1.5; // Example aspect ratio 4:3

// --- Scratch Mask Canvas Setup ---
const MASK_CANVAS_SIZE = 128; // Resolution of our scratch mask texture
const mask_canvas = document.createElement('canvas');
mask_canvas.width = MASK_CANVAS_SIZE;
mask_canvas.height = MASK_CANVAS_SIZE;
const mask_context = mask_canvas.getContext('2d');

// Initialize mask canvas to solid white (fully opaque for the scratch layer)
mask_context.fillStyle = 'white';
mask_context.fillRect(0, 0, MASK_CANVAS_SIZE, MASK_CANVAS_SIZE);

// Create a CanvasTexture from our mask canvas
const scratch_mask_texture = new THREE.CanvasTexture(mask_canvas);
scratch_mask_texture.needsUpdate = true; // Mark as needing update after drawing

// --- Load Textures and Create Planes ---
const texture_loader = new THREE.TextureLoader();

// Load the revealed image
const revealed_texture = texture_loader.load(REVEALED_IMAGE_URL, (texture) => {
  texture.encoding = THREE.sRGBEncoding;
});

// Load the scratchable image
const scratchable_texture = texture_loader.load(SCRATCH_IMAGE_URL, (texture) => {
  texture.encoding = THREE.sRGBEncoding;
});

let scratch_card_plane; // The plane that will be scratched

// Custom Shader for the Scratch Card
const scratch_vertex_shader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const scratch_fragment_shader = `
    uniform sampler2D scratchable_texture; // The image to be scratched
    uniform sampler2D scratch_mask;      // The mask we draw on (black for scratched, white for not)

    varying vec2 vUv;

    void main() {
        vec4 scratch_color = texture2D(scratchable_texture, vUv);
        vec4 mask_value = texture2D(scratch_mask, vUv);

        // mask_value.r will be close to 1.0 (white) where not scratched, and close to 0.0 (black) where scratched.
        // We want to discard pixels where the mask is black (scratched).
        // If mask_value.r is 0, then scratch_color's alpha becomes 0, making it transparent.
        gl_FragColor = vec4(scratch_color.rgb, scratch_color.a * mask_value.r);
    }
`;

const revealed_material = new THREE.MeshBasicMaterial({ map: revealed_texture });
const revealed_plane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT), revealed_material);
revealed_plane.position.z = -0.01; // Slightly behind the scratchable plane
scene.add(revealed_plane);

// Scratchable layer (front) with custom shader
const scratch_material = new THREE.ShaderMaterial({
  uniforms: {
    scratchable_texture: { value: scratchable_texture },
    scratch_mask: { value: scratch_mask_texture }
  },
  vertexShader: scratch_vertex_shader,
  fragmentShader: scratch_fragment_shader,
  transparent: true, // Crucial for revealing the layer behind
  side: THREE.DoubleSide // Important if you need to see from both sides
});
scratch_card_plane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT), scratch_material);
scratch_card_plane.position.z = 0; // Front plane
scene.add(scratch_card_plane);

// --- Mouse Interaction ---
renderer.domElement.addEventListener('pointerdown', on_pointer_down);
renderer.domElement.addEventListener('pointermove', on_pointer_move);
renderer.domElement.addEventListener('pointerup', on_pointer_up);

function on_pointer_down(event) {
  is_mouse_down = true;
}

function on_pointer_up(event) {
  is_mouse_down = false;
}

function on_pointer_move(event) {
  // Normalize mouse coordinates to -1 to +1 range
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([scratch_card_plane]);

  if (intersects.length > 0) {
    current_intersected_object = intersects[0].object;

    if (is_mouse_down && current_intersected_object === scratch_card_plane) {
      // Get the UV coordinates of the intersection point
      const uv = intersects[0].uv;

      // Convert UV coordinates (0-1) to mask canvas pixel coordinates (0-MASK_CANVAS_SIZE)
      const x_pixel = uv.x * MASK_CANVAS_SIZE;
      const y_pixel = (1 - uv.y) * MASK_CANVAS_SIZE; // Y is inverted for canvas context

      // Draw a circle on the mask canvas (making it black where scratched)
      mask_context.globalCompositeOperation = 'destination-out'; // Makes new draws cut out existing pixels
      mask_context.beginPath();
      mask_context.arc(x_pixel, y_pixel, 15, 0, Math.PI * 2, false); // Adjust radius (15) for scratch size
      mask_context.fill();

      // Tell Three.js that the texture needs to be updated on the GPU
      scratch_mask_texture.needsUpdate = true;
    }
  } else {
    current_intersected_object = null;
  }
}


// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Start rendering immediately, but the scratch card will appear after textures load.
animate();
