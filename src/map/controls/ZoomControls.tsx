import React from 'react';
import {Plus, Minus, RotateCcw} from 'lucide-react';
import useNetworkStore from '@/store/network';

export const ZoomControls: React.FC = () => {
    const flyTo = useNetworkStore(s => s.flyTo);
    const viewState = useNetworkStore(s => s.viewState);

    const zoomIn = () => flyTo(viewState.longitude, viewState.latitude, Math.min(14, viewState.zoom + 1));
    const zoomOut = () => flyTo(viewState.longitude, viewState.latitude, Math.max(3, viewState.zoom - 1));
    const resetView = () => {
        useNetworkStore.setState(s => ({
            viewState: {longitude: 10, latitude: 50, zoom: 4.5, pitch: 0, bearing: 0},
            viewStateVersion: s.viewStateVersion + 1,
        }));
    };

    return (
        <div className="absolute bottom-20 right-3 z-20 flex flex-col gap-1">
            {[
                {icon: <Plus size={16} />, action: zoomIn, label: 'Zoom In'},
                {icon: <Minus size={16} />, action: zoomOut, label: 'Zoom Out'},
                {icon: <RotateCcw size={14} />, action: resetView, label: 'Reset'},
            ].map(btn => (
                <button
                    key={btn.label}
                    onClick={btn.action}
                    title={btn.label}
                    className="glass w-9 h-9 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};
