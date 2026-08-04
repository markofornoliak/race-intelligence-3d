import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { CarView, ComponentId, SceneMode } from './RaceCarScene';
import { systems } from './appData';
import { useTelemetry } from './useTelemetry';

export type Compound = 'SOFT' | 'MEDIUM' | 'HARD';

function useAppState() {
  const reduced = Boolean(useReducedMotion());
  const telemetry = useTelemetry();
  const [mode, setMode] = useState<SceneMode>('race');
  const [view, setView] = useState<CarView>('hero');
  const [selected, setSelected] = useState<ComponentId>('powerUnit');
  const [explode, setExplode] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [commandMode, setCommandMode] = useState(false);
  const [compound, setCompound] = useState<Compound>('MEDIUM');
  const [pitLap, setPitLap] = useState(27);

  const selectedSystem = systems[selected];
  const strategy = useMemo(() => {
    const compoundOffset = compound === 'SOFT' ? -0.42 : compound === 'HARD' ? 0.38 : 0;
    const target = 27 + compoundOffset * 5;
    const windowDistance = Math.abs(pitLap - target);
    return {
      projectedDelta: Number((-2.84 + windowDistance * 0.19 + compoundOffset).toFixed(2)),
      confidence: Math.round(Math.max(61, 96 - windowDistance * 5.2 - Math.abs(compoundOffset) * 12)),
      risk: windowDistance < 2 ? 'CONTROLLED' : windowDistance < 5 ? 'ELEVATED' : 'HIGH',
      stintLife: compound === 'SOFT' ? 19 : compound === 'MEDIUM' ? 31 : 44,
    } as const;
  }, [compound, pitLap]);

  useEffect(() => {
    const syncFullscreen = () => setCommandMode(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      const key = event.key.toLowerCase();
      if (key === '1') setMode('race');
      if (key === '2') setMode('engineering');
      if (key === '3') setMode('thermal');
      if (key === 'h') setView('hero');
      if (key === 'f') setView('front');
      if (key === 's') setView('side');
      if (key === 'r') setView('rear');
      if (key === 't') setView('top');
      if (key === 'e') setExplode((value) => value > 0 ? 0 : 1);
      if (event.code === 'Space') { event.preventDefault(); setAutoRotate((value) => !value); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleCommandMode = async () => {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen().catch(() => undefined);
      setCommandMode(true);
    } else if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen().catch(() => undefined);
      setCommandMode(false);
    } else setCommandMode((value) => !value);
  };

  return { reduced, ...telemetry, mode, setMode, view, setView, selected, setSelected, explode, setExplode, autoRotate, setAutoRotate, commandMode, compound, setCompound, pitLap, setPitLap, selectedSystem, strategy, toggleCommandMode };
}

export type AppContextValue = ReturnType<typeof useAppState>;
const Context = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  return <Context.Provider value={useAppState()}>{children}</Context.Provider>;
}

export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('useApp must be used within AppProvider');
  return value;
}
