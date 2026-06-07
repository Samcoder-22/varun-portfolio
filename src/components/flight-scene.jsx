"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const WARM_STAR_COLORS = [
  "#ffb46b",
  "#ffc184",
  "#ffc78f",
  "#ffcc99",
  "#ffd1a3",
  "#ffd5ad",
];

const COOL_STAR_COLORS = [
  "#fff5f5",
  "#f0f1ff",
  "#e6ebff",
  "#d8e3ff",
  "#c6d8ff",
  "#b7ceff",
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function pickWeightedStarColor(layerIndex) {
  const warmChanceByLayer = [0.72, 0.42, 0.68];

  return Math.random() < warmChanceByLayer[layerIndex]
    ? pickRandom(WARM_STAR_COLORS)
    : pickRandom(COOL_STAR_COLORS);
}

function createCircleTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  if (!context) {
    return null;
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.95)");
  gradient.addColorStop(0.72, "rgba(255, 255, 255, 0.35)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}

function createShip() {
  const ship = new THREE.Group();
  const hullMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    metalness: 0.95,
    roughness: 0.2,
    emissive: 0x00d4ff,
    emissiveIntensity: 0.06,
  });
  const neonMaterial = new THREE.MeshBasicMaterial({ color: 0x00d4ff });

  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 1.2, 8, 5), hullMaterial);
  ship.add(hull);

  const wingGeometry = new THREE.BoxGeometry(7, 0.22, 4);
  const wingLeft = new THREE.Mesh(wingGeometry, hullMaterial);
  wingLeft.position.set(-2, -1, 1);
  wingLeft.rotation.y = 0.42;
  ship.add(wingLeft);

  const wingRight = wingLeft.clone();
  wingRight.position.x = 2;
  wingRight.rotation.y = -0.42;
  ship.add(wingRight);

  const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.85, 1.1), hullMaterial);
  bridge.position.set(0, -1.5, 0.45);
  ship.add(bridge);

  const engineGeometry = new THREE.CylinderGeometry(0.5, 0.22, 1, 16);
  const engineLeft = new THREE.Mesh(engineGeometry, neonMaterial);
  engineLeft.position.set(-1.2, -4, 0);
  ship.add(engineLeft);

  const engineRight = engineLeft.clone();
  engineRight.position.x = 1.2;
  ship.add(engineRight);

  const engineLight = new THREE.PointLight(0x00d4ff, 4.5, 16);
  engineLight.position.set(0, -5, 0);
  ship.add(engineLight);

  ship.rotation.x = Math.PI;
  ship.scale.setScalar(0.001);
  ship.visible = false;

  return ship;
}

function createStarfield(circleTexture) {
  const starfield = new THREE.Group();
  const layers = [
    {
      count: 3600,
      spreadX: 3200,
      spreadY: 1800,
      spreadZ: 3400,
      size: 0.95,
      opacity: 0.5,
    },
    {
      count: 2200,
      spreadX: 2400,
      spreadY: 1500,
      spreadZ: 2600,
      size: 1.6,
      opacity: 0.78,
    },
    {
      count: 700,
      spreadX: 1400,
      spreadY: 900,
      spreadZ: 1800,
      size: 2.4,
      opacity: 0.95,
    },
  ];

  layers.forEach((layer, index) => {
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];

    for (let starIndex = 0; starIndex < layer.count; starIndex += 1) {
      starPositions.push(
        (Math.random() - 0.5) * layer.spreadX,
        (Math.random() - 0.5) * layer.spreadY,
        (Math.random() - 0.5) * layer.spreadZ
      );

      const color = new THREE.Color(pickWeightedStarColor(index));
      starColors.push(color.r, color.g, color.b);
    }

    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));

    const starLayer = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: layer.size,
        transparent: true,
        opacity: layer.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        vertexColors: true,
        map: circleTexture,
        alphaMap: circleTexture,
      })
    );

    starLayer.userData.rotationSpeed = 0.00008 + index * 0.00005;
    starLayer.userData.driftOffset = Math.random() * Math.PI * 2;
    starLayer.position.y = (index - 1) * 2.5;
    starfield.add(starLayer);
  });

  return starfield;
}

export default function FlightScene({ launchState, isActive }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const shipRef = useRef(null);
  const starsRef = useRef(null);
  const frameRef = useRef(0);
  const launchStartedAtRef = useRef(null);
  const exitStartedAtRef = useRef(null);
  const exitFromRef = useRef(null);
  const launchPathRef = useRef(null);
  const scrollStateRef = useRef({
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    drift: 0,
  });
  const launchConfigRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 4, 34);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.45);
    rimLight.position.set(10, 10, 10);
    scene.add(ambientLight, rimLight);

    const ship = createShip();
    const circleTexture = createCircleTexture();
    const stars = createStarfield(circleTexture);

    scene.add(stars);
    scene.add(ship);

    rendererRef.current = renderer;
    cameraRef.current = camera;
    shipRef.current = ship;
    starsRef.current = stars;
    scrollStateRef.current.lastY = window.scrollY;
    scrollStateRef.current.lastTime = performance.now();

    const clock = new THREE.Clock();

    function updateShip(time) {
      if (
        !shipRef.current ||
        launchStartedAtRef.current == null ||
        !launchConfigRef.current ||
        !launchPathRef.current
      ) {
        return;
      }

      const shipObject = shipRef.current;
      const { endScale, driftScale, cruiseDepth } = launchConfigRef.current;
      const launchElapsed = (performance.now() - launchStartedAtRef.current) / 1000;
      const entranceProgress = clamp(launchElapsed / 1.75, 0, 1);
      const documentHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = clamp(window.scrollY / documentHeight, 0, 1);
      const driftOffset = scrollProgress * driftScale;
      const scaleProgress = entranceProgress < 0.78
        ? easeOutBack(clamp(entranceProgress / 0.78, 0, 1))
        : 1;
      const pathProgress = easeInOutCubic(entranceProgress);
      const pathPoint = launchPathRef.current.getPointAt(pathProgress);

      shipObject.visible = true;
      shipObject.scale.setScalar(Math.max(endScale * scaleProgress, 0.001));
      if (exitStartedAtRef.current != null && exitFromRef.current) {
        const exitProgress = clamp((performance.now() - exitStartedAtRef.current) / 1000 / 1.25, 0, 1);
        const exitEase = easeInOutCubic(exitProgress);
        shipObject.position.set(
          exitFromRef.current.x,
          exitFromRef.current.y - 16 * exitEase,
          exitFromRef.current.z + 4.5 * exitEase
        );

        if (exitProgress >= 1) {
          shipObject.visible = false;
          launchStartedAtRef.current = null;
          exitStartedAtRef.current = null;
          exitFromRef.current = null;
        }
      } else {
        shipObject.position.set(
          pathPoint.x,
          pathPoint.y - driftOffset,
          pathPoint.z - scrollProgress * cruiseDepth
        );
      }

      shipObject.rotation.x = Math.PI;
      shipObject.rotation.y = 0;
      shipObject.rotation.z = 0;
    }

    function updateScrollDrift() {
      const now = performance.now();
      const deltaTime = Math.max(now - scrollStateRef.current.lastTime, 16);
      const currentY = window.scrollY;
      const deltaY = currentY - scrollStateRef.current.lastY;
      const targetVelocity = clamp(deltaY / deltaTime, -2.4, 2.4);

      scrollStateRef.current.velocity += (targetVelocity - scrollStateRef.current.velocity) * 0.22;
      scrollStateRef.current.drift = scrollStateRef.current.velocity * 1.3;
      scrollStateRef.current.lastY = currentY;
      scrollStateRef.current.lastTime = now;
    }

    function animate() {
      const elapsed = clock.getElapsedTime();
      updateScrollDrift();

      if (starsRef.current) {
        starsRef.current.children.forEach((layer, index) => {
          layer.position.x -= 0.03 + index * 0.014;
          layer.position.y += scrollStateRef.current.drift * (0.55 + index * 0.1);

          if (layer.position.x < -1200) {
            layer.position.x = 1200;
          }

          if (layer.position.y < -180) {
            layer.position.y = 180;
          } else if (layer.position.y > 180) {
            layer.position.y = -180;
          }

          layer.rotation.y += layer.userData.rotationSpeed;
          layer.rotation.x = Math.sin(elapsed * (0.04 + index * 0.015) + layer.userData.driftOffset) * 0.02;
        });
      }

      updateShip(elapsed);
      renderer.render(scene, camera);
      frameRef.current = window.requestAnimationFrame(animate);
    }

    function handleResize() {
      if (!cameraRef.current || !rendererRef.current) {
        return;
      }

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(frameRef.current);
      disposeStarfield(stars);
      if (circleTexture) {
        circleTexture.dispose();
      }
      ship.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else if (object.material) {
          object.material.dispose();
        }
      });
      renderer.dispose();
      scene.clear();
    };
  }, []);

  useEffect(() => {
    if (!shipRef.current || !launchState?.token) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const startZ = isMobile ? -8.7 : -7.7;
    const startPoint = new THREE.Vector3(0, isMobile ? 16.5 : 19, startZ);
    const midPoint = new THREE.Vector3(isMobile ? -0.45 : -0.6, isMobile ? 11.8 : 13.2, startZ - 0.2);
    const endPoint = new THREE.Vector3(isMobile ? -1.3 : -1.7, isMobile ? 7.2 : 8.6, startZ - 0.45);

    launchPathRef.current = new THREE.CatmullRomCurve3([
      startPoint.clone(),
      midPoint.clone(),
      endPoint.clone(),
    ]);
    launchPathRef.current.curveType = "chordal";
    launchPathRef.current.tension = 0;

    shipRef.current.visible = true;
    shipRef.current.position.copy(startPoint);
    shipRef.current.scale.setScalar(0.001);
    launchConfigRef.current = {
      endScale: isMobile ? 0.28 : 0.38,
      driftScale: isMobile ? 12 : 16,
      cruiseDepth: isMobile ? 2.4 : 3.1,
    };
    launchStartedAtRef.current = performance.now();
    exitStartedAtRef.current = null;
    exitFromRef.current = null;
  }, [launchState]);

  useEffect(() => {
    if (isActive || !shipRef.current) {
      return;
    }

    if (!shipRef.current.visible || launchStartedAtRef.current == null) {
      return;
    }

    exitFromRef.current = shipRef.current.position.clone();
    exitStartedAtRef.current = performance.now();
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function disposeStarfield(starfield) {
  starfield.children.forEach((layer) => {
    if (layer.geometry) {
      layer.geometry.dispose();
    }

    if (layer.material) {
      layer.material.dispose();
    }
  });
}
