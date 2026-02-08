import {useEffect} from 'react';
import Papa from 'papaparse';
import {Dataset} from '../types';
import useNetworkStore from '../store/network';
import {buildGraphIndex} from '@/lib/graph';

const BASE = import.meta.env.BASE_URL + 'data/';
const FILES = {
    buses: 'buses.csv',
    lines: 'lines.csv',
    links: 'links.csv',
    converters: 'converters.csv',
    transformers: 'transformers.csv',
};

function parseWKT(wkt: string): number[] | number[][] {
    if (!wkt) return [];
    wkt = wkt.trim().replace(/^'+|'+$/g, '');
    const match = wkt.match(/\(([\s\S]*)\)/);
    if (!match) return [];
    const coordsStr = match[1];
    if (wkt.startsWith('POINT')) {
        return coordsStr.split(' ').map(Number);
    }
    if (wkt.startsWith('LINESTRING')) {
        return coordsStr.split(',').map(pair => pair.trim().split(' ').map(Number));
    }
    return [];
}

function toBool(v: any): boolean {
    return v === 't' || v === true || v === 'true';
}

export function useDataset() {
    const setDataset = useNetworkStore(s => s.setDataset);
    const setGraphIndex = useNetworkStore(s => s.setGraphIndex);
    useEffect(() => {
        (async () => {
            const data: Record<string, any[]> = {};
            for (const k in FILES) {
                const res = await fetch(BASE + FILES[k as keyof typeof FILES]);
                const txt = await res.text();
                data[k] = Papa.parse(txt, {header: true, dynamicTyping: true}).data;
            }

            const ds: Dataset = {};

            ds.buses = {
                type: 'FeatureCollection',
                features: data.buses.filter((r: any) => r.x && r.y).map((r: any) => ({
                    type: 'Feature' as const,
                    geometry: {type: 'Point' as const, coordinates: [Number(r.x), Number(r.y)]},
                    properties: {
                        bus_id: r.bus_id,
                        voltage: Number(r.voltage),
                        dc: toBool(r.dc),
                        symbol: r.symbol || '',
                        under_construction: toBool(r.under_construction),
                        tags: r.tags || '',
                        x: Number(r.x),
                        y: Number(r.y),
                        country: r.country || '',
                        geometry: r.geometry || '',
                    },
                })),
            };

            ds.lines = {
                type: 'FeatureCollection',
                features: data.lines
                    .filter((r: any) => r.geometry)
                    .map((r: any) => ({
                        type: 'Feature' as const,
                        geometry: {
                            type: 'LineString' as const,
                            coordinates: parseWKT((r.geometry || '').trim()) as number[][],
                        },
                        properties: {
                            id: r.line_id || '',
                            voltage_nom: Number(r.voltage) || 0,
                            length: Number(r.length) || 0,
                            s_nom: Number(r.s_nom) || 0,
                            i_nom: Number(r.i_nom) || 0,
                            circuits: Number(r.circuits) || 0,
                            r: Number(r.r) || 0,
                            x: Number(r.x) || 0,
                            b: Number(r.b) || 0,
                            underground: toBool(r.underground),
                            under_construction: toBool(r.under_construction),
                            type: r.type || '',
                            tags: r.tags || '',
                            bus0: r.bus0 || '',
                            bus1: r.bus1 || '',
                        },
                    })),
            };

            ds.links = {
                type: 'FeatureCollection',
                features: data.links
                    .filter((r: any) => r.geometry)
                    .map((r: any) => ({
                        type: 'Feature' as const,
                        geometry: {
                            type: 'LineString' as const,
                            coordinates: parseWKT((r.geometry || '').trim()) as number[][],
                        },
                        properties: {
                            id: r.link_id || r.name || '',
                            p_nom: Number(r.p_nom) || 0,
                            efficiency: Number(r.efficiency) || 0,
                            voltage: Number(r.voltage) || 0,
                            length: Number(r.length) || 0,
                            underground: toBool(r.underground),
                            under_construction: toBool(r.under_construction),
                            tags: r.tags || '',
                            bus0: r.bus0 || '',
                            bus1: r.bus1 || '',
                        },
                    })),
            };

            ds.transformers = {
                type: 'FeatureCollection',
                features: data.transformers
                    .filter((r: any) => r.geometry)
                    .map((r: any) => ({
                        type: 'Feature' as const,
                        geometry: {
                            type: 'LineString' as const,
                            coordinates: parseWKT((r.geometry || '').trim()) as number[][],
                        },
                        properties: {
                            transformer_id: r.transformer_id || '',
                            bus0: r.bus0 || '',
                            bus1: r.bus1 || '',
                            voltage_bus0: Number(r.voltage_bus0) || 0,
                            voltage_bus1: Number(r.voltage_bus1) || 0,
                            s_nom: Number(r.s_nom) || 0,
                        },
                    })),
            };

            ds.converters = {
                type: 'FeatureCollection',
                features: data.converters
                    .filter((r: any) => r.geometry)
                    .map((r: any) => ({
                        type: 'Feature' as const,
                        geometry: {
                            type: 'LineString' as const,
                            coordinates: parseWKT((r.geometry || '').trim()) as number[][],
                        },
                        properties: {
                            converter_id: r.converter_id || '',
                            bus0: r.bus0 || '',
                            bus1: r.bus1 || '',
                            voltage: Number(r.voltage) || 0,
                            p_nom: Number(r.p_nom) || 0,
                        },
                    })),
            };

            setDataset(ds);

            // Build graph index for simulation
            const graphIndex = buildGraphIndex(ds);
            setGraphIndex(graphIndex);
            console.log(`[Graph] Built index: ${graphIndex.busCount} buses, ${graphIndex.edgeCount} edges`);
        })();
    }, [setDataset, setGraphIndex]);
}
