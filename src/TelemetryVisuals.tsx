import { useMemo } from 'react';
import type { TelemetrySnapshot } from './useTelemetry';

function pathFor(values: number[], width = 1000, height = 280) {
  if (!values.length) return '';
  const min = Math.min(...values); const max = Math.max(...values); const spread = Math.max(1, max - min);
  return values.map((value, index) => `${index === 0 ? 'M' : 'L'}${((index / Math.max(1, values.length - 1)) * width).toFixed(2)},${(height - ((value - min) / spread) * height).toFixed(2)}`).join(' ');
}

export function TelemetryPlot({ history }: { history: TelemetrySnapshot[] }) {
  const speedPath = useMemo(() => pathFor(history.map((item) => item.speed)), [history]);
  const throttlePath = useMemo(() => pathFor(history.map((item) => item.throttle)), [history]);
  const brakePath = useMemo(() => pathFor(history.map((item) => item.brake)), [history]);
  return <div className="telemetry-plot"><div className="plot-grid" aria-hidden="true" /><svg viewBox="0 0 1000 280" role="img" aria-label="Live speed, throttle, and brake telemetry"><defs><linearGradient id="speedLine" x1="0" x2="1"><stop stopColor="#167dff" /><stop offset="1" stopColor="#b8eaff" /></linearGradient><linearGradient id="speedFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#168dff" stopOpacity=".3" /><stop offset="1" stopColor="#168dff" stopOpacity="0" /></linearGradient></defs><path className="plot-area" d={`${speedPath} L1000,280 L0,280 Z`} /><path className="plot-line plot-line--speed" d={speedPath} /><path className="plot-line plot-line--throttle" d={throttlePath} /><path className="plot-line plot-line--brake" d={brakePath} /></svg><div className="plot-legend"><span><i className="speed" /> SPEED</span><span><i className="throttle" /> THROTTLE</span><span><i className="brake" /> BRAKE</span></div><div className="plot-axis plot-axis--y"><span>MAX</span><span>MID</span><span>MIN</span></div><div className="plot-axis plot-axis--x"><span>-11.5 S</span><span>-5.8 S</span><span>LIVE</span></div></div>;
}

export function TrackMap({ sector, delta }: { sector: number; delta: number }) {
  const path = 'M97 231C52 169 90 71 183 62c76-7 86 63 151 55 61-7 76-83 151-65 78 18 89 111 35 157-43 37-111 20-142 58-32 39-9 100-79 102-81 2-71-76-125-87-27-6-53-11-77-51Z';
  return <div className="track-map"><svg viewBox="0 0 640 360" aria-label="Track position visualization"><path className="track-shadow" d={path} /><path className="track-line" pathLength="100" d={path} /><path className="track-progress" pathLength="100" strokeDasharray={`${sector === 1 ? 29 : sector === 2 ? 63 : 92} 100`} d={path} /><circle className="track-car" cx={sector === 1 ? 190 : sector === 2 ? 450 : 244} cy={sector === 1 ? 64 : sector === 2 ? 111 : 300} r="7" /></svg><div className="track-map__status"><span>SECTOR {sector}</span><strong className={delta <= 0 ? 'is-positive' : 'is-negative'}>{delta > 0 ? '+' : ''}{delta.toFixed(3)} S</strong></div><div className="track-corners"><span>T04</span><span>T09</span><span>T14</span><span>T18</span></div></div>;
}

export function SignalTable({ snapshot }: { snapshot: TelemetrySnapshot }) {
  const channels = [['CH-018', 'STEERING ANGLE', `${snapshot.steering}°`, 96], ['CH-044', 'THROTTLE DEMAND', `${snapshot.throttle}%`, snapshot.throttle], ['CH-052', 'BRAKE PRESSURE', `${snapshot.brake}%`, snapshot.brake], ['CH-107', 'ERS DEPLOYMENT', `${snapshot.ers}%`, snapshot.ers], ['CH-201', 'LATERAL LOAD', `${snapshot.lateralG.toFixed(1)} G`, Math.min(100, Math.abs(snapshot.lateralG) * 22)], ['CH-312', 'DATA CONFIDENCE', '99.94%', 99.94]] as const;
  return <div className="signal-table"><div className="signal-table__head"><span>CHANNEL</span><span>SIGNAL</span><span>VALUE</span><span>LOAD</span></div>{channels.map(([channel, label, value, load]) => <div className="signal-row" key={channel}><span>{channel}</span><strong>{label}</strong><b>{value}</b><i><em style={{ width: `${load}%` }} /></i></div>)}</div>;
}
