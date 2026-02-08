import chroma from 'chroma-js';
import type {Dataset} from '@/types';
import type {AppMode} from '@/router';
import type {SimulationResults} from '@/workers/api';
import type {FaultEntry} from '@/store/simulation';
import {createACLinesLayer} from './acLinesLayer';
import {createHVDCLinksLayer} from './hvdcLinksLayer';
import {createBusesLayer} from './busesLayer';
import {createTransformersLayer} from './transformersLayer';
import {createConvertersLayer} from './convertersLayer';
import {createHeatmapLayer} from './heatmapLayer';
import {createBlackoutLayers} from './blackoutLayer';
import {createFaultLayers} from './faultLayer';

const COLOR_SCHEME = 'YlGnBu';

interface LayerOptions {
    showACLines: boolean;
    showHVDC: boolean;
    showBuses: boolean;
    showTransformers: boolean;
    showConverters: boolean;
    showHeatmap: boolean;
    lineThicknessMode: 'capacity' | 'uniform';
    layerOpacity: number;
    // Simulation mode
    mode?: AppMode;
    simulationResults?: SimulationResults | null;
    faults?: FaultEntry[];
    time?: number;
}

export function buildLayers(ds: Dataset, opts: LayerOptions) {
    const layers: any[] = [];
    const scale = chroma.scale(COLOR_SCHEME).domain([50, 750]);

    const isSimulating = opts.mode === 'simulate' && opts.simulationResults;
    // When simulation has results, dim the base layers
    const baseOpacity = isSimulating ? 0.15 : opts.layerOpacity;

    if (opts.showHeatmap && ds.buses && !isSimulating) {
        layers.push(createHeatmapLayer({data: ds.buses.features}));
    }

    if (opts.showACLines && ds.lines) {
        layers.push(createACLinesLayer({
            data: ds.lines.features,
            colorScale: scale,
            thicknessMode: opts.lineThicknessMode,
            opacity: baseOpacity,
        }));
    }

    if (opts.showHVDC && ds.links) {
        layers.push(createHVDCLinksLayer({
            data: ds.links.features,
            opacity: baseOpacity,
        }));
    }

    if (opts.showBuses && ds.buses) {
        layers.push(createBusesLayer({
            data: ds.buses.features,
            colorScale: scale,
            opacity: baseOpacity,
        }));
    }

    if (opts.showTransformers && ds.transformers) {
        layers.push(createTransformersLayer({
            data: ds.transformers.features,
            opacity: baseOpacity,
        }));
    }

    if (opts.showConverters && ds.converters) {
        layers.push(createConvertersLayer({
            data: ds.converters.features,
            opacity: baseOpacity,
        }));
    }

    // Simulation overlays
    if (opts.mode === 'simulate' && opts.simulationResults) {
        layers.push(
            ...createBlackoutLayers({
                dataset: ds,
                results: opts.simulationResults,
                opacity: opts.layerOpacity,
            }),
        );
    }

    if (opts.mode === 'simulate' && opts.faults && opts.faults.length > 0) {
        layers.push(
            ...createFaultLayers({
                dataset: ds,
                faults: opts.faults,
                time: opts.time || 0,
            }),
        );
    }

    return layers;
}
