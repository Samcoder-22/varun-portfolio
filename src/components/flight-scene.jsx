"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
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

function createStarfield() {
  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];

  for (let index = 0; index < 5500; index += 1) {
    starPositions.push(
      (Math.random() - 0.5) * 2800,
      (Math.random() - 0.5) * 1800,
      (Math.random() - 0.5) * 2800
    );
  }

  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));

  return new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.35,
      transparent: true,
      opacity: 0.92,
    })
  );
}

export default function FlightScene({ launchToken, isActive }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const shipRef = useRef(null);
  const starsRef = useRef(null);
  const frameRef = useRef(0);
  const launchStartedAtRef = useRef(null);
  const launchConfigRef = useRef({
    startY: 10,
    endY: 2,
    startX: 0,
    startZ: 0,
    endScale: 0.42,
  });

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
    const stars = createStarfield();

    scene.add(stars);
    scene.add(ship);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    shipRef.current = ship;
    starsRef.current = stars;

    const clock = new THREE.Clock();

    function updateShip(time) {
      if (!shipRef.current || launchStartedAtRef.current == null) {
        return;
      }

      const shipObject = shipRef.current;
      const { startY, endY, startX, startZ, endScale } = launchConfigRef.current;
      const launchElapsed = (performance.now() - launchStartedAtRef.current) / 1000;
      const entranceProgress = clamp(launchElapsed / 1.6, 0, 1);
      const entranceScale = endScale * easeOutBack(entranceProgress);
      const entranceY = startY + (endY - startY) * easeOutCubic(entranceProgress);
      const documentHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = clamp(window.scrollY / documentHeight, 0, 1);
      const driftOffset = scrollProgress * 20;

      shipObject.visible = true;
      shipObject.scale.setScalar(Math.max(entranceScale, 0.001));
      shipObject.position.x = startX + Math.sin(time * 0.85) * 0.38;
      shipObject.position.y = entranceY - driftOffset;
      shipObject.position.z = startZ - scrollProgress * 4;
      shipObject.rotation.z = Math.sin(time * 0.55) * 0.04;
      shipObject.rotation.y = Math.sin(time * 0.3) * 0.08;
    }

    function animate() {
      const elapsed = clock.getElapsedTime();

      if (starsRef.current) {
        starsRef.current.rotation.y += 0.00018;
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
      starGeometryDispose(stars);
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
    if (!shipRef.current || launchToken === 0) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const startX = isMobile ? 1.1 : 2.6;
    const startY = isMobile ? 7.2 : 8.2;
    const startZ = isMobile ? -10 : -8;
    const endY = isMobile ? 1.2 : 1.6;
    const endScale = isMobile ? 0.28 : 0.38;

    shipRef.current.visible = true;
    shipRef.current.position.set(startX, startY, startZ);
    shipRef.current.scale.setScalar(0.001);
    launchConfigRef.current = {
      startX,
      startY,
      startZ,
      endY,
      endScale,
    };
    launchStartedAtRef.current = performance.now();
  }, [launchToken]);

  useEffect(() => {
    if (isActive || !shipRef.current) {
      return;
    }

    window.setTimeout(() => {
      if (shipRef.current) {
        shipRef.current.visible = false;
      }
      launchStartedAtRef.current = null;
    }, 1200);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function starGeometryDispose(stars) {
  if (stars.geometry) {
    stars.geometry.dispose();
  }

  if (stars.material) {
    stars.material.dispose();
  }
}
