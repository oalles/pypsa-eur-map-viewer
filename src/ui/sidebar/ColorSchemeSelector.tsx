import React from 'react';
import {useTranslation} from 'react-i18next';
import chroma from 'chroma-js';
import useNetworkStore from '@/store/network';
import {COLOR_SCHEMES} from '@/lib/constants';

export const ColorSchemeSelector: React.FC = () => {
    const {t} = useTranslation();
    const colorScheme = useNetworkStore(s => s.colorScheme);
    const setColorScheme = useNetworkStore(s => s.setColorScheme);

    return (
        <div>
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                {t('display.colorScheme')}
            </h3>
            <div className="space-y-1">
                {COLOR_SCHEMES.map(([scaleId, label]) => {
                    const scale = chroma.scale(scaleId as any).domain([0, 1]);
                    const gradient = Array.from({length: 10}, (_, i) => scale(i / 9).hex());
                    return (
                        <button
                            key={scaleId}
                            onClick={() => setColorScheme(scaleId)}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                                colorScheme === scaleId
                                    ? 'bg-white/5 text-text-primary'
                                    : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.02]'
                            }`}
                        >
                            <div
                                className="w-16 h-2.5 rounded-full shrink-0"
                                style={{background: `linear-gradient(to right, ${gradient.join(', ')})`}}
                            />
                            <span>{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
