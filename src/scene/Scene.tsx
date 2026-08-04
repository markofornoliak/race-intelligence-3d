import type { RaceCarSceneProps, OrbitRef } from './types';
import { CarModel } from './CarModel';
import { TelemetryOrbit } from './Primitives';

export function Scene({ mode, selected, explode, telemetry, onSelect, orbit, autoRotate }: Omit<RaceCarSceneProps, 'view'> & { orbit: OrbitRef }) {
  return (
    <>
      <ambientLight intensity={0.28} />
      <pointLight position={[4, 3, 4]} intensity={2.8} color="#a9e4ff" />
      <pointLight position={[-4, -1, -2]} intensity={1.6} color={mode === 'thermal' ? '#ff4e28' : '#095fff'} />
      <TelemetryOrbit telemetry={telemetry} mode={mode} />
      <CarModel mode={mode} selected={selected} explode={explode} telemetry={telemetry} onSelect={onSelect} orbit={orbit} autoRotate={autoRotate} />
      <gridHelper args={[16, 48, '#174f79', '#0a2236']} position={[0, -1.0, 0]} />
    </>
  );
}
