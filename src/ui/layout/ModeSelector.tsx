import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Compass, Zap, Film, BarChart3, Gamepad2, ChevronDown} from 'lucide-react';
import {useMode, type AppMode} from '@/router';

const MODES: {mode: AppMode; icon: React.ReactNode; labelKey: string}[] = [
    {mode: 'explore', icon: <Compass size={14} />, labelKey: 'modes.explore'},
    {mode: 'simulate', icon: <Zap size={14} />, labelKey: 'modes.simulate'},
    {mode: 'scenarios', icon: <Film size={14} />, labelKey: 'modes.scenarios'},
    {mode: 'analytics', icon: <BarChart3 size={14} />, labelKey: 'modes.analytics'},
    {mode: 'game', icon: <Gamepad2 size={14} />, labelKey: 'modes.game'},
];

export const ModeSelector: React.FC = () => {
    const {t} = useTranslation();
    const {mode, setMode} = useMode();
    const [mobileOpen, setMobileOpen] = useState(false);

    const activeMode = MODES.find(m => m.mode === mode) || MODES[0];

    return (
        <>
            {/* Desktop: horizontal tabs */}
            <div className="hidden md:flex items-center gap-0.5 p-0.5 rounded-lg glass-subtle">
                {MODES.map(m => (
                    <button
                        key={m.mode}
                        onClick={() => setMode(m.mode)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                            mode === m.mode
                                ? 'bg-accent/15 text-accent shadow-[0_0_8px_rgba(56,189,248,0.2)]'
                                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.03]'
                        }`}
                        title={t(m.labelKey)}
                    >
                        {m.icon}
                        <span className="hidden lg:inline">{t(m.labelKey)}</span>
                    </button>
                ))}
            </div>

            {/* Mobile: dropdown */}
            <div className="relative md:hidden">
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg glass-subtle text-[11px] font-medium text-accent cursor-pointer"
                >
                    {activeMode.icon}
                    <span>{t(activeMode.labelKey)}</span>
                    <ChevronDown size={12} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileOpen && (
                    <div className="absolute top-full right-0 mt-1 glass rounded-lg overflow-hidden z-50 min-w-[140px]">
                        {MODES.map(m => (
                            <button
                                key={m.mode}
                                onClick={() => { setMode(m.mode); setMobileOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors ${
                                    mode === m.mode
                                        ? 'text-accent bg-accent/10'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                                }`}
                            >
                                {m.icon}
                                <span>{t(m.labelKey)}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
