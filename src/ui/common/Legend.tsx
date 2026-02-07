import React from 'react';
import {useTranslation} from 'react-i18next';
import chroma from 'chroma-js';
import useNetworkStore from '@/store/network';

export const Legend: React.FC = () => {
    const {t} = useTranslation();
    const colorScheme = useNetworkStore(s => s.colorScheme);
    const scale = chroma.scale(colorScheme as any).domain([50, 750]);
    const stops = [50, 150, 300, 450, 600, 750];

    const gradientColors = Array.from({length: 20}, (_, i) => {
        const v = 50 + (i / 19) * 700;
        return scale(v).hex();
    });
    const gradient = `linear-gradient(to right, ${gradientColors.join(', ')})`;

    return (
        <div className="glass px-4 py-2.5 flex items-center gap-3 min-w-[320px]">
            <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
                {t('filters.voltage')}
            </span>
            <div className="flex-1 flex flex-col gap-1">
                <div className="h-2 rounded-full" style={{background: gradient}} />
                <div className="flex justify-between">
                    {stops.map(s => (
                        <span key={s} className="text-[10px] font-mono text-text-muted">{s}</span>
                    ))}
                </div>
            </div>
            <span className="text-[10px] text-text-muted">{t('filters.voltageUnit')}</span>
        </div>
    );
};
