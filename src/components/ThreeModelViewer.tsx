"use client";

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

type ThreeModelViewerProps = {
  modelUrl: string;
  itemName: string;
};

const disposeObject = (object: THREE.Object3D) => {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();

      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
};

const SceneContent = ({ model }: { model: THREE.Object3D }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);
  const bounds = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const sizeLength = size.length();

    return { center, sizeLength };
  }, [model]);

  const controls = useMemo(() => {
    const nextControls = new OrbitControls(camera, gl.domElement);
    nextControls.enablePan = false;
    nextControls.screenSpacePanning = true;
    nextControls.minPolarAngle = 0;
    nextControls.maxPolarAngle = Math.PI;
    return nextControls;
  }, [camera, gl.domElement]);

  useEffect(() => {
    controlsRef.current = controls;

    return () => {
      controls.dispose();
      controlsRef.current = null;
    };
  }, [controls]);

  useEffect(() => {
    const { center, sizeLength } = bounds;
    model.position.set(-center.x, -center.y, -center.z);
    controls.reset();
    controls.target.set(0, 0, 0);
    controls.minDistance = Math.max(sizeLength * 0.25, 0.2);
    controls.maxDistance = sizeLength * 2;
    (camera as THREE.PerspectiveCamera).near = Math.max(sizeLength / 10, 0.01);
    (camera as THREE.PerspectiveCamera).far = Math.max(sizeLength * 10, 2);
    camera.position.set(sizeLength / 2, sizeLength / 5, sizeLength / 2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.update();
    controls.saveState();
  }, [bounds, camera, controls, model]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <>
      <color attach="background" args={['#191919']} />
      <ambientLight color="#cfab9f" intensity={2.5} />
      <directionalLight color="#ffffff" intensity={4} position={[10, 0, 0]} />
      <directionalLight color="#ffffff" intensity={4} position={[-10, 0, 0]} />
      <directionalLight color="#ffffff" intensity={4} position={[0, 100, 0]} />

      <primitive object={model} />
    </>
  );
};

export const ThreeModelViewer = ({ modelUrl, itemName }: ThreeModelViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    loader.setDRACOLoader(dracoLoader);

    let mounted = true;
    let loadedModel: THREE.Object3D | null = null;

    setModel(null);
    setIsLoading(true);
    setHasError(false);

    loader.load(
      modelUrl,
      (gltf) => {
        if (!mounted) {
          return;
        }

        loadedModel = gltf.scene;
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        setModel(loadedModel);
        setIsLoading(false);
      },
      undefined,
      () => {
        if (!mounted) {
          return;
        }

        setModel(null);
        setHasError(true);
        setIsLoading(false);
      },
    );

    return () => {
      mounted = false;

      if (loadedModel) {
        disposeObject(loadedModel);
      }
    };
  }, [itemName, modelUrl]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) {
      return;
    }

    if (document.fullscreenElement === containerRef.current) {
      await document.exitFullscreen();
      return;
    }

    await containerRef.current.requestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className={`three-model-viewer${isDragging ? ' is-dragging' : ''}`}
      style={{ height: '500px', width: '500px', position: 'relative' }}
      aria-label={`${itemName} 3D viewer`}
    >
      <button
        type="button"
        onClick={() => {
          void toggleFullscreen();
        }}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          zIndex: 2,
          padding: '0.35rem 0.6rem',
          border: '1px solid rgba(255,255,255,0.35)',
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      </button>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ fov: 45, near: 0.1, far: 1000, position: [2.5, 1.8, 3.5] }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
      >
        {model ? <SceneContent model={model} /> : null}
      </Canvas>
      {isLoading ? <div className="three-model-status">Loading 3D model...</div> : null}
      {hasError ? <div className="three-model-status">Unable to load 3D model.</div> : null}
    </div>
  );
};
