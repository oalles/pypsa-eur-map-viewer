import React from 'react';
import {useTranslation} from 'react-i18next';
import {Cable, Zap, CircleDot, ArrowUpDown, Repeat, Map, Flame} from 'lucide-react';
import useNetworkStore from '@/store/network';

interface LayerToggle {
    key: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    get: () => boolean;
    set: (v: boolean) => void;
}

export const LayerToggles: React.FC = () => {
    const {t} = useTranslation();
    const store = useNetworkStore();

    const layers: LayerToggle[] = [
        {key: 'ac', label: t('layers.acLines'), icon: <Cable size={14} />, color: 'bg-accent', get: () => store.showACLines, set: store.setShowACLines},
        {key: 'hvdc', label: t('layers.hvdcLinks'), icon: <Zap size={14} />, color: 'bg-hvdc', get: () => store.showHVDC, set: store.setShowHVDC},
        {key: 'bus', label: t('layers.buses'), icon: <CircleDot size={14} />, color: 'bg-text-secondary', get: () => store.showBuses, set: store.setShowBuses},
        {key: 'xfmr', label: t('layers.transformers'), icon: <ArrowUpDown size={14} />, color: 'bg-transformer', get: () => store.showTransformers, set: store.setShowTransformers},
        {key: 'conv', label: t('layers.converters'), icon: <Repeat size={14} />, color: 'bg-converter', get: () => store.showConverters, set: store.setShowConverters},
        {key: 'borders', label: t('layers.countryBorders'), icon: <Map size={14} />, color: 'bg-white/30', get: () => store.showCountryBorders, set: store.setShowCountryBorders},
        {key: 'heat', label: t('layers.heatmap'), icon: <Flame size={14} />, color: 'bg-orange-500', get: () => store.showHeatmap, set: store.setShowHeatmap},
    ];

    return (
        <div>
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                {t('layers.title')}
            </h3>
            <div className="space-y-1">
                {layers.map(layer => (
                    <button
                        key={layer.key}
                        onClick={() => layer.set(!layer.get())}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                            layer.get()
                                ? 'text-text-primary bg-white/5'
                                : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.02]'
                        }`}
                    >
                        <div className={`w-2 h-2 rounded-full transition-opacity ${layer.color} ${layer.get() ? 'opacity-100' : 'opacity-30'}`} />
                        <span className="flex items-center gap-1.5">
                            {layer.icon}
                            {layer.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
