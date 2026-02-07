import {useMemo} from 'react';
import type {Dataset} from '../types';

export interface NetworkStats {
    busCount: number;
    lineCount: number;
    linkCount: number;
    transformerCount: number;
    converterCount: number;
    countries: string[];
    totalLineLengthKm: number;
    totalACCapacityMVA: number;
    totalHVDCCapacityMW: number;
    voltageDistribution: {voltage: number; count: number}[];
    busesByCountry: {country: string; count: number}[];
}

export function useNetworkStats(data: Dataset): NetworkStats {
    return useMemo(() => {
        const buses = data.buses?.features ?? [];
        const lines = data.lines?.features ?? [];
        const links = data.links?.features ?? [];
        const transformers = data.transformers?.features ?? [];
        const converters = data.converters?.features ?? [];

        const countrySet = new Set<string>();
        const countryCount: Record<string, number> = {};
        const voltageCount: Record<number, number> = {};

        for (const b of buses) {
            const c = b.properties.country;
            if (c) {
                countrySet.add(c);
                countryCount[c] = (countryCount[c] || 0) + 1;
            }
            const v = b.properties.voltage;
            if (v) {
                const bucket = Math.round(v / 50) * 50;
                voltageCount[bucket] = (voltageCount[bucket] || 0) + 1;
            }
        }

        let totalLineLengthKm = 0;
        let totalACCapacityMVA = 0;
        for (const l of lines) {
            totalLineLengthKm += (l.properties.length || 0) / 1000;
            totalACCapacityMVA += l.properties.s_nom || 0;
        }

        let totalHVDCCapacityMW = 0;
        for (const l of links) {
            totalHVDCCapacityMW += l.properties.p_nom || 0;
        }

        const voltageDistribution = Object.entries(voltageCount)
            .map(([v, count]) => ({voltage: Number(v), count}))
            .sort((a, b) => a.voltage - b.voltage);

        const busesByCountry = Object.entries(countryCount)
            .map(([country, count]) => ({country, count}))
            .sort((a, b) => b.count - a.count);

        return {
            busCount: buses.length,
            lineCount: lines.length,
            linkCount: links.length,
            transformerCount: transformers.length,
            converterCount: converters.length,
            countries: Array.from(countrySet).sort(),
            totalLineLengthKm,
            totalACCapacityMVA,
            totalHVDCCapacityMW,
            voltageDistribution,
            busesByCountry,
        };
    }, [data]);
}
