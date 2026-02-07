import {PathLayer} from '@deck.gl/layers';
import type {Feature, LineString} from 'geojson';
import type {LinkProperties} from '@/types';

interface Options {
    data: Feature<LineString, LinkProperties>[];
    opacity: number;
}

export function createHVDCLinksLayer({data, opacity}: Options) {
    return new PathLayer<Feature<LineString, LinkProperties>>({
        id: 'hvdc-links',
        data,
        getPath: f => f.geometry.coordinates as [number, number][],
        getWidth: f => Math.max(2, (f.properties.p_nom || 500) / 500),
        getColor: [0, 229, 255, Math.round(opacity * 255)],
        widthMinPixels: 2,
        widthMaxPixels: 6,
        capRounded: true,
        jointRounded: true,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
        parameters: {depthWriteEnabled: false},
    });
}
