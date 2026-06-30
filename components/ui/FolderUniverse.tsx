"use strict";

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FolderUniverse() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Glow material helper
    const createMaterial = (color: number) =>
      new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        specular: 0xffffff,
      });

    const colors = [0x7c3aed, 0x94e2ff];
    interface FloatingObject {
      mesh: THREE.Mesh | THREE.Group;
      speed: number;
      rot: number;
      isSpark?: boolean;
    }
    const objects: FloatingObject[] = [];

    // Create Floating Course Folders (Cube Groups)
    for (let i = 0; i < 6; i++) {
      const folderGroup = new THREE.Group();
      
      const folderBodyGeo = new THREE.BoxGeometry(2, 1.5, 0.3);
      const mat = createMaterial(colors[i % colors.length]);
      const bodyMesh = new THREE.Mesh(folderBodyGeo, mat);
      folderGroup.add(bodyMesh);

      // Add a folder tab
      const tabGeo = new THREE.BoxGeometry(0.6, 0.3, 0.3);
      const tabMesh = new THREE.Mesh(tabGeo, mat);
      tabMesh.position.set(-0.6, 0.9, 0);
      folderGroup.add(tabMesh);

      // Random position
      folderGroup.position.set(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      );
      folderGroup.rotation.set(Math.random(), Math.random(), 0);

      objects.push({
        mesh: folderGroup,
        speed: Math.random() * 0.01 + 0.005,
        rot: Math.random() * 0.01,
      });
      group.add(folderGroup);
    }

    // Floating Link Chains (Torus clusters)
    for (let i = 0; i < 10; i++) {
      const torusGeo = new THREE.TorusGeometry(0.4, 0.1, 16, 50);
      const mat = createMaterial(0x94e2ff);
      const torusMesh = new THREE.Mesh(torusGeo, mat);

      torusMesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );

      objects.push({
        mesh: torusMesh,
        speed: Math.random() * 0.02,
        rot: Math.random() * 0.02,
      });
      group.add(torusMesh);
    }

    // AI Spark Particles (Spheres)
    const sparkGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 40; i++) {
      const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
      sparkMesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      );

      objects.push({
        mesh: sparkMesh,
        speed: Math.random() * 0.03,
        rot: 0,
        isSpark: true,
      });
      group.add(sparkMesh);
    }

    // Add Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const pLight1 = new THREE.PointLight(0x7c3aed, 2, 100);
    pLight1.position.set(10, 10, 10);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x94e2ff, 2, 100);
    pLight2.position.set(-10, -10, 10);
    scene.add(pLight2);

    // Mouse interactive tracking variables
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      const time = Date.now() * 0.001;

      objects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rot;
        obj.mesh.rotation.y += obj.rot;
        obj.mesh.position.y += Math.sin(time + idx) * 0.005;
        if (obj.isSpark) {
          obj.mesh.position.z += Math.cos(time + idx) * 0.01;
        }
      });

      // Smooth inertia rotation based on mouse position
      group.rotation.x += (mouseY * 0.2 - group.rotation.x) * 0.05;
      group.rotation.y += (mouseX * 0.2 - group.rotation.y) * 0.05;

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full bg-transparent" />;
}
