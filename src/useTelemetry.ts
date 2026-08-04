import { useEffect, useMemo, useState } from 'react';

export type TelemetrySnapshot = {
  timestamp: number;
  lap: number;
  sector: 1 | 2 | 3;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number;
  brake: number;
  ers: number;
  lateralG: number;
  longitudinalG: number;
  steering: number;
  drs: boolean;
  tyreTemps: [number, number, number, number];
  brakeTemps: [number, number, number, number];
  fuel: number;
  delta: number;
};

const initial: TelemetrySnapshot = {
  timestamp: Date.now(),
  lap: 18,
  sector: 2,
  speed: 286,
  rpm: 11380,
  gear: 7,
  throttle: 91,
  brake: 0,
  ers: 76,
  lateralG: 2.8,
  longitudinalG: 0.7,
  steering: -4,
  drs: true,
  tyreTemps: [96, 98, 94, 95],
  brakeTemps: [742, 754, 638, 645],
  fuel: 63.8,
  delta: -0.184,
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function snapshotAt(t: number): TelemetrySnapshot {
  const lapPhase = (t * 0.13) % 1;
  const corner = Math.sin(t * 0.74) * 0.5 + Math.sin(t * 0.21) * 0.5;
  const brakingWave = Math.max(0, Math.sin(t * 0.62 + 1.7));
  const throttle = clamp(84 + Math.sin(t * 0.88) * 21 - brakingWave * 72, 0, 100);
  const brake = clamp(brakingWave * 95 - 18, 0, 100);
  const speed = clamp(255 + throttle * 0.72 - brake * 1.42 + Math.sin(t * 0.3) * 18, 74, 347);
  const gear = clamp(Math.round(speed / 43), 1, 8);
  const rpm = clamp(7200 + speed * 18 + Math.sin(t * 1.24) * 520, 6800, 12450);
  const sector = (lapPhase < 0.34 ? 1 : lapPhase < 0.68 ? 2 : 3) as 1 | 2 | 3;
  const tyreBase = 92 + Math.sin(t * 0.17) * 3.4 + throttle * 0.035;
  const brakeBase = 485 + brake * 4.9 + speed * 0.35;

  return {
    timestamp: Date.now(),
    lap: 18 + Math.floor(t / 62),
    sector,
    speed: Math.round(speed),
    rpm: Math.round(rpm),
    gear,
    throttle: Math.round(throttle),
    brake: Math.round(brake),
    ers: Math.round(clamp(76 + Math.sin(t * 0.12) * 14 - throttle * 0.05, 18, 100)),
    lateralG: Number((corner * 4.2).toFixed(1)),
    longitudinalG: Number(((throttle / 100) * 1.7 - (brake / 100) * 5.1).toFixed(1)),
    steering: Math.round(corner * 28),
    drs: throttle > 84 && brake < 6 && speed > 272,
    tyreTemps: [
      Math.round(tyreBase + corner * 3.4),
      Math.round(tyreBase - corner * 2.7 + 1),
      Math.round(tyreBase + corner * 2.2 - 2),
      Math.round(tyreBase - corner * 1.8 - 1),
    ],
    brakeTemps: [
      Math.round(brakeBase + corner * 28),
      Math.round(brakeBase - corner * 22 + 14),
      Math.round(brakeBase * 0.82 + corner * 18),
      Math.round(brakeBase * 0.84 - corner * 14),
    ],
    fuel: Number(clamp(63.8 - t * 0.014, 0, 110).toFixed(1)),
    delta: Number((-0.184 + Math.sin(t * 0.19) * 0.092 + brakingWave * 0.038).toFixed(3)),
  };
}

export function useTelemetry() {
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot>(initial);
  const [history, setHistory] = useState<TelemetrySnapshot[]>(() => Array.from({ length: 56 }, (_, index) => snapshotAt(index * 0.22)));

  useEffect(() => {
    const started = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = (performance.now() - started) / 1000 + 14;
      const next = snapshotAt(elapsed);
      setSnapshot(next);
      setHistory((current) => [...current.slice(-71), next]);
    }, 160);
    return () => window.clearInterval(interval);
  }, []);

  const health = useMemo(() => {
    const maxTyre = Math.max(...snapshot.tyreTemps);
    const maxBrake = Math.max(...snapshot.brakeTemps);
    return {
      tyres: maxTyre < 106 ? 'OPTIMAL' : maxTyre < 112 ? 'WATCH' : 'HOT',
      brakes: maxBrake < 920 ? 'NOMINAL' : maxBrake < 1010 ? 'WATCH' : 'CRITICAL',
      energy: snapshot.ers > 42 ? 'AVAILABLE' : 'RECOVER',
      latency: `${(2.8 + Math.abs(Math.sin(snapshot.timestamp / 3600)) * 1.4).toFixed(1)} ms`,
    };
  }, [snapshot]);

  return { snapshot, history, health };
}
