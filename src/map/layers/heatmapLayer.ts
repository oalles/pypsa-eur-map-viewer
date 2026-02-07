import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import type {Feature, Point} from 'geojson';
import type {BusProperties} from '@/types';

interface Options {
    data: Feature<Point, BusProperties>[];
}

export function createHeatmapLayer({data}: Options) {
    return new HeatmapLayer<Feature<Point, BusProperties>>({
        id: 'heatmap',
        data,
        getPosition: f => f.geometry.coordinates as [number, number],
        getWeight: 1,
        radiusPixels: 40,
        intensity: 1,
        threshold: 0.05,
        colorRange: [
            [1, 152, 189, 0],
            [73, 227, 206, 60],
            [216, 254, 181, 120],
            [254, 237, 177, 180],
            [254, 173, 84, 220],
            [209, 55, 78, 255],
        ],
        parameters: {depthWriteEnabled: false},
    });
}
