import React from 'react';
import {useTranslation} from 'react-i18next';
import {PropertyRow} from './PropertyRow';
import type {TransformerProperties} from '@/types';
import {formatNumber} from '@/lib/utils';
import useNetworkStore from '@/store/network';

export const TransformerDetail: React.FC<{properties: TransformerProperties}> = ({properties: p}) => {
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
            <PropertyRow label="HV Side" value={`${formatNumber(p.voltage_bus1)} kV`} color="#ff8c00" />
            <PropertyRow label="LV Side" value={`${formatNumber(p.voltage_bus0)} kV`} />
            <PropertyRow label={t('detail.capacity')} value={`${formatNumber(p.s_nom)} MVA`} />

            <div className="pt-2 mt-2 border-t border-glass-border">
                <h4 className="text-[11px] text-text-muted mb-1">{t('detail.connectedBuses')}</h4>
                {[p.bus0, p.bus1].filter(Boolean).map(busId => (
                    <button
                        key={busId}
                        onClick={() => navigateToBus(busId)}
                        className="block w-full text-left px-2 py-1 text-xs font-mono text-transformer hover:bg-transformer/5 rounded cursor-pointer transition-colors"
                    >
                        {busId}
                    </button>
                ))}
            </div>
        </div>
    );
};
