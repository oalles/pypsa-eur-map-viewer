import {LineLayer, ScatterplotLayer} from '@deck.gl/layers';
import chroma from 'chroma-js';
import {Dataset, LineProperties, BusProperties, LinkProperties, ConverterProperties} from '../types';
import type {Feature} from 'geojson';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {TransformerProperties} from '../types';
import {CubeGeometry, CylinderGeometry, SphereGeometry} from '@luma.gl/engine';

export function layers(ds: Dataset, voltage: [number, number], showHVDC: boolean) {
    if (!ds) return [];
    const arr = [];
    const scale = chroma.scale('viridis' as any).domain([50, 750]);
    if (ds.lines) {
        arr.push(new LineLayer<Feature<GeoJSON.LineString, LineProperties>>({
            id: 'ac-lines',
            data: ds.lines.features
                .filter(f => {
                const v = Number(f.properties.voltage_nom);
                const inRange = !isNaN(v) && v >= voltage[0] && v <= voltage[1];
                if (!inRange) {
                    console.log('DEBUG line fuera de rango o voltage_nom inválido:', f.properties);
                }
                return inRange;
            }),
            getSourcePosition: f => {
                return new Float32Array(f.geometry.coordinates[0]);
            },
            getTargetPosition: f => {
                return new Float32Array(f.geometry.coordinates[f.geometry.coordinates.length - 1]);
            },
            getWidth: f => Math.max(1, (f.properties.s_nom || 1000) / 2000),
            getColor: f => scale(Number(f.properties.voltage_nom)).rgb(),
            pickable: true
        }));
    }
    if (showHVDC && ds.links) {
        arr.push(new LineLayer<Feature<GeoJSON.LineString, LinkProperties>>({
            id: 'hvdc',
            data: ds.links.features,
            getSourcePosition: f => new Float32Array(f.geometry.coordinates[0]),
            getTargetPosition: f => new Float32Array(f.geometry.coordinates[f.geometry.coordinates.length - 1]),
            getWidth: 2.2,
            getColor: [0, 255, 255],
            pickable: true
        }));
    }
    if (ds.buses) {
        arr.push(new ScatterplotLayer<Feature<GeoJSON.Point, BusProperties>>({
            id: 'buses',
            data: ds.buses.features,
            getPosition: f => new Float32Array(f.geometry.coordinates),
            getRadius: 1000,
            getFillColor: [200, 200, 200],
            pickable: true
        }));
    }
    if (ds.transformers) {
        arr.push(new SimpleMeshLayer<Feature<GeoJSON.LineString, TransformerProperties>>({
            id: 'transformers',
            data: ds.transformers.features,
            mesh: new CylinderGeometry(),
            getPosition: f => new Float32Array(f.geometry.coordinates[0]),
            getScale: f => [1800, 1800, 3000], // tamaño del cubo
            getColor: f => [255, 128, 0],
            getOrientation: () => [0, 0, 90],
            pickable: true
        }));
    }
    if (ds.converters) {
        arr.push(new SimpleMeshLayer<Feature<GeoJSON.LineString, ConverterProperties>>({
            id: 'converters',
            data: ds.converters.features,
            mesh: new SphereGeometry(),
            getPosition: f => new Float32Array(f.geometry.coordinates[0]),
            getScale: f => [4000, 4000, 4000],
            getColor: f => scale(Number(f.properties.voltage)).rgb(),
            getOrientation: () => [0, 0, 0],
            pickable: true
        }));
    }
    return arr;
}