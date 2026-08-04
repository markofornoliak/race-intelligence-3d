import { Component, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, PropsWithChildren, ReactNode, WheelEvent as ReactWheelEvent } from 'react';
import { Canvas } from '@react-three/fiber';
import { MathUtils } from 'three';
import { Scene } from './scene/Scene';
import { VIEWS } from './scene/types';
import type { OrbitState, RaceCarSceneProps } from './scene/types';
export type { CarView, ComponentId, RaceCarSceneProps, SceneMode } from './scene/types';

class SceneBoundary extends Component<PropsWithChildren<{ fallback: ReactNode }>, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function RaceCarScene({ mode, view, selected, explode, autoRotate, telemetry, onSelect }: RaceCarSceneProps) {
  const initial = VIEWS[view];
  const orbit = useRef<OrbitState>({ pitch: initial.pitch, yaw: initial.yaw, targetPitch: initial.pitch, targetYaw: initial.yaw, zoom: initial.zoom, targetZoom: initial.zoom, dragging: false, lastX: 0, lastY: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const preset = VIEWS[view];
    orbit.current.targetPitch = preset.pitch;
    orbit.current.targetYaw = preset.yaw;
    orbit.current.targetZoom = preset.zoom;
  }, [view]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    orbit.current.dragging = true;
    orbit.current.lastX = event.clientX;
    orbit.current.lastY = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!orbit.current.dragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - orbit.current.lastX) / rect.width;
    const dy = (event.clientY - orbit.current.lastY) / rect.height;
    orbit.current.targetYaw += dx * 4.8;
    orbit.current.targetPitch = MathUtils.clamp(orbit.current.targetPitch + dy * 3.2, -0.28, 1.35);
    orbit.current.lastX = event.clientX;
    orbit.current.lastY = event.clientY;
  };

  const release = (event?: ReactPointerEvent<HTMLDivElement>) => {
    orbit.current.dragging = false;
    setDragging(false);
    if (event) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    orbit.current.targetZoom = MathUtils.clamp(orbit.current.targetZoom - event.deltaY * 0.0007, 0.72, 1.22);
  };

  return (
    <div className={`race-car-scene${dragging ? ' is-dragging' : ''}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={release} onPointerCancel={release} onPointerLeave={() => release()} onWheel={onWheel}>
      <SceneBoundary fallback={<div className="scene-fallback"><span>3D FALLBACK</span><strong>WEBGL SESSION UNAVAILABLE</strong></div>}>
        <Canvas dpr={[1, 1.65]} camera={{ position: [0, 0.45, 7.8], fov: 34 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <Scene mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} orbit={orbit} autoRotate={autoRotate} />
        </Canvas>
      </SceneBoundary>
      <div className="scene-reticle" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="scene-drag-hint" aria-hidden="true">DRAG TO ORBIT · WHEEL TO ZOOM</div>
    </div>
  );
}
