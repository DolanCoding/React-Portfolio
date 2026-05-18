import { useEffect, useRef } from "react";
import type * as THREE from "three";
import "./Stars.css";

// How deep the scene extends behind the camera. Larger = stars travel longer before reaching camera.
const Z_DEPTH = 1500;

// How fast stars move toward the camera per frame. Larger = faster flythrough.
const SPEED = 0.25;

// Strength of outward push as stars approach camera. Larger = wider cone spread, more dramatic warp effect.
const RADIAL_EXPANSION = 1.25;

// Fraction of viewport stars spawn into at the back. 1.0 = full screen, 0.5 = center 50% only.
const SPAWN_PERCENT = 0.9;

// Speed variation range. Stars get randomized speed between SPEED * (1 - SPEED_VARIANCE) and SPEED * (1 + SPEED_VARIANCE).
const SPEED_VARIANCE = 0.25;

// How far past screen edge a star travels before respawning. Larger = stars exit further off-screen.
const RESPAWN_MARGIN = 1;

// Brightness curve exponent (controls how fast stars brighten as they approach). Higher = more dramatic brightening.
const BRIGHTNESS_CURVE = 0.75;

// Overall brightness multiplier for the starfield. Increase to make entire field brighter without affecting fade-in.
const BRIGHTNESS_MULTIPLIER = 1.5;

// Smallest base pixel size before perspective scaling. Increase to make all stars chunkier.
const BASE_SIZE_MIN = 8;

// Random size variation added to BASE_SIZE_MIN. Larger = more size variety between stars.
const BASE_SIZE_RANGE = 10;

// Multiplier for perspective size scaling. Larger = stars grow more dramatically as they approach.
const SIZE_SCALE_MULTIPLIER = 2.5;

// Star glow/emission strength. Increase to make stars brighter and more luminous.
const GLOW_STRENGTH = 2.5;

// Stars per pixel of viewport area. Larger = denser starfield (more stars on bigger screens).
const STAR_DENSITY = 0.0001;

// Floor for star count on very small screens. Ensures minimum density even on tiny viewports.
const MIN_STARS = 300;

// Camera field of view in degrees. Larger = wider angle, more "warped" perspective feel.
const FOV_DEG = 45;

// Per-frame rotation of the entire starfield around the camera. Larger = more visible spin.
const ROTATION_SPEED = 0.00005;

type Vec2 = { x: number; y: number };

function randomStarColor(): [number, number, number] {
  const t = Math.random();
  if (t < 0.7) return [1.0, 1.0, 0.97];
  if (t < 0.92) return [0.72 + Math.random() * 0.18, 0.85 + Math.random() * 0.12, 1.0];
  return [1.0, 0.92 + Math.random() * 0.06, 0.78 + Math.random() * 0.12];
}

function spawnInCenter(z: number, aspect: number, fovRad: number): Vec2 {
  const heightAtZ = 2 * Math.tan(fovRad / 2) * Math.abs(z);
  const widthAtZ = heightAtZ * aspect;
  const radius = (Math.min(widthAtZ, heightAtZ) / 2) * SPAWN_PERCENT;
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * radius;
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r,
  };
}

function proximityAlpha(z: number): number {
  const proximity = 1 - Math.abs(z) / Z_DEPTH;
  return Math.pow(Math.max(0, proximity), BRIGHTNESS_CURVE) * BRIGHTNESS_MULTIPLIER;
}

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import("three");
      if (cancelled) return;

      // Renderer (try WebGPU, fallback to WebGL)
      const WebGPURenderer = (THREE as unknown as { WebGPURenderer?: typeof THREE.WebGLRenderer })
        .WebGPURenderer;
      let renderer: THREE.WebGLRenderer;

      if (WebGPURenderer) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderer = new (WebGPURenderer as any)({ canvas, antialias: true, alpha: true });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (renderer as any).init();
        } catch {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        }
      } else {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      }

      if (cancelled) {
        renderer.dispose();
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV_DEG, width / height, 0.1, 5000);
      camera.position.z = 0;
      const fovRad = camera.fov * (Math.PI / 180);

      // Star data
      const starCount = Math.max(MIN_STARS, Math.floor(width * height * STAR_DENSITY));
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 4);
      const sizes = new Float32Array(starCount);
      const speeds = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        // Uniform z-distribution: stars evenly spread across entire depth range
        const z = -Z_DEPTH + Math.random() * Z_DEPTH;

        // Random speed for each star
        const speedMultiplier = 1 + (Math.random() - 0.5) * 2 * SPEED_VARIANCE;
        speeds[i] = SPEED * speedMultiplier;

        // Initialize at center, radial expansion applied during update loop
        const spawn = spawnInCenter(-Z_DEPTH, camera.aspect, fovRad);
        positions[i * 3] = spawn.x;
        positions[i * 3 + 1] = spawn.y;
        positions[i * 3 + 2] = z;

        const [r, g, b] = randomStarColor();
        colors[i * 4] = r;
        colors[i * 4 + 1] = g;
        colors[i * 4 + 2] = b;
        colors[i * 4 + 3] = proximityAlpha(z);

        sizes[i] = BASE_SIZE_MIN + Math.pow(Math.random(), 1.5) * BASE_SIZE_RANGE;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 4));
      geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

      const sizeScale = (height / (2 * Math.tan(fovRad / 2))) * SIZE_SCALE_MULTIPLIER;

      const material = new THREE.ShaderMaterial({
        uniforms: { sizeScale: { value: sizeScale } },
        vertexShader: `
          attribute float size;
          attribute vec4 color;
          uniform float sizeScale;
          varying vec4 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * sizeScale / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          precision highp float;
          varying vec4 vColor;
          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float dist = length(uv);
            if (dist > 0.45) discard;
            float core = smoothstep(0.03, 0.0, dist);
            float halo1 = smoothstep(0.09, 0.05, dist) * 0.35;
            float halo2 = smoothstep(0.18, 0.12, dist) * 0.12;
            float intensity = (core + halo1 + halo2) * ${GLOW_STRENGTH};
            gl_FragColor = vec4(vColor.rgb * 1.5, intensity * vColor.a);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });

      const stars = new THREE.Points(geometry, material);
      scene.add(stars);

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const colAttr = geometry.attributes.color as THREE.BufferAttribute;

      // Per-frame update
      const updateStars = () => {
        const aspect = camera.aspect;
        const tanHalfFov = Math.tan(fovRad / 2);

        for (let i = 0; i < starCount; i++) {
          const px = i * 3;
          const cx = i * 4;

          positions[px + 2] += speeds[i];

          const dist = Math.hypot(positions[px], positions[px + 1]);
          if (dist > 0.001) {
            const pf = Math.pow(1 - Math.abs(positions[px + 2]) / Z_DEPTH, 2);
            const exp = 1 + RADIAL_EXPANSION * pf;
            positions[px] *= exp;
            positions[px + 1] *= exp;
          }

          colors[cx + 3] = proximityAlpha(positions[px + 2]);

          const widthAtZ = tanHalfFov * Math.abs(positions[px + 2]) * aspect;
          const starDist = Math.hypot(positions[px], positions[px + 1]);

          if (positions[px + 2] > 0 || starDist > widthAtZ * RESPAWN_MARGIN) {
            const spawn = spawnInCenter(-Z_DEPTH, aspect, fovRad);
            positions[px] = spawn.x;
            positions[px + 1] = spawn.y;
            positions[px + 2] = -Z_DEPTH;
            colors[cx + 3] = proximityAlpha(-Z_DEPTH);
          }
        }

        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      };

      let animationId = 0;
      let startTime = Date.now();
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        const elapsed = Date.now() - startTime;
        const fadePhase = Math.min(1, Math.max(0, elapsed / 500));

        updateStars();

        for (let i = 0; i < starCount; i++) {
          colors[i * 4 + 3] = proximityAlpha(positions[i * 3 + 2]) * fadePhase;
        }
        colAttr.needsUpdate = true;

        stars.rotation.z += ROTATION_SPEED;
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        material.uniforms.sizeScale.value =
          (h / (2 * Math.tan(fovRad / 2))) * SIZE_SCALE_MULTIPLIER;
      };
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}
