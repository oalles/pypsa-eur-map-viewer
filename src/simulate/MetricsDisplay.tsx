import React from 'react';
import {useTranslation} from 'react-i18next';
import useSimulationStore from '@/store/simulation';

export const MetricsDisplay: React.FC = () => {
    const {t} = useTranslation();
    const results = useSimulationStore(s => s.results);

    if (!results) return null;

    const {metrics} = results;

    return (
        <div>
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                {t('simulate.results')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <div className="glass-subtle rounded-lg p-2 text-center">
                    <div className="text-lg font-mono font-semibold text-text-primary">
                        {metrics.totalComponents}
                    </div>
                    <div className="text-[10px] text-text-muted">
                        {t('simulate.components')}
                    </div>
                </div>
                <div className="glass-subtle rounded-lg p-2 text-center">
                    <div className="text-lg font-mono font-semibold text-green-400">
                        {metrics.energizedComponents}
                    </div>
                    <div className="text-[10px] text-text-muted">
                        {t('simulate.energized')}
                    </div>
                </div>
                <div className="glass-subtle rounded-lg p-2 text-center">
                    <div className="text-lg font-mono font-semibold text-red-400">
                        {metrics.blackoutBuses}
                    </div>
                    <div className="text-[10px] text-text-muted">
                        {t('simulate.blackoutBuses')}
                    </div>
                </div>
                <div className="glass-subtle rounded-lg p-2 text-center">
                    <div className={`text-lg font-mono font-semibold ${
                        metrics.percentAffected > 50 ? 'text-red-400' :
                        metrics.percentAffected > 20 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                        {metrics.percentAffected}%
                    </div>
                    <div className="text-[10px] text-text-muted">
                        {t('simulate.affected')}
                    </div>
                </div>
            </div>
        </div>
    );
};
