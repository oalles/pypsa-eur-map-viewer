import {useEffect} from 'react';
import Papa from 'papaparse';
import {Dataset} from '../types';
import useNetworkStore from "../store/network";

const BASE = '/pypsa-eur-map-viewer/data/';
const FILES = {buses: 'buses.csv', lines: 'lines.csv', links: 'links.csv', converters: 'converters.csv', transformers: 'transformers.csv'};

function parseWKT(wkt: string): any {
    if (!wkt) return [];
    wkt = wkt.trim().replace(/^'+|'+$/g, ''); // quita comillas simples al inicio/fin
    const match = wkt.match(/\(([\s\S]*)\)/); // greedy, soporta saltos de línea
    if (!match) {
        console.log('DEBUG parseWKT: no match para paréntesis en', wkt);
        return [];
    }
    const coordsStr = match[1];
    if (wkt.startsWith('POINT')) {
        return coordsStr.split(' ').map(Number);
    }
    if (wkt.startsWith('LINESTRING')) {
        return coordsStr.split(',').map(pair => pair.trim().split(' ').map(Number));
    }
    return [];
}

export function useDataset() {
    const setDataset = useNetworkStore(s => s.setDataset);
    useEffect(() => {
        (async () => {
            const data: any = {} as Record<string, any>;
            for (const k in FILES) {
                const res = await fetch(BASE + FILES[k as keyof typeof FILES]);
                const txt = await res.text();
                data[k] = Papa.parse(txt, {header: true, dynamicTyping: true}).data;
            }
            const ds: Dataset = {};
            ds.buses = {
                type: 'FeatureCollection',
                features: data.buses.filter((r: any) => r.x && r.y).map((r: any) => ({
                    type: 'Feature',
                    geometry: {type: 'Point', coordinates: [r.x, r.y]},
                    properties: {
                        bus_id: r.bus_id,
                        voltage: Number(r.voltage),
                        dc: r.dc === 't',
                        symbol: r.symbol,
                        under_construction: r.under_construction === 't',
                        tags: r.tags,
                        x: Number(r.x),
                        y: Number(r.y),
                        country: r.country,
                        geometry: r.geometry
                    }
                }))
            };
            ds.lines = {
                type: 'FeatureCollection', features: data.lines
                    // .slice(0, 1000)
                    .map((r: any, idx: number) => {
                    let geom = (r.geometry || '').trim();
                    // if (idx < 5) {
                    //     console.log('DEBUG geometry raw:', r.geometry);
                    //     console.log('DEBUG geometry cleaned:', geom);
                    //     console.log('DEBUG geometry parsed:', parseWKT(geom));
                    // }
                    return {
                        type: 'Feature',
                        geometry: {type: 'LineString', coordinates: parseWKT(geom)},
                        properties: {
                            id: r.line_id,
                            voltage_nom: Number(r.voltage),
                            length: r.length,
                            s_nom: r.s_nom,
                            description: r.type || '',
                            ...r // incluir todas las propiedades originales por si acaso
                        }
                    }
                })
            };
            ds.links = {
                type: 'FeatureCollection', features: data.links.map((r: any) => ({
                    type: 'Feature', geometry: {type: 'LineString', coordinates: parseWKT(r.geometry || '')},
                    properties: {id: r.name, p_nom: r.p_nom, efficiency: r.efficiency}
                }))
            };
            ds.transformers = {
                type: 'FeatureCollection',
                features: data.transformers.map((r: any) => ({
                    type: 'Feature',
                    geometry: {type: 'LineString', coordinates: parseWKT(r.geometry || '')},
                    properties: {
                        transformer_id: r.transformer_id,
                        bus0: r.bus0,
                        bus1: r.bus1,
                        voltage_bus0: Number(r.voltage_bus0),
                        voltage_bus1: Number(r.voltage_bus1),
                        s_nom: Number(r.s_nom)
                    }
                }))
            };
            ds.converters = {
                type: 'FeatureCollection',
                features: data.converters.map((r: any) => ({
                    type: 'Feature',
                    geometry: {type: 'LineString', coordinates: parseWKT(r.geometry || '')},
                    properties: {
                        converter_id: r.converter_id,
                        bus0: r.bus0,
                        bus1: r.bus1,
                        voltage: Number(r.voltage),
                        p_nom: Number(r.p_nom)
                    }
                }))
            };
            setDataset(ds);
        })();
    }, [setDataset]);
}