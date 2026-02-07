import {useMemo} from 'react';
import useNetworkStore from '../store/network';
import type {Dataset} from '../types';

export function useFilteredData(): Dataset {
    const dataset = useNetworkStore(s => s.dataset);
    const voltage = useNetworkStore(s => s.voltage);
    const selectedCountries = useNetworkStore(s => s.selectedCountries);
    const underConstructionFilter = useNetworkStore(s => s.underConstructionFilter);

    return useMemo(() => {
        if (!dataset.buses) return dataset;

        const countrySet = selectedCountries.length > 0 ? new Set(selectedCountries) : null;

        const matchesCountry = (country: string | undefined) =>
            !countrySet || (country ? countrySet.has(country) : true);

        const matchesConstruction = (underConstruction: boolean) => {
            if (underConstructionFilter === 'all') return true;
            if (underConstructionFilter === 'operational') return !underConstruction;
            return underConstruction;
        };

        const matchesVoltage = (v: number) =>
            !isNaN(v) && v >= voltage[0] && v <= voltage[1];

        // Build a set of bus countries for filtering lines/links
        const busCountryMap = new Map<string, string>();
        if (dataset.buses) {
            for (const f of dataset.buses.features) {
                if (f.properties.country) {
                    busCountryMap.set(f.properties.bus_id, f.properties.country);
                }
            }
        }

        const getBusCountry = (busId: string) => busCountryMap.get(busId) || '';

        const filtered: Dataset = {};

        if (dataset.buses) {
            filtered.buses = {
                type: 'FeatureCollection',
                features: dataset.buses.features.filter(f => {
                    const p = f.properties;
                    return matchesVoltage(p.voltage) &&
                        matchesCountry(p.country) &&
                        matchesConstruction(p.under_construction);
                }),
            };
        }

        if (dataset.lines) {
            filtered.lines = {
                type: 'FeatureCollection',
                features: dataset.lines.features.filter(f => {
                    const p = f.properties;
                    if (!matchesVoltage(p.voltage_nom)) return false;
                    if (!matchesConstruction(p.under_construction)) return false;
                    if (countrySet) {
                        const c0 = getBusCountry(p.bus0);
                        const c1 = getBusCountry(p.bus1);
                        if (!matchesCountry(c0) && !matchesCountry(c1)) return false;
                    }
                    return true;
                }),
            };
        }

        if (dataset.links) {
            filtered.links = {
                type: 'FeatureCollection',
                features: dataset.links.features.filter(f => {
                    const p = f.properties;
                    if (!matchesConstruction(p.under_construction)) return false;
                    if (countrySet) {
                        const c0 = getBusCountry(p.bus0);
                        const c1 = getBusCountry(p.bus1);
                        if (!matchesCountry(c0) && !matchesCountry(c1)) return false;
                    }
                    return true;
                }),
            };
        }

        if (dataset.transformers) {
            filtered.transformers = {
                type: 'FeatureCollection',
                features: dataset.transformers.features.filter(f => {
                    if (countrySet) {
                        const c0 = getBusCountry(f.properties.bus0);
                        const c1 = getBusCountry(f.properties.bus1);
                        if (!matchesCountry(c0) && !matchesCountry(c1)) return false;
                    }
                    return true;
                }),
            };
        }

        if (dataset.converters) {
            filtered.converters = {
                type: 'FeatureCollection',
                features: dataset.converters.features.filter(f => {
                    if (countrySet) {
                        const c0 = getBusCountry(f.properties.bus0);
                        const c1 = getBusCountry(f.properties.bus1);
                        if (!matchesCountry(c0) && !matchesCountry(c1)) return false;
                    }
                    return true;
                }),
            };
        }

        return filtered;
    }, [dataset, voltage, selectedCountries, underConstructionFilter]);
}
