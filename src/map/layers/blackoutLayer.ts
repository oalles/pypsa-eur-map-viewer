import {ScatterplotLayer, PathLayer} from '@deck.gl/layers';
import type {Dataset} from '@/types';
import type {SimulationResults} from '@/workers/api';

interface BlackoutLayerOptions {
    dataset: Dataset;
    results: SimulationResults;
    opacity: number;
}

export function createBlackoutLayers({dataset, results, opacity}: BlackoutLayerOptions) {
    const layers: any[] = [];
    const blackoutBusSet = new Set(results.blackoutBuses);
    const blackoutEdgeSet = new Set(results.blackoutEdges);
    const energizedBusSet = new Set(results.energizedBuses);
    const energizedEdgeSet = new Set(results.energizedEdges);

    // Blackout buses — dimmed
    if (dataset.buses) {
        const blackoutBuses = dataset.buses.features.filter(
            f => blackoutBusSet.has(f.properties.bus_id)
        );
        if (blackoutBuses.length > 0) {
            layers.push(new ScatterplotLayer({
                id: 'blackout-buses',
                data: blackoutBuses,
                getPosition: (d: any) => d.geometry.coordinates,
                getRadius: 3000,
                getFillColor: [80, 80, 100, 40],
                radiusMinPixels: 2,
                radiusMaxPixels: 8,
                parameters: {depthWriteEnabled: false},
                pickable: false,
            }));
        }

        // Energized buses — bright glow
        const energizedBusFeatured = dataset.buses.features.filter(
            f => energizedBusSet.has(f.properties.bus_id)
        );
        if (energizedBusFeatured.length > 0) {
            layers.push(new ScatterplotLayer({
                id: 'energized-buses',
                data: energizedBusFeatured,
                getPosition: (d: any) => d.geometry.coordinates,
                getRadius: 4000,
                getFillColor: [56, 189, 248, Math.round(opacity * 255)],
                radiusMinPixels: 3,
                radiusMaxPixels: 10,
                parameters: {depthWriteEnabled: false},
                pickable: false,
            }));
        }
    }

    // Blackout lines — dimmed
    const allEdgeFeatures = [
        ...(dataset.lines?.features || []).map(f => ({feature: f, edgeId: `line:${f.properties.id}`})),
        ...(dataset.links?.features || []).map(f => ({feature: f, edgeId: `link:${f.properties.id}`})),
    ];

    const blackoutEdges = allEdgeFeatures.filter(e => blackoutEdgeSet.has(e.edgeId));
    const energizedEdges = allEdgeFeatures.filter(e => energizedEdgeSet.has(e.edgeId));

    if (blackoutEdges.length > 0) {
        layers.push(new PathLayer({
            id: 'blackout-lines',
            data: blackoutEdges,
            getPath: (d: any) => d.feature.geometry.coordinates,
            getColor: [80, 80, 100, 40],
            getWidth: 800,
            widthMinPixels: 1,
            widthMaxPixels: 3,
            capRounded: true,
            jointRounded: true,
            parameters: {depthWriteEnabled: false},
            pickable: false,
        }));
    }

    if (energizedEdges.length > 0) {
        layers.push(new PathLayer({
            id: 'energized-lines',
            data: energizedEdges,
            getPath: (d: any) => d.feature.geometry.coordinates,
            getColor: [56, 189, 248, Math.round(opacity * 0.9 * 255)],
            getWidth: 1200,
            widthMinPixels: 1.5,
            widthMaxPixels: 5,
            capRounded: true,
            jointRounded: true,
            parameters: {depthWriteEnabled: false},
            pickable: false,
        }));
    }

    return layers;
}
