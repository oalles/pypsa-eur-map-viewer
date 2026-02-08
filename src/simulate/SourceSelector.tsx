import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {X, Globe, MousePointer} from 'lucide-react';
import useNetworkStore from '@/store/network';
import useSimulationStore from '@/store/simulation';
import {COUNTRY_FLAGS, COUNTRY_NAMES} from '@/lib/constants';

export const SourceSelector: React.FC = () => {
    const {t} = useTranslation();
    const dataset = useNetworkStore(s => s.dataset);
    const sourceMode = useSimulationStore(s => s.sourceMode);
    const sourceCountries = useSimulationStore(s => s.sourceCountries);
    const manualSources = useSimulationStore(s => s.manualSources);
    const setSourceMode = useSimulationStore(s => s.setSourceMode);
    const toggleSourceCountry = useSimulationStore(s => s.toggleSourceCountry);
    const removeManualSource = useSimulationStore(s => s.removeManualSource);

    const [search, setSearch] = useState('');
    const [showCountries, setShowCountries] = useState(false);

    const availableCountries = useMemo(() => {
        if (!dataset.buses) return [];
        const set = new Set<string>();
        for (const f of dataset.buses.features) {
            if (f.properties.country) set.add(f.properties.country);
        }
        return Array.from(set).sort();
    }, [dataset]);

    const filteredCountries = useMemo(() => {
        if (!search) return availableCountries;
        const q = search.toLowerCase();
        return availableCountries.filter(c =>
            c.toLowerCase().includes(q) ||
            (COUNTRY_NAMES[c] || '').toLowerCase().includes(q)
        );
    }, [availableCountries, search]);

    return (
        <div>
            <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2">
                {t('simulate.sources')}
            </h3>

            {/* Mode toggle */}
            <div className="flex gap-1 mb-2">
                <button
                    onClick={() => setSourceMode('country')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        sourceMode === 'country'
                            ? 'bg-accent/15 text-accent'
                            : 'text-text-muted hover:text-text-secondary glass-subtle'
                    }`}
                >
                    <Globe size={12} />
                    {t('simulate.sourceCountry')}
                </button>
                <button
                    onClick={() => setSourceMode('manual')}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        sourceMode === 'manual'
                            ? 'bg-accent/15 text-accent'
                            : 'text-text-muted hover:text-text-secondary glass-subtle'
                    }`}
                >
                    <MousePointer size={12} />
                    {t('simulate.sourceManual')}
                </button>
            </div>

            {/* Country mode */}
            {sourceMode === 'country' && (
                <div>
                    {sourceCountries.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                            {sourceCountries.map(c => (
                                <span
                                    key={c}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 text-[10px] text-accent"
                                >
                                    {COUNTRY_FLAGS[c]} {c}
                                    <button onClick={() => toggleSourceCountry(c)} className="hover:text-white cursor-pointer">
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <button
                        onClick={() => setShowCountries(!showCountries)}
                        className="w-full px-2 py-1.5 rounded-md glass-subtle text-xs text-text-secondary text-left cursor-pointer hover:border-glass-border-hover transition-colors"
                    >
                        {sourceCountries.length === 0
                            ? t('simulate.selectCountries')
                            : `${sourceCountries.length} ${t('simulate.countriesSelected')}`}
                    </button>
                    {showCountries && (
                        <div className="mt-1 rounded-lg glass-subtle overflow-hidden">
                            <input
                                type="text"
                                placeholder={t('filters.countriesSearch')}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full px-2 py-1.5 bg-transparent text-xs text-text-primary border-b border-glass-border outline-none placeholder:text-text-muted"
                            />
                            <div className="max-h-32 overflow-y-auto py-1">
                                {filteredCountries.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => toggleSourceCountry(c)}
                                        className={`w-full flex items-center gap-2 px-2 py-1 text-xs cursor-pointer transition-colors ${
                                            sourceCountries.includes(c)
                                                ? 'text-accent bg-accent/5'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02]'
                                        }`}
                                    >
                                        <span>{COUNTRY_FLAGS[c]}</span>
                                        <span>{COUNTRY_NAMES[c] || c}</span>
                                        <span className="text-text-muted ml-auto">{c}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Manual mode */}
            {sourceMode === 'manual' && (
                <div>
                    {manualSources.length === 0 ? (
                        <p className="text-[11px] text-text-muted italic">
                            {t('simulate.clickToAddSources')}
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {manualSources.map(id => (
                                <span
                                    key={id}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 text-[10px] text-accent font-mono"
                                >
                                    {id}
                                    <button onClick={() => removeManualSource(id)} className="hover:text-white cursor-pointer">
                                        <X size={10} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
