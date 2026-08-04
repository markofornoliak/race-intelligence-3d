declare namespace React {
  type ReactNode = any;
  type MouseEvent<T = Element> = { target: EventTarget; currentTarget: T };
  type CSSProperties = Record<string, string | number | undefined>;
  type PropsWithChildren<T = unknown> = T & { children?: ReactNode; key?: string | number };
  type MutableRefObject<T> = { current: T };
  type PointerEvent<T = Element> = { clientX: number; clientY: number; pointerId: number; currentTarget: T };
  type WheelEvent<T = Element> = { deltaY: number; currentTarget: T };
}

declare module 'react' {
  export type ReactNode = any;
  export type MouseEvent<T = Element> = { target: EventTarget; currentTarget: T };
  export type CSSProperties = Record<string, string | number | undefined>;
  export type PropsWithChildren<T = unknown> = T & { children?: React.ReactNode; key?: string | number };
  export type MutableRefObject<T> = { current: T };
  export type PointerEvent<T = Element> = { clientX: number; clientY: number; pointerId: number; currentTarget: T };
  export type WheelEvent<T = Element> = { deltaY: number; currentTarget: T };
  export const StrictMode: any;
  export class Component<P = any, S = any> {
    props: P;
    state: S;
    constructor(props: P);
    setState(value: any): void;
  }
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useRef<T>(initial: T | null): { current: T | null };
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: readonly any[]): T;
  export type Context<T> = { Provider: any; __type?: T };
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;
}

declare module 'react/jsx-runtime' { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare namespace JSX { interface IntrinsicAttributes { key?: string | number } interface IntrinsicElements { [elementName: string]: any } }
declare module 'react-dom/client' { export function createRoot(element: Element | DocumentFragment): { render(node: any): void }; }

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export function useReducedMotion(): boolean;
}

declare module 'lucide-react' {
  export const Activity: any; export const ArrowDownRight: any; export const ArrowRight: any;
  export const CheckCircle2: any; export const FileText: any; export const Gauge: any;
  export const LockKeyhole: any; export const MonitorUp: any; export const Network: any;
  export const Orbit: any; export const Pause: any; export const Play: any; export const RadioTower: any;
  export const RotateCcw: any; export const ShieldCheck: any; export const Thermometer: any; export const Zap: any;
}

declare module '@react-three/fiber' {
  export const Canvas: any;
  export function useFrame(callback: (state: any, delta: number) => void): void;
}

declare module 'three' {
  export class ShaderMaterial { uniforms: Record<string, { value: any }> }
  export class Color { constructor(value: string) }
  export class Vector3 {
    x: number; y: number; z: number;
    constructor(x?: number, y?: number, z?: number);
    clone(): Vector3; add(v: Vector3): Vector3; multiplyScalar(value: number): Vector3; sub(v: Vector3): Vector3; length(): number;
  }
  export const MathUtils: { lerp(a: number, b: number, t: number): number; clamp(value: number, min: number, max: number): number };
  export const AdditiveBlending: any;
}

declare module '*.svg' { const src: string; export default src; }
