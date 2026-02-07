import {ScatterplotLayer} from '@deck.gl/layers';
import type {Feature, Point} from 'geojson';
import type {BusProperties} from '@/types';

interface Options {
    data: Feature<Point, BusProperties>[];
    colorScale: (v: number) => {rgb: () => [number, number, number]};
    opacity: number;
}

export function createBusesLayer({data, colorScale, opacity}: Options) {
    return new ScatterplotLayer<Feature<Point, BusProperties>>({
        id: 'buses',
        data,
        getPosition: f => f.geometry.coordinates as [number, number],
        getRadius: f => Math.max(600, f.properties.voltage / 0.5),
        getFillColor: f => {
            const rgb = colorScale(f.properties.voltage).rgb();
            return [rgb[0], rgb[1], rgb[2], Math.round(opacity * 200)] as [number, number, number, number];
        },
        radiusMinPixels: 2,
        radiusMaxPixels: 8,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 100],
        parameters: {depthWriteEnabled: false},
    });
}
