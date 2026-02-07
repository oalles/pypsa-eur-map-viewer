import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import useNetworkStore from '@/store/network';

export const VoltageFilter: React.FC = () => {
    const {t} = useTranslation();
    const voltage = useNetworkStore(s => s.voltage);
    const setVoltage = useNetworkStore(s => s.setVoltage);

    const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val < voltage[1]) setVoltage([val, voltage[1]]);
    }, [voltage, setVoltage]);

    const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if (val > voltage[0]) setVoltage([voltage[0], val]);
    }, [voltage, setVoltage]);

    const pctMin = ((voltage[0] - 50) / 700) * 100;
    const pctMax = ((voltage[1] - 50) / 700) * 100;

    return (
        <div>
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                {t('filters.voltage')}
            </h3>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-accent">{voltage[0]} {t('filters.voltageUnit')}</span>
                <span className="text-xs font-mono text-accent">{voltage[1]} {t('filters.voltageUnit')}</span>
            </div>
            <div className="relative h-6">
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 rounded-full bg-white/10">
                    <div
                        className="absolute h-full rounded-full bg-accent/40"
                        style={{left: `${pctMin}%`, right: `${100 - pctMax}%`}}
                    />
                </div>
                <input
                    type="range"
                    min={50}
                    max={750}
                    step={10}
                    value={voltage[0]}
                    onChange={handleMinChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{zIndex: 2}}
                />
                <input
                    type="range"
                    min={50}
                    max={750}
                    step={10}
                    value={voltage[1]}
                    onChange={handleMaxChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    style={{zIndex: 3}}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-surface pointer-events-none"
                    style={{left: `calc(${pctMin}% - 6px)`}}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-surface pointer-events-none"
                    style={{left: `calc(${pctMax}% - 6px)`}}
                />
            </div>
        </div>
    );
};
