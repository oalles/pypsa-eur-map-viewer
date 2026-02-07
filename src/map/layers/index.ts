import chroma from 'chroma-js';
import type {Dataset} from '@/types';
import {createACLinesLayer} from './acLinesLayer';
import {createHVDCLinksLayer} from './hvdcLinksLayer';
import {createBusesLayer} from './busesLayer';
import {createTransformersLayer} from './transformersLayer';
import {createConvertersLayer} from './convertersLayer';
import {createHeatmapLayer} from './heatmapLayer';

interface LayerOptions {
    showACLines: boolean;
    showHVDC: boolean;
    showBuses: boolean;
    showTransformers: boolean;
    showConverters: boolean;
    showHeatmap: boolean;
    colorScheme: string;
    lineThicknessMode: 'capacity' | 'uniform';
    layerOpacity: number;
}

export function buildLayers(ds: Dataset, opts: LayerOptions) {
    const layers: any[] = [];
    const scale = chroma.scale(opts.colorScheme as any).domain([50, 750]);

    if (opts.showHeatmap && ds.buses) {
        layers.push(createHeatmapLayer({data: ds.buses.features}));
    }

    if (opts.showACLines && ds.lines) {
        layers.push(createACLinesLayer({
            data: ds.lines.features,
            colorScale: scale,
            thicknessMode: opts.lineThicknessMode,
            opacity: opts.layerOpacity,
        }));
    }

    if (opts.showHVDC && ds.links) {
        layers.push(createHVDCLinksLayer({
            data: ds.links.features,
            opacity: opts.layerOpacity,
        }));
    }

    if (opts.showBuses && ds.buses) {
        layers.push(createBusesLayer({
            data: ds.buses.features,
            colorScale: scale,
            opacity: opts.layerOpacity,
        }));
    }

    if (opts.showTransformers && ds.transformers) {
        layers.push(createTransformersLayer({
            data: ds.transformers.features,
            opacity: opts.layerOpacity,
        }));
    }

    if (opts.showConverters && ds.converters) {
        layers.push(createConvertersLayer({
            data: ds.converters.features,
            opacity: opts.layerOpacity,
        }));
    }

    return layers;
}
