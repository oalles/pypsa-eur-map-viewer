import {PathLayer} from '@deck.gl/layers';
import type {Feature, LineString} from 'geojson';
import type {LineProperties} from '@/types';

interface Options {
    data: Feature<LineString, LineProperties>[];
    colorScale: (v: number) => {rgb: () => [number, number, number]};
    thicknessMode: 'capacity' | 'uniform';
    opacity: number;
}

export function createACLinesLayer({data, colorScale, thicknessMode, opacity}: Options) {
    return new PathLayer<Feature<LineString, LineProperties>>({
        id: 'ac-lines',
        data,
        getPath: f => f.geometry.coordinates as [number, number][],
        getWidth: f => thicknessMode === 'capacity'
            ? Math.max(1, (f.properties.s_nom || 1000) / 2000)
            : 1.5,
        getColor: f => {
            const rgb = colorScale(f.properties.voltage_nom).rgb();
            return [rgb[0], rgb[1], rgb[2], Math.round(opacity * 255)] as [number, number, number, number];
        },
        widthMinPixels: 1,
        widthMaxPixels: 8,
        capRounded: true,
        jointRounded: true,
        pickable: true,
        autoHighlight: true,
        highlightColor: [255, 255, 255, 80],
        parameters: {depthWriteEnabled: false},
    });
}
