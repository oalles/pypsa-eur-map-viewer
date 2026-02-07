import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Search, MapPin, Cable, Zap, X} from 'lucide-react';
import useNetworkStore from '@/store/network';

export const SearchPalette: React.FC = () => {
    const {t} = useTranslation();
    const searchOpen = useNetworkStore(s => s.searchOpen);
    const setSearchOpen = useNetworkStore(s => s.setSearchOpen);
    const dataset = useNetworkStore(s => s.dataset);
    const flyTo = useNetworkStore(s => s.flyTo);
    const setSelected = useNetworkStore(s => s.setSelected);
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (!query || query.length < 2) return [];
        const q = query.toLowerCase();
        const items: {type: string; id: string; detail: string; feature: any; layerId: string}[] = [];

        if (dataset.buses) {
            for (const f of dataset.buses.features) {
                if (items.length >= 20) break;
                const id = f.properties.bus_id;
                if (id?.toLowerCase().includes(q) || f.properties.country?.toLowerCase().includes(q)) {
                    items.push({type: 'Bus', id, detail: `${f.properties.voltage} kV | ${f.properties.country}`, feature: f, layerId: 'buses'});
                }
            }
        }

        if (dataset.lines && items.length < 20) {
            for (const f of dataset.lines.features) {
                if (items.length >= 20) break;
                const id = f.properties.id;
                if (id?.toLowerCase().includes(q)) {
                    items.push({type: 'Line', id, detail: `${f.properties.voltage_nom} kV | ${f.properties.s_nom} MVA`, feature: f, layerId: 'ac-lines'});
                }
            }
        }

        if (dataset.links && items.length < 20) {
            for (const f of dataset.links.features) {
                if (items.length >= 20) break;
                const id = f.properties.id;
                if (id?.toLowerCase().includes(q)) {
                    items.push({type: 'HVDC', id, detail: `${f.properties.p_nom} MW`, feature: f, layerId: 'hvdc-links'});
                }
            }
        }

        return items;
    }, [query, dataset]);

    if (!searchOpen) return null;

    const handleSelect = (item: typeof results[0]) => {
        const geom = item.feature.geometry;
        let lon: number, lat: number;
        if (geom.type === 'Point') {
            [lon, lat] = geom.coordinates;
        } else {
            const coords = geom.coordinates;
            const mid = coords[Math.floor(coords.length / 2)];
            [lon, lat] = mid;
        }
        flyTo(lon, lat, 8);
        setSelected(item.feature, item.layerId);
        setSearchOpen(false);
        setQuery('');
    };

    const typeIcon = (type: string) => {
        if (type === 'Bus') return <MapPin size={12} className="text-accent" />;
        if (type === 'HVDC') return <Zap size={12} className="text-hvdc" />;
        return <Cable size={12} className="text-text-secondary" />;
    };

    return (
        <div className="absolute inset-0 z-50 flex items-start justify-center pt-24" onClick={() => {setSearchOpen(false); setQuery('');}}>
            <div className="glass w-[480px] max-w-[90vw] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-glass-border">
                    <Search size={16} className="text-text-muted" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder={t('app.search')}
                        className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                    />
                    <button onClick={() => {setSearchOpen(false); setQuery('');}} className="p-1 cursor-pointer text-text-muted hover:text-text-primary">
                        <X size={14} />
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="max-h-72 overflow-y-auto py-1">
                        {results.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleSelect(item)}
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer text-left"
                            >
                                {typeIcon(item.type)}
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-mono text-text-primary truncate">{item.id}</div>
                                    <div className="text-[10px] text-text-muted">{item.detail}</div>
                                </div>
                                <span className="text-[10px] text-text-muted">{item.type}</span>
                            </button>
                        ))}
                    </div>
                )}

                {query.length >= 2 && results.length === 0 && (
                    <div className="px-4 py-6 text-center text-xs text-text-muted">
                        No results found
                    </div>
                )}
            </div>
        </div>
    );
};
