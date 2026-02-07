import React from 'react';
import {useTranslation} from 'react-i18next';
import {PropertyRow} from './PropertyRow';
import type {LinkProperties} from '@/types';
import {formatNumber} from '@/lib/utils';
import useNetworkStore from '@/store/network';

export const LinkDetail: React.FC<{properties: LinkProperties}> = ({properties: p}) => {
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
            {p.voltage > 0 && <PropertyRow label={t('detail.voltage')} value={`${formatNumber(p.voltage)} kV DC`} color="#00e5ff" />}
            <PropertyRow label={t('detail.power')} value={`${formatNumber(p.p_nom)} MW`} />
            {p.length > 0 && <PropertyRow label={t('detail.length')} value={`${formatNumber(p.length / 1000, 1)} km`} />}
            {p.efficiency > 0 && <PropertyRow label={t('detail.efficiency')} value={`${(p.efficiency * 100).toFixed(1)}%`} />}
            <PropertyRow label={t('detail.underground')} value={p.underground ? t('detail.yes') : t('detail.no')} />
            <PropertyRow label={t('detail.underConstruction')} value={p.under_construction ? t('detail.yes') : t('detail.no')} />

            <div className="pt-2 mt-2 border-t border-glass-border">
                <h4 className="text-[11px] text-text-muted mb-1">{t('detail.connectedBuses')}</h4>
                {[p.bus0, p.bus1].filter(Boolean).map(busId => (
                    <button
                        key={busId}
                        onClick={() => navigateToBus(busId)}
                        className="block w-full text-left px-2 py-1 text-xs font-mono text-hvdc hover:bg-hvdc/5 rounded cursor-pointer transition-colors"
                    >
                        {busId}
                    </button>
                ))}
            </div>
        </div>
    );
};
