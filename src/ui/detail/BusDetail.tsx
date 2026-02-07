import React from 'react';
import {useTranslation} from 'react-i18next';
import {PropertyRow} from './PropertyRow';
import type {BusProperties} from '@/types';
import {COUNTRY_FLAGS, COUNTRY_NAMES} from '@/lib/constants';
import {formatNumber} from '@/lib/utils';

export const BusDetail: React.FC<{properties: BusProperties}> = ({properties: p}) => {
    const {t} = useTranslation();
    return (
        <div className="space-y-0.5">
            <PropertyRow label={t('detail.voltage')} value={`${formatNumber(p.voltage)} kV`} />
            <PropertyRow label={t('detail.country')} value={`${COUNTRY_FLAGS[p.country] || ''} ${COUNTRY_NAMES[p.country] || p.country}`} mono={false} />
            <PropertyRow label={t('detail.symbol')} value={p.symbol || '—'} mono={false} />
            <PropertyRow label={t('detail.dc')} value={p.dc ? t('detail.yes') : t('detail.no')} />
            <PropertyRow label={t('detail.underConstruction')} value={p.under_construction ? t('detail.yes') : t('detail.no')} />
            <PropertyRow label={t('detail.coordinates')} value={`${p.y.toFixed(4)}, ${p.x.toFixed(4)}`} />
        </div>
    );
};
