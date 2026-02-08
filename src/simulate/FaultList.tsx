import React from 'react';
import {useTranslation} from 'react-i18next';
import {X, CircleDot, Cable} from 'lucide-react';
import useSimulationStore from '@/store/simulation';

export const FaultList: React.FC = () => {
    const {t} = useTranslation();
    const faults = useSimulationStore(s => s.faults);
    const removeFault = useSimulationStore(s => s.removeFault);

    if (faults.length === 0) {
        return (
            <div>
                <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                    {t('simulate.faults')}
                </h3>
                <p className="text-[11px] text-text-muted italic">
                    {t('simulate.clickToFault')}
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                    {t('simulate.faults')} ({faults.length})
                </h3>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
                {faults.map(fault => (
                    <div
                        key={fault.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md glass-subtle group"
                    >
                        {fault.faultType === 'bus'
                            ? <CircleDot size={12} className="text-red-400 shrink-0" />
                            : <Cable size={12} className="text-red-400 shrink-0" />
                        }
                        <span className={`text-[10px] px-1 py-0.5 rounded ${
                            fault.faultType === 'bus' ? 'bg-red-400/10 text-red-400' : 'bg-orange-400/10 text-orange-400'
                        }`}>
                            {fault.faultType === 'bus' ? t('simulate.bus') : t('simulate.edge')}
                        </span>
                        <span className="text-[11px] text-text-primary font-mono truncate flex-1">
                            {fault.label}
                        </span>
                        <button
                            onClick={() => removeFault(fault.id)}
                            className="p-0.5 rounded hover:bg-white/5 text-text-muted hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
