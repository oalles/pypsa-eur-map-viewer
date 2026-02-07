import {ScatterplotLayer} from '@deck.gl/layers';
import type {Feature, LineString} from 'geojson';
import type {TransformerProperties} from '@/types';

interface Options {
    data: Feature<LineString, TransformerProperties>[];
    opacity: number;
}

export function createTransformersLayer({data, opacity}: Options) {
    return new ScatterplotLayer<Feature<LineString, TransformerProperties>>({
        id: 'transformers',
        data,
        getPosition: f => f.geometry.coordinates[0] as [number, number],
        getRadius: 1200,
        getFillColor: [0, 0, 0, 0],
        getLineColor: [255, 140, 0, Math.round(opacity * 255)],
        getLineWidth: 2,
        stroked: true,
        filled: false,
        lineWidthMinPixels: 1.5,
        radiusMinPixels: 3,
        radiusMaxPixels: 10,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 200, 100, 100],
        parameters: {depthWriteEnabled: false},
    });
}
