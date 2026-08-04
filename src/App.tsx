import { AppProvider, useApp } from './AppContext';
import { FinalSection } from './sections/FinalSection';
import { Footer } from './sections/Footer';
import { Header } from './sections/Header';
import { HeroSection } from './sections/HeroSection';
import { InfrastructureSection } from './sections/InfrastructureSection';
import { StrategySection } from './sections/StrategySection';
import { SystemStrip } from './sections/SystemStrip';
import { TelemetrySection } from './sections/TelemetrySection';
import { TwinSection } from './sections/TwinSection';

function Experience(){const{mode,commandMode}=useApp();return <div className={`app mode-${mode}${commandMode?' command-mode':''}`}><Header/><main><HeroSection/><SystemStrip/><TelemetrySection/><TwinSection/><StrategySection/><InfrastructureSection/><FinalSection/></main><Footer/></div>}
export default function App(){return <AppProvider><Experience/></AppProvider>}
