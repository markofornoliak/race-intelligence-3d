import { useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, MathUtils, Vector3 } from 'three';
import type { TelemetrySnapshot } from '../useTelemetry';
import type { ComponentId, SceneMode } from './types';
import { FillMaterial, WireMaterial } from './Materials';

export function Part({
  id,
  selected,
  mode,
  explode,
  explodeVector = [0, 0, 0],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
  onSelect,
}: {
  id: ComponentId;
  selected: ComponentId;
  mode: SceneMode;
  explode: number;
  explodeVector?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  children: ReactNode;
  onSelect: (id: ComponentId) => void;
}) {
  const offset: [number, number, number] = [
    position[0] + explodeVector[0] * explode,
    position[1] + explodeVector[1] * explode,
    position[2] + explodeVector[2] * explode,
  ];
  return (
    <group
      position={offset}
      rotation={rotation}
      onClick={(event: any) => { event.stopPropagation(); onSelect(id); }}
      onPointerOver={(event: any) => { event.stopPropagation(); document.body.classList.add('is-3d-hover'); }}
      onPointerOut={() => document.body.classList.remove('is-3d-hover')}
    >
      {children}
    </group>
  );
}

export function BoxPart({ size, mode, active, accent = '#2da9ff', opacity = 0.84 }: { size: [number, number, number]; mode: SceneMode; active: boolean; accent?: string; opacity?: number }) {
  return (
    <>
      <mesh><boxGeometry args={size} /><FillMaterial mode={mode} selected={active} accent={accent} opacity={opacity} /></mesh>
      <mesh scale={1.006}><boxGeometry args={size} /><WireMaterial mode={mode} selected={active} accent={accent} /></mesh>
    </>
  );
}

export function CylinderPart({ radiusTop, radiusBottom, height, mode, active, rotation = [0, 0, 0], accent = '#2da9ff', opacity = 0.84, segments = 24 }: { radiusTop: number; radiusBottom: number; height: number; mode: SceneMode; active: boolean; rotation?: [number, number, number]; accent?: string; opacity?: number; segments?: number }) {
  return (
    <group rotation={rotation}>
      <mesh><cylinderGeometry args={[radiusTop, radiusBottom, height, segments]} /><FillMaterial mode={mode} selected={active} accent={accent} opacity={opacity} /></mesh>
      <mesh scale={1.006}><cylinderGeometry args={[radiusTop, radiusBottom, height, segments]} /><WireMaterial mode={mode} selected={active} accent={accent} /></mesh>
    </group>
  );
}

export function TorusPart({ radius, tube, mode, active, rotation = [0, 0, 0], accent = '#2da9ff', opacity = 0.8 }: { radius: number; tube: number; mode: SceneMode; active: boolean; rotation?: [number, number, number]; accent?: string; opacity?: number }) {
  return (
    <group rotation={rotation}>
      <mesh><torusGeometry args={[radius, tube, 18, 64]} /><FillMaterial mode={mode} selected={active} accent={accent} opacity={opacity} /></mesh>
      <mesh scale={1.006}><torusGeometry args={[radius, tube, 18, 64]} /><WireMaterial mode={mode} selected={active} accent={accent} /></mesh>
    </group>
  );
}

export function Rod({ start, end, mode, active, accent = '#86d9ff' }: { start: [number, number, number]; end: [number, number, number]; mode: SceneMode; active: boolean; accent?: string }) {
  const geometry = useMemo(() => {
    const from = new Vector3(...start);
    const to = new Vector3(...end);
    const direction = to.clone().sub(from);
    const midpoint = from.clone().add(to).multiplyScalar(0.5);
    const length = direction.length();
    const yaw = Math.atan2(direction.x, direction.z);
    const pitch = Math.atan2(Math.sqrt(direction.x ** 2 + direction.z ** 2), direction.y);
    return { position: [midpoint.x, midpoint.y, midpoint.z] as [number, number, number], rotation: [0, yaw, pitch] as [number, number, number], length };
  }, [start, end]);
  return (
    <group position={geometry.position} rotation={geometry.rotation}>
      <CylinderPart radiusTop={0.018} radiusBottom={0.018} height={geometry.length} mode={mode} active={active} accent={accent} segments={10} />
    </group>
  );
}

export function Wheel({
  x,
  z,
  mode,
  selected,
  explode,
  telemetry,
  onSelect,
}: {
  x: number;
  z: number;
  mode: SceneMode;
  selected: ComponentId;
  explode: number;
  telemetry: TelemetrySnapshot;
  onSelect: (id: ComponentId) => void;
}) {
  const wheel = useRef<any>(null);
  const outer = z > 0 ? 1 : -1;
  useFrame((state, delta) => {
    if (!wheel.current) return;
    wheel.current.rotation.z -= delta * (0.65 + telemetry.speed / 85);
    wheel.current.rotation.y = MathUtils.lerp(wheel.current.rotation.y, x > 0 ? telemetry.steering * 0.004 : 0, 0.08);
  });
  const tyreActive = selected === 'tyres';
  const brakeActive = selected === 'brakes';
  const tyreAccent = mode === 'thermal' ? (telemetry.tyreTemps[z > 0 ? (x > 0 ? 0 : 2) : (x > 0 ? 1 : 3)] > 101 ? '#ff4b21' : '#16c8ff') : '#65caff';
  return (
    <group ref={wheel} position={[x + (x > 0 ? 0.22 : -0.22) * explode, -0.43, z + outer * 0.55 * explode]}>
      <group onClick={(event: any) => { event.stopPropagation(); onSelect('tyres'); }}>
        <TorusPart radius={0.43} tube={0.145} mode={mode} active={tyreActive} rotation={[0, 0, 0]} accent={tyreAccent} opacity={0.92} />
        <TorusPart radius={0.25} tube={0.035} mode={mode} active={tyreActive} rotation={[0, 0, 0]} accent="#bdeaff" opacity={0.68} />
      </group>
      <group onClick={(event: any) => { event.stopPropagation(); onSelect('brakes'); }}>
        <CylinderPart radiusTop={0.19} radiusBottom={0.19} height={0.038} mode={mode} active={brakeActive} rotation={[Math.PI / 2, 0, 0]} accent={mode === 'thermal' ? '#ff5b18' : '#ff3b43'} opacity={0.9} segments={32} />
        <mesh position={[0.02, 0.12, outer * 0.035]}><boxGeometry args={[0.08, 0.17, 0.07]} /><meshBasicMaterial color="#ff3c46" /></mesh>
      </group>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return <Rod key={index} start={[0, 0, 0]} end={[Math.cos(angle) * 0.19, Math.sin(angle) * 0.19, 0]} mode={mode} active={tyreActive} />;
      })}
    </group>
  );
}

export function AeroStream({ index, telemetry }: { index: number; telemetry: TelemetrySnapshot }) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const phase = (state.clock.elapsedTime * (0.45 + telemetry.speed / 600) + index * 0.21) % 1;
    ref.current.position.x = MathUtils.lerp(3.2, -3.0, phase);
    ref.current.position.z = (index - 6) * 0.16 + Math.sin(state.clock.elapsedTime + index) * 0.045;
    const material = ref.current.material as any;
    material.opacity = Math.sin(phase * Math.PI) * 0.34;
  });
  return (
    <mesh ref={ref} position={[3, 0.04 + (index % 3) * 0.09, (index - 6) * 0.16]}>
      <sphereGeometry args={[0.026, 8, 8]} />
      <meshBasicMaterial color="#86dbff" transparent opacity={0.25} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

export function TelemetryOrbit({ telemetry, mode }: { telemetry: TelemetrySnapshot; mode: SceneMode }) {
  const group = useRef<any>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = state.clock.elapsedTime * 0.035;
  });
  const color = mode === 'thermal' ? '#ff5428' : '#319dff';
  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.78, 0]}><ringGeometry args={[2.25, 2.265, 160]} /><meshBasicMaterial color={color} transparent opacity={0.12} blending={AdditiveBlending} /></mesh>
      <mesh rotation={[0.18, 0.1, -0.16]}><ringGeometry args={[3.15, 3.158, 190]} /><meshBasicMaterial color="#78d1ff" transparent opacity={0.08 + telemetry.throttle / 1400} blending={AdditiveBlending} /></mesh>
      <mesh rotation={[-0.1, 0.18, 0.23]}><ringGeometry args={[2.75, 2.756, 180]} /><meshBasicMaterial color={color} transparent opacity={0.1} blending={AdditiveBlending} /></mesh>
    </group>
  );
}
