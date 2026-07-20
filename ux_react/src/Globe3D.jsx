import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Globe3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    const radius = 1;

    const bordeauxColor = new THREE.Color(0x8B2535);
    const goldColor = new THREE.Color(0xC9963A);
    const lightGoldColor = new THREE.Color(0xE8C97A);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.4) {
        color = bordeauxColor;
      } else if (colorChoice < 0.8) {
        color = goldColor;
      } else {
        color = lightGoldColor;
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    let time = 0;
    let baseRotationSpeed = 0.001;

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);

      time += 0.02;

      const rotationSpeed = isHovered ? baseRotationSpeed * 2.5 : baseRotationSpeed;
      particles.rotation.y += rotationSpeed;
      particles.rotation.x += rotationSpeed * 0.3;

      const positionsAttr = particles.geometry.attributes.position;
      const sizesAttr = particles.geometry.attributes.size;

      // Pulsation globale plus visible
      const globalPulse = Math.sin(time * 1.5) * 0.15 + 1;

      for (let i = 0; i < particleCount; i++) {
        const phase = phases[i];
        // Pulsation individuelle amplifiée
        const pulse = Math.sin(time * 2 + phase) * 0.5 + 0.5;

        const baseSize = sizes[i];
        // Combiner pulsation globale et individuelle
        sizesAttr.array[i] = baseSize * (0.5 + pulse * 0.8) * globalPulse;
      }

      sizesAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    function handleResize() {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [isHovered]);

  return (
    <div
      ref={containerRef}
      className="globe-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
