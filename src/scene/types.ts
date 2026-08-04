import type { MutableRefObject } from 'react';
import type { TelemetrySnapshot } from '../useTelemetry';
export type SceneMode = 'race' | 'engineering' | 'thermal';
export type CarView = 'hero' | 'front' | 'side' | 'rear' | 'top';
export type ComponentId = 'frontWing' | 'frontSuspension' | 'brakes' | 'floor' | 'powerUnit' | 'rearWing' | 'tyres';

export type RaceCarSceneProps = {
  mode: SceneMode;
  view: CarView;
  selected: ComponentId;
  explode: number;
  autoRotate: boolean;
  telemetry: TelemetrySnapshot;
  onSelect: (component: ComponentId) => void;
};

export type OrbitState = {
  pitch: number;
  yaw: number;
  targetPitch: number;
  targetYaw: number;
  zoom: number;
  targetZoom: number;
  dragging: boolean;
  lastX: number;
  lastY: number;
};

export const VIEWS: Record<CarView, { pitch: number; yaw: number; zoom: number }> = {
  hero: { pitch: 0.23, yaw: -0.72, zoom: 1 },
  front: { pitch: 0.12, yaw: 1.56, zoom: 1.03 },
  side: { pitch: 0.12, yaw: 0, zoom: 0.98 },
  rear: { pitch: 0.12, yaw: -1.56, zoom: 1.03 },
  top: { pitch: 1.18, yaw: -0.4, zoom: 0.9 },
};

export type OrbitRef = MutableRefObject<OrbitState>;
