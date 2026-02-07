import {ScatterplotLayer} from '@deck.gl/layers';
import type {Feature, LineString} from 'geojson';
import type {ConverterProperties} from '@/types';

interface Options {
    data: Feature<LineString, ConverterProperties>[];
    opacity: number;
}

export function createConvertersLayer({data, opacity}: Options) {
    return new ScatterplotLayer<Feature<LineString, ConverterProperties>>({
        id: 'converters',
        data,
        getPosition: f => f.geometry.coordinates[0] as [number, number],
        getRadius: 1500,
        getFillColor: [192, 132, 252, Math.round(opacity * 220)],
        radiusMinPixels: 4,
        radiusMaxPixels: 10,
        pickable: true,
        autoHighlight: true,
        highlightColor: [220, 180, 255, 100],
        parameters: {depthWriteEnabled: false},
    });
}
