import React from 'react';
import {useTranslation} from 'react-i18next';
import useNetworkStore from '@/store/network';
import type {ConstructionFilter} from '@/types';

export const DisplaySettings: React.FC = () => {
    const {t} = useTranslation();
    const lineThicknessMode = useNetworkStore(s => s.lineThicknessMode);
    const setLineThicknessMode = useNetworkStore(s => s.setLineThicknessMode);
    const layerOpacity = useNetworkStore(s => s.layerOpacity);
    const setLayerOpacity = useNetworkStore(s => s.setLayerOpacity);
    const underConstructionFilter = useNetworkStore(s => s.underConstructionFilter);
    const setUnderConstructionFilter = useNetworkStore(s => s.setUnderConstructionFilter);

    const constructionOptions: {value: ConstructionFilter; label: string}[] = [
        {value: 'all', label: t('filters.constructionAll')},
        {value: 'operational', label: t('filters.constructionOperational')},
        {value: 'planned', label: t('filters.constructionPlanned')},
    ];

    return (
        <div className="space-y-3">
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                {t('display.title')}
            </h3>

            <div>
                <label className="text-[11px] text-text-secondary mb-1 block">
                    {t('display.lineThickness')}
                </label>
                <div className="flex gap-1">
                    <button
                        onClick={() => setLineThicknessMode('capacity')}
                        className={`flex-1 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                            lineThicknessMode === 'capacity'
                                ? 'bg-accent/15 text-accent'
                                : 'text-text-muted hover:text-text-secondary bg-white/[0.02]'
                        }`}
                    >
                        {t('display.thicknessCapacity')}
                    </button>
                    <button
                        onClick={() => setLineThicknessMode('uniform')}
                        className={`flex-1 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                            lineThicknessMode === 'uniform'
                                ? 'bg-accent/15 text-accent'
                                : 'text-text-muted hover:text-text-secondary bg-white/[0.02]'
                        }`}
                    >
                        {t('display.thicknessUniform')}
                    </button>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] text-text-secondary">
                        {t('display.opacity')}
                    </label>
                    <span className="text-[10px] font-mono text-text-muted">
                        {Math.round(layerOpacity * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min={30}
                    max={100}
                    value={Math.round(layerOpacity * 100)}
                    onChange={e => setLayerOpacity(Number(e.target.value) / 100)}
                    className="w-full h-1 rounded-full appearance-none bg-white/10 cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface"
                />
            </div>

            <div>
                <label className="text-[11px] text-text-secondary mb-1 block">
                    {t('filters.construction')}
                </label>
                <div className="flex gap-1">
                    {constructionOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setUnderConstructionFilter(opt.value)}
                            className={`flex-1 px-1 py-1 rounded-md text-[10px] transition-colors cursor-pointer ${
                                underConstructionFilter === opt.value
                                    ? 'bg-accent/15 text-accent'
                                    : 'text-text-muted hover:text-text-secondary bg-white/[0.02]'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
