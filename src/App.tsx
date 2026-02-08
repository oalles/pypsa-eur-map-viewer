import React, {lazy, Suspense} from 'react';
import {MapView} from './map/MapView';
import {useDataset} from './hooks/useDataset';
import {useKeyboardShortcuts} from './hooks/useKeyboardShortcuts';
import useNetworkStore from './store/network';
import {Header} from './ui/layout/Header';
import {Sidebar} from './ui/layout/Sidebar';
import {DetailPanel} from './ui/layout/DetailPanel';
import {Legend} from './ui/common/Legend';
import {LoadingOverlay} from './ui/common/LoadingOverlay';
import {ZoomControls} from './map/controls/ZoomControls';
import {SearchPalette} from './ui/common/SearchPalette';
import {ModeRouter} from './router/ModeRouter';
import {useMode} from './router';

const StatsOverlay = lazy(() =>
    import('./ui/stats/StatsOverlay').then(m => ({default: m.StatsOverlay}))
);

export const App: React.FC = () => {
    useDataset();
    useKeyboardShortcuts();
    const ready = useNetworkStore(s => s.ready);
    const {mode} = useMode();

    const isExploreMode = mode === 'explore';

    return (
        <div className="relative h-full w-full bg-surface">
            <MapView />

            {!ready && <LoadingOverlay />}

            {ready && (
                <>
                    <Header />

                    {/* Explore mode shows the original sidebar + detail panel */}
                    {isExploreMode && <Sidebar />}
                    {isExploreMode && <DetailPanel />}

                    {/* Mode-specific panels via router */}
                    <ModeRouter />

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
                        <Legend />
                    </div>

                    <ZoomControls />
                    <SearchPalette />

                    <Suspense fallback={null}>
                        <StatsOverlay />
                    </Suspense>
                </>
            )}
        </div>
    );
};
