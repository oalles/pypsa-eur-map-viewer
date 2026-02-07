import React from 'react';
import {useTranslation} from 'react-i18next';
import {PropertyRow} from './PropertyRow';
import type {LineProperties} from '@/types';
import {formatNumber} from '@/lib/utils';
import useNetworkStore from '@/store/network';

export const LineDetail: React.FC<{properties: LineProperties}> = ({properties: p}) => {
    const {t} = useTranslation();
    const flyTo = useNetworkStore(s => s.flyTo);
    const dataset = useNetworkStore(s => s.dataset);

    const navigateToBus = (busId: string) => {
        const bus = dataset.buses?.features.find(f => f.properties.bus_id === busId);
        if (bus) {
            flyTo(bus.geometry.coordinates[0], bus.geometry.coordinates[1], 8);
        }
    };

    return (
        <div className="space-y-0.5">
            <PropertyRow label={t('detail.voltage')} value={`${formatNumber(p.voltage_nom)} kV`} />
            <PropertyRow label={t('detail.capacity')} value={`${formatNumber(p.s_nom)} MVA`} />
            {p.i_nom > 0 && <PropertyRow label={t('detail.current')} value={`${formatNumber(p.i_nom, 2)} kA`} />}
            {p.circuits > 0 && <PropertyRow label={t('detail.circuits')} value={p.circuits} />}
            <PropertyRow label={t('detail.length')} value={`${formatNumber(p.length / 1000, 1)} km`} />
            {p.r > 0 && <PropertyRow label={t('detail.resistance')} value={`${p.r.toFixed(4)} Ω`} />}
            {p.x > 0 && <PropertyRow label={t('detail.reactance')} value={`${p.x.toFixed(4)} Ω`} />}
            {p.b > 0 && <PropertyRow label={t('detail.susceptance')} value={`${p.b.toExponential(3)} S`} />}
            <PropertyRow label={t('detail.underground')} value={p.underground ? t('detail.yes') : t('detail.no')} />
            <PropertyRow label={t('detail.underConstruction')} value={p.under_construction ? t('detail.yes') : t('detail.no')} />
            {p.type && <PropertyRow label={t('detail.type')} value={p.type} mono={false} />}

            <div className="pt-2 mt-2 border-t border-glass-border">
                <h4 className="text-[11px] text-text-muted mb-1">{t('detail.connectedBuses')}</h4>
                {[p.bus0, p.bus1].filter(Boolean).map(busId => (
                    <button
                        key={busId}
                        onClick={() => navigateToBus(busId)}
                        className="block w-full text-left px-2 py-1 text-xs font-mono text-accent hover:bg-accent/5 rounded cursor-pointer transition-colors"
                    >
                        {busId}
                    </button>
                ))}
            </div>
        </div>
    );
};
