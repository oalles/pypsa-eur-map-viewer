import React, {lazy, Suspense} from 'react';
import {useMode, type AppMode} from './index';

const SimulatePanel = lazy(() =>
    import('@/simulate/SimulatePanel').then(m => ({default: m.SimulatePanel}))
);

function ModePlaceholder({mode}: {mode: AppMode}) {
    return (
        <div className="absolute top-18 right-3 z-20 w-72 glass p-4 animate-slide-in-right">
            <p className="text-xs text-text-muted text-center capitalize">
                {mode} mode — coming soon
            </p>
        </div>
    );
}

export const ModeRouter: React.FC = () => {
    const {mode} = useMode();

    return (
        <Suspense fallback={null}>
            {mode === 'explore' && null /* explore is the default, uses existing Sidebar + DetailPanel */}
            {mode === 'simulate' && <SimulatePanel />}
            {mode === 'scenarios' && <ModePlaceholder mode="scenarios" />}
            {mode === 'analytics' && <ModePlaceholder mode="analytics" />}
            {mode === 'game' && <ModePlaceholder mode="game" />}
        </Suspense>
    );
};
