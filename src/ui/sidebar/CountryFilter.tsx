import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {X} from 'lucide-react';
import useNetworkStore from '@/store/network';
import {COUNTRY_FLAGS, COUNTRY_NAMES} from '@/lib/constants';

export const CountryFilter: React.FC = () => {
    const {t} = useTranslation();
    const dataset = useNetworkStore(s => s.dataset);
    const selectedCountries = useNetworkStore(s => s.selectedCountries);
    const setSelectedCountries = useNetworkStore(s => s.setSelectedCountries);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const availableCountries = useMemo(() => {
        if (!dataset.buses) return [];
        const set = new Set<string>();
        for (const f of dataset.buses.features) {
            if (f.properties.country) set.add(f.properties.country);
        }
        return Array.from(set).sort();
    }, [dataset]);

    const filtered = useMemo(() => {
        if (!search) return availableCountries;
        const q = search.toLowerCase();
        return availableCountries.filter(c =>
            c.toLowerCase().includes(q) ||
            (COUNTRY_NAMES[c] || '').toLowerCase().includes(q)
        );
    }, [availableCountries, search]);

    const toggle = (code: string) => {
        if (selectedCountries.includes(code)) {
            setSelectedCountries(selectedCountries.filter(c => c !== code));
        } else {
            setSelectedCountries([...selectedCountries, code]);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                    {t('filters.countries')}
                </h3>
                {selectedCountries.length > 0 && (
                    <button
                        onClick={() => setSelectedCountries([])}
                        className="text-[10px] text-accent hover:text-accent/80 cursor-pointer"
                    >
                        {t('filters.countriesClear')}
                    </button>
                )}
            </div>

            {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {selectedCountries.map(c => (
                        <span
                            key={c}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 text-[10px] text-accent"
                        >
                            {COUNTRY_FLAGS[c]} {c}
                            <button onClick={() => toggle(c)} className="hover:text-white cursor-pointer">
                                <X size={10} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <button
                onClick={() => setOpen(!open)}
                className="w-full px-2 py-1.5 rounded-md glass-subtle text-xs text-text-secondary text-left cursor-pointer hover:border-glass-border-hover transition-colors"
            >
                {selectedCountries.length === 0
                    ? t('filters.countriesAll')
                    : `${selectedCountries.length} selected`}
            </button>

            {open && (
                <div className="mt-1 rounded-lg glass-subtle overflow-hidden">
                    <input
                        type="text"
                        placeholder={t('filters.countriesSearch')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full px-2 py-1.5 bg-transparent text-xs text-text-primary border-b border-glass-border outline-none placeholder:text-text-muted"
                    />
                    <div className="max-h-40 overflow-y-auto py-1">
                        {filtered.map(c => (
                            <button
                                key={c}
                                onClick={() => toggle(c)}
                                className={`w-full flex items-center gap-2 px-2 py-1 text-xs cursor-pointer transition-colors ${
                                    selectedCountries.includes(c)
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
    );
};
