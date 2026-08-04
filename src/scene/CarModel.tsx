import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import type { TelemetrySnapshot } from '../useTelemetry';
import type { ComponentId, OrbitRef, SceneMode } from './types';
import { FillMaterial, WireMaterial } from './Materials';
import { AeroStream, BoxPart, CylinderPart, Part, Rod, TorusPart, Wheel } from './Primitives';

export function CarModel({ mode, selected, explode, telemetry, onSelect, orbit, autoRotate }: { mode: SceneMode; selected: ComponentId; explode: number; telemetry: TelemetrySnapshot; onSelect: (id: ComponentId) => void; orbit: OrbitRef; autoRotate: boolean }) {
  const root = useRef<any>(null);
  useFrame((state, delta) => {
    if (!root.current) return;
    if (autoRotate && !orbit.current.dragging) orbit.current.targetYaw += delta * 0.13;
    orbit.current.pitch = MathUtils.lerp(orbit.current.pitch, orbit.current.targetPitch, 1 - Math.pow(0.002, delta));
    orbit.current.yaw = MathUtils.lerp(orbit.current.yaw, orbit.current.targetYaw, 1 - Math.pow(0.002, delta));
    orbit.current.zoom = MathUtils.lerp(orbit.current.zoom, orbit.current.targetZoom, 1 - Math.pow(0.002, delta));
    root.current.rotation.x = orbit.current.pitch;
    root.current.rotation.y = orbit.current.yaw;
    root.current.scale.setScalar(orbit.current.zoom);
    root.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045;
  });

  return (
    <group ref={root} scale={0.98} onClick={() => onSelect('powerUnit')}>
      <Part id="floor" selected={selected} mode={mode} explode={explode} explodeVector={[0, -0.55, 0]} onSelect={onSelect}>
        <BoxPart size={[3.55, 0.055, 1.04]} mode={mode} active={selected === 'floor'} accent="#178cff" opacity={0.72} />
        <group position={[-1.35, -0.11, 0]}>
          {[-0.42, -0.21, 0, 0.21, 0.42].map((z) => <mesh key={z} position={[0, 0, z]} rotation={[0, 0, -0.16]}><boxGeometry args={[0.75, 0.025, 0.055]} /><meshBasicMaterial color="#53bfff" transparent opacity={0.58} /></mesh>)}
        </group>
      </Part>

      <Part id="powerUnit" selected={selected} mode={mode} explode={explode} explodeVector={[-0.35, 0.36, 0]} position={[-0.3, 0.02, 0]} onSelect={onSelect}>
        <BoxPart size={[1.95, 0.47, 0.68]} mode={mode} active={selected === 'powerUnit'} accent="#2c9fff" opacity={0.88} />
        <group position={[-0.65, 0.24, 0]}>
          <mesh scale={[0.76, 0.44, 0.72]}><sphereGeometry args={[0.52, 24, 18]} /><FillMaterial mode={mode} selected={selected === 'powerUnit'} accent="#51baff" opacity={0.85} /></mesh>
          <mesh scale={[0.766, 0.446, 0.726]}><sphereGeometry args={[0.52, 18, 12]} /><WireMaterial mode={mode} selected={selected === 'powerUnit'} accent="#9de2ff" /></mesh>
        </group>
        <group position={[0.76, 0.04, 0]} rotation={[0, 0, Math.PI / 2]}>
          <CylinderPart radiusTop={0.2} radiusBottom={0.1} height={1.72} mode={mode} active={selected === 'powerUnit'} accent="#218dff" opacity={0.84} />
        </group>
      </Part>

      <Part id="frontWing" selected={selected} mode={mode} explode={explode} explodeVector={[0.9, 0.1, 0]} position={[2.24, -0.2, 0]} onSelect={onSelect}>
        <BoxPart size={[0.42, 0.09, 1.92]} mode={mode} active={selected === 'frontWing'} accent="#5dc8ff" opacity={0.8} />
        <group position={[0.1, 0.18, 0]}><BoxPart size={[0.24, 0.06, 1.5]} mode={mode} active={selected === 'frontWing'} accent="#7ad6ff" opacity={0.72} /></group>
        <group position={[-0.16, 0.04, 0.78]}><BoxPart size={[0.18, 0.48, 0.055]} mode={mode} active={selected === 'frontWing'} accent="#5dc8ff" opacity={0.84} /></group>
        <group position={[-0.16, 0.04, -0.78]}><BoxPart size={[0.18, 0.48, 0.055]} mode={mode} active={selected === 'frontWing'} accent="#5dc8ff" opacity={0.84} /></group>
      </Part>

      <Part id="rearWing" selected={selected} mode={mode} explode={explode} explodeVector={[-0.82, 0.34, 0]} position={[-2.05, 0.62, 0]} onSelect={onSelect}>
        <BoxPart size={[0.34, 0.08, 1.62]} mode={mode} active={selected === 'rearWing'} accent="#61c7ff" opacity={0.85} />
        <group position={[-0.12, 0.22, 0]}><BoxPart size={[0.24, 0.055, 1.28]} mode={mode} active={selected === 'rearWing'} accent="#91deff" opacity={0.78} /></group>
        <group position={[0.04, -0.38, 0.23]}><BoxPart size={[0.08, 0.78, 0.08]} mode={mode} active={selected === 'rearWing'} accent="#61c7ff" opacity={0.84} /></group>
        <group position={[0.04, -0.38, -0.23]}><BoxPart size={[0.08, 0.78, 0.08]} mode={mode} active={selected === 'rearWing'} accent="#61c7ff" opacity={0.84} /></group>
      </Part>

      <Part id="frontSuspension" selected={selected} mode={mode} explode={explode} explodeVector={[0.4, 0.15, 0]} onSelect={onSelect}>
        <Rod start={[0.9, -0.06, 0.28]} end={[1.28, -0.34, 0.84]} mode={mode} active={selected === 'frontSuspension'} />
        <Rod start={[0.9, -0.06, -0.28]} end={[1.28, -0.34, -0.84]} mode={mode} active={selected === 'frontSuspension'} />
        <Rod start={[0.73, 0.16, 0.2]} end={[1.22, -0.09, 0.86]} mode={mode} active={selected === 'frontSuspension'} />
        <Rod start={[0.73, 0.16, -0.2]} end={[1.22, -0.09, -0.86]} mode={mode} active={selected === 'frontSuspension'} />
        <Rod start={[-1.1, -0.02, 0.28]} end={[-1.47, -0.34, 0.84]} mode={mode} active={selected === 'frontSuspension'} />
        <Rod start={[-1.1, -0.02, -0.28]} end={[-1.47, -0.34, -0.84]} mode={mode} active={selected === 'frontSuspension'} />
      </Part>

      <group position={[-0.42, 0.52, 0]}>
        <TorusPart radius={0.23} tube={0.021} mode={mode} active={selected === 'powerUnit'} rotation={[0, 0, 0.3]} accent="#c8efff" opacity={0.82} />
        <group position={[0.18, -0.17, 0]}><CylinderPart radiusTop={0.016} radiusBottom={0.016} height={0.36} mode={mode} active={selected === 'powerUnit'} accent="#c8efff" opacity={0.85} /></group>
      </group>

      <Wheel x={1.28} z={0.96} mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} />
      <Wheel x={1.28} z={-0.96} mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} />
      <Wheel x={-1.5} z={0.96} mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} />
      <Wheel x={-1.5} z={-0.96} mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} />

      {mode !== 'race' ? Array.from({ length: 13 }, (_, index) => <AeroStream key={index} index={index} telemetry={telemetry} />) : null}
    </group>
  );
}
