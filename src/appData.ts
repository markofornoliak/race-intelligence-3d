import type { CarView, ComponentId, SceneMode } from './RaceCarScene';

export type SystemDefinition = {
  index: string;
  title: string;
  eyebrow: string;
  description: string;
  primary: string;
  primaryLabel: string;
  secondary: string;
  secondaryLabel: string;
  status: string;
};

export const systems: Record<ComponentId, SystemDefinition> = {
  frontWing: { index: '01', title: 'Front wing', eyebrow: 'AERODYNAMIC LOAD', description: 'Controls front-axle load, rotation response and wake conditioning before the floor receives the flow.', primary: '1.84 kN', primaryLabel: 'FRONT LOAD', secondary: '98.7%', secondaryLabel: 'CORRELATION', status: 'MAP NOMINAL' },
  frontSuspension: { index: '02', title: 'Suspension', eyebrow: 'MECHANICAL PLATFORM', description: 'Maintains the aerodynamic platform while resolving kerb impact, steering load and tyre contact-patch control.', primary: '36.2 mm', primaryLabel: 'HEAVE WINDOW', secondary: '4.1 Hz', secondaryLabel: 'CONTROL RATE', status: 'STABLE' },
  brakes: { index: '03', title: 'Brake system', eyebrow: 'THERMAL CONTROL', description: 'Balances stopping performance, energy recovery and temperature distribution across all four corners.', primary: '918 °C', primaryLabel: 'PEAK DISC', secondary: '58.4 bar', secondaryLabel: 'LINE PRESSURE', status: 'WITHIN TARGET' },
  floor: { index: '04', title: 'Floor & diffuser', eyebrow: 'GROUND EFFECT', description: 'The primary downforce system. Ride height, edge sealing and diffuser expansion determine platform efficiency.', primary: '5.42 kN', primaryLabel: 'FLOOR LOAD', secondary: '3.7%', secondaryLabel: 'LOSS / YAW', status: 'HIGH CONFIDENCE' },
  powerUnit: { index: '05', title: 'Power unit', eyebrow: 'ENERGY CONVERSION', description: 'Coordinates combustion, electrical deployment and thermal limits to maximize lap-time delivery rather than peak output.', primary: '744 kW', primaryLabel: 'SYSTEM OUTPUT', secondary: '76%', secondaryLabel: 'ERS STATE', status: 'DEPLOYMENT READY' },
  rearWing: { index: '06', title: 'Rear wing', eyebrow: 'REAR STABILITY', description: 'Defines rear load, drag level and DRS effectiveness while protecting confidence through high-speed direction change.', primary: '2.16 kN', primaryLabel: 'REAR LOAD', secondary: '17.8%', secondaryLabel: 'DRS GAIN', status: 'BALANCED' },
  tyres: { index: '07', title: 'Tyres', eyebrow: 'CONTACT PATCH', description: 'The final performance interface. Temperature, pressure, slip and load history convert the entire car into usable grip.', primary: '97 °C', primaryLabel: 'MEAN TEMP', secondary: '0.06', secondaryLabel: 'SLIP RATIO', status: 'WINDOW ACTIVE' },
};

export const viewOptions: { id: CarView; label: string; shortcut: string }[] = [
  { id: 'hero', label: 'HERO', shortcut: 'H' }, { id: 'front', label: 'FRONT', shortcut: 'F' }, { id: 'side', label: 'SIDE', shortcut: 'S' }, { id: 'rear', label: 'REAR', shortcut: 'R' }, { id: 'top', label: 'TOP', shortcut: 'T' },
];

export const modeOptions: { id: SceneMode; label: string; description: string; shortcut: string }[] = [
  { id: 'race', label: 'RACE', description: 'Carbon surfaces · live operating state', shortcut: '1' },
  { id: 'engineering', label: 'ENGINEERING', description: 'X-ray mesh · aerodynamic traces', shortcut: '2' },
  { id: 'thermal', label: 'THERMAL', description: 'Heat distribution · brake and tyre load', shortcut: '3' },
];
