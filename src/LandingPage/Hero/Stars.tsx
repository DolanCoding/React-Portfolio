import { useEffect, useRef } from "react";
import type { PerspectiveCamera, Scene, WebGLRenderer, Points, BufferAttribute } from "three";
import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import "./Stars.css";

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const starsRef = useRef<Points | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    let mounted = true;

    async function init() {
      if (!mounted || !canvasRef.current) return;

      const [
        THREE,
        { EffectComposer },
        { RenderPass },
        { UnrealBloomPass },
      ] = await Promise.all([
        import("three"),
        import("three/examples/jsm/postprocessing/EffectComposer.js"),
        import("three/examples/jsm/postprocessing/RenderPass.js"),
        import("three/examples/jsm/postprocessing/UnrealBloomPass.js"),
      ]);

      if (!mounted || !canvasRef.current) return;

      const initCamera = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = height > 0 ? width / height : 1;
        const camera = new THREE.PerspectiveCamera(69, aspect, 0.1, 2000);
        camera.position.z = 0;
        cameraRef.current = camera;
        return camera;
      };

      const createStarAppearance = (camera: PerspectiveCamera) => {
        const scene = sceneRef.current!;
        const starCount = window.innerWidth <= 768 ? 1500 : 5000;
        const vertices: number[] = [];
        const colors: number[] = [];
        const sizes: number[] = [];
        const spawnTimes: number[] = [];

        const fovInRadians = camera.fov * (Math.PI / 180);
        const zDepth = 800;
        const speed = 0.5;

        for (let i = 0; i < starCount; i++) {
          const startZ = -zDepth + Math.random() * 250;
          const heightAtStartZ = 2 * Math.tan(fovInRadians / 2) * Math.abs(startZ);
          const widthAtStartZ = heightAtStartZ * camera.aspect;
          const spawnAngle = Math.random() * Math.PI * 2;
          const spawnRadius = Math.sqrt(Math.random());
          let x = Math.cos(spawnAngle) * (widthAtStartZ / 2) * spawnRadius;
          let y = Math.sin(spawnAngle) * (heightAtStartZ / 2) * spawnRadius;
          let z = startZ;

          const maxLifetimeFrames = Math.floor(Math.abs(startZ) / speed);
          const ageFrames = Math.floor(Math.random() * maxLifetimeFrames);
          for (let f = 0; f < ageFrames; f++) {
            z += speed;
            const proximityFactor = Math.pow(1 - Math.abs(z) / zDepth, 2);
            const radialPush = 0.025 * proximityFactor;
            x *= 1 + radialPush;
            y *= 1 + radialPush;
          }

          vertices.push(x, y, z);

          const sizeRandom = Math.random();
          const starSize = 7 + Math.pow(sizeRandom, 2.5) * 6.5;
          sizes.push(starSize);

          let r: number, g: number, b: number;
          const colorType = Math.random();
          if (colorType < 0.7) {
            r = 1.0; g = 1.0; b = 0.97;
          } else if (colorType < 0.92) {
            r = 0.72 + Math.random() * 0.18;
            g = 0.85 + Math.random() * 0.12;
            b = 1.0;
          } else {
            r = 1.0;
            g = 0.92 + Math.random() * 0.06;
            b = 0.78 + Math.random() * 0.12;
          }

          const proximity = Math.max(0, 1 - Math.abs(z) / zDepth);
          const alpha = Math.pow(proximity, 1.5);
          colors.push(r, g, b, alpha);
          spawnTimes.push(0);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
        geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
        geometry.setAttribute("spawnTime", new THREE.Float32BufferAttribute(spawnTimes, 1));

        const vertexShader = `
          attribute float size;
          attribute vec4 color;
          varying vec4 vColor;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * 500.0 / -mvPosition.z;
            gl_Position = projectionMatrix * mvPosition;
          }
        `;

        const fragmentShader = `
          precision highp float;
          varying vec4 vColor;

          void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float dist = length(uv);
            float core = smoothstep(0.08, 0.0, dist);
            float innerHalo = smoothstep(0.28, 0.04, dist) * 0.55;
            float outerHalo = smoothstep(0.5, 0.18, dist) * 0.2;
            float intensity = core + innerHalo + outerHalo;
            gl_FragColor = vec4(vColor.rgb, intensity * vColor.a);
          }
        `;

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
        starsRef.current = stars;
      };

      const updateStarMovement = () => {
        const stars = starsRef.current!;
        const positions = (stars.geometry.attributes["position"] as BufferAttribute).array as Float32Array;
        const colors = (stars.geometry.attributes["color"] as BufferAttribute).array as Float32Array;
        const spawnTimes = (stars.geometry.attributes["spawnTime"] as BufferAttribute).array as Float32Array;

        const speed = 0.5;
        const zDepth = 800;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] += speed;
          const proximityFactor = Math.pow(1 - Math.abs(positions[i + 2]) / zDepth, 2);
          const radialPush = 0.025 * proximityFactor;
          positions[i] *= 1 + radialPush;
          positions[i + 1] *= 1 + radialPush;

          const colorIndex = (i / 3) * 4;
          const proximity = Math.max(0, 1 - Math.abs(positions[i + 2]) / zDepth);
          let alpha = Math.pow(proximity, 1.5);

          const spawnIndex = i / 3;
          if (spawnTimes[spawnIndex] > 0) {
            const elapsed = performance.now() - spawnTimes[spawnIndex];
            const fadeIn = Math.min(1, elapsed / 1000);
            alpha *= fadeIn;
          }

          colors[colorIndex + 3] = alpha;
        }

        (stars.geometry.attributes["position"] as BufferAttribute).needsUpdate = true;
        (stars.geometry.attributes["color"] as BufferAttribute).needsUpdate = true;
        (stars.geometry.attributes["spawnTime"] as BufferAttribute).needsUpdate = true;
      };

      const respawnPassedStars = () => {
        const stars = starsRef.current!;
        const camera = cameraRef.current!;
        const positions = (stars.geometry.attributes["position"] as BufferAttribute).array as Float32Array;
        const colors = (stars.geometry.attributes["color"] as BufferAttribute).array as Float32Array;
        const spawnTimes = (stars.geometry.attributes["spawnTime"] as BufferAttribute).array as Float32Array;

        const zDepth = 800;

        for (let i = 0; i < positions.length; i += 3) {
          if (positions[i + 2] > camera.position.z) {
            const fovInRadians = camera.fov * (Math.PI / 180);
            const recycledZ = -zDepth + Math.random() * 250;
            const heightAtZ = 2 * Math.tan(fovInRadians / 2) * Math.abs(recycledZ);
            const widthAtZ = heightAtZ * camera.aspect;
            const angle = Math.random() * Math.PI * 2;
            const radiusMultiplier = Math.sqrt(Math.random());

            positions[i] = Math.cos(angle) * (widthAtZ / 2) * radiusMultiplier;
            positions[i + 1] = Math.sin(angle) * (heightAtZ / 2) * radiusMultiplier;
            positions[i + 2] = recycledZ;

            const colorIndex = (i / 3) * 4;
            colors[colorIndex + 3] = 0;

            const spawnIndex = i / 3;
            spawnTimes[spawnIndex] = performance.now();
          }
        }
      };

      const canvasEl = canvasRef.current!;
      const width = window.innerWidth;
      const height = window.innerHeight;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = initCamera();

      const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      const renderScene = new RenderPass(scene, camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 7, 3, 0.5);
      const composer = new EffectComposer(renderer);
      composer.addPass(renderScene);
      composer.addPass(bloomPass);
      composerRef.current = composer;

      createStarAppearance(camera);

      const animate = () => {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        updateStarMovement();
        respawnPassedStars();
        starsRef.current!.rotation.z += 0.00005;
        composerRef.current!.render();
      };
      animate();

      const handleResize = () => {
        const cam = cameraRef.current;
        const ren = rendererRef.current;
        const comp = composerRef.current;
        if (!cam || !ren) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        cam.aspect = h > 0 ? w / h : 1;
        cam.updateProjectionMatrix();
        ren.setSize(w, h);
        ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        comp?.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      // Store cleanup in a ref so the outer cleanup can call it
      cleanupFnRef.current = () => {
        window.removeEventListener("resize", handleResize);
        if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
        const sc = sceneRef.current;
        if (sc) {
          sc.traverse((object: any) => {
            if (object.isMesh || object.isPoints) {
              object.geometry?.dispose();
              if (Array.isArray(object.material)) {
                object.material.forEach((m: any) => m.dispose());
              } else {
                object.material?.dispose();
              }
            }
          });
        }
        rendererRef.current?.dispose();
      };
    }

    // eslint-disable-next-line prefer-const
    const cleanupFnRef = { current: null as (() => void) | null };

    let cancelFn: () => void;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => init(), { timeout: 3000 });
      cancelFn = () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(init, 200);
      cancelFn = () => clearTimeout(id);
    }

    return () => {
      mounted = false;
      cancelFn();
      cleanupFnRef.current?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}
